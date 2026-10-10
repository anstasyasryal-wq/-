import React, { useState, useEffect, useMemo } from 'react';
import { SPIRITUAL_VERSES, SpiritualVerse } from '../data/spiritualVerses';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  Heart,
  Share2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const DailySpiritualVerse: React.FC = () => {
  // Deterministic daily index based on current date
  const getDayOfYearIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % SPIRITUAL_VERSES.length;
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(getDayOfYearIndex);
  const [copied, setCopied] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mokarasa_favorite_verses');
      if (stored) {
        setBookmarkedIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredVerses = useMemo(() => {
    if (activeCategory === 'all') return SPIRITUAL_VERSES;
    return SPIRITUAL_VERSES.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  // Current active verse
  const currentVerse = useMemo(() => {
    if (filteredVerses.length === 0) return SPIRITUAL_VERSES[0];
    return filteredVerses[currentIndex % filteredVerses.length];
  }, [filteredVerses, currentIndex]);

  const isBookmarked = bookmarkedIds.includes(currentVerse.id);

  // Next random or cyclic verse
  const handleNextVerse = () => {
    setIsRotating(true);
    soundManager.playTick();
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredVerses.length);
      setIsRotating(false);
    }, 200);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const textToCopy = `${currentVerse.text}\n— ${currentVerse.reference}\nتأمل: ${currentVerse.meditation}\n[من منصة «حَسَبَ قَلْبِ اللهِ» (كاهن – مكرَّسة – راهب – راهبة)]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      soundManager.playTick();
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback
    });
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarkedIds.filter((id) => id !== currentVerse.id);
    } else {
      updated = [...bookmarkedIds, currentVerse.id];
      soundManager.playTick();
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('mokarasa_favorite_verses', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#fffdf9] via-[#fbf7ee] to-[#f6efe1] border border-amber-300/80 shadow-md p-6 sm:p-9 overflow-hidden">
      
      {/* Decorative subtle background watermark cross */}
      <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 24 24" className="w-64 h-64 fill-amber-900">
          <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
          <circle cx="12" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="10" r="1" />
          <circle cx="18" cy="10" r="1" />
          <circle cx="12" cy="4" r="1" />
          <circle cx="12" cy="18" r="1" />
        </svg>
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        
        {/* Title & Today's Tag */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/90 text-amber-900 border border-amber-300 flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-spiritual text-2xl font-bold text-stone-900">
                آية وتأمل اليوم للمكرسة
              </h3>
            </div>
            {/* Clean unboxed metadata with typographic separator */}
            <div className="flex items-center gap-2 text-xs text-stone-500 font-sans mt-0.5">
              <span>{currentVerse.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{currentVerse.theme}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`p-2.5 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
            }`}
            title={isBookmarked ? 'إزالة من الآيات المفضلة' : 'حفظ الآية في التأملات المفضلة'}
            aria-label="حفظ في المفضلة"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-700" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-2xs"
            title="نسخ الآية والتأمل"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>نسخ</span>
              </>
            )}
          </button>

          {/* Refresh / Next Verse Button */}
          <button
            type="button"
            onClick={handleNextVerse}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-bold transition-all shadow-xs"
            title="عرض آية أو قول أبائي آخر للتأمل"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>آية أخرى</span>
          </button>
        </div>

      </div>

      {/* Category Filter Tabs (Segmented control buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/50 rounded-xl mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => { setActiveCategory('all'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          جميع الآيات والأقوال
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory('consecration'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'consecration'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          البتولية والتكريس
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory('monastic_wisdom'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'monastic_wisdom'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          أمهات البرية
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory('psalms_prayer'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'psalms_prayer'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          مزامير وصلاة قلبية
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory('gospel'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeCategory === 'gospel'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          إنجيل القداسة
        </button>
      </div>

      {/* Main Spiritual Verse Quote Card */}
      <div className="relative border-r-4 border-amber-700 bg-white/80 rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200/80 mb-5">
        
        {/* Quotation text */}
        <p className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-950 leading-relaxed sm:leading-loose mb-4">
          {currentVerse.text}
        </p>

        {/* Scriptural / Patristic Reference */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <p className="font-spiritual text-sm sm:text-base font-bold text-amber-800">
            — {currentVerse.reference}
          </p>

          <span className="text-xs text-stone-400 font-sans">
            {currentIndex + 1} من {filteredVerses.length}
          </span>
        </div>

      </div>

      {/* Meditation Guidance for the Consecrated Sister */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/60 border border-amber-300/70 text-xs sm:text-sm text-stone-800 flex items-start gap-3.5">
        <div className="p-1.5 rounded-lg bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-amber-800" />
        </div>
        <div className="space-y-1">
          <span className="font-bold text-amber-950 block text-xs">
            تأمل وإرشاد روحي ليومكِ:
          </span>
          <p className="font-spiritual text-stone-800 text-sm sm:text-base leading-relaxed">
            {currentVerse.meditation}
          </p>
        </div>
      </div>

    </div>
  );
};
