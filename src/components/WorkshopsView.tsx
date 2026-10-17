import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  GraduationCap,
  CheckCircle2,
  Play,
  Award,
  BookOpen,
  Sparkles,
  X,
  FileCheck,
  Check,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface WorkshopLesson {
  title: string;
  content: string;
  practicalTip: string;
}

interface Workshop {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  desc: string;
  lessons: WorkshopLesson[];
  assessmentQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface WorkshopsViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

const WORKSHOPS_DATA: Workshop[] = [
  {
    id: 1,
    title: 'ورشة إعداد وتوثيق العظة الكتابية',
    instructor: 'قسم الرعاية والتعليم الكنسي',
    duration: '4 وحدات تدريبية',
    desc: 'خطوات استخراج الفكرة الروحية، ربط الشواهد، وتطبيق الآيات على الحياة اليومية للمخدومين.',
    lessons: [
      {
        title: 'الوحدة 1: اختيار النص وفهم السياق التاريخي',
        content: 'قراءة النص الأصلي في سياقه الإصحاحي والتاريخي لمنع التحريف أو الاقتطاع من المعنى المقصود.',
        practicalTip: 'لا تبنِ عظة على آية واحدة معزولة؛ بل طالع الإصحاح كاملاً وشروح الآباء قبل وضع النقاط.',
      },
      {
        title: 'الوحدة 2: استخلاص الفكرة المركزية والهدف الرعوي',
        content: 'تحديد رسالة واحدة واضحة: ماذا أريد أن يفعل المخدوم أو يفهمه بعد سماع هذه الكلمة؟',
        practicalTip: 'العظة التي تحاول قول كل شيء تنتهي بأن لا يتذكر السامع منها أي شيء.',
      },
      {
        title: 'الوحدة 3: لغة العظة والاتضاع في التعليم',
        content: 'الابتعاد عن التوبيخ الفوقي، واعتماد أسلوب المشاركة الأخوية والتوبة المشتركة على مثال الآباء.',
        practicalTip: 'عظ وأنت تشعر بأنك أول المحتاجين للتوبة والغفران أمام نعمة الله.',
      },
    ],
    assessmentQuestion: {
      question: 'ما هي الخطوة الأهم قبل البدء في تقسيم وتفريع نقاط العظة الكتابية؟',
      options: [
        'البحث عن قصص مشوقة ومؤثرة لإثارة العواطف',
        'قراءة النص في سياقه الأصلي وتحديد الفكرة المركزية والهدف الرعوي',
        'تجهيز شرائح العرض والألوان الجذابة',
      ],
      correctIndex: 1,
      explanation: 'فهم النص في سياقه الروحي والتاريخي هو الأساس المتين لعظة أرثوذكسية عميقة وبناءة.',
    },
  },
  {
    id: 2,
    title: 'ورشة مهارات الافتقاد الرعوي والإرشاد',
    instructor: 'لجنة خدمة المكرسين',
    duration: '3 وحدات تدريبية',
    desc: 'الإنصات الإيجابي، احتواء الأزمات، والتمييز بين المشكلات النفسية والحروب الروحية.',
    lessons: [
      {
        title: 'الوحدة 1: فن الإنصات الإيجابي والمحبة الباذلة',
        content: 'إعطاء المخدوم الوقت الكافي للحديث دون مقاطعة أو إصدار أحكام مسبقة متعجلة.',
        practicalTip: 'أكثر ما يحتاجه المتألم في البداية ليس نصائح جاهزة، بل قلباً رحيماً يصغي بصدق.',
      },
      {
        title: 'الوحدة 2: حفظ الأسرار وكرامة المخدوم',
        content: 'الأمانة المطلقة في كتمان ما يدور في جلسات الافتقاد، وصون كرامة كل إنسان.',
        practicalTip: 'أسرار البيوت والنفوس أمانة مقدسة لا يجوز تداولها أبداً حتى بدافع مشاركة الخبرة.',
      },
    ],
    assessmentQuestion: {
      question: 'عند استقبال مخدوم يمر بأزمة حزن شديدة، ما هو التصرف الرعوي الأنسب في بداية اللقاء؟',
      options: [
        'مقاطعته فوراً وإلقاء اللوم على قلة صلاته',
        'الإنصات باهتمام ومحبة واحتواء مشاعره دون إصدار أحكام مسبقة',
        'إخباره بأن مشكلته بسيطة مقارنة بغيره من الناس',
      ],
      correctIndex: 1,
      explanation: 'الإنصات الواعي والمحبة الحانية تمثلان الخطوة الأولى لفتح القلب لاستقبال النعمة الإلهية.',
    },
  },
  {
    id: 3,
    title: 'ورشة مناهج حوارات العلم والإيمان والوراثة',
    instructor: 'معهد الدراسات القبطية والعلوم',
    duration: '4 وحدات تدريبية',
    desc: 'كيفية مخاطبة الشباب المعاصر بالبراهين العلمية والتصميم الخالق في علم الـ DNA والخلية.',
    lessons: [
      {
        title: 'الوحدة 1: لغة الوراثة والتصميم الذكي',
        content: 'دقة تسلسل القواعد النيتروجينية في الـ DNA وكيف تستحيل نشأتها عشوائياً دون عقل مصمم فائق.',
        practicalTip: 'المعلومات المشفرة في الخلية الحية تشبه برمجيات فائقة الدقة لا يمكن أن تتولد بلا مبرمج.',
      },
      {
        title: 'الوحدة 2: لا تعارض بين العلم الحقيقي والوحي الإلهي',
        content: 'العلم يدرس "كيف" تعمل الطبيعة، بينما الوحي يعلن "لماذا" ومن وراء هذا الوجود المعجز.',
        practicalTip: 'حاور الشباب باحترام للعقل وحقائق العلم الرصين مبيناً التوافق الرائع بين الإيمان والعقل.',
      },
    ],
    assessmentQuestion: {
      question: 'كيف نجيب تساؤلات الشباب حول دقة الشفرة الوراثية وتوافقها مع الإيمان بالخالق؟',
      options: [
        'رفض كافة المعطيات العلمية والبيولوجية جملة وتفصيلاً',
        'توضيح أن وجود شفرة معلوماتية رقمية معقدة في الخلية يشير بوضوح لعقل مصمم وخالق عظيم',
        'تجاهل الأسئلة العلمية والتركيز على العواطف فقط',
      ],
      correctIndex: 1,
      explanation: 'الشفرة الوراثية برهان علمي ساطع على التصميم الخالق العليم، ولا تتعارض أبداً مع الإيمان.',
    },
  },
];

const STORAGE_KEY = 'mokarasa_completed_workshops_v1';

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const [completedWorkshops, setCompletedWorkshops] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeWorkshop, setActiveWorkshop] = useState<Workshop | null>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAssessmentResult, setShowAssessmentResult] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<Workshop | null>(null);

  const saveCompleted = (id: number) => {
    setCompletedWorkshops((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleStartWorkshop = (ws: Workshop) => {
    soundManager.playTick();
    setActiveWorkshop(ws);
    setCurrentLessonIdx(0);
    setSelectedAnswer(null);
    setShowAssessmentResult(false);
  };

  const handleAnswerAssessment = (idx: number) => {
    soundManager.playTick();
    setSelectedAnswer(idx);
    setShowAssessmentResult(true);
    if (activeWorkshop && idx === activeWorkshop.assessmentQuestion.correctIndex) {
      soundManager.playCorrect();
      saveCompleted(activeWorkshop.id);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
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

      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-amber-950 text-white p-6 sm:p-8 border border-amber-400/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>برامج التمكين العملي والمهارات الكنسية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🎓 ورش العمل والتدريب الكنسي
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
          ورش تدريبية تفاعلية للمكرسين والخدام تشمل التطبيقات السلوكية ودراسات الحالة واختبارات التحقق وشهادات الإتمام.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WORKSHOPS_DATA.map((ws) => {
          const isDone = completedWorkshops.includes(ws.id);
          return (
            <div
              key={ws.id}
              className={`p-5 rounded-2xl border transition space-y-3 flex flex-col justify-between shadow-md ${
                isDone
                  ? 'bg-stone-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
                  : 'bg-stone-900 border-stone-800 hover:border-amber-500'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-700">
                    {ws.duration}
                  </span>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تمت بنجاح</span>
                    </span>
                  )}
                </div>

                <h3 className="font-spiritual text-base font-bold text-stone-100">
                  {ws.title}
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  بإشراف: {ws.instructor}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {ws.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                <button
                  onClick={() => handleStartWorkshop(ws)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDone
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white shadow-md'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'مراجعة محتوى الورشة' : 'بدء الورشة الآن'}</span>
                </button>

                {isDone && (
                  <button
                    onClick={() => setShowCertificateModal(ws)}
                    className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition cursor-pointer"
                    title="عرض شهادة إتمام الورشة"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE WORKSHOP MODAL / VIEWER */}
      {activeWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-right">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-stone-900 via-indigo-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xl">
                  🎓
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">
                    {activeWorkshop.instructor}
                  </span>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                    {activeWorkshop.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveWorkshop(null)}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Lessons Tabs */}
              <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
                {activeWorkshop.lessons.map((les, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundManager.playTick();
                      setCurrentLessonIdx(idx);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                      currentLessonIdx === idx
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    الوحدة {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => {
                    soundManager.playTick();
                    setCurrentLessonIdx(activeWorkshop.lessons.length);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    currentLessonIdx === activeWorkshop.lessons.length
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-900 text-amber-300 hover:bg-stone-800 border border-amber-600/30'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 inline mr-1" />
                  <span>التحقق ونيل الشهادة</span>
                </button>
              </div>

              {/* Lesson Content View */}
              {currentLessonIdx < activeWorkshop.lessons.length ? (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
                    {activeWorkshop.lessons[currentLessonIdx].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
                    {activeWorkshop.lessons[currentLessonIdx].content}
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>تطبيق عملي للمكرس:</span>
                    </span>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {activeWorkshop.lessons[currentLessonIdx].practicalTip}
                    </p>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => {
                        soundManager.playTick();
                        setCurrentLessonIdx((prev) => prev + 1);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>الانتقال للوحدة التالية</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Assessment View */
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>سؤال التحقق والتأهيل لشهادة الإتمام:</span>
                  </div>

                  <h4 className="font-spiritual text-sm sm:text-base font-bold text-stone-100 leading-relaxed bg-stone-900 p-4 rounded-2xl border border-stone-800">
                    {activeWorkshop.assessmentQuestion.question}
                  </h4>

                  <div className="space-y-2">
                    {activeWorkshop.assessmentQuestion.options.map((opt, oIdx) => {
                      const isCorrect =
                        oIdx === activeWorkshop.assessmentQuestion.correctIndex;
                      const isSelected = selectedAnswer === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleAnswerAssessment(oIdx)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs ${
                            isSelected && showAssessmentResult
                              ? isCorrect
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                                : 'bg-rose-950 border-rose-500 text-rose-200'
                              : 'bg-stone-900 border-stone-800 hover:border-amber-500 text-stone-200'
                          }`}
                        >
                          <span>{opt}</span>
                          {showAssessmentResult && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showAssessmentResult && (
                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                      <p className="text-xs text-stone-300 leading-relaxed">
                        💡 <strong>التوضيح:</strong> {activeWorkshop.assessmentQuestion.explanation}
                      </p>
                      {selectedAnswer === activeWorkshop.assessmentQuestion.correctIndex && (
                        <div className="pt-2 flex justify-between items-center">
                          <span className="text-xs text-emerald-400 font-bold">
                            🎉 مبارك! أتممت الورشة بنجاح واستحققت الشهادة.
                          </span>
                          <button
                            onClick={() => setShowCertificateModal(activeWorkshop)}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer"
                          >
                            عرض شهادة الإتمام
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-center">
          <div className="w-full max-w-lg bg-stone-950 border-4 border-amber-500/70 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative text-stone-100">
            <button
              onClick={() => setShowCertificateModal(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
              🎓
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase">
                بوابة التكريس والعلوم الكنسية «حسب قلب الله»
              </span>
              <h2 className="font-spiritual text-2xl font-bold text-amber-100">
                شهادة إتمام وتأهيل كنسي
              </h2>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              تشهد المنصة بأن المكرس / الخادم المبارك:
              <br />
              <strong className="text-amber-200 text-base font-spiritual">
                {currentUser?.name || 'مشارك مبارك في منصة التكريس'}
              </strong>
              <br />
              قد أتم بنجاح كافة متطلبات ووحدات:
              <br />
              <span className="text-amber-300 font-bold font-spiritual text-sm">
                «{showCertificateModal.title}»
              </span>
              <br />
              بإشراف {showCertificateModal.instructor}.
            </p>

            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800 text-[10px] text-stone-400 flex items-center justify-around font-mono">
              <span>تاريخ الإتمام: {new Date().toLocaleDateString('ar-EG')}</span>
              <span>كود التحقق: CERT-{showCertificateModal.id}X99</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
