import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  Heart,
  Shield,
  Check,
  BookMarked,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  category: 'meditation' | 'prayer' | 'ascetic' | 'gratitude';
  categoryLabel: string;
  mood: string;
  content: string;
  verse?: string;
}

interface SpiritualJournalProps {
  currentUser?: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_PREFIX = 'mokarasa_spiritual_journal_';

export const getStoredJournalEntries = (userId?: string): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = STORAGE_KEY_PREFIX + (userId || 'guest');
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  // Default sample entry if empty
  return [
    {
      id: 'default-1',
      date: new Date().toISOString().split('T')[0],
      title: 'تأمل في صمت المخدع وحضور الله',
      category: 'meditation',
      categoryLabel: 'تأمل روحي',
      mood: 'سلام وعزاء',
      content: 'اختبرت اليوم نعمة الهدوء الداخلي أثناء صلاة يسوع. أدركت أن الله أقرب إليّ مما أتصور، وأنه يعتني بكل تفاصيل حياتي دون أن أضطر للقلق.',
      verse: '«أُعَلِّمُكَ وَأُرْشِدُكَ الطَّرِيقَ الَّتِي تَسْلُكُهَا. عَيْنِي عَلَيْكَ» (مزمور 32: 8)',
    },
  ];
};

export const saveJournalEntriesToStorage = (entries: JournalEntry[], userId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const key = STORAGE_KEY_PREFIX + (userId || 'guest');
    localStorage.setItem(key, JSON.stringify(entries));
  } catch {
    // ignore
  }
};

export const SpiritualJournal: React.FC<SpiritualJournalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    getStoredJournalEntries(currentUser?.id)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isWriting, setIsWriting] = useState<boolean>(false);

  // New entry form state
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<JournalEntry['category']>('meditation');
  const [mood, setMood] = useState<string>('سلام عميق');
  const [verse, setVerse] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    setEntries(getStoredJournalEntries(currentUser?.id));
  }, [currentUser?.id]);

  if (!isOpen) return null;

  const handleSaveNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    soundManager.playVictory();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });

    const categoryLabels: Record<JournalEntry['category'], string> = {
      meditation: 'تأمل روحي',
      prayer: 'صلاة وطلبة',
      ascetic: 'جهاد وتدريب',
      gratitude: 'شكر وتسابيح',
    };

    const newEntry: JournalEntry = {
      id: 'entry-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      mood,
      content: content.trim(),
      verse: verse.trim() || undefined,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJournalEntriesToStorage(updated, currentUser?.id);

    // Reset form
    setTitle('');
    setContent('');
    setVerse('');
    setIsWriting(false);
  };

  const handleDelete = (id: string) => {
    soundManager.playTick();
    if (window.confirm('هل أنت متأكد من حذف هذه التأملة من مذكرات مخدعك؟')) {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveJournalEntriesToStorage(updated, currentUser?.id);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchSearch =
      e.title.includes(searchTerm) ||
      e.content.includes(searchTerm) ||
      (e.verse && e.verse.includes(searchTerm));
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between text-right shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-spiritual text-xl font-bold text-amber-100">
                📝 المجلة الروحية ومذكرات المخدع
              </h2>
              <p className="text-xs text-stone-300">
                سجل تأملاتك اليومية، تدريباتك الشخصية، وطلبات صلاتك الخاصة المحفوظة لك وحدك.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-right flex-1">
          {/* Action bar / filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'meditation', label: '📖 تأملات' },
                { id: 'prayer', label: '🙏 صلوات' },
                { id: 'ascetic', label: '⚔️ جهاد' },
                { id: 'gratitude', label: '✨ شكر' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في مذكراتك..."
                  className="w-full pl-4 pr-9 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3" />
              </div>

              {!isWriting && (
                <button
                  onClick={() => setIsWriting(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>تأمل جديد</span>
                </button>
              )}
            </div>
          </div>

          {/* New Entry Form */}
          {isWriting && (
            <form
              onSubmit={handleSaveNewEntry}
              className="p-5 rounded-2xl bg-stone-900/90 border border-amber-500/40 space-y-4 animate-fade-in shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-spiritual text-base font-bold text-amber-200">
                  ✍️ كتابة تأمل أو تدريب روحي جديد
                </h3>
                <button
                  type="button"
                  onClick={() => setIsWriting(false)}
                  className="text-stone-400 hover:text-stone-200 text-xs"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-stone-300 font-semibold">عنوان التأمل أو التدريب</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: درس في الوداعة من قصة داود الملك..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-stone-300 font-semibold">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JournalEntry['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="meditation">📖 تأمل روحي</option>
                    <option value="prayer">🙏 صلاة وطلبة</option>
                    <option value="ascetic">⚔️ جهاد وتدريب</option>
                    <option value="gratitude">✨ شكر وتسابيح</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-stone-300 font-semibold">الحالة الروحية / المزاج</label>
                  <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="مثال: سلام عميق، اشتياق لله، جهاد..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-stone-300 font-semibold">آية مفتاحية (اختياري)</label>
                  <input
                    type="text"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    placeholder="مثال: «الرب راعي فلا يعوزني شيء» (مز 23: 1)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-semibold">نص التأمل والتدريب الشخصي</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="اكتب هنا ما أعلنه الروح القدس لقلبك اليوم في مخدعك..."
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ في مذكرات المخدع</span>
                </button>
              </div>
            </form>
          )}

          {/* Entries Grid */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-stone-900/50 rounded-2xl border border-stone-800">
                <BookOpen className="w-10 h-10 text-stone-600 mx-auto" />
                <p className="text-sm text-stone-400">لا توجد تأملات مطابقة لبحثك في مذكرات المخدع.</p>
                <button
                  onClick={() => setIsWriting(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
                >
                  اكتب تأملك الأول اليوم
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-amber-600/30 hover:border-amber-400/60 transition space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold">
                          {entry.categoryLabel}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {entry.date}
                        </span>
                        {entry.mood && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 text-[10px]">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                      <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                        {entry.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 rounded-xl bg-stone-950 hover:bg-red-950/60 text-stone-400 hover:text-red-400 transition"
                      title="حذف التأمل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {entry.verse && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/20 text-xs text-amber-200 font-spiritual italic">
                      {entry.verse}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
