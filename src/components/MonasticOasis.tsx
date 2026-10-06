import React, { useState, useEffect } from 'react';
import { MONASTIC_VIRTUES, MonasticVirtue } from '../data/monasticVirtues';
import { COPTIC_TERMS, CopticTerm } from '../data/copticDictionary';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  IdCard, 
  Printer, 
  HelpCircle, 
  Award,
  Heart,
  ChevronLeft
} from 'lucide-react';

interface MonasticOasisProps {
  onBackToHome: () => void;
}

export const MonasticOasis: React.FC<MonasticOasisProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'virtues' | 'coptic' | 'badge'>('virtues');

  // Virtues Wheel State
  const [selectedVirtue, setSelectedVirtue] = useState<MonasticVirtue>(MONASTIC_VIRTUES[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [completedVirtuesToday, setCompletedVirtuesToday] = useState<string[]>([]);

  // Coptic Dictionary State
  const [copticSearch, setCopticSearch] = useState('');
  const [copticCategory, setCopticCategory] = useState<string>('all');
  const [quizTerm, setQuizTerm] = useState<CopticTerm | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizSelectedIdx, setQuizSelectedIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Badge Generator State
  const [badgeName, setBadgeName] = useState('تاسوني مارينا');
  const [badgeHouse, setBadgeHouse] = useState('بيت مارمرقس للتكريس - بني سويف');
  const [badgePatron, setBadgePatron] = useState('القديسة فيرينا');
  const [badgeMotto, setBadgeMotto] = useState('«اخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ»');

  // Load completed virtues from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mokarasa_completed_virtues_today');
      if (saved) setCompletedVirtuesToday(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Spin Wheel Action
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundManager.playTick();

    // Pick random virtue
    const randomIndex = Math.floor(Math.random() * MONASTIC_VIRTUES.length);
    const segmentAngle = 360 / MONASTIC_VIRTUES.length;
    // Add multiple rotations (e.g. 5 full rotations = 1800 deg)
    const extraTurns = 1800 + (MONASTIC_VIRTUES.length - randomIndex) * segmentAngle;
    const finalAngle = rotationDegrees + extraTurns;

    setRotationDegrees(finalAngle);

    setTimeout(() => {
      setSelectedVirtue(MONASTIC_VIRTUES[randomIndex]);
      setIsSpinning(false);
      soundManager.playCorrect();
    }, 2800);
  };

  const handleToggleCompleteVirtue = (id: string) => {
    let updated: string[];
    if (completedVirtuesToday.includes(id)) {
      updated = completedVirtuesToday.filter((item) => item !== id);
    } else {
      updated = [...completedVirtuesToday, id];
      soundManager.playVictory();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    setCompletedVirtuesToday(updated);
    try {
      localStorage.setItem('mokarasa_completed_virtues_today', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Coptic Quiz Init
  const startCopticQuizQuestion = () => {
    const randomTarget = COPTIC_TERMS[Math.floor(Math.random() * COPTIC_TERMS.length)];
    setQuizTerm(randomTarget);
    setQuizAnswered(false);
    setQuizSelectedIdx(null);

    // Pick 3 other random meanings
    const otherMeanings = COPTIC_TERMS
      .filter((t) => t.id !== randomTarget.id)
      .map((t) => t.arabicMeaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allChoices = [randomTarget.arabicMeaning, ...otherMeanings].sort(() => 0.5 - Math.random());
    setQuizOptions(allChoices);
  };

  const handleCopticQuizSelect = (idx: number) => {
    if (quizAnswered || !quizTerm) return;
    setQuizSelectedIdx(idx);
    setQuizAnswered(true);

    const isCorrect = quizOptions[idx] === quizTerm.arabicMeaning;
    if (isCorrect) {
      soundManager.playCorrect();
      setQuizScore((prev) => prev + 1);
    } else {
      soundManager.playWrong();
    }
  };

  // Filtered Coptic Terms
  const filteredCopticTerms = COPTIC_TERMS.filter((t) => {
    const matchesCat = copticCategory === 'all' || t.category === copticCategory;
    const matchesSearch =
      copticSearch.trim() === '' ||
      t.coptic.includes(copticSearch) ||
      t.transliteration.includes(copticSearch) ||
      t.arabicMeaning.includes(copticSearch);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 text-amber-100 flex items-center justify-center shadow-md">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900">
                واحة التكريس والفضائل الرهبانية
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                إبداعات وتدريبات روحية ومعجم اللغة القبطية الكنسية وبطاقة المكرسة الشرفية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
          >
            رجوع للرئيسية
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('virtues')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'virtues'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>قرعة فضائل البرية اليومية</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('coptic');
              if (!quizTerm) startCopticQuizQuestion();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'coptic'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المعجم القبطي للتكريس</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badge')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'badge'
                ? 'bg-amber-800 text-amber-50 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <IdCard className="w-4 h-4" />
            <span>بطاقة المكرسة الشرفية</span>
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* TAB 1: VIRTUES WHEEL */}
      {/* ======================================================= */}
      {activeTab === 'virtues' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Wheel Visual Section */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 text-center shadow-sm">
            <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
              عجلة فضائل آباء وأمهات البرية
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              اضغطي لتحديد تدريب الفضيلة الروحية المقترحة ليومكِ
            </p>

            {/* Spinning Wheel Graphic Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
              
              {/* Pointer / Needle at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-800 drop-shadow-md"></div>

              {/* The Rotating Wheel */}
              <div 
                className="w-full h-full rounded-full border-4 border-amber-800/80 shadow-xl overflow-hidden relative transition-transform ease-out"
                style={{ 
                  transform: `rotate(${rotationDegrees}deg)`,
                  transitionDuration: isSpinning ? '2.8s' : '0s'
                }}
              >
                {/* SVG Pie Slices */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" fill="#92400e" />
                  <path d="M50 50 L93.3 25 A50 50 0 0 1 93.3 75 Z" fill="#047857" />
                  <path d="M50 50 L93.3 75 A50 50 0 0 1 50 100 Z" fill="#4338ca" />
                  <path d="M50 50 L50 100 A50 50 0 0 1 6.7 75 Z" fill="#be123c" />
                  <path d="M50 50 L6.7 75 A50 50 0 0 1 6.7 25 Z" fill="#0369a1" />
                  <path d="M50 50 L6.7 25 A50 50 0 0 1 50 0 Z" fill="#0f766e" />
                </svg>

                {/* Center Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-800 shadow-md flex items-center justify-center font-spiritual text-xs font-bold text-amber-950">
                    فضيلة
                  </div>
                </div>
              </div>

            </div>

            {/* Spin Button */}
            <button
              type="button"
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'جاري اختيار الفضيلة...' : 'تدوير قرعة الفضيلة'}</span>
            </button>
          </div>

          {/* Selected Virtue Card Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl border border-amber-300/80 shadow-md p-6 sm:p-8 relative overflow-hidden">
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-amber-100/70 border border-amber-200">
                    {selectedVirtue.avatar}
                  </span>
                  <div>
                    <h2 className="font-spiritual text-2xl font-bold text-stone-900">
                      {selectedVirtue.name}
                    </h2>
                    <p className="text-xs text-stone-500">
                      {selectedVirtue.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCompleteVirtue(selectedVirtue.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    completedVirtuesToday.includes(selectedVirtue.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedVirtuesToday.includes(selectedVirtue.id)
                      ? 'تم الإنجاز اليوم بنعمة ربنا'
                      : 'تعليم كمنجز'}
                  </span>
                </button>
              </div>

              {/* Biblical Anchor */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  الشاهد والآية الإلهية:
                </span>
                <p className="font-spiritual text-lg text-amber-950 font-bold mb-1">
                  {selectedVirtue.biblicalVerse}
                </p>
                <p className="text-xs text-stone-500 font-sans">
                  ({selectedVirtue.verseReference})
                </p>
              </div>

              {/* Patristic Saying */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
                <span className="text-xs font-bold text-stone-700 block mb-1">
                  من بستان الرهبان وحكمة أمهات وآباء البرية:
                </span>
                <p className="font-spiritual text-base text-stone-800 leading-relaxed mb-1">
                  {selectedVirtue.patristicSaying}
                </p>
                <p className="text-[11px] text-stone-400 font-sans">
                  — {selectedVirtue.sayingSource}
                </p>
              </div>

              {/* Practical Exercise */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-4">
                <span className="text-xs font-bold text-emerald-950 block mb-1">
                  التدريب الروحي والعملي ليومكِ:
                </span>
                <p className="font-spiritual text-sm sm:text-base text-emerald-900 leading-relaxed">
                  {selectedVirtue.practicalExercise}
                </p>
              </div>

              {/* Short Prayer */}
              <div className="pt-2 text-center text-xs font-spiritual italic text-stone-600 border-t border-stone-100">
                «{selectedVirtue.shortPrayer}»
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 2: COPTIC LEXICON & MINI QUIZ */}
      {/* ======================================================= */}
      {activeTab === 'coptic' && (
        <div className="space-y-8">
          
          {/* Quick Coptic Flashcard Challenge */}
          {quizTerm && (
            <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-800/60">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-amber-200">
                    تحدي الفطنة القبطية: ما معنى هذه الكلمة الكنسية؟
                  </span>
                </div>
                <span className="text-xs text-amber-300 font-sans">
                  النقاط: {quizScore}
                </span>
              </div>

              <div className="text-center py-4">
                <p className="text-3xl sm:text-5xl font-bold tracking-wider text-amber-200 mb-1">
                  {quizTerm.coptic}
                </p>
                <p className="text-stone-400 text-sm font-spiritual">
                  (نطق: {quizTerm.transliteration})
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto my-4">
                {quizOptions.map((opt, idx) => {
                  let btnStyle = 'border-stone-700 bg-stone-800/80 hover:bg-amber-900/40 text-stone-200';
                  if (quizAnswered) {
                    if (opt === quizTerm.arabicMeaning) {
                      btnStyle = 'border-emerald-500 bg-emerald-900/60 text-emerald-100 font-bold';
                    } else if (quizSelectedIdx === idx) {
                      btnStyle = 'border-rose-500 bg-rose-900/60 text-rose-100 line-through';
                    } else {
                      btnStyle = 'border-stone-800 bg-stone-900 text-stone-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopticQuizSelect(idx)}
                      disabled={quizAnswered}
                      className={`p-3.5 rounded-xl border text-sm font-spiritual font-bold transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={startCopticQuizQuestion}
                    className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold text-xs shadow-sm transition-colors"
                  >
                    الكلمة التالية في التحدي
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search & Categories */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={copticSearch}
                  onChange={(e) => setCopticSearch(e.target.value)}
                  placeholder="ابحث بالكلمة القبطية أو النطق العربي أو المعنى..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <select
                  value={copticCategory}
                  onChange={(e) => setCopticCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white outline-none"
                >
                  <option value="all">جميع التصنيفات</option>
                  <option value="consecration">ألقاب ورتب التكريس</option>
                  <option value="liturgical">الطقوس والليتورجيا</option>
                  <option value="spiritual">اللاهوت والروحيات</option>
                  <option value="titles">الألقاب الكنسية</option>
                </select>
              </div>
            </div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCopticTerms.map((term) => (
                <div
                  key={term.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:border-amber-400 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-2xl font-bold text-amber-950 font-spiritual block">
                        {term.coptic}
                      </span>
                      <span className="text-xs text-stone-500 font-sans">
                        النطق: <strong>{term.transliteration}</strong>
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-spiritual">
                      {term.arabicMeaning}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-2 font-spiritual">
                    {term.usageContext}
                  </p>

                  {term.exampleSentence && (
                    <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 font-spiritual">
                      مثال كنسي: {term.exampleSentence}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 3: CONSECRATION HONORARY BADGE */}
      {/* ======================================================= */}
      {activeTab === 'badge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Badge Inputs Configuration */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
              إعداد بطاقة المكرسة الشرفية
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              أدخلي بياناتكِ لاستخراج وطباعة بطاقة العضوية التكريمية للمسابقة
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم المكرسة / الخادمة
              </label>
              <input
                type="text"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-spiritual"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                بيت التكريس أو الإيبارشية
              </label>
              <input
                type="text"
                value={badgeHouse}
                onChange={(e) => setBadgeHouse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-spiritual"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الشفيعة الروحية
              </label>
              <input
                type="text"
                value={badgePatron}
                onChange={(e) => setBadgePatron(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-spiritual"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الشعار الكتابي المختار
              </label>
              <input
                type="text"
                value={badgeMotto}
                onChange={(e) => setBadgeMotto(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-spiritual"
              />
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors mt-4"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البطاقة الشرفية</span>
            </button>
          </div>

          {/* Badge Preview */}
          <div className="lg:col-span-7 flex justify-center">
            
            <div className="w-full max-w-md bg-gradient-to-b from-[#fdfbf7] to-[#f7f2e7] rounded-3xl border-4 border-amber-800/80 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-200">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-700 text-amber-900 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="font-spiritual text-base font-bold text-amber-950">
                    مسابقة المكرسة المثالية
                  </p>
                  <p className="text-[10px] text-stone-500 font-sans">
                    بطاقة العضوية والمشاركة التكريمية
                  </p>
                </div>
              </div>

              {/* Avatar Emblem */}
              <div className="my-6">
                <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-700 mx-auto flex items-center justify-center shadow-inner text-4xl mb-3">
                  🕊️
                </div>
                <h3 className="font-spiritual text-2xl font-bold text-stone-900">
                  {badgeName || 'الأخت المكرسة'}
                </h3>
                <p className="text-xs text-stone-600 font-spiritual mt-0.5">
                  {badgeHouse || 'بيت التكريس المبارك'}
                </p>
              </div>

              {/* Details table */}
              <div className="space-y-2 text-xs font-spiritual bg-white/70 p-4 rounded-2xl border border-amber-200/80 text-right">
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">الشفيعة:</span>
                  <span className="font-bold text-stone-900">{badgePatron}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">الرتبة:</span>
                  <span className="font-bold text-stone-900">مكرسة باحثة في العلوم الكنسية</span>
                </div>
                <div className="pt-1 text-center font-bold text-amber-900">
                  {badgeMotto}
                </div>
              </div>

              {/* Stamp Seal */}
              <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>معتمد للعام الكنسي الحالي</span>
                <span className="font-bold text-amber-800 font-spiritual">خاتم بيت التكريس</span>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
