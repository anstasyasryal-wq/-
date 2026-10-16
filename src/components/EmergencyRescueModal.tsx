import React from 'react';
import { X, Shield, Heart, Sparkles, PhoneCall } from 'lucide-react';

interface EmergencyRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  situation?: 'distress' | 'boredom' | 'lukewarmness' | 'anger';
}

export const EmergencyRescueModal: React.FC<EmergencyRescueModalProps> = ({
  isOpen,
  onClose,
  situation = 'distress',
}) => {
  if (!isOpen) return null;

  const plans = {
    distress: {
      title: 'خطة التدخل في وقت الضيق والتجربة',
      icon: '🛡️',
      verse: '«اللهُ لَنَا مَلْجَأٌ وَقُوَّةٌ، عَوْنًا فِي الضِّيقَاتِ وُجِدَ شَدِيدًا» (مز 46: 1)',
      steps: [
        'قف بهدوء واصلب ذاتك بعلامة الصليب ثلاثاً.',
        'تلُ صلاة يسوع: «يا ربي يسوع المسيح، ارحمني وأعن ضعفي» 10 مرات متصلة.',
        'اقرأ المزمور الحادي والتسعين (الساكن في ستر العلي).',
        'تذكر أن العاصفة مهما اشتدت، فالمسيح نائم في السفينة وسيقوم ويهدئ الرياح.',
      ],
    },
    lukewarmness: {
      title: 'خطة إيقاد الحرارة ضد الفتور الروحي',
      icon: '🔥',
      verse: '«كُونُوا مُلْتَهِبِينَ بِالرُّوحِ، عَابِدِينَ الرَّبَّ» (رو 12: 11)',
      steps: [
        'غيّر روتين قراءتك؛ اقرأ إصحاحاً من إنجيل يوحنا أو رسالة أفسس بتمهل.',
        'افعل عملاً خفياً بسيطاً من أعمال الرحمة دون أن يعلم به أحد.',
        'قم بمطانيات خفيفة مع طلب روح التوبة وتجديد النعمة.',
      ],
    },
    anger: {
      title: 'التحصين ضد حروب الغضب والاندفاع',
      icon: '🕊️',
      verse: '«الْجَوَابُ اللَّيِّنُ يَصْرِفُ الْغَضَبَ، وَالْكَلاَمُ الْمُوجِعُ يُهَيِّجُ السَّخَطَ» (أم 15: 1)',
      steps: [
        'الصمت الفوري: لا تنطق بأي كلمة لمدة 60 ثانية أثناء اشتداد الانفعال.',
        'تنفس بعمق وصلّ في سرك طلباً للوداعة والاتضاع.',
        'تذكر قول الشيخ الروحاني: «من احتمل كلمة قاسية من أخيه نال إكليلاً لا يفنى».',
      ],
    },
    boredom: {
      title: 'علاج الضجر والملل والكسل',
      icon: '☀️',
      verse: '«قُمْ وَتَقَوَّ، لأَنَّ الرَّبَّ إِلهَكَ مَعَكَ» (يش 1: 9)',
      steps: [
        'ابدأ حركة بدنية بسيطة ورتّب قلايتك أو مخدعك.',
        'استمع إلى لحن كنسي هادئ أو ترتيل مزمور بالدف.',
        'اكتب في مذكرتك الشخصية 3 بركات شكرت الله عليها اليوم.',
      ],
    },
  };

  const currentPlan = plans[situation] || plans.distress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-red-500/60 shadow-2xl text-stone-100 space-y-5">
        <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{currentPlan.icon}</span>
            <h3 className="font-spiritual text-xl font-bold text-amber-100">
              {currentPlan.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-600/40 text-xs sm:text-sm font-spiritual text-amber-200">
          {currentPlan.verse}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 block">خطوات التدخل الفوري:</span>
          <div className="space-y-2">
            {currentPlan.steps.map((st, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex items-center gap-2 text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            شكراً، تم تفعيل الخطة
          </button>
        </div>
      </div>
    </div>
  );
};
