const PHOTO_KEY_PREFIX = 'mokarasa_father_photo_';

export const spiritualFatherPhotoStorage = {
  getPhoto(userId: string): string | null {
    if (!userId) return null;
    try {
      return localStorage.getItem(`${PHOTO_KEY_PREFIX}${userId}`) || null;
    } catch {
      return null;
    }
  },

  savePhoto(userId: string, dataUrl: string): void {
    if (!userId) return;
    try {
      localStorage.setItem(`${PHOTO_KEY_PREFIX}${userId}`, dataUrl);
    } catch (err) {
      console.warn('Failed to save spiritual father photo:', err);
    }
  },

  removePhoto(userId: string): void {
    if (!userId) return;
    try {
      localStorage.removeItem(`${PHOTO_KEY_PREFIX}${userId}`);
    } catch (err) {
      console.warn('Failed to remove spiritual father photo:', err);
    }
  },
};
