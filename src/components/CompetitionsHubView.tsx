import React, { useState } from 'react';
import { Stage, Question } from '../types';
import { getStoredStages, getStoredQuestions } from '../utils/competitionEngine';
import {
  Trophy,
  Play,
  Brain,
  Zap,
  Sparkles,
  BookOpen,
  Users,
  Eye,
  Volume2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface CompetitionsHubViewProps {
  onStartStage: (stageId: number) => void;
  onBackToHome: () => void;
}

export const CompetitionsHubView: React.FC<CompetitionsHubViewProps> = ({
  onStartStage,
  onBackToHome,
}) => {
  const [activeSection, setActiveSection] = useState<'tests' | 'competitions'>('tests');
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);

  const stages: Stage[] = getStoredStages();
  const allQuestions: Question[] = getStoredQuestions();

  const toggleExpandStage = (stageId: number) => {
    setExpandedStageId(expandedStageId === stageId ? null : stageId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-amber-300/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>الدليل الشامل للاختبارات والمسابقات</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-spiritual text-amber-100">
          🎮 دليل الاختبارات والمسابقات الرسمية
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
          استكشاف كامل لجميع الاختبارات الإلكترونية الخمسة، التحديات الفردية والجماعية، وبنك الأسئلة
        </p>
      </div>

      {/* Navigation Switcher */}
      <div className="flex rounded-2xl bg-slate-100 p-1 max-w-md mx-auto">
        <button
          onClick={() => setActiveSection('tests')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'tests'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-indigo-600" />
          <span>📝 الاختبارات والمراحل (6 اختبارات)</span>
        </button>
        <button
          onClick={() => setActiveSection('competitions')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'competitions'
              ? 'bg-white text-indigo-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>🏆 أنماط المسابقات الكنسية</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: The Tests & Stage Quizzes (الاختبارات) */}
      {/* ========================================================= */}
      {activeSection === 'tests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <span className="font-bold block">💡 دليل اختبارات المراحل:</span>
            <p className="text-slate-700">
              تتكون المسابقة من 5 اختبارات إلكترونية متدرجة الصعوبة + اختبار النهائي الكبير. يمكنكِ استعراض مواصفات كل اختبار، أسئلته المعتمدة، وخوضه مباشرة.
            </p>
          </div>

          <div className="space-y-3">
            {stages.map((stage) => {
              const stageQuestions = allQuestions.filter((q) => q.stageId === stage.id);
              const isExpanded = expandedStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-right transition"
                >
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-2xl flex items-center justify-center flex-shrink-0">
                        {stage.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{stage.title}</h3>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            {stage.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{stage.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onStartStage(stage.id)}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 hover:brightness-105 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>بدء هذا الاختبار الآن</span>
                      </button>

                      <button
                        onClick={() => toggleExpandStage(stage.id)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'إخفاء الأسئلة' : 'عرض الأسئلة'}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block">عدد الأسئلة</span>
                      <span className="font-bold text-slate-800">{stage.totalQuestions} سؤالاً</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">وقت السؤال</span>
                      <span className="font-bold text-slate-800">
                        {stage.timePerQuestionSeconds} ثانية
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">قاعدة التأهل</span>
                      <span className="font-bold text-indigo-900">
                        {stage.qualificationRule.type === 'percentage'
                          ? `أفضل ${stage.qualificationRule.value}%`
                          : `أفضل ${stage.qualificationRule.value} مشاركين`}
                      </span>
                    </div>
                  </div>

                  {/* Expandable question preview */}
                  {isExpanded && (
                    <div className="p-5 bg-amber-50/20 border-t border-amber-200/60 space-y-3 animate-fade-in">
                      <h4 className="text-xs font-bold text-slate-800">
                        نماذج من أسئلة هذا الاختبار ({stageQuestions.length} سؤال متاح):
                      </h4>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {stageQuestions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>السؤال {idx + 1} • {q.category}</span>
                              <span className="text-amber-800 font-bold">{q.points || 10} نقطة</span>
                            </div>
                            <p className="font-bold text-slate-900">{q.question}</p>
                            <p className="text-emerald-700 font-semibold text-[11px]">
                              الإجابة الصحيحة: {q.options[q.correctIndex]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: The Competition Formats (المسابقات) */}
      {/* ========================================================= */}
      {activeSection === 'competitions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-right flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-3">
                  🏆
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                  المسابقة الرسمية الأولى
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  مسابقة المراحل الفردية للمكرسات
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  المسابقة الإلكترونية الرسمية الكبرى المقسمة على 5 مراحل تصاعدية: البداية، الاكتشاف، التحدي السريع، الحواس، والتحدي الكبير وصولاً للتأهل للنهائي.
                </p>
              </div>
              <button
                onClick={() => onStartStage(1)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold text-xs shadow-md hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>المشاركة في المسابقة الفردية</span>
              </button>
            </div>

            {/* Format 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-right flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl mb-3">
                  👥
                </div>
                <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 inline-block mb-1">
                  المنافسة الجماعية
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  مسابقة بيوت التكريس والفرق التكريسية
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  منافسة حية بين فرق بيوت التكريس (بنات مريم، الشماسة فيبي، القديسة دميانة، القديسة فيرينا) بنظام الأدوار، خطف الأسئلة، ولوحة الشرف الحية.
                </p>
              </div>
              <button
                onClick={() => onStartStage(2)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>دخول مسابقة بيوت التكريس</span>
              </button>
            </div>

            {/* Format 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-right flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl mb-3">
                  ⚡
                </div>
                <span className="text-xs font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-1">
                  تحدي البديهة السريع
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  تحدي السرعة وبونص الثواني الخمس
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  اختبار سرعة خاطف: كل سؤال يمنح 10 نقاط أساسية + بونص إضافي لمن تجيب خلال أول 4 ثوانٍ مع مؤقت زمني دقيق يحسم الترتيب.
                </p>
              </div>
              <button
                onClick={() => onStartStage(3)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-indigo-950" />
                <span>خوض تحدي السرعة (المرحلة 3)</span>
              </button>
            </div>

            {/* Format 4 */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 shadow-md space-y-4 text-right flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center text-xl mb-3 shadow-md">
                  👑
                </div>
                <span className="text-xs font-bold text-amber-950 bg-amber-300 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  النهائي الملكي الكبير
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  المرحلة الختامية: «حَسَبَ قَلْبِ اللهِ»
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  جولة التقييم الختامي لأفضل المتأهلين في 5 محاور للمراجعة والنمو الروحي (المعرفة، الحكمة، السرعة، الاختيار، المفاجأة) وتكريم المراكز الأولى والأوسمة الكنسية.
                </p>
              </div>
              <button
                onClick={() => onStartStage(6)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-indigo-950 font-black text-xs shadow-md hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4 fill-indigo-950" />
                <span>👑 خوض التقييم الختامي وحفل التكريم</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة إلى الشاشة الرئيسية</span>
        </button>
      </div>
    </div>
  );
};
