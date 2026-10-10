import React from 'react';
import { SoloQuizResult } from '../types';
import { Printer, Download, X, Award, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  result: SoloQuizResult;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-amber-50 rounded-2xl shadow-2xl overflow-hidden border border-amber-300">
        
        {/* Action bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">شهادة التقدير والتفوق التكريمية</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
              aria-label="إغلاق الشهادة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div 
          id="printable-certificate"
          className="p-6 sm:p-10 bg-[#fdfbf7] text-stone-900 relative selection:bg-amber-100"
        >
          {/* Ornate Frame Border */}
          <div className="border-4 border-amber-800/80 p-3 rounded-lg relative">
            <div className="border-2 border-dashed border-amber-600/60 p-6 sm:p-10 rounded-sm relative bg-[#fffdf9]/90">
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-amber-800"></div>
              <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-amber-800"></div>
              <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-amber-800"></div>
              <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-amber-800"></div>

              {/* Header with Coptic Cross */}
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-700 text-amber-900 shadow-inner mb-1">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                    <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
                    <circle cx="12" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="6" cy="10" r="1" />
                    <circle cx="18" cy="10" r="1" />
                    <circle cx="12" cy="4" r="1" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                </div>

                <p className="text-xs uppercase tracking-widest text-stone-500 font-sans">
                  منصة المسابقات الكنسية والرهبانية
                </p>
                <h1 className="font-spiritual text-3xl sm:text-4xl font-bold text-amber-950 tracking-wide">
                  شهادة تفوق وتكريم
                </h1>
                <p className="font-spiritual text-base sm:text-lg text-amber-800">
                  «منصة حَسَبَ قَلْبِ اللهِ (كاهن – مكرَّسة – راهب – راهبة)»
                </p>
              </div>

              {/* Biblical Citation */}
              <div className="my-5 py-2.5 px-6 border-y border-amber-200/80 bg-amber-50/60 text-center">
                <p className="font-spiritual text-lg sm:text-xl text-amber-900 italic font-semibold">
                  «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي»
                </p>
                <p className="text-xs text-stone-600 mt-1 font-sans">
                  (سفر أعمال الرسل 13: 22)
                </p>
              </div>

              {/* Recipient Details */}
              <div className="text-center space-y-4 my-8">
                <p className="text-base text-stone-700">
                  يَسرُّ لجنة المراجعة والتقييم الكنسي تكريم المبارك/ة:
                </p>
                
                <h2 className="font-spiritual text-3xl sm:text-4xl font-bold text-stone-900 border-b-2 border-amber-800/40 inline-block px-8 pb-2">
                  {result.participantName || 'المكرس/ة المبارك/ة'}
                </h2>

                <p className="text-stone-600 text-sm font-sans">
                  {result.houseOrDiocese ? `التابعة / التابع لـ: ${result.houseOrDiocese}` : 'لجنة الرعاية والأديرة والتكريس'}
                </p>

                <p className="text-stone-700 text-sm sm:text-base max-w-xl mx-auto leading-relaxed pt-2">
                  تقديراً للاجتهاد والأمانة في مسيرة المراجعة والنمو الروحي والتعمق في نصوص الكتاب المقدس، والعقيدة الكنسية، وسير الآباء والأمهات، والألحان والتراث الكنسي الأصيل.
                </p>
              </div>

              {/* Award Badges and Statistics */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto my-6 text-center">
                <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300">
                  <span className="block text-xs text-amber-800 font-sans">الدرجة النهائية</span>
                  <span className="font-spiritual text-2xl font-bold text-amber-950">
                    {result.totalScore} / {result.maxScore}
                  </span>
                </div>
                
                <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300">
                  <span className="block text-xs text-amber-800 font-sans">النسبة المئوية</span>
                  <span className="font-spiritual text-2xl font-bold text-amber-950">
                    {result.percentage}%
                  </span>
                </div>

                <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300">
                  <span className="block text-xs text-amber-800 font-sans">التقدير العام</span>
                  <span className="font-spiritual text-xl font-bold text-amber-950">
                    {result.grade}
                  </span>
                </div>
              </div>

              {/* Honorary Title Badge */}
              <div className="text-center my-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-50 shadow-md">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-spiritual text-base sm:text-lg font-bold">
                    الوسام الممنوح: {result.titleAwarded}
                  </span>
                </div>
              </div>

              {/* Signatures & Verification */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-amber-200 text-center">
                <div>
                  <p className="font-spiritual text-base font-bold text-stone-800">
                    لجنة المراجعة والعلوم الكنسية
                  </p>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    منصة «حسب قلب الله»
                  </p>
                  <div className="h-10 flex items-center justify-center font-spiritual text-stone-600 italic">
                    مُعتمد ومُجاز
                  </div>
                </div>

                <div>
                  <p className="font-spiritual text-base font-bold text-stone-800">
                    تاريخ الاعتماد
                  </p>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    {new Date(result.date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="h-10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-dashed border-amber-700/60 flex items-center justify-center text-[10px] text-amber-900 font-spiritual font-bold rotate-12">
                      خاتم التميز
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
