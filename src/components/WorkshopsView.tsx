import React from 'react';
import { User } from '../types';
import { ChevronLeft, GraduationCap, CheckCircle2, Play } from 'lucide-react';

interface WorkshopsViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const workshops = [
    {
      id: 1,
      title: 'ورشة إعداد وتوثيق العظة الكتابية',
      instructor: 'قسم الرعاية والتعليم الكنسي',
      duration: '4 وحدات تدريبية',
      desc: 'خطوات استخراج الفكرة الروحية، ربط الشواهد، وتطبيق الآيات على الحياة اليومية للمخدومين.',
    },
    {
      id: 2,
      title: 'ورشة مهارات الافتقاد الرعوي والإرشاد',
      instructor: 'لجنة خدمة المكرسين',
      duration: '3 وحدات تدريبية',
      desc: 'الإنصات الإيجابي، احتواء الأزمات، والتمييز بين المشكلات النفسية والحروب الروحية.',
    },
    {
      id: 3,
      title: 'ورشة مناهج حوارات العلم والإيمان والوراثة',
      instructor: 'معهد الدراسات القبطية والعلوم',
      duration: '4 وحدات تدريبية',
      desc: 'كيفية مخاطبة الشباب المعاصر بالبراهين العلمية والتصميم الخالق في علم الـ DNA والخلية.',
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

      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-amber-950 text-white p-6 sm:p-8 border border-amber-400/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>برامج التمكين العملي والمهارات الكنسية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🎓 ورش العمل والتدريب الكنسي
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl">
          ورش تدريبية تفاعلية للمكرسين والخدام تشمل التطبيقات السلوكية ودراسات الحالة وإيصالات الإتمام.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workshops.map((ws) => (
          <div
            key={ws.id}
            className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500 transition space-y-3 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-700">
                {ws.duration}
              </span>
              <h3 className="font-spiritual text-base font-bold text-stone-100">
                {ws.title}
              </h3>
              <p className="text-[11px] text-amber-400 font-semibold">
                بإشراف: {ws.instructor}
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                {ws.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800">
              <button className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>بدء الورشة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
