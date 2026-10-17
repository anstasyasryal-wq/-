import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  ChevronLeft,
  Trophy,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Puzzle,
  Brain,
  Check,
  RotateCcw,
} from 'lucide-react';

interface SpiritualGamesHubProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

export const SpiritualGamesHub: React.FC<SpiritualGamesHubProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeGame, setActiveGame] = useState<'riddles' | 'pillars_puzzle' | 'patristic_match'>('riddles');
  const [gameScore, setGameScore] = useState<number>(0);

  // 1. Riddles State
  const riddles = [
    {
      q: 'أنا لستُ ملاكاً ولا نبياً، لكنني ألبستُ ملوكاً وأطعتُ شيوخاً في البرية، اسمي يحمل رتبة التواضع في بستان الرهبان. فمن أكون؟',
      a: 'القمص الراهب المتضع / التلميذ المطيع للشيخ',
      source: 'بستان الرهبان - أقوال الشيوخ',
    },
    {
      q: 'أنا سر بيولوجي مدهش يحمل تتابعاً رقمياً دقيقاً في نواة خلاياك، يشهد بأنك مخلوق لست من عبث بل بتصميم فائق الجمال والهارموني. فمن أكون؟',
      a: 'شريط الحمض النووي (DNA) والشفرة الوراثية',
      source: 'علم الوراثة والتصميم الخالق',
    },
    {
      q: 'كنيسة بلا سقف، ومحراب في الهواء الطلق، وبطرس وبولس لم يبنوا جدراناً بل قلوباً مسبحة في مغارة مصرية. أين أكون؟',
      a: 'قلايات ومغارات وادي النطرون وجبل نتريا',
      source: 'تاريخ الرهبنة القبطية',
    },
    {
      q: 'سفينة بلا مجاديف خاضت بحر العالم دون أن تغرق، لأن قبطانها المصلوب كان يمسك بزمام الدفة. ما هي؟',
      a: 'كنيسة العهد الجديد وفلك النجاة الروحي',
      source: 'تأملات آباء الكنيسة الأولى',
    },
  ];
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  // 2. Pillars Puzzle State
  const CORRECT_PILLARS = [
    { id: 1, text: '1. الطاعة الإنجيلية وتسليم المشيئة' },
    { id: 2, text: '2. التجرد والفقر الاختياري' },
    { id: 3, text: '3. العفة والبتولية ونقاوة القلب' },
    { id: 4, text: '4. الصلاة الدائمة وهذيذ المزامير' },
    { id: 5, text: '5. المحبة الباذلة وخدمة الإخوة' },
    { id: 6, text: '6. التواضع وانسحاق الفكر' },
    { id: 7, text: '7. حمل الصليب والفرح الروحي' },
  ];

  const [shuffledPillars, setShuffledPillars] = useState(() =>
    [...CORRECT_PILLARS].sort(() => Math.random() - 0.5)
  );
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);

  // 3. Patristic Match State
  const MATCH_CARDS = [
    {
      saint: 'القديس أثناسيوس الرسولي',
      quote: '«صار الله إنساناً لكي يصير الإنسان إلهاً بالنعمة»',
    },
    {
      saint: 'القديس أنطونيوس الكبير',
      quote: '«رأيت فخاخ الشرير مبثوثة على الأرض، فقلت: من ينجو منها؟ فقيل لي: المتواضعون»',
    },
    {
      saint: 'القديس يوحنا ذهبي الفم',
      quote: '«الصلاة هي ينبوع البركات، وبلسم الجراح، وميناء السلام الهادئ»',
    },
    {
      saint: 'مار إسحق السرياني',
      quote: '«القلب النقي هو الذي يشتعل بمحبة الخليقة كلها حتى الأعداء»',
    },
  ];
  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Handlers
  const handleRevealAnswer = () => {
    soundManager.playCorrect();
    setShowRiddleAnswer(true);
    setGameScore((s) => s + 25);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleNextRiddle = () => {
    soundManager.playTick();
    setShowRiddleAnswer(false);
    setRiddleIndex((prev) => (prev + 1) % riddles.length);
  };

  const movePillar = (index: number, direction: 'up' | 'down') => {
    soundManager.playTick();
    const newItems = [...shuffledPillars];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setShuffledPillars(newItems);

    // check if solved
    const isNowSolved = newItems.every((item, i) => item.id === i + 1);
    if (isNowSolved) {
      soundManager.playCorrect();
      setPuzzleSolved(true);
      setGameScore((s) => s + 50);
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const resetPuzzle = () => {
    soundManager.playTick();
    setShuffledPillars([...CORRECT_PILLARS].sort(() => Math.random() - 0.5));
    setPuzzleSolved(false);
  };

  const handleMatchSaint = (saintIdx: number) => {
    if (selectedQuoteIdx === null) return;
    soundManager.playTick();
    if (selectedQuoteIdx === saintIdx) {
      soundManager.playCorrect();
      setMatchedPairs((prev) => [...prev, saintIdx]);
      setSelectedQuoteIdx(null);
      setGameScore((s) => s + 30);
      if (matchedPairs.length + 1 === MATCH_CARDS.length) {
        try {
          confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
        } catch {}
      }
    } else {
      soundManager.playWrong();
      setSelectedQuoteIdx(null);
    }
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

      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-purple-600/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/40 text-purple-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>الألعاب الروحية والتحديات الذهنية</span>
          </div>
          <div className="text-xs font-bold text-amber-300 font-mono bg-stone-900/90 px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-inner">
            مجموع النقاط: {gameScore} 🏅
          </div>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🎮 واحة الألعاب الروحية وتحديات البرية
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          ألعاب تفاعلية وبازل ترتيب ركائز التكريس وفوازير بستان الرهبان لتنشيط العقل وتعميق المعرفة بروح الفرح المسيحي.
        </p>

        {/* Game Mode Switcher */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('riddles');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeGame === 'riddles'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>فوازير بستان الرهبان</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('pillars_puzzle');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeGame === 'pillars_puzzle'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>بازل ركائز التكريس الـ ٧</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('patristic_match');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeGame === 'patristic_match'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>مطابقة أقوال الآباء</span>
          </button>
        </div>
      </div>

      {/* GAME 1: RIDDLES */}
      {activeGame === 'riddles' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>فوازير وألغاز الحكمة (اللغز {riddleIndex + 1} من {riddles.length})</span>
            </span>
            <button
              onClick={handleNextRiddle}
              className="text-xs text-stone-300 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>اللغز التالي</span>
            </button>
          </div>

          <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 leading-relaxed">
            {riddles[riddleIndex].q}
          </h3>

          {showRiddleAnswer ? (
            <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>الإجابة النموذجية: {riddles[riddleIndex].a}</span>
              </div>
              <span className="text-[11px] text-amber-300 font-mono block">
                📚 المصدر والمرجع: {riddles[riddleIndex].source}
              </span>
            </div>
          ) : (
            <button
              onClick={handleRevealAnswer}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              كشف الإجابة والحل (+25 نقطة)
            </button>
          )}
        </div>
      )}

      {/* GAME 2: PILLARS PUZZLE */}
      {activeGame === 'pillars_puzzle' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-spiritual text-base font-bold text-amber-100">
                🧩 بازل ترتيب ركائز التكريس الـ ٧ الإنجيلية
              </h3>
              <p className="text-xs text-stone-400">
                استخدم أسهم الرفع والخفض لإعادة ترتيب ركائز المكرس بترتيبها الصحيح من 1 إلى 7.
              </p>
            </div>
            <button
              onClick={resetPuzzle}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة خلط</span>
            </button>
          </div>

          {puzzleSolved && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center justify-between animate-fade-in">
              <span>🎉 رائع جداً! رتبت ركائز التكريس الـ ٧ بالترتيب السليم تماماً (+50 نقطة).</span>
              <button
                onClick={resetPuzzle}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          <div className="space-y-2">
            {shuffledPillars.map((pillar, idx) => {
              const isCorrectPos = pillar.id === idx + 1;
              return (
                <div
                  key={pillar.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isCorrectPos
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                      : 'bg-stone-950 border-stone-800 text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-spiritual font-bold">
                      {pillar.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePillar(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePillar(idx, 'down')}
                      disabled={idx === shuffledPillars.length - 1}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 3: PATRISTIC MATCH */}
      {activeGame === 'patristic_match' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-spiritual text-base font-bold text-amber-100">
              🧠 تحدي مطابقة أقوال الآباء
            </h3>
            <p className="text-xs text-stone-400">
              اختر مقولة روحية أولاً، ثم انقر على اسم الأب القديس صاحب هذه المقولة.
            </p>
          </div>

          {matchedPairs.length === MATCH_CARDS.length && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center justify-between">
              <span>🎉 مبروك! قمت بمطابقة كافة الأقوال والآباء بنجاح تام!</span>
              <button
                onClick={() => setMatchedPairs([])}
                className="px-3 py-1 bg-emerald-800 text-white rounded-lg"
              >
                لعب مجدداً
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quotes Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                1. انقر على المقولة:
              </span>
              {MATCH_CARDS.map((card, idx) => {
                const isMatched = matchedPairs.includes(idx);
                const isSelected = selectedQuoteIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => !isMatched && setSelectedQuoteIdx(idx)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs font-spiritual ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 opacity-60 line-through'
                        : isSelected
                          ? 'bg-amber-600 text-white border-amber-300 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-amber-600/50'
                    }`}
                  >
                    {card.quote}
                  </div>
                );
              })}
            </div>

            {/* Saints Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                2. انقر على القديس المطابق:
              </span>
              {MATCH_CARDS.map((card, sIdx) => {
                const isMatched = matchedPairs.includes(sIdx);
                return (
                  <button
                    key={sIdx}
                    onClick={() => !isMatched && handleMatchSaint(sIdx)}
                    disabled={isMatched || selectedQuoteIdx === null}
                    className={`w-full p-3.5 rounded-2xl border text-right transition cursor-pointer font-bold text-xs flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 opacity-60'
                        : selectedQuoteIdx !== null
                          ? 'bg-stone-900 border-amber-500/60 text-amber-200 hover:bg-amber-950/60'
                          : 'bg-stone-950 border-stone-800 text-stone-400 opacity-50'
                    }`}
                  >
                    <span>{card.saint}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
