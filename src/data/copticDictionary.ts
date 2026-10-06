export interface CopticTerm {
  id: string;
  coptic: string;
  transliteration: string;
  arabicMeaning: string;
  category: 'consecration' | 'liturgical' | 'spiritual' | 'titles';
  categoryLabel: string;
  usageContext: string;
  exampleSentence?: string;
}

export const COPTIC_TERMS: CopticTerm[] = [
  {
    id: 'cop-1',
    coptic: 'ⲡⲁⲣⲑⲉⲛⲟⲥ',
    transliteration: 'بارثينوس',
    arabicMeaning: 'عذراء / بتول',
    category: 'consecration',
    categoryLabel: 'ألقاب التكريس',
    usageContext: 'تُطلق على القديسة مريم العذراء، وعلى الفتيات اللاتي نذرن حياتهن في طهارة البتولية للرب.',
    exampleSentence: 'Ⲙⲁⲣⲓⲁ ϯⲡⲁⲣⲑⲉⲛⲟⲥ (مريم العذراء)',
  },
  {
    id: 'cop-2',
    coptic: 'ϯⲇⲓⲁⲕⲟⲛⲓⲥⲥⲁ',
    transliteration: 'تي دياكونيسا',
    arabicMeaning: 'الشماسة / المكرسة الخادمة',
    category: 'consecration',
    categoryLabel: 'ألقاب التكريس',
    usageContext: 'رتبة كنسية تاريخية موثقة في العهد الجديد (فيبي شماسة كنخريا) وخاصة بخدمة النساء والفتيات والفقراء.',
    exampleSentence: 'Ⲫⲓⲃⲏ ϯⲇⲓⲁⲕⲟⲛⲓⲥⲥⲁ (فيبي الشماسة)',
  },
  {
    id: 'cop-3',
    coptic: 'ⲁⲝⲓⲁ',
    transliteration: 'أكسيا',
    arabicMeaning: 'مستحقة',
    category: 'liturgical',
    categoryLabel: 'الطقوس الكنسية',
    usageContext: 'اللحن الطقسي الذي يرتله الشمامسة والشعب عند سيامة أو تكريس الأخت المكرسة اعترافاً باستحقاقها.',
    exampleSentence: 'Ⲁⲝⲓⲁ ⲁⲝⲓⲁ ⲁⲝⲓⲁ ϯⲥⲱⲛⲓ (مستحقة، مستحقة، مستحقة أختنا)',
  },
  {
    id: 'cop-4',
    coptic: 'ⲧⲁⲥⲱⲛⲓ',
    transliteration: 'تاسوني',
    arabicMeaning: 'أختي / أختنا المباركة',
    category: 'titles',
    categoryLabel: 'ألقاب التكريس',
    usageContext: 'اللقب الكنسي التقليدي التكريمي للمكرسة والخادمة في الكنيسة القبطية الأرثوذكسية.',
    exampleSentence: 'Ⲧⲁⲥⲱⲛⲓ ⲙ̀ⲙⲁⲓⲛⲟⲩϯ (الأخت المحبة للإله)',
  },
  {
    id: 'cop-5',
    coptic: 'ϧⲉⲛ ⲟⲩϩⲓⲣⲏⲛⲏ',
    transliteration: 'خين أو هيريني',
    arabicMeaning: 'بسلام',
    category: 'liturgical',
    categoryLabel: 'الطقوس الكنسية',
    usageContext: 'عبارة البركة الختامية في صلوات الكنيسة والتسريح: امضوا بسلام، سلام الرب يكون معكم.',
    exampleSentence: 'Ⲙⲟϣⲓ ϧⲉⲛ ⲟⲩϩⲓⲣⲏⲛⲏ (امضوا بسلام)',
  },
  {
    id: 'cop-6',
    coptic: 'ⲡⲓⲡ̀ⲛⲉⲩⲙⲁ ⲉⲑⲟⲩⲁⲃ',
    transliteration: 'بي بنيفما إثؤواب',
    arabicMeaning: 'الروح القدس',
    category: 'spiritual',
    categoryLabel: 'اللاهوت والروحيات',
    usageContext: 'الأقنوم الثالث في الثالوث القدوس، المعزي والمرشد لحياة التكريس والفضائل.',
    exampleSentence: 'Ϧⲉⲛ ⲫ̀ⲣⲁⲛ ⲙ̀ⲡⲓⲡ̀ⲛⲉⲩⲙⲁ ⲉⲑⲟⲩⲁⲃ (باسم الروح القدس)',
  },
  {
    id: 'cop-7',
    coptic: 'ⲁⲅⲁⲡⲏ',
    transliteration: 'أغابي',
    arabicMeaning: 'محبة إلهية باذلة',
    category: 'spiritual',
    categoryLabel: 'اللاهوت والروحيات',
    usageContext: 'أسمى درجات المحبة الروحية غير المشروطة التي تبذل ذاتها من أجل الآخرين، وركيزة مجتمع التكريس.',
    exampleSentence: 'Ϯⲁⲅⲁⲡⲏ ⲙ̀ⲡⲁⲧⲉⲥϩⲉⲓ (المحبة لا تسقط أبداً)',
  },
  {
    id: 'cop-8',
    coptic: 'ⲙⲉⲧⲁⲛⲟⲓⲁ',
    transliteration: 'ميطانيا',
    arabicMeaning: 'توبة / سجدة انسحاق وخضوع',
    category: 'consecration',
    categoryLabel: 'التقاليد الرهبانية',
    usageContext: 'تغيير الفكر والتوبة المستمرة، وتُطلق أيضاً على سجدة الخضوع وطلب المغفرة بين المكرسات والآباء.',
    exampleSentence: 'Ⲁⲣⲓ ⲟⲩⲙⲉⲧⲁⲛⲟⲓⲁ (اصنعي ميطانيا / توبة)',
  },
  {
    id: 'cop-9',
    coptic: 'ⲉⲩⲭⲁⲣⲓⲥⲧⲓⲁ',
    transliteration: 'إفخارستيا',
    arabicMeaning: 'الشكر / سر الإفخارستيا المقدس',
    category: 'liturgical',
    categoryLabel: 'الطقوس الكنسية',
    usageContext: 'سر الأسرار والقداس الإلهي حيث نقتات بجسد الرب ودمه الأقدسين كينبوع لحياة التكريس.',
    exampleSentence: 'Ϯⲉⲩⲭⲁⲣⲓⲥⲧⲓⲁ ⲉⲑⲟⲩⲁⲃ (الإفخارستيا المقدسة)',
  },
  {
    id: 'cop-10',
    coptic: 'ⲛⲏⲥⲧⲓⲁ',
    transliteration: 'نيستيا',
    arabicMeaning: 'الصوم والنسك',
    category: 'spiritual',
    categoryLabel: 'التقاليد الرهبانية',
    usageContext: 'ضبط النفس وانقطاع الجسد عن الأطعمة لترتفع الروح في صلاة ومطالعة حرة.',
    exampleSentence: 'Ϧⲉⲛ ϩⲁⲛⲛⲏⲥⲧⲓⲁ ⲛⲉⲙ ϩⲁⲛϣ̀ⲗⲏⲗ (بأصوام وصلوات)',
  },
];
