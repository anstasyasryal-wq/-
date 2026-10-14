import { UserBookRecord } from '../types/library';
import {
  saveReadingProgressToCloud,
  getAllUserReadingProgressFromCloud,
} from './firebaseService';

const BOOK_PROGRESS_KEY_PREFIX = 'mokarasa_book_progress_';
const FAVORITE_ARTICLES_KEY_PREFIX = 'mokarasa_fav_articles_';
const ARTICLE_READ_PROGRESS_KEY_PREFIX = 'mokarasa_art_progress_';
const RECENT_ITEMS_KEY_PREFIX = 'mokarasa_recent_read_';

export interface RecentItem {
  type: 'article' | 'book';
  id: string;
  title: string;
  category: string;
  updatedAt: string;
}

export const libraryStorage = {
  // Books
  getUserBookRecords(userId: string): Record<string, UserBookRecord> {
    if (!userId) return {};
    try {
      const data = localStorage.getItem(`${BOOK_PROGRESS_KEY_PREFIX}${userId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getBookRecord(userId: string, bookId: string): UserBookRecord {
    const all = this.getUserBookRecords(userId);
    return (
      all[bookId] || {
        bookId,
        status: 'not_started',
        currentPage: 0,
        totalPages: 100,
        chapterIndex: 0,
        pageInChapter: 0,
        lastUpdated: new Date().toISOString(),
        personalNotes: '',
        isFavorite: false,
      }
    );
  },

  saveBookRecord(userId: string, record: UserBookRecord): void {
    if (!userId) return;
    const all = this.getUserBookRecords(userId);
    all[record.bookId] = {
      ...record,
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`${BOOK_PROGRESS_KEY_PREFIX}${userId}`, JSON.stringify(all));
      this.recordRecentItem(userId, {
        type: 'book',
        id: record.bookId,
        title: record.bookId,
        category: 'قراءة الكتب',
        updatedAt: new Date().toISOString(),
      });

      // Background Sync to Cloud Firestore
      saveReadingProgressToCloud(userId, record.bookId, {
        bookTitle: record.bookId,
        chapterIndex: record.chapterIndex ?? 0,
        chapterTitle: record.chapterTitle || `فصل ${(record.chapterIndex ?? 0) + 1}`,
        pageIndex: record.pageInChapter ?? 0,
        totalPagesInChapter: record.totalPagesInChapter ?? 1,
        overallPercent: Math.min(
          100,
          Math.round(((record.currentPage || 0) / (record.totalPages || 1)) * 100)
        ),
        status: record.status,
        updatedAt: new Date().toISOString(),
        personalNotes: record.personalNotes,
      }).catch((e) => console.warn('Cloud sync background error:', e));
    } catch (err) {
      console.warn('Failed to save book record:', err);
    }
  },

  async syncWithCloud(userId: string): Promise<Record<string, UserBookRecord>> {
    if (!userId) return {};
    const local = this.getUserBookRecords(userId);
    try {
      const cloudMap = await getAllUserReadingProgressFromCloud(userId);
      let changed = false;
      for (const bookId of Object.keys(cloudMap)) {
        const c = cloudMap[bookId];
        const l = local[bookId];
        if (!l || (c.updatedAt && new Date(c.updatedAt) > new Date(l.lastUpdated))) {
          local[bookId] = {
            bookId,
            status: c.status,
            currentPage: Math.round((c.overallPercent / 100) * (l?.totalPages || 100)),
            totalPages: l?.totalPages || 100,
            chapterIndex: c.chapterIndex,
            chapterTitle: c.chapterTitle,
            pageInChapter: c.pageIndex,
            totalPagesInChapter: c.totalPagesInChapter,
            personalNotes: c.personalNotes || l?.personalNotes || '',
            lastUpdated: c.updatedAt,
            isFavorite: l?.isFavorite || false,
          };
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(`${BOOK_PROGRESS_KEY_PREFIX}${userId}`, JSON.stringify(local));
      }
      return local;
    } catch (err) {
      console.warn('Sync with cloud failed:', err);
      return local;
    }
  },

  // Favorite Articles
  getFavoriteArticles(userId: string): string[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(`${FAVORITE_ARTICLES_KEY_PREFIX}${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavoriteArticle(userId: string, articleId: string): boolean {
    if (!userId) return false;
    const favs = this.getFavoriteArticles(userId);
    const index = favs.indexOf(articleId);
    let nextState = false;
    if (index >= 0) {
      favs.splice(index, 1);
      nextState = false;
    } else {
      favs.push(articleId);
      nextState = true;
    }
    try {
      localStorage.setItem(`${FAVORITE_ARTICLES_KEY_PREFIX}${userId}`, JSON.stringify(favs));
    } catch (err) {
      console.warn('Failed to toggle article fav:', err);
    }
    return nextState;
  },

  // Article reading progress
  getArticleProgress(userId: string, articleId: string): number {
    if (!userId) return 0;
    try {
      const data = localStorage.getItem(`${ARTICLE_READ_PROGRESS_KEY_PREFIX}${userId}_${articleId}`);
      return data ? Number(data) : 0;
    } catch {
      return 0;
    }
  },

  saveArticleProgress(userId: string, articleId: string, percent: number, title?: string): void {
    if (!userId) return;
    try {
      localStorage.setItem(
        `${ARTICLE_READ_PROGRESS_KEY_PREFIX}${userId}_${articleId}`,
        String(Math.min(100, Math.max(0, percent)))
      );
      if (title) {
        this.recordRecentItem(userId, {
          type: 'article',
          id: articleId,
          title,
          category: 'المقالات الروحية',
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Failed to save article progress:', err);
    }
  },

  // Recently accessed items
  getRecentItems(userId: string): RecentItem[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(`${RECENT_ITEMS_KEY_PREFIX}${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordRecentItem(userId: string, item: RecentItem): void {
    if (!userId) return;
    try {
      const list = this.getRecentItems(userId);
      const filtered = list.filter((x) => !(x.type === item.type && x.id === item.id));
      filtered.unshift(item);
      localStorage.setItem(
        `${RECENT_ITEMS_KEY_PREFIX}${userId}`,
        JSON.stringify(filtered.slice(0, 10))
      );
    } catch (err) {
      console.warn('Failed to record recent item:', err);
    }
  },
};
