import React from 'react';
import { X, Sparkles, Heart, Compass, BookOpen } from 'lucide-react';

interface SpiritualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpiritualGuideModal: React.FC<SpiritualGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/70 shadow-2xl text-stone-100 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕊️</span>
            <h3 className="font-spiritual text-xl font-bold text-amber-100">
              دليل المرشد الروحي والتوجيه
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <p className="text-amber-200 font-spiritual text-base">
            «أَيُّهَا الإِخْوَةُ، إِنِ انْسَبَقَ إِنْسَانٌ فَأُخِذَ فِي زَلَّةٍ مَّا، فَأَصْلِحُوا أَنْتُمُ الرُّوحَانِيِّينَ مِثْلَ هذَا بِرُوحِ الْودَاعَةِ»
          </p>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <h4 className="font-bold text-amber-300">🌿 معالم الطريق للمكرس والخدام:</h4>
            <ul className="space-y-1.5 list-disc list-inside text-stone-300">
              <li>حراسة سكون الفكر قبل بدء أي عمل أو اجتماع روحي.</li>
              <li>الجمع بين ثقافة العقل المعاصرة وعمق الإيمان الآبائي المسلّم.</li>
              <li>ممارسة صلاة يسوع الدائمة في هدوء المخدع الداخلي.</li>
              <li>طلب المشورة والإفراز الروحي في كل خطوة ومرحلة.</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
