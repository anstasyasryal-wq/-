import { Stage, Question } from '../types';
import stageQuestionsData from './stageQuestions.json';

export const COMPETITION_STAGES: Stage[] = [
  {
    id: 1,
    number: 1,
    title: 'المرحلة الأولى — البداية',
    subtitle: 'جولة تمهيدية استكشافية شاملة للمعلومات والأساسيات الكنسية',
    icon: '🌱',
    badge: 'البداية والتأهيل',
    isOpen: true,
    totalQuestions: 20,
    timePerQuestionSeconds: 25,
    qualificationRule: {
      type: 'percentage',
      value: 30, // أفضل 30% يتأهلن
    },
    description: '20 سؤالاً متنوعاً بمستوى متوسط رصين تغطي الكتاب المقدس، تاريخ الكنيسة، الألحان، والطقوس الكنسية.',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
  },
  {
    id: 2,
    number: 2,
    title: 'المرحلة الثانية — الاكتشاف',
    subtitle: 'الفهم والتحليل والربط الذكي، بعيداً عن مجرد الحفظ',
    icon: '🧠',
    badge: 'الذكاء والتمييز',
    isOpen: true,
    totalQuestions: 10,
    timePerQuestionSeconds: 40,
    qualificationRule: {
      type: 'percentage',
      value: 15, // أفضل 15% يتأهلن
    },
    description: 'أسئلة تفاعلية ذكية: إكمال تسلسل، توصيل أزواج، اكتشاف الخطأ، ترتيب الأحداث تاريخياً، واختيار السلوك الأفضل.',
    startDate: '2026-10-16',
    endDate: '2026-10-25',
  },
  {
    id: 3,
    number: 3,
    title: 'المرحلة الثالثة — التحدي السريع',
    subtitle: 'سرعة البديهة والتركيز اللحظي مع عداد النقاط الإضافية (Bonus)',
    icon: '⚡',
    badge: 'سرعة البديهة',
    isOpen: true,
    totalQuestions: 12,
    timePerQuestionSeconds: 15,
    qualificationRule: {
      type: 'percentage',
      value: 5, // أفضل 5% يتأهلن
    },
    description: 'عامل الوقت يحسم المنافسة: إجابة صحيحة في أول 4 ثوانٍ تمنحك أقصى درجات الـ Bonus، بينما يقل العائد كلما تأخرت.',
    startDate: '2026-10-26',
    endDate: '2026-11-05',
  },
  {
    id: 4,
    number: 4,
    title: 'المرحلة الرابعة — الحواس',
    subtitle: 'تحدي قوة الملاحظة، الذاكرة البصرية، والأذن الموسيقية الكنسية',
    icon: '🎵',
    badge: 'السمع والبصر والذاكرة',
    isOpen: true,
    totalQuestions: 8,
    timePerQuestionSeconds: 30,
    qualificationRule: {
      type: 'top_count',
      value: 10, // أفضل 10 متسابقات إلى النهائي الكبير
    },
    description: 'تحدي الصور وتفاصيلها المخفية، الاستماع لمقاطع الألحان وتخمين المناسبة والنغمة، والملاحظة الفائقة.',
    startDate: '2026-11-06',
    endDate: '2026-11-15',
  },
  {
    id: 5,
    number: 5,
    title: 'المرحلة الخامسة — التحدي الكبير',
    subtitle: 'المرحلة النارية الشاملة قبل النهائي الكبير للمكرسات',
    icon: '🔥',
    badge: 'صراع القمة',
    isOpen: true,
    totalQuestions: 6,
    timePerQuestionSeconds: 35,
    qualificationRule: {
      type: 'top_count',
      value: 5, // أفضل 5 للنهائي التتويجي
    },
    description: 'توليفة محكمة من أصعب الأسئلة: ألغاز كتابية، مواقف رعوية وإفراز نسكي، ترتيب أحداث دقيق، وسؤال المفاجأة.',
    startDate: '2026-11-16',
    endDate: '2026-11-25',
  },
  {
    id: 6,
    number: 6,
    title: '👑 النهائي الكبير — المكرَّسة المثالية',
    subtitle: 'جولة الحسم والتتويج للأوائل في خمسة أبعاد ملكية',
    icon: '👑',
    badge: 'تتويج المكرسة المثالية',
    isOpen: true,
    totalQuestions: 5,
    timePerQuestionSeconds: 25,
    qualificationRule: {
      type: 'top_count',
      value: 3,
    },
    description: 'تحديات النهائي الخمسة: 🧠 المعرفة، 🔎 الذكاء، ⚡ السرعة، 🎯 الاختيار، 🎲 المفاجأة؛ وحفل إعلان الفائزات.',
    startDate: '2026-11-26',
    endDate: '2026-11-30',
  },
];

export const STAGE_QUESTIONS: Question[] = stageQuestionsData as unknown as Question[];
