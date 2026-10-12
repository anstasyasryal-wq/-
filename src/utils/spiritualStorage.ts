import { PersonalSpiritualDiaryEntry, UserPlanProgress, PersonalSpiritualStats } from '../types/spiritual';
import { User } from '../types';

const DIARY_STORAGE_KEY_PREFIX = 'hql_spiritual_diary_';
const PLANS_PROGRESS_KEY_PREFIX = 'hql_plan_progress_';
const ROSARY_STATS_KEY_PREFIX = 'hql_rosary_stats_';

// Client-side encryption key derivation and cipher for private notes
const ENCRYPTION_SALT = 'hql_confession_veil_2026';
const ENCRYPTED_PREFIX = 'enc_v1:';

export const encryptClientPayload = (text: string, userId: string): string => {
  try {
    const key = `${userId}_${ENCRYPTION_SALT}`;
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(text);
    const keyBytes = encoder.encode(key);

    const xorBytes = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      xorBytes[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    let binary = '';
    for (let i = 0; i < xorBytes.length; i++) {
      binary += String.fromCharCode(xorBytes[i]);
    }
    return `${ENCRYPTED_PREFIX}${btoa(binary)}`;
  } catch (err) {
    console.error('Encryption fallback:', err);
    return text;
  }
};

export const decryptClientPayload = (cipherText: string, userId: string): string => {
  try {
    if (!cipherText.startsWith(ENCRYPTED_PREFIX)) {
      // Legacy plaintext support
      return cipherText;
    }
    const base64Data = cipherText.slice(ENCRYPTED_PREFIX.length);
    const binary = atob(base64Data);
    const xorBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      xorBytes[i] = binary.charCodeAt(i);
    }

    const key = `${userId}_${ENCRYPTION_SALT}`;
    const keyBytes = new TextEncoder().encode(key);
    const decryptedBytes = new Uint8Array(xorBytes.length);
    for (let i = 0; i < xorBytes.length; i++) {
      decryptedBytes[i] = xorBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return new TextDecoder().decode(decryptedBytes);
  } catch (err) {
    console.error('Decryption failed, fallback to raw:', err);
    return cipherText;
  }
};

export const isDiaryEncryptedInStorage = (userId: string): boolean => {
  try {
    const raw = localStorage.getItem(`${DIARY_STORAGE_KEY_PREFIX}${userId}`);
    return !!raw && raw.startsWith(ENCRYPTED_PREFIX);
  } catch {
    return false;
  }
};

export const getDiaryEntries = (userId: string): PersonalSpiritualDiaryEntry[] => {
  try {
    const raw = localStorage.getItem(`${DIARY_STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    const decrypted = decryptClientPayload(raw, userId);
    return JSON.parse(decrypted);
  } catch {
    return [];
  }
};

export const saveDiaryEntry = (
  userId: string,
  entry: Omit<PersonalSpiritualDiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
): PersonalSpiritualDiaryEntry => {
  const existing = getDiaryEntries(userId);
  const now = new Date().toISOString();
  const newEntry: PersonalSpiritualDiaryEntry = {
    ...entry,
    id: `diary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  const updated = [newEntry, ...existing];
  try {
    const serialized = JSON.stringify(updated);
    const encrypted = encryptClientPayload(serialized, userId);
    localStorage.setItem(`${DIARY_STORAGE_KEY_PREFIX}${userId}`, encrypted);
  } catch (e) {
    console.error('Failed to save diary entry:', e);
  }
  return newEntry;
};

export const updateDiaryEntry = (
  userId: string,
  entryId: string,
  updates: Partial<Omit<PersonalSpiritualDiaryEntry, 'id' | 'userId' | 'createdAt'>>
): PersonalSpiritualDiaryEntry | null => {
  const existing = getDiaryEntries(userId);
  const index = existing.findIndex((e) => e.id === entryId);
  if (index === -1) return null;

  const updatedEntry: PersonalSpiritualDiaryEntry = {
    ...existing[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...existing];
  updatedList[index] = updatedEntry;

  try {
    const serialized = JSON.stringify(updatedList);
    const encrypted = encryptClientPayload(serialized, userId);
    localStorage.setItem(`${DIARY_STORAGE_KEY_PREFIX}${userId}`, encrypted);
  } catch (e) {
    console.error('Failed to update diary entry:', e);
  }
  return updatedEntry;
};

export const deleteDiaryEntry = (userId: string, entryId: string): void => {
  const existing = getDiaryEntries(userId);
  const filtered = existing.filter((e) => e.id !== entryId);
  try {
    const serialized = JSON.stringify(filtered);
    const encrypted = encryptClientPayload(serialized, userId);
    localStorage.setItem(`${DIARY_STORAGE_KEY_PREFIX}${userId}`, encrypted);
  } catch (e) {
    console.error('Failed to delete diary entry:', e);
  }
};

export const getPlanProgress = (userId: string, planId: string): UserPlanProgress => {
  try {
    const raw = localStorage.getItem(`${PLANS_PROGRESS_KEY_PREFIX}${userId}_${planId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    planId,
    completedDays: [],
    startedAt: new Date().toISOString(),
    lastReadAt: new Date().toISOString(),
  };
};

export const togglePlanDayCompletion = (
  userId: string,
  planId: string,
  dayNumber: number
): UserPlanProgress => {
  const current = getPlanProgress(userId, planId);
  let updatedDays: number[];
  if (current.completedDays.includes(dayNumber)) {
    updatedDays = current.completedDays.filter((d) => d !== dayNumber);
  } else {
    updatedDays = [...current.completedDays, dayNumber].sort((a, b) => a - b);
  }
  const updated: UserPlanProgress = {
    ...current,
    completedDays: updatedDays,
    lastReadAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(`${PLANS_PROGRESS_KEY_PREFIX}${userId}_${planId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save plan progress:', e);
  }
  return updated;
};

export const getRosaryStats = (userId: string): { totalBeads: number; totalRopes: number } => {
  try {
    const raw = localStorage.getItem(`${ROSARY_STATS_KEY_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { totalBeads: 0, totalRopes: 0 };
};

export const recordRosarySession = (
  userId: string,
  beadsToAdd: number,
  completedRopesToAdd: number
): { totalBeads: number; totalRopes: number } => {
  const current = getRosaryStats(userId);
  const updated = {
    totalBeads: current.totalBeads + beadsToAdd,
    totalRopes: current.totalRopes + completedRopesToAdd,
  };
  try {
    localStorage.setItem(`${ROSARY_STATS_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update rosary stats:', e);
  }
  return updated;
};

export const getPersonalSpiritualStats = (userId: string): PersonalSpiritualStats => {
  const rosary = getRosaryStats(userId);
  const diary = getDiaryEntries(userId);

  // Check saved plans
  let completedPlansCount = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${PLANS_PROGRESS_KEY_PREFIX}${userId}_`)) {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed: UserPlanProgress = JSON.parse(val);
          if (parsed.completedDays.length >= 7) {
            completedPlansCount++;
          }
        }
      }
    }
  } catch {
    // ignore
  }

  let activeVirtuesPracticed = 0;
  try {
    const virtRaw = localStorage.getItem('mokarasa_completed_virtues_today');
    if (virtRaw) {
      activeVirtuesPracticed = JSON.parse(virtRaw).length;
    }
  } catch {
    // ignore
  }

  return {
    totalRosaryCount: rosary.totalBeads,
    completedPlansCount,
    diaryEntriesCount: diary.length,
    savedStudyNotesCount: diary.filter((d) => !!d.dailyBibleContemplation).length,
    activeVirtuesPracticed,
  };
};
