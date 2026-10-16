import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Heart, ChevronLeft, CheckCircle2, BookOpen, Flame, Sun, Moon } from 'lucide-react';

interface SpiritualLifeViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenSpiritualGuide: () => void;
  onBackToHome: () => void;
}

export const SpiritualLifeView: React.FC<SpiritualLifeViewProps> = ({
  currentUser,
  onOpenLogin,
  onOpenSpiritualGuide,
  onBackToHome,
}) => {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2]);

  const toggleDay = (day: number) => {
    soundManager.playTick();
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const planDays = [
    {
      day: 1,
      title: 'اليوم الأول: هدوء المخدع وبدء المسيرة',
      reading: 'مزمور 1 + إنجيل متى 5: 1-12',
      meditation: '«طُوبَى لِلأَنْقِيَاءِ الْقَلْبِ، لأَنَّهُمْ يُعَايِنُونَ اللهَ». ابدأ يومك بثلاث دقائق سكون كامل.',
    },
    {
      day: 2,
      title: 'اليوم الثاني: سر الإفراز وحراسة الفكر',
      reading: 'مزمور 23 + رسالة فيلبي 4: 4-9',
      meditation: '«الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ». سلّم مخاوفك ليد الراعي الصالح.',
    },
    {
      day: 3,
      title: 'اليوم الثالث: محبة الله الفياضة والغفران',
      reading: 'مزمور 103 + 1 يوحنا 4: 7-21',
      meditation: '«نَحْنُ نُحِبُّهُ لأَنَّهُ هُوَ أَحَبَّنَا أَوَّلاً». صلّ اليوم من أجل كل من أساء إليك.',
    },
    {
      day: 4,
      title: 'اليوم الرابع: خدمة الوداعة والاتضاع',
      reading: 'مزمور 131 + إنجيل يوحنا 13: 1-17',
      meditation: '«تَعَلَّمُوا مِنِّي، لأَنِّي وَدِيعٌ وَمُتَوَاضِعُ الْقَلْبِ، فَتَجِدُوا رَاحَةً لِنُفُوسِكُمْ».',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-emerald-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          <span>مخدع الصلاة وخطة القراءة اليومية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          ☀️ الحياة الروحية وصلاة المخدع
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          برنامج يومي متجدد للمكرسين والمشاركين لمتابعة قراءة الكتاب المقدس والتأملات الآبائية وحبل صلاة يسوع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planDays.map((item) => {
          const isDone = completedDays.includes(item.day);
          return (
            <div
              key={item.day}
              className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                isDone
                  ? 'bg-stone-900/90 border-emerald-500/60 shadow-md'
                  : 'bg-stone-900/60 border-stone-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    اليوم {item.day}
                  </span>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600">
                      مكتمل بنعمة الله
                    </span>
                  )}
                </div>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-stone-100">
                  {item.title}
                </h3>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-200 font-semibold">
                  📖 القراءة: {item.reading}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {item.meditation}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => toggleDay(item.day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'أتممت القراءة' : 'تحديد كمكتمل'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
