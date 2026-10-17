import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Heart,
  ChevronLeft,
  Plus,
  Trash2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Shield,
  Send,
  Lock,
  Calendar,
  Settings,
  Clock,
  UserCheck,
  Award,
  Bell,
  Phone,
  MapPin,
  CheckSquare,
  Square,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionNote {
  id: string;
  date: string;
  title: string;
  content: string;
  isDiscussed: boolean;
}

interface SpiritualAdvice {
  id: string;
  date: string;
  fatherName: string;
  adviceText: string;
}

interface SpiritualFatherSettings {
  fatherName: string;
  churchName: string;
  phone: string;
  frequency: string;
  nextAppointment: string;
  notes: string;
}

interface ConscienceCheckItem {
  id: string;
  category: string;
  question: string;
  checked: boolean;
}

interface SpiritualFatherCompanionProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

const NOTES_STORAGE_KEY = 'mokarasa_confession_notes_v2';
const ADVICE_STORAGE_KEY = 'mokarasa_spiritual_father_advice_v2';
const SETTINGS_STORAGE_KEY = 'mokarasa_spiritual_father_settings_v2';
const CONSCIENCE_STORAGE_KEY = 'mokarasa_conscience_checklist_v2';

export const SpiritualFatherCompanion: React.FC<SpiritualFatherCompanionProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'notes' | 'advice' | 'conscience' | 'prep_guide'>('settings');

  // Father Settings state
  const [fatherSettings, setFatherSettings] = useState<SpiritualFatherSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            fatherName: 'أبونا القمص كيرلس الأنطوني',
            churchName: 'كنيسة السيدة العذراء والأنبا بيشوي',
            phone: '01220000000',
            frequency: 'كل ثلاثة أسابيع',
            nextAppointment: '2026-11-01T17:00',
            notes: 'الموعد عادةً بعد صلاة عشية الجمعة أو الأحد صباحاً.',
          };
    } catch {
      return {
        fatherName: 'أبونا القمص كيرلس الأنطوني',
        churchName: 'كنيسة السيدة العذراء والأنبا بيشوي',
        phone: '01220000000',
        frequency: 'كل ثلاثة أسابيع',
        nextAppointment: '2026-11-01T17:00',
        notes: 'الموعد عادةً بعد صلاة عشية الجمعة أو الأحد صباحاً.',
      };
    }
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<SpiritualFatherSettings>(fatherSettings);

  // Notes state
  const [notes, setNotes] = useState<ConfessionNote[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'note-1',
              date: '15 أكتوبر 2026',
              title: 'نقاط أود مناقشتها في الاعتراف القادم',
              content: 'الشعور بالتقصير في وقت الصلاة الصباحية، وكيفية التعامل مع حروب التشتت أثناء الأجبية.',
              isDiscussed: false,
            },
          ];
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Advice state
  const [adviceList, setAdviceList] = useState<SpiritualAdvice[]>(() => {
    try {
      const saved = localStorage.getItem(ADVICE_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'adv-1',
              date: '1 أكتوبر 2026',
              fatherName: 'أبونا القمص كيرلس',
              adviceText: 'الجهاد في حفظ الهدوء الداخلي، وقراءة مزمور 23 ببطء كل مساء قبل النوم.',
            },
          ];
    } catch {
      return [];
    }
  });

  const [newAdviceText, setNewAdviceText] = useState('');

  // Conscience Checklist state
  const [conscienceItems, setConscienceItems] = useState<ConscienceCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(CONSCIENCE_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'c1', category: 'محبة الله والمخدع', question: 'هل حافظت على وقت مخدع يومي خالٍ من المشتتات والإنترنت؟', checked: false },
            { id: 'c2', category: 'محبة الله والمخدع', question: 'هل صليت صلاة الأجبية بخشوع واهتمام بالمعاني الروحية؟', checked: false },
            { id: 'c3', category: 'محبة القريب', question: 'هل حفظت لساني عن الإدانة والنميمة والشكوى؟', checked: false },
            { id: 'c4', category: 'محبة القريب', question: 'هل بادرت بالمصالحة وصنع السلام مع من أخطأ في حقي أو أخطأت في حقه؟', checked: false },
            { id: 'c5', category: 'نقاوة القلب والتواضع', question: 'هل جاهدت ضد أفكار الكبرياء ومحبة المديح الباطل؟', checked: false },
            { id: 'c6', category: 'نقاوة القلب والتواضع', question: 'هل حافظت على حواس عيني وفكري طاهرة ونقية؟', checked: false },
          ];
    } catch {
      return [];
    }
  });

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    setFatherSettings(tempSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(tempSettings));
    } catch {}
    setIsEditingSettings(false);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const saveNotes = (updated: ConfessionNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const saveAdvice = (updated: SpiritualAdvice[]) => {
    setAdviceList(updated);
    try {
      localStorage.setItem(ADVICE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const saveConscience = (updated: ConscienceCheckItem[]) => {
    setConscienceItems(updated);
    try {
      localStorage.setItem(CONSCIENCE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    soundManager.playCorrect();
    const note: ConfessionNote = {
      id: `note_${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: newTitle.trim(),
      content: newContent.trim(),
      isDiscussed: false,
    };
    saveNotes([note, ...notes]);
    setNewTitle('');
    setNewContent('');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleToggleDiscussed = (id: string) => {
    soundManager.playTick();
    const updated = notes.map((n) => (n.id === id ? { ...n, isDiscussed: !n.isDiscussed } : n));
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    soundManager.playTick();
    saveNotes(notes.filter((n) => n.id !== id));
  };

  const handleAddAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdviceText.trim()) return;

    soundManager.playCorrect();
    const adv: SpiritualAdvice = {
      id: `adv_${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      fatherName: fatherSettings.fatherName || 'أبونا الروحي',
      adviceText: newAdviceText.trim(),
    };
    saveAdvice([adv, ...adviceList]);
    setNewAdviceText('');
  };

  const handleDeleteAdvice = (id: string) => {
    soundManager.playTick();
    saveAdvice(adviceList.filter((a) => a.id !== id));
  };

  const handleToggleConscience = (id: string) => {
    soundManager.playTick();
    const updated = conscienceItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    saveConscience(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right" dir="rtl">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>رعاية الإرشاد الروحي وسر التوبة والأسرار المقدسة</span>
          </div>
          <div className="text-xs text-amber-200/90 font-mono bg-stone-950/60 px-3 py-1 rounded-xl border border-stone-800">
            🕊️ الأب الروحي الحالي: <span className="font-bold text-amber-400">{fatherSettings.fatherName}</span>
          </div>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🛡️ قسم أبي الروحي وإعداد الاعتراف (الإعدادات الكاملة)
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مساحتك الروحية والسرية لضبط إعدادات أبيك الروحي، جدولة جلسات الاعتراف، تدوين نقاط التوبة، مراجعة فحص الضمير، وحفظ وصايا الإرشاد المقدسة.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => {
              soundManager.playTick();
              setActiveTab('settings');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            ⚙️ إعدادات الأب الروحي والمواعيد
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveTab('notes');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            📝 نقاط الاعتراف ({notes.length})
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveTab('advice');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeTab === 'advice'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            🌿 وصايا وتوجيهات الأب ({adviceList.length})
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveTab('conscience');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeTab === 'conscience'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            ⚖️ ميزان فحص الضمير
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveTab('prep_guide');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeTab === 'prep_guide'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            📖 دليل التحضير لسر التوبة
          </button>
        </div>
      </div>

      {/* TAB 1: FATHER SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Father Card Preview */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-4 md:col-span-1 text-center flex flex-col items-center justify-between">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-black text-3xl shadow-lg shadow-amber-600/30">
                👨‍🦳
              </div>
              <div className="space-y-1">
                <h3 className="font-spiritual text-lg font-bold text-amber-100">
                  {fatherSettings.fatherName}
                </h3>
                <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{fatherSettings.churchName}</span>
                </p>
              </div>

              <div className="w-full pt-4 border-t border-stone-800 space-y-2.5 text-right text-xs">
                <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-400">دورية الاعتراف:</span>
                  <span className="text-amber-200 font-bold">{fatherSettings.frequency}</span>
                </div>
                <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-400">رقم الهاتف / التواصل:</span>
                  <span className="text-amber-200 font-mono">{fatherSettings.phone}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setTempSettings(fatherSettings);
                  setIsEditingSettings(true);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                <span>تعديل إعدادات وبيانات الأب</span>
              </button>
            </div>

            {/* Next Appointment & Guidance Details */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-6 md:col-span-2">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h3 className="font-spiritual text-base font-bold text-amber-100">
                    موعود جلسة الاعتراف القادمة والتنظيم الروحي
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  تنسيق نشط
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>تاريخ وموعد الجلسة:</span>
                  </span>
                  <p className="text-sm font-bold text-amber-200 font-mono">
                    {new Date(fatherSettings.nextAppointment).toLocaleString('ar-EG', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>ملاحظات الحجز أو التواجد:</span>
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {fatherSettings.notes}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-950 to-amber-950/40 border border-amber-600/30 space-y-2">
                <h4 className="font-spiritual text-sm font-bold text-amber-200 flex items-center gap-1.5">
                  <span>🕊️</span>
                  <span>وصية آبائية في اختيار الأب الروحي والتعامل معه:</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  «كن صادقاً وأמיناً مع أبيك الروحي ولا تخفِ عنه شيئاً، فالاعتراف هو طريق الشفاء الحقيقي والسلام الداخلي، وطاعة الإرشاد تحفظ النفس من السقوط في شباك الكبرياء الذاتي.»
                </p>
              </div>
            </div>
          </div>

          {/* Edit Settings Modal / Card */}
          {isEditingSettings && (
            <div className="p-6 rounded-3xl bg-stone-950 border-2 border-amber-500 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-spiritual text-base font-bold text-amber-200">
                  ✏️ تعديل بيانات وإعدادات الأب الروحي
                </h3>
                <button
                  onClick={() => setIsEditingSettings(false)}
                  className="text-stone-400 hover:text-stone-200 text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>

              <form onSubmit={saveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold">اسم الأب الكاهن / القمص:</label>
                    <input
                      type="text"
                      value={tempSettings.fatherName}
                      onChange={(e) => setTempSettings({ ...tempSettings, fatherName: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold">اسم الكنيسة أو الدير:</label>
                    <input
                      type="text"
                      value={tempSettings.churchName}
                      onChange={(e) => setTempSettings({ ...tempSettings, churchName: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold">رقم الهاتف للتواصل:</label>
                    <input
                      type="text"
                      value={tempSettings.phone}
                      onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold">دورية الاعتراف (مثال: أسبوعياً، كل 3 أسابيع):</label>
                    <input
                      type="text"
                      value={tempSettings.frequency}
                      onChange={(e) => setTempSettings({ ...tempSettings, frequency: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold">موعد الجلسة القادمة:</label>
                    <input
                      type="datetime-local"
                      value={tempSettings.nextAppointment}
                      onChange={(e) => setTempSettings({ ...tempSettings, nextAppointment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-300 font-bold">ملاحظات ومواعيد التواجد في الكنيسة:</label>
                  <textarea
                    rows={2}
                    value={tempSettings.notes}
                    onChange={(e) => setTempSettings({ ...tempSettings, notes: e.target.value })}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSettings(false)}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-300 text-xs font-bold hover:bg-stone-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                  >
                    حفظ التعديلات والإعدادات
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONFESSION NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-xl">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              ✍️ تدوين نقطة جديدة لمناقشتها مع أبيك الروحي:
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان أو موضوع النقاش (مثال: محاربة الغضب، ترتيب وقت المخدع)..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
              <textarea
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="التفاصيل أو الأسئلة التي تود عرضها في جلسة الاعتراف..."
                required
                className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ الملاحظة سراً</span>
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-3">
            <h3 className="font-spiritual text-base font-bold text-stone-200">
              ملاحظاتك المسجلة ({notes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition space-y-3 flex flex-col justify-between ${
                    n.isDiscussed
                      ? 'bg-stone-950/60 border-emerald-500/50 opacity-75'
                      : 'bg-stone-900 border-stone-800 shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                      <span className="text-amber-400 font-bold">{n.date}</span>
                      <button
                        onClick={() => handleToggleDiscussed(n.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          n.isDiscussed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                        }`}
                      >
                        {n.isDiscussed ? '✓ تم مناقشتها مع الأب' : 'قيد الانتظار'}
                      </button>
                    </div>

                    <h4 className="font-spiritual text-base font-bold text-amber-100">
                      {n.title}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                      {n.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SPIRITUAL FATHER ADVICE */}
      {activeTab === 'advice' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add Advice Form */}
          <form onSubmit={handleAddAdvice} className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-xl">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              🌿 تسجيل توجيه أو قانون من أبيك الروحي:
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-400">الأب المرشد:</label>
              <input
                type="text"
                value={fatherSettings.fatherName}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 text-xs font-bold"
              />
            </div>

            <textarea
              rows={3}
              value={newAdviceText}
              onChange={(e) => setNewAdviceText(e.target.value)}
              placeholder="اكتب التوجيه، النصيحة، أو القانون الروحي الذي حدده لك أبونا في جلسة التوبة..."
              required
              className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ التوجيه الإرشادي</span>
              </button>
            </div>
          </form>

          {/* Advice List */}
          <div className="space-y-3">
            <h3 className="font-spiritual text-base font-bold text-stone-200">
              سجل التوجيهات والقوانين الروحية ({adviceList.length})
            </h3>
            <div className="space-y-3">
              {adviceList.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-amber-500/30 space-y-2 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono">
                      <span className="font-bold">🌿 إرشاد من: {a.fatherName}</span>
                      <span className="text-stone-400">{a.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual bg-stone-950 p-4 rounded-xl border border-stone-800">
                      «{a.adviceText}»
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteAdvice(a.id)}
                      className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer"
                    >
                      حذف التوجيه
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONSCIENCE CHECKLIST */}
      {activeTab === 'conscience' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              ⚖️ ميزان فحص الضمير قبل الاعتراف
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              أسئلة هادية لفحص القلب ومراجعة النفس أمام الله بصدق واستعداد لسر التوبة.
            </p>
          </div>

          <div className="space-y-3">
            {conscienceItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleConscience(item.id)}
                className={`p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  item.checked
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-stone-200'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                }`}
              >
                <button type="button" className="mt-0.5 text-amber-400 shrink-0">
                  {item.checked ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-stone-600" />}
                </button>
                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full font-bold inline-block">
                    {item.category}
                  </span>
                  <p className={`text-xs sm:text-sm leading-relaxed ${item.checked ? 'line-through opacity-75' : ''}`}>
                    {item.question}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-xs text-amber-200 text-center">
            ✨ ضع علامة على ما قمت بمراجعته، ودوّن أي تقصير في قسم «نقاط الاعتراف» لعرضه على أبيك الروحي.
          </div>
        </div>
      )}

      {/* TAB 5: PREP GUIDE */}
      {activeTab === 'prep_guide' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              📖 خطوات التحضير لسر التوبة والاعتراف المقدس
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              إرشادات آبائية لجلوس مثمر ومقدس أمام الأب الكاهن في سر الاعتراف.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">1. الصلاة وطلب الاستنارة قبل الذهاب</h4>
              <p>
                اقضِ وقتاً هادئاً في مخدعك قبل الاعتراف، واطلب من الروح القدس أن يكشف لك خطاياك وضعفاتك الخفية بروح التواضع لا بروح اليأس.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">2. الصراحة والوضوح بلا تبرير</h4>
              <p>
                اذكر خطاياك بوضوح وصراحة دون تجميل أو إلقاء اللوم على الظروف أو الآخرين، فالتبرير يمنع نوال قوة الغفران الشافي.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">3. قبول الإرشاد والقانون بروح الشكر</h4>
              <p>
                استمع لإرشاد أبيك الروحي وقلبه الأبوي كمن يتقبل دواءً شافياً لنفسك، ونفذ القانون أو التدريب المحدد بفرح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
