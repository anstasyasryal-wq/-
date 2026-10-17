import React, { useState } from 'react';
import { getStoredStages, saveStages, getStoredUsers } from '../utils/competitionEngine';
import { Shield, Play, Lock, Unlock, Trophy, Users, ChevronLeft } from 'lucide-react';

interface SupervisorDashboardProps {
  onTestStageAsAdmin: (stageId: number) => void;
  onBackToHome?: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  onTestStageAsAdmin,
  onBackToHome,
}) => {
  const [stages, setStages] = useState(getStoredStages());
  const users = getStoredUsers();

  const handleToggleStage = (stgId: number) => {
    const updated = stages.map((s) =>
      s.id === stgId ? { ...s, isOpen: !s.isOpen } : s
    );
    setStages(updated);
    saveStages(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {onBackToHome && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة للشاشة الرئيسية والعجلة</span>
          </button>
        </div>
      )}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>لوحة تحكم المشرف والموجه العام</span>
        </div>
        <h1 className="font-spiritual text-2xl font-bold text-amber-100">
          إدارة مراحل المسابقة وتوجيه المتأهلين
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          التحكم في فتح وإغلاق المراحل، مراجعة درجات المشاركين، واختبار الأسئلة الجديدة بصلاحيات المشرف.
        </p>
      </div>

      <div className="space-y-3">
        {stages.map((stg) => (
          <div
            key={stg.id}
            className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stg.icon}</span>
              <div>
                <strong className="text-stone-100 text-sm block">{stg.title}</strong>
                <span className="text-stone-400">{stg.questionIds.length} أسئلة • {stg.timeLimitSec} ثانية</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleStage(stg.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                  stg.isOpen
                    ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-800 border border-stone-700 text-stone-400'
                }`}
              >
                {stg.isOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{stg.isOpen ? 'مفتوحة للمشاركين' : 'مغلقة مؤقتاً'}</span>
              </button>

              <button
                onClick={() => onTestStageAsAdmin(stg.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>اختبار المرحلة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
