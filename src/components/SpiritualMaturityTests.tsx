import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Sparkles, Award, CheckCircle2, RotateCcw, BookOpen, Heart, Compass, Shield, Flame, ArrowRight } from 'lucide-react';

interface SpiritualMaturityTestsProps {
  currentUser: User | null;
}

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    score: number; // 1 to 4
    adviceTag: string;
  }[];
}

interface TestDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  questions: Question[];
}

const testsData: TestDefinition[] = [
  {
    id: 'spiritual_fruits',
    title: 'اختبار ثمار الروح القدس في الواقع اليومي',
    subtitle: 'قياس المحبة، الفرح، السلام، وطول الأناة في تعاملاتك',
    icon: '🍇',
    description: 'يساعدك هذا الاختبار على فحص مدى ظهور ثمار الروح القدس في سلوكك اليومي، وكيفية تعاملك مع الضيقات والمستفزات.',
    questions: [
      {
        id: 1,
        question: 'عندما يتعرض لك شخص بإساءة أو كلام جارح في العمل أو الشارع، كيف تكون ردة فعلك الأولى؟',
        options: [
          { text: 'أشعر برغبة شديدة في الرد الفوري والدفاع عن نفسي بكل قوة.', score: 1, adviceTag: 'الغضب السريع' },
          { text: 'أصمت ظاهرياً ولكن يغلي قلبي بالمرارة والغضب لفترة طويلة.', score: 2, adviceTag: 'حفظ المرارة' },
          { text: 'أحاول الهدوء وتجاوز الأمر عقلياً بأقل خسائر ممكنة.', score: 3, adviceTag: 'التحكم النفسي' },
          { text: 'أصلي في صمت لأجل الشخص المسيء وأطلب من الله أن يسلام قلبي.', score: 4, adviceTag: 'المحبة الفائقة' }
        ]
      },
      {
        id: 2,
        question: 'كيف تقيم شعورك الداخلي بالسلام والفرح وسط ضغوط الحياة اليومية والمسؤوليات؟',
        options: [
          { text: 'أشعر دائماً بالقلق والتوتر الدائم وكأن الحمل أكبر من طاقتي.', score: 1, adviceTag: 'الحاجة للاتكال' },
          { text: 'أفرح أحياناً عندما تسير الأمور جيداً، وأكتئب وتضطرب نفسي عند أول عقبة.', score: 2, adviceTag: 'فرح متقلب' },
          { text: 'لدي سلام نسبي بفضل التنظيم والصلاة المعتادة.', score: 3, adviceTag: 'سلام مستقر' },
          { text: 'أختبر سلاماً عجيباً يفوق كل عقل حتى في أشد التجارب والضيقات.', score: 4, adviceTag: 'السلام الفائق' }
        ]
      },
      {
        id: 3,
        question: 'ما هي صفتك في طول الأناة واحتمال الأخرين (أفراد الأسرة أو الزملاء الصعبين)؟',
        options: [
          { text: 'صبري نفذ تماماً ولا أتحمل أي خطأ أو تقصير من أحد.', score: 1, adviceTag: 'نفاد الصبر' },
          { text: 'أتحمل لفترة قصيرة ثم أنفجر في عتاب حاد أو شكوى.', score: 2, adviceTag: 'احتمال مؤقت' },
          { text: 'أتحمل كثيراً من أجل السلام العام، لكن بصعوبة بالغة.', score: 3, adviceTag: 'تحمل بواجب' },
          { text: 'ألتمس الأعذار للجميع وأتذكر دائماً أناة الله الطويلة معي.', score: 4, adviceTag: 'طول أناة المسيح' }
        ]
      },
      {
        id: 4,
        question: 'كيف تتعامل مع ممتلكاتك ووقتك ومشاعر نحو المحتاجين من حولك؟',
        options: [
          { text: 'أهتم أولاً بنفسي ومستقبلي ونادراً ما أفكر في احتياجات الآخرين.', score: 1, adviceTag: 'الذاتية' },
          { text: 'أساعد أحياناً إذا طلب مني أحدهم ذلك وبدون التزام.', score: 2, adviceTag: 'مساعدة موسمية' },
          { text: 'لدي عطاء منتظم وأخصص جزءاً من وقتي ومالي للخدمة والفقراء.', score: 3, adviceTag: 'عطاء منتظم' },
          { text: 'أعتبر نفسي وكيلاً لما أعطاني الله، وأفرح بمشاركة كل ما أملك مع المحتاجين.', score: 4, adviceTag: 'الوكالة الأمينة' }
        ]
      },
      {
        id: 5,
        question: 'ما هو مدى شعورك بالرضا والشكر لله في الظروف الصعبة والأوقات المعاكسة؟',
        options: [
          { text: 'أتذمر غالباً وأتساءل لماذا يسمح الله بهذه التجارب لي.', score: 1, adviceTag: 'التذمر' },
          { text: 'أرضى صاغراً مرغماً لأن لا مفر من الأمر.', score: 2, adviceTag: 'رضا جبري' },
          { text: 'أشكر الله بذهن هادئ متيقناً أن الأمور ستتحسن قريباً.', score: 3, adviceTag: 'شكر هادئ' },
          { text: 'أشكر الله في كل حين وكل ظرف مدركاً أن كل الأشياء تعمل للخير.', score: 4, adviceTag: 'الشكر الدائم' }
        ]
      }
    ]
  },
  {
    id: 'inner_chamber',
    title: 'اختبار صلاة المخدع والعمق الروحي',
    subtitle: 'قياس جودة خلوتك اليومية، الانتظام، وسكون الفكر أمام الله',
    icon: '🕯️',
    description: 'يقيس هذا الاختبار مدى انتظامك في خلوتك الشخصية، وعمق الشركة مع الله في الصلاة والتأمل في الكلمة.',
    questions: [
      {
        id: 1,
        question: 'ما هو مدى انتظامك اليومي في وقت المخدع والصلاة الشخصية؟',
        options: [
          { text: 'أصلي بشكل متقطع جداً أو فقط عندما أقع في ضيقة أو مشكلة.', score: 1, adviceTag: 'صلاة عند الضيق' },
          { text: 'أصلي سريعاً قبل النوم أو في عجلة لارتباطات اليوم.', score: 2, adviceTag: 'صلاة عجلة' },
          { text: 'لدي وقت مخصص يومياً، لكن أحياناً يسرقه انشغال العمل.', score: 3, adviceTag: 'التزام متذبذب' },
          { text: 'مخدعي هو أثمن وأثبت موعد في يومي لا يمكن التنازل عنه.', score: 4, adviceTag: 'مخدع ثابت' }
        ]
      },
      {
        id: 2,
        question: 'عندما تدخل مخدعك للصلاة، كيف تصف حالة فكرك وذهنك؟',
        options: [
          { text: 'أشتت طوال الوقت في هموم العمل ومشاكل اليوم ولا أستطيع التركيز.', score: 1, adviceTag: 'تشتت الفكر' },
          { text: 'أحتاج وقتاً طويلاً جداً لأهدأ، وغالباً ينتهي وقت الصلاة وأنا ما زلت شارداً.', score: 2, adviceTag: 'بطء الهدوء' },
          { text: 'أستطيع التركيز بعد صلاة أجبية أو تسبحة قصيرة.', score: 3, adviceTag: 'تركيز متوازن' },
          { text: 'أختبر سكينة عميقة وحضوراً إلهياً ملموساً بمجرد أن أغلق باب مخدعي.', score: 4, adviceTag: 'سكون عميق' }
        ]
      },
      {
        id: 3,
        question: 'كيف تتعامل مع الكتاب المقدس (قراءة وتأمل) في حياتك اليومية؟',
        options: [
          { text: 'نادراً ما أفتح الكتاب المقدس إلا في الكنيسة أو المناسبات.', score: 1, adviceTag: 'جفاف الكلمة' },
          { text: 'أقرأ أصحاحاً أو آيات قليلة كمجرد واجب روحي يومي.', score: 2, adviceTag: 'قراءة واجبة' },
          { text: 'أتابع خطة قراءة منتظمة وأستفيد من تفسيرات الآباء.', score: 3, adviceTag: 'قراءة منهجية' },
          { text: 'أتذوق الكلمة كخبز يومي وأتأمل في رسالة الله الشخصية لقلبي كل صباح.', score: 4, adviceTag: 'تذوق الكلمة' }
        ]
      },
      {
        id: 4,
        question: 'هل تختبر توبيخ الروح القدس (النخس الداخلي) وتسرع بالتوبة والاعتراف؟',
        options: [
          { text: 'أبرر أخطائي دائماً ولا أشعر بضرورة للتوبة المستمرة.', score: 1, adviceTag: 'تبرير الذات' },
          { text: 'أشعر بالذنب أحياناً لكني أنسى الأمر سريعاً مع زحمة الحياة.', score: 2, adviceTag: 'شعور عابر' },
          { text: 'أعترف بخطاياي بانتظام في صلاتي المسائية وأستشير أبي الاعتراف دورياً.', score: 3, adviceTag: 'توبة منتظمة' },
          { text: 'أحفظ قلبي بيقظة مستمرة وأسرع إلى حضن الآب عند أبسط زلة بانسحاق.', score: 4, adviceTag: 'يقظة القلب' }
        ]
      }
    ]
  },
  {
    id: 'humility_discernment',
    title: 'اختبار الاتضاع وحراسة الحواس والجهاد الروحي',
    subtitle: 'قياس نقاوة القلب، التواضع، والهروب من تجارب العالم',
    icon: '🛡️',
    description: 'يختبر مدى سلامة أساسك الروحي في الاتضاع، التخلي عن المجد الباطل، وحراسة الحواس والقلب.',
    questions: [
      {
        id: 1,
        question: 'كيف تتصرف عندما يوجه لك أحدهم نقداً علنياً أو اتقاداً لعملك أو سلوكك؟',
        options: [
          { text: 'أثور فوراً وأدافع عن نفسي بشراسة وأثبت خطأ الناقد.', score: 1, adviceTag: 'دفاع عن الكرامة' },
          { text: 'أصمت متأففاً في داخلي وأحمل شعوراً بالظلم والغيظ تجاهه.', score: 2, adviceTag: 'غيظ مكبوت' },
          { text: 'أقبل النقد ظاهرياً لأجل الهدوء، لكنه يزعجني طوال اليوم.', score: 3, adviceTag: 'قبول مظهري' },
          { text: 'أفرح بالنقد وأعتبره مرآة تكشف ضعفاتي، وأشكر الله ومن وجهه لي.', score: 4, adviceTag: 'محبة النقد' }
        ]
      },
      {
        id: 2,
        question: 'ما هو موقفك من المدح، المجد الباطل، والظهور أمام الآخرين؟',
        options: [
          { text: 'أحب جداً أن يمدحني الناس وأسعى للظهور وتقدير الآخرين لإنجازاتي.', score: 1, adviceTag: 'مجد باطل' },
          { text: 'أفرح بالمدح في صمت، وأشعر بالضيق إذا تجاهل أحد تعبي.', score: 2, adviceTag: 'حب المديح' },
          { text: 'أقبل المديح كتشجيع لكن أعلم في قرارة نفسي أن الفضل لله وحده.', score: 3, adviceTag: 'نسب الفضل لله' },
          { text: 'أهرب من المديح البشري وأفضل الخفاء والخدمة بصمت تام أمام الله.', score: 4, adviceTag: 'التواضع الخفي' }
        ]
      },
      {
        id: 3,
        question: 'كيف تتعامل مع حراسة حواسك (النظر، السمع، السوشيال ميديا) في حياتك اليومية؟',
        options: [
          { text: 'أنطلق بلا قيود وأقضي ساعات طويلة في تصفح ما لا يعود بنفع روحي.', score: 1, adviceTag: 'انفلات الحواس' },
          { text: 'أحاول أحياناً ضبط نفسي لكن شهوة الاستطلاع تغلبني غالباً.', score: 2, adviceTag: 'ضعف المقاومة' },
          { text: 'لدي حدود واضحة وأوقات محددة للتصفح وحراسة عيني.', score: 3, adviceTag: 'ضبط الحواس' },
          { text: 'أنظر بعين بسيطة ونقية، وأعتبر حراسة الحواس هو السور الحصني لقلبي.', score: 4, adviceTag: 'نقاوة القلب' }
        ]
      }
    ]
  }
];

export const SpiritualMaturityTests: React.FC<SpiritualMaturityTestsProps> = ({ currentUser }) => {
  const [selectedTest, setSelectedTest] = useState<TestDefinition | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<{
    test: TestDefinition;
    totalScore: number;
    maxScore: number;
    percentage: number;
    levelTitle: string;
    levelDescription: string;
    recommendations: string[];
  } | null>(null);

  const handleSelectTest = (test: TestDefinition) => {
    soundManager.playTick();
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
  };

  const handleAnswerOption = (score: number) => {
    soundManager.playTick();
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (selectedTest && currentQuestionIndex + 1 < selectedTest.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (selectedTest) {
      // Calculate result
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const maxScore = selectedTest.questions.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);

      let levelTitle = '';
      let levelDescription = '';
      let recommendations: string[] = [];

      if (percentage >= 85) {
        levelTitle = '🌟 قامة روحية ناضجة وثمرة متأصلة';
        levelDescription = 'أنت تعيش حالة متقدمة من الشركة العميقة مع الله والثبات في الكرمة. انعكاس النعمة واضح في سلامك وثمارك.';
        recommendations = [
          'داوم على هذا المستوى بثبات واتضاع شديد لئلا يسقط المرتفع.',
          'اشترك في تشجيع الآخرين وخدمة المحتاجين روحياً ومادياً.',
          'اجعل صلاة الشفاعة اليومية لأجل العالم والكنيسة جزءاً أساسياً من مخدعك.'
        ];
      } else if (percentage >= 65) {
        levelTitle = '🌿 مؤمن نامٍ ومثابر في طريق البر';
        levelDescription = 'خطواتك ثابتة وحياتك الروحية في نمو مستمر. هناك التزام جميل، مع وجود بعض المجالات التي تحتاج إلى سهر إضافي.';
        recommendations = [
          'عمّق وقت سكونك الصباحي واجعل قراءة الإنجيل تأملاً قلبياً لا مجرد واجب.',
          'تدرّب على صمت اللسان وضبط الفكر عند أول هبوب للضيقات.',
          'واظب على سر التوبة والاعتراف بانتظام مع أب الإرراف.'
        ];
      } else if (percentage >= 40) {
        levelTitle = '🌱 مبتدئ في طريق النعمة وبداية الصحوة';
        levelDescription = 'لديك رغبة صادقة وحنين للترقي الروحي، لكن رياح العالم وتجارب اليوميات تؤثر كثيراً على ثباتك وسلامك الداخلي.';
        recommendations = [
          'ثبّت موعداً مقدساً لا يقبل التفاوض لمخدع الصلاة الصباحي ولو لعشر دقائق.',
          'استخدم منبهات صلوات الأجبية لتذكير قلبك بالله وسط زحمة اليوم.',
          'ابتعد بحزم عن المشتتات ومصادر تشتيت الفكر والسوشيال ميديا الزائدة.'
        ];
      } else {
        levelTitle = '⚓ مرحلة الحاجة لصحوة الروح والالتجاء للراعي';
        levelDescription = 'يبدو أن ضغوط الحياة وانشغالات العالم قد استنزفت طاقاتك الروحية وجعلتك تشعر بالجفاف الروحي والقلق.';
        recommendations = [
          'ابدأ الآن بصرخة توبة حقيقية وحضن الأب السماوي مفتوح دائماً لقبلتكم.',
          'خصص خلوة سريعة في عطلة نهاية الأسبوع للمراجعة والجلوس في هدوء تام.',
          'اطلب مشورة أب اعترافك لإرشادك في تنظيم حياتك الروحية خطوة بخطوة.'
        ];
      }

      setTestResult({
        test: selectedTest,
        totalScore,
        maxScore,
        percentage,
        levelTitle,
        levelDescription,
        recommendations
      });
      soundManager.playCorrect();
    }
  };

  const resetTest = () => {
    soundManager.playTick();
    setSelectedTest(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-stone-900 to-sky-950 text-stone-100 p-6 sm:p-8 border border-teal-700/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-600/40 text-teal-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-teal-400" />
          <span>اختبارات النضج والعمق الروحي التفاعلية</span>
        </div>
        <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-teal-100">
          🧠 مرآة الروح: اختبر نموك وثمرك اليومي
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          أجب بصدق وأمانة أمام الله عن الأسئلة التالية لاكتشاف نقاط القوة في حياتك الروحية والجوانب التي تحتاج إلى سهر وجهاد روحي ومرافقة إرشادية.
        </p>
      </div>

      {!selectedTest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testsData.map((test) => (
            <div
              key={test.id}
              onClick={() => handleSelectTest(test)}
              className="group p-6 rounded-3xl bg-stone-900/90 border border-amber-900/40 hover:border-teal-500/80 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition"></div>
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-600/40 flex items-center justify-center text-2xl shadow-inner">
                  {test.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-spiritual text-lg font-bold text-amber-100 group-hover:text-teal-300 transition">
                    {test.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {test.subtitle}
                  </p>
                </div>
                <p className="text-xs text-stone-300 line-clamp-2">
                  {test.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-stone-800 flex items-center justify-between text-xs font-bold text-teal-400 relative z-10">
                <span>{test.questions.length} أسئلة تقييمية</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                  ابدأ الاختبار <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTest && !testResult && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-stone-900/95 border border-teal-600/50 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedTest.icon}</span>
              <div>
                <h3 className="font-spiritual text-lg font-bold text-amber-100">
                  {selectedTest.title}
                </h3>
                <span className="text-xs text-teal-300 font-mono">
                  السؤال {currentQuestionIndex + 1} من {selectedTest.questions.length}
                </span>
              </div>
            </div>
            <button
              onClick={resetTest}
              className="text-xs text-stone-400 hover:text-stone-200 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> إلغاء
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / selectedTest.questions.length) * 100}%`
              }}
            ></div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-spiritual text-base sm:text-lg font-bold text-stone-100 leading-relaxed">
              {selectedTest.questions[currentQuestionIndex].question}
            </h4>

            <div className="space-y-3 pt-2">
              {selectedTest.questions[currentQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerOption(opt.score)}
                  className="w-full text-right p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-teal-500/60 hover:bg-teal-950/20 text-stone-200 text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer shadow-xs group"
                >
                  <span className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-teal-400 font-bold shrink-0 group-hover:border-teal-400 group-hover:bg-teal-900/40 text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {testResult && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-stone-900/95 border border-amber-600/60 p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
          <div className="text-center space-y-3 pb-2 border-b border-stone-800">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-teal-600 mx-auto flex items-center justify-center text-3xl shadow-lg text-white">
              🏆
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono">
              نتيجة تقييم النضج الروحي
            </span>
            <h3 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
              {testResult.levelTitle}
            </h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950 border border-amber-600/40 text-amber-300 text-xs font-bold font-mono">
              <span>النتيجة النهائية: {testResult.percentage}%</span>
              <span>({testResult.totalScore} / {testResult.maxScore} نقطة)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> تحليل الحالة الروحية:
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {testResult.levelDescription}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> توصيات وإرشادات روحية مخصصة لنموك:
              </h4>
              <ul className="space-y-2">
                {testResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={resetTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs transition shadow-lg cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> اختبار آخر أو إعادة التقييم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
