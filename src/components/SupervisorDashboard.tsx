import React, { useState } from 'react';
import { User, Stage, Question, Announcement } from '../types';
import {
  getStoredUsers,
  getStoredStages,
  saveStages,
  getStoredQuestions,
  saveQuestions,
  getStoredAnnouncements,
  saveAnnouncements,
  runAutomaticQualifications,
} from '../utils/competitionEngine';
import {
  updateCloudStage,
  saveCloudQuestion,
  deleteCloudQuestion,
  postCloudAnnouncement,
} from '../utils/firebaseService';
import { soundManager } from '../utils/audio';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  PlusCircle,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  Bell,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface SupervisorDashboardProps {
  onTestStageAsAdmin: (stageId: number) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  onTestStageAsAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    'stats' | 'participants' | 'stages' | 'questions' | 'announcements'
  >('stats');

  const [stages, setStages] = useState<Stage[]>(getStoredStages());
  const [questions, setQuestions] = useState<Question[]>(getStoredQuestions());
  const [announcements, setAnnouncements] = useState<Announcement[]>(getStoredAnnouncements());
  const users = getStoredUsers().filter((u) => u.role === 'participant');

  // Automated qualification notification state
  const [qualificationReport, setQualificationReport] = useState<string | null>(null);

  // Question editing / addition modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);

  // New announcement form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Statistics calculation
  const totalParticipants = users.length;
  const activeParticipants = users.filter((u) => u.totalPoints > 0).length;
  const avgScore =
    totalParticipants > 0
      ? Math.round(users.reduce((acc, u) => acc + u.totalPoints, 0) / totalParticipants)
      : 0;
  const qualifiedForFinalCount = users.filter((u) => u.isQualifiedForFinal).length;

  // Toggle stage open/close
  const handleToggleStage = (stageId: number) => {
    const updated = stages.map((s) => (s.id === stageId ? { ...s, isOpen: !s.isOpen } : s));
    setStages(updated);
    saveStages(updated);
    const target = updated.find((s) => s.id === stageId);
    if (target) updateCloudStage(target).catch(console.warn);
    soundManager.playCorrect();
  };

  // Change stage qualification rule
  const handleUpdateStageQuota = (stageId: number, val: number) => {
    const updated = stages.map((s) =>
      s.id === stageId
        ? {
            ...s,
            qualificationRule: { ...s.qualificationRule, value: Math.max(1, val) },
          }
        : s
    );
    setStages(updated);
    saveStages(updated);
    const target = updated.find((s) => s.id === stageId);
    if (target) updateCloudStage(target).catch(console.warn);
  };

  // Change stage question time limit
  const handleUpdateStageTime = (stageId: number, seconds: number) => {
    const updated = stages.map((s) =>
      s.id === stageId
        ? {
            ...s,
            timePerQuestionSeconds: Math.max(5, seconds),
          }
        : s
    );
    setStages(updated);
    saveStages(updated);
    const target = updated.find((s) => s.id === stageId);
    if (target) updateCloudStage(target).catch(console.warn);
  };

  // Question filtering state
  const [questionFilterStage, setQuestionFilterStage] = useState<string>('all');
  const [questionSearch, setQuestionSearch] = useState<string>('');

  // Selected participant for details modal
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<User | null>(null);

  // Automatic Electronic Qualification Trigger
  const handleRunAutoQualification = (stageId: number) => {
    soundManager.playVictory();
    const result = runAutomaticQualifications(stageId);
    setQualificationReport(
      `🎉 تم تنفيذ التصفيات الإلكترونية التلقائية للمرحلة ${stageId}! تم تأهيل ${result.totalQualified} متسابقة وترقية ${result.promotedCount} إلى المرحلة التالية بنجاح.`
    );
  };

  // Question Management
  const handleOpenAddQuestion = () => {
    setEditingQuestion({
      stageId: 1,
      category: 'الكتاب المقدس',
      subCategory: 'العهد الجديد',
      questionType: 'mcq',
      difficulty: 'medium',
      points: 10,
      timeLimitSeconds: 25,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      reference: '',
      hint: '',
    });
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.question?.trim()) return;

    let updatedQuestions: Question[] = [];
    let savedTargetQuestion: Question | null = null;
    if (editingQuestion.id) {
      // Edit
      savedTargetQuestion = editingQuestion as Question;
      updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? ({ ...q, ...editingQuestion } as Question) : q
      );
    } else {
      // Add
      const newQ: Question = {
        ...editingQuestion,
        id: `q-custom-${Date.now()}`,
        isCustom: true,
      } as Question;
      savedTargetQuestion = newQ;
      updatedQuestions = [newQ, ...questions];
    }

    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
    if (savedTargetQuestion) {
      saveCloudQuestion(savedTargetQuestion).catch(console.warn);
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
    soundManager.playCorrect();
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا السؤال؟')) {
      const filtered = questions.filter((q) => q.id !== id);
      setQuestions(filtered);
      saveQuestions(filtered);
      deleteCloudQuestion(id).catch(console.warn);
      soundManager.playTick();
    }
  };

  // Announcements Management
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      date: new Date().toISOString().split('T')[0],
      isUrgent: false,
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveAnnouncements(updated);
    postCloudAnnouncement(newAnn).catch(console.warn);
    setNewAnnTitle('');
    setNewAnnContent('');
    soundManager.playCorrect();
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-purple-400/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>إدارة المسابقة والتصفيات الكنسية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-spiritual text-white">
              👩‍💼 لوحة تحكم المشرفة العامة
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              إشراف كامل على المتسابقات، الأسئلة، المراحل، والتصفيات الإلكترونية التلقائية
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onTestStageAsAdmin(1)}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-indigo-950" />
              <span>تجربة المسابقة الآن</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>📊 الإحصائيات والتصفيات</span>
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'participants'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>👥 المشاركات المسجلات ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'stages'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          <span>🏁 إدارة المراحل الخمس</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>📝 بنك وإدارة الأسئلة</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-rose-600" />
          <span>📢 الإعلانات العامة</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: Statistics & Automated Qualification */}
      {/* ========================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">إجمالي المشاركات</span>
              <span className="text-2xl font-black text-indigo-950">{totalParticipants}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">المشاركات النشطات</span>
              <span className="text-2xl font-black text-emerald-700">{activeParticipants}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">متوسط الدرجات</span>
              <span className="text-2xl font-black text-amber-700">{avgScore} نقطة</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">المتأهلات للنهائي</span>
              <span className="text-2xl font-black text-purple-700">{qualifiedForFinalCount}</span>
            </div>
          </div>

          {/* Electronic Qualifications Engine Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-indigo-50 border border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>🏆 نظام التصفيات الإلكتروني التلقائي</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                حساب وترتيب وترقية المتأهلات فورياً
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              يقوم النظام بتطبيق معايير كسر التعادل الآلية (مجموع النقاط، الإجابات الصحيحة، متوسط سرعة الإجابة، ونتيجة الجولة الأصعب) وتأهيل النسب المقررة تلقائياً بدون تدخل يدوي.
            </p>

            {qualificationReport && (
              <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold animate-fade-in">
                {qualificationReport}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => handleRunAutoQualification(1)}
                className="py-3 px-4 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-indigo-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⚡ تصفيات المرحلة الأولى (أفضل 30%)</span>
              </button>
              <button
                onClick={() => handleRunAutoQualification(2)}
                className="py-3 px-4 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-indigo-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⚡ تصفيات المرحلة الثانية (أفضل 15%)</span>
              </button>
              <button
                onClick={() => handleRunAutoQualification(3)}
                className="py-3 px-4 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-indigo-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⚡ تصفيات المرحلة الثالثة (أفضل 5%)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: Registered Participants Management (سجل المشاركات) */}
      {/* ========================================================= */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold block text-sm">👥 سجل المكرسات والخادمات المسجلات:</span>
              <p className="text-slate-700 mt-0.5">
                استعراض كامل لبيانات الهوية التكريسية، الرتبة الكنسية، مجال الخدمة، وآية التكريس لكل متسابقة.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-200 font-bold text-amber-950 font-mono text-xs">
              {users.length} متسابقة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {users.map((u, idx) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-right"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                      {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : '🕊️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {u.consecrationRank || 'مكرسة دائمة'}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                    كود: {u.code}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <p>
                    <span className="font-semibold text-slate-500">البيت والإيبارشية:</span>{' '}
                    {u.consecrationHouse} ({u.diocese})
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">ميدان الخدمة:</span>{' '}
                    <span className="text-indigo-900 font-bold">{u.ministryField || 'خدمة عامة'}</span>
                  </p>
                  {u.consecrationVerse && (
                    <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200 text-amber-900 font-spiritual text-xs">
                      {u.consecrationVerse}
                    </div>
                  )}
                  {u.personalBio && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2">
                      «{u.personalBio}»
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">النقاط</span>
                    <span className="font-bold text-amber-800 font-mono">{u.totalPoints}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">الإجابات</span>
                    <span className="font-bold text-emerald-700 font-mono">{u.correctAnswersCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">المرحلة</span>
                    <span className="font-bold text-purple-800">
                      {u.isQualifiedForFinal ? '👑 النهائي' : `مرحلة ${u.currentStageId}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedParticipantDetail(u)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-200"
                >
                  <span>🔍 استعراض نتائج المراحل وسجل الأداء</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: Manage Stages */}
      {/* ========================================================= */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            يمكنكِ فتح أو إغلاق أي مرحلة، وتعديل نسب أو أعداد المتأهلات المطلوب ترقيتهن إلكترونياً:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stages.map((stg) => (
              <div
                key={stg.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-right"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{stg.icon}</span>
                  <button
                    onClick={() => handleToggleStage(stg.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                      stg.isOpen
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                    }`}
                  >
                    {stg.isOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{stg.isOpen ? 'المرحلة مفتوحة' : 'المرحلة مغلقة'}</span>
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{stg.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{stg.subtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-slate-500 block text-[10px]">عدد الأسئلة</span>
                    <span className="font-bold text-slate-800">{stg.totalQuestions} سؤالاً</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-slate-500 block text-[10px]">زمن السؤال (ثوانٍ)</span>
                    <div className="flex items-center gap-1 justify-center mt-0.5">
                      <input
                        type="number"
                        min="5"
                        max="180"
                        value={stg.timePerQuestionSeconds}
                        onChange={(e) =>
                          handleUpdateStageTime(stg.id, parseInt(e.target.value) || 20)
                        }
                        className="w-14 px-1.5 py-0.5 text-center font-bold font-mono rounded-lg border border-slate-300 text-xs bg-white"
                      />
                      <span className="text-[10px] text-slate-500">ث</span>
                    </div>
                  </div>
                </div>

                {/* Quota Setting */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">
                    {stg.qualificationRule.type === 'percentage'
                      ? 'نسبة المتأهلات (%):'
                      : 'عدد المتأهلات النهائي:'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={stg.qualificationRule.value}
                    onChange={(e) => handleUpdateStageQuota(stg.id, parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 text-center font-bold font-mono rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: Questions Management */}
      {/* ========================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              إجمالي الأسئلة في البنك: <strong className="text-slate-800">{questions.length}</strong> سؤالاً
            </span>
            <button
              onClick={handleOpenAddQuestion}
              className="py-2 px-4 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <input
              type="text"
              placeholder="ابحثي في نص السؤال أو المرجع أو التصنيف..."
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              className="w-full sm:flex-1 py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-xs text-right"
            />
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['all', '1', '2', '3', '4', '5', '6'].map((stg) => (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setQuestionFilterStage(stg)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    questionFilterStage === stg
                      ? 'bg-indigo-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stg === 'all' ? 'جميع المراحل' : stg === '6' ? '👑 النهائي' : `مرحلة ${stg}`}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          {(() => {
            const filteredQuestions = questions.filter((q) => {
              const matchesStage =
                questionFilterStage === 'all' || String(q.stageId) === questionFilterStage;
              const matchesSearch =
                !questionSearch.trim() ||
                q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                q.category.toLowerCase().includes(questionSearch.toLowerCase()) ||
                (q.explanation && q.explanation.toLowerCase().includes(questionSearch.toLowerCase())) ||
                (q.reference && q.reference.toLowerCase().includes(questionSearch.toLowerCase()));
              return matchesStage && matchesSearch;
            });

            if (filteredQuestions.length === 0) {
              return (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  لا توجد أسئلة تطابق معايير البحث الحالية
                </div>
              );
            }

            return (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">
                  عرض {filteredQuestions.length} سؤالاً مطابقة:
                </p>
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-3 text-right"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          المرحلة {q.stageId || 1}
                        </span>
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {q.category}
                        </span>
                        {q.subCategory && (
                          <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                            {q.subCategory}
                          </span>
                        )}
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                          {q.points || 10} نقطة
                        </span>
                        {q.timeLimitSeconds && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            ⏱️ {q.timeLimitSeconds} ث
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
                        {q.question}
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">
                        الإجابة الصحيحة: {q.options[q.correctIndex]}
                      </p>
                      {q.reference && (
                        <p className="text-[10px] text-slate-400">
                          المرجع: {q.reference}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setShowQuestionModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        title="تعديل السؤال"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: Announcements Management */}
      {/* ========================================================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Add form */}
          <form
            onSubmit={handleAddAnnouncement}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <h3 className="font-bold text-slate-900 text-sm">إضافة إعلان عام لجميع المشاركات</h3>
            <div>
              <input
                type="text"
                required
                placeholder="عنوان الإعلان"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <textarea
                required
                rows={2}
                placeholder="تفاصيل الإعلان أو التوجيه الكنسي..."
                value={newAnnContent}
                onChange={(e) => setNewAnnContent(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-indigo-900 text-white font-bold text-xs hover:bg-indigo-800 transition cursor-pointer"
            >
              نشر الإعلان
            </button>
          </form>

          {/* List of announcements */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-3 text-right"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                    <h4 className="font-bold text-xs text-slate-900">{ann.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{ann.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Modal (Add / Edit) */}
      {showQuestionModal && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-right space-y-4 my-auto">
            <h3 className="font-bold text-base text-slate-900">
              {editingQuestion.id ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">المرحلة</label>
                  <select
                    value={editingQuestion.stageId || 1}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, stageId: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  >
                    <option value={1}>المرحلة 1: البداية</option>
                    <option value={2}>المرحلة 2: الاكتشاف</option>
                    <option value={3}>المرحلة 3: التحدي السريع</option>
                    <option value={4}>المرحلة 4: الحواس</option>
                    <option value={5}>المرحلة 5: التحدي الكبير</option>
                    <option value={6}>النهائي الكبير</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">النقاط</label>
                  <input
                    type="number"
                    value={editingQuestion.points || 10}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">نص السؤال</label>
                <textarea
                  required
                  rows={2}
                  value={editingQuestion.question || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question: e.target.value })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold">الخيارات الأربعة (وحددي الصحيح):</label>
                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={editingQuestion.correctIndex === optIdx}
                      onChange={() =>
                        setEditingQuestion({ ...editingQuestion, correctIndex: optIdx })
                      }
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      placeholder={`الخيار ${optIdx + 1}`}
                      value={editingQuestion.options?.[optIdx] || ''}
                      onChange={(e) => {
                        const newOpts = [...(editingQuestion.options || ['', '', '', ''])];
                        newOpts[optIdx] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          options: newOpts as [string, string, string, string],
                        });
                      }}
                      className="flex-1 px-2 py-1 rounded-lg border border-slate-300"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold mb-1">التفسير أو الشاهد</label>
                <input
                  type="text"
                  value={editingQuestion.explanation || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-900 text-white font-bold hover:bg-indigo-800 transition"
                >
                  حفظ السؤال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participant Detailed Breakdown Modal */}
      {selectedParticipantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-amber-200 overflow-hidden my-auto text-right animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-indigo-900 p-6 text-white text-right relative">
              <button
                type="button"
                onClick={() => setSelectedParticipantDetail(null)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
              >
                ✕
              </button>
              <div className="inline-flex px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold mb-2">
                كود المشاركة: {selectedParticipantDetail.code}
              </div>
              <h3 className="text-xl font-bold font-spiritual text-white">
                {selectedParticipantDetail.name}
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                {selectedParticipantDetail.consecrationHouse} • {selectedParticipantDetail.diocese}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* Identity & ministry info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">الرتبة الكنسية:</span>
                  <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    {selectedParticipantDetail.consecrationRank || 'مكرسة دائمة'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500">ميدان الخدمة:</span>
                  <span className="font-bold text-indigo-950">
                    {selectedParticipantDetail.ministryField || 'خدمة عامة وافتقاد'}
                  </span>
                </div>
                {selectedParticipantDetail.patronSaint && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500">القديسة الشفيعة:</span>
                    <span className="font-bold text-slate-800">
                      {selectedParticipantDetail.patronSaint}
                    </span>
                  </div>
                )}
                {selectedParticipantDetail.consecrationVerse && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 font-spiritual font-bold text-amber-900 mt-2">
                    {selectedParticipantDetail.consecrationVerse}
                  </div>
                )}
              </div>

              {/* General Performance KPI */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-slate-500 block">إجمالي النقاط</span>
                  <span className="text-xl font-black text-amber-900 font-mono">
                    {selectedParticipantDetail.totalPoints}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">الإجابات الصحيحة</span>
                  <span className="text-xl font-black text-emerald-800 font-mono">
                    {selectedParticipantDetail.correctAnswersCount}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-slate-500 block">حالة التأهل</span>
                  <span className="text-xs font-bold text-purple-900 block mt-1">
                    {selectedParticipantDetail.isQualifiedForFinal
                      ? '👑 مؤهلة للنهائي'
                      : `مرحلة ${selectedParticipantDetail.currentStageId}`}
                  </span>
                </div>
              </div>

              {/* Stage Scores Breakdown */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  📊 درجات الجولات والمراحل المسجلة:
                </h4>
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5].map((stgId) => {
                    const score = selectedParticipantDetail.stageScores[stgId];
                    const stageNames = [
                      '',
                      'المرحلة 1: البداية التمهيدية',
                      'المرحلة 2: الاكتشاف والربط',
                      'المرحلة 3: التحدي السريع (Bonus)',
                      'المرحلة 4: الحواس والألحان والصور',
                      'المرحلة 5: التحدي الكبير الشامل',
                    ];
                    return (
                      <div
                        key={stgId}
                        className="p-2.5 rounded-xl border flex items-center justify-between bg-white border-slate-200"
                      >
                        <span className="font-semibold text-slate-800">
                          {stageNames[stgId]}
                        </span>
                        {score !== undefined ? (
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {score} نقطة
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            لم تُؤدَ بعد
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedParticipantDetail(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
