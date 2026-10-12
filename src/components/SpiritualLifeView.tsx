import React, { useState } from 'react';
import { User } from '../types';
import { BibleReadingPlan } from '../types/spiritual';
import { BIBLE_READING_PLANS } from '../data/spiritualPlans';
import { getPlanProgress, togglePlanDayCompletion } from '../utils/spiritualStorage';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  Quote,
  Flame,
  ArrowRight,
  Filter,
  Check,
  Moon,
  Sun,
} from 'lucide-react';

interface SpiritualLifeViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenSpiritualGuide: () => void;
  onOpenRosaryInOasis?: () => void;
  onBackToHome: () => void;
}

export const SpiritualLifeView: React.FC<SpiritualLifeViewProps> = ({
  currentUser,
  onOpenLogin,
  onOpenSpiritualGuide,
  onBackToHome,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    if (currentUser?.vocation === 'كاهن') return 'plan-shepherd-heart';
    if (currentUser?.vocation === 'راهب' || currentUser?.vocation === 'راهبة') return 'plan-monastic-lamp';
    if (currentUser?.vocation === 'مكرسة') return 'plan-mary-portion';
    return 'plan-shepherd-heart';
  });

  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'plans' | 'practices' | 'mothers'>('plans');

  const {
    isNightMode,
    toggleNightMode,
    getCardClass,
    getHeaderTextClass,
    getBodyTextClass,
    getVerseBoxClass,
    getFontSizeClass,
  } = useReadingTheme();

  // Selected plan
  const selectedPlan = BIBLE_READING_PLANS.find((p) => p.id === selectedPlanId) || BIBLE_READING_PLANS[0];

  // User progress
  const userId = currentUser ? currentUser.id : 'guest_spiritual_user';
  const [progress, setProgress] = useState(() => getPlanProgress(userId, selectedPlan.id));

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setProgress(getPlanProgress(userId, planId));
    setExpandedDay(1);
  };

  const handleToggleDay = (dayNumber: number) => {
    soundManager.playTick();
    const updated = togglePlanDayCompletion(userId, selectedPlan.id, dayNumber);
    setProgress(updated);

    if (updated.completedDays.includes(dayNumber)) {
      if (updated.completedDays.length === selectedPlan.days.length) {
        soundManager.playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        soundManager.playCorrect();
      }
    }
  };

  const completionPercentage = Math.round(
    (progress.completedDays.length / selectedPlan.days.length) * 100
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in text-right">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ركن الحياة الروحية والمراجعة اليومية</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight mb-2">
            🌱 مائدة الغذاء الروحي وسكيب النعمة
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            خطط قراءة وتأمل كتابية مخصصة لكل دعوة (الكاهن، الراهب، الراهبة، المكرسة)، تساعدك على حراسة سكون مخدعك وسكب محبة الله في قلبك وخدمتك اليومية.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenSpiritualGuide}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>🕊️ استشارة الأب الروحي</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Eye-Comfort Night Reading Mode Quick Banner */}
      <div
        className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300 ${
          isNightMode
            ? 'bg-[#201d19] border-[#443c32] text-amber-100 shadow-md'
            : 'bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-100/50 border-amber-200/80 text-stone-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
              isNightMode
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isNightMode ? '🌙' : '📖'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-spiritual font-bold text-sm sm:text-base">
                وضع القراءة الليلي لخطة التأمل والمخدع
              </span>
              {isNightMode && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                  خلفية ورقية مخففة
                </span>
              )}
            </div>
            <p className={`text-[11px] leading-tight ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
              قراءة هادئة للمزامير والآيات مع تباين مريح للعين لحراسة سكون الليل والقلاية.
            </p>
          </div>
        </div>

        <button
          onClick={toggleNightMode}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer self-end sm:self-auto ${
            isNightMode
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-100'
          }`}
        >
          {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isNightMode ? 'العودة للوضع النهاري' : 'تفعيل القراءة الليلية'}</span>
        </button>
      </div>

      {/* Plans Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-spiritual text-xl sm:text-2xl font-bold ${getHeaderTextClass()}`}>
              اختر خطة القراءة والتأمل الكتابي
            </h2>
            <p className={`text-xs ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
              خطط تأملية مدتها 7 أيام تركز على فضائل التكريس وأمانة الرعاية
            </p>
          </div>
          {!currentUser && (
            <button
              onClick={onOpenLogin}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                isNightMode
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                  : 'text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              تسجيل الدخول لحفظ التقدم باسمك
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BIBLE_READING_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            const userProg = getPlanProgress(userId, plan.id);
            const isFinished = userProg.completedDays.length === plan.days.length;

            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? isNightMode
                      ? 'border-amber-500 bg-[#2b2620] shadow-md ring-2 ring-amber-900/60'
                      : 'border-amber-600 bg-white shadow-md ring-2 ring-amber-200'
                    : isNightMode
                    ? 'border-[#38332c] bg-[#1e1c19] hover:border-amber-700/60'
                    : 'border-stone-200 bg-white/70 hover:border-amber-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{plan.icon}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNightMode
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : plan.colorScheme.badge
                      }`}
                    >
                      {plan.vocationTarget === 'الكل' ? 'لجميع الفئات' : plan.vocationTarget}
                    </span>
                  </div>

                  <h3 className={`font-spiritual text-base font-bold mb-1 ${getHeaderTextClass()}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed mb-3 ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    {plan.subtitle}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs ${isNightMode ? 'border-[#38332c]' : 'border-stone-100'}`}>
                  <span className={`text-[11px] font-bold ${isNightMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    {userProg.completedDays.length} / {plan.days.length} أيام
                  </span>
                  {isFinished ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      <Check className="w-3 h-3" />
                      <span>مكتملة</span>
                    </span>
                  ) : (
                    <span className={`text-[11px] font-bold ${isNightMode ? 'text-amber-400' : 'text-amber-800'}`}>
                      {isSelected ? 'قيد التصفح' : 'عرض الخطة'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Plan Details & Progress */}
      <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${getCardClass()}`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${isNightMode ? 'border-[#38332c]' : 'border-stone-100'}`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0 ${
                isNightMode
                  ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {selectedPlan.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-spiritual text-xl sm:text-2xl font-bold ${getHeaderTextClass()}`}>
                  {selectedPlan.title}
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isNightMode
                      ? 'text-amber-300 bg-amber-950 border border-amber-800'
                      : 'text-amber-800 bg-amber-100'
                  }`}
                >
                  {selectedPlan.durationDays} أيام تأملية
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 ${isNightMode ? 'text-stone-300' : 'text-stone-600'}`}>
                {selectedPlan.description}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className={`sm:text-left text-right min-w-[160px] p-3 rounded-2xl border ${
              isNightMode ? 'bg-[#181614] border-[#38332c]' : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className={`flex items-center justify-between text-xs font-bold mb-1.5 ${isNightMode ? 'text-stone-300' : 'text-stone-700'}`}>
              <span>نسبة الإنجاز</span>
              <span className="text-amber-500 font-mono">{completionPercentage}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isNightMode ? 'bg-[#292520]' : 'bg-stone-200'}`}>
              <div
                className="h-full bg-gradient-to-l from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          <h4 className={`font-spiritual text-lg font-bold ${getHeaderTextClass()}`}>
            خطوات الأيام السبعة:
          </h4>

          {selectedPlan.days.map((day) => {
            const isCompleted = progress.completedDays.includes(day.dayNumber);
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? isNightMode
                      ? 'border-emerald-800/60 bg-emerald-950/20'
                      : 'border-emerald-200 bg-emerald-50/30'
                    : isNightMode
                    ? 'border-[#38332c] bg-[#1d1b18] hover:border-amber-700/60'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                {/* Header */}
                <div
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDay(day.dayNumber);
                      }}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isNightMode
                          ? 'border-2 border-stone-600 hover:border-amber-500 text-transparent'
                          : 'border-2 border-stone-300 hover:border-amber-600 text-transparent'
                      }`}
                      title={isCompleted ? 'إلغاء وضع علامة الإتمام' : 'تحديد اليوم كمكتمل'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isNightMode
                              ? 'text-amber-300 bg-amber-950 border border-amber-800'
                              : 'text-amber-800 bg-amber-100'
                          }`}
                        >
                          اليوم {day.dayNumber}
                        </span>
                        <h5
                          className={`font-spiritual text-base sm:text-lg font-bold ${
                            isCompleted
                              ? 'text-emerald-500 line-through opacity-80'
                              : getHeaderTextClass()
                          }`}
                        >
                          {day.title}
                        </h5>
                      </div>
                      <p className={`text-xs font-sans mt-0.5 ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {day.passage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-stone-400 hidden sm:inline">
                      {isExpanded ? 'طي التأمل' : 'عرض التأمل'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className={`px-5 pb-5 pt-1 border-t space-y-4 ${getFontSizeClass()} ${
                      isNightMode ? 'border-[#38332c]' : 'border-stone-100'
                    }`}
                  >
                    {/* Key Verse Box */}
                    <div className={`p-3.5 rounded-xl border ${getVerseBoxClass()}`}>
                      <span className="text-[10px] font-bold text-amber-500 block mb-1 flex items-center gap-1">
                        <Quote className="w-3 h-3" />
                        الآية الذهبية للتأمل وترديد الفكر:
                      </span>
                      <p className="font-spiritual font-bold text-sm sm:text-base leading-relaxed">
                        {day.keyVerse}
                      </p>
                    </div>

                    {/* Reflection */}
                    <div className="space-y-1">
                      <h6 className={`font-spiritual font-bold text-sm ${getHeaderTextClass()}`}>
                        تأمل اليوم في مخدعك:
                      </h6>
                      <p className={`leading-relaxed font-sans ${getBodyTextClass()}`}>
                        {day.reflection}
                      </p>
                    </div>

                    {/* Practical Practice */}
                    <div
                      className={`p-3.5 rounded-xl border space-y-1 ${
                        isNightMode
                          ? 'bg-[#181614] border-[#38332c] text-stone-300'
                          : 'bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                        <Flame className="w-3.5 h-3.5 text-emerald-500" />
                        <span>التدريب الروحي العملي لليوم:</span>
                      </div>
                      <p className={`leading-relaxed ${getBodyTextClass()}`}>
                        {day.spiritualPractice}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(day.dayNumber)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isCompleted
                            ? isNightMode
                              ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'إلغاء الإتمام' : 'إتمام قراءة وتدريب اليوم'}</span>
                      </button>

                      {day.dayNumber < selectedPlan.days.length && (
                        <button
                          type="button"
                          onClick={() => setExpandedDay(day.dayNumber + 1)}
                          className={`text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer ${
                            isNightMode ? 'text-amber-400' : 'text-amber-800'
                          }`}
                        >
                          <span>اليوم التالي</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
