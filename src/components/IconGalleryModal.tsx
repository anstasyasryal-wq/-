import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { X, Sparkles, BookOpen, Shield, Heart, Eye, Award } from 'lucide-react';

export interface ChurchIconItem {
  id: string;
  title: string;
  artistOrSchool: string;
  century: string;
  location: string;
  spiritualMeaning: string;
  historicalContext: string;
  symbolism: string[];
  emoji: string;
  badge: string;
}

const CHURCH_ICONS_DATA: ChurchIconItem[] = [
  {
    id: 'pantocrator',
    title: 'أيقونة السيد المسيح ضابط الكل (Pantocrator)',
    artistOrSchool: 'المدرسة القبطية البيزنطية العريقة (دير سانت كاترين / دير الأنبا بيشوي)',
    century: 'القرن السادس الميلادي وما بعده',
    location: 'تتوسط حنية الهيكل (التكبير) في الكنائس التقليدية',
    spiritualMeaning: 'تعبر عن المسيح الديان العادل والملك الابدي وفي نفس الوقت الراعي المحب الذي يمسك بيده اليمنى لبركة البشر وبيده اليسرى الإنجيل المقدس.',
    historicalContext: 'تعد أيقونة ضابط الكل أقدم وأعرق الأيقونات في الكنيسة الجامعة، حيث تعكس إعلان رؤية سفر الرؤيا: «أنا هو الألف والياء، الكائن والماضي والآتي، القادر على كل شيء».',
    symbolism: [
      'اليد اليمنى مرفوعة للبركة والتعليم وعلامة السلام الإلهي.',
      'الإنجيل المفتوح بيده اليسرى يضم كلمات النور: «أنا هو نور العالم».',
      'الهالة النورانية تحمل الصليب الإنجيلي غير المنظور مع الحروف اليونانية (Ο ΏΝ) أي الكائن.',
    ],
    emoji: '👑',
    badge: 'المرجع اللاهوتي الأول',
  },
  {
    id: 'theotokos-sign',
    title: 'أيقونة العذراء والدة الإاله (Platytera / السيدة العظيمة)',
    artistOrSchool: 'تراث الفن القبطي الأصيل (لوقا الإنجيلي أول رسام للأيقونات)',
    century: 'القرن الخامس الميلادي (مجمع أفسس)',
    location: 'تزين قبة أو نصف قبة الهيكل خلف المذبح مباشرة',
    spiritualMeaning: 'ترمز إلى تجسد الكلمة الإلهي في احشاء العذراء طهارة القديسة مريم، حيث يظهر عمانوئيل (المسيح الصبي) داخل هالة نورانية في أحشائها معلناً أن السماء اتسعت لما لا وسع له.',
    historicalContext: 'لُقبت بالعذراء «أفسس» أو «أكبر من السماوات» (Platytera ton heaven) بعد تثبيت لقب «ثيوتوكوس» (والدة الإله) في مجمع أفسس سنة 431 م.',
    symbolism: [
      'الأيدي المرفوعة للصلاة الشفاعية عن كل البشرية.',
      'المسيح الصبي في حضنها يرتدي ملابس الملكوت بابتسامة الإحسان الإلهي.',
      'النجوم الثلاث على رداء العذراء تعرمز لدوم بتوليتها (قبل وأثناء وبعد الولادة).',
    ],
    emoji: '🕊️',
    badge: 'أيقونة الشفاعة والبركة',
  },
  {
    id: 'st-antony',
    title: 'أيقونة القديس العظيم الأنبا أنطونيوس أب الرهبان',
    artistOrSchool: 'مدرسة دير الأنبا أنطونيوس بالبحر الأحمر',
    century: 'القرن الرابع الميلادي (عصر الآباء النساك)',
    location: 'توضع عادة في مقصورات الشيوخ وقلالي الرهبان والمكرسين',
    spiritualMeaning: 'رمز الجهاد الروحي الأصيل، انتصار الروح على حروب الشياطين والجسد بواسطة الصلاة والتواجد الإلهي المستمر.',
    historicalContext: 'كتب سيرته العطرة البابا أثناسيوس الرسولي، فصارت دستوراً لكل من يرغب في تكريس قلبه لله بعيداً عن مجد العالم الباطل.',
    symbolism: [
      'عصا التوكل على الله وحبل الصلاة في اليد.',
      'الصحراء والبرية المقفرة التي تحولت ببصلاة إلى بستان لملكوت الله.',
      'الملابس الخشنة (المسوح) وعلامة الفرح السباعي السماوي على محياه.',
    ],
    emoji: '🏔️',
    badge: 'أب الرهبنة والتكريس',
  },
  {
    id: 'archangel-michael',
    title: 'أيقونة رئيس الملائكة الجليل ميخائيل',
    artistOrSchool: 'الفن القبطي الأيقوني (أديرة وادي النطرون)',
    century: 'التراث الكنسي العريق',
    location: 'على بحري الهيكل أو في مدخل الكنيسة كحارس وحامي',
    spiritualMeaning: 'رمز النصرة الإلهية، المدافع عن شعب الله، والقائد الأعلى للجودات السماوية ضد قوات الظلمة والشر.',
    historicalContext: 'تحتفل الكنيسة القبطية بتذكاره المجيد في اليوم الثاني عشر من كل شهر قبطي، باعتباره شفيع السمائيين وحامي الكنيسة.',
    symbolism: [
      'الميزان الذهبي لوزن النفوس وأعمال البر والرحمة.',
      'السيف النوراني القاطع لشرور إبليس وحيله.',
      'الملابس الملكية المرصعة بالأحجار الكريمة دلالة على المجد السماوي.',
    ],
    emoji: '⚔️',
    badge: 'حارس الأسرار والجيوش السماوية',
  },
  {
    id: 'st-mark',
    title: 'أيقونة القديس مارمرقس الرسولي كاروز الديار المصرية',
    artistOrSchool: 'مدرسة الإسكندرية الأيقونية',
    century: 'القرن الأول الميلادي',
    location: 'الكاتدرائية المرقسية الكبرى ومزار الكرازة',
    spiritualMeaning: 'رمز الشهادة للحق الإنجيلي، وتأسيس الكرازة في أفريقيا ودمج الفلسفة بالتسليم الرسولي المستقيم.',
    historicalContext: 'كتب الإنجيل الثاني للبشارة المفرحة، وتثبت كراسته في مصر سنة 61 م، مستشهداً للإيمان في الإسكندرية سنة 68 م.',
    symbolism: [
      'الأسد المجنح (رمز إنجيل مرقس الذي يبدأ بصوت من البرية).',
      'الإنجيل المقدس المفتوح بيديه.',
      'شهيد وعميد أساقفة الكرازة المرقسية.',
    ],
    emoji: '🦁',
    badge: 'كاروز الديار المصرية',
  },
  {
    id: 'good-shepherd',
    title: 'أيقونة الراعي الصالح (The Good Shepherd)',
    artistOrSchool: 'الفن المسيحي المبكر (سراديب الموتى في روما وتراث دير الأنبا بيشوي)',
    century: 'القرن الثاني والثالث الميلادي',
    location: 'توضع في أماكن الخدمة الرعوية والافتفاد',
    spiritualMeaning: 'المحبة الباذلة التي تبحث عن الخروف الضال وتحمله على كتفيها بفرح عظيم وتأتي به إلى الحظيرة الأبدية.',
    historicalContext: 'استخدم المسيحيون الأوائل هذه الرمزية ببراعة فائقة في أواخر عصر الاضطهاد للتعبير عن رعاية المسيح الحانية لنفوسهم في وسط الآلام.',
    symbolism: [
      'الخروف الضال المحمول على المنكبين (رمز الخلاص الفردي والجماعي).',
      'عصا الرعاية والناي الموسيقي المعبر عن تسابيح الفرح السماوي.',
      'المرعى الأخضر والمياه الراكدة خلفه دلالة على مزمور 23.',
    ],
    emoji: '🐑',
    badge: 'المحبة الباذلة والرعاية',
  },
];

interface IconGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
}

export const IconGalleryModal: React.FC<IconGalleryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<ChurchIconItem>(CHURCH_ICONS_DATA[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredIcons = CHURCH_ICONS_DATA.filter(
    (item) =>
      item.title.includes(searchTerm) ||
      item.spiritualMeaning.includes(searchTerm) ||
      item.artistOrSchool.includes(searchTerm)
  );

  const handleSelect = (icon: ChurchIconItem) => {
    soundManager.playTick();
    setSelectedIcon(icon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between text-right shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-spiritual text-xl font-bold text-amber-100">
                🖼️ معرض الأيقونات الكنسية التفاعلي
              </h2>
              <p className="text-xs text-stone-300">
                تأمل في الشرح الروحي واللاهوتي والتاريخي لأعرق الأيقونات القبطية والتقليدية.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Sidebar list of icons */}
          <div className="lg:col-span-5 p-4 border-l border-stone-800 bg-stone-900/50 overflow-y-auto space-y-3 text-right">
            <div className="relative mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في الأيقونات..."
                className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
              <BookOpen className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3" />
            </div>

            <div className="space-y-2">
              {filteredIcons.map((icon) => (
                <div
                  key={icon.id}
                  onClick={() => handleSelect(icon)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                    selectedIcon.id === icon.id
                      ? 'bg-amber-950/60 border-amber-500/80 shadow-md'
                      : 'bg-stone-900 border-stone-800 hover:border-amber-600/40'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-amber-500/20 shrink-0">
                    {icon.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                      {icon.badge}
                    </span>
                    <h4 className="font-spiritual text-xs font-bold text-stone-100 truncate">
                      {icon.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 truncate block">
                      {icon.century}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed View Pane */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6 text-right bg-stone-950">
            <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-[#1c1712] to-amber-950/70 border border-amber-600/40 p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 border-b border-amber-600/30 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-950 border-2 border-amber-400/60 flex items-center justify-center text-4xl shadow-inner">
                  {selectedIcon.emoji}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold inline-block mb-1">
                    {selectedIcon.badge}
                  </span>
                  <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                    {selectedIcon.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {selectedIcon.artistOrSchool} • {selectedIcon.century}
                  </p>
                </div>
              </div>

              {/* Spiritual Meaning */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>المعنى الروحي واللاهوتي</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
                  {selectedIcon.spiritualMeaning}
                </p>
              </div>

              {/* Historical Context */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>السياق التاريخي والكنسي</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
                  {selectedIcon.historicalContext}
                </p>
              </div>

              {/* Symbolism List */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>الرموز والتفاصيل البصرية في الأيقونة</span>
                </h4>
                <ul className="space-y-2">
                  {selectedIcon.symbolism.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-stone-300 flex items-start gap-2 bg-stone-950/50 p-3 rounded-xl border border-stone-900"
                    >
                      <span className="text-amber-400 font-bold">▪️</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 italic bg-amber-950/20 p-3 rounded-xl border border-amber-500/20 text-center">
                📍 مكان الأيقونة التقليدي في الكنيسة: {selectedIcon.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
