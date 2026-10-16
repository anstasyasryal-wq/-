import React from 'react';
import { Trophy, ChevronLeft, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalCeremonyViewProps {
  onBackToHome: () => void;
  onOpenLeaderboard: () => void;
}

export const FinalCeremonyView: React.FC<FinalCeremonyViewProps> = ({
  onBackToHome,
  onOpenLeaderboard,
}) => {
  React.useEffect(() => {
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-stone-900 border-2 border-amber-500 shadow-2xl text-center space-y-6 animate-fade-in text-stone-100 my-6">
      <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-5xl mx-auto shadow-inner animate-bounce-subtle">
        👑
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
          ✦ حفل الختام والتتويج الشرفي ✦
        </span>
        <h1 className="font-spiritual text-3xl sm:text-4xl font-bold text-amber-100">
          مبارك إتمام مسيرة «حَسَبَ قَلْبِ اللهِ»
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md mx-auto">
          لقد اجتزت مراحل التقييم والمراجعة في العلوم الكنسية واللاهوت والجينات وتراث الآباء بأمانة وتميز مبارك.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/40 text-xs text-amber-200 font-spiritual text-base">
        «قَدْ جَاهَدْتُ الْجِهَادَ الْحَسَنَ، أَكْمَلْتُ السَّعْيَ، حَفِظْتُ الإِيمَانَ، وَأَخِيرًا قَدْ وُضِعَ لِي إِكْلِيلُ الْبِرِّ»
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onOpenLeaderboard}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer flex items-center gap-2"
        >
          <Trophy className="w-4 h-4" />
          <span>مشاهدة لوحة الشرف والصدارة</span>
        </button>
        <button
          onClick={onBackToHome}
          className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm transition cursor-pointer border border-stone-700"
        >
          العودة للرئيسية والعجلة
        </button>
      </div>
    </div>
  );
};
