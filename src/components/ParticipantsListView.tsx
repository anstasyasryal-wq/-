import React from 'react';
import { getStoredUsers } from '../utils/competitionEngine';
import { Users, ChevronLeft, Trophy, User as UserIcon } from 'lucide-react';

interface ParticipantsListViewProps {
  onOpenRegister: () => void;
  onStartStage: (stageId: number) => void;
  onBackToHome: () => void;
}

export const ParticipantsListView: React.FC<ParticipantsListViewProps> = ({
  onOpenRegister,
  onStartStage,
  onBackToHome,
}) => {
  const users = getStoredUsers();

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

      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>سجل المشاركين والمكرسين</span>
          </div>
          <h1 className="font-spiritual text-2xl font-bold text-amber-100">
            قائمة المشاركين المسجلين في المسابقة
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            إجمالي المشاركين النشطين في المراحل التنافسية ({users.length} مكرس/ة)
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          تسجيل مشارك جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-base">
                👤
              </div>
              <div>
                <strong className="text-stone-100 block text-sm">{u.name}</strong>
                <span className="text-stone-400">{u.vocation} • {u.diocese}</span>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="text-amber-400 font-bold block">{u.totalScore} نقطة</span>
              <span className="text-stone-500 text-[10px]">المرحلة {u.currentStageId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
