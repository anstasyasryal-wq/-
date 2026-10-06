import {
  User,
  Stage,
  Question,
  StageAttempt,
  Announcement,
  DioceseRanking,
  FinalAwards,
} from '../types';
import { COMPETITION_STAGES, STAGE_QUESTIONS } from '../data/competitionStages';
import { MOCK_PARTICIPANTS, INITIAL_ANNOUNCEMENTS } from '../data/mockParticipants';
import { shuffleQuestionOptions } from './quizUtils';

const KEYS = {
  USERS: 'mokarasa_comp_users',
  CURRENT_USER: 'mokarasa_comp_current_user',
  STAGES: 'mokarasa_comp_stages',
  QUESTIONS: 'mokarasa_comp_questions',
  ANNOUNCEMENTS: 'mokarasa_comp_announcements',
  ATTEMPTS: 'mokarasa_comp_attempts',
};

// ==========================================
// 1. Storage Helpers
// ==========================================
export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return MOCK_PARTICIPANTS;
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_PARTICIPANTS));
      return MOCK_PARTICIPANTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_PARTICIPANTS;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    // Default to the first participant for demo, or null
    const users = getStoredUsers();
    const demo = users.find((u) => u.role === 'participant') || null;
    return demo;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

export function getStoredStages(): Stage[] {
  if (typeof window === 'undefined') return COMPETITION_STAGES;
  try {
    const raw = localStorage.getItem(KEYS.STAGES);
    if (!raw) {
      localStorage.setItem(KEYS.STAGES, JSON.stringify(COMPETITION_STAGES));
      return COMPETITION_STAGES;
    }
    return JSON.parse(raw);
  } catch {
    return COMPETITION_STAGES;
  }
}

export function saveStages(stages: Stage[]): void {
  try {
    localStorage.setItem(KEYS.STAGES, JSON.stringify(stages));
  } catch (err) {
    console.error('Failed to save stages', err);
  }
}

export function getStoredQuestions(): Question[] {
  if (typeof window === 'undefined') return STAGE_QUESTIONS;
  try {
    const raw = localStorage.getItem(KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(STAGE_QUESTIONS));
      return STAGE_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return STAGE_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions', err);
  }
}

export function getStoredAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncements(ann: Announcement[]): void {
  try {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(ann));
  } catch (err) {
    console.error('Failed to save announcements', err);
  }
}

// ==========================================
// 2. Authentication & Registration
// ==========================================
export function registerParticipant(data: {
  name: string;
  consecrationHouse: string;
  diocese: string;
  governorate: string;
  code?: string;
  consecrationRank?: User['consecrationRank'];
  ministryField?: string;
  consecrationVerse?: string;
  personalBio?: string;
  patronSaint?: string;
}): User {
  const users = getStoredUsers();
  const code =
    data.code?.trim().toUpperCase() || `MK-${Math.floor(100 + Math.random() * 900)}`;

  // Check if exists
  const existing = users.find((u) => u.code === code);
  if (existing) {
    setCurrentUser(existing);
    return existing;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    consecrationHouse: data.consecrationHouse.trim(),
    diocese: data.diocese.trim(),
    governorate: data.governorate.trim(),
    code,
    role: 'participant',
    currentStageId: 1,
    isQualifiedForFinal: false,
    totalPoints: 0,
    correctAnswersCount: 0,
    totalTimeSpentSeconds: 0,
    stageScores: {},
    registeredAt: new Date().toISOString().split('T')[0],
    consecrationRank: data.consecrationRank || 'مكرسة مبتدئة',
    ministryField: data.ministryField || 'خدمة عامة وافتقاد',
    consecrationVerse:
      data.consecrationVerse || '«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ؛ فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ»',
    personalBio:
      data.personalBio || 'مكرسة لخدمة المسيح والكنيسة، أسعى للأمانة في رسالتي والنمو في حياة القداسة والشهادة للفادي.',
    patronSaint: data.patronSaint || 'العذراء مريم أم النور',
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return newUser;
}

export function loginWithCode(code: string): User | null {
  const users = getStoredUsers();
  const cleaned = code.trim().toUpperCase();

  if (cleaned === 'ADMIN') {
    let admin = users.find((u) => u.role === 'supervisor');
    if (!admin) {
      admin = {
        id: 'admin-1',
        name: 'تاسوني المشرفة العامة',
        consecrationHouse: 'بيت بنات مريم للتكريس',
        diocese: 'إيبارشية بني سويف',
        governorate: 'بني سويف',
        code: 'ADMIN',
        role: 'supervisor',
        currentStageId: 1,
        isQualifiedForFinal: false,
        totalPoints: 0,
        correctAnswersCount: 0,
        totalTimeSpentSeconds: 0,
        stageScores: {},
        registeredAt: new Date().toISOString().split('T')[0],
      };
      users.push(admin);
      saveUsers(users);
    }
    setCurrentUser(admin);
    return admin;
  }

  const user = users.find((u) => u.code.toUpperCase() === cleaned);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

// ==========================================
// 3. Question Retrieval & Shuffling
// ==========================================
export function getQuestionsForStage(stageId: number): Question[] {
  const pool = getStoredQuestions().filter((q) => q.stageId === stageId);
  // Dynamically shuffle each question's options so option 0 is not predictable
  return pool.map(shuffleQuestionOptions);
}

// ==========================================
// 4. Scoring & Tie-Breaking
// ==========================================
/**
 * Tie-Breaking Rules:
 * 1. Total Points (higher is better)
 * 2. Correct Answers Count (higher is better)
 * 3. Average Response Time (lower is better)
 * 4. Hardest Stage Score (higher is better)
 */
export function sortParticipantsByTieBreaker(participants: User[]): User[] {
  return [...participants].sort((a, b) => {
    // 1. Total points
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // 2. Correct answers
    if (b.correctAnswersCount !== a.correctAnswersCount) {
      return b.correctAnswersCount - a.correctAnswersCount;
    }
    // 3. Average time spent per answer
    const avgA = a.correctAnswersCount > 0 ? a.totalTimeSpentSeconds / a.correctAnswersCount : 999;
    const avgB = b.correctAnswersCount > 0 ? b.totalTimeSpentSeconds / b.correctAnswersCount : 999;
    if (avgA !== avgB) {
      return avgA - avgB; // lower time is better
    }
    // 4. Hardest stage score (stage 5 or 4)
    const hardA = (a.stageScores[5] || 0) + (a.stageScores[4] || 0);
    const hardB = (b.stageScores[5] || 0) + (b.stageScores[4] || 0);
    return hardB - hardA;
  });
}

// ==========================================
// 5. Stage Completion & Progress Recording
// ==========================================
export function recordStageAttempt(
  userId: string,
  stageId: number,
  scoreEarned: number,
  correctCount: number,
  timeSpentSeconds: number
): { user: User; newRank: number } {
  const users = getStoredUsers();
  const userIdx = users.findIndex((u) => u.id === userId);
  if (userIdx === -1) {
    throw new Error('User not found');
  }

  const user = { ...users[userIdx] };
  const prevStageScore = user.stageScores[stageId] || 0;
  const deltaScore = Math.max(0, scoreEarned - prevStageScore);

  user.totalPoints += deltaScore;
  user.stageScores[stageId] = Math.max(prevStageScore, scoreEarned);
  user.correctAnswersCount += correctCount;
  user.totalTimeSpentSeconds += timeSpentSeconds;

  // Auto advance to next stage if passing threshold
  if (user.currentStageId <= stageId) {
    user.currentStageId = stageId + 1;
    if (user.currentStageId >= 6) {
      user.isQualifiedForFinal = true;
    }
  }

  users[userIdx] = user;
  saveUsers(users);

  // Update current user in session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(user);
  }

  const sorted = sortParticipantsByTieBreaker(users.filter((u) => u.role === 'participant'));
  const rank = sorted.findIndex((u) => u.id === userId) + 1;

  return { user, newRank: rank };
}

// ==========================================
// 6. Automatic Electronic Qualification Algorithm
// ==========================================
export function runAutomaticQualifications(stageId: number): {
  promotedCount: number;
  totalQualified: number;
  promotedUsers: User[];
} {
  const users = getStoredUsers();
  const stages = getStoredStages();
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return { promotedCount: 0, totalQualified: 0, promotedUsers: [] };

  const participants = users.filter((u) => u.role === 'participant');
  const sorted = sortParticipantsByTieBreaker(participants);

  // Determine how many qualify
  let quota = 0;
  if (stage.qualificationRule.type === 'percentage') {
    quota = Math.max(1, Math.ceil((sorted.length * stage.qualificationRule.value) / 100));
  } else {
    quota = Math.min(sorted.length, stage.qualificationRule.value);
  }

  const qualifiedForNextStage = sorted.slice(0, quota);
  const nextStageId = stageId + 1;
  const promotedUsers: User[] = [];

  const updatedUsers = users.map((u) => {
    if (qualifiedForNextStage.some((q) => q.id === u.id)) {
      if (u.currentStageId < nextStageId) {
        promotedUsers.push(u);
        return {
          ...u,
          currentStageId: nextStageId,
          isQualifiedForFinal: nextStageId >= 6 ? true : u.isQualifiedForFinal,
        };
      }
    }
    return u;
  });

  saveUsers(updatedUsers);

  // Sync current user
  const current = getCurrentUser();
  if (current) {
    const updatedCurrent = updatedUsers.find((u) => u.id === current.id);
    if (updatedCurrent) setCurrentUser(updatedCurrent);
  }

  return {
    promotedCount: promotedUsers.length,
    totalQualified: qualifiedForNextStage.length,
    promotedUsers,
  };
}

// ==========================================
// 7. Dioceses Ranking
// ==========================================
export function getDiocesesRankings(): DioceseRanking[] {
  const users = getStoredUsers().filter((u) => u.role === 'participant');
  const dioceseMap: Record<
    string,
    { totalPoints: number; count: number; houses: Record<string, number> }
  > = {};

  users.forEach((u) => {
    const d = u.diocese || 'إيبارشية عامة';
    if (!dioceseMap[d]) {
      dioceseMap[d] = { totalPoints: 0, count: 0, houses: {} };
    }
    dioceseMap[d].totalPoints += u.totalPoints;
    dioceseMap[d].count += 1;
    dioceseMap[d].houses[u.consecrationHouse] =
      (dioceseMap[d].houses[u.consecrationHouse] || 0) + u.totalPoints;
  });

  const list: DioceseRanking[] = Object.keys(dioceseMap).map((name) => {
    const info = dioceseMap[name];
    let topHouse = 'بيت التكريس';
    let maxHousePoints = -1;
    Object.keys(info.houses).forEach((h) => {
      if (info.houses[h] > maxHousePoints) {
        maxHousePoints = info.houses[h];
        topHouse = h;
      }
    });

    return {
      name,
      totalPoints: info.totalPoints,
      participantsCount: info.count,
      averageScore: Math.round(info.totalPoints / Math.max(1, info.count)),
      rank: 0,
      topHouse,
    };
  });

  // Sort by average then total
  list.sort((a, b) => b.averageScore - a.averageScore || b.totalPoints - a.totalPoints);
  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return list;
}

// ==========================================
// 8. Grand Final Awards Ceremony
// ==========================================
export function computeFinalAwards(): FinalAwards {
  const participants = getStoredUsers().filter((u) => u.role === 'participant');
  const sorted = sortParticipantsByTieBreaker(participants);

  const firstPlace = sorted[0] || null;
  const secondPlace = sorted[1] || null;
  const thirdPlace = sorted[2] || null;

  // Fastest: least average response time among top scorers
  const sortedBySpeed = [...participants]
    .filter((u) => u.correctAnswersCount >= 10)
    .sort((a, b) => {
      const avgA = a.totalTimeSpentSeconds / Math.max(1, a.correctAnswersCount);
      const avgB = b.totalTimeSpentSeconds / Math.max(1, b.correctAnswersCount);
      return avgA - avgB;
    });
  const fastestParticipant = sortedBySpeed[0] || firstPlace;

  // Most Accurate: highest percentage of correct answers
  const sortedByAccuracy = [...participants].sort(
    (a, b) => b.correctAnswersCount - a.correctAnswersCount
  );
  const mostAccurate = sortedByAccuracy[0] || firstPlace;

  // Star of Intelligence: highest score in Stage 2 (الاكتشاف)
  const sortedByIntel = [...participants].sort(
    (a, b) => (b.stageScores[2] || 0) - (a.stageScores[2] || 0)
  );
  const intelligenceStar = sortedByIntel[0] || firstPlace;

  // Star of Knowledge: highest score in Stage 1 (البداية)
  const sortedByKnowledge = [...participants].sort(
    (a, b) => (b.stageScores[1] || 0) - (a.stageScores[1] || 0)
  );
  const knowledgeStar = sortedByKnowledge[0] || firstPlace;

  // Star of Hymns: highest score in Stage 4 (الحواس والألحان)
  const sortedByHymns = [...participants].sort(
    (a, b) => (b.stageScores[4] || 0) - (a.stageScores[4] || 0)
  );
  const hymnsStar = sortedByHymns[0] || secondPlace || firstPlace;

  return {
    firstPlace,
    secondPlace,
    thirdPlace,
    fastestParticipant,
    mostAccurate,
    intelligenceStar,
    knowledgeStar,
    hymnsStar,
  };
}
