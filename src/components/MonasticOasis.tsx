import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Compass, ChevronLeft, Sparkles, RotateCw, Flame, Check } from 'lucide-react';

interface MonasticOasisProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

export const MonasticOasis: React.FC<MonasticOasisProps> = ({ currentUser, onBackToHome }) => {
  const [selectedVirtue, setSelectedVirtue] = useState({
    title: 'فضيلة الصمت والهدوء المقدس (Hesychia)',
    quote: '«صمت اللسان يولد هدوء القلب، وفي سكون القلب ينطق روح الله».',
    saint: 'القديس أرسانيوس معلم أولاد الملوك',
    practice: 'تدريب اليوم: خصص 5 دقائق صمت تام دون تصفح أي جهاز أو كلام، وركّز فكرك في الصلاة.',
  });

  const virtues = [
    {
      title: 'فضيلة الصمت والهدوء المقدس (Hesychia)',
      quote: '«صمت اللسان يولد هدوء القلب، وفي سكون القلب ينطق روح الله».',
      saint: 'القديس أرسانيوس معلم أولاد الملوك',
      practice: 'تدريب اليوم: خصص 5 دقائق صمت تام دون تصفح أي جهاز أو كلام، وركّز فكرك في الصلاة.',
    },
    {
      title: 'فضيلة الاتضاع وانسحاق القلب',
      quote: '«رأيت فخاخ الشرير مبثوثة على الأرض كلها، فقلت متنهداً: من ينجو منها؟ فسمعت صوتاً يقول: المتواضعون».',
      saint: 'القديس أنطونيوس الكبير',
      practice: 'تدريب اليوم: بادر بطلب السماح أو تقديم كلمة شكر رقيقة لشخص اختلفت معه.',
    },
    {
      title: 'فضيلة الإفراز والتمييز الروحي (Diakrisis)',
      quote: '«الإفراز هو عين النفس وسراجها، به يُميز الراهب بين صوت النعمة وخداع العدو».',
      saint: 'القديس الأنبا باخوميوس أب الشركة',
      practice: 'تدريب اليوم: استشر مرشدك الروحي قبل اتخاذ أي قرار هام.',
    },
    {
      title: 'فضيلة الصلاة الدائمة بمحبة',
      quote: '«حين تذكر اسم يسوع القدوس في قلبك، تهرب الشياطين وتفيض التعزيات».',
      saint: 'القديس مقاريوس الكبير',
      practice: 'تدريب اليوم: ردد صلاة يسوع 33 مرة في هدوء قبل النوم.',
    },
  ];

  const handlePickRandom = () => {
    soundManager.playTick();
    const rand = virtues[Math.floor(Math.random() * virtues.length)];
    setSelectedVirtue(rand);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>واحة السكون والفضائل الرهبانية النسيكية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🕯️ واحة السكون والتكريس الرهباني
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          أقوال شيوخ برية شيهيت ومصر وتداريب الفضائل النسيكية اليومية لتجديد حرارة القلب.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/60 shadow-xl space-y-6 text-right">
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>تدريب الفضيلة النسيكية لليوم:</span>
          </span>
          <button
            onClick={handlePickRandom}
            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>تدريب آخر</span>
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
            {selectedVirtue.title}
          </h2>
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/30 text-amber-200 font-spiritual text-base sm:text-lg leading-relaxed italic">
            {selectedVirtue.quote}
          </div>
          <span className="text-xs font-semibold text-amber-400 block font-spiritual">
            — {selectedVirtue.saint}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-600/40 space-y-1.5 text-xs">
          <span className="font-bold text-emerald-400 block">💡 التدريب العملي:</span>
          <p className="text-stone-200 leading-relaxed">{selectedVirtue.practice}</p>
        </div>
      </div>
    </div>
  );
};
