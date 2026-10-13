import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CreativeDraft, CreativeProductType } from '../types/creativeTools';
import { creativeStorage } from '../utils/creativeStorage';
import {
  WHO_SAID_IT_CHALLENGES,
  TIMELINE_CHALLENGES,
  DISCERNMENT_SCENARIOS,
  TimelineEventItem,
} from '../data/creativeChallenges';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Award,
  ChevronLeft,
  PlusCircle,
  FolderOpen,
  Copy,
  Printer,
  Trash2,
  Lock,
  Download,
  Share2,
  Check,
  FileText,
  MessageSquare,
  Users,
  Compass,
  ScrollText,
} from 'lucide-react';

interface CreativeLabProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

export const CreativeLab: React.FC<CreativeLabProps> = ({ currentUser, onBackToHome }) => {
  const userId = currentUser?.id || 'guest_user';
  const [mainTab, setMainTab] = useState<'studio' | 'challenges'>('studio');

  // =========================================================================
  // STUDIO STATE (Drafts & Products Creator)
  // =========================================================================
  const [drafts, setDrafts] = useState<CreativeDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<CreativeDraft | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<CreativeProductType>('sermon_preparation');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(creativeStorage.getUserDrafts(userId));
  }, [userId]);

  const handleCreateNewDraft = (type: CreativeProductType) => {
    soundManager.playTick();
    const titlesByType: Record<CreativeProductType, string> = {
      sermon_preparation: 'مخطط عظة: محبة المسيح الغافرة',
      meeting_design: 'برنامج اجتماع: النضج في التكريس',
      spiritual_reflection: 'تأمل في سر الصمت الداخلي',
      interactive_activity: 'نشاط تفاعلي: جسد المسيح الواحد',
      educational_drama: 'حوار تربوي: التمييز بين الغيرة والحسد',
      custom_quiz: 'مسابقة معرفية جديدة للخدام',
      reading_plan: 'خطة قراءة أسبوعية في رسائل القديس بولس',
      visual_card: 'بطاقة آية وشعار التكريس',
    };
    const newDraft = creativeStorage.createEmptyDraft(userId, type, titlesByType[type]);
    const saved = creativeStorage.saveUserDraft(userId, newDraft);
    setDrafts(creativeStorage.getUserDrafts(userId));
    setActiveDraft(saved);
    setSaveToast('تم إنشاء مسودة جديدة في مساحتك الخاصة');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveActiveDraft = () => {
    if (!activeDraft) return;
    soundManager.playTick();
    const saved = creativeStorage.saveUserDraft(userId, activeDraft);
    setDrafts(creativeStorage.getUserDrafts(userId));
    setActiveDraft(saved);
    setSaveToast('تم حفظ التعديلات بنجاح في مساحتك المحمية');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDeleteDraft = (draftId: string) => {
    soundManager.playWrong();
    creativeStorage.deleteUserDraft(userId, draftId);
    setDrafts(creativeStorage.getUserDrafts(userId));
    if (activeDraft?.id === draftId) setActiveDraft(null);
    setSaveToast('تم حذف المسودة');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleExportText = (draft: CreativeDraft) => {
    soundManager.playTick();
    const text = creativeStorage.exportDraftAsText(draft);
    navigator.clipboard.writeText(text);
    setSaveToast('تم نسخ مسودة العمل بالكامل إلى الحافظة');
    setTimeout(() => setSaveToast(null), 3500);
  };

  // =========================================================================
  // CHALLENGES STATE (Existing 3 games)
  // =========================================================================
  const [challengeSubTab, setChallengeSubTab] = useState<'quotes' | 'timeline' | 'scenarios'>('quotes');

  // 1. Who Said It?
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteSelectedOption, setQuoteSelectedOption] = useState<number | null>(null);
  const [quoteAnswered, setQuoteAnswered] = useState(false);
  const [quoteScore, setQuoteScore] = useState(0);

  const currentQuote = WHO_SAID_IT_CHALLENGES[quoteIndex];

  const handleSelectQuoteOption = (idx: number) => {
    if (quoteAnswered) return;
    setQuoteSelectedOption(idx);
    setQuoteAnswered(true);

    const isCorrect = idx === currentQuote.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setQuoteScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextQuote = () => {
    if (quoteIndex + 1 < WHO_SAID_IT_CHALLENGES.length) {
      setQuoteIndex((prev) => prev + 1);
      setQuoteSelectedOption(null);
      setQuoteAnswered(false);
    } else {
      setQuoteIndex(0);
      setQuoteSelectedOption(null);
      setQuoteAnswered(false);
    }
  };

  // 2. Timeline
  const [timelineIndex, setTimelineIndex] = useState(0);
  const currentTimeline = TIMELINE_CHALLENGES[timelineIndex];
  const [userOrderedEvents, setUserOrderedEvents] = useState<TimelineEventItem[]>(() => {
    return [...currentTimeline.events].sort(() => 0.5 - Math.random());
  });
  const [timelineEvaluated, setTimelineEvaluated] = useState(false);
  const [isTimelineAllCorrect, setIsTimelineAllCorrect] = useState(false);

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (timelineEvaluated) return;
    const newItems = [...userOrderedEvents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    soundManager.playTick();
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setUserOrderedEvents(newItems);
  };

  const handleEvaluateTimeline = () => {
    setTimelineEvaluated(true);
    const allCorrect = userOrderedEvents.every((item, idx) => item.correctOrder === idx + 1);
    setIsTimelineAllCorrect(allCorrect);

    if (allCorrect) {
      soundManager.playVictory();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleResetTimeline = () => {
    setUserOrderedEvents([...currentTimeline.events].sort(() => 0.5 - Math.random()));
    setTimelineEvaluated(false);
    setIsTimelineAllCorrect(false);
  };

  // 3. Scenarios
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioSelectedChoice, setScenarioSelectedChoice] = useState<number | null>(null);
  const [scenarioRevealed, setScenarioRevealed] = useState(false);

  const currentScenario = DISCERNMENT_SCENARIOS[scenarioIndex];

  const handleSelectScenarioChoice = (choiceIdx: number) => {
    setScenarioSelectedChoice(choiceIdx);
    setScenarioRevealed(true);
    soundManager.playCorrect();
  };

  const handleNextScenario = () => {
    if (scenarioIndex + 1 < DISCERNMENT_SCENARIOS.length) {
      setScenarioIndex((prev) => prev + 1);
      setScenarioSelectedChoice(null);
      setScenarioRevealed(false);
    } else {
      setScenarioIndex(0);
      setScenarioSelectedChoice(null);
      setScenarioRevealed(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in text-right">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-950 text-amber-200 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>مساحة الإنتاج الروحي والتفكير الإبداعي</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight">
            🎨 مختبر الإبداع والإنتاج الخدمي
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            مساحة متكاملة لإعداد منتجات الخدمة الحقيقية (عظات، لقاءات، تأملات، أنشطة تفاعلية، ومسرحيات تربوية) مع حفظ مسوداتك بأمان تام، بالإضافة إلى ألعاب التحدي الذهني والتمييز الروحي.
          </p>

          {/* Main Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3">
            <button
              onClick={() => setMainTab('studio')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                mainTab === 'studio'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>استوديو إعداد العظات والخدمة ({drafts.length} مسودة)</span>
            </button>

            <button
              onClick={() => setMainTab('challenges')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                mainTab === 'challenges'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>تحديات التمييز والذاكرة</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATIVE STUDIO (DRAFTS & MINISTRY PRODUCTS BUILDER) */}
      {/* ========================================================================= */}
      {mainTab === 'studio' && (
        <div className="space-y-6">
          {/* Privacy Guarantee Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>خصوصية كاملة: مسوداتك وأعمالك محفوظة في مساحتك الشخصية الآمنة، ولن تُنشر مطلقاً دون موافقتك.</span>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2.5 py-0.5 rounded-full">
              محمية 100%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar: New product creation & saved drafts list */}
            <div className="lg:col-span-1 space-y-4">
              {/* Creator menu */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-800 block">✨ إنشاء عمل خدمي جديد:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCreateNewDraft('sermon_preparation')}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-right transition border border-amber-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>🎙️ إعداد عظة / درس</span>
                    <span className="text-[10px] text-amber-700 font-normal">مخطط كامل</span>
                  </button>

                  <button
                    onClick={() => handleCreateNewDraft('meeting_design')}
                    className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold text-right transition border border-indigo-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>👥 تصميم لقاء روحي</span>
                    <span className="text-[10px] text-indigo-700 font-normal">برنامج وتوقيت</span>
                  </button>

                  <button
                    onClick={() => handleCreateNewDraft('spiritual_reflection')}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-bold text-right transition border border-stone-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>✍️ مقال / تأمل كتابي</span>
                    <span className="text-[10px] text-stone-600 font-normal">نص وتوثيق</span>
                  </button>

                  <button
                    onClick={() => handleCreateNewDraft('interactive_activity')}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-right transition border border-emerald-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>🎲 نشاط تفاعلي</span>
                    <span className="text-[10px] text-emerald-700 font-normal">لفرق الخدمة</span>
                  </button>

                  <button
                    onClick={() => handleCreateNewDraft('educational_drama')}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold text-right transition border border-purple-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>🎭 مسرحية / حوار تربوي</span>
                    <span className="text-[10px] text-purple-700 font-normal">سيناريو وشخصيات</span>
                  </button>

                  <button
                    onClick={() => handleCreateNewDraft('visual_card')}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold text-right transition border border-rose-200 flex flex-col justify-between cursor-pointer"
                  >
                    <span>🖼️ بطاقة تأمل بصري</span>
                    <span className="text-[10px] text-rose-700 font-normal">شعار وآية</span>
                  </button>
                </div>
              </div>

              {/* Saved Drafts List */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800">
                    📂 مسوداتي المحفوظة ({drafts.length})
                  </span>
                  <span className="text-[10px] text-slate-400">تحديث تلقائي</span>
                </div>

                <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                  {drafts.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setActiveDraft(d)}
                      className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between gap-2 ${
                        activeDraft?.id === d.id
                          ? 'bg-amber-50 border-amber-400 text-indigo-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <span className="text-xs truncate block">{d.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(d.updatedAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDraft(d.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="حذف المسودة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {drafts.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                      لا توجد مسودات محفوظة حتى الآن. اختر قالباً من الأعلى للبدء.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Area: Active Draft Editor */}
            <div className="lg:col-span-2">
              {activeDraft ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1 w-full">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        نوع العمل: {activeDraft.type}
                      </span>
                      <input
                        type="text"
                        value={activeDraft.title}
                        onChange={(e) =>
                          setActiveDraft({ ...activeDraft, title: e.target.value })
                        }
                        placeholder="عنوان العمل..."
                        className="w-full font-spiritual font-black text-xl text-slate-900 border-b border-transparent focus:border-amber-500 outline-none pb-1"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleExportText(activeDraft)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="نسخ نص المسودة"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </button>

                      <button
                        onClick={handleSaveActiveDraft}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>حفظ التعديلات</span>
                      </button>
                    </div>
                  </div>

                  {/* Sermon Preparation Form */}
                  {activeDraft.type === 'sermon_preparation' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            موضوع العظة والشاهد الأساسي:
                          </label>
                          <input
                            type="text"
                            value={activeDraft.content.theme || ''}
                            onChange={(e) =>
                              setActiveDraft({
                                ...activeDraft,
                                content: { ...activeDraft.content, theme: e.target.value },
                              })
                            }
                            placeholder="مثال: يوحنا 10: 10 - الراعي الصالح والحياة الفضلى"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            الفكرة المركزية الكبرى (Big Idea):
                          </label>
                          <input
                            type="text"
                            value={activeDraft.content.centralObjective || ''}
                            onChange={(e) =>
                              setActiveDraft({
                                ...activeDraft,
                                content: {
                                  ...activeDraft.content,
                                  centralObjective: e.target.value,
                                },
                              })
                            }
                            placeholder="جملة واحدة محددة تعلق في ذهن السامع"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">
                          مقدمة العظة (جذب الانتباه وطرح التساؤل الحياتي):
                        </label>
                        <textarea
                          value={activeDraft.content.introduction || ''}
                          onChange={(e) =>
                            setActiveDraft({
                              ...activeDraft,
                              content: {
                                ...activeDraft.content,
                                introduction: e.target.value,
                              },
                            })
                          }
                          rows={3}
                          placeholder="افتتح بموقف واقعي أو تساؤل يمس ضمير السامع..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">
                          عناصر الشرح والشهادة الكتابية والآبائية:
                        </label>
                        <textarea
                          value={activeDraft.content.bodyText || ''}
                          onChange={(e) =>
                            setActiveDraft({
                              ...activeDraft,
                              content: { ...activeDraft.content, bodyText: e.target.value },
                            })
                          }
                          rows={6}
                          placeholder="النقطة الأولى: ... النقطة الثانية: ... الشاهد الآبائي: ..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">
                          التطبيق العملي والقرار الأسبوعي:
                        </label>
                        <textarea
                          value={activeDraft.content.practicalApplication || ''}
                          onChange={(e) =>
                            setActiveDraft({
                              ...activeDraft,
                              content: {
                                ...activeDraft.content,
                                practicalApplication: e.target.value,
                              },
                            })
                          }
                          rows={2}
                          placeholder="ما هو السلوك الملموس المطلوب من السامع هذا الأسبوع؟"
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Meeting Design Form */}
                  {activeDraft.type === 'meeting_design' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">شعار وموضوع اللقاء:</label>
                          <input
                            type="text"
                            value={activeDraft.content.targetTheme || ''}
                            onChange={(e) =>
                              setActiveDraft({
                                ...activeDraft,
                                content: {
                                  ...activeDraft.content,
                                  targetTheme: e.target.value,
                                },
                              })
                            }
                            placeholder="مثال: لقاء تجديد العهد مع الله"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">المدة التقديرية بالدقائق:</label>
                          <input
                            type="number"
                            value={activeDraft.content.meetingDurationMinutes || 90}
                            onChange={(e) =>
                              setActiveDraft({
                                ...activeDraft,
                                content: {
                                  ...activeDraft.content,
                                  meetingDurationMinutes: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">
                          فقرة الكلمة والمشاركة الحوارية:
                        </label>
                        <textarea
                          value={activeDraft.content.wordTopic || ''}
                          onChange={(e) =>
                            setActiveDraft({
                              ...activeDraft,
                              content: { ...activeDraft.content, wordTopic: e.target.value },
                            })
                          }
                          rows={4}
                          placeholder="العناوين الرئيسية للكلمة ومحاور النقاش..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-800">
                          النشاط التفاعلي ومجموعات العمل:
                        </label>
                        <textarea
                          value={activeDraft.content.groupActivity || ''}
                          onChange={(e) =>
                            setActiveDraft({
                              ...activeDraft,
                              content: {
                                ...activeDraft.content,
                                groupActivity: e.target.value,
                              },
                            })
                          }
                          rows={3}
                          placeholder="الأسئلة المطروحة للمجموعات المصغرة وورقة العمل..."
                          className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* General / Reflection Form */}
                  {activeDraft.type !== 'sermon_preparation' &&
                    activeDraft.type !== 'meeting_design' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">المحتوى والنص الكامل:</label>
                          <textarea
                            value={activeDraft.content.bodyText || ''}
                            onChange={(e) =>
                              setActiveDraft({
                                ...activeDraft,
                                content: { ...activeDraft.content, bodyText: e.target.value },
                              })
                            }
                            rows={8}
                            placeholder="اكتب هنا نص تأملك أو سيناريو عملك أو تفاصيل مشروعك..."
                            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs leading-relaxed outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">الشاهد الكتابي:</label>
                            <input
                              type="text"
                              value={activeDraft.content.biblicalAnchor || ''}
                              onChange={(e) =>
                                setActiveDraft({
                                  ...activeDraft,
                                  content: {
                                    ...activeDraft.content,
                                    biblicalAnchor: e.target.value,
                                  },
                                })
                              }
                              placeholder="شاهد الآية..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">المرجع الآبائي:</label>
                            <input
                              type="text"
                              value={activeDraft.content.patristicReference || ''}
                              onChange={(e) =>
                                setActiveDraft({
                                  ...activeDraft,
                                  content: {
                                    ...activeDraft.content,
                                    patristicReference: e.target.value,
                                  },
                                })
                              }
                              placeholder="اسم القديس والكتاب..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                  <FolderOpen className="w-10 h-10 mx-auto text-amber-600/60" />
                  <h3 className="font-spiritual font-bold text-base text-slate-800">
                    لم يتم اختيار مسودة
                  </h3>
                  <p className="text-xs max-w-sm mx-auto">
                    اختر مسودة من القائمة الجانبية لتعديلها، أو انقر على أحد أزرار الإنشاء في الأعلى لبدء عمل خدمي جديد.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATIVE CHALLENGES (EXISTING GAMES PRESERVED & POLISHED) */}
      {/* ========================================================================= */}
      {mainTab === 'challenges' && (
        <div className="space-y-6">
          {/* Sub-nav switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 max-w-md mx-auto">
            <button
              onClick={() => setChallengeSubTab('quotes')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                challengeSubTab === 'quotes'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📜 من القائل؟
            </button>
            <button
              onClick={() => setChallengeSubTab('timeline')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                challengeSubTab === 'timeline'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏳ ترتيب الخط الزمني
            </button>
            <button
              onClick={() => setChallengeSubTab('scenarios')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                challengeSubTab === 'scenarios'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚖️ مواقف التمييز والإفراز
            </button>
          </div>

          {/* Sub 1: Who Said It? */}
          {challengeSubTab === 'quotes' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-right">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold">
                  القول {quoteIndex + 1} من {WHO_SAID_IT_CHALLENGES.length}
                </span>
                <span className="font-bold text-amber-700">النقاط: {quoteScore}</span>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
                <p className="font-spiritual font-black text-base sm:text-lg text-amber-950 leading-relaxed">
                  «{currentQuote.quote}»
                </p>
                <span className="text-[10px] text-amber-800/80 block">من قائل هذه الكلمات؟</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuote.options.map((opt, idx) => {
                  const isSelected = quoteSelectedOption === idx;
                  const isCorrect = idx === currentQuote.correctIndex;

                  let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (quoteAnswered) {
                    if (isCorrect) optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    else if (isSelected && !isCorrect) optClass = 'bg-rose-50 border-rose-400 text-rose-950';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuoteOption(idx)}
                      disabled={quoteAnswered}
                      className={`p-3.5 rounded-xl border text-xs text-right transition cursor-pointer ${optClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quoteAnswered && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    💡 <strong>السياق:</strong> {currentQuote.context}
                  </p>
                  <button
                    onClick={handleNextQuote}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    السؤال التالي
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sub 2: Timeline */}
          {challengeSubTab === 'timeline' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-right">
              <div className="space-y-1">
                <h3 className="font-spiritual font-bold text-lg text-slate-900">
                  {currentTimeline.title}
                </h3>
                <p className="text-xs text-slate-500">{currentTimeline.instruction}</p>
              </div>

              <div className="space-y-2">
                {userOrderedEvents.map((ev, idx) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-black text-[11px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{ev.text}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveEvent(idx, 'up')}
                        disabled={idx === 0 || timelineEvaluated}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveEvent(idx, 'down')}
                        disabled={idx === userOrderedEvents.length - 1 || timelineEvaluated}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleEvaluateTimeline}
                  disabled={timelineEvaluated}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  التحقق من الترتيب الزمني
                </button>
                <button
                  onClick={handleResetTimeline}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {timelineEvaluated && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs ${
                    isTimelineAllCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  {isTimelineAllCorrect
                    ? '🎉 إجابة ممتازة! تم الترتيب الزمني للأحداث بدقة كاملة.'
                    : 'الترتيب غير صحيح؛ أعد المحاولة مستعيناً بمحطات سيرة القديس.'}
                </div>
              )}
            </div>
          )}

          {/* Sub 3: Scenarios */}
          {challengeSubTab === 'scenarios' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-right">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {currentScenario.domain}
                </span>
                <h3 className="font-spiritual font-bold text-lg text-slate-900">
                  {currentScenario.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {currentScenario.situation}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">ما هو التصرف الحكيم في هذا الموقف؟</span>
                {currentScenario.choices.map((choice, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSelectScenarioChoice(cIdx)}
                    className={`w-full p-3.5 rounded-xl border text-xs text-right transition cursor-pointer ${
                      scenarioSelectedChoice === cIdx
                        ? 'bg-amber-100 border-amber-500 text-indigo-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {scenarioRevealed && (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-1.5">
                    <span className="font-bold text-indigo-950 block">💡 المبدأ الإنجيلي والروحي:</span>
                    <p className="text-slate-700 leading-relaxed font-spiritual font-bold">
                      {currentScenario.biblicalPrinciple}
                    </p>
                  </div>

                  <button
                    onClick={handleNextScenario}
                    className="w-full py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    الموقف التالي
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
