import React, { useState } from 'react';
import { 
  WHO_SAID_IT_CHALLENGES, 
  TIMELINE_CHALLENGES, 
  DISCERNMENT_SCENARIOS, 
  TimelineEventItem 
} from '../data/creativeChallenges';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Lightbulb, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  HeartHandshake, 
  Award,
  ChevronLeft
} from 'lucide-react';

interface CreativeLabProps {
  onBackToHome: () => void;
}

export const CreativeLab: React.FC<CreativeLabProps> = ({ onBackToHome }) => {
  const [activeSubTab, setActiveSubTab] = useState<'quotes' | 'timeline' | 'scenarios'>('quotes');

  // -------------------------------------------------------------
  // STATE 1: Who Said It?
  // -------------------------------------------------------------
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteSelectedOption, setQuoteSelectedOption] = useState<number | null>(null);
  const [quoteAnswered, setQuoteAnswered] = useState(false);
  const [quoteScore, setQuoteScore] = useState(0);

  const currentQuote = WHO_SAID_IT_CHALLENGES[quoteIndex];

  const handleSelectQuoteOption = (idx: number) => {
    if (quoteAnswered) return;
    setQuoteSelectedOption(idx);
    setQuoteAnswered(true);

    const isCorrect = idx === currentQuote.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setQuoteScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextQuote = () => {
    if (quoteIndex + 1 < WHO_SAID_IT_CHALLENGES.length) {
      setQuoteIndex((prev) => prev + 1);
      setQuoteSelectedOption(null);
      setQuoteAnswered(false);
    } else {
      setQuoteIndex(0);
      setQuoteSelectedOption(null);
      setQuoteAnswered(false);
    }
  };

  // -------------------------------------------------------------
  // STATE 2: Timeline Ordering
  // -------------------------------------------------------------
  const [timelineIndex, setTimelineIndex] = useState(0);
  const currentTimeline = TIMELINE_CHALLENGES[timelineIndex];
  
  // Shuffled events for the user to reorder
  const [userOrderedEvents, setUserOrderedEvents] = useState<TimelineEventItem[]>(() => {
    return [...currentTimeline.events].sort(() => 0.5 - Math.random());
  });
  const [timelineEvaluated, setTimelineEvaluated] = useState(false);
  const [isTimelineAllCorrect, setIsTimelineAllCorrect] = useState(false);

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (timelineEvaluated) return;
    const newItems = [...userOrderedEvents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    soundManager.playTick();
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setUserOrderedEvents(newItems);
  };

  const handleEvaluateTimeline = () => {
    setTimelineEvaluated(true);
    const allCorrect = userOrderedEvents.every((item, idx) => item.correctOrder === idx + 1);
    setIsTimelineAllCorrect(allCorrect);

    if (allCorrect) {
      soundManager.playVictory();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextTimeline = () => {
    const nextIdx = (timelineIndex + 1) % TIMELINE_CHALLENGES.length;
    setTimelineIndex(nextIdx);
    const nextTimeline = TIMELINE_CHALLENGES[nextIdx];
    setUserOrderedEvents([...nextTimeline.events].sort(() => 0.5 - Math.random()));
    setTimelineEvaluated(false);
    setIsTimelineAllCorrect(false);
  };

  // -------------------------------------------------------------
  // STATE 3: Discernment Scenarios
  // -------------------------------------------------------------
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [scenarioAnswered, setScenarioAnswered] = useState(false);

  const currentScenario = DISCERNMENT_SCENARIOS[scenarioIndex];

  const handleSelectScenarioChoice = (id: string) => {
    if (scenarioAnswered) return;
    setSelectedChoiceId(id);
    setScenarioAnswered(true);

    const choice = currentScenario.choices.find((c) => c.id === id);
    if (choice?.isOptimal) {
      soundManager.playCorrect();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextScenario = () => {
    const nextIdx = (scenarioIndex + 1) % DISCERNMENT_SCENARIOS.length;
    setScenarioIndex(nextIdx);
    setSelectedChoiceId(null);
    setScenarioAnswered(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 flex items-center justify-center shadow-md">
              <Lightbulb className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900">
                مختبر المسابقات الإبداعية
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                أنماط تنافسية مبتكرة: من قائل العبارة، الترتيب الزمني للأحداث، ومواقف الإفراز والرعاية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
          >
            رجوع للرئيسية
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'quotes'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>تحدي: مَن قائل العبارة؟</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'timeline'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>تحدي: الترتيب الزمني التاريخي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('scenarios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'scenarios'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>تحدي: مواقف الإفراز والرعاية</span>
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SUB-TAB 1: WHO SAID IT? */}
      {/* ======================================================= */}
      {activeSubTab === 'quotes' && currentQuote && (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 sm:p-10 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4 font-sans">
            <span>العبارة {quoteIndex + 1} من {WHO_SAID_IT_CHALLENGES.length}</span>
            <span className="font-bold text-amber-900">النقاط: {quoteScore}</span>
          </div>

          {/* Quote Card */}
          <div className="border-r-4 border-amber-800 bg-amber-50/50 rounded-2xl p-6 sm:p-8 mb-6 border border-amber-200/60">
            <p className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-950 leading-relaxed mb-3">
              {currentQuote.quote}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              <strong>المناسبة والسياق:</strong> {currentQuote.context}
            </p>
          </div>

          <h3 className="font-spiritual text-lg font-bold text-stone-900 mb-4">
            من القائل لهذه الكلمات الروحية الخالدة؟
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {currentQuote.options.map((option, idx) => {
              const isSelected = quoteSelectedOption === idx;
              const isCorrectAnswer = idx === currentQuote.correctIndex;

              let btnStyle = 'border-stone-200 bg-stone-50/50 hover:bg-amber-50 hover:border-amber-300 text-stone-800';

              if (quoteAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 line-through opacity-80';
                } else {
                  btnStyle = 'border-stone-200 bg-stone-100 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuoteOption(idx)}
                  disabled={quoteAnswered}
                  className={`p-4 rounded-2xl border text-right font-spiritual text-lg transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {quoteAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {quoteAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {quoteAnswered && (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 mb-6">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>البيان والتوثيق الآبائي:</span>
              </div>
              <p className="font-spiritual text-stone-800 text-sm leading-relaxed mb-1.5">
                {currentQuote.explanation}
              </p>
              <p className="text-stone-500 font-sans">
                المرجع: {currentQuote.reference}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuote}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {quoteIndex + 1 < WHO_SAID_IT_CHALLENGES.length ? 'القول التالي' : 'إعادة التحدي'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================= */}
      {/* SUB-TAB 2: TIMELINE ORDERING */}
      {/* ======================================================= */}
      {activeSubTab === 'timeline' && currentTimeline && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10">
          
          <div className="mb-6">
            <h2 className="font-spiritual text-2xl font-bold text-stone-900 mb-1">
              {currentTimeline.title}
            </h2>
            <p className="text-stone-600 text-sm">
              {currentTimeline.instruction} (استخدمي أسهم الصعود والنزول لترتيب الأحداث بالترتيب التاريخي السليم).
            </p>
          </div>

          {/* Draggable / Orderable List */}
          <div className="space-y-3 mb-6">
            {userOrderedEvents.map((item, index) => {
              const isCorrectPosition = item.correctOrder === index + 1;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    timelineEvaluated
                      ? isCorrectPosition
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/80 border-rose-300 text-rose-950'
                      : 'bg-stone-50/70 border-stone-200 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white border border-stone-300 font-sans font-bold text-sm text-stone-700 flex items-center justify-center shrink-0 shadow-2xs">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-spiritual text-base sm:text-lg font-bold leading-relaxed">
                        {item.text}
                      </p>
                      {timelineEvaluated && (
                        <p className="text-xs text-stone-500 font-sans mt-0.5">
                          التاريخ الدقيق: <strong>{item.eraNote}</strong> (الترتيب الصحيح: {item.correctOrder})
                        </p>
                      )}
                    </div>
                  </div>

                  {!timelineEvaluated && (
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveEvent(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="تحريك لأعلى (أسبق زمنياً)"
                      >
                        <ChevronUp className="w-4 h-4 text-stone-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEvent(index, 'down')}
                        disabled={index === userOrderedEvents.length - 1}
                        className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="تحريك لأسفل (أحدث زمنياً)"
                      >
                        <ChevronDown className="w-4 h-4 text-stone-600" />
                      </button>
                    </div>
                  )}

                  {timelineEvaluated && (
                    <div className="shrink-0">
                      {isCorrectPosition ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action and Evaluation */}
          {!timelineEvaluated ? (
            <button
              type="button"
              onClick={handleEvaluateTimeline}
              className="w-full py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>التحقق من الترتيب الزمني للأحداث</span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-stone-800 text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>
                  {isTimelineAllCorrect 
                    ? 'ممتاز! تم الترتيب الزمني بدقة تاريخية كاملة 👏' 
                    : 'حاولي مرة أخرى وتأملي في تواريخ وأزمنة هذه الأحداث الكنسية.'}
                </span>
              </div>
              <p className="font-spiritual text-stone-800 text-sm leading-relaxed mb-4">
                {currentTimeline.historicalLesson}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextTimeline}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm transition-all"
                >
                  التحدي الزمني التالي
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================= */}
      {/* SUB-TAB 3: DISCERNMENT SCENARIOS */}
      {/* ======================================================= */}
      {activeSubTab === 'scenarios' && currentScenario && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10">
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              {currentScenario.domain}
            </span>
            <span className="text-xs text-stone-400 font-sans">
              سيناريو {scenarioIndex + 1} من {DISCERNMENT_SCENARIOS.length}
            </span>
          </div>

          <h2 className="font-spiritual text-2xl font-bold text-stone-900 mb-4">
            {currentScenario.title}
          </h2>

          {/* Scenario Text */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 mb-6">
            <p className="font-spiritual text-base sm:text-lg text-stone-800 leading-relaxed">
              {currentScenario.situation}
            </p>
          </div>

          <h3 className="font-spiritual text-lg font-bold text-stone-900 mb-3">
            ما هو القرار الأكثر حكمة وإفرازاً طبقاً لروح التكريس؟
          </h3>

          {/* Choices */}
          <div className="space-y-3 mb-6">
            {currentScenario.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;

              let style = 'border-stone-200 bg-white hover:border-amber-300 text-stone-800';

              if (scenarioAnswered) {
                if (choice.isOptimal) {
                  style = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold';
                } else if (isSelected && !choice.isOptimal) {
                  style = 'border-rose-500 bg-rose-50/70 text-rose-950';
                } else {
                  style = 'border-stone-200 bg-stone-100 text-stone-400 opacity-60';
                }
              }

              return (
                <div
                  key={choice.id}
                  onClick={() => handleSelectScenarioChoice(choice.id)}
                  className={`p-4 sm:p-5 rounded-2xl border text-right transition-all cursor-pointer ${style}`}
                >
                  <p className="font-spiritual text-base sm:text-lg mb-1">
                    {choice.text}
                  </p>

                  {scenarioAnswered && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-xs font-sans">
                      <span className={choice.isOptimal ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {choice.isOptimal ? '✓ القرار الأمثل: ' : '✗ تنبيه: '}
                      </span>
                      <span className="text-stone-600">
                        {choice.spiritualAnalysis}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Post Answer Principle */}
          {scenarioAnswered && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block mb-0.5">المرجع والمبدأ الكتابي:</span>
                <span className="font-spiritual text-sm text-stone-800">{currentScenario.biblicalPrinciple}</span>
              </div>

              <button
                type="button"
                onClick={handleNextScenario}
                className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm transition-all shrink-0"
              >
                الموقف التالي
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
