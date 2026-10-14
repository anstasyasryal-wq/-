import React, { useState } from 'react';
import { EMERGENCY_RESCUE_PLANS, EmergencyRescuePlan } from '../data/emergencyRescuePlans';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import {
  ShieldAlert,
  X,
  Sparkles,
  Heart,
  BookOpen,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Flame,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSituation?: 'distress' | 'boredom' | 'lukewarmness' | 'anger';
}

export const EmergencyRescueModal: React.FC<EmergencyRescueModalProps> = ({
  isOpen,
  onClose,
  initialSituation = 'distress',
}) => {
  const [activePlanId, setActivePlanId] = useState<string>(() => {
    const found = EMERGENCY_RESCUE_PLANS.find((p) => p.situation === initialSituation);
    return found ? found.id : EMERGENCY_RESCUE_PLANS[0].id;
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const {
    isNightMode,
    getCardClass,
    getHeaderTextClass,
    getBodyTextClass,
  } = useReadingTheme();

  if (!isOpen) return null;

  const currentPlan =
    EMERGENCY_RESCUE_PLANS.find((p) => p.id === activePlanId) || EMERGENCY_RESCUE_PLANS[0];

  const handleToggleStep = (stepNumber: number) => {
    soundManager.playTick();
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      const next = [...completedSteps, stepNumber];
      setCompletedSteps(next);
      if (next.length === currentPlan.immediateSteps.length) {
        soundManager.playVictory();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        soundManager.playCorrect();
      }
    }
  };

  const handleSwitchPlan = (planId: string) => {
    soundManager.playTick();
    setActivePlanId(planId);
    setCompletedSteps([]);
    setAudioPlaying(false);
  };

  const completionPercent = Math.round(
    (completedSteps.length / currentPlan.immediateSteps.length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border flex flex-col transition-all duration-300 ${
          isNightMode
            ? 'bg-[#1c1815] border-amber-900/50 text-amber-100'
            : 'bg-stone-50 border-amber-200 text-stone-900'
        }`}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 relative overflow-hidden flex items-center justify-between border-b border-amber-800/40">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/70 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>خطط الإنقاذ السريعة والاسعافات الروحية</span>
            </div>
            <h2 className="font-spiritual text-xl sm:text-3xl font-bold text-amber-100">
              🚨 عيادة النفس وسكيب النعمة الفوري
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              اختر الحالة الطارئة التي تمر بها الآن، لتتلقى خطة إنقاذ روحية عاجلة وشفاء إلهي يجدد سلامك.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition border border-stone-700 cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Situation Selector Tabs */}
        <div className="p-4 sm:px-8 sm:pt-6 bg-amber-950/10 border-b border-amber-900/20 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {EMERGENCY_RESCUE_PLANS.map((plan) => {
            const isActive = plan.id === activePlanId;
            return (
              <button
                key={plan.id}
                onClick={() => handleSwitchPlan(plan.id)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-102'
                    : isNightMode
                    ? 'bg-[#25211c] text-stone-300 border-amber-900/40 hover:bg-amber-950/30'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{plan.icon}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />}
                </div>
                <span className="font-bold text-xs sm:text-sm leading-tight line-clamp-1">
                  {plan.title.replace('خطة طوارئ ', '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Plan Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Active Plan Header Banner */}
          <div
            className={`p-6 rounded-2xl border ${currentPlan.colorScheme.bg} ${currentPlan.colorScheme.border} ${currentPlan.colorScheme.text}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-3xl mb-2 inline-block">{currentPlan.icon}</span>
                <h3 className="font-spiritual text-xl sm:text-2xl font-bold">
                  {currentPlan.title}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-1">{currentPlan.subtitle}</p>
              </div>

              <div className="text-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur-xs border border-amber-200 shadow-xs hidden sm:block">
                <span className="block text-xs font-semibold text-stone-600">اكتمال الإنقاذ</span>
                <span className="text-lg font-bold text-amber-900">{completionPercent}%</span>
              </div>
            </div>

            {/* Key Verse Box */}
            <div className="mt-5 p-4 rounded-xl bg-white/90 border border-amber-300 shadow-xs text-stone-900">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>آية الملاذ: {currentPlan.keyVerse.reference}</span>
              </div>
              <p className="font-spiritual text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
                {currentPlan.keyVerse.text}
              </p>
            </div>

            {/* Patristic Wisdom Box */}
            <div className="mt-3 p-4 rounded-xl bg-stone-900/90 text-stone-100 border border-amber-700/50 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>بستان الآباء: {currentPlan.patristicWisdom.father}</span>
              </div>
              <p className="text-xs sm:text-sm italic text-stone-200 leading-relaxed">
                «{currentPlan.patristicWisdom.quote}»
              </p>
              <span className="block text-[10px] text-amber-300/80 mt-1 text-left">
                — {currentPlan.patristicWisdom.source}
              </span>
            </div>
          </div>

          {/* Immediate Steps Checklist */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-spiritual text-lg font-bold flex items-center gap-2">
                <span>🛡️ خطوات الإنقاذ السريع (نفذها الآن)</span>
              </h4>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                {completedSteps.length} من {currentPlan.immediateSteps.length} خطوات تم إنجازها
              </span>
            </div>

            <div className="space-y-3">
              {currentPlan.immediateSteps.map((step) => {
                const isDone = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => handleToggleStep(step.stepNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isDone
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                        : isNightMode
                        ? 'bg-[#25211c] border-amber-900/40 hover:border-amber-700 text-stone-200'
                        : 'bg-white border-stone-200 hover:border-amber-300 text-stone-800'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                    </div>

                    <div className="flex-1">
                      <h5 className={`font-bold text-sm sm:text-base ${isDone ? 'line-through opacity-80' : ''}`}>
                        {step.title}
                      </h5>
                      <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="self-center">
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rescue Prayer Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/10 via-amber-950/20 to-amber-900/10 border border-amber-600/30">
            <h4 className="font-spiritual text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <span>صلاة الطوارئ الختامية</span>
            </h4>
            <p className="font-spiritual text-sm sm:text-base leading-relaxed italic text-stone-800 dark:text-stone-200 bg-white/60 dark:bg-stone-900/60 p-4 rounded-xl border border-amber-200/50">
              {currentPlan.rescuePrayer}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-900/20 text-xs text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>اللحن المقترح للاستماع: {currentPlan.recommendedHymnOrMelody}</span>
              </span>
              <button
                onClick={() => {
                  soundManager.playVictory();
                  alert('تم حفظ سلامك في مذكرة المخدع. الرب يغمرك بنعمته!');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>✨ استعدت سلامي، اشكرك يا رب</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-stone-100 dark:bg-[#151210] border-t border-amber-900/20 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            «سلامي أترك لكم.. سلامي أُعطيكم» (يوحنا 14: 27)
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-sm transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
