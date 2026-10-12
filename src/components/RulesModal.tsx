import React from 'react';
import { X, Award, Zap, Brain, Sparkles, Scale, Trophy, ShieldCheck } from 'lucide-react';
import { useReadingTheme } from '../context/ReadingThemeContext';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const { isNightMode, getCardClass, getBodyTextClass, getHeaderTextClass } = useReadingTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto text-right">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden my-auto transition-colors duration-200 ${
          isNightMode
            ? 'bg-[#1e1b17] border-[#3e372d] text-[#e6decf]'
            : 'bg-white border-amber-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-indigo-800 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20">
              <Award className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-spiritual">📜 ميثاق ومبادئ مسيرة «حَسَبَ قَلْبِ اللهِ»</h2>
              <p className="text-xs text-amber-100 mt-0.5">«كاهن – مكرَّسة – راهب – راهبة» • الدليل الشامل للمراجعة والتقييم الروحي والكنسي</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 overflow-y-auto space-y-6 text-sm ${isNightMode ? 'text-[#d6cebe]' : 'text-slate-700'}`}>
          {/* Section 1 */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isNightMode
                ? 'bg-[#26211a] border-amber-800/60 text-amber-100'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>فلسفة المسيرة ورسالتها الروحية</span>
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              مسيرة «حسب قلب الله» هي منصة كنسية للمراجعة الروحية والنمو الداخلي والتعمق في العلوم الكنسية والآبائية، صُممت خصيصاً للمكرسين والمكرسات في مختلف ميادين خدمتهم (كاهن – مكرَّسة – راهب – راهبة). الهدف ليس إصدار حكم على قداسة الشخص أو مقارنته بالآخرين، بل مساعدة كل مكرس على فحص قلبه الداخلي وأمانته أمام الله، وتحديد نقاط القوة ومجالات النمو العملي في التواضع، المحبة، والخدمة.
            </p>
          </div>

          {/* Section 2: Stages */}
          <div>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isNightMode ? 'text-amber-200' : 'text-slate-900'}`}>
              <Brain className="w-4 h-4 text-amber-500" />
              <span>مراحل المسابقة الخمس + النهائي الكبير</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isNightMode ? 'bg-[#25221d] border-[#3d362b]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-amber-500">🌱 المرحلة الأولى — البداية:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-600'}>20 سؤالاً استكشافياً في الكتاب المقدس، تاريخ الكنيسة، الألحان، والمعلومات العامة.</p>
              </div>
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isNightMode ? 'bg-[#25221d] border-[#3d362b]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-amber-500">🧠 المرحلة الثانية — الاكتشاف:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-600'}>أسئلة فهم وربط: إكمال تسلسل، توصيل، اكتشاف الخطأ، ترتيب الأحداث، والتصرف الأفضل.</p>
              </div>
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isNightMode ? 'bg-[#25221d] border-[#3d362b]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-amber-500">⚡ المرحلة الثالثة — التحدي السريع:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-600'}>سرعة الإجابة تمنحك Bonus نقاط متزايد، وعداد الوقت يحسم الترتيب.</p>
              </div>
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isNightMode ? 'bg-[#25221d] border-[#3d362b]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-amber-500">🎵 المرحلة الرابعة — الحواس:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-600'}>تحدي الذاكرة البصرية (الصور)، تحدي مقاطع الألحان الصوتية، وقوة الملاحظة الدقيقة.</p>
              </div>
              <div
                className={`p-3 rounded-xl border space-y-1 sm:col-span-2 ${
                  isNightMode ? 'bg-[#25221d] border-[#3d362b]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-amber-500">🔥 المرحلة الخامسة — التحدي الكبير:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-600'}>أصعب مرحلة شاملة قبل النهائي تجمع ألغازاً ومواقف وتحديات سرعة ومفاجأة.</p>
              </div>
              <div
                className={`p-3 rounded-xl border space-y-1 sm:col-span-2 ${
                  isNightMode ? 'bg-[#2b241c] border-amber-800/80 text-amber-100' : 'bg-amber-50/50 border-amber-300 text-amber-900'
                }`}
              >
                <span className="font-bold text-amber-400">👑 التقييم الختامي الشامل — حسب قلب الله:</span>
                <p className={isNightMode ? 'text-stone-300' : 'text-slate-700'}>للمشاركين والمشاركات: 5 أبعاد للمراجعة (المعرفة الكتابية، الحكمة والتمييز، اليقظة الروحية، القرارات الرعوية والرهبانية، وروح الخدمة الباذلة) لتحديد جوانب القوة وخطوات النمو الشخصي.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Points & Tie-Breaking */}
          <div>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isNightMode ? 'text-amber-200' : 'text-slate-900'}`}>
              <Scale className="w-4 h-4 text-emerald-500" />
              <span>نظام احتساب النقاط وكسر التعادل العادل</span>
            </h3>
            <ul
              className={`space-y-2 text-xs p-4 rounded-2xl border ${
                isNightMode ? 'bg-[#25221d] border-[#3d362b] text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><strong>نقاط الإجابة + بونص السرعة:</strong> يحصل المشارك/المشاركة على النقاط الأساسية لكل سؤال، بالإضافة إلى بونص إضافي عند الإجابة خلال الثواني الأولى.</span>
              </li>
              <li className="flex items-start gap-2">
                <Scale className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <span><strong>قواعد كسر التعادل الموضوعية:</strong> في حال تساوي النقاط، يتم الترتيب التلقائي وفق: 1) إجمالي النقاط ← 2) عدد الإجابات الصحيحة ← 3) متوسط زمن الإجابة ← 4) نتيجة الجولة الأصعب.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>منع التكرار وحفظ النزاهة:</strong> تسجل كل إجابة مرة واحدة فور اختيارها، وعند انتهاء وقت السؤال ينتقل النظام آلياً للسؤال التالي حفاظاً على عدالة الوقت.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Qualifications */}
          <div>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isNightMode ? 'text-amber-200' : 'text-slate-900'}`}>
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>نظام التصفيات والمراحل التلقائي</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isNightMode ? 'text-stone-300' : 'text-slate-600'}`}>
              يقوم النظام بتحديد المتأهلين للمراحل التالية آلياً وفق معايير دقيقة:
              <br />
              • المرحلة الأولى: يتأهل أفضل 30% من المشاركين والمشاركات.
              <br />
              • المرحلة الثانية: يتأهل أفضل 15%.
              <br />
              • المرحلة الثالثة: يتأهل أفضل 5%.
              <br />
              • المرحلة الرابعة والخامسة: يتأهل أفضل 10 مشاركين لخوض التقييم الختامي وتكريم من هم «حسب قلب الله».
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isNightMode ? 'bg-[#181613] border-[#383229]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
          >
            فهمت الشروط والقواعد
          </button>
        </div>
      </div>
    </div>
  );
};
