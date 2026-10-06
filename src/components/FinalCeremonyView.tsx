import React, { useState } from 'react';
import { User, FinalAwards } from '../types';
import { computeFinalAwards } from '../utils/competitionEngine';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  Zap,
  Target,
  Brain,
  BookOpen,
  Music,
  Printer,
  ChevronLeft,
} from 'lucide-react';

interface FinalCeremonyViewProps {
  onBackToHome: () => void;
  onOpenLeaderboard: () => void;
}

export const FinalCeremonyView: React.FC<FinalCeremonyViewProps> = ({
  onBackToHome,
  onOpenLeaderboard,
}) => {
  const awards: FinalAwards = computeFinalAwards();
  const [selectedCertificateWinner, setSelectedCertificateWinner] = useState<User | null>(
    awards.firstPlace
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in text-right">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-b from-amber-600 via-amber-700 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border-2 border-amber-300 text-center relative overflow-hidden">
        <div className="inline-flex p-3 rounded-full bg-white/20 mb-3 border border-white/30 backdrop-blur-md">
          <Crown className="w-10 h-10 text-amber-200 animate-bounce" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-spiritual text-amber-100 tracking-wide">
          👑 تتويج «المكرَّسة المثالية»
        </h1>
        <p className="text-sm sm:text-base text-amber-200 mt-2 font-medium">
          الحفل الختامي وإعلان المتصدرات في مسابقة العلوم والمعرفة والذكاء الكنسي
        </p>

        <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-amber-100 border border-white/20">
          «كُنْ أَمِيناً إِلَى الْمَوْتِ فَسَأُعْطِيكَ إِكْلِيلَ الْحَيَاةِ» (رؤيا 2: 10)
        </div>
      </div>

      {/* Top 3 Royal Podium */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          <span>المراكز الثلاثة الأولى الكبرى</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Second Place */}
          {awards.secondPlace && (
            <div className="order-2 md:order-1 p-6 rounded-3xl bg-gradient-to-b from-slate-100 to-white border-2 border-slate-300 shadow-md text-center space-y-3">
              <span className="text-xs font-black text-slate-700 bg-slate-200 px-3 py-1 rounded-full inline-block">
                🥈 المركز الثاني
              </span>
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold border-2 border-slate-300">
                🥈
              </div>
              <h3 className="font-bold text-base text-slate-900">{awards.secondPlace.name}</h3>
              <p className="text-xs text-slate-600">{awards.secondPlace.consecrationHouse}</p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-800 text-sm">
                {awards.secondPlace.totalPoints} نقطة
              </div>
              <button
                onClick={() => setSelectedCertificateWinner(awards.secondPlace)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                استعراض الشهادة
              </button>
            </div>
          )}

          {/* First Place (Center & Highest) */}
          {awards.firstPlace && (
            <div className="order-1 md:order-2 p-7 rounded-3xl bg-gradient-to-b from-amber-100 via-amber-50 to-white border-2 border-amber-400 shadow-xl text-center space-y-3 md:-translate-y-4 ring-4 ring-amber-400/30">
              <span className="text-xs font-black text-amber-950 bg-amber-300 px-3.5 py-1 rounded-full inline-block shadow-sm">
                🥇 المكرَّسة المثالية الأولى
              </span>
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                👑
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-spiritual">
                {awards.firstPlace.name}
              </h3>
              <p className="text-xs text-amber-900 font-semibold">
                {awards.firstPlace.consecrationHouse} ({awards.firstPlace.diocese})
              </p>
              <div className="p-3 rounded-2xl bg-amber-200/50 border border-amber-300 font-mono font-black text-amber-950 text-base">
                {awards.firstPlace.totalPoints} نقطة كبرى
              </div>
              <button
                onClick={() => setSelectedCertificateWinner(awards.firstPlace)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-indigo-950 font-black text-xs shadow-md transition cursor-pointer"
              >
                📜 استعراض وسام وشهادة التكريم
              </button>
            </div>
          )}

          {/* Third Place */}
          {awards.thirdPlace && (
            <div className="order-3 md:order-3 p-6 rounded-3xl bg-gradient-to-b from-amber-50/60 to-white border-2 border-amber-600/30 shadow-md text-center space-y-3">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full inline-block">
                🥉 المركز الثالث
              </span>
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold border-2 border-amber-200">
                🥉
              </div>
              <h3 className="font-bold text-base text-slate-900">{awards.thirdPlace.name}</h3>
              <p className="text-xs text-slate-600">{awards.thirdPlace.consecrationHouse}</p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-amber-900 text-sm">
                {awards.thirdPlace.totalPoints} نقطة
              </div>
              <button
                onClick={() => setSelectedCertificateWinner(awards.thirdPlace)}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition cursor-pointer"
              >
                استعراض الشهادة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specialized Category Awards (الجوائز التخصصية) */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-700" />
          <span>الأوسمة والجوائز التخصصية للمتميزات</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Fastest */}
          {awards.fastestParticipant && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ⚡ وسام أسرع مكرسة
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  {awards.fastestParticipant.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {awards.fastestParticipant.consecrationHouse}
                </p>
              </div>
            </div>
          )}

          {/* Most Accurate */}
          {awards.mostAccurate && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  🎯 وسام أدق مكرسة
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  {awards.mostAccurate.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {awards.mostAccurate.consecrationHouse}
                </p>
              </div>
            </div>
          )}

          {/* Intelligence Star */}
          {awards.intelligenceStar && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-800">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  🧠 نجمة الذكاء والاكتشاف
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  {awards.intelligenceStar.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {awards.intelligenceStar.consecrationHouse}
                </p>
              </div>
            </div>
          )}

          {/* Knowledge Star */}
          {awards.knowledgeStar && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  📖 نجمة المعرفة الكنسية
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  {awards.knowledgeStar.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {awards.knowledgeStar.consecrationHouse}
                </p>
              </div>
            </div>
          )}

          {/* Hymns Star */}
          {awards.hymnsStar && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 sm:col-span-2 lg:col-span-1">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-800">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  🎵 نجمة الألحان والحواس
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-1">
                  {awards.hymnsStar.name}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {awards.hymnsStar.consecrationHouse}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diploma & Certificate Modal Preview */}
      {selectedCertificateWinner && (
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 shadow-xl space-y-6 text-center">
          <div className="max-w-lg mx-auto border-4 border-double border-amber-600/40 p-6 sm:p-8 rounded-2xl bg-amber-50/20 space-y-4">
            <div className="flex justify-between items-center text-xs text-amber-900 font-bold border-b border-amber-200 pb-2">
              <span>كنيسة الإسكندرية القبطية الأرثوذكسية</span>
              <span>لجنة التكريس والمسابقات</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-spiritual text-amber-950">
                شهادة تتويج وتقدير فائق
              </h3>
              <p className="text-xs text-amber-800">في مسابقة «المكرَّسة المثالية» الكبرى</p>
            </div>

            <div className="py-2 space-y-2">
              <p className="text-xs text-slate-600">تمنح هذه الشهادة المعتمدة للأخت المكرسة الفاضلة:</p>
              <h2 className="text-xl sm:text-2xl font-black font-spiritual text-indigo-950">
                {selectedCertificateWinner.name}
              </h2>
              <p className="text-xs text-slate-700 font-semibold">
                من {selectedCertificateWinner.consecrationHouse} — {selectedCertificateWinner.diocese}
              </p>
            </div>

            <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-300 text-xs text-amber-900 space-y-1 font-spiritual">
              <p className="font-bold">«النصيب الصالح الذي لن يُنزع منها»</p>
              <p className="text-[11px] text-slate-700 font-sans">
                تقديراً لتفوقها الباهر في العلوم الكتابية، تاريخ الكنيسة، النسك الرهباني، الألحان، والذكاء والتمييز.
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200 flex justify-between text-[11px] text-slate-600">
              <span>التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
              <span>لجنة التحكيم العامة</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-6 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الرسمية</span>
            </button>
            <button
              onClick={onOpenLeaderboard}
              className="py-2.5 px-6 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              الترتيب العام
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة إلى الشاشة الرئيسية</span>
        </button>
      </div>
    </div>
  );
};
