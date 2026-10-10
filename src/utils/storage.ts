import { INITIAL_QUESTIONS } from '../data/questions';
import { Question, SoloQuizResult } from '../types';

const STORAGE_KEYS = {
  CUSTOM_QUESTIONS: 'mokarasa_custom_questions',
  LEADERBOARD: 'mokarasa_leaderboard_history',
  FAVORITES: 'mokarasa_bookmarked_questions',
};

export const getStoredQuestions = (): Question[] => {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  try {
    const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    const custom: Question[] = rawCustom ? JSON.parse(rawCustom) : [];
    return [...INITIAL_QUESTIONS, ...custom];
  } catch {
    return INITIAL_QUESTIONS;
  }
};

export const saveCustomQuestion = (q: Omit<Question, 'id' | 'isCustom'>): Question => {
  const customId = `custom-${Date.now()}`;
  const newQuestion: Question = {
    ...q,
    id: customId,
    isCustom: true,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    const existing: Question[] = raw ? JSON.parse(raw) : [];
    existing.unshift(newQuestion);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save custom question', err);
  }

  return newQuestion;
};

export const deleteCustomQuestion = (id: string): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    if (!raw) return;
    const existing: Question[] = JSON.parse(raw);
    const filtered = existing.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete custom question', err);
  }
};

export const getLeaderboardResults = (): SoloQuizResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveQuizResult = (result: SoloQuizResult): void => {
  try {
    const existing = getLeaderboardResults();
    const updated = [result, ...existing].slice(0, 50); // Keep top 50 recents
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save quiz result', err);
  }
};

export const computeMonasticTitle = (percentage: number): { title: string; grade: SoloQuizResult['grade'] } => {
  if (percentage >= 95) {
    return { title: 'وسام «حَسَبَ قَلْبِ اللهِ» - عمق الأمانة والاتضاع الكنسي', grade: 'ممتاز مرتفع' };
  } else if (percentage >= 85) {
    return { title: 'وسام حكمة الإفراز والتمييز الروحي والكنسي', grade: 'ممتاز' };
  } else if (percentage >= 75) {
    return { title: 'وسام السهر الروحي والأمانة في الخدمة والرعاية', grade: 'جيد جداً' };
  } else if (percentage >= 60) {
    return { title: 'وسام الجهاد الصالح والنمو الداخلي المستمر', grade: 'جيد' };
  } else {
    return { title: 'بركة المسيرة والبداية المتجددة في محبة الله', grade: 'مقبول' };
  }
};
