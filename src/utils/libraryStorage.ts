import { UserBookRecord } from '../types/library';

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
    } catch (err) {
      console.warn('Failed to save book record:', err);
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
