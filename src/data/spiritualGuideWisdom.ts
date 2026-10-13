import { ConsecrationVocation } from '../types';

export interface SpiritualPromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  targetVocations?: ConsecrationVocation[];
}

export const SPIRITUAL_PROMPT_SUGGESTIONS: SpiritualPromptSuggestion[] = [
  {
    id: 'intro-heart',
    label: 'ما معنى أن أكون «حسب قلب الله»؟',
    prompt: 'يا أبونا، ما هو المعنى الروحي العميق لأن يكون الإنسان خادماً أو مكرساً «حسب قلب الله»؟',
    icon: '❤️',
  },
  {
    id: 'stage-prep',
    label: 'إرشاد للمرحلة القادمة في المسابقة',
    prompt: 'يا أبونا المبارك، كيف أستعد روحياً ومعرفياً لخوض أسئلة وتحديات مراحل المسابقة الكنسية؟',
    icon: '📖',
  },
  {
    id: 'inner-peace',
    label: 'التعامل مع تعب الخدمة والفتور',
    prompt: 'أشعر أحياناً بضغط الخدمة أو فتور في الصلاة، كيف أجدد حرارة قلبي ومحبتي الأولى؟',
    icon: '🕊️',
  },
  {
    id: 'priest-care',
    label: 'أمانة الرعاية وسر الاعتراف',
    prompt: 'كيف يجمع الكاهن بين أمانة الرعاية اليومية وحفظ سلامه الداخلي وسكون مخدعه؟',
    icon: '✝️',
    targetVocations: ['كاهن'],
  },
  {
    id: 'monastic-silence',
    label: 'حفظ الهدوء والسكون في القلاية',
    prompt: 'ما هي نصيحة الآباء لحفظ يقظة الفكر والهدوء في الصلاة والتأمل في الدير؟',
    icon: '⛪',
    targetVocations: ['راهب', 'راهبة'],
  },
  {
    id: 'consecrated-devotion',
    label: 'نصيب مريم الصالح وسط المشغوليات',
    prompt: 'كيف تحفظ المكرسة نصيب مريم الصالح عند قدمي المخلص وسط كثرة التزامات الخدمة؟',
    icon: '🕯️',
    targetVocations: ['مكرسة', 'راهبة'],
  },
  {
    id: 'humility-growth',
    label: 'كيف أراجع نفسي دون إحباط؟',
    prompt: 'عندما أراجع ضعفي أو أخطائي في الخدمة، كيف أحتفظ بالرجاء والتواضع دون صغر نفس؟',
    icon: '🌱',
  },
];

export interface FallbackSpiritualTopic {
  keywords: string[];
  responseArStandard: string;
  responseArEgyptian: string;
  biblicalVerse: string;
  patristicQuote: string;
  practicalAction: string;
}

export const FALLBACK_SPIRITUAL_TOPICS: FallbackSpiritualTopic[] = [
  {
    keywords: ['قلب', 'حسب قلب الله', 'معنى', 'داود'],
    responseArStandard:
      'يا ابني المبارك، أن تكون «حسب قلب الله» لا يعني أنك بلا ضعف أو معصوم من الخطأ، بل يعني أن قلبك تائب، متضع، يبحث عن مسرة الله، ويسكب دموعه أمامه كداود النبي. الله لا يطلب منا كمالاً مظهرياً بل أمانة في المحبة وبذل الذات.',
    responseArEgyptian:
      'يا حبيبي الغالي، ربنا لما قال عن داود «رجل حسب قلبي»، مكانش داود معصوم من الغلط، لكن كان قلبه حنين، سريع التوبة، ومستعد دايماً يعمل مشيئة ربنا. خلي قلبك دايماً بسيط ومحب، ومتقلقش من ضعفك مادمت ماسك في إيد المسيح.',
    biblicalVerse: '«رَعَاهُمْ حَسَبَ كَمَالِ قَلْبِهِ، وَبِمَهَارَةِ يَدَيْهِ هَدَاهُمْ» (مزمور 78: 72)',
    patristicQuote: '«ليس الله يطلب منا أعمالاً عظيمة بقدر ما يطلب محبة نقية في كل عمل صغير.» — القديس يوحنا ذهبي الفم',
    practicalAction: 'خذ 5 دقائق هدوء قبل النوم، واشكر الله على نعم اليوم، وسلّم له نقائصك بقلب مطمئن.',
  },
  {
    keywords: ['مسابقة', 'امتحان', 'مرحلة', 'أسئلة', 'استعداد', 'مذاكرة'],
    responseArStandard:
      'يا ابنتي المباركة، تذكّري أن هذه المنصة ومراحلها ليست امتحاناً مدرسياً لتقييم مقدار قيمتك أمام الله، بل هي نزهة روحية مبهجة ومراجعة معرفية تثري فكرك بنصوص الكتاب وتاريخ الكنيسة وأقوال الآباء. ادخلي بروح الفرح والتعلم، وسجلي معلوماتك بهدوء.',
    responseArEgyptian:
      'يا بنتي المباركة، اعتبري مراحل المسابقة دي فرصة حلوة تفرحي بيها مع الإنجيل وسير القديسين، مش مجرد امتحان نجاح ورسوب. ربنا بيحب فكرنا يتغذى بكلامه، ادخلي بهدوء وصلي دقيقة قبل كل مرحلة.',
    biblicalVerse: '«سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي» (مزمور 119: 105)',
    patristicQuote: '«القراءة الروحية في الكتب المقدسة تجمع العقل المشتت وتروي القلب العطشان.» — القديس مار إسحق السرياني',
    practicalAction: 'استعن بـ «بنك الاستذكار» المتاح في المنصة لمراجعة الشروح والتوثيق الكنسي لكل سؤال.',
  },
  {
    keywords: ['تعب', 'خدمة', 'فتور', 'إرهاق', 'مشغولية', 'جفاف'],
    responseArStandard:
      'حينما تثقل الخدمة أو يعتري النفس فتور، اذهب إلى المذبح أو إلى مخدعك كطفل جريح يستريح في حضن أبيه. لا تجعل الخدمة تبتلع صلاتك؛ فالمسيح هو الخادم الحقيقي وأنت مجرد أداة في يديه الحنونتين.',
    responseArEgyptian:
      'يا ابني، لما تحس بتعب الخدمة أو إن قلبك ناشف شوية، متخافش ومتقساش على نفسك. اقعد مع المسيح شوية في هدوء من غير ما تطلب حاجة، بس قوله: «يا رب أنا تعبان ومحتاج لمستك». راحة الخادم في حضن سيده.',
    biblicalVerse: '«تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ، وَأَنَا أُرِيحُكُمْ» (متى 11: 28)',
    patristicQuote: '«الصلاة ليست فرضاً نؤديه، بل هي تنفس الروح وراحة المحب مع حبيبه.» — القديس أغسطينوس',
    practicalAction: 'توقف عن أي عمل خدمي إداري لمدة نصف ساعة، واقرأ مزموراً واحداً بتأمل وانسكاب.',
  },
  {
    keywords: ['كاهن', 'كهنوت', 'رعاية', 'اعتراف', 'افتقاد'],
    responseArStandard:
      'قدسك يا أبانا المبارك، الكهنوت هو صليب الحب وبذل الذات. سر قوة الكاهن هو قداسه وصلوات المخدع. اغفر للمتعبين، واحتمل الضعفاء، واعلم أن كل نفس يضعها الرب أمامك هي جوهرة اشتراها بدمه الأقدس.',
    responseArEgyptian:
      'يا أبونا المبارك، خدمتك الكهنوتية بركة للدنيا كلها. متشلش هموم الشعب لوحدك، حطهم دايماً على المذبح في صلوات القداس وافتقدهم بروح الحنان وطول البال زي ما المسيح عمل معانا.',
    biblicalVerse: '«ارْعَوْا رَعِيَّةَ اللهِ الَّتِي بَيْنَكُمْ نُظَّاراً، لاَ عَنِ اضْطِرَارٍ بَلْ بِالاخْتِيَارِ» (1 بطرس 5: 2)',
    patristicQuote: '«قلب الراعي يجب أن يكون أوسع من البحر، يسع الجميع بمحبة بلا تمييز.» — القديس يوحنا فم الذهب',
    practicalAction: 'اذكر في صلاة الشكر والقداس القادم أسماء المتألمين والبعيدين الذين تشعر بثقلهم.',
  },
  {
    keywords: ['رهبنة', 'راهب', 'راهبة', 'دير', 'قلاية', 'سكون', 'نسك'],
    responseArStandard:
      'يا أخي الراهب المبارك، وأختي الراهبة الفاضلة، القلاية هي فردوس الراهب وموضع اللقاء السري مع المسيح. احفظا لسانكما من الإدانة، وعيونكما من النظر للوراء. صلاة يسوع الدائمة تجدد قواكما وتبهج النفس بالسلام الذي يفوق كل عقل.',
    responseArEgyptian:
      'يا راهب المسيح ويا راهبته المباركة، الدير هو واحة الصلاة والهدوء. خلي دايماً تسبيحة «يا ربي يسوع المسيح ارحمني» في لسانك وقلبك مع كل عمل يدوي ومع كل صلاة، عشان تفضل القلاية منورة بالسلام.',
    biblicalVerse: '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ» (إشعياء 30: 15)',
    patristicQuote: '«الزم قلايتك، وهي تعلمك كل شيء.» — القديس العظيم الأنبا أنطونيوس كوكب البرية',
    practicalAction: 'ردد صلاة يسوع القصيرة 20 مرة بهدوء وتركيز في الصباح والمساء.',
  },
  {
    keywords: ['مكرسة', 'بنات', 'شماسة', 'تاسوني', 'بتولية'],
    responseArStandard:
      'يا ابنتي المكرسة المباركة، تكريسك هو سر العرس السمائي مع الفادي. كوني مثل فيبي الشماسة خادمة للكنيسة، ومثل مريم أخت لعازر الجالسة عند قدميه، ومثل طابيثا الممتلئة إحساناً. سلامك الداخلي ووداعتك هما أعظم شهادة للمخدومين.',
    responseArEgyptian:
      'يا تاسوني المباركة، تكريسك للمسيح نصيب صالح ميتوصفش. اخدمي الناس بابتسامة وبساطة، ومتخليش الزحمة تاخدك من وقت قعدتك مع الإنجيل. المكرسة الهادية بتملأ المكان كله بركة وفرح.',
    biblicalVerse: '«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ، فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ» (لوقا 10: 42)',
    patristicQuote: '«جمال النفس المكرسة يظهر في صمتها الوديع ومحبتها الباذلة للكل بلا مقابل.» — القديسة الأم سارة',
    practicalAction: 'اقرئي إصحاحاً من رسائل بولس الرسول مع تأمل خاص في فضيلة المحبة والتواضع.',
  },
];

export const GENERAL_SPIRITUAL_FALLBACK: FallbackSpiritualTopic = {
  keywords: [],
  responseArStandard:
    'يا ابني/ابنتي المباركة، سلام المسيح يملأ قلبك وفكرك. مهما كانت تساؤلاتك أو ضغوط خدمتك، تذكّر أن ذراعي الرب مفتوحتان دائماً لاحتضانك. اجعل مسيرتك في هذه المنصة فرصة للمراجعة الهادئة والتأمل في نصوص كنيستنا وتراث آبائنا القديسين، ولا تتردد في استشارة أبيك الروحي في الكنيسة لكل ما يخص حياتك واعترافك.',
  responseArEgyptian:
    'سلام المسيح معاك يا غالي. مهما كانت مشاعرك أو حيرتك، افتكر إن ربنا بيحبك جداً وشايف تعبك وأمانتك. خليك فرحان في مسيرة حسب قلب الله، وصلاتي معاك دايماً، ومتنساش تاخد بركة وإرشاد أب اعترافك في كل خطوة.',
  biblicalVerse: '«سَلاَمِي أَتْرُكُ لَكُمْ. سَلاَمِي أُعْطِيكُمْ. لَيْسَ كَمَا يُعْطِي الْعَالَمُ أُعْطِيكُمْ أَنَا» (يوحنا 14: 27)',
  patristicQuote: '«كن في سلام مع نفسك، فتكون السماء والأرض في سلام معك.» — القديس مار إسحق السرياني',
  practicalAction: 'خذ نفساً هادئاً وصلِّ صلاة الشكر بتأنٍّ، مقدماً كل ما في قلبك بين يدي الفادي الصالح.',
};

export interface FormattedSpiritualResponse {
  paternalAdvice: string;
  biblicalVerse: string;
  patristicQuote: string;
  practicalAction: string;
  fullSpeechText: string;
  source: 'local-patristic' | 'gemini-live';
}

export function findLocalSpiritualGuidance(
  query: string,
  vocation?: ConsecrationVocation,
  dialect: 'standard' | 'egyptian' = 'egyptian',
  conversationHistory?: Array<{ role: string; text: string }>
): FormattedSpiritualResponse {
  const q = query.toLowerCase().trim();

  // Handle user correction / feeling misunderstood / repetition without canned apologies
  if (q.includes('مش فاهمني') || q.includes('فهمتني غلط') || q.includes('مش ده') || q.includes('غلط') || q.includes('بتكرر') || q.includes('تكرار')) {
    // Check if previous history mentioned exhaustion
    const historyText = conversationHistory ? conversationHistory.map(h => h.text).join(' ').toLowerCase() : '';
    const isExhaustedContext = historyText.includes('تعبان') || historyText.includes('مستنزف') || historyText.includes('مش قادر');

    let advice = '';
    if (isExhaustedContext) {
      advice = dialect === 'egyptian'
        ? 'أشكرك لأنك وضحت لي بدقة، الاستنزاف الحقيقي مختلف تماماً عن التهرب، وأنا أستوعب الآن أن طاقتك نفدت بالفعل وتحتاج إلى سكون حقيقي لا إلى مهام جديدة. دعنا نترك المسؤوليات جانبًا الآن ونتأمل في هدوء حضور المسيح معك.'
        : 'أقدر توضيحك تماماً؛ فالاستنزاف الفعلي يختلف عن التهرب، وفهمي السابق لم يكن منصفاً لحجم إنهاكِك. لنركز الآن على استعادة سلامك الداخلي دون أي ضغوط إضافية.';
    } else {
      advice = dialect === 'egyptian'
        ? 'أنا أسمعك بتركيز الآن. فهمي السابق لم يكن دقيقاً، ويسعدني أن تصحح لي لكي ننظر معاً للمسألة من زاويتك أنت لا من منظور عام. ما هي النقطة المحددة التي تود أن نبدأ منها بهدوء؟'
        : 'أنصت إليك بعناية؛ تصحيحك في محله تماماً وسأبني على ما تقوله مباشرة دون افتراضات سابقة. تفضل بتحديد الجانب الأهم بالنسبة لك لنناقشه.';
    }

    return {
      paternalAdvice: advice,
      biblicalVerse: '«رَبِّ، أَنْتَ تَعْلَمُ كُلَّ شَيْءٍ. أَنْتَ تَعْلَمُ أَنِّي أُحِبُّكَ» (يوحنا 21: 17)',
      patristicQuote: '«الاستماع الحقيقي للمتكلم هو أول بوابات الفهم المتبادل والتعزية.» — أقوال الآباء',
      practicalAction: 'خذ نفساً عميقاً، واطرح فكرتك المحددة في سطرين لنتأملها معاً.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Case 1: Exhaustion and guilt (منهك ويشعر بالذنب)
  if (q.includes('منهك') || q.includes('تعبان') || q.includes('مش قادرة') || q.includes('مش قادر') || (q.includes('ذنب') && q.includes('استمرار'))) {
    const advice = dialect === 'egyptian'
      ? 'يا ابني/ابنتي، التعب الجسدي والنفسي مش خطية ولا قلة إيمان. السيد المسيح نفسه كان بيقعد ويستريح على البئر من التعب. ارتاح دلوقتي ومتجلدش نفسك، ربنا مش بيكلف نفساً فوق طاقتها.'
      : 'يا مبارك، الإنهاك الجسدي أو النفسي ليس خطية أو نقصاً في الإيمان. المعلم الصالح يشفق على تعبنا. امنح نفسك فترة هدوء ولا تحمل نفسك ما لا تطيق في هذه اللحظة.';
    return {
      paternalAdvice: advice,
      biblicalVerse: '«تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ... وَأَنَا أُرِيحُكُمْ» (متى 11: 28)',
      patristicQuote: '«الله لا يطلب من الإنسان فوق طاقته، بل يقبل حتى الأنين الصامت.» — القديس إبراهيم البسيط',
      practicalAction: 'توقف فوراً عن أي مهام غير عاجلة، وخذ قسطاً من الراحة الجسدية والذهنية.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Case 2: Evading responsibility (يتهرب من مسئولية)
  if (q.includes('هرب') || q.includes('مش عايز أعمل') || q.includes('مسؤولية') || q.includes('مش فاضي') || q.includes('تهرب')) {
    const advice = dialect === 'egyptian'
      ? 'يا ابني، الهروب من مسئولية واضحة ربنا ائتمنك عليها بيتعب الضمير أكتر. المواجهة بشجاعة مع نعمة ربنا هي الحل، بدل تأجيل اللي المفروض تتداوله بأمانة.'
      : 'يا مبارك، التهرب من المسئولية التي بين يديك لن يريح الفكر بل يضاعف العبء. من الأفضل مواجهة الأمر بأمانة ومسئولية متكلين على معونة الله.';
    return {
      paternalAdvice: advice,
      biblicalVerse: '«كُلُّ مَا تجده يَدُكَ لِتَعْمَلَهُ، فَاعْمَلْهُ بِقُوَّتِكَ» (جامعة 9: 10)',
      patristicQuote: '«الأمانة في القليل تقيمنا على الكثير.» — القديس باسيليوس',
      practicalAction: 'حدد خطوة واحدة عملية مؤجلة وابدأ في تنفيذها اليوم.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Case 3: Admitting a mistake and fixing impact (خطأ ويحتاج اعتراف)
  if (q.includes('غلطت') || q.includes('أخطأت') || q.includes('خطأ') || q.includes('أثر')) {
    const advice = dialect === 'egyptian'
      ? 'الاعتراف بالخطأ بشجاعة والاعتذار لمن أخطأت في حقه وإصلاح الأثر هو طريق السلام الحقيقي. ربنا بيغفر ويدينا قوة نبدأ من جديد بنقاء.'
      : 'الاعتراف الواضح بالخطأ والسعي لإصلاح ما أفسدناه هو دليل على استنارة الضمير ونعمة التوبة العاملة في القلب.';
    return {
      paternalAdvice: advice,
      biblicalVerse: '«إِنِ اعْتَرَفْنَا بخطايانا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا» (1 يو 1: 9)',
      patristicQuote: '«الاعتراف بالخطأ يمحوه، والتجمل به يضاعفه.» — القديس يوحنا ذهبي الفم',
      practicalAction: 'بادر بالاعتذار أو إصلاح الضرر بهدوء ودون أعذار واهية.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Case 4: Self-flagellation over uncontrollable things (يجلد نفسه بلا سبب)
  if (q.includes('أجلد نفسي') || q.includes('لوم') || q.includes('ضميري يأنبني في كل حاجة') || q.includes('خارج عن إرادتي')) {
    const advice = dialect === 'egyptian'
      ? 'جلد الذات المستمر على أمور خارجة عن إرادتك مش تواضع، ده نوع من القسوة على النفس اللي ربنا ما طلبهاش. سيب اللي فات في أمانة فداء الصليب.'
      : 'لوم النفس المفرط على أمور خارجة عن نطاق سيطرتك ليس تواضعاً روحياً بل إنهاكاً للسلام الداخلي. ألقِ حمولك على المسيح وتخلى عن القسوة على ذاتك.';
    return {
      paternalAdvice: advice,
      biblicalVerse: '«إِذاً لاَ شَيْءَ مِنَ الدَّيْنُونَةِ الآنَ عَلَى الَّذِينَ هُمْ فِي الْمَسِيحِ يَسُوعَ» (رو 8: 1)',
      patristicQuote: '«التواضع الحقيقي هو تسليم الضعف للرب بفرح، لا اليأس من النفس.» — القديس اسحق',
      practicalAction: 'اطلب من الله أن يمنحك سلام الضمير ويحررك من القلق المفرط.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Case 5: Asking judgment without info (يطلب حكماً بلا معلومات كافية)
  if (q.includes('مين الصح') || q.includes('مين الغلط') || q.includes('احكم') || q.includes('مين الظالم')) {
    const advice = dialect === 'egyptian'
      ? 'يا ابني، أنا ما أقدرش أحكم على موقف تفاصيله مش واضحة قدامي بدقة أو من طرف واحد. الأفضل تعرض كل ملابسات الموضوع على أب اعترافك الحقيقي عشان يديك إرشاد سليم.'
      : 'يا مبارك، إصدار حكم قاطع دون الإحاطة الكاملة بملابسات الأمر قد يكون غير دقيق. من الحكمة التروي وعرض الأمر كاملاً على أب الاعتراف.';
    return {
      paternalAdvice: advice,
      biblicalVerse: '«لاَ تَحْكُمُوا بحسب الظاهر، بَلِ احْكُمُوا حُكْماً عَادِلاً» (يوحنا 7: 24)',
      patristicQuote: '«من يقضي في أمر قبل تمام معرفته فهو كمن يرمي سهماً في الظلام.» — الآباء',
      practicalAction: 'اجمع أفكارك وعرض القصة بصراحة كاملة على أب اعترافك.',
      fullSpeechText: advice,
      source: 'local-patristic',
    };
  }

  // Standard fallback matching existing logic
  let bestTopic: FallbackSpiritualTopic = GENERAL_SPIRITUAL_FALLBACK;
  let maxScore = 0;

  for (const topic of FALLBACK_SPIRITUAL_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    if (vocation && topic.keywords.some((k) => k.includes(vocation))) {
      score += 2;
    }
    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  const paternalAdvice =
    dialect === 'egyptian' ? bestTopic.responseArEgyptian : bestTopic.responseArStandard;

  const fullSpeechText = `${paternalAdvice} الآية المقدسة تقول: ${bestTopic.biblicalVerse}. ومن أقوال الآباء: ${bestTopic.patristicQuote}. والخطوة العملية: ${bestTopic.practicalAction}`;

  return {
    paternalAdvice,
    biblicalVerse: bestTopic.biblicalVerse,
    patristicQuote: bestTopic.patristicQuote,
    practicalAction: bestTopic.practicalAction,
    fullSpeechText,
    source: 'local-patristic',
  };
}
