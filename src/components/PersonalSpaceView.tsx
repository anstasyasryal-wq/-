import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { PersonalSpiritualDiaryEntry, PersonalSpiritualStats } from '../types/spiritual';
import {
  getDiaryEntries,
  saveDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  getPersonalSpiritualStats,
  recordRosarySession,
  getRosaryStats,
  isDiaryEncryptedInStorage,
} from '../utils/spiritualStorage';
import { MONASTIC_VIRTUES } from '../data/monasticVirtues';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import confetti from 'canvas-confetti';
import {
  User as UserIcon,
  Heart,
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Lock,
  Flame,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Moon,
  Sun,
} from 'lucide-react';

interface PersonalSpaceViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

export const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const userId = currentUser ? currentUser.id : 'guest_spiritual_user';
  const { isNightMode, toggleNightMode } = useReadingTheme();

  // Stats
  const [stats, setStats] = useState<PersonalSpiritualStats>(() => getPersonalSpiritualStats(userId));

  // Rosary / Jesus Prayer Rope inside personal space
  const [rosaryPrayer, setRosaryPrayer] = useState('يا ربي يسوع المسيح، ارحمني أنا الخاطئ');
  const [rosaryTarget, setRosaryTarget] = useState<number>(33);
  const [rosaryCount, setRosaryCount] = useState<number>(0);
  const [rosaryCompletedRopes, setRosaryCompletedRopes] = useState<number>(() => getRosaryStats(userId).totalRopes);

  // Diary Entries
  const [entries, setEntries] = useState<PersonalSpiritualDiaryEntry[]>(() => getDiaryEntries(userId));
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form states
  const [gratitude, setGratitude] = useState('');
  const [bibleContemplation, setBibleContemplation] = useState('');
  const [prayerRequestText, setPrayerRequestText] = useState('');
  const [personalResolution, setPersonalResolution] = useState('');
  const [confessionNote, setConfessionNote] = useState('');
  const [selectedVirtueId, setSelectedVirtueId] = useState(MONASTIC_VIRTUES[0].id);

  const handleStartEdit = (entry: PersonalSpiritualDiaryEntry) => {
    setEditingEntryId(entry.id);
    setGratitude(entry.gratitudeAndThanks || '');
    setBibleContemplation(entry.dailyBibleContemplation || '');
    setPrayerRequestText(entry.prayerRequests ? entry.prayerRequests.join('\n') : '');
    setPersonalResolution(entry.personalResolution || '');
    setConfessionNote(entry.confessionNote || '');
    if (entry.virtueTrackedId) setSelectedVirtueId(entry.virtueTrackedId);
    setShowNewEntryForm(true);
  };

  const handleCancelForm = () => {
    setEditingEntryId(null);
    setGratitude('');
    setBibleContemplation('');
    setPrayerRequestText('');
    setPersonalResolution('');
    setConfessionNote('');
    setShowNewEntryForm(false);
  };

  const handleTapRosaryBead = () => {
    soundManager.playTick();
    const next = rosaryCount + 1;
    if (next >= rosaryTarget) {
      soundManager.playVictory();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setRosaryCount(0);
      const nextRopes = rosaryCompletedRopes + 1;
      setRosaryCompletedRopes(nextRopes);
      recordRosarySession(userId, rosaryTarget, 1);
      setStats(getPersonalSpiritualStats(userId));
    } else {
      setRosaryCount(next);
      recordRosarySession(userId, 1, 0);
      setStats(getPersonalSpiritualStats(userId));
    }
  };

  const handleResetRosary = () => {
    setRosaryCount(0);
  };

  const handleSaveDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() && !bibleContemplation.trim() && !confessionNote.trim()) {
      return;
    }

    soundManager.playCorrect();
    const todayStr = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const requestsArray = prayerRequestText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingEntryId) {
      updateDiaryEntry(userId, editingEntryId, {
        gratitudeAndThanks: gratitude.trim(),
        dailyBibleContemplation: bibleContemplation.trim(),
        confessionNote: confessionNote.trim(),
        prayerRequests: requestsArray,
        personalResolution: personalResolution.trim(),
        virtueTrackedId: selectedVirtueId,
      });
    } else {
      saveDiaryEntry(userId, {
        dateString: todayStr,
        gratitudeAndThanks: gratitude.trim(),
        dailyBibleContemplation: bibleContemplation.trim(),
        confessionNote: confessionNote.trim(),
        prayerRequests: requestsArray,
        personalResolution: personalResolution.trim(),
        virtueTrackedId: selectedVirtueId,
        isPrivate: true,
      });
    }

    // Refresh
    setEntries(getDiaryEntries(userId));
    setStats(getPersonalSpiritualStats(userId));

    // Reset Form
    handleCancelForm();
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteDiaryEntry(userId, entryId);
    if (editingEntryId === entryId) {
      handleCancelForm();
    }
    setEntries(getDiaryEntries(userId));
    setStats(getPersonalSpiritualStats(userId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in text-right">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>مخدعي وسكون قلبي الداخلي (خاص وسري)</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight mb-2">
            🕯️ المساحة الشخصية ومذكرة المخدع
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            سجل خاص بك لمراجعة النفس وتأمل الإنجيل اليومي، وإعداد نقاط الاعتراف وسماع صوت الروح، مع حبل الصلاة لمناجاة اسم يسوع القدوس في صمتك.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {!currentUser ? (
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>تسجيل الدخول لربط مذكرتك بحسابك</span>
              </button>
            ) : (
              <div className="text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-700/60 px-3.5 py-2 rounded-xl flex items-center gap-2">
                <span>مرحباً، {currentUser.name}</span>
                <span className="text-stone-400">({currentUser.consecrationRank || currentUser.vocation})</span>
              </div>
            )}

            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Eye Comfort Night Reading Banner */}
      <div
        className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300 ${
          isNightMode
            ? 'bg-[#201d19] border-[#443c32] text-amber-100 shadow-md'
            : 'bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-100/50 border-amber-200/80 text-stone-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
              isNightMode
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isNightMode ? '🌙' : '🕯️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-spiritual font-bold text-sm sm:text-base">
                سكون المخدع: وضع القراءة الليلي وتخفيف الورق
              </span>
              {isNightMode && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                  مُفعَّل لسكون الصلاة
                </span>
              )}
            </div>
            <p className={`text-[11px] leading-tight ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
              تخفيف خلفية الورق وتهدئة تباين النصوص لحماية العين أثناء صلوات المخدع ومناجاة حبل صلاة يسوع.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playTick();
            toggleNightMode();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer self-end sm:self-auto ${
            isNightMode
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-100'
          }`}
        >
          {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isNightMode ? 'العودة للوضع النهاري ☀️' : 'تفعيل القراءة الليلية 🌙'}</span>
        </button>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs text-stone-500 font-sans block">حبات صلاة يسوع</span>
          <span className="font-spiritual text-2xl font-bold text-amber-800 block">
            {stats.totalRosaryCount}
          </span>
          <span className="text-[10px] text-stone-400">حبة رُفعت بمخافة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs text-stone-500 font-sans block">أربطة المسبحة المكتملة</span>
          <span className="font-spiritual text-2xl font-bold text-indigo-800 block">
            {rosaryCompletedRopes}
          </span>
          <span className="text-[10px] text-stone-400">دورة صلاة كاملة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs text-stone-500 font-sans block">تأملات المخدع</span>
          <span className="font-spiritual text-2xl font-bold text-emerald-800 block">
            {stats.diaryEntriesCount}
          </span>
          <span className="text-[10px] text-stone-400">مذكرة شخصية محفوظة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs text-stone-500 font-sans block">فضائل مجاهدة اليوم</span>
          <span className="font-spiritual text-2xl font-bold text-rose-800 block">
            {stats.activeVirtuesPracticed}
          </span>
          <span className="text-[10px] text-stone-400">تدريب روحي عملي</span>
        </div>
      </div>

      {/* Rosary Interactive Section */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xl">
              📿
            </div>
            <div>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-stone-900">
                حبل الصلاة ومناجاة يسوع في سكون المخدع
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                صلاة يسوع السهمية لجمع حواس القلب وربط الفكر باسم الفادي المخلص
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[33, 50, 100].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setRosaryTarget(t);
                  setRosaryCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  rosaryTarget === t
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t} حبة
              </button>
            ))}
          </div>
        </div>

        {/* Big Tap Area */}
        <div className="bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-3xl p-6 sm:p-10 border border-amber-200/80 text-center space-y-5">
          <p className="font-spiritual text-xl sm:text-2xl font-bold text-amber-950 leading-relaxed max-w-xl mx-auto">
            «{rosaryPrayer}»
          </p>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={handleTapRosaryBead}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none border-4 border-amber-200"
            >
              <span className="text-3xl sm:text-4xl">✝️</span>
              <span className="font-mono text-xl sm:text-2xl font-bold">
                {rosaryCount} / {rosaryTarget}
              </span>
              <span className="text-[10px] text-amber-100">المس للصلاة</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetRosary}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تصفير الحبات الحالية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diary & Confession Notes Section */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-stone-900">
                مذكرة المخدع الشخصية والمراجعة الروحية
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                سجل محمي يُحفظ محلياً على جهازك لتدوين نعم الشكر وتأملات الإنجيل وتجهيز جلسة الاعتراف
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (showNewEntryForm) {
                handleCancelForm();
              } else {
                setShowNewEntryForm(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showNewEntryForm ? 'إلغاء' : 'تدوين تأمل جديد'}</span>
          </button>
        </div>

        {/* New / Edit Entry Form */}
        {showNewEntryForm && (
          <form
            onSubmit={handleSaveDiary}
            className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-spiritual text-base font-bold text-stone-900 flex items-center gap-2">
                {editingEntryId ? (
                  <>
                    <Pencil className="w-4 h-4 text-amber-600" />
                    <span>تعديل تدوين المخدع الحالي:</span>
                  </>
                ) : (
                  <span>إضافة تأمل مخدع جديد لليوم:</span>
                )}
              </h3>
              {editingEntryId && (
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                تأمل الإنجيل أو الآية التي استوقفتك اليوم:
              </label>
              <textarea
                value={bibleContemplation}
                onChange={(e) => setBibleContemplation(e.target.value)}
                rows={2}
                placeholder="اكتب هنا الآية أو المعنى الروحي الذي لمس قلبك أثناء قراءة الإنجيل..."
                className="w-full p-3 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  شكر وتسبيح (نعم الرب في يومك):
                </label>
                <textarea
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  rows={2}
                  placeholder="نعم خاصة، معونة في الخدمة، سلام داخلي وسط التجربة..."
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ملاحظات ونقاط مراجعة لجلسة الاعتراف:
                </label>
                <textarea
                  value={confessionNote}
                  onChange={(e) => setConfessionNote(e.target.value)}
                  rows={2}
                  placeholder="ضعفات أو تقصير ترغب في ذكره لأبيك الروحي في الاعتراف..."
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  طلبات صلاة من أجل المخدومين والآخرين (كل طلب في سطر):
                </label>
                <textarea
                  value={prayerRequestText}
                  onChange={(e) => setPrayerRequestText(e.target.value)}
                  rows={2}
                  placeholder="صلوات لأجل المرضى، طلبة التكريس، سلام الكنيسة..."
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  قرار روحي أو تدريب عملي للغد:
                </label>
                <textarea
                  value={personalResolution}
                  onChange={(e) => setPersonalResolution(e.target.value)}
                  rows={2}
                  placeholder="مثال: ضبط اللسان، الاستيقاظ مبكراً لصلاة باكر، مصالحة أخ..."
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                هذه الملاحظات مشفرة ومحمية محلياً بتشفير خاص بجهازك بسرية تامة.
              </span>

              <div className="flex items-center gap-2">
                {editingEntryId && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {editingEntryId ? 'تحديث التدوين' : 'حفظ التدوين في المخدع'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-500 border border-stone-200">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-spiritual text-base font-bold text-stone-700">
                لا توجد تدوينات محفوظة حتى الآن
              </p>
              <p className="text-xs text-stone-500 mt-1">
                اضغط على «تدوين تأمل جديد» أعلاه لبدء تسجيل خواطر مخدعك وسكونك الداخلي.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-amber-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      {entry.dateString}
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      مشفر ومحمي
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(entry)}
                      className="text-stone-400 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                      title="تعديل هذا التدوين"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="حذف هذا التدوين"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {entry.dailyBibleContemplation && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 block">
                      تأمل الإنجيل:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                      {entry.dailyBibleContemplation}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {entry.gratitudeAndThanks && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <span className="font-bold text-emerald-800 block mb-1">
                        الشكر والتسبيح:
                      </span>
                      <p className="text-stone-600 leading-relaxed">{entry.gratitudeAndThanks}</p>
                    </div>
                  )}

                  {entry.confessionNote && (
                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200">
                      <span className="font-bold text-rose-800 block mb-1">
                        ملاحظات الاعتراف:
                      </span>
                      <p className="text-stone-600 leading-relaxed">{entry.confessionNote}</p>
                    </div>
                  )}
                </div>

                {entry.prayerRequests && entry.prayerRequests.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-indigo-900 block mb-1">
                      طلبات الصلاة للمخدومين:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.prayerRequests.map((req, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.personalResolution && (
                  <div className="pt-1 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-600">
                    <span className="font-bold text-amber-800">قرار الغد:</span>
                    <span>{entry.personalResolution}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
