import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CategoryId, Question, SoloQuizResult, UserAnswerRecord } from '../types';
import { CATEGORIES } from '../data/questions';
import { computeMonasticTitle, saveQuizResult } from '../utils/storage';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Lightbulb, 
  RotateCcw, 
  Award, 
  BookOpen, 
  ChevronLeft, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface SoloQuizProps {
  questionsPool: Question[];
  onOpenCertificate: (result: SoloQuizResult) => void;
  onBackToHome: () => void;
}

export const SoloQuiz: React.FC<SoloQuizProps> = ({
  questionsPool,
  onOpenCertificate,
  onBackToHome,
}) => {
  // Setup state
  const [stage, setStage] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [participantName, setParticipantName] = useState('');
  const [houseOrDiocese, setHouseOrDiocese] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(10);
  const [timerSecondsChoice, setTimerSecondsChoice] = useState<number>(35); // 0 = unlimited

  // Quiz active state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  // Lifelines state
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [usedHint, setUsedHint] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [usedExtraTime, setUsedExtraTime] = useState(false);

  // Result state
  const [completedResult, setCompletedResult] = useState<SoloQuizResult | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered pool count based on category
  const availableQuestionsCount = useMemo(() => {
    if (selectedCategory === 'all') return questionsPool.length;
    return questionsPool.filter((q) => q.category === selectedCategory).length;
  }, [questionsPool, selectedCategory]);

  // Start the quiz
  const handleStartQuiz = () => {
    let pool = [...questionsPool];
    if (selectedCategory !== 'all') {
      pool = pool.filter((q) => q.category === selectedCategory);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const sliceCount = Math.min(questionCountChoice, shuffled.length);
    const selected = shuffled.slice(0, sliceCount);

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers([]);
    setUsedFiftyFifty(false);
    setEliminatedOptions([]);
    setUsedHint(false);
    setShowHintModal(false);
    setUsedExtraTime(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(timerSecondsChoice);
    setStage('playing');
  };

  const currentQ = activeQuestions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (stage !== 'playing' || isAnswerSubmitted || timerSecondsChoice === 0) return;

    if (timeLeft <= 0) {
      // Time expired for this question
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      if (timeLeft <= 6 && timeLeft > 0) {
        soundManager.playTick();
      }
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, timeLeft, isAnswerSubmitted, timerSecondsChoice]);

  const handleTimeout = () => {
    soundManager.playWrong();
    setIsAnswerSubmitted(true);
    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      selectedOptionIndex: null,
      isCorrect: false,
      timeSpentSeconds: timerSecondsChoice,
    };
    setUserAnswers((prev) => [...prev, record]);
  };

  // Option selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const timeSpent = timerSecondsChoice > 0 ? timerSecondsChoice - timeLeft : 0;
    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      selectedOptionIndex: idx,
      isCorrect,
      timeSpentSeconds: Math.max(1, timeSpent),
    };
    setUserAnswers((prev) => [...prev, record]);
  };

  // Lifeline: 50/50
  const handleUseFiftyFifty = () => {
    if (usedFiftyFifty || isAnswerSubmitted || !currentQ) return;
    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);
    
    // Pick 2 random wrong options to eliminate
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffledWrong.slice(0, 2));
    setUsedFiftyFifty(true);
  };

  // Lifeline: Hint
  const handleUseHint = () => {
    if (usedHint || !currentQ) return;
    setUsedHint(true);
    setShowHintModal(true);
  };

  // Lifeline: Extra Time
  const handleUseExtraTime = () => {
    if (usedExtraTime || isAnswerSubmitted || timerSecondsChoice === 0) return;
    setTimeLeft((prev) => prev + 30);
    setUsedExtraTime(true);
  };

  // Move to next question or finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setEliminatedOptions([]);
      setShowHintModal(false);
      setTimeLeft(timerSecondsChoice);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Calculate final score
    const totalQ = activeQuestions.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / totalQ) * 100);
    const totalTime = userAnswers.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);

    const breakdown: SoloQuizResult['categoryBreakdown'] = {
      religious: { total: 0, correct: 0 },
      monastic: { total: 0, correct: 0 },
      cultural: { total: 0, correct: 0 },
    };

    activeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (breakdown[q.category]) {
        breakdown[q.category].total += 1;
        if (ans && ans.isCorrect) {
          breakdown[q.category].correct += 1;
        }
      }
    });

    const { title, grade } = computeMonasticTitle(percentage);

    const resultObj: SoloQuizResult = {
      id: `solo-${Date.now()}`,
      participantName: participantName.trim() || 'مكرسة مباركة',
      houseOrDiocese: houseOrDiocese.trim() || 'بيت التكريس',
      date: new Date().toISOString(),
      totalScore: correctCount,
      maxScore: totalQ,
      percentage,
      totalTimeSeconds: totalTime,
      categoryBreakdown: breakdown,
      answers: userAnswers,
      titleAwarded: title,
      grade,
    };

    saveQuizResult(resultObj);
    setCompletedResult(resultObj);
    setStage('completed');

    soundManager.playVictory();
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // -------------------------------------------------------------
  // RENDER: Setup Stage
  // -------------------------------------------------------------
  if (stage === 'setup') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200/80 p-6 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 mb-3 shadow-inner">
              <Award className="w-8 h-8 text-amber-800" />
            </div>
            <h1 className="font-spiritual text-3xl font-bold text-stone-900">
              المراجعة الفردية لمسيرة «حَسَبَ قَلْبِ اللهِ»
            </h1>
            <p className="text-sm font-bold text-amber-800 mt-1">
              «كاهن – مكرَّسة – راهب – راهبة»
            </p>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              مراجعة روحية وشخصية شاملة للنمو في العلوم الكنسية واكتشاف جوانب القوة والبركة
            </p>
          </div>

          <div className="space-y-6">
            {/* Participant Name & House */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">
                  الاسم المبارك (كاهن / مكرَّسة / راهب / راهبة) *
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="مثال: أبونا بيشوي / الراهب بيجول / تاسوني مارينا / تماف إيريني"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">
                  الكنيسة / الدير / بيت التكريس / الإيبارشية
                </label>
                <input
                  type="text"
                  value={houseOrDiocese}
                  onChange={(e) => setHouseOrDiocese(e.target.value)}
                  placeholder="مثال: دير الأنبا أنطونيوس / إيبارشية بني سويف / كنيسة العذراء"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-stone-900"
                />
              </div>
            </div>

            {/* Category Choice */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                اختر مسار الاختبار والعلوم
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    selectedCategory === 'all'
                      ? 'border-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-700'
                      : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                  }`}
                >
                  <div className="font-bold text-stone-900 text-base mb-1">
                    شامل جميع العلوم الثلاثة
                  </div>
                  <p className="text-xs text-stone-500">
                    أسئلة منوّعة تشمل الدينية والرهبانية والقبطية والثقافية
                  </p>
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      selectedCategory === cat.id
                        ? 'border-amber-700 bg-amber-50/80 shadow-sm ring-1 ring-amber-700'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="font-bold text-stone-900 text-base mb-1">
                      {cat.title}
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question count & Timer options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  عدد أسئلة الجولة
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[8, 12, 16, Math.min(24, availableQuestionsCount)].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCountChoice(cnt)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        questionCountChoice === cnt
                          ? 'bg-amber-800 text-amber-50 border-amber-800'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  المؤقت الزمني لكل سؤال
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'بدون', val: 0 },
                    { label: '25 ث', val: 25 },
                    { label: '35 ث', val: 35 },
                    { label: '50 ث', val: 50 },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setTimerSecondsChoice(t.val)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        timerSecondsChoice === t.val
                          ? 'bg-amber-800 text-amber-50 border-amber-800'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lifelines Note */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950 mb-0.5">وسائل مساعدة روحية متاحة أثناء المسابقة:</p>
                <p className="text-amber-800/90 leading-relaxed">
                  يمكنك استخدام وسيلة "حذف إجابتين"، أو "استرشاد بآية أو قول أبائي"، أو "إضافة 30 ثانية" لمرة واحدة خلال الجولة.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-sm transition-colors"
              >
                رجوع للرئيسية
              </button>

              <button
                type="button"
                onClick={handleStartQuiz}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>بدء المسابقة الفردية</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Active Quiz Session
  // -------------------------------------------------------------
  if (stage === 'playing' && currentQ) {
    const categoryInfo = CATEGORIES.find((c) => c.id === currentQ.category);
    const progressPercent = ((currentIndex + 1) / activeQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        
        {/* Top Bar: Progress & Lifelines */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            
            {/* Question Counter */}
            <div className="flex items-center gap-2">
              <span className="font-spiritual text-lg font-bold text-stone-900">
                السؤال {currentIndex + 1} من {activeQuestions.length}
              </span>
              <span className="text-xs text-stone-500 font-sans">
                ({currentQ.subCategory})
              </span>
            </div>

            {/* Timer if enabled */}
            {timerSecondsChoice > 0 && (
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-bold ${
                timeLeft <= 10
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{timeLeft} ثانية متبقية</span>
              </div>
            )}

            {/* Lifelines */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseFiftyFifty}
                disabled={usedFiftyFifty || isAnswerSubmitted}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  usedFiftyFifty
                    ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                    : 'bg-stone-50 hover:bg-amber-50 text-amber-900 border-amber-200'
                }`}
                title="حذف خيارين خاطئين"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>حذف إجابتين (50:50)</span>
              </button>

              <button
                type="button"
                onClick={handleUseHint}
                disabled={usedHint}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  usedHint
                    ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                    : 'bg-stone-50 hover:bg-amber-50 text-amber-900 border-amber-200'
                }`}
                title="استرشاد بآية أو قول أبائي"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>إشارة آبائية</span>
              </button>

              {timerSecondsChoice > 0 && (
                <button
                  type="button"
                  onClick={handleUseExtraTime}
                  disabled={usedExtraTime || isAnswerSubmitted}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    usedExtraTime
                      ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                      : 'bg-stone-50 hover:bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                  title="إضافة 30 ثانية"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>+30 ث</span>
                </button>
              )}
            </div>

          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-amber-200/90 p-6 sm:p-10 mb-6 relative overflow-hidden">
          
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryInfo?.colorScheme.bgBadge || 'bg-stone-100 text-stone-700'}`}>
              {categoryInfo?.title || 'علم كنسي'}
            </span>
            <span className="text-stone-400 text-xs">·</span>
            <span className="text-xs text-stone-500 font-sans">
              درجة الصعوبة: {currentQ.difficulty === 'easy' ? 'ميسر' : currentQ.difficulty === 'medium' ? 'متوسط' : 'عميق'}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed sm:leading-loose mb-8">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              const isEliminated = eliminatedOptions.includes(idx);
              const isChosen = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let btnStyle = 'border-stone-200 bg-stone-50/50 hover:bg-amber-50/60 hover:border-amber-300 text-stone-800';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isChosen && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 line-through opacity-80';
                } else {
                  btnStyle = 'border-stone-200 bg-stone-100 text-stone-400 opacity-60';
                }
              }

              if (isEliminated) {
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-dashed border-stone-200 bg-stone-100/60 text-stone-300 text-center text-sm font-sans flex items-center justify-center cursor-not-allowed"
                  >
                    [إجابة مستبعدة بالوسيلة المساعدة]
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`p-5 rounded-2xl border text-right transition-all flex items-start gap-3.5 text-base sm:text-lg font-spiritual relative ${btnStyle}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-white border border-stone-300 text-stone-700 flex items-center justify-center font-sans text-sm font-bold shrink-0 mt-0.5 shadow-2xs">
                    {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                  </span>
                  <span className="flex-1 leading-normal pt-0.5">
                    {option}
                  </span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  )}
                  {isAnswerSubmitted && isChosen && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Overlay when revealed */}
          {showHintModal && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 text-sm">
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  إشارة استرشادية روحية:
                </span>
                <button
                  type="button"
                  onClick={() => setShowHintModal(false)}
                  className="text-amber-800 hover:text-amber-950 text-xs"
                >
                  إخفاء الإشارة
                </button>
              </div>
              <p className="font-spiritual text-base text-stone-800 leading-relaxed">
                {currentQ.hint}
              </p>
            </div>
          )}

          {/* Explanation Banner (when answered) */}
          {isAnswerSubmitted && (
            <div className="mt-8 p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-stone-900 mb-1">
                    الشرح والتوثيق الكنسي:
                  </h3>
                  <p className="text-stone-700 text-sm font-spiritual leading-relaxed mb-2">
                    {currentQ.explanation}
                  </p>
                  <p className="text-xs text-stone-500 font-sans">
                    المرجع: {currentQ.reference}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{currentIndex + 1 < activeQuestions.length ? 'السؤال التالي' : 'عرض النتيجة والشهادة'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Completed Stage & Results
  // -------------------------------------------------------------
  if (stage === 'completed' && completedResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Victory Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-6 sm:p-10 mb-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 shadow-lg mb-4">
            <Award className="w-10 h-10" />
          </div>

          <h1 className="font-spiritual text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
            مبارك إتمام المراجعة والتقييم بنجاح!
          </h1>
          <p className="text-stone-600 text-sm">
            المبارك/ة: <strong className="text-stone-900">{completedResult.participantName}</strong> 
            {completedResult.houseOrDiocese && ` · ${completedResult.houseOrDiocese}`}
          </p>

          {/* Honorary Title Badge */}
          <div className="my-6 inline-block">
            <div className="px-6 py-2.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-spiritual font-bold text-lg sm:text-xl shadow-xs">
              ✨ {completedResult.titleAwarded}
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs text-stone-500 font-sans">الدرجة النهائية</span>
              <span className="font-spiritual text-2xl font-bold text-stone-900">
                {completedResult.totalScore} / {completedResult.maxScore}
              </span>
            </div>
            
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs text-stone-500 font-sans">النسبة المئوية</span>
              <span className="font-spiritual text-2xl font-bold text-amber-800">
                {completedResult.percentage}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs text-stone-500 font-sans">التقدير العام</span>
              <span className="font-spiritual text-xl font-bold text-stone-900">
                {completedResult.grade}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="block text-xs text-stone-500 font-sans">الوقت المستغرق</span>
              <span className="font-spiritual text-xl font-bold text-stone-900">
                {Math.round(completedResult.totalTimeSeconds)} ثانية
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-right">
            <h3 className="font-bold text-sm text-stone-900 mb-3 text-center">
              تفصيل الأداء في فروع العلوم الثلاثة
            </h3>
            <div className="space-y-2.5">
              {CATEGORIES.map((cat) => {
                const b = completedResult.categoryBreakdown?.[cat.id];
                if (!b || b.total === 0) return null;
                const catPct = Math.round((b.correct / b.total) * 100);

                return (
                  <div key={cat.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-stone-800 mb-1">
                      <span>{cat.title}</span>
                      <span>{b.correct} من {b.total} ({catPct}%)</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-700 h-1.5 rounded-full"
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spiritual Reflection & Growth Steps */}
          <div className="max-w-xl mx-auto mb-8 p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/40 border border-amber-200/80 text-right space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>مراجعة المسيرة: جوانب القوة وخطوات النمو العملي</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              هذا التقييم هو مرآة للمراجعة والتشجيع في محضر الله؛ وليس حكماً على القداسة أو القيمة أمام الرب، فالنعمة تعمل في الضعف:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-800">
                  🌱 جوانب القوة والبركة:
                </span>
                <p className="text-[11px] text-slate-600">
                  {completedResult.percentage >= 75
                    ? 'إلمام كتابي وكنسي رفيع، وحس تمييز يقظ يعكس حباً أصيلاً للتراث والخدمة.'
                    : 'محبة صادقة للمسيرة، مع بذل جهد مبارك في التفكير والمراجعة الهادئة.'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                  🕊️ خطوات النمو المقترحة:
                </span>
                <p className="text-[11px] text-slate-600">
                  التعمق في أقوال الآباء والصلوات الطقسية، وقراءة متأنية في نصوص الأسفار والمراجع المقترحة في بنك الدراسة.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons (Certificate + Retake) */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenCertificate(completedResult)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-sm sm:text-base shadow-md flex items-center gap-2 transition-transform hover:scale-102"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>استخراج شهادة التقدير الرسمية</span>
            </button>

            <button
              type="button"
              onClick={() => setStage('setup')}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
              <span>إعادة جولة جديدة</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors"
            >
              الرئيسية
            </button>
          </div>

        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-3xl shadow-md border border-stone-200 p-6 sm:p-8">
          <h2 className="font-spiritual text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-800" />
            <span>مراجعة شاملة لأسئلة الجولة والتوثيق</span>
          </h2>

          <div className="space-y-6">
            {activeQuestions.map((q, idx) => {
              const ans = completedResult.answers[idx];
              const isCorrect = ans?.isCorrect;

              return (
                <div 
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isCorrect 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-spiritual font-bold text-base sm:text-lg text-stone-900">
                      {idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        إجابة صحيحة
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        إجابة خاطئة
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs my-3">
                    <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block mb-0.5">إجابتكِ:</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold font-spiritual text-sm' : 'text-rose-700 font-bold font-spiritual text-sm'}>
                        {ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined
                          ? q.options[ans.selectedOptionIndex]
                          : 'انتهى الوقت دون إجابة'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200">
                      <span className="text-emerald-800 block mb-0.5">الإجابة المعتمدة الصحيحة:</span>
                      <span className="text-emerald-950 font-bold font-spiritual text-sm">
                        {q.options[q.correctIndex]}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                    <p className="font-spiritual text-sm text-stone-800 mb-1">{q.explanation}</p>
                    <p className="text-[11px] text-stone-500 font-sans">المرجع الكنسي: {q.reference}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  return null;
};
