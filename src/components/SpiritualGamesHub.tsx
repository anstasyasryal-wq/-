import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Gamepad2, ChevronLeft, Trophy, Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';

interface SpiritualGamesHubProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const SpiritualGamesHub: React.FC<SpiritualGamesHubProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [selectedGame, setSelectedGame] = useState<'menu' | 'riddle' | 'puzzle'>('menu');
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  const riddles = [
    {
      q: 'أنا لستُ ملاكاً ولا نبياً، لكنني ألبستُ ملوكاً وأطعتُ شيوخاً في البرية، اسمي يحمل رتبة التواضع في بستان الرهبان. فمن أكون؟',
      a: 'القمص الراهب المتضع / التلميذ المطيع للشيخ',
      source: 'بستان الرهبان - أقوال الشيوخ',
    },
    {
      q: 'أنا سر بيولوجي مدهش يحمل تتابعاً رقمياً دقيقاً في نواة خلاياك، يشهد بأنك مخلوق لست من عبث بل بتصميم فائق الجمال والهارموني. فمن أكون؟',
      a: 'شريط الحمض النووي (DNA) والشفرة الوراثية',
      source: 'علم الوراثة والتصميم الخالق',
    },
    {
      q: 'كنيسة بلا سقف، ومحراب في الهواء الطلق، وبطرس وبولس لم يبنوا جدراناً بل قلوباً مسبحة في مغارة مصرية. أين أكون؟',
      a: 'قلايات ومغارات وادي النطرون وجبل نتريا',
      source: 'تاريخ الرهبنة القبطية',
    },
  ];

  const handleRevealAnswer = () => {
    soundManager.playCorrect();
    setShowRiddleAnswer(true);
    setGameScore((s) => s + 20);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleNextRiddle = () => {
    soundManager.playTick();
    setShowRiddleAnswer(false);
    setRiddleIndex((prev) => (prev + 1) % riddles.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-purple-600/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/40 text-purple-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>الألعاب الروحية والتحديات الذهنية</span>
          </div>
          <div className="text-xs font-bold text-amber-300 font-mono bg-stone-900/80 px-3 py-1 rounded-xl border border-stone-800">
            النقاط: {gameScore}
          </div>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🎮 واحة الألعاب الروحية وتحديات البرية
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          ألعاب ذكاء وفوازير بستان الرهبان وعجائب الشفرة الوراثية لاختبار معلوماتك بمرح وعمق روحي.
        </p>
      </div>

      {/* Riddle Game Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>فوازير وألغاز الحكمة (اللغز {riddleIndex + 1} من {riddles.length})</span>
          </span>
          <button
            onClick={handleNextRiddle}
            className="text-xs text-stone-300 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>اللغز التالي</span>
          </button>
        </div>

        <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 leading-relaxed">
          {riddles[riddleIndex].q}
        </h3>

        {showRiddleAnswer ? (
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>الإجابة النموذجية: {riddles[riddleIndex].a}</span>
            </div>
            <span className="text-[11px] text-amber-300 font-mono block">
              📚 المصدر والمرجع: {riddles[riddleIndex].source}
            </span>
          </div>
        ) : (
          <button
            onClick={handleRevealAnswer}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            كشف الإجابة والحل (+20 نقطة)
          </button>
        )}
      </div>
    </div>
  );
};
