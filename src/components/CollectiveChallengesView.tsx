import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Users,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Shield,
  Heart,
  ChevronLeft,
  Flame,
  Award,
  BookOpen,
  Check,
  Share2,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SpiritualChallenge {
  id: string;
  title: string;
  type: 'fasting' | 'reading' | 'prayer';
  typeLabel: string;
  description: string;
  targetDays: number;
  creatorName: string;
  membersCount: number;
  joinedUserIds: string[];
  progressRecords: Record<string, number>; // userId -> days completed
  createdAt: string;
  badgeIcon: string;
}

interface CollectiveChallengesViewProps {
  currentUser?: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

const STORAGE_KEY = 'mokarasa_collective_challenges_v1';

const INITIAL_CHALLENGES: SpiritualChallenge[] = [
  {
    id: 'challenge-1',
    title: 'تحدي صلاة يسوع 30 يوماً للمكرسين',
    type: 'prayer',
    typeLabel: 'صلاة وحراسة قلب',
    description: 'تلاوة صلاة يسوع ("يا ربي يسوع المسيح، ارحمني") 100 مرة يومياً لمدة 30 يوماً بثبات.',
    targetDays: 30,
    creatorName: 'الأنبا باخوميوس',
    membersCount: 42,
    joinedUserIds: ['user-1', 'user-2'],
    progressRecords: { 'user-1': 14, 'user-2': 19 },
    createdAt: '2026-10-01',
    badgeIcon: '🕊️',
  },
  {
    id: 'challenge-2',
    title: 'قراءة إنجيل يوحنا ورسائله في 14 يوماً',
    type: 'reading',
    typeLabel: 'قراءة مشتركة',
    description: 'قراءة إصحاح يومياً من إنجيل يوحنا مع التأمل في محبة الفادي والعهد الأبدي.',
    targetDays: 14,
    creatorName: 'لجنة الدراسات الكنسية',
    membersCount: 28,
    joinedUserIds: ['user-1'],
    progressRecords: { 'user-1': 5 },
    createdAt: '2026-10-10',
    badgeIcon: '📖',
  },
  {
    id: 'challenge-3',
    title: 'صوم الأبقار والفضائل الخفية (7 أيام)',
    type: 'fasting',
    typeLabel: 'صوم وجهاد روحي',
    description: 'صوم انقطاعي حتى الساعة الثالثة عصراً مع تركيز خاص على صمت اللسان وخفاء المخدع.',
    targetDays: 7,
    creatorName: 'أسرة المكرسين',
    membersCount: 35,
    joinedUserIds: [],
    progressRecords: {},
    createdAt: '2026-10-14',
    badgeIcon: '🌾',
  },
];

export const getStoredChallenges = (): SpiritualChallenge[] => {
  if (typeof window === 'undefined') return INITIAL_CHALLENGES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return INITIAL_CHALLENGES;
};

export const saveChallengesToStorage = (challenges: SpiritualChallenge[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
  } catch {
    // ignore
  }
};

export const CollectiveChallengesView: React.FC<CollectiveChallengesViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const [challenges, setChallenges] = useState<SpiritualChallenge[]>(() => getStoredChallenges());
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // New challenge form
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<SpiritualChallenge['type']>('reading');
  const [description, setDescription] = useState<string>('');
  const [targetDays, setTargetDays] = useState<number>(21);
  const [badgeIcon, setBadgeIcon] = useState<string>('✝️');

  const userId = currentUser?.id || 'guest-user';
  const userName = currentUser?.name || 'مكرس مبارك';

  const handleJoinChallenge = (challengeId: string) => {
    soundManager.playVictory();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });

    const updated = challenges.map((ch) => {
      if (ch.id === challengeId) {
        if (ch.joinedUserIds.includes(userId)) return ch; // already joined
        return {
          ...ch,
          membersCount: ch.membersCount + 1,
          joinedUserIds: [...ch.joinedUserIds, userId],
          progressRecords: { ...ch.progressRecords, [userId]: 0 },
        };
      }
      return ch;
    });
    setChallenges(updated);
    saveChallengesToStorage(updated);
  };

  const handleIncrementProgress = (challengeId: string) => {
    soundManager.playCorrect();
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });

    const updated = challenges.map((ch) => {
      if (ch.id === challengeId) {
        const currentProgress = ch.progressRecords[userId] || 0;
        if (currentProgress >= ch.targetDays) return ch;
        return {
          ...ch,
          progressRecords: {
            ...ch.progressRecords,
            [userId]: currentProgress + 1,
          },
        };
      }
      return ch;
    });
    setChallenges(updated);
    saveChallengesToStorage(updated);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    soundManager.playVictory();
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });

    const typeLabels: Record<SpiritualChallenge['type'], string> = {
      reading: 'قراءة مشتركة',
      fasting: 'صوم وجهاد روحي',
      prayer: 'صلاة وحراسة قلب',
    };

    const newCh: SpiritualChallenge = {
      id: 'challenge-' + Date.now(),
      title: title.trim(),
      type,
      typeLabel: typeLabels[type],
      description: description.trim(),
      targetDays: Number(targetDays) || 7,
      creatorName: userName,
      membersCount: 1,
      joinedUserIds: [userId],
      progressRecords: { [userId]: 0 },
      createdAt: new Date().toISOString().split('T')[0],
      badgeIcon,
    };

    const updated = [newCh, ...challenges];
    setChallenges(updated);
    saveChallengesToStorage(updated);

    setTitle('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-right" dir="rtl">
      {/* Back Navigation Bar */}
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
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>المجتمع الروحي والجماعات المشتركة</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🤝 التحديات الروحية الجماعية وصوامع المكرسين
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          انضم إلى مجموعات الصوم أو القراءة المشتركة، وتابع التقدم الجماعي لتشجيع بعضكم البعض في طريق الملكوت.
        </p>

        <div className="pt-2">
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء تحدٍ جماعي جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Challenge Form Modal */}
      {isCreating && (
        <form
          onSubmit={handleCreateChallenge}
          className="p-6 rounded-3xl bg-stone-900 border border-amber-500/50 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              ✨ إنشاء مجموعة وتحدٍ روحي جماعي جديد
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-stone-400 hover:text-stone-200 text-xs"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-stone-300 font-semibold">عنوان التحدي الجماعي</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تحدي صوم وصلاة من أجل سلام الكنيسة..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">نوع التحدي</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SpiritualChallenge['type'])}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              >
                <option value="reading">📖 قراءة مشتركة</option>
                <option value="fasting">🌾 صوم وجهاد</option>
                <option value="prayer">🕊️ صلاة وحراسة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">المدة المستهدفة (بالأيام)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-300 font-semibold">رمز التحدي (إيموجي)</label>
              <input
                type="text"
                value={badgeIcon}
                onChange={(e) => setBadgeIcon(e.target.value)}
                maxLength={2}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none text-center"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-semibold">وصف التحدي وقوانين الجماعة</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب تفاصيل القراءة أو الصوم والهدف الروحي للمجموع..."
              required
              className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إطلاق التحدي الجماعي</span>
            </button>
          </div>
        </form>
      )}

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((ch) => {
          const isJoined = ch.joinedUserIds.includes(userId);
          const myDaysDone = ch.progressRecords[userId] || 0;
          const percentage = Math.min(100, Math.round((myDaysDone / ch.targetDays) * 100));

          return (
            <div
              key={ch.id}
              className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 hover:border-amber-400/60 transition space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-stone-950 border border-amber-500/20 shadow-inner">
                      {ch.badgeIcon}
                    </span>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold inline-block mb-1">
                        {ch.typeLabel}
                      </span>
                      <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                        {ch.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-stone-400 bg-stone-950 px-2.5 py-1 rounded-xl border border-stone-800 shrink-0">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ch.membersCount} مشارك</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {ch.description}
                </p>

                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800">
                  <span>منشئ التحدي: <strong className="text-amber-200">{ch.creatorName}</strong></span>
                  <span>المدة: {ch.targetDays} يوماً</span>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="space-y-3 pt-2">
                {isJoined ? (
                  <div className="space-y-2 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-200">تقدمك الشخصي في التحدي</span>
                      <span className="font-mono font-bold text-amber-400">
                        {myDaysDone} / {ch.targetDays} يوماً ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> منضم للمجموعة
                      </span>

                      <button
                        onClick={() => handleIncrementProgress(ch.id)}
                        disabled={myDaysDone >= ch.targetDays}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          myDaysDone >= ch.targetDays
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{myDaysDone >= ch.targetDays ? 'أتممت التحدي! 🎉' : 'سجل إنجاز اليوم (+1)'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinChallenge(ch.id)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>انضم إلى مجموعة التحدي الآن</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
