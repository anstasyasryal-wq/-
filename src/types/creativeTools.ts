export type CreativeProductType =
  | 'spiritual_reflection' // تأمل روحي أو مقال
  | 'sermon_preparation' // إعداد عظة أو درس كتابي
  | 'meeting_design' // تصميم اجتماع أو لقاء روحي
  | 'interactive_activity' // إعداد نشاط تفاعلي لمجموعة
  | 'educational_drama' // مسرحية قصيرة أو حوار تربوي
  | 'custom_quiz' // مسابقة معرفية جديدة
  | 'reading_plan' // خطة قراءة أو دراسة جماعية
  | 'visual_card'; // بطاقة تأمل أو ملخص بصري

export interface CreativeDraft {
  id: string;
  userId: string;
  type: CreativeProductType;
  title: string;
  targetAudience: string; // خدام، مكرسون، شباب، أطفال، عام
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isArchived: boolean;
  content: {
    // For Sermon Preparation
    theme?: string;
    scripturePassage?: string;
    centralObjective?: string;
    introduction?: string;
    outlinePoints?: { title: string; explanation: string; scriptureEvidence?: string }[];
    practicalApplication?: string;
    conclusion?: string;

    // For Meeting Design
    targetTheme?: string;
    meetingDurationMinutes?: number;
    openingSegment?: string;
    praiseHymns?: string[];
    wordTopic?: string;
    groupActivity?: string;
    closingPrayerFocus?: string;

    // For General Article / Reflection
    bodyText?: string;
    biblicalAnchor?: string;
    patristicReference?: string;
    actionableTakeaway?: string;

    // For Interactive Activity
    activityName?: string;
    groupSize?: string;
    neededMaterials?: string[];
    stepsToExecute?: string[];
    spiritualLesson?: string;

    // For Educational Drama
    characters?: { name: string; role: string }[];
    setting?: string;
    scenes?: { sceneNumber: number; dialogue: string }[];
    coreMessage?: string;

    // For Custom Quiz
    quizTitle?: string;
    questions?: {
      question: string;
      options: [string, string, string, string];
      correctIndex: number;
      explanation: string;
    }[];

    // For Reading Plan
    planDurationDays?: number;
    planDays?: { day: number; reading: string; reflectionQuestion: string }[];

    // For Visual Card
    keyVerse?: string;
    saintQuote?: string;
    visualTheme?: string;
    shortSummary?: string;
  };
}
