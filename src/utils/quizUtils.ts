import { Question, DifficultyLevel } from '../types';

/**
 * Utility to shuffle the 4 options of a question and update correctIndex faithfully.
 * Guarantees that Option 0 is never predictably the correct answer.
 */
export function shuffleQuestionOptions(q: Question): Question {
  const originalOptionsWithFlag = q.options.map((optText, idx) => ({
    text: optText,
    isCorrect: idx === q.correctIndex,
  }));

  // Fisher-Yates shuffle
  const shuffled = [...originalOptionsWithFlag];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newOptions = shuffled.map((item) => item.text) as [string, string, string, string];
  const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect);

  return {
    ...q,
    options: newOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

/**
 * Prepares and randomizes an array of questions for a competitive quiz session.
 */
export function prepareQuizQuestions(questions: Question[]): Question[] {
  return questions.map(shuffleQuestionOptions);
}

/**
 * Distinct academic sub-categories for deep filtering
 */
export interface AcademicTrack {
  id: string;
  label: string;
  icon: string;
  description: string;
  category: 'religious' | 'monastic' | 'cultural';
}

export const ACADEMIC_TRACKS: AcademicTrack[] = [
  {
    id: 'dogmatic_theology',
    label: 'اللاهوت العقائدي والمجامع المسكونية',
    icon: '⚖️',
    description: 'كرستولوجيا كيرلس الكبير، أثناسيوس وتجسد الكلمة، نيقية والقسطنطينية وأفسس، وأسرار الثالوث.',
    category: 'religious',
  },
  {
    id: 'monastic_asceticism',
    label: 'العلوم النسكية وبستان الرهبان ومحاربة الأفكار',
    icon: '📜',
    description: 'أفكار إيفاجريوس الثمانية، مناظرات يوحنا كاسيان، كتابات مارإسحق، وسلم الفضائل ليوحنا الدرجي.',
    category: 'monastic',
  },
  {
    id: 'desert_mothers_canons',
    label: 'أمهات البرية والبتولية ولوائح التكريس الكنسي',
    icon: '👑',
    description: 'الأم سارة والأم سنكليتيكي، رتبة الشماسة المكرسة تاريخياً، ولوائح المجمع المقدس المعاصرة.',
    category: 'monastic',
  },
  {
    id: 'biblical_typology',
    label: 'التفسير الآبائي والرموز والنبوات الكتابية',
    icon: '📖',
    description: 'رموز خيمة الاجتماع، ذبائح سفر اللاويين الخمس، نبوات دانيال وإشعياء، والرسالة للعبرانيين.',
    category: 'religious',
  },
  {
    id: 'liturgy_mysteries',
    label: 'الليتورجيا والقداسات والأسرار والتسبحة',
    icon: '🕊️',
    description: 'مقارنة القداسات الثلاثة، الإبكليديس وسر الميرون، تسبحة نصف الليل ونغمات الواطس والآدام.',
    category: 'religious',
  },
  {
    id: 'coptic_heritage_art',
    label: 'التراث القبطي والأيقونة واللغة والمخطوطات',
    icon: '🎨',
    description: 'قواعد اللغة القبطية والجنكيم، لاهوت الأيقونة وغياب الظلال، والمخطوطات وسير البيعة المقدسة.',
    category: 'cultural',
  },
];
