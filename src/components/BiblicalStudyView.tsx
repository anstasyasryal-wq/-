import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { BiblicalTopic } from '../types/spiritual';
import { BIBLICAL_STUDY_TOPICS } from '../data/spiritualPlans';
import { StudyBank } from './StudyBank';
import { Question } from '../types';
import { getStoredQuestions } from '../utils/competitionEngine';
import { useReadingTheme } from '../context/ReadingThemeContext';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Quote,
  Moon,
  Sun,
  Eye,
} from 'lucide-react';

interface BiblicalStudyViewProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const BiblicalStudyView: React.FC<BiblicalStudyViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'topics' | 'questions_bank'>('topics');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(BIBLICAL_STUDY_TOPICS[0].id);

  const {
    isNightMode,
    toggleNightMode,
    getCardClass,
    getHeaderTextClass,
    getBodyTextClass,
    getVerseBoxClass,
    getPatristicBoxClass,
    getFontSizeClass,
  } = useReadingTheme();

  // Stored questions for study bank view
  const allQuestions: Question[] = useMemo(() => getStoredQuestions(), []);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return BIBLICAL_STUDY_TOPICS.filter((topic) => {
      const matchesCat = selectedCategory === 'all' || topic.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.vocationRelevance.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in text-right">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>منصة الدراسة والعلوم الكنسية الموثقة</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight mb-2">
            📜 مدارج الفهم والتعليم الكنسي الآبائي
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            دراسات كتابية ولاهوتية وطقسية رصينة تربط نصوص الكتاب المقدس بأقوال الآباء، مع إمكانية التصفح الكامل لبنك أسئلة العلوم الكنسية والرهبانية.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveSubTab('topics')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'topics'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الدراسات اللاهوتية والكتابية ({BIBLICAL_STUDY_TOPICS.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('questions_bank')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'questions_bank'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>بنك الاستذكار والشروح ({allQuestions.length} سؤالاً)</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 font-bold text-xs sm:text-sm transition flex items-center gap-2 mr-auto cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Biblical & Theological Topics */}
      {activeSubTab === 'topics' && (
        <div className="space-y-6">
          {/* Eye-Comfort Night Reading Mode Quick Banner */}
          <div
            className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300 ${
              isNightMode
                ? 'bg-[#201d19] border-[#443c32] text-amber-100 shadow-md'
                : 'bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-100/50 border-amber-200/80 text-stone-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                  isNightMode
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isNightMode ? '🌙' : '📖'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-spiritual font-bold text-sm sm:text-base">
                    وضع القراءة الليلي للنصوص والدراسات الكنسية
                  </span>
                  {isNightMode && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                      مُفعَّل (ورق مخفف)
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-tight ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  تخفيف إشعاع الشاشة وخلفية الورق وتهدئة تباين النصوص لمنع إجهاد العين أثناء المطالعة المطولة.
                </p>
              </div>
            </div>

            <button
              onClick={toggleNightMode}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer self-end sm:self-auto ${
                isNightMode
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-100'
              }`}
            >
              {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isNightMode ? 'العودة للوضع النهاري' : 'تفعيل القراءة الليلية'}</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div
            className={`rounded-3xl border p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-200 ${
              isNightMode ? 'bg-[#1f1d1a] border-[#38332c]' : 'bg-white border-stone-200'
            }`}
          >
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الدراسات والآباء..."
                className={`w-full pl-4 pr-10 py-2 rounded-xl border outline-none text-xs sm:text-sm ${
                  isNightMode
                    ? 'bg-[#292520] border-[#4a4237] text-stone-100 placeholder-stone-500 focus:border-amber-500'
                    : 'bg-white border-stone-300 text-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-200'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {['all', 'كتاب مقدس', 'عقيدة وقانون الإيمان', 'طقس وليتورجيا', 'تاريخ الكنيسة والآباء'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? isNightMode
                        ? 'bg-amber-950 text-amber-200 border border-amber-700'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                      : isNightMode
                      ? 'bg-[#26221c] text-stone-400 border border-[#3d372e] hover:bg-[#302b23]'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'جميع الفروع' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const isExpanded = expandedTopicId === topic.id;

              return (
                <div
                  key={topic.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isExpanded
                      ? isNightMode
                        ? 'border-amber-700/80 shadow-lg ring-1 ring-amber-900/40'
                        : 'border-amber-400 shadow-md ring-1 ring-amber-100'
                      : isNightMode
                      ? 'border-[#38332c] hover:border-amber-700/50'
                      : 'border-stone-200 hover:border-amber-300'
                  } ${getCardClass()}`}
                >
                  {/* Topic Title Header */}
                  <div
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isNightMode
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {topic.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>قراءة {topic.readingTimeMinutes} دقائق</span>
                        </span>
                      </div>

                      <h3 className={`font-spiritual text-lg sm:text-xl font-bold leading-snug ${getHeaderTextClass()}`}>
                        {topic.title}
                      </h3>
                      <p className={`text-xs font-medium font-sans ${isNightMode ? 'text-amber-400/90' : 'text-amber-900/80'}`}>
                        صلة الدراسة بالخدمة: {topic.vocationRelevance}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <span className={`text-xs font-semibold hidden sm:inline ${isNightMode ? 'text-amber-400' : 'text-amber-800'}`}>
                        {isExpanded ? 'طي الدراسة' : 'قراءة الدراسة'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      className={`px-6 pb-6 pt-2 border-t space-y-5 ${getFontSizeClass()} ${
                        isNightMode ? 'border-[#38332c]' : 'border-stone-100'
                      }`}
                    >
                      {/* Summary */}
                      <div className={`p-4 rounded-2xl border leading-relaxed ${getVerseBoxClass()}`}>
                        <span className="font-bold text-amber-600 block mb-1">
                          ملخص الدراسة اللاهوتية:
                        </span>
                        <p className={`font-sans ${getBodyTextClass()}`}>{topic.summary}</p>
                      </div>

                      {/* Biblical References */}
                      <div className="space-y-2">
                        <h4 className={`font-spiritual font-bold text-sm flex items-center gap-1.5 ${getHeaderTextClass()}`}>
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          <span>الشواهد الكتابية المعتمدة:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {topic.biblicalReferences.map((ref, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border font-spiritual font-bold ${
                                isNightMode
                                  ? 'bg-[#28241e] border-[#3f382d] text-amber-100'
                                  : 'bg-stone-50 border-stone-200 text-stone-800'
                              }`}
                            >
                              {ref}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Patristic Quotes */}
                      <div className="space-y-2">
                        <h4 className={`font-spiritual font-bold text-sm flex items-center gap-1.5 ${getHeaderTextClass()}`}>
                          <Quote className="w-4 h-4 text-indigo-400" />
                          <span>أقوال الآباء والتوثيق الكنسي:</span>
                        </h4>
                        <div className="space-y-3">
                          {topic.patristicQuotes.map((q, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl border space-y-1.5 ${getPatristicBoxClass()}`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-bold font-spiritual text-sm ${isNightMode ? 'text-indigo-200' : 'text-indigo-950'}`}>
                                  {q.fatherName}
                                </span>
                                <span className={`text-[11px] font-sans ${isNightMode ? 'text-indigo-300/80' : 'text-indigo-700'}`}>
                                  {q.source}
                                </span>
                              </div>
                              <p className={`font-spiritual font-bold leading-relaxed ${isNightMode ? 'text-[#f5eedf]' : 'text-stone-800'}`}>
                                {q.quote}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      <div className="space-y-2">
                        <h4 className={`font-spiritual font-bold text-sm flex items-center gap-1.5 ${getHeaderTextClass()}`}>
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>النقاط الجوهرية والتطبيق العملي في الخدمة:</span>
                        </h4>
                        <ul className={`space-y-1.5 font-sans ${getBodyTextClass()}`}>
                          {topic.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Integrated Full Study Bank */}
      {activeSubTab === 'questions_bank' && (
        <StudyBank
          questions={allQuestions}
          onBackToHome={() => setActiveSubTab('topics')}
        />
      )}
    </div>
  );
};
