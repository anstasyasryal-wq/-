import React, { useState } from 'react';
import { User } from '../types';
import { Sparkles, ChevronLeft, Lightbulb, FileText, Plus, Trash2 } from 'lucide-react';

interface CreativeLabProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

export const CreativeLab: React.FC<CreativeLabProps> = ({ currentUser, onBackToHome }) => {
  const [drafts, setDrafts] = useState([
    {
      title: 'مسودة عظة: البصمة الإلهية في الشفرة الوراثية والخليقة',
      type: 'عظة كتابية',
      date: 'اليوم',
      content: 'مقدمة حول دقة تسلسل الـ DNA وكيف يعكس عظمة يد الصانع الأزلي.',
    },
    {
      title: 'خاطرة تأملية: صمت المخدع في برية مصر',
      type: 'تأمل روحي',
      date: 'أمس',
      content: 'في سكون المغارة لا تسمع إلا همس النعمة، فلتصمت كل أصوات العالم.',
    },
  ]);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setDrafts((prev) => [
      {
        title: newTitle.trim(),
        type: 'مسودة فكرية',
        date: 'الآن',
        content: 'مسودة قيد الكتابة والتوثيق.',
      },
      ...prev,
    ]);
    setNewTitle('');
  };

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

      <div className="rounded-3xl bg-gradient-to-r from-pink-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-pink-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-900/60 border border-pink-600/40 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>مساحة الإنتاج الروحي والتفكير الإبداعي</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          ✨ مختبر الإبداع الروحي والفكري
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مساحة لإعداد وحفظ مسودات العظات، الألحان، الخواطر، ومشاريع الخدمة التكريسية بأمان تام.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="عنوان مسودة عظة أو دراسة جديدة..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مسودة</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((d, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-amber-400">
                  <span className="font-bold">{d.type}</span>
                  <span className="text-stone-400">{d.date}</span>
                </div>
                <h4 className="font-spiritual text-base font-bold text-stone-100">
                  {d.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {d.content}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => setDrafts((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer"
                >
                  حذف المسودة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
