import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, Search, ChevronLeft, Bookmark, CheckCircle2, Cloud, Sparkles } from 'lucide-react';

interface LibraryViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
  onOpenIconGallery?: () => void;
  onOpenSaintsGallery?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
  onOpenIconGallery,
  onOpenSaintsGallery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const books = [
    {
      title: 'تجسد الكلمة (De Incarnatione)',
      author: 'القديس أثناسيوس الرسولي',
      category: 'اللاهوت العقيدي',
      pages: 180,
      description: 'المرجع الآبائي الأول عالمياً في شرح علة تجسد الله وفداء البشرية وتجديد الخلقة.',
    },
    {
      title: 'بستان الرهبان وأقوال شيوخ البرية',
      author: 'آباء براري مصر وشيهيت',
      category: 'التراث الرهباني والنسكي',
      pages: 340,
      description: 'حكم ودروس عملية في الاتضاع والصمت والوداعة ومحاربة الأفكار من برية مصر العريقة.',
    },
    {
      title: 'الرسائل الفصحية',
      author: 'البابا أثناسيوس الرسولي',
      category: 'التاريخ الكنسي والرسائل',
      pages: 210,
      description: 'تحديد أسفار العهد الجديد وتوجيهات الصوم الكبير والفصح المجيد عبر الأجيال.',
    },
    {
      title: 'الخلق والتصميم الإلهي في ميزان العلم',
      author: 'دراسات كنسية وأكاديمية موثقة',
      category: 'العلم والإيمان والوراثة',
      pages: 290,
      description: 'بحث رصين حول علم الجينات، البصمة الوراثية، والتوافق الباهر بين العلم المعاصر والوحي الإلهي.',
    },
  ];

  const filtered = books.filter(
    (b) =>
      b.title.includes(searchTerm) ||
      b.author.includes(searchTerm) ||
      b.description.includes(searchTerm)
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
          <span>المستودع المعرفي والوثائقي للمكرسين</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📚 مكتبة الكتب والمراجع والآباء
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مكتبة رقمية شاملة لكتب التراث الكنسي الكلاسيكي، أبحاث الوراثة والعلوم، ومتابعة تقدم القراءة.
        </p>

        <div className="pt-2">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالعنوان أو الكاتب أو التصنيف..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          </div>
        </div>
      </div>

      {/* Saints Gallery Interactive Banner (East & West) */}
      {onOpenSaintsGallery && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📜</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                سير الآباء والقديسين (آباء الشرق والغرب)
              </h4>
              <p className="text-xs text-stone-300">
                مرجع شامل يضم سير وتراث وعِبر عمالقة الإيمان في الكنيسة الجامعة شرقاً وغرباً.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSaintsGallery}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>استعرض سير الآباء</span>
          </button>
        </div>
      )}

      {/* Icon Gallery Interactive Banner */}
      {onOpenIconGallery && (
        <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border border-amber-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🖼️</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                معرض الأيقونات الكنسية التفاعلي والشرح الروحي
              </h4>
              <p className="text-xs text-stone-300">
                تأمل في دلالات الأيقونات القبطية والتقليدية والعمق اللاهوتي والتاريخي لكل أيقونة.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenIconGallery}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>استعرض معرض الأيقونات</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((b, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-stone-900 border border-amber-600/30 hover:border-amber-400 transition space-y-3 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/40 inline-block">
                {b.category}
              </span>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                {b.title}
              </h3>
              <p className="text-xs text-amber-300/80 font-semibold">
                بقلم: {b.author} • {b.pages} صفحة
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>قراءة إلكترونية متاحة</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
