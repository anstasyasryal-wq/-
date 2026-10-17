import React, { useState, useEffect } from 'react';
import { User, DioceseRanking } from '../types';
import {
  getStoredUsers,
  sortParticipantsByTieBreaker,
  getDiocesesRankings,
} from '../utils/competitionEngine';
import {
  Trophy,
  Medal,
  ChevronLeft,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: User | null;
  onOpenRegister: () => void;
  onStartStage: (stageId: number) => void;
  onBackToHome?: () => void;
  initialTab?: 'general' | 'dioceses';
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onOpenRegister,
  onStartStage,
  onBackToHome,
  initialTab,
}) => {
  const [tab, setTab] = useState<'general' | 'dioceses'>(initialTab || 'general');
  const allUsers = getStoredUsers();
  const sortedParticipants = sortParticipantsByTieBreaker(allUsers);
  const diocesesRankings = getDiocesesRankings();

  const myRank = currentUser
    ? sortedParticipants.findIndex((u) => u.id === currentUser.id) + 1
    : 0;

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

      {/* Title Card */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-3 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🏆 لوحة الشرف والصدارة والتميز
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
          تصنيف فوري للمشاركين والإيبارشيات وفق درجات التقييم في محاور العلوم الكنسية والجينات والثقافة.
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setTab('general')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'general'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            ترتيب الأفراد والمكرسين
          </button>
          <button
            onClick={() => setTab('dioceses')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'dioceses'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            ترتيب الإيبارشيات والأديرة
          </button>
        </div>
      </div>

      {/* Participants List */}
      {tab === 'general' && (
        <div className="space-y-3">
          {sortedParticipants.map((user, idx) => {
            const rank = idx + 1;
            const isMe = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 rounded-2xl border transition flex items-center justify-between text-xs ${
                  isMe
                    ? 'bg-amber-950/70 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : rank === 1
                    ? 'bg-stone-900 border-amber-500/60 shadow-md'
                    : 'bg-stone-900/80 border-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : rank === 2
                        ? 'bg-stone-300 text-stone-900'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-100 text-sm">{user.name}</strong>
                      {isMe && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-900 px-2 py-0.5 rounded-full border border-amber-600">
                          أنت
                        </span>
                      )}
                    </div>
                    <span className="text-stone-400">
                      {user.vocation} • {user.diocese}
                    </span>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-amber-400 font-black text-sm block">
                    {user.totalScore} نقطة
                  </span>
                  <span className="text-stone-500 text-[10px]">
                    المرحلة {user.currentStageId}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dioceses Ranking */}
      {tab === 'dioceses' && (
        <div className="space-y-3">
          {diocesesRankings.map((d, idx) => (
            <div
              key={d.diocese}
              className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 font-mono font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <strong className="text-stone-100 text-sm block">{d.diocese}</strong>
                  <span className="text-stone-400">
                    {d.participantsCount} مشارك ومكرس • متوسط النقاط: {d.avgScore}
                  </span>
                </div>
              </div>
              <span className="text-amber-400 font-mono font-bold text-sm">
                {d.totalPoints} نقطة
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
