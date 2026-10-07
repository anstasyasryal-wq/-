import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocFromServer,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from './firebase';
import { User, Stage, Question, Announcement, StageAttempt } from '../types';
import { COMPETITION_STAGES, STAGE_QUESTIONS } from '../data/competitionStages';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockParticipants';
import { sortParticipantsByTieBreaker } from './competitionEngine';

// State flags
let isCloudConnected = false;
let currentAuthUser: FirebaseUser | null = null;

// Listen to Auth State
if (isFirebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    currentAuthUser = user;
  });
}

/**
 * Test connectivity with Cloud Firestore using getDocFromServer
 */
export async function testFirestoreConnection(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    // Try to reach Firestore server
    const testRef = doc(db, 'contestSettings', 'main');
    await getDocFromServer(testRef);
    isCloudConnected = true;
    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // If document doesn't exist, it still reached the server!
    if (errorMsg.includes('No document to update') || errorMsg.includes('does not exist')) {
      isCloudConnected = true;
      return true;
    }
    // Connected if no network error
    if (!errorMsg.includes('unavailable') && !errorMsg.includes('offline')) {
      isCloudConnected = true;
      return true;
    }
    console.warn('Firestore server connection test:', errorMsg);
    isCloudConnected = false;
    return false;
  }
}

/**
 * Ensure an active Firebase Auth session exists
 */
export async function ensureFirebaseAuth(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured) return null;
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    currentAuthUser = cred.user;
    return cred.user;
  } catch (err) {
    console.warn('Firebase Anonymous sign-in error:', err);
    return null;
  }
}

/**
 * Seed initial stages, questions, and announcements in Cloud Firestore if empty
 */
export async function seedCloudDatabaseIfEmpty(): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    await ensureFirebaseAuth();

    // 1. Check Stages
    const stagesCol = collection(db, 'stages');
    const stageSnap = await getDocs(stagesCol);
    if (stageSnap.empty) {
      console.log('Seeding initial stages to Firestore...');
      for (const stg of COMPETITION_STAGES) {
        await setDoc(doc(db, 'stages', String(stg.id)), stg);
      }
    }

    // 2. Check Announcements
    const annCol = collection(db, 'announcements');
    const annSnap = await getDocs(annCol);
    if (annSnap.empty) {
      console.log('Seeding initial announcements to Firestore...');
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
    }

    // 3. Check Questions
    const qCol = collection(db, 'questions');
    const qSnap = await getDocs(qCol);
    if (qSnap.empty) {
      console.log('Seeding initial question bank to Firestore (batched)...');
      // Use batches of 20 to avoid size limits
      const chunks: Question[][] = [];
      for (let i = 0; i < STAGE_QUESTIONS.length; i += 20) {
        chunks.push(STAGE_QUESTIONS.slice(i, i + 20));
      }
      for (const chunk of chunks) {
        const batch = writeBatch(db);
        for (const q of chunk) {
          batch.set(doc(db, 'questions', q.id), q);
        }
        await batch.commit();
      }
    }
  } catch (err) {
    console.warn('Cloud database seed check:', err);
  }
}

/**
 * Register or sync user profile in Cloud Firestore
 */
export async function syncUserToCloud(user: User): Promise<User> {
  if (!isFirebaseConfigured) return user;
  try {
    const authUser = await ensureFirebaseAuth();
    const userId = authUser ? authUser.uid : user.id;

    const cloudUser: User = {
      ...user,
      id: userId,
    };

    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, cloudUser, { merge: true });
    return cloudUser;
  } catch (err) {
    console.warn('Sync user to cloud failed (using local):', err);
    return user;
  }
}

/**
 * Submit verified stage attempt to Cloud Firestore
 * IDEMPOTENT: Uses attemptId = `${userId}_stage_${stageId}`
 */
export async function submitVerifiedStageAttempt(
  user: User,
  stageId: number,
  clientScore: number,
  correctCount: number,
  timeSpentSeconds: number,
  answers: StageAttempt['answers']
): Promise<{ success: boolean; newRank: number; updatedUser: User }> {
  // If cloud is available, record to Firestore
  if (isFirebaseConfigured) {
    try {
      const authUser = await ensureFirebaseAuth();
      const userId = authUser ? authUser.uid : user.id;
      const attemptId = `${userId}_stage_${stageId}`;
      const safeTimeSpent = Math.max(5, Math.min(600, Number(timeSpentSeconds) || 5));
      const safeScore = Math.max(0, Math.min(150, Number(clientScore) || 0));
      const safeCorrect = Math.max(0, Math.min(10, Number(correctCount) || 0));

      // 1. Record Attempt Document (Write-once / Append-only)
      const attemptDocRef = doc(db, 'attempts', attemptId);
      await setDoc(attemptDocRef, {
        id: attemptId,
        userId,
        participantName: user.name,
        consecrationHouse: user.consecrationHouse,
        diocese: user.diocese,
        stageId: Number(stageId),
        score: safeScore,
        correctCount: safeCorrect,
        totalTimeSpent: safeTimeSpent,
        answers,
        completedAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp(),
      });

      // 2. Fetch current user from cloud to prevent race conditions
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const cloudData = userSnap.exists() ? (userSnap.data() as User) : user;

      const stageScores = cloudData.stageScores || {};
      const stageCorrectCounts = cloudData.stageCorrectCounts || {};
      const stageTimes = cloudData.stageTimes || {};

      const prevScore = stageScores[stageId] || 0;
      if (clientScore >= prevScore || stageCorrectCounts[stageId] === undefined) {
        stageScores[stageId] = Math.max(prevScore, clientScore);
        stageCorrectCounts[stageId] = correctCount;
        stageTimes[stageId] = timeSpentSeconds;
      }

      const totalPoints = Object.values(stageScores).reduce((a, b) => a + b, 0);
      const totalCorrect = Object.values(stageCorrectCounts).reduce((a, b) => a + b, 0);
      const totalTime = Object.values(stageTimes).reduce((a, b) => a + b, 0);
      const nextStageId = Math.max(cloudData.currentStageId, stageId + 1);

      const updatedUser: User = {
        ...cloudData,
        id: userId,
        totalPoints,
        correctAnswersCount: totalCorrect,
        totalTimeSpentSeconds: totalTime,
        stageScores,
        stageCorrectCounts,
        stageTimes,
        currentStageId: nextStageId,
        isQualifiedForFinal: nextStageId >= 6,
      };

      await setDoc(userRef, updatedUser, { merge: true });

      // 3. Compute live rank from Cloud users
      const allUsersSnap = await getDocs(collection(db, 'users'));
      const allParticipants: User[] = [];
      allUsersSnap.forEach((d) => {
        const u = d.data() as User;
        if (u.role === 'participant') allParticipants.push(u);
      });

      const sorted = sortParticipantsByTieBreaker(allParticipants);
      const rank = sorted.findIndex((u) => u.id === userId) + 1;

      return {
        success: true,
        newRank: rank > 0 ? rank : 1,
        updatedUser,
      };
    } catch (err) {
      console.warn('Cloud attempt submission failed, using local fallback:', err);
    }
  }

  // Local fallback if offline
  return {
    success: true,
    newRank: 1,
    updatedUser: user,
  };
}

/**
 * Fetch all participants from Cloud Firestore with real-time subscription support
 */
export function subscribeToCloudLeaderboard(callback: (users: User[]) => void): () => void {
  if (!isFirebaseConfigured) {
    return () => {};
  }
  try {
    const usersCol = collection(db, 'users');
    return onSnapshot(
      usersCol,
      (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((d) => {
          const u = d.data() as User;
          if (u.role === 'participant') {
            list.push(u);
          }
        });
        if (list.length > 0) {
          callback(sortParticipantsByTieBreaker(list));
        }
      },
      (err) => {
        console.warn('Leaderboard onSnapshot error:', err);
      }
    );
  } catch (err) {
    console.warn('Cloud leaderboard subscription failed:', err);
    return () => {};
  }
}

/**
 * Subscribe to Cloud Stages in real-time
 */
export function subscribeToCloudStages(callback: (stages: Stage[]) => void): () => void {
  if (!isFirebaseConfigured) return () => {};
  try {
    const colRef = collection(db, 'stages');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Stage[] = [];
        snapshot.forEach((d) => list.push(d.data() as Stage));
        if (list.length > 0) {
          list.sort((a, b) => a.id - b.id);
          callback(list);
        }
      },
      (err) => console.warn('Stages onSnapshot error:', err)
    );
  } catch {
    return () => {};
  }
}

/**
 * Subscribe to Announcements in real-time
 */
export function subscribeToCloudAnnouncements(callback: (ann: Announcement[]) => void): () => void {
  if (!isFirebaseConfigured) return () => {};
  try {
    const colRef = collection(db, 'announcements');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Announcement[] = [];
        snapshot.forEach((d) => list.push(d.data() as Announcement));
        if (list.length > 0) {
          callback(list);
        }
      },
      (err) => console.warn('Announcements onSnapshot error:', err)
    );
  } catch {
    return () => {};
  }
}

/**
 * Cloud Supervisor Operations
 */
export async function updateCloudStage(stage: Stage): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, 'stages', String(stage.id)), stage, { merge: true });
    return true;
  } catch (err) {
    console.error('Update cloud stage error:', err);
    return false;
  }
}

export async function saveCloudQuestion(question: Question): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, 'questions', question.id), question, { merge: true });
    return true;
  } catch (err) {
    console.error('Save cloud question error:', err);
    return false;
  }
}

export async function deleteCloudQuestion(questionId: string): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await deleteDoc(doc(db, 'questions', questionId));
    return true;
  } catch (err) {
    console.error('Delete cloud question error:', err);
    return false;
  }
}

export async function postCloudAnnouncement(ann: Announcement): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, 'announcements', ann.id), ann);
    return true;
  } catch (err) {
    console.error('Post cloud announcement error:', err);
    return false;
  }
}
