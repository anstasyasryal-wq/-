export type CategoryId = 'religious' | 'monastic' | 'cultural';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  category: CategoryId;
  subCategory: string;
  difficulty: DifficultyLevel;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  reference: string;
  hint: string;
  isCustom?: boolean;
}

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

export type QuizMode = 'home' | 'solo' | 'team' | 'speed' | 'study' | 'leaderboard' | 'oasis' | 'creative';

export interface ParticipantProfile {
  name: string;
  houseOrDiocese: string;
  categoryChoice: CategoryId | 'all';
  questionCount: number;
  timeLimitPerQuestion: number; // in seconds, 0 = unlimited
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface SoloQuizResult {
  id: string;
  participantName: string;
  houseOrDiocese: string;
  date: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  totalTimeSeconds: number;
  categoryBreakdown: {
    [key in CategoryId]: {
      total: number;
      correct: number;
    };
  };
  answers: UserAnswerRecord[];
  titleAwarded: string;
  grade: 'ممتاز مرتفع' | 'ممتاز' | 'جيد جداً' | 'جيد' | 'مقبول';
}

export interface Team {
  id: string;
  name: string;
  patronSaint: string;
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
