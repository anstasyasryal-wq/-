import React, { useState } from 'react';
import { User } from '../types';
import { getStoredUsers } from '../utils/competitionEngine';
import {
  Users,
  Search,
  Filter,
  Award,
  Calendar,
  Building,
  MapPin,
  KeyRound,
  CheckCircle2,
  Printer,
  PlusCircle,
  Trophy,
  ChevronLeft,
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiocese, setSelectedDiocese] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const users: User[] = getStoredUsers().filter((u) => u.role === 'participant');

  // Extract unique dioceses for filter
  const dioceses = Array.from(new Set(users.map((u) => u.diocese).filter(Boolean)));
  const houses = Array.from(new Set(users.map((u) => u.consecrationHouse).filter(Boolean)));

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.consecrationHouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.diocese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.governorate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiocese = selectedDiocese === 'all' || u.diocese === selectedDiocese;
    const matchesStage =
      selectedStage === 'all' ||
      (selectedStage === 'final' && u.isQualifiedForFinal) ||
      String(u.currentStageId) === selectedStage;

    return matchesSearch && matchesDiocese && matchesStage;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-amber-300/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-2">
            <Users className="w-4 h-4 text-amber-300" />
            <span>سجل المتسابقات الرسمي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-spiritual text-amber-100">
            📋 من سجل في المسابقة؟ (قائمة المشاركات)
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
            استعراض كامل لبيانات وأكواد ونتائج جميع المكرسات والخادمات المسجلات في المسابقة
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenRegister}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 fill-indigo-950 text-amber-500" />
            <span>تسجيل متسابقة جديدة</span>
          </button>
          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة الكشف</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">إجمالي المسجلات</span>
          <span className="text-2xl font-black text-indigo-950">{users.length} مكرسة</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">بيوت التكريس المشاركة</span>
          <span className="text-2xl font-black text-amber-700">{houses.length} بيت ودير</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">الإيبارشيات الممثلة</span>
          <span className="text-2xl font-black text-purple-700">{dioceses.length} إيبارشية</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">المتأهلات للنهائي</span>
          <span className="text-2xl font-black text-emerald-700">
            {users.filter((u) => u.isQualifiedForFinal).length}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحثي بالاسم، كود المشاركة (MK-XXX)، بيت التكريس، أو الإيبارشية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
          </div>

          {/* Diocese Filter */}
          <div className="sm:w-56">
            <select
              value={selectedDiocese}
              onChange={(e) => setSelectedDiocese(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع الإيبارشيات ({dioceses.length})</option>
              {dioceses.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="sm:w-44">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع المراحل</option>
              <option value="1">المرحلة 1: البداية</option>
              <option value="2">المرحلة 2: الاكتشاف</option>
              <option value="3">المرحلة 3: التحدي السريع</option>
              <option value="4">المرحلة 4: الحواس</option>
              <option value="5">المرحلة 5: التحدي الكبير</option>
              <option value="final">👑 المتأهلات للنهائي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>نتائج البحث: {filteredUsers.length} متسابقة</span>
          <span>مرتبة تنازلياً حسب مجموع النقاط والتصفيات</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">لا توجد نتائج مطابقة لبحثكِ</h3>
            <p className="text-xs text-slate-500">
              تأكدي من صحة كود المشاركة أو الاسم المكتوب، أو قومي بإلغاء الفلتر.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredUsers.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition text-right space-y-3"
              >
                {/* Header: Name & Code */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                      {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : '🕊️'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                      <span className="inline-block text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-0.5">
                        كود: {p.code}
                      </span>
                    </div>
                  </div>

                  {p.isQualifiedForFinal ? (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-1 rounded-full whitespace-nowrap">
                      👑 مؤهلة للنهائي
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                      المرحلة {p.currentStageId}
                    </span>
                  )}
                </div>

                {/* House & Diocese */}
                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.consecrationHouse}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.diocese} • {p.governorate}</span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
                    <span className="text-[10px] text-amber-800 block">إجمالي النقاط</span>
                    <span className="font-bold text-amber-900 text-sm font-mono">
                      {p.totalPoints}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">الإجابات الصحيحة</span>
                    <span className="font-bold text-emerald-700 text-xs font-mono">
                      {p.correctAnswersCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">المرحلة الحالية</span>
                    <span className="font-bold text-indigo-900 text-xs font-mono">
                      {p.currentStageId === 6 ? 'النهائي' : `جولة ${p.currentStageId}`}
                    </span>
                  </div>
                </div>

                {/* Detailed Stage Scores Pill if any */}
                {Object.keys(p.stageScores).length > 0 && (
                  <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg flex items-center justify-between">
                    <span>درجات المراحل:</span>
                    <div className="flex gap-2 font-mono">
                      {Object.entries(p.stageScores).map(([stg, sc]) => (
                        <span key={stg} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          م{stg}: {sc}ن
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
