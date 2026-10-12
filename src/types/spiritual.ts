import { ConsecrationVocation } from './index';

export interface BibleReadingPlan {
  id: string;
  title: string;
  subtitle: string;
  vocationTarget: ConsecrationVocation | 'الكل';
  durationDays: number;
  description: string;
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  days: {
    dayNumber: number;
    title: string;
    passage: string;
    reflection: string;
    spiritualPractice: string;
    keyVerse: string;
  }[];
}

export interface UserPlanProgress {
  planId: string;
  completedDays: number[];
  startedAt: string;
  lastReadAt: string;
}

export interface BiblicalTopic {
  id: string;
  title: string;
  category: 'كتاب مقدس' | 'عقيدة وقانون الإيمان' | 'طقس وليتورجيا' | 'تاريخ الكنيسة والآباء';
  vocationRelevance: string;
  summary: string;
  biblicalReferences: string[];
  patristicQuotes: {
    fatherName: string;
    quote: string;
    source: string;
  }[];
  keyTakeaways: string[];
  readingTimeMinutes: number;
}

export interface PersonalSpiritualDiaryEntry {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dateString: string;
  confessionNote?: string; // أفكار ومراجعة للاعتراف
  gratitudeAndThanks: string; // شكر وتسبيح
  dailyBibleContemplation: string; // تأمل الإنجيل اليومي
  prayerRequests: string[]; // طلبات الصلاة من أجل المخدومين والآخرين
  virtueTrackedId?: string; // فضيلة اليوم المرتبطة
  personalResolution: string; // قرار روحي عملي
  isPrivate: boolean;
}

export interface PersonalSpiritualStats {
  totalRosaryCount: number;
  completedPlansCount: number;
  diaryEntriesCount: number;
  savedStudyNotesCount: number;
  activeVirtuesPracticed: number;
}
