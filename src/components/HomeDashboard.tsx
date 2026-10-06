import React from 'react';
import { QuizMode } from '../types';
import { CATEGORIES } from '../data/questions';
import { DailySpiritualVerse } from './DailySpiritualVerse';
import { 
  User, 
  Users, 
  Zap, 
  BookOpen, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  Flame, 
  HeartHandshake,
  Compass,
  IdCard
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectMode: (mode: QuizMode) => void;
  totalQuestionsCount: number;
  totalCompletedCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectMode,
  totalQuestionsCount,
  totalCompletedCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Spiritual Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 border border-amber-900/50 p-8 sm:p-14">
        {/* Decorative background cross glow */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
          <svg viewBox="0 0 24 24" className="w-96 h-96 fill-amber-300">
            <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
            <circle cx="12" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="6" cy="10" r="1" />
            <circle cx="18" cy="10" r="1" />
            <circle cx="12" cy="4" r="1" />
            <circle cx="12" cy="18" r="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>منصة مسابقات بيوت التكريس والشمامسة والخدام</span>
          </div>

          <h1 className="font-spiritual text-3xl sm:text-5xl font-bold tracking-wide text-amber-100 leading-tight mb-4">
            مسابقة المكرسة المثالية
          </h1>

          <p className="font-spiritual text-lg sm:text-xl text-amber-200/90 leading-relaxed mb-4">
            «فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ الَّذِي لَنْ يُنْزَعَ مِنْهَا»
            <span className="text-stone-400 text-sm font-sans mr-2">(لوقا 10: 42)</span>
          </p>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-sans">
            منصة إلكترونية متخصصة للتنافس المعرفي والروحي بين المكرسات والخادمات، تجمع بين نصوص الكتاب المقدس والعقيدة والطقس، وفضائل وسير أمهات وآباء الرهبنة، واللغة القبطية والتراث الكنسي الأصيل.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectMode('solo')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-bold text-sm sm:text-base shadow-lg hover:shadow-amber-900/40 transition-all flex items-center gap-2"
            >
              <User className="w-5 h-5 text-amber-200" />
              <span>المسابقة الفردية (شهادة تقدير)</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectMode('team')}
              className="px-6 py-3.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-100 font-bold text-sm sm:text-base border border-stone-700 shadow-md transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-amber-400" />
              <span>المسابقة الجماعية للفرق</span>
            </button>
          </div>
        </div>

        {/* Live Counters Bottom */}
        <div className="mt-10 pt-6 border-t border-amber-900/40 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-400 font-sans">
          <div>
            <span className="text-amber-300 font-spiritual text-xl font-bold block">
              {totalQuestionsCount} سؤالاً موثقاً
            </span>
            <span>في بنك العلوم الكنسية</span>
          </div>
          <div>
            <span className="text-amber-300 font-spiritual text-xl font-bold block">
              3 فروع تخصصية
            </span>
            <span>دينية، رهبانية، وثقافية</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-amber-300 font-spiritual text-xl font-bold block">
              {totalCompletedCount} متسابقة
            </span>
            <span>مسجلة في لوحة الشرف</span>
          </div>
        </div>
      </div>

      {/* Daily Spiritual Verse Component */}
      <DailySpiritualVerse />

      {/* The 3 Educational & Spiritual Branches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-spiritual text-2xl font-bold text-stone-900">
            فروع العلوم في مسابقة المكرسة
          </h2>
          <button
            onClick={() => onSelectMode('study')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>استعراض بنك الأسئلة</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`p-2.5 rounded-xl ${cat.colorScheme.secondary} shadow-2xs`}>
                  {cat.id === 'religious' && <BookOpen className="w-5 h-5" />}
                  {cat.id === 'monastic' && <Sparkles className="w-5 h-5" />}
                  {cat.id === 'cultural' && <ShieldCheck className="w-5 h-5" />}
                </span>
                <h3 className="font-spiritual text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {cat.title}
                </h3>
              </div>

              <p className="text-xs text-stone-500 font-medium mb-3">
                {cat.subtitle}
              </p>

              <p className="text-xs text-stone-600 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modes Selection Grid */}
      <div className="space-y-4">
        <h2 className="font-spiritual text-2xl font-bold text-stone-900">
          اختر نمط التنافس والاستذكار
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Solo Mode */}
          <div 
            onClick={() => onSelectMode('solo')}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-amber-800" />
              </div>
              <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
                المسابقة الفردية
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                اختبار تفاعلي للمكرسة، مع وسائل مساعدة روحية، واستخراج شهادة تقدير معتمدة بدرجة النجاح ووسام التكريم.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>بدء الاختبار الفردي</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Team Mode */}
          <div 
            onClick={() => onSelectMode('team')}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
                المسابقة الجماعية
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                تحدي لبيوت التكريس والفرق مع جرس السرعة (Buzzer)، تناوب الجولات، ولوحة تحكيم ونقاط حية.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-blue-800">
              <span>تحدي بيوت التكريس</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* 3. Speed Mode */}
          <div 
            onClick={() => onSelectMode('speed')}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-rose-800" />
              </div>
              <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
                تحدي سرعة البرية
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                سجال لمدة 60 ثانية للإجابة المتتالية على أقوال آباء البرية والمصطلحات القبطية مع مضاعفة النقاط.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-800">
              <span>انطلاق الـ 60 ثانية</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* 4. Study Bank */}
          <div 
            onClick={() => onSelectMode('study')}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="font-spiritual text-xl font-bold text-stone-900 mb-1">
                بنك الاستذكار والشروح
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                استعراض كامل لكافة الأسئلة مع أدلتها وشروحها المقتبسة من الكتاب المقدس وبستان الرهبان.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>تصفح الأسئلة</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* Special Feature: Monastic Oasis & Cultural Hub */}
      <div 
        onClick={() => onSelectMode('oasis')}
        className="rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-10 shadow-lg border border-amber-800/60 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-800/80 border border-amber-500/50 flex items-center justify-center text-amber-200 shadow-inner group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-800/60 text-amber-300 border border-amber-600/40">
                  إبداع كنسي حصري
                </span>
                <span className="text-xs text-stone-400 font-sans">جديد</span>
              </div>
              <h3 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
                واحة التكريس والفضائل الرهبانية
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed font-sans">
                استمتعي بـ <strong>عجلة فضائل البرية اليومية</strong> لاقتناء التدريب الروحي، و <strong>المعجم القبطي التفاعلي</strong> لمصطلحات التكريس والليتورجيا مع التحدي السريع، واستخرجي <strong>بطاقة المكرسة الشرفية</strong> المعتمدة.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-colors">
            <span>دخول الواحة الروحية</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Monastic Wisdom of the Desert Fathers */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber-800" />
        </div>
        <div className="space-y-1">
          <h4 className="font-spiritual text-lg font-bold text-amber-950">
            من حكمة بستان الرهبان لأمهات البرية:
          </h4>
          <p className="font-spiritual text-stone-800 text-base leading-relaxed">
            «سُئلت الأم سارة: ما هو الطريق لحفظ النفس في التكريس؟ فقالت: "التمسك بالتواضع، ونبذ مديح الناس، والدوام على صلاة يسوع في القلب مع كل عمل تُباشرينه"».
          </p>
          <p className="text-xs text-stone-500 font-sans pt-1">
            (فردوس الآباء - أقوال الأم سارة عن الصلاة والاتضاع)
          </p>
        </div>
      </div>

    </div>
  );
};
