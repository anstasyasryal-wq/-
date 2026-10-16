import { User, Stage, Question, Announcement, DioceseRanking } from '../types';
import { OFFICIAL_QUESTIONS } from '../data/questionsData';
import { INITIAL_STAGES } from '../data/stagesData';

const CURRENT_USER_KEY = 'mokarasa_current_user';
const STORED_USERS_KEY = 'mokarasa_stored_users';
const STORED_STAGES_KEY = 'mokarasa_stored_stages';
const STORED_QUESTIONS_KEY = 'mokarasa_stored_questions';
const STORED_ANNOUNCEMENTS_KEY = 'mokarasa_stored_announcements';

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'انطلاق مسابقة «حسب قلب الله» بالأنماط الجديدة المتنوعة',
    content: 'تم تفعيل أنماط الأسئلة المتعددة: الاختيار من متعدد، الصواب والخطأ، ومطابقة المفاهيم عبر محاور الإيمان والجينات والثقافة والتاريخ!',
    date: 'اليوم',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    title: 'تحديث مراحل التقييم ومطابقة الإجابات الذكية',
    content: 'بإمكانك خوض المراحل بنظام تفاعلي متقدم يحسب النقاط الفورية مع توثيق بالشواهد والمراجع.',
    date: 'أمس',
  },
];

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      saveUserToRegistry(user);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch {}
}

export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORED_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const demoUsers: User[] = [
    {
      id: 'usr-1',
      name: 'أبونا أنطونيوس المحرقي',
      vocation: 'راهب',
      diocese: 'دير السيدة العذراء المحرق',
      totalScore: 980,
      currentStageId: 6,
      role: 'participant',
      completedStages: [1, 2, 3, 4, 5],
      stageScores: { 1: 195, 2: 195, 3: 200, 4: 190, 5: 200 },
    },
    {
      id: 'usr-2',
      name: 'تاسوني مريم الشماسة',
      vocation: 'مكرسة',
      diocese: 'إيبارشية المعادي وتوابعها',
      totalScore: 940,
      currentStageId: 6,
      role: 'participant',
      completedStages: [1, 2, 3, 4, 5],
      stageScores: { 1: 190, 2: 185, 3: 195, 4: 185, 5: 185 },
    },
    {
      id: 'usr-3',
      name: 'القس يوحنا شنودة',
      vocation: 'كاهن',
      diocese: 'إيبارشية أسيوط ودير الأنبا مقار',
      totalScore: 890,
      currentStageId: 5,
      role: 'participant',
      completedStages: [1, 2, 3, 4],
      stageScores: { 1: 180, 2: 180, 3: 180, 4: 170 },
    },
    {
      id: 'usr-4',
      name: 'الأم سارة السريانية',
      vocation: 'راهبة',
      diocese: 'دير القديسة دميانة ببراري بلقاس',
      totalScore: 860,
      currentStageId: 5,
      role: 'participant',
      completedStages: [1, 2, 3, 4],
      stageScores: { 1: 175, 2: 175, 3: 170, 4: 170 },
    },
  ];
  try {
    localStorage.setItem(STORED_USERS_KEY, JSON.stringify(demoUsers));
  } catch {}
  return demoUsers;
}

export function saveUserToRegistry(user: User): void {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  try {
    localStorage.setItem(STORED_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function getStoredStages(): Stage[] {
  if (typeof window === 'undefined') return INITIAL_STAGES;
  try {
    const raw = localStorage.getItem(STORED_STAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_STAGES;
}

export function saveStages(stages: Stage[]): void {
  try {
    localStorage.setItem(STORED_STAGES_KEY, JSON.stringify(stages));
  } catch {}
}

export function getStoredQuestions(): Question[] {
  if (typeof window === 'undefined') return OFFICIAL_QUESTIONS;
  try {
    const raw = localStorage.getItem(STORED_QUESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return OFFICIAL_QUESTIONS;
}

export function getStoredAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(STORED_ANNOUNCEMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ANNOUNCEMENTS;
}

export function saveAnnouncements(ann: Announcement[]): void {
  try {
    localStorage.setItem(STORED_ANNOUNCEMENTS_KEY, JSON.stringify(ann));
  } catch {}
}

export function sortParticipantsByTieBreaker(users: User[]): User[] {
  return [...users].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return (b.completedStages?.length || 0) - (a.completedStages?.length || 0);
  });
}

export function getDiocesesRankings(): DioceseRanking[] {
  const users = getStoredUsers();
  const map: Record<string, { total: number; count: number }> = {};

  users.forEach((u) => {
    const d = u.diocese || 'عام';
    if (!map[d]) map[d] = { total: 0, count: 0 };
    map[d].total += u.totalScore || 0;
    map[d].count += 1;
  });

  return Object.keys(map)
    .map((diocese) => ({
      diocese,
      totalPoints: map[diocese].total,
      participantsCount: map[diocese].count,
      avgScore: Math.round(map[diocese].total / Math.max(1, map[diocese].count)),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}
