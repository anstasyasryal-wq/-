import React, { useState } from 'react';
import { User, Question } from '../types';
import { getStoredQuestions } from '../utils/competitionEngine';
import { soundManager } from '../utils/audio';
import { Brain, ChevronLeft, CheckCircle2, XCircle, Search, Dna, Landmark, Cross } from 'lucide-react';

interface StudyToolsViewProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const StudyToolsView: React.FC<StudyToolsViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const allQuestions: Question[] = getStoredQuestions();
  const [activeSubject, setActiveSubject] = useState<'all' | 'religion' | 'genetics' | 'culture'>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const filtered = allQuestions.filter(
    (q) => activeSubject === 'all' || q.subject === activeSubject
  );

  const handleSelectOption = (qId: string, optIdx: number, correctIdx: number) => {
    soundManager.playTick();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    if (optIdx === correctIdx) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-teal-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-600/40 text-teal-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5 text-teal-400" />
          <span>منصة التدريب والدراسة الحرة</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🔍 منصة التدريب وبنك الأسئلة والبحث
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          تدريب حر على كافة أنماط الأسئلة (اختيار، صح وخطأ، وتوصيل) مع مراجعة الشروح والتوثيقات في العلوم واللاهوت والتراث.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubject === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            الكل ({allQuestions.length})
          </button>
          <button
            onClick={() => setActiveSubject('religion')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeSubject === 'religion'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Cross className="w-3.5 h-3.5 text-amber-400" />
            <span>العلوم الكنسية</span>
          </button>
          <button
            onClick={() => setActiveSubject('genetics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeSubject === 'genetics'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-emerald-400" />
            <span>علم الجينات والوراثة</span>
          </button>
          <button
            onClick={() => setActiveSubject('culture')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeSubject === 'culture'
                ? 'bg-indigo-600 text-white'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>الثقافة والتاريخ</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q) => {
          const userAnswer = selectedAnswers[q.id];
          const hasAnswered = userAnswer !== undefined;

          return (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 text-right shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">
                  {q.type === 'multiple_choice' && 'اختيار من متعدد'}
                  {q.type === 'true_false' && 'صواب أم خطأ'}
                  {q.type === 'matching' && 'توصيل ومطابقة'}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {q.points} نقطة
                </span>
              </div>

              <h3 className="font-spiritual text-base sm:text-lg font-bold text-stone-100">
                {q.text}
              </h3>

              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isPicked = userAnswer === oIdx;
                    const isCorrect = q.correctAnswer === oIdx;

                    let btnClass = 'bg-stone-950 border-stone-800 text-stone-200 hover:bg-stone-850';
                    if (hasAnswered) {
                      if (isCorrect) btnClass = 'bg-emerald-950 border-emerald-500 text-emerald-100';
                      else if (isPicked && !isCorrect) btnClass = 'bg-rose-950 border-rose-500 text-rose-100';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, oIdx, q.correctAnswer as number)}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {hasAnswered && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.matchingPairs && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block mb-1">المطابقات النموذجية:</span>
                  {q.matchingPairs.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-stone-300 py-0.5">
                      <strong className="text-white">{p.left}</strong>
                      <span>⟷ {p.right}</span>
                    </div>
                  ))}
                </div>
              )}

              {hasAnswered && (
                <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-600/30 text-xs text-stone-300 space-y-1">
                  <p>💡 {q.explanation}</p>
                  {q.scriptureReference && (
                    <span className="text-[10px] text-amber-400 font-mono block">
                      📖 المرجع: {q.scriptureReference}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
