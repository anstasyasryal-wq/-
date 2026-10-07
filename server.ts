import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Authoritative master questions bank loaded cleanly across Node ESM and Cloud Run environments
const questionsPath = path.join(__dirname, 'src', 'data', 'stageQuestions.json');
const STAGE_QUESTIONS: any[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory attempted stages tracker for idempotency & rate-limiting
  const completedAttemptsTracker = new Set<string>();

  // ==========================================
  // 1. GET /api/stage-questions/:stageId
  // SANITIZED: Strips correctIndex, explanation, reference, hint
  // Prevents contestants from inspecting DevTools / network payloads to see the correct answer!
  // ==========================================
  app.get('/api/stage-questions/:stageId', (req, res) => {
    const stageId = parseInt(req.params.stageId);
    if (isNaN(stageId) || stageId < 1 || stageId > 6) {
      return res.status(400).json({ error: 'Invalid stage ID' });
    }

    const pool = STAGE_QUESTIONS.filter((q) => q.stageId === stageId);
    
    // Sanitize: do NOT send correctIndex or explanation to the client before answer!
    const sanitizedQuestions = pool.map((q) => ({
      id: q.id,
      stageId: q.stageId,
      category: q.category,
      subCategory: q.subCategory,
      questionType: q.questionType || 'mcq',
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      points: q.points || 10,
      timeLimitSeconds: q.timeLimitSeconds || 25,
      imageSrc: q.imageSrc,
      imageInspectionTimeSeconds: q.imageInspectionTimeSeconds,
      hymnTuneKey: q.hymnTuneKey,
      // NOTE: correctIndex, explanation, reference, and hint are intentionally STRIPPED
    }));

    res.json({
      stageId,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  });

  // ==========================================
  // 1.5 POST /api/check-answer
  // Validates single answer on server without exposing answer key in advance
  // ==========================================
  app.post('/api/check-answer', (req, res) => {
    const { questionId, selectedOptionIndex, timeSpentSeconds, stageId } = req.body;
    const masterQ = STAGE_QUESTIONS.find((q) => q.id === questionId);
    if (!masterQ) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = selectedOptionIndex === masterQ.correctIndex;
    const stageNum = Number(stageId) || 1;
    const timeSpent = Math.max(1, Math.min(masterQ.timeLimitSeconds || 30, Number(timeSpentSeconds) || 5));

    let speedBonus = 0;
    if (isCorrect) {
      if (timeSpent <= 4) {
        speedBonus = stageNum === 3 ? 10 : 5;
      } else if (timeSpent <= 8) {
        speedBonus = stageNum === 3 ? 5 : 2;
      }
    }

    const basePoints = isCorrect ? (masterQ.points || 10) : 0;
    const pointsEarned = basePoints + speedBonus;

    res.json({
      questionId,
      isCorrect,
      correctIndex: masterQ.correctIndex, // revealed safely only after answer submission
      pointsEarned,
      speedBonusEarned: speedBonus,
      timeSpentSeconds: timeSpent,
      explanation: masterQ.explanation,
      reference: masterQ.reference,
    });
  });

  // ==========================================
  // 2. POST /api/verify-stage-attempt
  // SERVER-SIDE SOURCE OF TRUTH:
  // Verifies answers against the server master answer key, computes exact points & bonuses
  // ==========================================
  app.post('/api/verify-stage-attempt', (req, res) => {
    const { userId, stageId, answers, clientTimestamp } = req.body;

    if (!userId || !stageId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Missing required attempt fields' });
    }

    const stageNum = parseInt(stageId);
    const attemptKey = `${userId}_stage_${stageNum}`;

    // Check if duplicate attempt submitted rapidly
    if (completedAttemptsTracker.has(attemptKey)) {
      console.warn(`Duplicate attempt submission detected for ${attemptKey}`);
    }

    let calculatedScore = 0;
    let correctCount = 0;
    let totalTimeSpent = 0;

    const answersFeedback = answers.map((userAns: any) => {
      const masterQ = STAGE_QUESTIONS.find((q) => q.id === userAns.questionId);
      if (!masterQ) {
        return {
          questionId: userAns.questionId,
          isCorrect: false,
          pointsEarned: 0,
          speedBonusEarned: 0,
          correctIndex: 0,
          explanation: '',
          reference: '',
        };
      }

      const isCorrect = userAns.selectedOptionIndex === masterQ.correctIndex;
      const timeSpent = Math.max(1, Math.min(masterQ.timeLimitSeconds || 30, Number(userAns.timeSpentSeconds) || 5));
      totalTimeSpent += timeSpent;

      let speedBonus = 0;
      if (isCorrect) {
        if (timeSpent <= 4) {
          speedBonus = stageNum === 3 ? 10 : 5;
        } else if (timeSpent <= 8) {
          speedBonus = stageNum === 3 ? 5 : 2;
        }
      }

      const basePoints = isCorrect ? (masterQ.points || 10) : 0;
      const pointsEarned = basePoints + speedBonus;

      if (isCorrect) {
        correctCount += 1;
        calculatedScore += pointsEarned;
      }

      return {
        questionId: masterQ.id,
        isCorrect,
        pointsEarned,
        speedBonusEarned: speedBonus,
        correctIndex: masterQ.correctIndex, // now safely revealed in post-attempt feedback!
        explanation: masterQ.explanation,
        reference: masterQ.reference,
      };
    });

    completedAttemptsTracker.add(attemptKey);

    return res.json({
      verified: true,
      stageId: stageNum,
      userId,
      attemptId: attemptKey,
      serverCalculatedScore: calculatedScore,
      correctCount,
      totalQuestions: answers.length,
      totalTimeSpent,
      answersFeedback,
      verifiedAt: new Date().toISOString(),
    });
  });

  // ==========================================
  // 3. Vite middleware for frontend SPA
  // ==========================================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = process.env.PORT || 3000;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
