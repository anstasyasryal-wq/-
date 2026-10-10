import React from 'react';
import { User, Stage, Announcement } from '../types';
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
}) => {
  const currentEligibleStageId = currentUser ? currentUser.currentStageId : 1;
  const activeAnnouncement = announcements[0] || null;

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
                ميثاق وهوية التكريس البتولي
              </span>
              <h2 className="text-base sm:text-lg font-bold font-spiritual text-slate-900 mt-0.5">
                تعريف المكرسة بهويتها، ورسالتها، وميدان خدمتها
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
              سجلي هويتكِ وخدمتكِ الآن
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
                  {currentUser.consecrationRank || 'مكرسة دائمة'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {currentUser.consecrationHouse} • {currentUser.diocese}
              </p>
              <div className="text-xs text-indigo-950 font-semibold bg-indigo-50/80 p-2 rounded-xl border border-indigo-100">
                ميدان الخدمة: {currentUser.ministryField || 'خدمة عامة وافتقاد'}
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
                  '«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ؛ فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ»'}
              </p>
            </div>

            {/* Mission Bio */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500">
                رسالتكِ في التكريس والشهادة للمسيح:
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
              أهلاً بكِ أختنا المكرسة المباركة! خصصنا هذه المنصة لتجمع بين المعرفة اللاهوتية والكتابية والذكاء وسرعة البديهة.
              قومي بتسجيل هويتكِ التكريسية ورتبتكِ ومجال خدمتكِ، لتنطلقي في جولات المنافسة الشريفة.
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
          <span>🟢 المسابقة مفتوحة لجميع الإيبارشيات وبيوت التكريس</span>
        </div>

        {/* Title & Slogan */}
        <h1 className="text-3xl sm:text-5xl font-black font-spiritual text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white tracking-wide">
          🏆 المكرَّسة المثالية
        </h1>
        <p className="text-sm sm:text-lg text-amber-200/90 font-medium mt-2">
          مسابقة المعرفة والذكاء والتحدي
        </p>

        {/* Motto Callout */}
        <div className="my-5 inline-block px-5 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
          <p className="text-base sm:text-xl font-bold font-spiritual text-amber-100 tracking-wider">
            «اعرفي... فكري... تحدّي... وتأهلي!»
          </p>
        </div>

        {/* Action Buttons (The Main Primary Actions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          {/* Button 1: ابدئي المسابقة */}
          <button
            onClick={() => onStartStage(currentEligibleStageId)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-indigo-950 font-black text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-indigo-950" />
            <span>▶️ ابدئي المسابقة</span>
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
            <span>📜 قواعد المسابقة</span>
          </button>
        </div>

        {/* PWA Install Quick Prompt */}
        <div className="pt-4 max-w-md mx-auto">
          <PWAInstallButton variant="hero" />
        </div>
      </div>

      {/* PWA Installation Card */}
      <PWAInstallButton variant="banner" />

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
                سجل المشاركات الرسمي
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                📋 من سجل في المسابقة؟ (المشاركات)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                استعراض الأسماء، بيوت التكريس، الإيبارشيات، وأكواد المتسابقات
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
                المسابقات والاختبارات الستة
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
                🎮 دليل الاختبارات والمسابقات
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                استكشاف جميع الاختبارات، المسابقة الفردية، وتحدي الفرق
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
