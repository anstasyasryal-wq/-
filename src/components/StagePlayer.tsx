import React, { useState, useEffect, useRef } from 'react';
import { User, Stage, Question, UserAnswerRecord } from '../types';
import {
  getQuestionsForStage,
  recordStageAttempt,
  getStoredStages,
} from '../utils/competitionEngine';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Clock,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Volume2,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  Trophy,
  ChevronLeft,
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
  const stages = getStoredStages();
  const currentStage = stages.find((s) => s.id === stageId) || stages[0];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentStage.timePerQuestionSeconds);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>([]);

  // Stage 4 Sensory: Image inspection timer
  const [isInspectingImage, setIsInspectingImage] = useState(false);
  const [imageInspectTimeLeft, setImageInspectTimeLeft] = useState(6);

  // Bonus and Score tracking
  const [currentScore, setCurrentScore] = useState(0);
  const [lastBonusEarned, setLastBonusEarned] = useState<number | null>(null);

  // Finished state
  const [isFinished, setIsFinished] = useState(false);
  const [finalRank, setFinalRank] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions on mount
  useEffect(() => {
    const list = getQuestionsForStage(stageId);
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers([]);
    setCurrentScore(0);
    setIsFinished(false);
    setTimeLeft(currentStage.timePerQuestionSeconds);
  }, [stageId]);

  const currentQ = questions[currentIndex] || null;

  // Handle Image inspection phase for Stage 4
  useEffect(() => {
    if (!currentQ) return;
    if (currentQ.questionType === 'image_memory' && !isAnswerSubmitted) {
      setIsInspectingImage(true);
      const inspectSec = currentQ.imageInspectionTimeSeconds || 6;
      setImageInspectTimeLeft(inspectSec);

      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
      imageTimerRef.current = setInterval(() => {
        setImageInspectTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(imageTimerRef.current!);
            setIsInspectingImage(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsInspectingImage(false);
    }

    return () => {
      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    };
  }, [currentIndex, currentQ?.id]);

  // Main Question countdown timer
  useEffect(() => {
    if (isFinished || isAnswerSubmitted || !currentQ || isInspectingImage) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      if (timeLeft <= 5 && timeLeft > 0) {
        soundManager.playTick();
      }
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isAnswerSubmitted, isFinished, currentQ, isInspectingImage]);

  // Reset timer on new question
  const resetForNextQuestion = (nextIdx: number) => {
    setCurrentIndex(nextIdx);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setLastBonusEarned(null);
    const timeLimit = questions[nextIdx]?.timeLimitSeconds || currentStage.timePerQuestionSeconds;
    setTimeLeft(timeLimit);
  };

  const handleTimeout = () => {
    if (isAnswerSubmitted || !currentQ) return;
    soundManager.playWrong();
    setIsAnswerSubmitted(true);

    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      selectedOptionIndex: null,
      isCorrect: false,
      timeSpentSeconds: currentQ.timeLimitSeconds || currentStage.timePerQuestionSeconds,
      pointsEarned: 0,
      speedBonusEarned: 0,
    };
    setAnswers((prev) => [...prev, record]);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    const timeLimit = currentQ.timeLimitSeconds || currentStage.timePerQuestionSeconds;
    const timeSpent = Math.max(1, timeLimit - timeLeft);

    // Calculate Speed Bonus (especially prominent in Stage 3)
    let speedBonus = 0;
    if (isCorrect) {
      if (timeSpent <= 4) {
        speedBonus = stageId === 3 ? 10 : 5;
      } else if (timeSpent <= 8) {
        speedBonus = stageId === 3 ? 5 : 2;
      }
    }

    const earned = isCorrect ? (currentQ.points || 10) + speedBonus : 0;
    setCurrentScore((prev) => prev + earned);
    setLastBonusEarned(speedBonus > 0 ? speedBonus : null);

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      selectedOptionIndex: idx,
      isCorrect,
      timeSpentSeconds: timeSpent,
      pointsEarned: earned,
      speedBonusEarned: speedBonus,
    };
    setAnswers((prev) => [...prev, record]);
  };

  const handlePlayAudioHymn = () => {
    if (!currentQ || !currentQ.hymnTuneKey) return;
    soundManager.playHymnSnippet(currentQ.hymnTuneKey);
  };

  const handleNextOrFinish = () => {
    if (currentIndex + 1 < questions.length) {
      resetForNextQuestion(currentIndex + 1);
    } else {
      finishStage();
    }
  };

  const finishStage = () => {
    setIsFinished(true);
    soundManager.playVictory();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalTimeSpent = answers.reduce((acc, a) => acc + a.timeSpentSeconds, 0);

    const { newRank } = recordStageAttempt(
      currentUser.id,
      stageId,
      currentScore,
      correctCount,
      totalTimeSpent
    );
    setFinalRank(newRank);
  };

  if (!currentQ && !isFinished) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-600">جارٍ إعداد أسئلة المرحلة...</p>
      </div>
    );
  }

  // ==========================================
  // Finished Stage Summary Screen
  // ==========================================
  if (isFinished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalQ = questions.length;
    const percentage = Math.round((correctCount / totalQ) * 100);
    const totalBonus = answers.reduce((acc, a) => acc + (a.speedBonusEarned || 0), 0);

    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-white p-6 sm:p-8 border border-amber-200 shadow-xl text-center space-y-6 animate-fade-in text-right">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-indigo-950 flex items-center justify-center shadow-lg border-2 border-white">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            تمت الجولة بنجاح
          </span>
          <h2 className="text-2xl font-bold font-spiritual text-slate-900 mt-2">
            نتائج: {currentStage.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            المتسابقة: <span className="font-bold text-slate-700">{currentUser.name}</span> (
            {currentUser.consecrationHouse})
          </p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">إجمالي النقاط</span>
            <span className="text-xl font-black text-amber-700">{currentScore}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">الإجابات الصحيحة</span>
            <span className="text-xl font-black text-emerald-700">
              {correctCount} / {totalQ}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">بونص السرعة</span>
            <span className="text-xl font-black text-indigo-700">+{totalBonus}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">ترتيبكِ العام</span>
            <span className="text-xl font-black text-purple-700">
              {finalRank ? `المركز ${finalRank}` : '—'}
            </span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
          <p className="font-bold text-sm">
            🎉 مبارك! تم تسجيل محاولتكِ وحساب النقاط تلقائياً في الترتيب العام.
          </p>
          <p className="text-slate-600">
            {stageId === 6
              ? 'لقد خضتِ النهائي الكبير! يمكنكِ الآن استعراض حفل تتويج «المكرَّسة المثالية» والجوائز الملكية.'
              : `تم حفظ تقدمكِ وتأهيلكِ للجولة التالية أو الترقية التلقائية مع انتهاء الجولة.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {stageId < 6 ? (
            <button
              onClick={() => onFinishStage(stageId + 1)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-800 text-white font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>الانتقال للمرحلة التالية ({stages[stageId]?.title || 'المرحلة التالية'})</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              onClick={() => onFinishStage(6)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-indigo-950 font-black text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Trophy className="w-5 h-5 fill-indigo-950" />
              <span>👑 مشاهدة نتائج وتتويج النهائي الكبير</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              عرض ترتيبي في لوحة الشرف
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Active Question Player Screen
  // ==========================================
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12 animate-fade-in text-right">
      {/* Top Header Card: Stage & Progress */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>خروج</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {currentStage.title}
          </span>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            السؤال {currentIndex + 1} من {questions.length}
          </p>
        </div>

        {/* Live Timer Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold border transition ${
            timeLeft <= 5
              ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
              : 'bg-indigo-50 text-indigo-900 border-indigo-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft} ث</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-indigo-700 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
        {/* Category & Points Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
            {currentQ.category} {currentQ.subCategory ? `• ${currentQ.subCategory}` : ''}
          </span>

          <div className="flex items-center gap-2">
            {lastBonusEarned && (
              <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full animate-bounce flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-600" />
                <span>+{lastBonusEarned} سرعة</span>
              </span>
            )}
            <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              {currentQ.points || 10} نقطة
            </span>
          </div>
        </div>

        {/* Stage 4 Special: Image Inspection Mode */}
        {currentQ.questionType === 'image_memory' && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
            {isInspectingImage ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>تأملي الأيقونة بدقة... ستختفي خلال {imageInspectTimeLeft} ثوانٍ!</span>
                </div>
                {currentQ.imageSrc && (
                  <img
                    src={currentQ.imageSrc}
                    alt="تحدي الذاكرة البصرية"
                    className="max-h-60 mx-auto rounded-xl object-contain shadow-md border border-amber-300"
                  />
                )}
              </div>
            ) : (
              <div className="py-4 text-slate-500 text-xs flex items-center justify-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-400" />
                <span>تم إخفاء الصورة! أجيبي عن التفاصيل من ذاكرتكِ:</span>
              </div>
            )}
          </div>
        )}

        {/* Stage 4 Special: Audio Hymn Playback */}
        {currentQ.questionType === 'audio_hymn' && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center space-y-2">
            <p className="text-xs font-bold text-indigo-900">
              🎵 تحدي الاستماع للألحان الكنسية:
            </p>
            <button
              type="button"
              onClick={handlePlayAudioHymn}
              className="py-2.5 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 استمعي لمقطع اللحن الآن</span>
            </button>
            <p className="text-[11px] text-slate-500">
              استمعي للنغمات الكنسية الرخيمة وخمني المناسبة أو اسم اللحن.
            </p>
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-spiritual pt-1">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQ.correctIndex;

            let optionStyle =
              'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-300';

            if (isAnswerSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-amber-100 border-amber-500 text-indigo-950 font-bold';
            }

            const letters = ['أ', 'ب', 'ج', 'د'];

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted || isInspectingImage}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/80 border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {letters[idx]}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>

                {isAnswerSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Reference Reveal */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 animate-fade-in text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>التفسير والشاهد الكنسي:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            {currentQ.reference && (
              <p className="text-amber-800 font-semibold pt-1">
                المصدر: {currentQ.reference}
              </p>
            )}
          </div>
        )}

        {/* Next Question / Finish Button */}
        {isAnswerSubmitted && (
          <button
            onClick={handleNextOrFinish}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <span>
              {currentIndex + 1 < questions.length ? 'السؤال التالي' : 'إنهاء الجولة وإعلان النتيجة'}
            </span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
};
