import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  appName: {
    ar: 'حسب قلب الله',
    en: 'According to God\'s Heart',
  },
  subtitle: {
    ar: 'كاهن – مكرَّسة – راهب – راهبة',
    en: 'Priest – Consecrated – Monk – Nun',
  },
  openStatus: {
    ar: '🟢 مفتوحة',
    en: '🟢 Active',
  },
  home: {
    ar: 'الرئيسية',
    en: 'Home',
  },
  library: {
    ar: 'المكتبة المعرفية',
    en: 'Knowledge Library',
  },
  workshops: {
    ar: 'ورش العمل',
    en: 'Workshops',
  },
  creativeLab: {
    ar: 'مختبر الإبداع',
    en: 'Creative Lab',
  },
  studyTools: {
    ar: 'منصة التدريب',
    en: 'Training Platform',
  },
  spiritualLife: {
    ar: 'الحياة الروحية',
    en: 'Spiritual Life',
  },
  monasticOasis: {
    ar: 'واحة التكريس',
    en: 'Monastic Oasis',
  },
  biblicalStudy: {
    ar: 'الدراسة والآباء',
    en: 'Scripture & Fathers',
  },
  personalSpace: {
    ar: 'المساحة الشخصية',
    en: 'Personal Space',
  },
  competitionsHub: {
    ar: 'المسابقات الرسمية',
    en: 'Official Competitions',
  },
  leaderboard: {
    ar: 'الترتيب',
    en: 'Leaderboard',
  },
  supervisor: {
    ar: 'الإشراف',
    en: 'Supervisor',
  },
  rules: {
    ar: 'ميثاق وقواعد المسيرة',
    en: 'Journey Charter & Rules',
  },
  spiritualGuide: {
    ar: 'المرشد الروحي',
    en: 'Spiritual Guide',
  },
  login: {
    ar: 'تسجيل الدخول / الملف',
    en: 'Login / Profile',
  },
  logout: {
    ar: 'تسجيل الخروج',
    en: 'Logout',
  },
  settings: {
    ar: 'إعدادات القراءة',
    en: 'Reading Settings',
  },
  switchLanguage: {
    ar: 'English',
    en: 'العربية',
  },
  welcomeMessage: {
    ar: 'مرحباً بك في منصة حسب قلب الله',
    en: 'Welcome to According to God\'s Heart',
  },
  startJourney: {
    ar: 'ابدأ المسيرة الروحية',
    en: 'Start Spiritual Journey',
  },
  prayerWall: {
    ar: 'حائط الصلاة المشترك',
    en: 'Shared Prayer Wall',
  },
  confessionLog: {
    ar: 'متابعة الاعتراف والتوبة',
    en: 'Confession & Repentance Tracker',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'mokarasa_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY) as Language;
        if (saved && (saved === 'ar' || saved === 'en')) {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    return 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['ar'] || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
