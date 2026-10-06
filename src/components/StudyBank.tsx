import React, { useState, useMemo } from 'react';
import { CategoryId, Question } from '../types';
import { CATEGORIES } from '../data/questions';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';

interface StudyBankProps {
  questions: Question[];
  onBackToHome: () => void;
}

export const StudyBank: React.FC<StudyBankProps> = ({
  questions,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealAllAnswers, setRevealAllAnswers] = useState(false);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.reference.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [questions, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900">
                بنك الاستذكار والعلوم الرهبانية
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                مرجع توثيقي شامل للأسئلة والشروح الكنسية للاستعداد الروحي والمعرفي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRevealAllAnswers(!revealAllAnswers)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              {revealAllAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{revealAllAnswers ? 'إخفاء الإجابات' : 'كشف جميع الإجابات'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالنص، الآية، سيرة القديس، أو المرجع الكنسي..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-stone-900 text-sm"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-stone-900 text-sm"
            >
              <option value="all">جميع الفروع والعلوم ({questions.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <p className="font-spiritual text-xl">لا توجد أسئلة مطابقة للبحث الحالي</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id || revealAllAnswers;
            const categoryInfo = CATEGORIES.find((c) => c.id === q.category);

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden transition-all hover:border-amber-300"
              >
                {/* Header item */}
                <div 
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${categoryInfo?.colorScheme.bgBadge || 'bg-stone-100 text-stone-800'}`}>
                        {categoryInfo?.title}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{q.subCategory}</span>
                      {q.isCustom && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          سؤال مضاف يدوياً
                        </span>
                      )}
                    </div>

                    <h3 className="font-spiritual text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
                      {idx + 1}. {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <span className="text-xs text-amber-800 font-semibold hidden sm:inline">
                      {isExpanded ? 'طي التفاصيل' : 'عرض الإجابة والتوثيق'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-stone-100 bg-stone-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-sm font-spiritual flex items-center gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-white border-stone-200 text-stone-600'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center font-sans text-xs shrink-0 font-bold">
                              {optIdx === 0 ? 'أ' : optIdx === 1 ? 'ب' : optIdx === 2 ? 'ج' : 'د'}
                            </span>
                            <span>{opt}</span>
                            {isCorrect && (
                              <span className="text-xs text-emerald-700 font-sans mr-auto">
                                [الإجابة الصحيحة]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-stone-800 mt-3">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        <span>الشرح والتوثيق الروحي والتاريخي:</span>
                      </div>
                      <p className="font-spiritual text-stone-800 text-sm leading-relaxed mb-2">
                        {q.explanation}
                      </p>
                      <p className="text-stone-600 font-sans">
                        <strong>المرجع الكنسي:</strong> {q.reference}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
