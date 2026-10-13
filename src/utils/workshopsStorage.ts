import { UserWorkshopProgress } from '../types/workshops';

const WORKSHOP_PROGRESS_KEY_PREFIX = 'mokarasa_workshop_progress_';

export const workshopsStorage = {
  getAllProgress(userId: string): Record<string, UserWorkshopProgress> {
    if (!userId) return {};
    try {
      const data = localStorage.getItem(`${WORKSHOP_PROGRESS_KEY_PREFIX}${userId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getWorkshopProgress(userId: string, workshopId: string): UserWorkshopProgress {
    const all = this.getAllProgress(userId);
    return (
      all[workshopId] || {
        workshopId,
        completedUnitIds: [],
        currentUnitId: '',
        quizScores: {},
        unitAnswers: {},
        unitPracticalNotes: {},
        finalProjectDraft: '',
        isCompleted: false,
        lastAccessedAt: new Date().toISOString(),
      }
    );
  },

  saveWorkshopProgress(userId: string, progress: UserWorkshopProgress): void {
    if (!userId) return;
    const all = this.getAllProgress(userId);
    all[progress.workshopId] = {
      ...progress,
      lastAccessedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`${WORKSHOP_PROGRESS_KEY_PREFIX}${userId}`, JSON.stringify(all));
    } catch (err) {
      console.warn('Failed to save workshop progress:', err);
    }
  },

  markUnitCompleted(
    userId: string,
    workshopId: string,
    unitId: string,
    quizScore?: number,
    answers?: Record<string, number>,
    practicalNotes?: string
  ): UserWorkshopProgress {
    const current = this.getWorkshopProgress(userId, workshopId);
    const unitSet = new Set(current.completedUnitIds);
    unitSet.add(unitId);

    const updatedScores = { ...current.quizScores };
    if (quizScore !== undefined) {
      updatedScores[unitId] = quizScore;
    }

    const updatedAnswers = { ...current.unitAnswers };
    if (answers) {
      updatedAnswers[unitId] = answers;
    }

    const updatedNotes = { ...current.unitPracticalNotes };
    if (practicalNotes) {
      updatedNotes[unitId] = practicalNotes;
    }

    const updated: UserWorkshopProgress = {
      ...current,
      completedUnitIds: Array.from(unitSet),
      currentUnitId: unitId,
      quizScores: updatedScores,
      unitAnswers: updatedAnswers,
      unitPracticalNotes: updatedNotes,
      lastAccessedAt: new Date().toISOString(),
    };

    this.saveWorkshopProgress(userId, updated);
    return updated;
  },

  submitFinalProject(userId: string, workshopId: string, draft: string): UserWorkshopProgress {
    const current = this.getWorkshopProgress(userId, workshopId);
    const updated: UserWorkshopProgress = {
      ...current,
      finalProjectDraft: draft,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };
    this.saveWorkshopProgress(userId, updated);
    return updated;
  },
};
