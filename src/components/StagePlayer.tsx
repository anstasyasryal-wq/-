import React, { useState, useEffect } from 'react';
import { User, Question, MatchingPair } from '../types';
import { getStoredQuestions, getStoredStages, saveUserToRegistry } from '../utils/competitionEngine';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Dna,
  Landmark,
  Cross,
  Check,
  Link,
  Flame,
} from 'lucide-react';

interface StagePlayerProps {
  stageId: number;
  currentUser: User;
  onFinishStage: (nextStageId?: number) => void;
  onBackToHome: () => void;
  onOpenLeaderboard: () => void;
}

export const StagePlayer: React.FC<StagePlayerProps> = ({
  stageId,
  currentUser,
  onFinishStage,
  onBackToHome,
  onOpenLeaderboard,
}) => {
  const allStages = getStoredStages();
  const currentStage = allStages.find((s) => s.id === stageId) || allStages[0];
  const allQuestions = getStoredQuestions();

  const stageQuestions = allQuestions.filter((q) =>
    currentStage.questionIds.includes(q.id)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMC, setSelectedMC] = useState<number | null>(null);
  const [selectedTF, setSelectedTF] = useState<number | null>(null);

  // Matching question state
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [selectedLeftItem, setSelectedLeftItem] = useState<string | null>(null);

  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(currentStage.timeLimitSec);
  const [isStageCompleted, setIsStageCompleted] = useState(false);

  const currentQ: Question = stageQuestions[currentIndex] || stageQuestions[0];

  // Timer
  useEffect(() => {
    if (isStageCompleted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishAttempt();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isStageCompleted]);

  // Reset answer states on question change
  useEffect(() => {
    setSelectedMC(null);
    setSelectedTF(null);
    setMatchingSelections({});
    setSelectedLeftItem(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentIndex]);

  const handleSelectMC = (idx: number) => {
    if (isAnswered) return;
    setSelectedMC(idx);
    const correct = idx === currentQ.correctAnswer;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      setEarnedScore((prev) => prev + currentQ.points);
    } else {
      soundManager.playWrong();
    }
  };

  const handleSelectTF = (valIdx: number) => {
    if (isAnswered) return;
    setSelectedTF(valIdx);
    const correct = valIdx === currentQ.correctAnswer;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      setEarnedScore((prev) => prev + currentQ.points);
    } else {
      soundManager.playWrong();
    }
  };

  // Matching question logic
  const handleSelectLeft = (leftText: string) => {
    if (isAnswered) return;
    soundManager.playTick();
    setSelectedLeftItem(leftText);
  };

  const handleSelectRight = (rightText: string) => {
    if (isAnswered || !selectedLeftItem) return;
    soundManager.playTick();
    setMatchingSelections((prev) => ({
      ...prev,
      [selectedLeftItem]: rightText,
    }));
    setSelectedLeftItem(null);
  };

  const handleSubmitMatching = () => {
    if (isAnswered || !currentQ.matchingPairs) return;
    const totalPairs = currentQ.matchingPairs.length;
    let correctMatches = 0;

    currentQ.matchingPairs.forEach((pair) => {
      if (matchingSelections[pair.left] === pair.right) {
        correctMatches += 1;
      }
    });

    const passed = correctMatches === totalPairs;
    setIsAnswered(true);
    setIsCorrect(passed);

    if (passed) {
      soundManager.playCorrect();
      setEarnedScore((prev) => prev + currentQ.points);
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < stageQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishAttempt();
    }
  };

  const handleFinishAttempt = () => {
    setIsStageCompleted(true);
    soundManager.playVictory();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const updatedUser: User = {
      ...currentUser,
      totalScore: currentUser.totalScore + earnedScore,
      currentStageId: Math.max(currentUser.currentStageId, stageId + 1),
      completedStages: currentUser.completedStages.includes(stageId)
        ? currentUser.completedStages
        : [...currentUser.completedStages, stageId],
      stageScores: {
        ...currentUser.stageScores,
        [stageId]: Math.max(currentUser.stageScores?.[stageId] || 0, earnedScore),
      },
    };
    saveUserToRegistry(updatedUser);
  };

  const renderSubjectBadge = (subject: string) => {
    switch (subject) {
      case 'genetics':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-xs">
            <Dna className="w-3.5 h-3.5 text-emerald-400" />
            <span>🧬 علم الجينات والوراثة الخلوية</span>
          </span>
        );
      case 'culture':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-xs font-bold shadow-xs">
            <Landmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>🏛️ الثقافة والتاريخ والتراث</span>
          </span>
        );
      case 'religion':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-xs">
            <Cross className="w-3.5 h-3.5 text-amber-400" />
            <span>✝️ العلوم الكنسية والآباء</span>
          </span>
        );
    }
  };

  if (isStageCompleted) {
    const isPassed = earnedScore >= currentStage.passingScore;
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-stone-900 border-2 border-amber-500/80 shadow-2xl text-center space-y-6 animate-fade-in text-stone-100 my-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mx-auto shadow-inner">
          {isPassed ? '👑' : '🌱'}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            {isPassed ? 'تهانينا المباركة! تم اجتياز المرحلة' : 'محاولة مباركة! واصل التكرار والتعلم'}
          </span>
          <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
            {currentStage.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            حصلت على <strong className="text-amber-300">{earnedScore} نقطة</strong> في هذه المرحلة
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto p-4 rounded-2xl bg-stone-950 border border-amber-600/30 text-xs">
          <div>
            <span className="text-stone-400 block">درجة النجاح المطلوبة:</span>
            <span className="font-bold text-amber-200">{currentStage.passingScore} نقطة</span>
          </div>
          <div>
            <span className="text-stone-400 block">نقاطك المحققة:</span>
            <span className="font-bold text-emerald-400">{earnedScore} نقطة</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onFinishStage(stageId + 1)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer"
          >
            الانتقال للمرحلة التالية
          </button>
          <button
            onClick={onBackToHome}
            className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm transition cursor-pointer border border-stone-700"
          >
            العودة للعجلة والرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition cursor-pointer border border-stone-700"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>الخروج للرئيسية</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-bold font-mono">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeRemaining} ثانية</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-800 border border-stone-700 text-amber-200 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{earnedScore} نقطة</span>
          </div>
        </div>
      </div>

      {/* Stage Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-600/40 p-5 sm:p-6 shadow-xl space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentStage.icon}</span>
            <div>
              <span className="text-[11px] text-amber-400 font-bold block">
                المرحلة {stageId} من {allStages.length}
              </span>
              <h1 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                {currentStage.title}
              </h1>
            </div>
          </div>
          {renderSubjectBadge(currentQ.subject)}
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-[11px] text-stone-400 mb-1">
            <span>السؤال {currentIndex + 1} من {stageQuestions.length}</span>
            <span>النقاط: {currentQ.points}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{
                width: `${((currentIndex + 1) / stageQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-stone-900/90 border-2 border-amber-600/30 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {currentQ.type === 'multiple_choice' && 'سؤال الاختيار من متعدد:'}
              {currentQ.type === 'true_false' && 'سؤال الصواب والخطأ:'}
              {currentQ.type === 'matching' && 'سؤال التوصيل والمطابقة الذكية:'}
            </span>
          </div>
          <h2 className="font-spiritual text-lg sm:text-2xl font-bold text-stone-100 leading-relaxed">
            {currentQ.text}
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 1. MULTIPLE CHOICE QUESTION                                               */}
        {/* ========================================================================= */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedMC === idx;
              const isCorrectAnswer = currentQ.correctAnswer === idx;

              let btnStyle = 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectMC(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-right font-bold text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-relaxed">{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. TRUE / FALSE QUESTION                                                  */}
        {/* ========================================================================= */}
        {currentQ.type === 'true_false' && (
          <div className="grid grid-cols-2 gap-4">
            {['صواب (نعم)', 'خطأ (لا)'].map((label, valIdx) => {
              const isSelected = selectedTF === valIdx;
              const isCorrectAnswer = currentQ.correctAnswer === valIdx;

              let btnStyle = 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100';
                }
              }

              return (
                <button
                  key={valIdx}
                  onClick={() => handleSelectTF(valIdx)}
                  disabled={isAnswered}
                  className={`p-5 rounded-2xl border text-center font-spiritual text-base sm:text-lg font-bold transition flex flex-col items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span className="text-2xl">{valIdx === 0 ? '✓' : '✗'}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MATCHING QUESTION                                                      */}
        {/* ========================================================================= */}
        {currentQ.type === 'matching' && currentQ.matchingPairs && (
          <div className="space-y-4">
            <p className="text-xs text-stone-400">
              💡 انقر أولاً على عنصر من العمود الأيمن، ثم انقر على نظيره المناسب في العمود الأيسر لتوصيلهما:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column A (Left items in schema) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 block pb-1">العمود الأول (المفاهيم / الرواد):</span>
                {currentQ.matchingPairs.map((pair) => {
                  const isLinked = !!matchingSelections[pair.left];
                  const isCurrentSelection = selectedLeftItem === pair.left;

                  return (
                    <div
                      key={pair.id}
                      onClick={() => handleSelectLeft(pair.left)}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                        isCurrentSelection
                          ? 'bg-amber-600 text-white border-amber-300 ring-2 ring-amber-400'
                          : isLinked
                          ? 'bg-emerald-950/50 border-emerald-600 text-emerald-200'
                          : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-amber-500'
                      }`}
                    >
                      <span>{pair.left}</span>
                      {isLinked && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>

              {/* Column B (Right items in schema) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 block pb-1">العمود الثاني (الدلالة والوصف):</span>
                {currentQ.matchingPairs.map((pair) => {
                  // Find which left item is connected to this right item
                  const connectedLeft = Object.keys(matchingSelections).find(
                    (k) => matchingSelections[k] === pair.right
                  );

                  return (
                    <div
                      key={`right-${pair.id}`}
                      onClick={() => handleSelectRight(pair.right)}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition cursor-pointer flex flex-col gap-1 ${
                        connectedLeft
                          ? 'bg-emerald-950/50 border-emerald-600 text-emerald-200'
                          : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-amber-500'
                      }`}
                    >
                      <span>{pair.right}</span>
                      {connectedLeft && (
                        <span className="text-[10px] text-amber-300 font-mono">
                          🔗 مرتبط بـ: {connectedLeft}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit button for Matching */}
            {!isAnswered && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSubmitMatching}
                  disabled={
                    Object.keys(matchingSelections).length <
                    currentQ.matchingPairs.length
                  }
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Link className="w-4 h-4" />
                  <span>تأكيد الإجابة واعتماد التوصيل</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Explanation & Feedback Box */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100'
                : 'bg-rose-950/70 border-rose-500/60 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>إجابة صحيحة وممتازة! (+{currentQ.points} نقطة)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>إجابة غير دقيقة! إليك الشرح الموثق:</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {currentQ.explanation}
            </p>

            {currentQ.scriptureReference && (
              <span className="text-[11px] font-mono text-amber-300 font-bold block pt-1">
                📖 الشاهد والمرجع: {currentQ.scriptureReference}
              </span>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
