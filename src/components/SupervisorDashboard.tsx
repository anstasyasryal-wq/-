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
  };

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
    if (editingQuestion.id) {
      // Edit
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
      updatedQuestions = [newQ, ...questions];
    }

    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
    setShowQuestionModal(false);
    setEditingQuestion(null);
    soundManager.playCorrect();
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا السؤال؟')) {
      const filtered = questions.filter((q) => q.id !== id);
      setQuestions(filtered);
      saveQuestions(filtered);
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
                    <span className="text-slate-500 block text-[10px]">زمن السؤال</span>
                    <span className="font-bold text-slate-800">{stg.timePerQuestionSeconds} ثانية</span>
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
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              إجمالي الأسئلة المتاحة: <strong className="text-slate-800">{questions.length}</strong>
            </span>
            <button
              onClick={handleOpenAddQuestion}
              className="py-2 px-4 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.slice(0, 15).map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-3 text-right"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      المرحلة {q.stageId}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                      {q.points || 10} نقطة
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
                    {q.question}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    الإجابة الصحيحة: {q.options[q.correctIndex]}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingQuestion(q);
                      setShowQuestionModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};
