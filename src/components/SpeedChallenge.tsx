import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Clock, 
  RotateCcw, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  ChevronLeft
} from 'lucide-react';

interface SpeedChallengeProps {
  questionsPool: Question[];
  onBackToHome: () => void;
}

export const SpeedChallenge: React.FC<SpeedChallengeProps> = ({
  questionsPool,
  onBackToHome,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [deck, setDeck] = useState<Question[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startChallenge = () => {
    const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setDeckIndex(0);
    setTimeLeft(60);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setLastAnswerStatus(null);
    setIsPlaying(true);
    setIsFinished(false);
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      endChallenge();
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
  }, [isPlaying, timeLeft]);

  const endChallenge = () => {
    setIsPlaying(false);
    setIsFinished(true);
    soundManager.playVictory();
    if (score >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    if (!isPlaying) return;
    const currentQ = deck[deckIndex];
    if (!currentQ) return;

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Point calculation: base 10 + streak bonus
      const bonus = Math.min(newStreak * 2, 10);
      setScore((prev) => prev + 10 + bonus);
      setCorrectCount((prev) => prev + 1);
      setLastAnswerStatus('correct');
    } else {
      soundManager.playWrong();
      setCurrentStreak(0);
      setWrongCount((prev) => prev + 1);
      setLastAnswerStatus('wrong');
    }

    // Move to next question immediately
    if (deckIndex + 1 < deck.length) {
      setDeckIndex((prev) => prev + 1);
    } else {
      // Loop or reshuffle
      const reshuffled = [...questionsPool].sort(() => 0.5 - Math.random());
      setDeck(reshuffled);
      setDeckIndex(0);
    }
  };

  const currentQ = deck[deckIndex];

  // -------------------------------------------------------------
  // RENDER: Intro
  // -------------------------------------------------------------
  if (!isPlaying && !isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-8 sm:p-12 text-center">
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-800 text-amber-100 shadow-md mb-4">
            <Zap className="w-10 h-10" />
          </div>

          <h1 className="font-spiritual text-3xl font-bold text-stone-900 mb-2">
            تحدي سرعة البرية (60 ثانية)
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
            سجال رهباني ومعرفي سريع! أجيبي على أكبر عدد ممكن من الأسئلة في دقيقة واحدة. كلما تتابعت الإجابات الصائبة تضاعفت نقاطكِ!
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8 text-xs text-stone-600">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <Clock className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block">60 ثانية</span>
              <span>الوقت الكلي</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <Flame className="w-5 h-5 text-rose-600 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block">سلسلة متتالية</span>
              <span>مضاعفة النقاط</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <Trophy className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <span className="font-bold text-stone-900 block">رقم قياسي</span>
              <span>وسام السرعة</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={startChallenge}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-base shadow-lg hover:scale-102 transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-300" />
              <span>انطلاق التحدي الآن</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors"
            >
              الرئيسية
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Active Playing
  // -------------------------------------------------------------
  if (isPlaying && currentQ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* HUD Top Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 mb-6 flex items-center justify-between">
          
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-lg ${
            timeLeft <= 10 
              ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{timeLeft} ث</span>
          </div>

          {/* Current Score */}
          <div className="text-center">
            <span className="text-xs text-stone-500 font-sans block">النقاط الإجمالية</span>
            <span className="font-spiritual text-3xl font-bold text-amber-900">
              {score}
            </span>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>تتابع: {currentStreak}</span>
          </div>

        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-amber-200/90 p-6 sm:p-8">
          
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
            <span>{currentQ.subCategory}</span>
            <span>درجة الصعوبة: {currentQ.difficulty === 'easy' ? 'ميسر' : 'متوسط'}</span>
          </div>

          <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed mb-6">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-amber-50/80 hover:border-amber-400 text-stone-800 text-right font-spiritual text-lg transition-all flex items-center gap-3 active:scale-98"
              >
                <span className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 flex items-center justify-center font-sans text-xs font-bold shrink-0">
                  {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Finished Stage
  // -------------------------------------------------------------
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-8 sm:p-12 text-center">
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-900 text-amber-100 shadow-md mb-4">
            <Trophy className="w-10 h-10" />
          </div>

          <h1 className="font-spiritual text-3xl font-bold text-stone-900 mb-1">
            انتهى وقت تحدي السرعة!
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            أداء مبارك وسرعة بديهة في استحضار العلوم الروحية
          </p>

          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 max-w-sm mx-auto mb-8">
            <span className="text-xs text-amber-800 font-sans block mb-1">مجموع النقاط</span>
            <span className="font-spiritual text-5xl font-bold text-amber-950 block mb-2">
              {score}
            </span>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-amber-200/60 text-xs text-stone-700">
              <div>
                <span className="block text-emerald-700 font-bold font-spiritual text-lg">{correctCount}</span>
                <span>صائب</span>
              </div>
              <div>
                <span className="block text-rose-700 font-bold font-spiritual text-lg">{wrongCount}</span>
                <span>خاطئ</span>
              </div>
              <div>
                <span className="block text-amber-800 font-bold font-spiritual text-lg">{maxStreak}</span>
                <span>أعلى تتابع</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={startChallenge}
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>محاولة جديدة</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors"
            >
              الرئيسية
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};
