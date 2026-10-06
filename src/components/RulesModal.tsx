import React from 'react';
import { X, Award, Zap, Brain, Sparkles, Scale, Trophy, ShieldCheck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-amber-200 overflow-hidden my-auto text-right">
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
              <h2 className="text-xl font-bold font-spiritual">📜 ميثاق وقواعد مسابقة «المكرَّسة المثالية»</h2>
              <p className="text-xs text-amber-100 mt-0.5">الدليل الشامل للتقييم، النقاط، والمراحل والتصفيات</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h3 className="font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>فلسفة المسابقة ورسالتها</span>
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              مسابقة «المكرَّسة المثالية» هي منصة إلكترونية كنسية راقية ومبهجة، صُممت خصيصاً لأخواتنا المكرسات والخادمات المتفرغات. تهدف المنصة إلى الجمع بين العمق الروحي والكتابي، والذكاء التحليلي وسرعة البديهة، دون أن تكون مجرد امتحان مدرسي نمطي.
            </p>
          </div>

          {/* Section 2: Stages */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-700" />
              <span>مراحل المسابقة الخمس + النهائي الكبير</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-indigo-900">🌱 المرحلة الأولى — البداية:</span>
                <p className="text-slate-600">20 سؤالاً استكشافياً في الكتاب المقدس، تاريخ الكنيسة، الألحان، والمعلومات العامة.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-indigo-900">🧠 المرحلة الثانية — الاكتشاف:</span>
                <p className="text-slate-600">أسئلة فهم وربط: إكمال تسلسل، توصيل، اكتشاف الخطأ، ترتيب الأحداث، والتصرف الأفضل.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-indigo-900">⚡ المرحلة الثالثة — التحدي السريع:</span>
                <p className="text-slate-600">سرعة الإجابة تمنحك Bonus نقاط متزايد، وعداد الوقت يحسم الترتيب.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-indigo-900">🎵 المرحلة الرابعة — الحواس:</span>
                <p className="text-slate-600">تحدي الذاكرة البصرية (الصور)، تحدي مقاطع الألحان الصوتية، وقوة الملاحظة الدقيقة.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1 sm:col-span-2">
                <span className="font-bold text-indigo-900">🔥 المرحلة الخامسة — التحدي الكبير:</span>
                <p className="text-slate-600">أصعب مرحلة شاملة قبل النهائي تجمع ألغازاً ومواقف وتحديات سرعة ومفاجأة.</p>
              </div>
              <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/50 space-y-1 sm:col-span-2">
                <span className="font-bold text-amber-900">👑 النهائي الكبير — المكرَّسة المثالية:</span>
                <p className="text-slate-700">لأفضل المتأهلات فقط: 5 تحديات (المعرفة، الذكاء، السرعة، الاختيار، المفاجأة) لتتويج المراكز الأولى والجوائز المتخصصة.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Points & Tie-Breaking */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span>نظام احتساب النقاط وكسر التعادل العادل</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>نقاط الإجابة + بونص السرعة:</strong> تحصل المتسابقة على النقاط الأساسية لكل سؤال، بالإضافة إلى بونص إضافي إذا أجابت خلال الثواني الأولى.</span>
              </li>
              <li className="flex items-start gap-2">
                <Scale className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span><strong>قواعد كسر التعادل الصارمة (دون قرعة):</strong> في حال تساوي النقاط، يتم الترتيب التلقائي وفق: 1) إجمالي النقاط ← 2) عدد الإجابات الصحيحة ← 3) متوسط زمن الإجابة (الأسرع يتقدم) ← 4) نتيجة الجولة الأصعب.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>منع التكرار وحفظ النزاهة:</strong> تسجل كل إجابة مرة واحدة فور اختيارها، وعند انتهاء وقت السؤال ينتقل النظام آلياً للسؤال التالي حفاظاً على عدالة الوقت.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Qualifications */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>نظام التصفيات الإلكتروني والتأهل التلقائي</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              يقوم النظام الإلكتروني بتحديد المتأهلات وفرز المراكز آلياً دون تدخل يدوي:
              <br />
              • المرحلة الأولى: يتأهل أفضل 30% من المشاركات.
              <br />
              • المرحلة الثانية: يتأهل أفضل 15%.
              <br />
              • المرحلة الثالثة: يتأهل أفضل 5%.
              <br />
              • المرحلة الرابعة والخامسة: يتأهل أفضل 10 متسابقات لخوض النهائي الكبير وتتويج «المكرسة المثالية».
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-900 text-white font-bold text-xs hover:bg-indigo-800 transition cursor-pointer"
          >
            فهمت الشروط والقواعد
          </button>
        </div>
      </div>
    </div>
  );
};
