import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, Search, ChevronLeft, Layers, Bookmark } from 'lucide-react';

interface BiblicalStudyViewProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const BiblicalStudyView: React.FC<BiblicalStudyViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const studies = [
    {
      title: 'دراسة سفر التكوين: البدايات، الشفرة الجينية، والتصميم الإلهي',
      category: 'العهد القديم والعلوم',
      summary: 'تحليل دقيق لأيام الخليقة، تناغم الطبيعة، والإتقان البيولوجي الذي يسبح بحكمة الخالق الأزلي.',
      patristic: 'القديس باسيليوس الكبير (عظات الهكساميرون - الأيام الستة)',
    },
    {
      title: 'رسالة رومية وإنجيل النعمة والتحرير',
      category: 'رسائل بولس الرسول',
      summary: 'شرح مفهوم التبرير المجاني بدم المسيح، والارتباط بين آدم الأول وآدم الأخير في الجسد والروح.',
      patristic: 'القديس يوحنا ذهبي الفم (شرح رسالة رومية)',
    },
    {
      title: 'لاهوت التجسد والفداء في إنجيل القديس يوحنا',
      category: 'الأناجيل واللاهوت',
      summary: '«فِي الْبَدْءِ كَانَ الْكَلِمَةُ» - دراسة نصية في الأزلية وتجسد كلمة الله لخلاص الإنسان وتجديد طبيعته.',
      patristic: 'القديس أثناسيوس الرسولي والقديس كيرلس الكبير',
    },
    {
      title: 'المزامير وسكون القلب في صلوات الأجبية',
      category: 'الصلوات والأسفار الشعرية',
      summary: 'كيف تتحول كلمات داود النبي إلى نبض شخصي في صلاة الساعة الثالثة، السادسة، وصلوات الغروب والنوم.',
      patristic: 'الأنبا شنودة رئيس المتوحدين',
    },
  ];

  const filtered = studies.filter(
    (s) =>
      s.title.includes(searchTerm) ||
      s.summary.includes(searchTerm) ||
      s.category.includes(searchTerm)
  );

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

      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-800/50 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>منصة الدراسة والعلوم الكنسية والآباء</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📜 مدارج الفهم والتعليم الكنسي الآبائي
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          دراسات كتابية ولاهوتية رصينة تربط نصوص الكتاب المقدس بأقوال الآباء، مع إبراز التوافق الباهر بين العلم المعاصر والوحي الإلهي.
        </p>

        <div className="pt-2">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الدراسات والتفاسير الآبائية..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((st, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-stone-900 border border-amber-600/30 hover:border-amber-400 transition space-y-3 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/40 inline-block">
                {st.category}
              </span>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                {st.title}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {st.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800 text-[11px] text-amber-400 font-semibold">
              📚 المرجع الآبائي: {st.patristic}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
