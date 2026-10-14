import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  HelpCircle,
  Flame,
  Star,
  Award,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpiritualGamesHubProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

interface VirtueMatchPair {
  id: string;
  father: string;
  virtue: string;
  clue: string;
}

const VIRTUE_PAIRS: VirtueMatchPair[] = [
  {
    id: 'v-1',
    father: 'الأنبا أنطونيوس الكبير',
    virtue: 'حراسة الفكر والتمييز',
    clue: 'رأى فخاخ الشياطين تملأ الأرض كلها فقال: "من يمكنه النجاة منها؟ فجاءه الصوت: المتواضعون".',
  },
  {
    id: 'v-2',
    father: 'مار إسحق السريان',
    virtue: 'التواضع وانسحاق القلب',
    clue: '«من عرف ضعفه فقد بلغ كمال التواضع.. والقلب المنكسر لا يرتفع عليه عدو».',
  },
  {
    id: 'v-3',
    father: 'الأم سارة الراهبة',
    virtue: 'حفظ اللسان واليقظة',
    clue: 'قالت: "إن وضعت رجلي في السلم لكي أصعد إلى السماء، أفكر في دينونتي لئلا أسقط".',
  },
  {
    id: 'v-4',
    father: 'الأنبا باخوميوس أب الشركة',
    virtue: 'المحبة الأخوية وخدمة الجماعة',
    clue: 'مؤسس رهبنة الشركة الملائكية الذي كان يخدم المرضى والمتعبين بصمت وفرح.',
  },
  {
    id: 'v-5',
    father: 'القديس الأنبا بيشوي',
    virtue: 'المحبة الفائقة وإكرام الغرباء',
    clue: 'الملقب بالرجل الكامل حبيب مخلصنا الصالح، غسل قدمي الرب يسوع في شخص الشيخ الغريب.',
  },
  {
    id: 'v-6',
    father: 'القديس الأنبا بولا أول السياح',
    virtue: 'السكون والوحدة والصلاة الخفية',
    clue: 'كوكب البرية الذي عاش في المغارة نحو ثمانين سنة في صلاة وتسبيح متصلين بالروح.',
  },
];

interface RiddleQuestion {
  id: string;
  riddle: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const RIDDLES: RiddleQuestion[] = [
  {
    id: 'r-1',
    riddle: 'ما هو المزمور الذي يُتلى في كل صلاة أجبية في جميع الساعات للتذكير بالتوبة والرحمة؟',
    options: ['مزمور 23 (الراعي لي)', 'مزمور 51 (ارحمني يا الله)', 'مزمور 91 (الساكن في ستر العلي)', 'مزمور 150 (سبحوا الله في قديسيه)'],
    correctIndex: 1,
    explanation: 'مزمور 51 (ارحمني يا الله كرحمتك) هو مزمور التوبة الأبرز في صلوات الأجبية والتسبيحة.',
  },
  {
    id: 'r-2',
    riddle: 'من هو الأب الذي يُلقب بـ «كوكب البرية» وأول من أسس نظام الرهبنة الفردية؟',
    options: ['الأنبا بولا أول السياح', 'الأنبا أنطونيوس', 'الأنبا شنوده رئيس المتوحدين', 'القديس أثناسيوس الرسولي'],
    correctIndex: 0,
    explanation: 'القديس الأنبا بولا هو أول السياح وكوكب البرية الذي عاش في المغارة عشرات السنين.',
  },
  {
    id: 'r-3',
    riddle: 'ماذا يرمز اللحن الكنسي «تين شوري» (المجمرة الذهبية) في طقس القداس الإلهي؟',
    options: ['السماء الجديدة', 'السيد المسيح في تجسده وصلبه', 'العذراء مريم التي استودعت اللاهوت في أحشائها', 'سقوط أورشليم'],
    correctIndex: 2,
    explanation: 'المجمرة الذهبية ترمز إلى السيدة العذراء مريم التي حملت جمر اللاهوت الإلهي في مستودع أحشائها.',
  },
  {
    id: 'r-4',
    riddle: 'ما هو التدريب الروحي الذي استخدمه أباء البرية لطرد الأفكار الدنسة وثبيت الفكر في الله؟',
    options: ['الصوم الانقطاعي المتواصل', 'صلاة يسوع (يا رب يسوع المسيح ارحمني)', 'السجود ألف مرة في اليوم', 'الاعتزال التام في الكهوف'],
    correctIndex: 1,
    explanation: 'صلاة يسوع السهمية المستمرة هي السلاح الأقوى لحراسة الفكر والقلب طوال النهار.',
  },
  {
    id: 'r-5',
    riddle: 'ما هو معنى اللحن القبطي الكنسي الخاشع «إبي أورو» الذي يترنم به في ختام الصلوات؟',
    options: ['يا ملك السلام اعطنا سلامك', 'يا حمل الله رافع خطية العالم', 'قدوس الله قدوس القوي', 'المجد لله في الأعالي'],
    correctIndex: 0,
    explanation: '«إبي أورو» بالقبطية تعني «يا ملك السلام»، وهو لحن يُطلب فيه سلام الرب للكنيسة والنفوس.',
  },
  {
    id: 'r-6',
    riddle: 'من هو أول شماس نال إكليل الشهادة في الكنيسة الأولى بعد قيامة السيد المسيح؟',
    options: ['القديس تيموثاوس', 'القديس استفانوس رئيس الشمامسة', 'القديس برنابا الرسول', 'القديس فيلبس المبشر'],
    correctIndex: 1,
    explanation: 'القديس استفانوس رئيس الشمامسة وأول الشهداء، الذي رجم وهو يصلي قائلاً: يا رب لا تقم لهم هذه الخطية (أع 7).',
  },
  {
    id: 'r-7',
    riddle: 'ما هي صلاة السواعي في الأجبية التي نتذكر فيها إنزال جسد الرب ودفنه في القبر؟',
    options: ['صلاة باكر والساعة الثالثة', 'صلاة الساعة السادسة', 'صلاة الساعة التاسعة', 'صلاة الغروب وصلاة النوم'],
    correctIndex: 3,
    explanation: 'صلاة الغروب تذكرنا بإنزال جسد الرب من على الصليب، وصلاة النوم تذكرنا بوضع جسده الطاهر في القبر وسكون الموت.',
  },
  {
    id: 'r-8',
    riddle: 'من هو بطريرك الإسكندرية العشرون الذي ناضل ضد بدعة آريوس ولُقب بـ «حامي الإيمان»؟',
    options: ['البابا كيرلس الكبير عمود الدين', 'البابا أثناسيوس الرسولي', 'البابا ديمتريوس الكرام', 'البابا ديوسقورس'],
    correctIndex: 1,
    explanation: 'البابا أثناسيوس الرسولي، بطل مجمع نيقية المسكوني وواضع قانون الإيمان الأرثوذكسي، لُقب بـ «أثناسيوس ضد العالم».',
  },
];

const WISDOM_WHEEL_QUOTES = [
  {
    quote: '«اجلس في قلايتك، والقلاية تُعلمك كل شيء» — الأنبا مقاريوس الكبير',
    reflection: 'السكون الداخلي في المخدع هو مدرسة النعمة الأولى.',
  },
  {
    quote: '«طوبى لمن يترجى الرب كل حين، فإن محبة الله لا تفشل أبداً» — الأنبا بيشوي',
    reflection: 'الثقة في مراحم الله تطرد كل قلق ويأس.',
  },
  {
    quote: '«الصلاة الحارة هي سور النفس الذي لا يُقهر» — القديس يوحنا فم الذهب',
    reflection: 'حصّن يومك بالصلاة المتصلة قبل مواجهة أحداث اليوم.',
  },
  {
    quote: '«الكلمة الطيبة تطفئ الغضب العنيف وتربح القلوب للمسيح» — بستان الرهبان',
    reflection: 'الوداعة وطول الأناة هما سمتا الخادم الأمين.',
  },
  {
    quote: '«الذي يهرب من المجد الباطل يجد مجد الله يسكن فيه» — مار إسحق السريان',
    reflection: 'كلما أخفيت خدمتك وأعمالك عن أعين الناس، تلألأت في عيني الله.',
  },
  {
    quote: '«المحبة لا تسقط أبداً.. فإن افتقرت للمحبة فقدت كل فضيلة» — بستان الرهبان',
    reflection: 'المحبة الأخوية وبذل الذات هما خاتم التكريس الحقيقي وجوهر الوصية الإلهية.',
  },
];

export const SpiritualGamesHub: React.FC<SpiritualGamesHubProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'virtues' | 'riddles' | 'wheel'>('menu');

  // Virtue Match state
  const [selectedFather, setSelectedFather] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [virtueScore, setVirtueScore] = useState<number>(0);

  // Riddles state
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [riddleScore, setRiddleScore] = useState<number>(0);
  const [showRiddleResult, setShowRiddleResult] = useState<boolean>(false);
  const [riddleFinished, setRiddleFinished] = useState<boolean>(false);

  // Wheel state
  const [currentWheelQuote, setCurrentWheelQuote] = useState(WISDOM_WHEEL_QUOTES[0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const { isNightMode } = useReadingTheme();

  const handleSelectFather = (father: string) => {
    soundManager.playTick();
    setSelectedFather(father);
  };

  const handleSelectVirtue = (virtueId: string, fatherName: string) => {
    soundManager.playTick();
    if (selectedFather === fatherName) {
      soundManager.playCorrect();
      if (!matchedPairs.includes(virtueId)) {
        const next = [...matchedPairs, virtueId];
        setMatchedPairs(next);
        setVirtueScore((s) => s + 20);
        if (next.length === VIRTUE_PAIRS.length) {
          soundManager.playVictory();
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        }
      }
      setSelectedFather(null);
    } else {
      soundManager.playWrong();
      setSelectedFather(null);
    }
  };

  const handleAnswerRiddle = (optionIndex: number) => {
    if (showRiddleResult) return;
    soundManager.playTick();
    setSelectedOption(optionIndex);
    setShowRiddleResult(true);

    const current = RIDDLES[currentRiddleIndex];
    if (optionIndex === current.correctIndex) {
      soundManager.playCorrect();
      setRiddleScore((s) => s + 20);
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextRiddle = () => {
    soundManager.playTick();
    if (currentRiddleIndex < RIDDLES.length - 1) {
      setCurrentRiddleIndex((i) => i + 1);
      setSelectedOption(null);
      setShowRiddleResult(false);
    } else {
      setRiddleFinished(true);
      soundManager.playVictory();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleSpinWheel = () => {
    soundManager.playTick();
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * WISDOM_WHEEL_QUOTES.length);
      setCurrentWheelQuote(WISDOM_WHEEL_QUOTES[randomIndex]);
      setIsSpinning(false);
      soundManager.playCorrect();
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in text-right">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>ألعاب ترفيهية روحية مبدعة للخدام والمكرسين</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight mb-2">
            🎮 واحة الألعاب الروحية وتحديات بستان البرية
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            ألعاب ترفيهية واختبارات ذكاء كنسية مصممة بلطف لإنعاش الروح، وتختبر معلوماتك الآبائية والطقسية بأسلوب مشوق ومبدع يجمع بين المرح والعمق الروحي.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {activeGame !== 'menu' && (
              <button
                onClick={() => setActiveGame('menu')}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة لقائمة الألعاب</span>
              </button>
            )}
            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 transition flex items-center gap-2 cursor-pointer"
            >
              <span>الرئيسية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Hub Menu */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Game 1 */}
          <div
            onClick={() => setActiveGame('virtues')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
              isNightMode
                ? 'bg-[#25211c] border-amber-900/40 hover:border-amber-500 text-amber-100'
                : 'bg-white border-amber-200 hover:border-amber-400 text-stone-900 shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🌿
              </div>
              <h3 className="font-spiritual text-xl font-bold mb-2">لعبة «بستان الفضائل»</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                طابق بين قديسي البرية وفضائلهم الكبرى واختبر سرعة بديهتك الروحية.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
              <span>بدء التحدي</span>
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 2 */}
          <div
            onClick={() => setActiveGame('riddles')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
              isNightMode
                ? 'bg-[#25211c] border-amber-900/40 hover:border-amber-500 text-amber-100'
                : 'bg-white border-amber-200 hover:border-amber-400 text-stone-900 shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 className="font-spiritual text-xl font-bold mb-2">فوازير وألغاز كنسية</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                أسئلة وألغاز ذكاء تحتاج لتفكير وبحث في الطقس والعقيدة وسير القديسين.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-900/10 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span>بدء الفوازير</span>
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 3 */}
          <div
            onClick={() => setActiveGame('wheel')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
              isNightMode
                ? 'bg-[#25211c] border-amber-900/40 hover:border-amber-500 text-amber-100'
                : 'bg-white border-amber-200 hover:border-amber-400 text-stone-900 shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎡
              </div>
              <h3 className="font-spiritual text-xl font-bold mb-2">عجلة حكمة الآباء</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                أدر عجلة البركة لتتلقى حكمة إلهية عشوائية وتأمل يومي يضيء طريقك.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-900/10 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span>إدارة العجلة</span>
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Game 1: Virtue Matcher */}
      {activeGame === 'virtues' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/10 border border-amber-800/30 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-spiritual text-xl sm:text-2xl font-bold">🌿 لعبة بستان الفضائل والآباء</h3>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                اختر القديس ثم انقر على فضيلته المطابقة في الجدول أدناه.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-sm">
              النقاط: {virtueScore} / {VIRTUE_PAIRS.length * 20}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fathers Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">أباء وبطاركة البرية:</h4>
              {VIRTUE_PAIRS.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedFather === pair.father;
                return (
                  <button
                    key={pair.id}
                    disabled={isMatched}
                    onClick={() => handleSelectFather(pair.father)}
                    className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 text-emerald-900 opacity-70'
                        : isSelected
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-102'
                        : 'bg-white dark:bg-[#25211c] border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-sm">{pair.father}</span>
                      <span className="text-[11px] opacity-80 line-clamp-1">{pair.clue}</span>
                    </div>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Virtues Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">الفضائل والمطابقات:</h4>
              {VIRTUE_PAIRS.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                return (
                  <button
                    key={`v-${pair.id}`}
                    disabled={isMatched}
                    onClick={() => handleSelectVirtue(pair.id, pair.father)}
                    className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 text-emerald-900 opacity-70'
                        : 'bg-white dark:bg-[#25211c] border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-base">{pair.virtue}</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                      طابق
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {matchedPairs.length === VIRTUE_PAIRS.length && (
            <div className="p-6 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 text-center space-y-3 border border-emerald-300">
              <h4 className="font-spiritual text-xl font-bold">🎉 هنيئاً! أكملت تحدي بستان الفضائل بنجاح</h4>
              <p className="text-xs sm:text-sm">ربحت 100 نقطة وأضفت رصيداً جديداً لخبرتك الروحية.</p>
              <button
                onClick={() => {
                  setMatchedPairs([]);
                  setVirtueScore(0);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer"
              >
                إعادة اللعب
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game 2: Riddles */}
      {activeGame === 'riddles' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-indigo-950/10 border border-indigo-800/30 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-spiritual text-xl sm:text-2xl font-bold">💡 فوازير وألغاز كنسية وعقيدية</h3>
            <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              السؤال {currentRiddleIndex + 1} من {RIDDLES.length} | النقاط: {riddleScore}
            </span>
          </div>

          {riddleFinished ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#25211c] border-2 border-indigo-400 text-center space-y-4 shadow-xl">
              <span className="text-5xl inline-block animate-bounce">🏆</span>
              <h4 className="font-spiritual text-2xl font-bold text-indigo-950 dark:text-amber-200">
                🎉 هنيئاً! أكملت بنجاح فوازير وألغاز الكنيسة
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                لقد حققت <strong className="text-indigo-600 dark:text-amber-300 font-black">{riddleScore}</strong> نقطة من إجمالي {RIDDLES.length * 20} نقطة. معلوماتك الكنسية والآبائية متميزة ومباركة!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setCurrentRiddleIndex(0);
                    setSelectedOption(null);
                    setShowRiddleResult(false);
                    setRiddleScore(0);
                    setRiddleFinished(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
                >
                  إعادة التحدي 🔄
                </button>
                <button
                  onClick={() => setActiveGame('menu')}
                  className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 transition cursor-pointer"
                >
                  العودة لقائمة الألعاب 🎮
                </button>
              </div>
            </div>
          ) : (
            /* Riddle Card */
            <div className="p-6 rounded-2xl bg-white dark:bg-[#25211c] border border-indigo-200 dark:border-indigo-900/40 space-y-4">
              <p className="font-spiritual text-base sm:text-xl font-bold leading-relaxed">
                {RIDDLES[currentRiddleIndex].riddle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {RIDDLES[currentRiddleIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === RIDDLES[currentRiddleIndex].correctIndex;
                  let btnStyle = 'bg-stone-50 dark:bg-stone-900 border-stone-200 text-stone-800 dark:text-stone-200';

                  if (showRiddleResult) {
                    if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showRiddleResult}
                      onClick={() => handleAnswerRiddle(idx)}
                      className={`p-4 rounded-xl border text-right transition text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showRiddleResult && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-xs sm:text-sm space-y-3">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    {selectedOption === RIDDLES[currentRiddleIndex].correctIndex ? '✅ إجابة موفقة وصحيحة!' : '❌ إجابة غير دقيقة.'}
                  </p>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {RIDDLES[currentRiddleIndex].explanation}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleNextRiddle}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      {currentRiddleIndex < RIDDLES.length - 1 ? 'السؤال التالي ➔' : 'إنهاء الفوازير والتتويج 🏆'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game 3: Wisdom Wheel */}
      {activeGame === 'wheel' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/10 border border-emerald-800/30 text-center space-y-6">
          <h3 className="font-spiritual text-xl sm:text-2xl font-bold">🎡 عجلة حكمة الآباء والبركة اليومية</h3>
          <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto">
            أدر العجلة لتحصل على حكمة مختارة من أقوال القديسين لترافقك طوال اليوم.
          </p>

          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-emerald-900/20 via-emerald-950/30 to-emerald-900/20 border-2 border-emerald-500/40 shadow-xl space-y-6">
            <div className={`transition-all duration-500 ${isSpinning ? 'scale-95 opacity-50 rotate-12' : 'scale-100 opacity-100'}`}>
              <span className="text-4xl inline-block mb-3">📜</span>
              <p className="font-spiritual text-lg sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 leading-relaxed">
                {currentWheelQuote.quote}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 italic">
                💡 تأمل عملي: {currentWheelQuote.reflection}
              </p>
            </div>

            <button
              disabled={isSpinning}
              onClick={handleSpinWheel}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm sm:text-base shadow-lg transition transform active:scale-95 cursor-pointer"
            >
              {isSpinning ? '✨ جاري تدوير الحكمة...' : '🎯 أدر العجلة الآن'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
