import React, { useState, useEffect } from 'react';
import { User, Stage, Announcement } from '../types';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { soundManager } from '../utils/audio';
import { libraryStorage, RecentItem } from '../utils/libraryStorage';
import { workshopsStorage } from '../utils/workshopsStorage';
import { creativeStorage } from '../utils/creativeStorage';
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
  Check,
  Bookmark,
  GraduationCap,
  Lightbulb,
  Brain,
  Compass,
  FileText,
  RotateCcw,
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
  onNavigateToLibrary?: () => void;
  onNavigateToWorkshops?: () => void;
  onNavigateToCreativeLab?: () => void;
  onNavigateToStudyTools?: () => void;
  onNavigateToMonasticOasis?: () => void;
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
  onNavigateToLibrary,
  onNavigateToWorkshops,
  onNavigateToCreativeLab,
  onNavigateToStudyTools,
  onNavigateToMonasticOasis,
}) => {
  const currentEligibleStageId = currentUser ? currentUser.currentStageId : 1;
  const activeAnnouncement = announcements[0] || null;
  const { isNightMode, toggleNightMode } = useReadingTheme();
  const userId = currentUser?.id || 'guest_user';

  // Personal Dashboard state
  const [todayStepCompleted, setTodayStepCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`mokarasa_today_step_${userId}`) === 'true';
    } catch {
      return false;
    }
  });

  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [growthStats, setGrowthStats] = useState({
    workshopsCount: 0,
    booksCount: 0,
    draftsCount: 0,
  });

  useEffect(() => {
    const recents = libraryStorage.getRecentItems(userId);
    setRecentItems(recents);

    const allWorkshops = workshopsStorage.getAllProgress(userId);
    const completedWorkshops = Object.values(allWorkshops).filter((w) => w.isCompleted).length;

    const allBooks = libraryStorage.getUserBookRecords(userId);
    const readingBooks = Object.values(allBooks).filter(
      (b) => b.status === 'reading' || b.status === 'completed'
    ).length;

    const drafts = creativeStorage.getUserDrafts(userId);

    setGrowthStats({
      workshopsCount: completedWorkshops,
      booksCount: readingBooks,
      draftsCount: drafts.length,
    });
  }, [userId]);

  const handleToggleTodayStep = () => {
    soundManager.playTick();
    const next = !todayStepCompleted;
    setTodayStepCompleted(next);
    try {
      localStorage.setItem(`mokarasa_today_step_${userId}`, String(next));
    } catch {}
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-right">
      {/* Announcements Banner */}
      {activeAnnouncement && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-200/80 p-3.5 sm:p-4 text-right flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs flex-shrink-0 animate-pulse">
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
      {/* 1. DAILY SPIRITUAL LIFE DASHBOARD (لوحة الحياة الروحية والشخصية) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-indigo-50/60 border-2 border-amber-300 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ☀️
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                لوحة المراجعة اليومية
              </span>
              <h2 className="text-base sm:text-xl font-bold font-spiritual text-slate-900 mt-0.5">
                لوحة الحياة الروحية ونبض اليوم
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold hidden sm:inline">
              دعوتك: <strong className="text-amber-900">{currentUser?.vocation || 'مكرس/ة'}</strong>
            </span>
            <button
              onClick={onOpenLogin}
              className="text-xs text-indigo-900 hover:text-indigo-950 font-bold bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs transition cursor-pointer"
            >
              {currentUser ? 'تعديل البيانات' : 'تسجيل البطاقة'}
            </button>
          </div>
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Widget 1: خطوتي اليوم */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  🚶 خطوتي اليوم
                </span>
                <span className="text-[10px] text-slate-400">تدريب عملي</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                حراسة سكون الفكر قبل بدء الخدمة
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                «توقف لثلاث دقائق في هدوء قبل أي اجتماع أو خدمة، وتلُ صلاة يسوع 7 مرات طلباً لروح الاتضاع».
              </p>
            </div>

            <button
              onClick={handleToggleTodayStep}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                todayStepCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-amber-300'
              }`}
            >
              <Check className={`w-4 h-4 ${todayStepCompleted ? 'text-emerald-700' : 'text-amber-800'}`} />
              <span>{todayStepCompleted ? 'أتممت تدريب اليوم بنعمة الله' : 'تحديد التدريب كمكتمل'}</span>
            </button>
          </div>

          {/* Widget 2: كنز اليوم */}
          <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  💎 كنز اليوم
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold">تأمل وسؤال</span>
              </div>
              <p className="font-spiritual font-bold text-xs text-indigo-950 leading-relaxed">
                «كُونُوا مُلْتَهِبِينَ بِالرُّوحِ، عَابِدِينَ الرَّبَّ» (رو 12: 11)
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                سؤال للتطبيق: هل حرارة خدمتي نابعة من شبع مخدعي بالصلاة، أم تحولت إلى روتين بارد؟
              </p>
            </div>

            {onNavigateToSpiritualLife && (
              <button
                onClick={onNavigateToSpiritualLife}
                className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>فتح خطة القراءة الروحية</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Widget 3: رحلة النمو الشخصي */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                🌱 رحلة نموي المعرفي والروحي
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>ورش العمل المنجزة:</span>
                  <span className="font-bold text-indigo-950">{growthStats.workshopsCount} من 10 ورش</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>الكتب قيد القراءة:</span>
                  <span className="font-bold text-amber-900">{growthStats.booksCount} كتب</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>مسودات الخدمة المحفوظة:</span>
                  <span className="font-bold text-emerald-800">{growthStats.draftsCount} مسودات</span>
                </div>
              </div>
            </div>

            {onNavigateToWorkshops && (
              <button
                onClick={onNavigateToWorkshops}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>متابعة إنجاز الورش</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Recently read or resume section */}
        {recentItems.length > 0 && (
          <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span className="font-bold">أكمل من حيث توقفت:</span>
              <span className="font-semibold text-indigo-950">
                «{recentItems[0].title}» ({recentItems[0].category})
              </span>
            </div>

            {onNavigateToLibrary && (
              <button
                onClick={onNavigateToLibrary}
                className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>متابعة القراءة في المكتبة</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO IDENTITY & CONSECRATION BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-amber-400/30 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>🟢 مسيرة المراجعة والتقييم الروحي مفتوحة لجميع الآباء والخدام</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-spiritual text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white tracking-wide">
          🕊️ حَسَبَ قَلْبِ اللهِ
        </h1>
        <p className="text-sm sm:text-xl text-amber-200/95 font-bold mt-2">
          «كاهن – مكرَّسة – راهب – راهبة»
        </p>

        <div className="my-5 inline-block px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-2xl mx-auto">
          <p className="text-sm sm:text-lg font-bold font-spiritual text-amber-100 tracking-wider">
            «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي» (أع 13: 22)
          </p>
          <p className="text-xs text-slate-300 font-sans mt-1">
            رحلة مراجعة داخلية ونضج روحي وإنساني في العلاقة مع الله والآخرين والخدمة
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          <button
            onClick={() => onStartStage(currentEligibleStageId)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-indigo-950 font-black text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-indigo-950" />
            <span>▶️ ابدأ مسيرة التقييم</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-200" />
            <span>👤 {currentUser ? 'تبديل الحساب' : 'تسجيل الدخول'}</span>
          </button>

          <button
            onClick={onOpenMyRank}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>🏆 ترتيبي</span>
          </button>

          <button
            onClick={onOpenRules}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-200" />
            <span>📜 ميثاق وقواعد المسيرة</span>
          </button>
        </div>

        <div className="pt-4 max-w-md mx-auto">
          <PWAInstallButton variant="hero" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NEW INTEGRATED HUBS: LIBRARY, WORKSHOPS, CREATIVELAB, STUDY TOOLS */}
      {/* ========================================================================= */}
      <div className="space-y-3 text-right">
        <h3 className="font-spiritual font-bold text-lg text-slate-900 flex items-center gap-2">
          <span>🏛️ محاور التكوين والخدمة والدراسة المتكاملة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hub 1: المكتبة المعرفية */}
          <div
            onClick={onNavigateToLibrary}
            className="bg-white rounded-3xl p-5 border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  📚
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  المكتبة الشاملة
                </span>
              </div>
              <div>
                <h4 className="font-spiritual text-base font-bold text-slate-900 group-hover:text-amber-900 transition">
                  المكتبة الروحية والمعرفية
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  مقالات موثقة، كتب كنسية مع متابعة القراءة وتدوين الملاحظات، ومراجع أكاديمية نقدية.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>دخول المكتبة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Hub 2: ورش العمل التفاعلية */}
          <div
            onClick={onNavigateToWorkshops}
            className="bg-white rounded-3xl p-5 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  🛠️
                </span>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  10 ورش عمل
                </span>
              </div>
              <div>
                <h4 className="font-spiritual text-base font-bold text-slate-900 group-hover:text-indigo-900 transition">
                  ورش العمل التفاعلية
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  دراسة النصوص، إعداد العظات، إدارة اللقاءات، القيادة، والبحث والتوثيق الكنسي.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-900">
              <span>بدء الورش</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Hub 3: مختبر الإبداع */}
          <div
            onClick={onNavigateToCreativeLab}
            className="bg-white rounded-3xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  🎨
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  الإنتاج الخدمي
                </span>
              </div>
              <div>
                <h4 className="font-spiritual text-base font-bold text-slate-900 group-hover:text-purple-900 transition">
                  مختبر الإبداع والخدمة
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  إعداد العظات واللقاءات، كتابة التأملات، الأنشطة التفاعلية، وتحديات الذاكرة.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-900">
              <span>فتح الاستوديو</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Hub 4: أدوات الدراسة والمسابقات */}
          <div
            onClick={onNavigateToStudyTools}
            className="bg-white rounded-3xl p-5 border-2 border-rose-200 hover:border-rose-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                  🧠
                </span>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  تدريب وبطاقات
                </span>
              </div>
              <div>
                <h4 className="font-spiritual text-base font-bold text-slate-900 group-hover:text-rose-900 transition">
                  منصة التدريب والدراسة
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  الاختبار الفردي، مسابقة الفرق، تحدي السرعة، مراجعة الأسئلة الخاطئة، والبطاقات التعليمية.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-900">
              <span>بدء التدريب</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SPIRITUAL FATHER & COMPANION CORNER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-100/60 border-2 border-amber-300 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 text-right">
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
              🕊️ المرشد • أبونا الروحي
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

      {/* ========================================================================= */}
      {/* 5. SPIRITUAL LIFE, OASIS, & PERSONAL SPACE PATHWAYS */}
      {/* ========================================================================= */}
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

        {/* 2. واحة التكريس */}
        <div
          onClick={onNavigateToMonasticOasis}
          className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                🌴
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                فضائل ومسبحة
              </span>
            </div>
            <div>
              <h3 className="font-spiritual text-lg font-bold text-slate-900 group-hover:text-amber-900 transition">
                واحة التكريس والنمو
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                عجلة الفضائل النسيكية، مسبحة صلاة يسوع، دراسة أمهات البرية، ومولد بطاقات الهوية التكريسية الشرفية.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>دخول واحة التكريس</span>
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

      {/* ========================================================================= */}
      {/* 6. OFFICIAL COMPETITION SECTION CARD (INDEPENDENT & EQUAL SECTION) */}
      {/* ========================================================================= */}
      <div
        onClick={onNavigateToCompetitions}
        className="rounded-3xl bg-gradient-to-r from-amber-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border-2 border-amber-400/50 hover:border-amber-300 transition cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6 group text-right"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-indigo-950 flex items-center justify-center text-3xl font-black shadow-lg flex-shrink-0 group-hover:scale-105 transition">
            🏆
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-950 bg-amber-300 px-2.5 py-0.5 rounded-full">
                قسم مستقل ومعتمد
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                🟢 المراحل الست مفتوحة
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-spiritual text-amber-100">
              المسابقة الرسمية ومراحل التقييم الست
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              خمس جولات إلكترونية متدرجة + التتويج الكبير، بنك أسئلة مركزي من 95 سؤالاً موثقاً، شروط تأهل دقيقة ومحرك ترتيب عادل.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-5 py-3 rounded-2xl text-amber-200 font-bold text-xs sm:text-sm transition flex-shrink-0">
          <span>دخول المسابقة الرسمية</span>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        </div>
      </div>
    </div>
  );
};

