/**
 * Annual Reading Plan Data & Progress Tracking Engine
 * Supports both:
 * 1. Complete Bible in One Year (365 Days: Old Testament, Psalms/Wisdom, New Testament)
 * 2. Complete Patristic Reading in One Year (12 Months / 52 Weeks of Church Fathers)
 */

export type PlanType = 'bible' | 'patristics';

export interface DailyBibleReading {
  day: number;
  month: number;
  monthName: string;
  dayInMonth: number;
  title: string;
  oldTestament: string;
  psalms: string;
  newTestament: string;
  keyVerse: string;
  keyVerseRef: string;
  meditation: string;
}

export interface DailyPatristicReading {
  day: number;
  month: number;
  monthName: string;
  dayInMonth: number;
  father: string;
  workTitle: string;
  topic: string;
  quote: string;
  practicalReflection: string;
  copticEra: string;
}

export interface ReadingProgressRecord {
  completedDays: number[]; // Array of day numbers 1-365
  lastCompletedDate?: string; // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  notes: Record<number, string>; // day -> personal reflection note
}

export interface ReadingBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredDays: number;
  unlocked: boolean;
}

// 12 Months metadata
export const MONTHS_METADATA = [
  { month: 1, name: 'يناير (طوبة)', days: 31, theme: 'البدايات والخليقة ونور التجسد' },
  { month: 2, name: 'فبراير (أمشير)', days: 28, theme: 'الآباء الأوائل وتأسيس شعب الله' },
  { month: 3, name: 'مارس (برمهات)', days: 31, theme: 'الخروج والحرية وشريعة المحبة' },
  { month: 4, name: 'أبريل (برمودة)', days: 30, theme: 'أسبوع الآلام وسر القيامة المجيدة' },
  { month: 5, name: 'مايو (بشنس)', days: 31, theme: 'حلول الروح القدس وانطلاق الكنيسة' },
  { month: 6, name: 'يونيو (بؤونة)', days: 30, theme: 'تاريخ الجهاد والملوك والأنبياء' },
  { month: 7, name: 'يوليو (أبيب)', days: 31, theme: 'رسل المسيح وأسفار الشهادة' },
  { month: 8, name: 'أغسطس (مسرى)', days: 31, theme: 'أسفار الحكمة ونشيد الأنشاد' },
  { month: 9, name: 'سبتمبر (توت)', days: 30, theme: 'رأس السنة القبطية والنور المتجدد' },
  { month: 10, name: 'أكتوبر (بابه)', days: 31, theme: 'النبوءات الكبرى وإعلانات الخلاص' },
  { month: 11, name: 'نوفمبر (هاتور)', days: 30, theme: 'صبر الأبرار ورسائل الرعاة والخدام' },
  { month: 12, name: 'ديسمبر (كيهك)', days: 31, theme: 'التسابيح وأفراح التجسد والأبدية' },
];

/**
 * Procedurally generates the 365 daily Bible readings covering Old Testament, Psalms, and New Testament systematically.
 */
export function generateAnnualBiblePlan(): DailyBibleReading[] {
  const plan: DailyBibleReading[] = [];
  let dayCounter = 1;

  // Book sequences
  const otBooks = [
    { name: 'التكوين', chapters: 50 },
    { name: 'الخروج', chapters: 40 },
    { name: 'اللاويين', chapters: 27 },
    { name: 'العدد', chapters: 36 },
    { name: 'التثنية', chapters: 34 },
    { name: 'يشوع', chapters: 24 },
    { name: 'القضاة', chapters: 21 },
    { name: 'راعوث', chapters: 4 },
    { name: 'صموئيل الأول', chapters: 31 },
    { name: 'صموئيل الثاني', chapters: 24 },
    { name: 'الملوك الأول', chapters: 22 },
    { name: 'الملوك الثاني', chapters: 25 },
    { name: 'أخبار الأيام الأول', chapters: 29 },
    { name: 'أخبار الأيام الثاني', chapters: 36 },
    { name: 'عزرا', chapters: 10 },
    { name: 'نحميا', chapters: 13 },
    { name: 'أستير', chapters: 10 },
    { name: 'أيوب', chapters: 42 },
    { name: 'إشعياء', chapters: 66 },
    { name: 'إرميا', chapters: 52 },
    { name: 'مراثي إرميا', chapters: 5 },
    { name: 'حزقيال', chapters: 48 },
    { name: 'دانيال', chapters: 12 },
    { name: 'هوشع', chapters: 14 },
    { name: 'يوئيل', chapters: 3 },
    { name: 'عاموس', chapters: 9 },
    { name: 'عوبديا', chapters: 1 },
    { name: 'يونان', chapters: 4 },
    { name: 'ميخا', chapters: 7 },
    { name: 'ناحوم', chapters: 3 },
    { name: 'حبقوق', chapters: 3 },
    { name: 'صفنيا', chapters: 3 },
    { name: 'حجي', chapters: 2 },
    { name: 'زكريا', chapters: 14 },
    { name: 'ملاخي', chapters: 4 },
  ];

  const ntBooks = [
    { name: 'متى', chapters: 28 },
    { name: 'مرقس', chapters: 16 },
    { name: 'لوقا', chapters: 24 },
    { name: 'يوحنا', chapters: 21 },
    { name: 'أعمال الرسل', chapters: 28 },
    { name: 'رومية', chapters: 16 },
    { name: '1 كورنثوس', chapters: 16 },
    { name: '2 كورنثوس', chapters: 13 },
    { name: 'غلاطية', chapters: 6 },
    { name: 'أفسس', chapters: 6 },
    { name: 'فيلبي', chapters: 4 },
    { name: 'كولوسي', chapters: 4 },
    { name: '1 تسالونيكي', chapters: 5 },
    { name: '2 تسالونيكي', chapters: 3 },
    { name: '1 تيموثاوس', chapters: 6 },
    { name: '2 تيموثاوس', chapters: 4 },
    { name: 'تيطس', chapters: 3 },
    { name: 'فليمون', chapters: 1 },
    { name: 'العبرانيين', chapters: 13 },
    { name: 'يعقوب', chapters: 5 },
    { name: '1 بطرس', chapters: 5 },
    { name: '2 بطرس', chapters: 3 },
    { name: '1 يوحنا', chapters: 5 },
    { name: '2 يوحنا', chapters: 1 },
    { name: '3 يوحنا', chapters: 1 },
    { name: 'يهوذا', chapters: 1 },
    { name: 'سفر الرؤيا', chapters: 22 },
  ];

  let otIdx = 0;
  let otCh = 1;
  let ntIdx = 0;
  let ntCh = 1;

  for (let m = 0; m < MONTHS_METADATA.length; m++) {
    const monthMeta = MONTHS_METADATA[m];
    for (let d = 1; d <= monthMeta.days; d++) {
      if (dayCounter > 365) break;

      // Old Testament reading: 2-3 chapters
      const otCurrent = otBooks[otIdx % otBooks.length];
      const otEndCh = Math.min(otCh + 2, otCurrent.chapters);
      const otStr = `${otCurrent.name} ${otCh === otEndCh ? otCh : `${otCh}-${otEndCh}`}`;
      otCh = otEndCh + 1;
      if (otCh > otCurrent.chapters) {
        otIdx++;
        otCh = 1;
      }

      // Psalms reading: cycles through 150 psalms + Proverbs
      const psalmNum = ((dayCounter - 1) % 150) + 1;
      const provNum = ((dayCounter - 1) % 31) + 1;
      const psalmStr = dayCounter % 2 === 0 ? `مزمور ${psalmNum}` : `مزمور ${psalmNum} + أمثال ${provNum}`;

      // New Testament reading: 1 chapter
      const ntCurrent = ntBooks[ntIdx % ntBooks.length];
      const ntStr = `${ntCurrent.name} ${ntCh}`;
      ntCh++;
      if (ntCh > ntCurrent.chapters) {
        ntIdx++;
        ntCh = 1;
      }

      plan.push({
        day: dayCounter,
        month: monthMeta.month,
        monthName: monthMeta.name,
        dayInMonth: d,
        title: `قراءة اليوم ${dayCounter}: مسيرة النعمة في ${monthMeta.name}`,
        oldTestament: otStr,
        psalms: psalmStr,
        newTestament: ntStr,
        keyVerse: '«سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي... وَصَايَاكَ هِيَ شَبَعِي وَفَرَحُ قَلْبِي».',
        keyVerseRef: 'مزمور 119: 105',
        meditation: 'تأمل في كلمة الله اليوم واستودع آية واحدة في فكرك لترددها بهدوء أثناء عملك وخدمتك.',
      });

      dayCounter++;
    }
  }

  return plan;
}

/**
 * 52 Weeks / 12 Months Patristic Readings
 */
export function generateAnnualPatristicsPlan(): DailyPatristicReading[] {
  const fathersCorpus = [
    {
      month: 1,
      father: 'القديس أثناسيوس الرسولي (حامي الإيمان)',
      workTitle: 'تجسد الكلمة (De Incarnatione)',
      topic: 'سر التجسد الإلهي وتجديد خلقة الإنسان',
      quote: '«تجسد الكلمة لكي يؤلهنا في ذاته، وظهر بالجسد لكي نقبل نحن إعلانات الآب غير المنظور».',
      copticEra: 'القرن الرابع الميلادي - بطاركة الإسكندرية',
    },
    {
      month: 2,
      father: 'القديس أنطونيوس الكبير (كوكب البرية)',
      workTitle: 'رسائل القديس أنطونيوس الروحية',
      topic: 'اليقظة الروحية ومعرفة حقيقة النفس الساقطة',
      quote: '«من يعرف نفسه، يعرف الله؛ ومن يعرف الله، يُعطى له أن يعبد الله بالروح والحق».',
      copticEra: 'القرن الرابع - مهد الرهبنة في مصر',
    },
    {
      month: 3,
      father: 'مار إسحق السرياني (شيخ المتأملين)',
      workTitle: 'النسكيات والميامر الروحية',
      topic: 'سكون المخدع والصلاة المنسكبة بدموع المحبة',
      quote: '«الصمت هو لغة الدهر الآتي؛ والحديث بدون حاجة يشتت النفس ويسلب سلام القلب الداخلي».',
      copticEra: 'القرن السابع - التراث الرهباني المشرقي',
    },
    {
      month: 4,
      father: 'القديس يوحنا ذهبي الفم (فم الذهب)',
      workTitle: 'تفسير إنجيل يوحنا والرسائل الفصحية',
      topic: 'قوة القيامة المجيدة وسر الإفخارستيا',
      quote: '«أين شوكتك يا موت؟ أين غلبتك يا هاوية؟ قام المسيح وسقطت الشياطين، وفاضت الحياة في المسكونة».',
      copticEra: 'القرن الرابع - أنطاكية والقسطنطينية',
    },
    {
      month: 5,
      father: 'القديس مكاريوس الكبير (أب شيهيت)',
      workTitle: 'العظات الخمسون الروحية',
      topic: 'حلول الروح القدس واستنارة أوتار القلب',
      quote: '«القلب هو قيثارة الروح؛ متى لمسته نعمة الله يترنم بألحان السماء وتراتيل الفرح الأبدي».',
      copticEra: 'القرن الرابع - برية شيهيت',
    },
    {
      month: 6,
      father: 'القديس باسيليوس الكبير (مشرّع الخدمة)',
      workTitle: 'القوانين النسكية وكتاب الروح القدس',
      topic: 'الترتيب الكنسي والمحبة الأخوية في حياة الشركة',
      quote: '«الخبز الذي تخزنه هو للفرقان، والكساء المعلق في خزانتك هو للعريان؛ الخدمة هي برهان إيمانك».',
      copticEra: 'القرن الرابع - قيصرية الكبادوك',
    },
    {
      month: 7,
      father: 'القديس إغناطيوس الإنطاكي (حامل الإله)',
      workTitle: 'رسائل إلى كنائس أفسس وروما وسميرنا',
      topic: 'المحبة الباذلة حتى سفك الدم والاستشهاد',
      quote: '«أنا حنطة الله؛ لكي أُطحن بأنياب الوحوش حتى أوجد خبزاً نقياً للمسيح».',
      copticEra: 'القرن الأول/الثاني - عصر الآباء الرسوليين',
    },
    {
      month: 8,
      father: 'القديس كيرلس الكبير (عمود الدين)',
      workTitle: 'شرح إنجيل لوقا والكنوز في الثالوث',
      topic: 'الاتحاد الأقنومي وسر محبة الله الفائقة',
      quote: '«طبيعة واحدة متجسدة لله الكلمة؛ المسيح واحد لا ينقسم، فادينا ومخلص نفوسنا».',
      copticEra: 'القرن الخامس - بطاركة الإسكندرية',
    },
    {
      month: 9,
      father: 'القديس الأنبا موسى الأسود (معلم الوداعة)',
      workTitle: 'أقوال ووصايا شيوخ ورهبان الإسقيط',
      topic: 'التوبة الصادقة وعدم إدانة أي إنسان',
      quote: '«من يحمل خطاياه أمامه، كيف يتفرغ ليدين أخاه وخطاياه مدفونة في الخفاء؟».',
      copticEra: 'القرن الرابع - برية الإسقيط',
    },
    {
      month: 10,
      father: 'القديس يوحنا الدرجي (صاحب السلم)',
      workTitle: 'سلم الفضائل الإلهية (The Ladder)',
      topic: 'درجات المحبة والصبر ومحاربة الشياطين',
      quote: '«المحبة والاتضاع هما جناحان تطير بهما النفس فوق فخاخ العدو لتستقر في حضن الآب».',
      copticEra: 'القرن السادس - دير سانت كاترين وسيناء',
    },
    {
      month: 11,
      father: 'مار إفرام السرياني (قيثارة الروح القدس)',
      workTitle: 'الصلوات التوبية والترانيم اللاهوتية',
      topic: 'الدموع المقدسة والرجاء في مراحم المصلوب',
      quote: '«يا رب وسيدي حياتي، روح الفتور واليأس والمجد الباطل والفضول لا تعطني، بل روح العفة والتواضع والصبر والمحبة أنعم بها عليّ».',
      copticEra: 'القرن الرابع - نصيبين والرها',
    },
    {
      month: 12,
      father: 'قامات التكريس المعاصر (حبيب جرجس والبابا كيرلس)',
      workTitle: 'ذخائر النهضة الروحية والقداس الدائم',
      topic: 'الأمانة في التعليم وصلاة السحر اليومية',
      quote: '«كن مطمئناً جداً جداً ولا تفكر في الأمر كثيراً بل دع الأمر لمن بيده الأمر؛ الصلاة تصنع العجائب».',
      copticEra: 'القرن العشرين - نهضة الكنيسة القبطية المعاصرة',
    },
  ];

  const plan: DailyPatristicReading[] = [];
  let dayCounter = 1;

  for (let m = 0; m < MONTHS_METADATA.length; m++) {
    const monthMeta = MONTHS_METADATA[m];
    const fatherData = fathersCorpus[m];

    for (let d = 1; d <= monthMeta.days; d++) {
      if (dayCounter > 365) break;

      plan.push({
        day: dayCounter,
        month: monthMeta.month,
        monthName: monthMeta.name,
        dayInMonth: d,
        father: fatherData.father,
        workTitle: fatherData.workTitle,
        topic: fatherData.topic,
        quote: fatherData.quote,
        practicalReflection: `خصص 5 دقائق في مخدعك اليوم للتأمل في قول ${fatherData.father.split('(')[0].trim()} وطبّق وصية المحبة والاتضاع في معاملاتك.`,
        copticEra: fatherData.copticEra,
      });

      dayCounter++;
    }
  }

  return plan;
}

// Singletons cached for runtime performance
export const ANNUAL_BIBLE_PLAN = generateAnnualBiblePlan();
export const ANNUAL_PATRISTICS_PLAN = generateAnnualPatristicsPlan();

// Storage keys
const BIBLE_PROGRESS_KEY = 'mokarasa_bible_reading_progress';
const PATRISTICS_PROGRESS_KEY = 'mokarasa_patristics_reading_progress';

/**
 * Get current day of year (1-365)
 */
export function getCurrentDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.max(1, Math.min(365, day));
}

/**
 * Loads stored reading progress from localStorage
 */
export function getStoredReadingProgress(plan: PlanType, userId?: string): ReadingProgressRecord {
  if (typeof window === 'undefined') {
    return { completedDays: [], currentStreak: 0, longestStreak: 0, notes: {} };
  }
  const key = `${plan === 'bible' ? BIBLE_PROGRESS_KEY : PATRISTICS_PROGRESS_KEY}_${userId || 'guest'}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { completedDays: [], currentStreak: 0, longestStreak: 0, notes: {} };
    return JSON.parse(raw);
  } catch {
    return { completedDays: [], currentStreak: 0, longestStreak: 0, notes: {} };
  }
}

/**
 * Saves reading progress to localStorage
 */
export function saveReadingProgress(
  plan: PlanType,
  progress: ReadingProgressRecord,
  userId?: string
): void {
  if (typeof window === 'undefined') return;
  const key = `${plan === 'bible' ? BIBLE_PROGRESS_KEY : PATRISTICS_PROGRESS_KEY}_${userId || 'guest'}`;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

/**
 * Toggles completion status of a day in the plan
 */
export function toggleReadingDayCompletion(
  plan: PlanType,
  day: number,
  userId?: string
): ReadingProgressRecord {
  const current = getStoredReadingProgress(plan, userId);
  const isDone = current.completedDays.includes(day);
  const nextCompleted = isDone
    ? current.completedDays.filter((d) => d !== day)
    : [...current.completedDays, day].sort((a, b) => a - b);

  // Calculate streak
  const todayDateStr = new Date().toISOString().slice(0, 10);
  let streak = current.currentStreak;
  let longest = current.longestStreak;

  if (!isDone) {
    // We added a day
    streak = streak + 1;
    if (streak > longest) longest = streak;
  } else {
    streak = Math.max(0, streak - 1);
  }

  const updated: ReadingProgressRecord = {
    ...current,
    completedDays: nextCompleted,
    lastCompletedDate: isDone ? current.lastCompletedDate : todayDateStr,
    currentStreak: streak,
    longestStreak: longest,
  };

  saveReadingProgress(plan, updated, userId);
  return updated;
}

/**
 * Saves a reflection note for a day
 */
export function saveReadingNote(
  plan: PlanType,
  day: number,
  noteText: string,
  userId?: string
): ReadingProgressRecord {
  const current = getStoredReadingProgress(plan, userId);
  const updated: ReadingProgressRecord = {
    ...current,
    notes: {
      ...current.notes,
      [day]: noteText,
    },
  };
  saveReadingProgress(plan, updated, userId);
  return updated;
}

/**
 * Generates badge milestones
 */
export function getReadingBadges(completedDaysCount: number, streak: number): ReadingBadge[] {
  return [
    {
      id: 'b-7',
      title: 'أسبوع النور واليقظة',
      description: 'إتمام 7 أيام من القراءة المنتظمة في محضر الرب.',
      icon: '🌱',
      requiredDays: 7,
      unlocked: completedDaysCount >= 7,
    },
    {
      id: 'b-30',
      title: 'شهر التكريس القلبي',
      description: 'إتمام 30 يوماً من التغذي بكلمة الله الحية.',
      icon: '🌿',
      requiredDays: 30,
      unlocked: completedDaysCount >= 30,
    },
    {
      id: 'b-90',
      title: 'حارس الربع السنوي المبارك',
      description: 'إتمام 90 يوماً من الجهاد في مخدع القراءة.',
      icon: '🌾',
      requiredDays: 90,
      unlocked: completedDaysCount >= 90,
    },
    {
      id: 'b-180',
      title: 'نصف الماراثون السماوي',
      description: 'إتمام 180 يوماً بثبات ونسك روحي.',
      icon: '🛡️',
      requiredDays: 180,
      unlocked: completedDaysCount >= 180,
    },
    {
      id: 'b-365',
      title: 'إكليل العام المقدس الكامل',
      description: 'إتمام خطة القراءة السنوية كاملة (365 يوماً).',
      icon: '👑',
      requiredDays: 365,
      unlocked: completedDaysCount >= 365,
    },
  ];
}
