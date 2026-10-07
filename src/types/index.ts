export type CategoryId = 'religious' | 'monastic' | 'cultural' | 'biblical' | 'hymns' | 'history' | 'wit';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType =
  | 'mcq'
  | 'sequence'
  | 'match_pairs'
  | 'find_error'
  | 'order_events'
  | 'best_choice'
  | 'image_memory'
  | 'audio_hymn'
  | 'observation';

export interface Question {
  id: string;
  category: string;
  subCategory: string;
  stageId?: number; // 1 to 5, or 6 for final
  questionType?: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  reference: string;
  hint: string;
  points?: number;
  timeLimitSeconds?: number;
  isCustom?: boolean;
  // Specialized fields for interactive stages
  sequenceItems?: string[]; // for sequence
  matchingPairs?: { left: string; right: string }[]; // for match_pairs
  eventsToOrder?: string[]; // for order_events
  correctOrder?: number[];
  imageSrc?: string; // for image memory or observation
  imageInspectionTimeSeconds?: number;
  hymnTuneKey?: string; // for audio_hymn synthesizer
}

export type QuizMode = 'home' | 'solo' | 'team' | 'speed' | 'study' | 'leaderboard' | 'oasis' | 'creative';

export interface SoloQuizResult {
  id: string;
  participantName: string;
  houseOrDiocese: string;
  date: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  totalTimeSeconds: number;
  answers: UserAnswerRecord[];
  titleAwarded: string;
  grade: 'ممتاز مرتفع' | 'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول';
  categoryBreakdown?: Record<string, { total: number; correct: number }>;
}

export interface Team {
  id: string;
  name: string;
  patronSaint: string;
  consecrationHouse?: string;
  members?: string;
  score: number;
  color: string;
  avatar: string;
  answeredCorrectCount: number;
  answeredWrongCount: number;
}

export interface TeamRoundLog {
  questionId: string;
  questionText: string;
  teamId: string;
  teamName: string;
  wasCorrect: boolean;
  pointsAwarded: number;
}

export type ConsecrationRank =
  | 'مكرسة دائمة'
  | 'مكرسة مبتدئة'
  | 'مساعدة مكرسة'
  | 'شماسة مكرسة (دياكونيسا)'
  | 'خادمة متفرغة';

export interface User {
  id: string;
  name: string;
  consecrationHouse: string; // اسم الدير أو بيت التكريس
  diocese: string; // الإيبارشية
  governorate: string; // المحافظة
  code: string; // رقم تعريفي أو كود مشاركة
  role: 'participant' | 'supervisor';
  currentStageId: number; // 1 to 6 (6 = Final)
  isQualifiedForFinal: boolean;
  totalPoints: number;
  correctAnswersCount: number;
  totalTimeSpentSeconds: number;
  stageScores: Record<number, number>; // stageId -> score
  stageCorrectCounts?: Record<number, number>; // stageId -> correct answers
  stageTimes?: Record<number, number>; // stageId -> total seconds
  avatar?: string;
  registeredAt: string;
  // Identity & Ministry profile
  consecrationRank?: ConsecrationRank;
  ministryField?: string; // مجال الخدمة
  consecrationVerse?: string; // آية التكريس وشعار الحياة
  personalBio?: string; // تعريف المكرسة بنفسها ورسالتها
  patronSaint?: string; // شفيعة التكريس
}

export interface Stage {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  isOpen: boolean;
  totalQuestions: number;
  timePerQuestionSeconds: number;
  qualificationRule: {
    type: 'percentage' | 'top_count';
    value: number; // e.g. 30 for 30%, or 10 for top 10
  };
  description: string;
  startDate?: string;
  endDate?: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  pointsEarned?: number;
  speedBonusEarned?: number;
}

export interface StageAttempt {
  id: string;
  userId: string;
  stageId: number;
  completedAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  averageTimeSeconds: number;
  answers: UserAnswerRecord[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent?: boolean;
}

export interface DioceseRanking {
  name: string;
  totalPoints: number;
  participantsCount: number;
  averageScore: number;
  rank: number;
  topHouse: string;
}

export interface FinalAwards {
  firstPlace: User | null;
  secondPlace: User | null;
  thirdPlace: User | null;
  fastestParticipant: User | null;
  mostAccurate: User | null;
  intelligenceStar: User | null;
  knowledgeStar: User | null;
  hymnsStar: User | null;
}

export type AppView =
  | 'home'
  | 'stage_player'
  | 'leaderboard'
  | 'dioceses'
  | 'participants'
  | 'competitions_hub'
  | 'supervisor'
  | 'final_ceremony';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    bgBadge: string;
  };
}
