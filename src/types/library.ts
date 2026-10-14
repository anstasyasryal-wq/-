export type VocationFilter = 'الكل' | 'كاهن' | 'مكرسة' | 'راهب' | 'راهبة';

export type ContentStatus = 'draft' | 'under_review' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  category: 'الحياة الروحية والفضيلة' | 'الدراسة وفهم النص' | 'التراث القبطي والتاريخ' | 'التكريس والرهبنة' | 'القيادة والخدمة' | 'الضغوط والخلافات' | 'إعداد العظات والتأملات' | 'شخصيات كتابية وآبائية';
  publishedDate: string;
  readingTimeMinutes: number;
  targetVocations: VocationFilter[];
  status: ContentStatus;
  summary: string;
  sections: {
    heading: string;
    body: string;
    keyVerse?: string;
    patristicQuote?: {
      father: string;
      quote: string;
      source: string;
    };
  }[];
  references: {
    title: string;
    author: string;
    source: string;
    url?: string;
  }[];
  relatedArticleIds?: string[];
  tags: string[];
}

export type BookReadingStatus = 'not_started' | 'reading' | 'completed';

export type BookReadingLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'تخصصي آبائي';

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  content: string;
  keyVerse?: string;
  patristicReflection?: string;
  readingTimeMinutes?: number;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  authorEra?: string;
  category: 'التفاسير والكتاب المقدس' | 'الآباء والتراث الكنسي' | 'الحياة الروحية والتكريس' | 'التاريخ القبطي' | 'القيادة والرعاية' | 'إعداد العظات والدروس';
  readingLevel: BookReadingLevel;
  publisher?: string;
  publishYear?: string;
  description: string;
  targetVocations: VocationFilter[];
  status: ContentStatus;
  legalStatus: 'نص كامل متاح قانونياً' | 'بيانات ببليوغرافية ورابط الناشر' | 'ملكية عامة وتراث مفتوح';
  totalPages: number;
  tableOfContents: string[];
  keyQuotes?: string[];
  externalUrl?: string;
  coverColor: string;
  isFullTextAvailable?: boolean;
  chapters?: BookChapter[];
}

export interface UserBookRecord {
  bookId: string;
  status: BookReadingStatus;
  currentPage: number;
  totalPages: number;
  chapterIndex?: number;
  chapterTitle?: string;
  pageInChapter?: number;
  totalPagesInChapter?: number;
  startedAt?: string;
  finishedAt?: string;
  lastUpdated: string;
  personalNotes: string;
  isFavorite: boolean;
}

export interface ScholarlyReference {
  id: string;
  title: string;
  author: string;
  type: 'مرجع كتابي' | 'مرجع آبائي' | 'دراسة تاريخية' | 'معجم ومصدر لغوي' | 'مصدر أكاديمي' | 'دليل إعداد العظات';
  category: string;
  bibliographicCitation: string;
  description: string;
  externalUrl?: string;
  availabilityType: 'نص كامل متاح' | 'بيانات ببليوغرافية وتوثيق' | 'مستودع كنسي رقمي';
  targetVocations: VocationFilter[];
}
