export interface EmergencyRescuePlan {
  id: string;
  title: string;
  subtitle: string;
  situation: 'distress' | 'boredom' | 'lukewarmness' | 'anger';
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    btnGradient: string;
  };
  keyVerse: {
    reference: string;
    text: string;
  };
  patristicWisdom: {
    father: string;
    quote: string;
    source: string;
  };
  immediateSteps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  rescuePrayer: string;
  recommendedHymnOrMelody: string;
}

export const EMERGENCY_RESCUE_PLANS: EmergencyRescuePlan[] = [
  {
    id: 'rescue-distress',
    title: 'خطة طوارئ وقت الضيق والشدائد',
    subtitle: 'ملاذ روحي سريع لرفع الغمم واستعادة السلام وسط العواصف',
    situation: 'distress',
    icon: '⚓',
    colorScheme: {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-950',
      badge: 'bg-rose-100 text-rose-800',
      btnGradient: 'from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600',
    },
    keyVerse: {
      reference: 'سفر المزامير 50: 15',
      text: '«وَأَدْعُنِي فِي يَوْمِ الضِّيقِ أُنْقِذْكَ فَتُمَجِّدَنِي»',
    },
    patristicWisdom: {
      father: 'مار إسحق السريان',
      quote: 'من عرف ضعفه فقد بلغ كمال التواضع.. وقت الضيق هو معصرة الذهب الإلهية لكي تخرج النفس نقية وبراقة.',
      source: 'الرسائل الروحية',
    },
    immediateSteps: [
      {
        stepNumber: 1,
        title: 'وقفة السجود والسكون الصامت',
        description: 'اسجد في هدوء ولو لدقيقة واحدة، وقل بقلب منكسر: «يا رب، أنت تنظر ضيقي وتعلم ما لا أعلم، فلتكن مشيئتك».',
      },
      {
        stepNumber: 2,
        title: 'ترديد صلاة التسبيح أو المزمور 91',
        description: 'ردد بصوت هادئ: «الساكن في ستر العلي... يقول للرب أنت مصني وحصني إلهي فأتوكل عليه».',
      },
      {
        stepNumber: 3,
        title: 'إلقاء الهم على المسيح',
        description: 'تخيل أنك تضع كل أثقالك ومخاوفك عند قدمي الصليب، وتوقف عن التفكير المفرط والقلق المستمر.',
      },
      {
        stepNumber: 4,
        title: 'فتح الكتاب المقدس',
        description: 'اقرأ الإصحاح الرابع عشر من إنجيل يوحنا: «لا تضطرب قلوبكم.. سلاماً أترك لكم سلامي أُعطيكم».',
      },
    ],
    rescuePrayer: '«أيها الرب يسوع المسيح، يا من جربت في كل شيء مثلنا بلا خطية، أَعِنْ ضعفي وانزع هذا الحمل الثقيل عن قلبي. امنحني سلامك الذي يفوق كل عقل، واجعل لي مع التجربة المنفذ لكي أستطيع أن أحتمل. لك المجد إلى الأبد. آمين.»',
    recommendedHymnOrMelody: 'لحن شيرى نى إهلوج (السلام لك أيتها السمائية) أو المزمور 23 بروح هادئة',
  },
  {
    id: 'rescue-boredom',
    title: 'خطة طوارئ وقت الزهق والملل والإرهاق',
    subtitle: 'تجديد النشاط الروحي وطرد الكسل والسآمة النفسية',
    situation: 'boredom',
    icon: '⚡',
    colorScheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-950',
      badge: 'bg-amber-100 text-amber-800',
      btnGradient: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
    },
    keyVerse: {
      reference: 'رسالة بولس الرسول إلى أهل غلاطية 6: 9',
      text: '«وَلاَ نَفْشَلْ فِي عَمَلِ الْخَيْرِ، لأَنَّنَا سَنَحْصُدُ فِي وَقْتِهِ إِنْ لَمْ نَخُورْ»',
    },
    patristicWisdom: {
      father: 'الأنبا أنطونيوس الكبير',
      quote: 'من يثبت في مكانه ولا يستسلم للكسل والقلق، يعبر بحر الشياطين بسلام وينال إكليل الصبر.',
      source: 'بستان الرهبان',
    },
    immediateSteps: [
      {
        stepNumber: 1,
        title: 'تغيير وضعية الجسد والبيئة المحيطة',
        description: 'قم من مكانك، افتح النافذة لاستنشاق هواء نقي، اشرب كوب ماء ببركة الصليب، واكسر روتين السكون الطويل.',
      },
      {
        stepNumber: 2,
        title: 'قراءة قصة قصيرة من بستان الرهبان',
        description: 'اقرأ سيرة قديس احتمل الضيق بابتسامة، لتعلم كيف كانت فرحة الأباء وسط التجارب الصعبة.',
      },
      {
        stepNumber: 3,
        title: 'الصلاة السهمية السريعة',
        description: 'ردد 21 مرة: «يا رب يسوع المسيح ارحمني»، لتطرد الملل وتربط الفكر بحضرة الله.',
      },
      {
        stepNumber: 4,
        title: 'تذكر هدف خدمتك ودعوتك',
        description: 'تذكر نفوس المخدومين التي يحبها الله، واعرف أن تعبك ليس باطلاً في الرب أبداً.',
      },
    ],
    rescuePrayer: '«أيها الرب الإله مجدد الشباب كالنشر، انر ظلمة فكري واطرد عني روح السآمة والكسل والفتور. املأ قلبي بحرارة الروح وقدس طاقاتي لمجد اسمك القدوس. آمين.»',
    recommendedHymnOrMelody: 'لحن هوس إيروف (التسبيحة) أو ترانيم الفرح والتجديد الروحي',
  },
  {
    id: 'rescue-lukewarmness',
    title: 'خطة طوارئ وقت الفتور الروحي وبرودة المحبة',
    subtitle: 'إشعال نار المحبة الأولى والرجوع إلى مخدع التوبة',
    situation: 'lukewarmness',
    icon: '🔥',
    colorScheme: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-950',
      badge: 'bg-orange-100 text-orange-800',
      btnGradient: 'from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600',
    },
    keyVerse: {
      reference: 'سفر الرؤيا 2: 5',
      text: '«اُذْكُرْ مِنْ أَيْنَ سَقَطْتَ وَتُبْ، وَاعْمَلِ الأَعْمَالَ الأُولَى»',
    },
    patristicWisdom: {
      father: 'القديس مار إفرام السريان',
      quote: 'دمعة توبة صادقة واحدة تطفئ أتون الغضب وتوقد نار الروح في القلب البارد وتفتح أبواب الفردوس.',
      source: 'الميامر الروحية',
    },
    immediateSteps: [
      {
        stepNumber: 1,
        title: 'الاعتراف بالضعف بلا تبرير',
        description: 'اعترف أمام الله بصدق: "يا رب أنا بارد وجائع إليك، انقذني من نفسي".',
      },
      {
        stepNumber: 2,
        title: 'الاستماع إلى لحن كنسي خاشع',
        description: 'استمع إلى ألحان الأسبوع الأخير أو تى شوري (المجمرة الذهبية) بصوت خاشع.',
      },
      {
        stepNumber: 3,
        title: 'عمل محبة خفي',
        description: 'قدم مساعدة صامتة أو خدمة صغيرة لشخص متعب دون أن يدري أنك الفاعل.',
      },
      {
        stepNumber: 4,
        title: 'ترتيب موعد سريع للاعتراف',
        description: 'تواصل مع أب اعترافك لجلسة توبة وتجديد العهد مع الله.',
      },
    ],
    rescuePrayer: '«يا رب، لا تطرحني من قدام وجهك، وروحك القدوس لا تنزعه مني. هب لي قلباً نقياً يا الله، وروحاً مستقيمًا جدد في داخلي. ردني خلاصك وبروح منتدب اعضدني. آمين.»',
    recommendedHymnOrMelody: 'لحن تى شوري (المجمرة) أو لحن جولو (طوباك يا مريم)',
  },
  {
    id: 'rescue-anger',
    title: 'خطة طوارئ وقت الانفعال والغضب في الخدمة',
    subtitle: 'استعادة السلام والوداعة وضبط النفس مع المخدومين',
    situation: 'anger',
    icon: '🕊️',
    colorScheme: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-300',
      text: 'text-cyan-950',
      badge: 'bg-cyan-100 text-cyan-800',
      btnGradient: 'from-cyan-600 to-teal-700 hover:from-cyan-500 hover:to-teal-600',
    },
    keyVerse: {
      reference: 'رسالة يعقوب 1: 19',
      text: '«لِيَكُنْ كُلُّ إِنسانٍ مُسْرِعاً فِي الاسْتِمَاعِ، مُبْطِئاً فِي التَّكَلُّمِ، مُبْطِئاً فِي الْغَضَبِ»',
    },
    patristicWisdom: {
      father: 'القديس يوحنا فم الذهب',
      quote: 'الغضب عاصفة تدمر ميناء النفس، وبالصمت والوداعة وحدها نغلب كل انفعال ونكسب قلوب الآخرين للمسيح.',
      source: 'شرح إنجيل متى',
    },
    immediateSteps: [
      {
        stepNumber: 1,
        title: 'قاعدة الصمت الذهبي الفوري',
        description: 'توقف عن الكلام تماماً ولا تنطق بأي كلمة لمدة دقيقة كاملة لتطفئ جمرة الغضب.',
      },
      {
        stepNumber: 2,
        title: 'التنفس العميق وصلاة الرحمة',
        description: 'خذ ثلاثة أنفاس عميقة وقل في سرك مع كل نفس: "يا رب يسوع المسيح ارحمني أنا الخاطئ".',
      },
      {
        stepNumber: 3,
        title: 'تذكر وداعة المخلص',
        description: 'تذكر كيف احتمل السيد المسيح الشتائم والصلب بصمت محب لأجل خلاصنا.',
      },
      {
        stepNumber: 4,
        title: 'الاعتذار الهادئ والمحبة العملية',
        description: 'إن صدر منك انفعال أو صوت عالٍ، بادر بالاعتذار بابتسامة متواضعة ومحبة أبوية.',
      },
    ],
    rescuePrayer: '«يا رب الحنان والرحمة، ضع يا رب حارساً لفمي وباباً حصيناً على شفتي، ولا تميل قلبي إلى أمور الشر. املأني بروح الوداعة وطول الأناة لكي أكون خادماً أميناً يشبهك في حنوك. آمين.»',
    recommendedHymnOrMelody: 'لحن كاينا غار (لأنك أنت هو إلهنا) بروح الهدوء والسكينة',
  },
];
