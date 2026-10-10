import React, { useState } from 'react';
import { X, Sparkles, Download, Maximize2, Minimize2, BookOpen } from 'lucide-react';
import wiseVirginsIcon from '../assets/images/wise_virgins_icon_1791299280946.jpg';

interface WiseVirginsModalProps {
  onClose: () => void;
}

export const WiseVirginsModal: React.FC<WiseVirginsModalProps> = ({ onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className={`relative w-full ${isFullScreen ? 'max-w-7xl' : 'max-w-4xl'} bg-[#fdfbf7] rounded-3xl shadow-2xl border border-amber-400/80 overflow-hidden transition-all duration-300`}>
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-spiritual text-xl font-bold text-amber-200">
              أيقونة العذارى الحكيمات (رمز التكريس والسهر الروحي)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
              title={isFullScreen ? 'تصغير' : 'تكبير'}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <a
              href={wiseVirginsIcon}
              download="icon_wise_virgins_coptic.jpg"
              className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
              title="تنزيل الأيقونة"
            >
              <Download className="w-5 h-5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* The Sacred Icon Image */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border-4 border-amber-800/80 shadow-2xl bg-amber-950/20 group">
                <img
                  src={wiseVirginsIcon}
                  alt="أيقونة قبطية للعذارى الحكيمات"
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-102"
                />

                {/* Golden Corner Accents */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-300 pointer-events-none"></div>
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-300 pointer-events-none"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-300 pointer-events-none"></div>
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-300 pointer-events-none"></div>
              </div>

              <div className="text-center mt-3 text-xs text-stone-500 font-sans">
                أيقونة كنسية قبطية أصيلة: العذارى الحكيمات ومصابيح الزيت المتقدة في انتظار العريس السماوي
              </div>
            </div>

            {/* Spiritual & Liturgical Contemplation */}
            <div className="lg:col-span-5 space-y-4 text-right">
              
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300/80">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  نص إنجيل السهر والتكريس (متى 25: 1 - 4):
                </span>
                <p className="font-spiritual text-base text-amber-950 font-bold leading-relaxed mb-1">
                  «حِينَئِذٍ يُشْبِهُ مَلَكُوتُ السَّمَاوَاتِ عَشْرَ عَذَارَى، أَخَذْنَ مَصَابِيحَهُنَّ وَخَرَجْنَ لِلِقَاءِ الْعَرِيسِ... أَمَّا الْحَكِيمَاتُ فَأَخَذْنَ زَيْتاً فِي آنِيَتِهِنَّ مَعَ مَصَابِيحِهِنَّ»
                </p>
                <p className="text-xs text-stone-600 font-sans">
                  «فَاسْهَرُوا إِذاً لأَنَّكُمْ لاَ تَعْرِفُونَ الْيَوْمَ وَلاَ السَّاعَةَ» (مت 25: 13)
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <h3 className="font-spiritual text-lg font-bold text-stone-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <span>الرمزية واللاهوت الكنسي في الأيقونة:</span>
                </h3>

                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <strong className="text-amber-900 block mb-0.5">1. المصابيح الموقدة بالنور:</strong>
                  <span>ترمز لنور المعمودية، والإيمان الحي الصادق، والاستنارة الروحية المستمرة في مسيرة الإنسان المكرس لله.</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <strong className="text-amber-900 block mb-0.5">2. أوعية الزيت الإضافي:</strong>
                  <span>ترمز لأعمال المحبة والرحمة والصلاة في الخفاء، التي لا يمكن استعارتها من أحد في اللحظات الأخيرة.</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <strong className="text-amber-900 block mb-0.5">3. مجيء العريس بنصف الليل:</strong>
                  <span>يرمز للمجيء الثاني غير المتوقع، وتذكرة يومية لحياة السهر الروحي والاستعداد الدائم لليوم الأخير.</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={wiseVirginsIcon}
                  download="icon_wise_virgins_coptic.jpg"
                  className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الأيقونة بجودة عالية</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
