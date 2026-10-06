import React, { useState } from 'react';
import { CategoryId, DifficultyLevel, Question } from '../types';
import { CATEGORIES } from '../data/questions';
import { X, PlusCircle, Download, Upload, Check } from 'lucide-react';

interface CustomQuestionModalProps {
  onClose: () => void;
  onSaveQuestion: (question: Omit<Question, 'id' | 'isCustom'>) => void;
  allQuestions: Question[];
  onImportQuestions: (imported: Question[]) => void;
}

export const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({
  onClose,
  onSaveQuestion,
  allQuestions,
  onImportQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'import-export'>('create');
  
  // Form fields
  const [category, setCategory] = useState<CategoryId>('religious');
  const [subCategory, setSubCategory] = useState('الكتاب المقدس والطقس');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [reference, setReference] = useState('');
  const [hint, setHint] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setErrorMsg('يرجى كتابة نص السؤال');
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setErrorMsg('يرجى ملء جميع الخيارات الأربعة');
      return;
    }
    if (!explanation.trim()) {
      setErrorMsg('يرجى كتابة الشرح التوثيقي للإجابة');
      return;
    }

    setErrorMsg('');
    onSaveQuestion({
      category,
      subCategory: subCategory.trim() || 'عام',
      difficulty,
      question: questionText.trim(),
      options: [options[0].trim(), options[1].trim(), options[2].trim(), options[3].trim()],
      correctIndex,
      explanation: explanation.trim(),
      reference: reference.trim() || 'التراث الكنسي وبستان الرهبان',
      hint: hint.trim() || 'ابحث في النصوص الكنسية ذات الصلة',
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mokarasa_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportQuestions(parsed);
          alert(`تم استيراد ${parsed.length} سؤال بنجاح!`);
          onClose();
        } else {
          alert('الملف لا يحتوي على صيغة أسئلة صحيحة.');
        }
      } catch {
        alert('حدث خطأ أثناء قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-spiritual text-xl font-bold">إدارة بنك الأسئلة للمسابقة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-sm">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 font-semibold text-center transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            إضافة سؤال جديد
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={`flex-1 py-3 font-semibold text-center transition-colors ${
              activeTab === 'import-export'
                ? 'bg-white text-amber-900 border-b-2 border-amber-800'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            تصدير واستيراد الأسئلة (JSON)
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ السؤال وإدراجه في بنك المسابقة بنجاح!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الفرع العلمي</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المجال الفرعي</label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="مثال: بستان الرهبان / لغة قبطية"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">درجة الصعوبة</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="easy">ميسر</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">عميق وخبير</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نص السؤال *</label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="اكتب صيغة السؤال الكنسي أو الرهباني هنا..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-spiritual outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الخيارات الأربعة (حدد الإجابة الصحيحة عبر النقطة) *
                </label>
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={correctIndex === idx}
                        onChange={() => setCorrectIndex(idx)}
                        className="w-4 h-4 text-amber-700 focus:ring-amber-500"
                        title="تحديد كإجابة صحيحة"
                      />
                      <span className="w-5 text-xs font-bold text-stone-500 font-sans">
                        {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...options] as [string, string, string, string];
                          updated[idx] = e.target.value;
                          setOptions(updated);
                        }}
                        placeholder={`الخيار ${idx + 1} ${correctIndex === idx ? '(الإجابة الصحيحة)' : ''}`}
                        className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                          correctIndex === idx
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-stone-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الشرح والتوثيق *</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="الشرح اللاهوتي أو التاريخي الذي يظهر للمتسابق بعد الإجابة..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المرجع الكنسي أو الآية</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="مثال: رسالة رومية 12 / بستان الرهبان ص 45"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">إشارة استرشادية (Hint)</label>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="تلميح يظهر عند استخدام وسيلة المساعدة"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  حفظ السؤال وإضافته للمسابقات
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200">
                <Download className="w-8 h-8 text-amber-800 mx-auto mb-2" />
                <h3 className="font-spiritual text-lg font-bold text-stone-900 mb-1">
                  تصدير بنك الأسئلة بالكامل
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  تنزيل ملف بصيغة JSON يحتوي على جميع الأسئلة الحالية ({allQuestions.length} سؤال) لمشاركتها مع إيبارشية أخرى أو الاحتفاظ بنسخة احتياطية.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  تنزيل ملف الأسئلة الآن
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <Upload className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <h3 className="font-spiritual text-lg font-bold text-stone-900 mb-1">
                  استيراد أسئلة من ملف JSON
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  إضافة مجموعة أسئلة جديدة أعدتها لجنة المسابقات الكنسية عبر رفع ملف JSON.
                </p>
                <label className="inline-block px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold shadow-sm cursor-pointer">
                  اختر ملف الأسئلة للرفع
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
