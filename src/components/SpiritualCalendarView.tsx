import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Bell,
  BellRing,
  Bookmark,
  CheckCircle2,
  Globe,
  MapPin,
  Clock,
  X,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SpiritualEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'feast' | 'fast' | 'retreat' | 'global_prayer' | 'local';
  categoryLabel: string;
  location: string;
  description: string;
  emoji: string;
  isCustom?: boolean;
}

interface SpiritualCalendarViewProps {
  currentUser?: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

const STORAGE_KEY = 'mokarasa_spiritual_reminders_v1';

const INITIAL_EVENTS: SpiritualEvent[] = [
  {
    id: 'ev-1',
    title: 'عيد القيامة المجيد وفصح السيد المسيح',
    date: '2026-04-12',
    category: 'feast',
    categoryLabel: 'عيد سيدي كبير',
    location: 'كافة الكنائس في العالم',
    description: 'أعظم الأعياد السيدية، قيامة الرب يسوع من الأموات وغلبة النور على الظلمة.',
    emoji: '🌅',
  },
  {
    id: 'ev-2',
    title: 'بدء صوم الرسل الأطهار',
    date: '2026-06-01',
    category: 'fast',
    categoryLabel: 'صوم كنسي',
    location: 'الكنيسة الجامعة',
    description: 'صوم استرشادي تأسس على وصية الآباء الرسل قبل انطلاقهم للكرازة في العالم.',
    emoji: '🌾',
  },
  {
    id: 'ev-3',
    title: 'عيد الصعود الإلهي إلى السموات',
    date: '2026-05-21',
    category: 'feast',
    categoryLabel: 'عيد سيدي',
    location: 'الكنيسة الجامعة',
    description: 'صعود ربنا ومخلصنا يسوع المسيح على سحاب المجد وجلوسه عن يمين الآب.',
    emoji: '🕊️',
  },
  {
    id: 'ev-4',
    title: 'خلوة المكرسين السنوية في دير الأنبا أنطونيوس',
    date: '2026-11-15',
    category: 'retreat',
    categoryLabel: 'خلوة روحية',
    location: 'دير الأنبا أنطونيوس بالبحر الأحمر',
    description: 'خلوة صمت وصلاة لمدة ثلاثة أيام للمكرسين والخدام لتجديد العهد الإلهي.',
    emoji: '🏔️',
  },
  {
    id: 'ev-5',
    title: 'يوم الصلاة العالمي من أجل وحدة الكنائس',
    date: '2026-10-25',
    category: 'global_prayer',
    categoryLabel: 'صلاة عالمية',
    location: 'عبر الإنترنت وكافة الإيبارشيات',
    description: 'لقاء صلاة جماعي عالمي لطلبة سلام الكنيسة ووحدة قلوب أبنائها.',
    emoji: '🌍',
  },
  {
    id: 'ev-6',
    title: 'عيد الصليب المجيد (الظهور الإلهي للصليب)',
    date: '2026-09-27',
    category: 'feast',
    categoryLabel: 'عيد صليبي',
    location: 'جميع الكنائس',
    description: 'تذكار ظهور الصليب المجيد للملكة هيلانة واستعلانه قوة للفداء والشفاء.',
    emoji: '✝️',
  },
];

export const getStoredReminders = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = STORAGE_KEY + '_' + (userId || 'guest');
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
};

export const saveRemindersToStorage = (eventIds: string[], userId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const key = STORAGE_KEY + '_' + (userId || 'guest');
    localStorage.setItem(key, JSON.stringify(eventIds));
  } catch {
    // ignore
  }
};

export const SpiritualCalendarView: React.FC<SpiritualCalendarViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [events, setEvents] = useState<SpiritualEvent[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EVENTS;
    try {
      const custom = localStorage.getItem('mokarasa_custom_events');
      if (custom) {
        return [...INITIAL_EVENTS, ...JSON.parse(custom)];
      }
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  const [reminders, setReminders] = useState<string[]>(() =>
    getStoredReminders(currentUser?.id)
  );

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New event form
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<SpiritualEvent['category']>('local');
  const [location, setLocation] = useState<string>('الإيبارشية / المخدع المحلي');
  const [description, setDescription] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('✨');

  useEffect(() => {
    setReminders(getStoredReminders(currentUser?.id));
  }, [currentUser?.id]);

  const toggleReminder = (eventId: string) => {
    soundManager.playCorrect();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });

    let updated: string[];
    if (reminders.includes(eventId)) {
      updated = reminders.filter((id) => id !== eventId);
    } else {
      updated = [...reminders, eventId];
    }
    setReminders(updated);
    saveRemindersToStorage(updated, currentUser?.id);
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    soundManager.playVictory();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });

    const labels: Record<SpiritualEvent['category'], string> = {
      feast: 'عيد كنسي',
      fast: 'صوم كنسي',
      retreat: 'خلوة روحية',
      global_prayer: 'صلاة عالمية',
      local: 'فعالية محلية',
    };

    const newEv: SpiritualEvent = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      date,
      category,
      categoryLabel: labels[category],
      location: location.trim(),
      description: description.trim(),
      emoji,
      isCustom: true,
    };

    const updatedEvents = [newEv, ...events];
    setEvents(updatedEvents);
    try {
      const customOnly = updatedEvents.filter((ev) => ev.isCustom);
      localStorage.setItem('mokarasa_custom_events', JSON.stringify(customOnly));
    } catch {
      // ignore
    }

    // Auto set reminder for newly created custom event
    const newReminders = [...reminders, newEv.id];
    setReminders(newReminders);
    saveRemindersToStorage(newReminders, currentUser?.id);

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const filteredEvents = events.filter((ev) => {
    return filterCategory === 'all' || ev.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-right" dir="rtl">
      {/* Top Back Bar */}
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
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>التقويم السنوي والفعاليات الكنسية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📅 تقويم الفعاليات الروحية والكنسية العالمية والمحلية
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          تابع الأعياد، الأصوام، الخلوات، وأيام الصلاة العالمية، مع إمكانية ضبط التذكيرات الخاصة وحفظ المناسبات لمشاركتها.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فعالية أو تذكير شخصي</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'كل الفعاليات' },
          { id: 'feast', label: '⭐ الأعياد السيدية والكنسية' },
          { id: 'fast', label: '🌾 الأصوام المقدسة' },
          { id: 'retreat', label: '🏔️ الخلوات واللقاءات' },
          { id: 'global_prayer', label: '🌍 صلوات عالمية' },
          { id: 'local', label: '📍 فعاليات محلية' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              soundManager.playTick();
              setFilterCategory(f.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterCategory === f.id
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add Custom Event Modal */}
      {showAddModal && (
        <form
          onSubmit={handleAddCustomEvent}
          className="p-6 rounded-3xl bg-stone-900 border border-amber-500/50 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              📌 إضافة فعالية روحية أو تذكير خاص تقويمي
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-stone-400 hover:text-stone-200 text-xs"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-stone-300 font-semibold">عنوان الفعالية أو المناسبة</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: سهرة تسبيح واعتكاف في المخدع..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SpiritualEvent['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              >
                <option value="feast">⭐ عيد كنسي</option>
                <option value="fast">🌾 صوم كنسي</option>
                <option value="retreat">🏔️ خلوة روحية</option>
                <option value="global_prayer">🌍 صلاة عالمية</option>
                <option value="local">📍 فعالية محلية</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">التاريخ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">المكان / الكنيسة</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: كاتدرائية القديس مرقس..."
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">رمز تعبيري (إيموجي)</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none text-center"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-semibold">تفاصيل ووصف المناسبة</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب تفاصيل الفعالية وسبب أهميتها الروحية..."
              className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ الفعالية وضبط التذكير</span>
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-stone-900/50 rounded-2xl border border-stone-800">
            <CalendarIcon className="w-10 h-10 text-stone-600 mx-auto" />
            <p className="text-sm text-stone-400">لا توجد فعاليات مطابقة للتصنيف المحدد.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const hasReminder = reminders.includes(ev.id);

            return (
              <div
                key={ev.id}
                className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-amber-600/30 hover:border-amber-400/60 transition space-y-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-3 rounded-2xl bg-stone-950 border border-amber-500/20 shadow-inner shrink-0">
                    {ev.emoji}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold">
                        {ev.categoryLabel}
                      </span>
                      <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {ev.date}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-500" /> {ev.location}
                      </span>
                    </div>

                    <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                      {ev.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => toggleReminder(ev.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                      hasReminder
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
                    }`}
                  >
                    {hasReminder ? (
                      <>
                        <BellRing className="w-4 h-4 animate-bounce" />
                        <span>تم ضبط التذكير</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>تذكيري للمشاركة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
