import { User, Stage, Announcement } from '../types';

export async function seedCloudDatabaseIfEmpty(): Promise<void> {
  // Safe local or cloud sync
}

export function subscribeToCloudStages(callback: (stages: Stage[]) => void): () => void {
  return () => {};
}

export function subscribeToCloudAnnouncements(callback: (ann: Announcement[]) => void): () => void {
  return () => {};
}

export function subscribeToCloudLeaderboard(callback: (users: User[]) => void): () => void {
  return () => {};
}

export async function syncUserToCloud(user: User): Promise<void> {
  // Sync user state
}
