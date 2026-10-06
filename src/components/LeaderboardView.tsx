import React, { useState } from 'react';
import { User, DioceseRanking } from '../types';
import {
  getStoredUsers,
  sortParticipantsByTieBreaker,
  getDiocesesRankings,
} from '../utils/competitionEngine';
import {
  Trophy,
  Medal,
  User as UserIcon,
  Layers,
  Sparkles,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Printer,
  ChevronLeft,
} from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: User | null;
  onOpenRegister: () => void;
  onStartStage: (stageId: number) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onOpenRegister,
  onStartStage,
}) => {
  const [tab, setTab] = useState<'general' | 'personal' | 'dioceses'>('general');

  const allUsers = getStoredUsers().filter((u) => u.role === 'participant');
  const sortedParticipants = sortParticipantsByTieBreaker(allUsers);
  const diocesesRankings = getDiocesesRankings();

  // Find current user's rank
  const myRank = currentUser
    ? sortedParticipants.findIndex((u) => u.id === currentUser.id) + 1
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-spiritual text-slate-900">
          🏆 لوحة الشرف والترتيب الإلكتروني
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          تصنيف لحظي وفق قواعد كسر التعادل الآلية (النقاط، الصحة، والسرعة)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1 max-w-md mx-auto">
        <button
          onClick={() => setTab('general')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === 'general'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>الترتيب العام</span>
        </button>
        <button
          onClick={() => setTab('personal')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === 'personal'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>ترتيبي الشخصي</span>
        </button>
        <button
          onClick={() => setTab('dioceses')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === 'dioceses'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>ترتيب الإيبارشيات</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: General Leaderboard */}
      {/* ========================================================= */}
      {tab === 'general' && (
        <div className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {sortedParticipants.slice(0, 3).map((p, idx) => {
              const medals = ['🥇 المركز الأول', '🥈 المركز الثاني', '🥉 المركز الثالث'];
              const cardColors = [
                'from-amber-500/20 to-amber-100/50 border-amber-300 ring-2 ring-amber-400',
                'from-slate-200/50 to-slate-100 border-slate-300',
                'from-amber-700/10 to-amber-50 border-amber-600/30',
              ];

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl bg-gradient-to-b ${cardColors[idx]} border text-center space-y-2 relative shadow-sm`}
                >
                  <span className="text-xs font-bold text-amber-900 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                    {medals[idx]}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                  <p className="text-[11px] text-slate-600">{p.consecrationHouse}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-center gap-3 text-xs">
                    <span className="font-bold text-amber-800">{p.totalPoints} نقطة</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-700 font-semibold">{p.correctAnswersCount} صائبة</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Table */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-4 text-center">المركز</th>
                    <th className="py-3.5 px-4">اسم المكرسة</th>
                    <th className="py-3.5 px-4">بيت التكريس والإيبارشية</th>
                    <th className="py-3.5 px-4 text-center">النقاط</th>
                    <th className="py-3.5 px-4 text-center">الإجابات الصحيحة</th>
                    <th className="py-3.5 px-4 text-center">حالة التأهل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedParticipants.map((p, idx) => {
                    const isMe = currentUser && currentUser.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-slate-50 transition ${
                          isMe ? 'bg-amber-50/80 font-bold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {idx === 0
                            ? '🥇 1'
                            : idx === 1
                            ? '🥈 2'
                            : idx === 2
                            ? '🥉 3'
                            : `#${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-900 font-semibold">{p.name}</span>
                          {isMe && (
                            <span className="mr-2 text-[10px] text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                              أنتِ
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{p.consecrationHouse}</div>
                          <div className="text-[10px] text-slate-400">{p.diocese}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-800 font-mono text-sm">
                          {p.totalPoints}
                        </td>
                        <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold font-mono">
                          {p.correctAnswersCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {p.isQualifiedForFinal ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              👑 مؤهلة للنهائي
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              المرحلة {p.currentStageId}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: Personal Rank Card */}
      {/* ========================================================= */}
      {tab === 'personal' && (
        <div className="max-w-md mx-auto">
          {currentUser ? (
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-amber-300 shadow-xl space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border-2 border-amber-300">
                <Medal className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  بطاقة المتسابقة الرسمية
                </span>
                <h2 className="text-xl font-bold font-spiritual text-slate-900 mt-2">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser.consecrationHouse} • {currentUser.diocese}
                </p>
                <span className="inline-block font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded mt-2 border border-slate-200">
                  كود المشاركة: {currentUser.code}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-right">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">المركز العام الحالي</span>
                  <span className="text-xl font-black text-amber-800">
                    المركز {myRank || '—'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">مجموع النقاط</span>
                  <span className="text-xl font-black text-indigo-900">
                    {currentUser.totalPoints} نقطة
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">الإجابات الصحيحة</span>
                  <span className="text-xl font-black text-emerald-700">
                    {currentUser.correctAnswersCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">المرحلة المؤهلة</span>
                  <span className="text-xl font-black text-purple-700">
                    {currentUser.currentStageId === 6 ? 'النهائي الكبير' : `المرحلة ${currentUser.currentStageId}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStartStage(currentUser.currentStageId)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-xs hover:brightness-105 shadow-md transition cursor-pointer"
              >
                متابعة خوض المسابقة الآن
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm text-center space-y-4">
              <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">لم تسجلي دخولكِ بعد</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                سجلي دخولكِ بكود المشاركة أو أنشئي حساباً جديداً لعرض ترتيبكِ ونقاطكِ بدقة.
              </p>
              <button
                onClick={onOpenRegister}
                className="py-2.5 px-6 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition cursor-pointer"
              >
                تسجيل الدخول / حساب جديد
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: Dioceses Ranking */}
      {/* ========================================================= */}
      {tab === 'dioceses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs">
            💡 يتم احتساب ترتيب الإيبارشيات بناءً على متوسط درجات المكرسات المشاركات من كل إيبارشية بالإضافة لإجمالي النقاط المسجلة.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diocesesRankings.map((d) => (
              <div
                key={d.name}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                    المركز {d.rank}
                  </span>
                  <span className="font-bold text-base text-slate-900">{d.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">المتوسط</span>
                    <span className="font-bold text-indigo-900 text-xs">{d.averageScore}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">المشاركات</span>
                    <span className="font-bold text-slate-800 text-xs">{d.participantsCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">مجموع النقاط</span>
                    <span className="font-bold text-amber-800 text-xs">{d.totalPoints}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  بيت التكريس المتصدر:{' '}
                  <span className="font-semibold text-slate-700">{d.topHouse}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
