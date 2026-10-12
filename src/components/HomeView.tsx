import React from 'react';
import { User, Stage, Announcement } from '../types';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  Play,
  UserCheck,
  Award,
  BookOpen,
  Sparkles,
  ChevronLeft,
  Bell,
  Lock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Users,
  Building,
  Heart,
  Quote,
  Flame,
  Moon,
  Sun,
  Sliders,
  Eye,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeViewProps {
  currentUser: User | null;
  stages: Stage[];
  announcements: Announcement[];
  onStartStage: (stageId: number) => void;
  onOpenLogin: () => void;
  onOpenMyRank: () => void;
  onOpenRules: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToDioceses: () => void;
  onNavigateToSupervisor: () => void;
  onNavigateToParticipants: () => void;
  onNavigateToCompetitions: () => void;
  onOpenSpiritualGuide: () => void;
  onNavigateToSpiritualLife?: () => void;
  onNavigateToBiblicalStudy?: () => void;
  onNavigateToPersonalSpace?: () => void;
  onOpenReadingSettings?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  stages,
  announcements,
  onStartStage,
  onOpenLogin,
  onOpenMyRank,
  onOpenRules,
  onNavigateToLeaderboard,
  onNavigateToDioceses,
  onNavigateToSupervisor,
  onNavigateToParticipants,
  onNavigateToCompetitions,
  onOpenSpiritualGuide,
  onNavigateToSpiritualLife,
  onNavigateToBiblicalStudy,
  onNavigateToPersonalSpace,
  onOpenReadingSettings,
}) => {
  const currentEligibleStageId = currentUser ? currentUser.currentStageId : 1;
  const activeAnnouncement = announcements[0] || null;
  const { isNightMode, toggleNightMode } = useReadingTheme();

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-right">
      {/* Announcements Banner */}
      {activeAnnouncement && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-200/80 p-3.5 sm:p-4 text-right flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm flex-shrink-0 animate-pulse">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                {activeAnnouncement.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 line-clamp-1">
                {activeAnnouncement.content}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
            إعلان رسمي
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* فقرة تعريف المكرسة وهويتها وخدمتها ورسالتها التكريسية */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-indigo-50 border-2 border-amber-300 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🕊️
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                ميثاق وهوية المكرسين لله
              </span>
              <h2 className="text-base sm:text-lg font-bold font-spiritual text-slate-900 mt-0.5">
                بطاقة الهوية التكريسية، والرسالة، وميدان الخدمة
              </h2>
            </div>
          </div>

          {currentUser ? (
            <button
              onClick={onOpenLogin}
              className="text-xs text-indigo-900 hover:text-indigo-950 font-bold bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs transition cursor-pointer"
            >
              تعديل بيانات الهوية والخدمة
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="text-xs text-white font-bold bg-indigo-900 hover:bg-indigo-800 px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              تسجيل بطاقة الهوية والخدمة
            </button>
          )}
        </div>

        {currentUser ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Identity details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  {currentUser.consecrationRank || 'مكرس/ة'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {currentUser.consecrationHouse} • {currentUser.diocese}
              </p>
              <div className="text-xs text-indigo-950 font-semibold bg-indigo-50/80 p-2 rounded-xl border border-indigo-100">
                ميدان الخدمة: {currentUser.ministryField || 'رعاية وخدمة عامة'}
              </div>
            </div>

            {/* Consecration verse */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                <Quote className="w-3 h-3 text-amber-600" />
                <span>شعار وآية التكريس:</span>
              </span>
              <p className="text-xs font-spiritual font-bold text-amber-950 leading-relaxed">
                {currentUser.consecrationVerse ||
                  '«وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي»'}
              </p>
            </div>

            {/* Mission Bio */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500">
                رسالة التكريس والشهادة للمسيح:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                {currentUser.personalBio ||
                  'أكرس حياتي لخدمة المسيح الفادي في الكنيسة، مع السهر على الصلاة والتعليم ونشر محبة المخلص.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 text-xs text-slate-700 leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              أهلاً بكم في منصة «حَسَبَ قَلْبِ اللهِ»! صُممت هذه المنصة الكنسية للمراجعة الروحية والنمو في العلوم الكنسية والنضج الإنساني لكل شخص مكرس لله (كاهن – مكرَّسة – راهب – راهبة). قوموا بتسجيل بطاقة التكريس والهوية للانطلاق في مسيرة المراجعة والبركة.
            </p>
            <button
              onClick={onOpenLogin}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-xs whitespace-nowrap shadow-sm hover:brightness-105 transition cursor-pointer"
            >
              تسجيل بيانات الهوية الآن
            </button>
          </div>
        )}
      </div>

      {/* Hero Card (الشاشة الأولى) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-amber-400/30 text-center">
        {/* Soft background aura & cross pattern */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -mr-4" />
          <span>🟢 مسيرة المراجعة والتقييم الروحي مفتوحة لجميع الآباء والخدام</span>
        </div>

        {/* Title & Slogan */}
        <h1 className="text-3xl sm:text-5xl font-black font-spiritual text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white tracking-wide">
          🕊️ حَسَبَ قَلْبِ اللهِ
        </h1>
        <p className="text-sm sm:text-xl text-amber-200/95 font-bold mt-2">
          «كاهن – مكرَّسة – راهب – راهبة»
        </p>

        {/* Motto Callout */}
        <div className="my-5 inline-block px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-2xl mx-auto">
          <p className="text-sm sm:text-lg font-bold font-spiritual text-amber-100 tracking-wider">
            «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي» (أع 13: 22)
          </p>
          <p className="text-xs text-slate-300 font-sans mt-1">
            رحلة مراجعة داخلية ونضج روحي وإنساني في العلاقة مع الله والآخرين والخدمة
          </p>
        </div>

        {/* Action Buttons (The Main Primary Actions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          {/* Button 1: ابدأ التقييم والمراجعة */}
          <button
            onClick={() => onStartStage(currentEligibleStageId)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-indigo-950 font-black text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-indigo-950" />
            <span>▶️ ابدأ مسيرة التقييم</span>
          </button>

          {/* Button 2: تسجيل الدخول */}
          <button
            onClick={onOpenLogin}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-200" />
            <span>👤 {currentUser ? 'تبديل الحساب' : 'تسجيل الدخول'}</span>
          </button>

          {/* Button 3: ترتيبي */}
          <button
            onClick={onOpenMyRank}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>🏆 ترتيبي</span>
          </button>

          {/* Button 4: قواعد المسابقة */}
          <button
            onClick={onOpenRules}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-200" />
            <span>📜 ميثاق وقواعد المسيرة</span>
          </button>
        </div>

        {/* PWA Install Quick Prompt */}
        <div className="pt-4 max-w-md mx-auto">
          <PWAInstallButton variant="hero" />
        </div>
      </div>

      {/* PWA Installation Card */}
      <PWAInstallButton variant="banner" />

      {/* Spiritual Guide Interactive Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-100/60 border-2 border-amber-300 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 text-right">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 shadow-md border-2 border-white">
              <img
                src="/src/assets/images/spiritual_father_avatar_1791703349048.jpg"
                alt="أبونا الروحي"
                className="w-full h-full object-cover object-top rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" title="جاهز للإرشاد" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                مرشد أبوي وقور
              </span>
              <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                محادثة وصوت
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-spiritual text-slate-900">
              🕊️ المرشد الروحي الرقمي • أبونا الروحي
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              مرافقة أبوية في التأمل الروحي، ومراجعة نصوص الكنيسة وآبائها، والاستعداد لمراحل المسابقة الست بصوت وقور ومحادثة ذكية باللغة العربية واللهجة المصرية.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSpiritualGuide}
          className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-950 hover:from-amber-500 hover:to-indigo-900 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          <span>تحدث مع أبونا الروحي</span>
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* New Platform Modules Grid (أركان المنصة المتكاملة الثلاثة) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        {/* 1. الحياة الروحية */}
        <div
          onClick={onNavigateToSpiritualLife}
          className="bg-white rounded-3xl p-5 border-2 border-rose-200/80 hover:border-rose-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                🌱
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                خطط 7 أيام
              </span>
            </div>
            <div>
              <h3 className="font-spiritual text-lg font-bold text-slate-900 group-hover:text-rose-900 transition">
                ركن الحياة الروحية
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                خطط قراءة وتأمل كتابية مخصصة للكاهن، الراهب، والراهبة، والمكرسة، مع تدريبات عملية لحراسة سكون المخدع.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-800">
            <span>تصفح الخطط الروحية</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* 2. الدراسة الكتابية */}
        <div
          onClick={onNavigateToBiblicalStudy}
          className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                📜
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                دراسات وآباء
              </span>
            </div>
            <div>
              <h3 className="font-spiritual text-lg font-bold text-slate-900 group-hover:text-amber-900 transition">
                ركن الدراسة والتعليم الكنسي
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                دراسات معمقة في العقيدة والليتورجيا وتاريخ الكنيسة، موثقة بنصوص الإنجيل وأقوال الآباء، مع بنك الأسئلة الشامل.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>دخول مكتبة الدراسات</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* 3. المساحة الشخصية ومذكرة المخدع */}
        <div
          onClick={onNavigateToPersonalSpace}
          className="bg-white rounded-3xl p-5 border-2 border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                🕯️
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                سري ومحمي
              </span>
            </div>
            <div>
              <h3 className="font-spiritual text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition">
                المساحة الشخصية ومذكرة المخدع
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                سجل سري لمراجعة النفس وتجهيز جلسة الاعتراف وتأملات الإنجيل، مع حبل صلاة يسوع التفاعلي بالمسبحة.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>فتح المخدع الشخصي</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Eye Comfort Reading & Settings Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-right shadow-xs ${
          isNightMode
            ? 'bg-gradient-to-r from-[#201d19] via-[#26221c] to-[#201d19] border-amber-800/60 text-amber-100'
            : 'bg-gradient-to-r from-amber-50/80 via-white to-stone-50 border-amber-300 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-md">
            {isNightMode ? '🌙' : '📖'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400 bg-amber-100 text-amber-900">
                {isNightMode ? 'وضع القراءة الليلي مُفعَّل' : 'إعدادات القراءة وسكون المخدع'}
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">حماية شبكية العين وراحة القراءة</span>
            </div>
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-slate-900">
              سكون المخدع: وضع القراءة الليلي المريح للعين
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              تخفيف خلفية الورق والبردي، وضبط تباين النصوص وتكبير الخط للمطالعة الكنسية والتأملات الطويلة بدون إجهاد.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              soundManager.playTick();
              toggleNightMode();
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isNightMode
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                : 'bg-stone-800 hover:bg-stone-700 text-white'
            }`}
          >
            {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isNightMode ? 'التبديل للنهاري ☀️' : 'تفعيل القراءة الليلية 🌙'}</span>
          </button>

          {onOpenReadingSettings && (
            <button
              onClick={() => {
                soundManager.playTick();
                onOpenReadingSettings();
              }}
              className="py-2 px-3.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>تخصيص تباين النصوص والورق</span>
            </button>
          )}
        </div>
      </div>

      {/* Distinct Action Hub Cards for: من سجل؟ + دليل الاختبارات والمسابقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
        {/* Card: من سجل في المسابقة؟ */}
        <button
          onClick={onNavigateToParticipants}
          className="p-5 rounded-3xl bg-white border border-amber-300 hover:border-amber-500 hover:shadow-md transition text-right flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                سجل المشاركين الرسمي
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                📋 من سجل في المسيرة؟ (المشاركون)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                استعراض الأسماء، الكنائس والأديرة، الإيبارشيات، وأكواد المشاركين
              </p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-amber-700 transition" />
        </button>

        {/* Card: دليل الاختبارات والمسابقات */}
        <button
          onClick={onNavigateToCompetitions}
          className="p-5 rounded-3xl bg-white border border-indigo-300 hover:border-indigo-500 hover:shadow-md transition text-right flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-100 text-indigo-900 border border-indigo-300 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                المراجعات والاختبارات الستة
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                🎮 دليل المراجعات والاختبارات
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                استكشاف جميع الاختبارات، المراجعة الفردية، وتحدي الفرق
              </p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-700 transition" />
        </button>
      </div>

      {/* The 5 Main Stages + Grand Final Overview Section */}
      <div className="space-y-4 text-right pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            خمس جولات إلكترونية متدرجة + التتويج الكبير
          </span>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🗺️ مسار المسابقة والمراحل الإلكترونية</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const isStageCompleted = currentUser
              ? currentUser.currentStageId > stage.id
              : false;
            const isStageCurrent = currentUser
              ? currentUser.currentStageId === stage.id
              : stage.id === 1;
            const isStageLocked = currentUser
              ? currentUser.currentStageId < stage.id
              : stage.id !== 1;

            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl p-5 border transition-all text-right flex flex-col justify-between ${
                  isStageCurrent
                    ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : isStageCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isStageCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isStageCurrent
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {stage.badge}
                    </span>
                    <span className="text-2xl">{stage.icon}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {stage.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700">عدد الأسئلة:</span>{' '}
                      {stage.totalQuestions}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">زمن السؤال:</span>{' '}
                      {stage.timePerQuestionSeconds} ثانية
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  {!stage.isOpen ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                      <span>المرحلة مغلقة حالياً بأمر المشرفة</span>
                    </div>
                  ) : isStageCompleted ? (
                    <button
                      onClick={() => onStartStage(stage.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>تم اجتيازها (إعادة للتمرين)</span>
                    </button>
                  ) : isStageCurrent ? (
                    <button
                      onClick={() => onStartStage(stage.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-xs shadow-md hover:brightness-105 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>خوض التحدي الآن</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 font-medium text-xs flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>مغلقة حتى التأهل</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
