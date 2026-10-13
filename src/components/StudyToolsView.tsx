import React, { useState, useMemo, useEffect } from 'react';
import { User, Question, SoloQuizResult } from '../types';
import { getStoredQuestions } from '../utils/competitionEngine';
import { SoloQuiz } from './SoloQuiz';
import { TeamQuiz } from './TeamQuiz';
import { SpeedChallenge } from './SpeedChallenge';
import { StudyBank } from './StudyBank';
import { CertificateModal } from './CertificateModal';
import { COPTIC_TERMS } from '../data/copticDictionary';
import { soundManager } from '../utils/audio';
import {
  Brain,
  User as UserIcon,
  Users,
  Zap,
  BookOpen,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck,
  Search,
  Filter,
} from 'lucide-react';

interface StudyToolsViewProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const StudyToolsView: React.FC<StudyToolsViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeTool, setActiveTool] = useState<
    'hub' | 'solo' | 'team' | 'speed' | 'bank' | 'missed' | 'flashcards'
  >('hub');

  // Certificate Modal state for Solo Quiz
  const [certificateResult, setCertificateResult] = useState<SoloQuizResult | null>(null);

  // Pool of all questions for training (independent from official competition stages)
  const questionsPool: Question[] = useMemo(() => getStoredQuestions(), []);

  // =========================================================================
  // MISSED QUESTIONS REVIEW MODE
  // =========================================================================
  const userId = currentUser?.id || 'guest_user';
  const MISSED_KEY = `mokarasa_missed_questions_${userId}`;
  const [missedQuestionIds, setMissedQuestionIds] = useState<string[]>([]);
  const [missedIndex, setMissedIndex] = useState(0);
  const [missedSelectedOption, setMissedSelectedOption] = useState<number | null>(null);
  const [missedSubmitted, setMissedSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MISSED_KEY);
      if (saved) {
        setMissedQuestionIds(JSON.parse(saved));
      } else {
        // Seed with a few questions for demonstration if empty
        const sampleIds = questionsPool.slice(0, 5).map((q) => q.id);
        setMissedQuestionIds(sampleIds);
      }
    } catch {
      // ignore
    }
  }, [MISSED_KEY, questionsPool]);

  const missedQuestions = useMemo(() => {
    return questionsPool.filter((q) => missedQuestionIds.includes(q.id));
  }, [questionsPool, missedQuestionIds]);

  const currentMissedQ = missedQuestions[missedIndex] || null;

  const handleAnswerMissed = (idx: number) => {
    if (missedSubmitted || !currentMissedQ) return;
    setMissedSelectedOption(idx);
    setMissedSubmitted(true);

    if (idx === currentMissedQ.correctIndex) {
      soundManager.playCorrect();
      // Remove from missed list once mastered
      const updated = missedQuestionIds.filter((id) => id !== currentMissedQ.id);
      setMissedQuestionIds(updated);
      try {
        localStorage.setItem(MISSED_KEY, JSON.stringify(updated));
      } catch {}
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextMissed = () => {
    setMissedSubmitted(false);
    setMissedSelectedOption(null);
    if (missedIndex + 1 < missedQuestions.length) {
      setMissedIndex(missedIndex + 1);
    } else {
      setMissedIndex(0);
    }
  };

  // =========================================================================
  // FLASHCARDS MODE
  // =========================================================================
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  const currentFlashcard = COPTIC_TERMS[flashcardIndex] || COPTIC_TERMS[0];

  const handleNextFlashcard = () => {
    setFlashcardFlipped(false);
    soundManager.playTick();
    setFlashcardIndex((prev) => (prev + 1) % COPTIC_TERMS.length);
  };

  const handlePrevFlashcard = () => {
    setFlashcardFlipped(false);
    soundManager.playTick();
    setFlashcardIndex((prev) => (prev - 1 + COPTIC_TERMS.length) % COPTIC_TERMS.length);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in text-right">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>أدوات التدريب والدراسة المستقلة عن المسابقة الرسمية</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight">
            🧠 منصة التدريب والدراسة الفردية والجماعية
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            مساحة تدريبية حرة للمراجعة والتعلم الذاتي والجماعي: اختبارات فردية مع شهادات تقدير، ومسابقات للفرق، وتحديات السرعة، وبنك أسئلة مفتوح، ومراجعة الأسئلة الخاطئة، وبطاقات تعليمية.
          </p>

          {/* Quick Sub-Tool Switcher */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setActiveTool('hub')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'hub'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTool('solo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'solo'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              الاختبار الفردي (شهادة)
            </button>
            <button
              onClick={() => setActiveTool('team')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'team'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              مسابقة الفرق الجماعية
            </button>
            <button
              onClick={() => setActiveTool('speed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'speed'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              تحدي السرعة 60 ثانية
            </button>
            <button
              onClick={() => setActiveTool('bank')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'bank'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              بنك الأسئلة المفتوح
            </button>
            <button
              onClick={() => setActiveTool('missed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'missed'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              مراجعة الأسئلة الخاطئة ({missedQuestions.length})
            </button>
            <button
              onClick={() => setActiveTool('flashcards')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTool === 'flashcards'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              البطاقات التعليمية
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HUB / CARDS OVERVIEW */}
      {/* ========================================================================= */}
      {activeTool === 'hub' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Solo Quiz */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-amber-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center text-xl">
                👤
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                الاختبار التدريبي الفردي
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                اختبار مستقل حسب القسم ومستوى الصعوبة، مع وسائل مساعدة (50:50 وتلميح) وإمكانية استخراج شهادة تقدير شخصية.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('solo')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>بدء الاختبار التدريبي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Team Quiz */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-indigo-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center justify-center text-xl">
                👥
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                المسابقة الجماعية للفرق
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                إدارة منافسة حية بين فرق الكنائس والأديرة وبيوت التكريس مع جرس الأدوار، سجل الجولات، وطباعة النتائج.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('team')}
              className="w-full py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>دخول منصة الفرق</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Speed Challenge */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-amber-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200 flex items-center justify-center text-xl">
                ⚡
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                تحدي السرعة وبونص الثواني
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                60 ثانية لحصد أكبر عدد من الإجابات الصحيحة المتتالية واختبار الاستحضار الذهني السريع للمعلومة.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('speed')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>بدء تحدي الـ 60 ثانية</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Study Bank */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-slate-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-center text-xl">
                📚
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                بنك الاستذكار المفتوح
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                استعراض كامل لجميع الأسئلة مع ميزة كشف أو إخفاء الإجابات والشروح والمراجع الموثقة للدراسة الحرة.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('bank')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>تصفح بنك الأسئلة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Missed Questions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-rose-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center text-xl">
                🎯
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                مراجعة الأسئلة الخاطئة
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                وضع تدريبي ذكي يعيد عرض الأسئلة التي تعثرت فيها سابقاً لتثبيت المعلومة والشرح حتى إتقانها تماماً.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('missed')}
              className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>مراجعة الأسئلة ({missedQuestions.length})</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Flashcards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 text-right hover:border-emerald-400 transition">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xl">
                🎴
              </div>
              <h3 className="font-spiritual font-bold text-lg text-slate-900">
                البطاقات التعليمية الذكية
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                بطاقات تفاعلية بوجهين لتعلم المصطلحات القبطية والكنسية والشخصيات الآبائية بطريقة شيقة وسريعة.
              </p>
            </div>
            <button
              onClick={() => setActiveTool('flashcards')}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>عرض البطاقات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SOLO QUIZ ENGINE */}
      {/* ========================================================================= */}
      {activeTool === 'solo' && (
        <SoloQuiz
          questionsPool={questionsPool}
          onOpenCertificate={(res) => setCertificateResult(res)}
          onBackToHome={() => setActiveTool('hub')}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. TEAM QUIZ ENGINE */}
      {/* ========================================================================= */}
      {activeTool === 'team' && (
        <TeamQuiz
          questionsPool={questionsPool}
          onBackToHome={() => setActiveTool('hub')}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. SPEED CHALLENGE ENGINE */}
      {/* ========================================================================= */}
      {activeTool === 'speed' && (
        <SpeedChallenge
          questionsPool={questionsPool}
          onBackToHome={() => setActiveTool('hub')}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. STUDY BANK ENGINE */}
      {/* ========================================================================= */}
      {activeTool === 'bank' && (
        <StudyBank
          questions={questionsPool}
          onBackToHome={() => setActiveTool('hub')}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. MISSED QUESTIONS REVIEW MODE */}
      {/* ========================================================================= */}
      {activeTool === 'missed' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-right">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              وضع مراجعة الأسئلة المتعثرة ({missedQuestions.length} سؤال متبقٍ)
            </span>
            <button
              onClick={() => setActiveTool('hub')}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              رجوع للأدوات
            </button>
          </div>

          {currentMissedQ ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">
                  {currentMissedQ.category} • {currentMissedQ.subCategory}
                </span>
                <h3 className="font-spiritual font-black text-base sm:text-lg text-slate-900 leading-snug">
                  {currentMissedQ.question}
                </h3>
              </div>

              <div className="space-y-2">
                {currentMissedQ.options.map((opt, idx) => {
                  const isSelected = missedSelectedOption === idx;
                  const isCorrect = idx === currentMissedQ.correctIndex;

                  let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (missedSubmitted) {
                    if (isCorrect) optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    else if (isSelected && !isCorrect) optClass = 'bg-rose-50 border-rose-400 text-rose-950';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerMissed(idx)}
                      disabled={missedSubmitted}
                      className={`w-full p-3.5 rounded-xl border text-xs text-right transition cursor-pointer ${optClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {missedSubmitted && (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-amber-950 block">💡 الشرح التوثيقي:</span>
                    <p className="text-slate-700 leading-relaxed font-spiritual font-bold">
                      {currentMissedQ.explanation}
                    </p>
                    <span className="text-[10px] text-amber-800/80 block text-left">
                      المرجع: {currentMissedQ.reference}
                    </span>
                  </div>

                  <button
                    onClick={handleNextMissed}
                    className="w-full py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    السؤال التالي
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-spiritual font-bold text-base text-slate-800">
                رائع! تم إتقان جميع الأسئلة المتعثرة
              </h3>
              <p className="text-xs">لا توجد أسئلة خاطئة مسجلة حالياً في قائمة مراجعتك.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FLASHCARDS MODE */}
      {/* ========================================================================= */}
      {activeTool === 'flashcards' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="font-bold">
              البطاقة {flashcardIndex + 1} من {COPTIC_TERMS.length}
            </span>
            <button
              onClick={() => setActiveTool('hub')}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              رجوع للأدوات
            </button>
          </div>

          {/* Flashcard Body */}
          <div
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            className="min-h-56 p-8 rounded-3xl bg-gradient-to-tr from-amber-50 via-white to-indigo-50 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center cursor-pointer transition transform hover:scale-[1.01]"
          >
            {!flashcardFlipped ? (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  المصطلح القبطي
                </span>
                <h2 className="font-spiritual font-black text-3xl sm:text-4xl text-indigo-950">
                  {currentFlashcard.coptic}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  النطق والتعريب: {currentFlashcard.transliteration}
                </p>
                <span className="text-[10px] text-amber-700 block pt-2 animate-pulse">
                  (انقر لقلب البطاقة ومعرفة المعنى والاستخدام الكنسي)
                </span>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {currentFlashcard.categoryLabel}
                </span>
                <h3 className="font-spiritual font-black text-2xl text-slate-900">
                  {currentFlashcard.arabicMeaning}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-sm">
                  {currentFlashcard.usageContext}
                </p>
                {currentFlashcard.exampleSentence && (
                  <span className="text-[11px] text-indigo-900 font-bold block pt-1">
                    مثال: {currentFlashcard.exampleSentence}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevFlashcard}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              السابقة
            </button>
            <button
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              قلب البطاقة
            </button>
            <button
              onClick={handleNextFlashcard}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              التالية
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal for Solo Quiz */}
      {certificateResult && (
        <CertificateModal
          result={certificateResult}
          onClose={() => setCertificateResult(null)}
        />
      )}
    </div>
  );
};
