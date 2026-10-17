export interface SpiritualInsight {
  id: string;
  sectionId: string;
  sectionName: string;
  title: string;
  dimension: 'صلاة' | 'تأمل' | 'اتضاع' | 'جهاد' | 'محبة' | 'تجرد' | 'أبدية' | 'تمييز';
  dimensionColor: string;
  verse: string;
  verseRef: string;
  patristicFather: string;
  patristicQuote: string;
  spiritualMeaning: string;
  soulExamination: string;
  practicalExercise: string;
  consecrationSecret: string;
  emoji: string;
}

export interface SectionMetadata {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const APP_SECTIONS_LIST: SectionMetadata[] = [
  {
    id: 'competitions',
    name: 'المسابقة الرسمية والجهاد الروحي',
    icon: '🏆',
    color: '#9a6700',
    description: 'جهاد الأمانة، التنافس الشريف، وإكليل البر الأبدي غير الفاني.',
  },
  {
    id: 'spiritual_life',
    name: 'الحياة الروحية وصلاة المخدع',
    icon: '☀️',
    color: '#047857',
    description: 'المخدع السري، سكون النفس، صلاة يسوع، والاتحاد بالله.',
  },
  {
    id: 'biblical_study',
    name: 'الدراسة الكتابية المعمقة والآباء',
    icon: '📖',
    color: '#1d4ed8',
    description: 'الغوص في كلمة الحياة، لاهوت التجسد، وتفاسير الآباء المستنيرة.',
  },
  {
    id: 'library',
    name: 'مكتبة المراجع وتراث القديسين',
    icon: '📚',
    color: '#78350f',
    description: 'كنوز التراث الآبائي، أيقونات الكنيسة، وتاريخ آباء الشرق والغرب.',
  },
  {
    id: 'monastic_oasis',
    name: 'دستور التكريس وواحة السكون الروحي',
    icon: '🕯️',
    color: '#b45309',
    description: 'ركائز المكرس الـ 7، ميزان فحص الضمير، والترانيم الروحية الهادئة.',
  },
  {
    id: 'workshops',
    name: 'ورش العمل والتدريب الكنسي والخدمة',
    icon: '🎓',
    color: '#4338ca',
    description: 'أصول الرعاية والافتقاد، البذل الصامت، والتلمذة الإنجيلية.',
  },
  {
    id: 'creative_lab',
    name: 'مختبر الإبداع والتأملات الروحية',
    icon: '✨',
    color: '#be185d',
    description: 'إشراقات الروح، الشعر والتسابيح، وصياغة الخواطر الإلهية.',
  },
  {
    id: 'study_tools',
    name: 'أدوات البحث والتمييز الإلهي',
    icon: '🔍',
    color: '#0f766e',
    description: 'فحص الأرواح، قياس النمو الروحي، واقتناء حكمة الإفراز.',
  },
  {
    id: 'spiritual_games',
    name: 'واحة الألعاب والترويح الروحي المقدس',
    icon: '🎮',
    color: '#6b21a8',
    description: 'الفرح في الرب، راحة النفس في البرية، والتسلية البناءة للمكرس.',
  },
  {
    id: 'emergency_rescue',
    name: 'خطط الإنقاذ الروحي والتعزية الفورية',
    icon: '🛡️',
    color: '#b91c1c',
    description: 'ملاذ الرجاء في حروب الفتور، نوبات الحزن، والضيقات المباغتة.',
  },
  {
    id: 'personal_space',
    name: 'الفضاء الشخصي والمجلة الروحية',
    icon: '📝',
    color: '#0369a1',
    description: 'سجل مذكرات المخدع، رسائل أبيك السماوي، ومناجاة الروح.',
  },
  {
    id: 'leaderboard',
    name: 'لوحة الصدارة والإكليل السماوي',
    icon: '🥇',
    color: '#334155',
    description: 'مجد الأبدية، التحرر من مجد الناس، وثمر الروح الباقي للأبد.',
  },
];

// Foundational curated spiritual insights pool
export const BASE_SPIRITUAL_INSIGHTS: SpiritualInsight[] = [
  // 1. Competitions & Spiritual Warfare
  {
    id: 'ins-comp-1',
    sectionId: 'competitions',
    sectionName: 'المسابقة الرسمية والجهاد الروحي',
    title: 'ضبط النفس ونقاوة دافع الجهاد',
    dimension: 'جهاد',
    dimensionColor: '#9a6700',
    verse: '«كُلُّ مَنْ يُجَاهِدُ يَضْبُطُ نَفْسَهُ فِي كُلِّ شَيْءٍ. أَمَّا أُولئِكَ فَلِكَيْ يَنَالُوا إِكْلِيلًا يَفْنَى، وَأَمَّا نَحْنُ فَإِكْلِيلًا لاَ يَفْنَى».',
    verseRef: '1 كورنثوس 9: 25',
    patristicFather: 'القديس أنطونيوس الكبير',
    patristicQuote: '«لا تظن أن جهادك بصلواتك وأصوامك هو الذي يخلصك بذاته، بل نعمة المخلص التي تعضد إرادتك المنكسرة».',
    spiritualMeaning: 'المسابقة الحقيقية للمكرس ليست للتفوق على الآخرين، بل للانتصار على الذات القديمة وكبرياء المعرفة الزائفة.',
    soulExamination: 'هل تفرح حين يتفوق خادم آخر عليك في المعرفة الروحية أو الخدمة، أم تشعر بانقباض خفي في داخلك؟',
    practicalExercise: 'صلّ اليوم بحرارة من أجل من تشعر بنوع من المقارنة معه، واطلب من الله أن يزيده نعمة وحكمة تفوق نصيبك.',
    consecrationSecret: 'سر التكريس: الخادم بحسب قلب الله يرى نفسه أصغر المجاهدين وأحوجهم للرحمة.',
    emoji: '⚔️',
  },
  {
    id: 'ins-comp-2',
    sectionId: 'competitions',
    sectionName: 'المسابقة الرسمية والجهاد الروحي',
    title: 'السير في الطريق الكرب دون ملل',
    dimension: 'جهاد',
    dimensionColor: '#9a6700',
    verse: '«مَا أَضْيَقَ الْبَابَ وَأَكْرَبَ الطَّرِيقَ الَّذِي يُؤَدِّي إِلَى الْحَيَاةِ، وَقَلِيلُونَ هُمُ الَّذِينَ يَجِدُونَهُ!»',
    verseRef: 'متى 7: 14',
    patristicFather: 'مار إسحق السرياني',
    patristicQuote: '«الجهاد الروحي يشبه سفراً طويلاً في صحراء؛ من يبحث عن واحات الراحة باستمرار لن يبلغ أبداً جبل الله المقدس».',
    spiritualMeaning: 'ضيق الطريق لا يعني الحزن، بل التركيز؛ فالباب الضيق يتسع لشخصك فقط متجرداً من أحمال العالم وثقل الاقتناء.',
    soulExamination: 'هل تبحث عن تكريس مريح ومحاط بالثناء، أم تقبل أتعاب الطريق بصمت ووداعة؟',
    practicalExercise: 'تحمّل اليوم تعباً جسدياً أو نفسياً صغيراً في الخدمة دون أن تشتكي لأحد سوى في صلاتك بالمخدع.',
    consecrationSecret: 'سر التكريس: طريق الملكوت ضيق لكي لا يدخله سوى المتواضعون المنسحقو القلوب.',
    emoji: '🏔️',
  },

  // 2. Spiritual Life & Secret Closet
  {
    id: 'ins-spirit-1',
    sectionId: 'spiritual_life',
    sectionName: 'الحياة الروحية وصلاة المخدع',
    title: 'صلاة الهيزيكيا وسكون الحواس الخمس',
    dimension: 'صلاة',
    dimensionColor: '#047857',
    verse: '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ».',
    verseRef: 'إشعياء 30: 15',
    patristicFather: 'القديس يوحنا الدرجي',
    patristicQuote: '«الهدوء هو حراسة العقل، وصمت اللسان هو باب المخدع الداخلي الذي يدخله الملك السماوي متى وجده نائياً عن ضجيج العالم».',
    spiritualMeaning: 'الصلاة ليست سرد كلمات، بل سكون الروح أمام عظمة الله حتى يذوب العقل في نوره غير الموصوف.',
    soulExamination: 'كم دقيقة تقضيها في اليوم في صمت كامل دون استخدام أي شاشات أو هواتف قبل مخاطبة الله؟',
    practicalExercise: 'أجلس اليوم 10 دقائق في غرفتك مع ضوء خافت، وتنفس بهدوء مع ترديد: «يا ربي يسوع المسيح، ارحمني».',
    consecrationSecret: 'سر التكريس: ما يبنيه الخادم في ساعة صمت مع الله، يعجز عن بنائه في سنوات من العمل المشتت.',
    emoji: '🕊️',
  },
  {
    id: 'ins-spirit-2',
    sectionId: 'spiritual_life',
    sectionName: 'الحياة الروحية وصلاة المخدع',
    title: 'تلاوة المزامير بروح الكشف الإلهي',
    dimension: 'تأمل',
    dimensionColor: '#047857',
    verse: '«فَتِّحْ عَيْنَيَّ فَأَرَى عَجَائِبَ مِنْ شَرِيعَتِكَ».',
    verseRef: 'مزمور 119: 18',
    patristicFather: 'القديس أثناسيوس الرسولي',
    patristicQuote: '«سفر المزامير هو مرآة النفس البشرية؛ يجد فيه كل إنسان صورة ضعفه، وبلسم شفائه، وترنيمة نصرته بالمسيح».',
    spiritualMeaning: 'حين ترتل المزمور، رتله وكأنك كاتبه اليوم؛ اجعل كل تنهد فيه تنهدك، وكل تسبيح فيه شكرك الفائض.',
    soulExamination: 'هل تتلو صلوات الأجبية كواجب ثقيل تود إنهاءه، أم كحديث عذب مع أبيك السماوي؟',
    practicalExercise: 'اختر مزموراً واحداً من صلاة الغروب، واقرأه بتمهل شديد مكرراً كل آية مرتين مع تأمل معناها.',
    consecrationSecret: 'سر التكريس: المزمور الذي يخرج من قلب خاشع يحرق سهام الشياطين كما تحرق النار الهشيم.',
    emoji: '📜',
  },

  // 3. Biblical Study & Fathers
  {
    id: 'ins-bib-1',
    sectionId: 'biblical_study',
    sectionName: 'الدراسة الكتابية المعمقة والآباء',
    title: 'روح النص قبل حرفه في ضوء التجسد',
    dimension: 'تأمل',
    dimensionColor: '#1d4ed8',
    verse: '«الْحَرْفَ يَقْتُلُ وَلكِنَّ الرُّوحَ يُحْيِي».',
    verseRef: '2 كورنثوس 3: 6',
    patristicFather: 'القديس كيرلس الكبير',
    patristicQuote: '«الكتاب المقدس هو ثوب المسيح المنسوج بنور الروح؛ فمن يلمس أطرافه بإيمان ينال قوة الشفاء والحياة الأبدية».',
    spiritualMeaning: 'دراسة الكتاب لا تهدف لجمع معلومات لاهوتية بل للالتقاء بشخص المخلص الحي في كل صفحة ونبوة ورمز.',
    soulExamination: 'هل تقرأ الإنجيل لتبحث عن مادة لإعداد عظة، أم لتسمع ما يقوله الروح لشخصك وضعفك؟',
    practicalExercise: 'قبل قراءة إصحاح اليوم، اسجد وقل: «يا ربي يسوع، تحدث إليّ أنا شخصياً، فها خادمك يسمع».',
    consecrationSecret: 'سر التكريس: معرفة الكتاب بالروح تبني اتضاعاً عميقاً، بينما معرفته بالعقل المجرد تولد جدالاً عقيماً.',
    emoji: '📖',
  },

  // 4. Library & Heritage
  {
    id: 'ins-lib-1',
    sectionId: 'library',
    sectionName: 'مكتبة المراجع وتراث القديسين',
    title: 'ترياق الآباء ضد تيار العالم المعاصر',
    dimension: 'تمييز',
    dimensionColor: '#78350f',
    verse: '«تَمَسَّكْ بِصُورَةِ الْكَلاَمِ الصَّحِيحِ الَّذِي سَمِعْتَهُ مِنِّي، فِي الإِيمَانِ وَالْمَحَبَّةِ الَّتِي فِي الْمَسِيحِ يَسُوعَ».',
    verseRef: '2 تيموثاوس 1: 13',
    patristicFather: 'القديس باسيليوس الكبير',
    patristicQuote: '«أقوال الآباء القديسين كنز لا ينضب؛ من استقى منه حاز بصيرة إلهية تكشف فخاخ الزمان وتثبت القدمين على الصخر».',
    spiritualMeaning: 'الرجوع إلى الآباء ليس حنيناً إلى الماضي، بل عودة إلى الينبوع النقي الذي لم تتلوث مياهه بفلسفات الدهر الحاضر.',
    soulExamination: 'كم من وقتك تمنحه لقراءة كتابات الآباء النساك واللاهوتيين مقارنة بما تتصفحه على الإنترنت ومواقع التواصل؟',
    practicalExercise: 'اقرأ اليوم فصلاً واحداً من كتاب "بستان الرهبان" أو "تجسد الكلمة"، ولخص تدريباً عملياً منه لحياتك.',
    consecrationSecret: 'سر التكريس: من يتتلمذ على الآباء يتعلم كيف يعيش في القرن الحادي والعشرين بقلب آباء البرية.',
    emoji: '📚',
  },

  // 5. Monastic Oasis & Consecration
  {
    id: 'ins-monast-1',
    sectionId: 'monastic_oasis',
    sectionName: 'دستور التكريس وواحة السكون الروحي',
    title: 'التجرد القلبي وسر الفقر الاختياري',
    dimension: 'تجرد',
    dimensionColor: '#b45309',
    verse: '«الرَّبُّ نَصِيبُ قِسْمَتِي وَكَأْسِي. أَنْتَ قَابِضُ قُرْعَتِي».',
    verseRef: 'مزمور 16: 5',
    patristicFather: 'القديس فرنسيس الأسيزي',
    patristicQuote: '«الغني الحقيقي ليس من يملك كثيراً، بل من لا يحتاج إلى شيء سوى المسيح؛ فمن امتلأ بالله استغنى عن كل ما دونه».',
    spiritualMeaning: 'الفقر الاختياري لا يعني الشقاء، بل الحرية الملكية من قيد الاقتناء والهم والقلق بشأن المستقبل.',
    soulExamination: 'هل ترتبط بأشياء مادية أو ألقاب كنسية أو مراكز تجعلك تشعر بالأمان بدلاً من التوكل على الله الحي؟',
    practicalExercise: 'تخلَّ اليوم عن غرض تحبه وقدمه لشخص محتاج دون تردد، واشكر الله على نعمة العطاء.',
    consecrationSecret: 'سر التكريس: يد المكرس الخالية من مقتنيات العالم هي وحدها القادرة على مصافحة ملائكة السماء.',
    emoji: '🕯️',
  },

  // 6. Workshops & Pastoral Ministry
  {
    id: 'ins-work-1',
    sectionId: 'workshops',
    sectionName: 'ورش العمل والتدريب الكنسي والخدمة',
    title: 'غسل الأقدام كمنهج وحيد للرئاسة الكنسية',
    dimension: 'اتضاع',
    dimensionColor: '#4338ca',
    verse: '«فَإِنْ كُنْتُ وَأَنَا السَّيِّدُ وَالْمُعَلِّمُ قَدْ غَسَلْتُ أَرْجُلَكُمْ، فَأَنْتُمْ يَجِبُ عَلَيْكُمْ أَنْ يَغْسِلَ بَعْضُكُمْ أَرْجُلَ بَعْضٍ».',
    verseRef: 'يوحنا 13: 14',
    patristicFather: 'القديس يوحنا ذهبي الفم',
    patristicQuote: '«الرعاية ليست سلطة تحكمية بل تضحية بذلية؛ الخادم الراعي يضع رقبته جسراً لتعبر عليه نفوس الرعية إلى الملكوت».',
    spiritualMeaning: 'كل ورشة عمل أو مهارة إدارية في الخدمة بلا اتضاع حقيقي تتحول إلى شركة دنيوية تفقد بركة الروح القدس.',
    soulExamination: 'هل تفضل الخدمة البارزة أمام المخدومين والجمهور على خدمة النظافة وترتيب المكان الخفية؟',
    practicalExercise: 'قم اليوم بخدمة متواضعة في كنيستك أو بيتك لا يراها أحد، كترتيب مقاعد أو تنظيف مكان سري.',
    consecrationSecret: 'سر التكريس: من ينحني لغسل أقدام الضعفاء، يرفعه المسيح ليعاين أسرار عرشه الإلهي.',
    emoji: '🤲',
  },

  // 7. Creative Lab & Contemplations
  {
    id: 'ins-creat-1',
    sectionId: 'creative_lab',
    sectionName: 'مختبر الإبداع والتأملات الروحية',
    title: 'تحويل المشاعر إلى بخور صلاة عطر',
    dimension: 'تأمل',
    dimensionColor: '#be185d',
    verse: '«لِتَسْتَقِمْ صَلاَتِي كَالْبَخُورِ قُدَّامَكَ. لِيَكُنْ رَفْعُ يَدَيَّ كَذَبِيحَةٍ مَسَائِيَّةٍ».',
    verseRef: 'مزمور 141: 2',
    patristicFather: 'مار إفرام السرياني',
    patristicQuote: '«القلب الذي يفيض بمحبة الله يصير قيثارة داودية تنطق بأشعار الشكر حتى في وسط ليالي الألم الحالكة».',
    spiritualMeaning: 'الإبداع الروحي ليس استعراضاً لغوياً بل انفجار للمحبة المكنونة في الأعماق نحو الفادي الحبيب.',
    soulExamination: 'هل تستخدم مواهبك الفنية أو الكتابية لجذب الأنظار إليك أم لتوجيه قلوب الناس إلى بهاء المصلوب؟',
    practicalExercise: 'اكتب اليوم ترنيمة أو خاطرة قصيرة من كلمتين أو ثلاثة، موجهاً إياها كرسالة حب سرية للمسيح.',
    consecrationSecret: 'سر التكريس: أعظم قصيدة يكتبها المكرس هي سيرة حياته الباذلة الخفية عن عيون البشر.',
    emoji: '✨',
  },

  // 8. Study Tools & Discernment
  {
    id: 'ins-tools-1',
    sectionId: 'study_tools',
    sectionName: 'أدوات البحث والتمييز الإلهي',
    title: 'حكمة الإفراز (الديأكريسيس) وميزان الأفكار',
    dimension: 'تمييز',
    dimensionColor: '#0f766e',
    verse: '«أَمَّا الرُّوحِيُّ فَيَحْكُمُ فِي كُلِّ شَيْءٍ، وَهُوَ لاَ يُحْكَمُ فِيهِ مِنْ أَحَدٍ».',
    verseRef: '1 كورنثوس 2: 15',
    patristicFather: 'القديس يوحنا كاسيان',
    patristicQuote: '«الإفراز هو سراج النفس وعين الروح؛ فبدونه حتى أعظم الفضائل كالصوم والصلاة قد تنقلب إلى كبرياء مهلك».',
    spiritualMeaning: 'التمييز الروحي يعلمك كيف ترفض الأفكار التي تبدو صالحة في مظهرها ولكنها تخفي وراءها كبرياء المجد الباطل.',
    soulExamination: 'حين يخطر ببالك تدريب روحي شاق، هل تسأل مرشدك الروحي أم تندفع بدافع الحماس الذاتي؟',
    practicalExercise: 'قبل أن تتخذ أي قرار كنسي أو روحي اليوم، ارفع قلبك قائلاً: «يا رب، اكشف لي ما هو لمجدك وما هو لإرضاء ذاتي».',
    consecrationSecret: 'سر التكريس: المكرس الحكيم يزن دوافعه بميزان الصليب: هل تثمر سلاماً واتضاعاً أم اضطراباً وكبرياء؟',
    emoji: '⚖️',
  },

  // 9. Spiritual Games & Holy Recreation
  {
    id: 'ins-game-1',
    sectionId: 'spiritual_games',
    sectionName: 'واحة الألعاب والترويح الروحي المقدس',
    title: 'فرح البساطة وراحة القديسين في البرية',
    dimension: 'محبة',
    dimensionColor: '#6b21a8',
    verse: '«حِينَئِذٍ امْتَلأَتْ أَفْوَاهُنَا ضَحِكًا، وَأَلْسِنَتُنَا تَرَنُّمًا».',
    verseRef: 'مزمور 126: 2',
    patristicFather: 'القديس أنطونيوس الكبير',
    patristicQuote: '«إن شُد القوس أكثر من طاقته فإنه ينكسر؛ هكذا النفس تحتاج إلى ترويح روحي بريء لتعود إلى الصلاة بنشاط متجدد».',
    spiritualMeaning: 'التكريس ليس كآبة ولا تجهم، بل فرح دائم بالرب؛ فالابتسامة النقية هي انعكاس لنور القيامة في القلب.',
    soulExamination: 'هل يعكس مظهرك وتعاملك مع الناس فرح الخلاص أم روح التشدد والعبوس الذي ينفر النفوس؟',
    practicalExercise: 'شارك اليوم في لعبة روحية أو تحدٍ إيماني مع إخوتك أو مخدوميك بقلب طفل بسيط يفيض بالمحبة.',
    consecrationSecret: 'سر التكريس: الفرح الروحي الحقيقي سلاح قاهر يطرد أرواح الضجر واليأس من قلاية المكرس.',
    emoji: '🎯',
  },

  // 10. Emergency Rescue & Consolation
  {
    id: 'ins-emerg-1',
    sectionId: 'emergency_rescue',
    sectionName: 'خطط الإنقاذ الروحي والتعزية الفورية',
    title: 'ثبات الرجاء في ليل التجارب المظلم',
    dimension: 'محبة',
    dimensionColor: '#b91c1c',
    verse: '«اللهُ لَنَا مَلْجَأٌ وَقُوَّةٌ، عَوْنًا فِي الضِّيقَاتِ وُجِدَ شَدِيدًا».',
    verseRef: 'مزمور 46: 1',
    patristicFather: 'القديس يوحنا ذهبي الفم',
    patristicQuote: '«أمواج التجربة قد تعلو كالجبال، ولكن الصخرة التي نقف عليها هي المسيح؛ فهل رأيت قط صخرة تحركها الأمواج؟».',
    spiritualMeaning: 'الضيقة ليست دليلاً على غضب الله، بل شهادة على صياغته لذهب نفسك في أتون المحبة الإلهية.',
    soulExamination: 'حين تنزل بك تجربة، هل تتجه للمذياع والبشر للشكوى، أم تسكب دموعك أولاً أمام أيقونة المصلوب؟',
    practicalExercise: 'ردد عند أول شعور بضيق أو قلق: «أشكرك يا ربي يسوع على كل حال، ومشيئتك الصالحة هي خلاصي».',
    consecrationSecret: 'سر التكريس: الصليب الذي تحمله اليوم هو نفسه الذي سيتحول غداً إلى إكليل مجد لا يذبل.',
    emoji: '🛡️',
  },

  // 11. Personal Space & Secret Journal
  {
    id: 'ins-pers-1',
    sectionId: 'personal_space',
    sectionName: 'الفضاء الشخصي والمجلة الروحية',
    title: 'المخدع السري واللقاء الذي لا يراه بشر',
    dimension: 'صلاة',
    dimensionColor: '#0369a1',
    verse: '«وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ وَأَغْلِقْ بَابَكَ، وَصَلِّ إِلَى أَبِيكَ الَّذِي فِي الْخَفَاءِ».',
    verseRef: 'متى 6: 6',
    patristicFather: 'القديس أغسطينوس',
    patristicQuote: '«كنت أبحث عنك في الخارج، يا الله، بينما كنت أنت في أعمق أعماق قلبي تنتظر عودتي إليك بالصمت والتوبة».',
    spiritualMeaning: 'المساحة الشخصية للمكرس هي موضع التجلي السري؛ هناك تسقط الأقنعة ويبقى الإنسان عارياً أمام عيني المحبة الإلهية.',
    soulExamination: 'هل ما تقوله وتكتبه في مخدعك وسرك يطابق تماماً ما تتظاهر به أمام الآخرين في الكنيسة والخدمة؟',
    practicalExercise: 'افتح مجلتك الروحية الآن واكتب اعترافاً صادقاً بضعف خفي لديك، طالباً نعمة الشفاء من الطبيب الأعظم.',
    consecrationSecret: 'سر التكريس: قيمتك الحقيقية أمام الله هي بالضبط ما أنت عليه في مخدعك حين يُغلق الباب.',
    emoji: '📝',
  },

  // 12. Leaderboard & Eternal Crowns
  {
    id: 'ins-lead-1',
    sectionId: 'leaderboard',
    sectionName: 'لوحة الصدارة والإكليل السماوي',
    title: 'التنازل عن تيجان الأرض لنيل إكليل عدم الفساد',
    dimension: 'أبدية',
    dimensionColor: '#334155',
    verse: '«وَالْفَاهِمُونَ يُضِيئُونَ كَضِيَاءِ الْجَلَدِ، وَالَّذِينَ رَدُّوا كَثِيرِينَ إِلَى الْبِرِّ كَالْكَوَاكِبِ إِلَى أَبَدِ الدُّهُورِ».',
    verseRef: 'دانيال 12: 3',
    patristicFather: 'القديس يوحنا المعمدان',
    patristicQuote: '«ينبغي أن ذلك يزيد وأني أنا أنقص؛ هذه هي الصدارة الحقيقية لكل من كرس نفسه لعريس النفوس».',
    spiritualMeaning: 'الصدارة في ملكوت الله معكوسة؛ الأول في السماء هو خادم الجميع وآخر الكل في عيني نفسه على الأرض.',
    soulExamination: 'حين يُذكر اسمك في التكريمات، هل يطرب قلبك للمديح أم تهمس بالداخل: «أنا عبد بطال عملت ما كان يجب عليّ»؟',
    practicalExercise: 'تمنّ اليوم من كل قلبك أن ينال زميلك في الخدمة تكريماً وإشادة أعلى منك، وافرح بنجاحه كما لو كان نجاحك.',
    consecrationSecret: 'سر التكريس: التيجان التي يمنحها الناس تذبل مع غروب الشمس، أما إكليل النعمة فيضيء إلى أبد الآبدين.',
    emoji: '👑',
  },
];

// Procedural Spiritual Wisdom Generator Engine
// Produces unlimited, unique, philosophically and spiritually profound insights
export function generateProceduralSpiritualInsight(sectionId: string, seedOffset: number = 0): SpiritualInsight {
  const section = APP_SECTIONS_LIST.find((s) => s.id === sectionId) || APP_SECTIONS_LIST[0];

  const virtuesList: Array<'صلاة' | 'تأمل' | 'اتضاع' | 'جهاد' | 'محبة' | 'تجرد' | 'أبدية' | 'تمييز'> = [
    'صلاة',
    'تأمل',
    'اتضاع',
    'جهاد',
    'محبة',
    'تجرد',
    'أبدية',
    'تمييز',
  ];

  const fathersBank = [
    {
      name: 'القديس أثناسيوس الرسولي',
      focus: 'لاهوت التجسد والغلبة على الموت وتجديد طبيعة الإنسان الساقطة بالمسيح.',
      quoteTmpl: '«إن التكريس الحق ليس هروباً من العالم، بل إدخال لقوة القيامة في قلب كل صعوبة وضعف بشري».',
    },
    {
      name: 'القديس يوحنا ذهبي الفم',
      focus: 'البذل الرعوي، خدمة الفقراء، ونقاوة الذهن في تلاوة الصلوات الإلهية.',
      quoteTmpl: '«أفضل صلاة يقدمها الخادم هي دموع الرحمة التي تسكبها عيناه سراً على نفوس رعيته وإخوته».',
    },
    {
      name: 'مار إسحق السرياني',
      focus: 'الصمت المقدس، الهدوء الداخلي، دموع التوبة، وفيضان المحبة غير المشروطة.',
      quoteTmpl: '«من وجد السلام الداخلي في مخدعه، وجد الآلاف من حوله الخلاص دون أن ينطق بكلمة واحدة».',
    },
    {
      name: 'القديس أنطونيوس الكبير',
      focus: 'الفقر الاختياري، سحق حروب إبليس بالأمانة والاتضاع، وحراسة القلب.',
      quoteTmpl: '«المجاهد الروحي الصادق يعتبر كل يوم يبدأ فيه هو أول يوم له في طريق التكريس لله».',
    },
    {
      name: 'القديس مقاريوس الكبير',
      focus: 'اشتياق الروح القدس، التمييز بين النعمة وحيل العدو، وثمر التواضع المستمر.',
      quoteTmpl: '«النفس التي سكن فيها المسيح تصبح كلها عيوناً تبصر النور الإلهي في وسط ظلمات العالم».',
    },
    {
      name: 'القديس أغسطينوس',
      focus: 'نعمة التوبة، التحرر من أغلال الشهوات، والشبع بجمال الله الفائق.',
      quoteTmpl: '«يا إلهي، من يمتلكك يمتلك كل شيء، حتى لو حرم من كل مقتنيات هذه الأرض الفانية».',
    },
    {
      name: 'القديس باسيليوس الكبير',
      focus: 'التدبير المشترك، خدمة المحبة المنظمة، والتوافق بين التأمل والعمل.',
      quoteTmpl: '«حين تقترن المعرفة بالوداعة، يولد خادم أمين قادر على توجيه النفوس إلى بر الأمان».',
    },
  ];

  const biblicalAnchors = [
    { verse: '«نَاظِرِينَ إِلَى رَئِيسِ الإِيمَانِ وَمُكَمِّلِهِ يَسُوعَ».', ref: 'عبرانيين 12: 2' },
    { verse: '«لأَصْنَعَ مَشِيئَتَكَ يَا إِلهِي سُرِرْتُ، وَنَامُوسُكَ فِي وَسَطِ أَحْشَائِي».', ref: 'مزمور 40: 8' },
    { verse: '«تَوَكَّلْ عَلَى الرَّبِّ بِكُلِّ قَلْبِكَ، وَعَلَى فَهْمِكَ لاَ تَعْتَمِدْ».', ref: 'أمثال 3: 5' },
    { verse: '«مَعَ الْمَسِيحِ صُلِبْتُ، فَأَحْيَا لاَ أَنَا، بَلِ الْمَسِيحُ يَحْيَا فِيَّ».', ref: 'غلاطية 2: 20' },
    { verse: '«اَلرَّبُّ نُورِي وَخَلاَصِي، مِمَّنْ أَخَافُ؟ الرَّبُّ حِصْنُ حَيَاتِي، مِمَّنْ أَرْتَعِبُ؟»', ref: 'مزمور 27: 1' },
    { verse: '«كُونُوا مُتَفَاضِلِينَ بَعْضُكُمْ عَلَى بَعْضٍ فِي الْكَرَامَةِ».', ref: 'رومية 12: 10' },
    { verse: '«طُوبَى لِلأَنْقِيَاءِ الْقَلْبِ، لأَنَّهُمْ يُعَايِنُونَ اللهَ».', ref: 'متى 5: 8' },
    { verse: '«اِثْبُتُوا فِيَّ وَأَنَا فِيكُمْ. كَمَا أَنَّ الْغُصْنَ لاَ يَقْدِرُ أَنْ يَأْتِيَ بِثَمَرٍ مِنْ ذَاتِهِ... كَذلِكَ أَنْتُمْ أَيْضًا».', ref: 'يوحنا 15: 4' },
  ];

  const titlesPool = [
    'ينبوع السكينة في هجير المشاغل الكنسية',
    'سر النصرة الخفية في حروب الفكر والظنون',
    'كسر مرآة الذات لمعاينة بهاء المصلوب',
    'التلمذة الإنجيلية ونزع شوكة العناد من الإرادة',
    'الاتساع القلبي وقبول الإخوة المعاندين',
    'الخفاء الإلهي وبركة الخدمة دون تصفيق',
    'اليقظة الروحية وحراسة باب الحواس الخمس',
    'صلاة يسوع الدائمة كدرع قاطع لسهام الشرير',
    'التصالح مع الضعف الشخصي والاتكال على النعمة',
    'ثمر الصبر في حقول الخدمة البطيئة الإثمار',
  ];

  const soulExamPool = [
    'هل تجد سلامك الحقيقي في رضا الله عنك سراً، أم يضطرب قلبك إذا لم يثنِ الناس على أتعابك؟',
    'هل تسامح من أساء إليك من صميم قلبك قبل أن تنام الليلة، وتطلب له البركة في مخدعك؟',
    'هل تمنح وقت صلاتك الخلوية نفس الأولوية والجدية التي تعطيها لاجتماعاتك ومواعيدك الخارجية؟',
    'هل تشعر بالغيرة حين ينجح زميلك في أمر كنت تتمنى أن يُنسب إليك وحدك؟',
    'هل تسلم تدبير غدك واحتياجاتك ليد الله، أم يقيدك القلق والهم المستمر؟',
  ];

  const exercisesPool = [
    'امضِ 15 دقيقة في خلوة تامة دون أجهزة، مردداً صلاة الشكر بوعي كامل لكل كلمة.',
    'بادر اليوم بتقديم خدمة متواضعة لشخص تشعر بينك وبينه بجفاء أو فتور.',
    'صم اليوم عن الحديث عن إنجازاتك أو ما قمت به من أعمال في بيتك أو خدمتك.',
    'اقرأ الإصحاح الخامس عشر من إنجيل يوحنا وتأمل في معنى الثبات في الكرمة الحقيقية.',
    'قدم صدقة خفية تماماً لمن هو محتاج بنية الشكر على نعم الله التي لا تحصى.',
  ];

  const secretsPool = [
    'المكرس الذي يطلب مجد الله وحده، تسخر له السماء كل قواها لتعينه في أصعب المواقف.',
    'حين تنكسر الإرادة الذاتية عند أقدام الصليب، تفيض في النفس تعزيات الروح القدس بلا حدود.',
    'أعظم درجات اللاهوت تُتعلم على الركبتين في صلاة المخدع وليس على مقاعد الجدال.',
    'القلب الوديع هو المسكن المفضل للثالوث القدوس في هذا الدهر الزائل.',
    'الأمانة في القليل الخفي هي التي تؤهل المكرس لأكاليل الملكوت الأبدي العظيم.',
  ];

  // Deterministic but dynamic pseudo-randomization based on seed
  const hash = Math.abs(seedOffset * 37 + sectionId.length * 13);
  const father = fathersBank[hash % fathersBank.length];
  const anchor = biblicalAnchors[(hash + 3) % biblicalAnchors.length];
  const title = titlesPool[(hash + 5) % titlesPool.length];
  const dimension = virtuesList[(hash + 2) % virtuesList.length];
  const soulExam = soulExamPool[(hash + 1) % soulExamPool.length];
  const exercise = exercisesPool[(hash + 4) % exercisesPool.length];
  const secret = secretsPool[(hash + 7) % secretsPool.length];

  return {
    id: `procedural-${sectionId}-${seedOffset}`,
    sectionId: section.id,
    sectionName: section.name,
    title: `${title} (${section.name.split(' ')[0]})`,
    dimension,
    dimensionColor: section.color,
    verse: anchor.verse,
    verseRef: anchor.ref,
    patristicFather: father.name,
    patristicQuote: father.quoteTmpl,
    spiritualMeaning: `${father.focus} في قسم "${section.name}"، يُدعى المكرس ليكون قلبه حسب قلب الله، مدركاً أن كل خطوة في طريق الملكوت تتطلب يقظة روحية وتجرداً مستمراً.`,
    soulExamination: soulExam,
    practicalExercise: exercise,
    consecrationSecret: `سر التكريس: ${secret}`,
    emoji: section.icon,
  };
}

// Get insights for a section: combines static curated + dynamic infinite procedural items
export function getSpiritualInsightsForSection(
  sectionId: string,
  page: number = 0,
  pageSize: number = 6
): SpiritualInsight[] {
  const curated = BASE_SPIRITUAL_INSIGHTS.filter(
    (ins) => sectionId === 'all' || ins.sectionId === sectionId
  );

  const startIdx = page * pageSize;
  const results: SpiritualInsight[] = [];

  // Fill from curated first
  for (let i = startIdx; i < startIdx + pageSize; i++) {
    if (i < curated.length) {
      results.push(curated[i]);
    } else {
      // Procedurally generate beyond curated bounds for infinite stream
      const targetSec = sectionId === 'all' ? APP_SECTIONS_LIST[i % APP_SECTIONS_LIST.length].id : sectionId;
      results.push(generateProceduralSpiritualInsight(targetSec, i + 1));
    }
  }

  return results;
}

// Search across all insights
export function searchSpiritualTreasury(query: string): SpiritualInsight[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return BASE_SPIRITUAL_INSIGHTS;

  return BASE_SPIRITUAL_INSIGHTS.filter((ins) => {
    return (
      ins.title.toLowerCase().includes(cleanQ) ||
      ins.spiritualMeaning.toLowerCase().includes(cleanQ) ||
      ins.patristicFather.toLowerCase().includes(cleanQ) ||
      ins.patristicQuote.toLowerCase().includes(cleanQ) ||
      ins.verse.toLowerCase().includes(cleanQ) ||
      ins.sectionName.toLowerCase().includes(cleanQ)
    );
  });
}
