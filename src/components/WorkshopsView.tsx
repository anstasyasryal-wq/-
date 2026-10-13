import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { Workshop, WorkshopUnit, UserWorkshopProgress } from '../types/workshops';
import { INTERACTIVE_WORKSHOPS } from '../data/workshopsData';
import { workshopsStorage } from '../utils/workshopsStorage';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  Send,
  Layers,
  Award,
  FileCheck,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Quote,
  Target,
  PenTool,
} from 'lucide-react';

interface WorkshopsViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const userId = currentUser?.id || 'guest_user';
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);
  const [workshopsProgress, setWorkshopsProgress] = useState<Record<string, UserWorkshopProgress>>({});

  // Active unit interactive quiz & exercise state
  const [userUnitQuizAnswers, setUserUnitQuizAnswers] = useState<Record<string, number>>({});
  const [unitQuizSubmitted, setUnitQuizSubmitted] = useState<boolean>(false);
  const [unitNotesInput, setUnitNotesInput] = useState<string>('');
  const [finalProjectInput, setFinalProjectInput] = useState<string>('');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const { isNightMode, getCardClass } = useReadingTheme();

  // Load workshops progress
  useEffect(() => {
    setWorkshopsProgress(workshopsStorage.getAllProgress(userId));
  }, [userId]);

  const activeWorkshopProgress = useMemo(() => {
    if (!selectedWorkshop) return null;
    return workshopsProgress[selectedWorkshop.id] || {
      workshopId: selectedWorkshop.id,
      completedUnitIds: [],
      currentUnitId: '',
      quizScores: {},
      unitAnswers: {},
      unitPracticalNotes: {},
      finalProjectDraft: '',
      isCompleted: false,
      lastAccessedAt: '',
    };
  }, [selectedWorkshop, workshopsProgress]);

  const handleSelectWorkshop = (ws: Workshop) => {
    soundManager.playTick();
    setSelectedWorkshop(ws);
    const prog = workshopsStorage.getWorkshopProgress(userId, ws.id);
    setActiveUnitIndex(0);
    setFinalProjectInput(prog.finalProjectDraft || '');

    const firstUnit = ws.units[0];
    if (firstUnit) {
      setUnitNotesInput(prog.unitPracticalNotes[firstUnit.id] || '');
      setUserUnitQuizAnswers(prog.unitAnswers[firstUnit.id] || {});
      setUnitQuizSubmitted(Boolean(prog.completedUnitIds.includes(firstUnit.id)));
    }
  };

  const handleChangeUnit = (index: number) => {
    if (!selectedWorkshop) return;
    soundManager.playTick();
    setActiveUnitIndex(index);
    const unit = selectedWorkshop.units[index];
    const prog = workshopsStorage.getWorkshopProgress(userId, selectedWorkshop.id);
    if (unit) {
      setUnitNotesInput(prog.unitPracticalNotes[unit.id] || '');
      setUserUnitQuizAnswers(prog.unitAnswers[unit.id] || {});
      setUnitQuizSubmitted(Boolean(prog.completedUnitIds.includes(unit.id)));
    }
  };

  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    if (unitQuizSubmitted) return;
    soundManager.playTick();
    setUserUnitQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCompleteActiveUnit = () => {
    if (!selectedWorkshop) return;
    const currentUnit = selectedWorkshop.units[activeUnitIndex];
    if (!currentUnit) return;

    // Evaluate quiz
    let correctCount = 0;
    currentUnit.reviewQuiz.forEach((q) => {
      if (userUnitQuizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const isQuizPassed =
      currentUnit.reviewQuiz.length === 0 || correctCount === currentUnit.reviewQuiz.length;

    if (!isQuizPassed) {
      soundManager.playWrong();
      setStatusToast('يرجى مراجعة إجابات أسئلة الوحدة لتصويب الخيارات الخاطئة.');
      setUnitQuizSubmitted(true);
      setTimeout(() => setStatusToast(null), 3500);
      return;
    }

    soundManager.playVictory();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    const updated = workshopsStorage.markUnitCompleted(
      userId,
      selectedWorkshop.id,
      currentUnit.id,
      correctCount,
      userUnitQuizAnswers,
      unitNotesInput
    );

    setWorkshopsProgress((prev) => ({ ...prev, [selectedWorkshop.id]: updated }));
    setUnitQuizSubmitted(true);
    setStatusToast(`تهانينا! تم إتمام الوحدة «${currentUnit.title}» بنجاح.`);
    setTimeout(() => setStatusToast(null), 3000);

    // Advance to next unit if available
    if (activeUnitIndex + 1 < selectedWorkshop.units.length) {
      setTimeout(() => handleChangeUnit(activeUnitIndex + 1), 1200);
    }
  };

  const handleSubmitFinalProject = () => {
    if (!selectedWorkshop) return;
    if (!finalProjectInput.trim()) {
      setStatusToast('يرجى كتابة مسودة المشروع الختامي أولاً.');
      setTimeout(() => setStatusToast(null), 3000);
      return;
    }

    soundManager.playVictory();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

    const updated = workshopsStorage.submitFinalProject(
      userId,
      selectedWorkshop.id,
      finalProjectInput
    );
    setWorkshopsProgress((prev) => ({ ...prev, [selectedWorkshop.id]: updated }));
    setStatusToast('مبارك! تم اعتماد إتمام الورشة وحفظ المشروع الختامي بنجاح.');
    setTimeout(() => setStatusToast(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in text-right">
      {/* Toast */}
      {statusToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-950 text-amber-200 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Main Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-amber-950 text-white p-6 sm:p-10 border border-amber-400/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>برامج التمكين العملي والمهارات الكنسية</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight">
            🛠️ ورش العمل التفاعلية المتخصصة
          </h1>

          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
            10 ورش عمل عملية متكاملة تجمع بين التأصيل الكتابي والآبائي، والتدريبات السلوكية، وأسئلة المراجعة، والمشروعات الختامية لتطوير مهارات الخدمة، وإعداد العظات، وإدارة اللقاءات، والبحث والتوثيق.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKSHOPS CATALOG / LISTING */}
      {/* ========================================================================= */}
      {!selectedWorkshop && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold">
              جميع ورش العمل المعتمدة: ({INTERACTIVE_WORKSHOPS.length} ورش تدريبية)
            </span>
            <span className="text-amber-800 font-semibold">
              اختر الورشة لبدء وحداتها وتدريباتها التفاعلية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTERACTIVE_WORKSHOPS.map((ws) => {
              const prog = workshopsProgress[ws.id];
              const completedCount = prog?.completedUnitIds?.length || 0;
              const totalUnits = ws.units.length;
              const percent = Math.round((completedCount / totalUnits) * 100);
              const isFinished = prog?.isCompleted;

              return (
                <div
                  key={ws.id}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-amber-400 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {ws.category} • {ws.difficulty}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{ws.estimatedHours} ساعات تدريبية</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-2xl flex items-center justify-center flex-shrink-0">
                        {ws.icon}
                      </div>
                      <div>
                        <h3 className="font-spiritual font-bold text-base sm:text-lg text-slate-900">
                          {ws.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{ws.subtitle}</p>
                      </div>
                    </div>

                    {/* Objectives preview */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        🎯 أبرز أهداف الورشة:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-1 pr-1">
                        {ws.objectives.slice(0, 2).map((obj, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className="line-clamp-1">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>إنجاز الوحدات:</span>
                        <span className="font-bold text-indigo-900">
                          {isFinished
                            ? '🏆 مكتملة بالكامل'
                            : `${completedCount} من ${totalUnits} وحدات (${percent}%)`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                      {ws.units.length} وحدات تفاعلية
                    </span>
                    <button
                      onClick={() => handleSelectWorkshop(ws)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-900 to-amber-700 hover:brightness-105 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{completedCount > 0 ? 'استكمال الورشة' : 'بدء الورشة الآن'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE WORKSHOP PLAYER */}
      {/* ========================================================================= */}
      {selectedWorkshop && (
        <div className="space-y-6">
          {/* Top Back Navigation Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedWorkshop(null)}
              className="text-xs text-indigo-950 font-bold flex items-center gap-1 hover:text-amber-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>العودة لدليل ورش العمل</span>
            </button>
            <div className="text-xs text-slate-500 font-semibold">
              ورشة رقم {selectedWorkshop.number} • {selectedWorkshop.category}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Units Navigation */}
            <div className="lg:col-span-1 space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-spiritual font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  📑 وحدات الورشة التدريبية
                </h3>

                <div className="space-y-1.5">
                  {selectedWorkshop.units.map((unit, idx) => {
                    const isUnitCompleted = activeWorkshopProgress?.completedUnitIds?.includes(
                      unit.id
                    );
                    const isUnitActive = idx === activeUnitIndex;

                    return (
                      <button
                        key={unit.id}
                        onClick={() => handleChangeUnit(idx)}
                        className={`w-full text-right p-3 rounded-xl text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer ${
                          isUnitActive
                            ? 'bg-amber-600 text-white shadow-xs'
                            : isUnitCompleted
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                              isUnitActive
                                ? 'bg-white text-amber-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="truncate">{unit.title}</span>
                        </div>
                        {isUnitCompleted && (
                          <CheckCircle2
                            className={`w-4 h-4 flex-shrink-0 ${
                              isUnitActive ? 'text-white' : 'text-emerald-600'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objectives Reminder Card */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">🎯 المستهدف من الورشة:</span>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                  {selectedWorkshop.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Area: Active Unit Content & Exercises */}
            <div className="lg:col-span-3 space-y-6">
              {(() => {
                const currentUnit = selectedWorkshop.units[activeUnitIndex];
                if (!currentUnit) return null;

                const isUnitCompleted = activeWorkshopProgress?.completedUnitIds?.includes(
                  currentUnit.id
                );

                return (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    {/* Unit Header */}
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                          الوحدة {activeUnitIndex + 1} من {selectedWorkshop.units.length} • المدة:{' '}
                          {currentUnit.durationMinutes} دقيقة
                        </span>
                        {isUnitCompleted && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مكتملة ومحفوظة</span>
                          </span>
                        )}
                      </div>

                      <h2 className="font-spiritual font-black text-xl sm:text-2xl text-slate-900">
                        {currentUnit.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                        {currentUnit.summary}
                      </p>
                    </div>

                    {/* Explanation Body */}
                    <div className="space-y-4">
                      <h3 className="font-spiritual font-bold text-base text-indigo-950 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span>الشرح النظري والتأصيل المعرفي:</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                        {currentUnit.explanationText}
                      </p>

                      {/* Scripture & Patristic Anchors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs space-y-1">
                          <span className="font-bold flex items-center gap-1 text-amber-900">
                            <Quote className="w-3 h-3 text-amber-600" />
                            <span>الشاهد الكتابي: {currentUnit.scriptureAnchor.verse}</span>
                          </span>
                          <p className="font-spiritual text-xs leading-relaxed font-bold">
                            {currentUnit.scriptureAnchor.text}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs space-y-1">
                          <span className="font-bold block text-indigo-900">
                            قول الأب: {currentUnit.patristicAnchor.father}
                          </span>
                          <p className="font-spiritual text-xs leading-relaxed">
                            {currentUnit.patristicAnchor.quote}
                          </p>
                          <span className="text-[10px] text-indigo-700 block text-left">
                            المصدر: {currentUnit.patristicAnchor.source}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Practical Exercise */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-sm text-slate-900">
                          التمرين التطبيقي: {currentUnit.practicalExercise.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {currentUnit.practicalExercise.instructions}
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1 pr-2 list-disc list-inside">
                        {currentUnit.practicalExercise.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>

                      {/* User's Practical Notes Input */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-slate-800 block">
                          📝 {currentUnit.practicalExercise.deliverablePrompt}
                        </label>
                        <textarea
                          value={unitNotesInput}
                          onChange={(e) => setUnitNotesInput(e.target.value)}
                          placeholder="اكتب خلاصة تدريبك وملاحظاتك الشخصية هنا..."
                          rows={3}
                          className="w-full p-3 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-xs leading-relaxed outline-none"
                        />
                      </div>
                    </div>

                    {/* Review Quiz */}
                    {currentUnit.reviewQuiz && currentUnit.reviewQuiz.length > 0 && (
                      <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-700" />
                          <h4 className="font-bold text-sm text-slate-900">
                            أسئلة مراجعة الفهم والتحقق:
                          </h4>
                        </div>

                        {currentUnit.reviewQuiz.map((quizItem) => {
                          const userSelected = userUnitQuizAnswers[quizItem.id];
                          const isAnswered = userSelected !== undefined;

                          return (
                            <div key={quizItem.id} className="space-y-2.5">
                              <p className="text-xs font-bold text-slate-800">
                                {quizItem.question}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quizItem.options.map((opt, optIdx) => {
                                  const isSelected = userSelected === optIdx;
                                  const isCorrect = optIdx === quizItem.correctIndex;

                                  let optClass =
                                    'bg-white border-slate-200 text-slate-700 hover:border-amber-300';
                                  if (unitQuizSubmitted) {
                                    if (isCorrect) {
                                      optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                                    } else if (isSelected && !isCorrect) {
                                      optClass = 'bg-rose-50 border-rose-400 text-rose-950';
                                    }
                                  } else if (isSelected) {
                                    optClass = 'bg-amber-100 border-amber-500 text-indigo-950 font-bold';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectQuizAnswer(quizItem.id, optIdx)}
                                      className={`p-3 rounded-xl border text-xs text-right transition cursor-pointer ${optClass}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {unitQuizSubmitted && (
                                <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                                  💡 <strong>الشرح:</strong> {quizItem.explanation}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Completion Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleChangeUnit(Math.max(0, activeUnitIndex - 1))}
                        disabled={activeUnitIndex === 0}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 disabled:opacity-40 cursor-pointer"
                      >
                        الوحدة السابقة
                      </button>

                      <button
                        onClick={handleCompleteActiveUnit}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-xs shadow-md hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>إتمام الوحدة والانتقال</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Final Project Submission Section */}
              <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-indigo-900" />
                  <h3 className="font-spiritual font-black text-lg text-indigo-950">
                    المشروع الختامي للورشة: {selectedWorkshop.finalProject.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedWorkshop.finalProject.description}
                </p>

                <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-900 block">
                    📋 المخرجات المطلوبة:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {selectedWorkshop.finalProject.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    ✍️ {selectedWorkshop.finalProject.submissionPrompt}
                  </label>
                  <textarea
                    value={finalProjectInput}
                    onChange={(e) => setFinalProjectInput(e.target.value)}
                    placeholder="اكتب هنا مسودة مشروعك الختامي الكامل للتطبيق في خدمتك أو ديرك أو كنيستك..."
                    rows={5}
                    className="w-full p-4 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-xs leading-relaxed outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitFinalProject}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>اعتماد وتسليم المشروع الختامي</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
