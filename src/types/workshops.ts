import { VocationFilter, ContentStatus } from './library';

export interface WorkshopQuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  reference?: string;
}

export interface WorkshopUnit {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  explanationText: string;
  scriptureAnchor: {
    verse: string;
    text: string;
  };
  patristicAnchor: {
    father: string;
    quote: string;
    source: string;
  };
  practicalExercise: {
    title: string;
    instructions: string;
    steps: string[];
    deliverablePrompt: string;
  };
  reviewQuiz: WorkshopQuizQuestion[];
  printableTemplateKey?: string;
}

export interface Workshop {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  badge: string;
  targetVocations: VocationFilter[];
  status: ContentStatus;
  estimatedHours: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  objectives: string[];
  prerequisites?: string[];
  units: WorkshopUnit[];
  finalProject: {
    title: string;
    description: string;
    deliverables: string[];
    evaluationCriteria: string[];
    submissionPrompt: string;
  };
}

export interface UserWorkshopProgress {
  workshopId: string;
  completedUnitIds: string[];
  currentUnitId: string;
  quizScores: Record<string, number>; // unitId -> score out of total
  unitAnswers: Record<string, Record<string, number>>; // unitId -> { qId: selectedOption }
  unitPracticalNotes: Record<string, string>; // unitId -> user reflections
  finalProjectDraft: string;
  isCompleted: boolean;
  completedAt?: string;
  lastAccessedAt: string;
}
