import React from 'react';
import {
  useReadingTheme,
  PaperBackgroundTone,
  TextContrastLevel,
  PaperSofteningLevel,
  ReadingFontSize,
} from '../context/ReadingThemeContext';
import { soundManager } from '../utils/audio';
import {
  Moon,
  Sun,
  Eye,
  Sliders,
  X,
  Check,
  Type,
  BookOpen,
  Sparkles,
  Layers,
  Quote,
  Feather,
  Shield,
  RotateCcw,
} from 'lucide-react';

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isNightMode,
    toggleNightMode,
    setNightMode,
    paperTone,
    setPaperTone,
    contrastLevel,
    setContrastLevel,
    paperSoftening,
    setPaperSoftening,
    fontSize,
    setFontSize,
  } = useReadingTheme();

  if (!isOpen) return null;

  const handleToggle = () => {
    soundManager.playTick();
    toggleNightMode();
  };

  const handleToneChange = (tone: PaperBackgroundTone) => {
    soundManager.playTick();
    setPaperTone(tone);
  };

  const handleContrastChange = (level: TextContrastLevel) => {
    soundManager.playTick();
    setContrastLevel(level);
  };

  const handleSofteningChange = (lvl: PaperSofteningLevel) => {
    soundManager.playTick();
    setPaperSoftening(lvl);
  };

  const handleFontSizeChange = (size: ReadingFontSize) => {
    soundManager.playTick();
    setFontSize(size);
  };

  const handleResetDefaults = () => {
    soundManager.playTick();
    setPaperTone('warm_sepia');
    setContrastLevel('comfortable');
    setPaperSoftening('balanced');
    setFontSize('standard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-right">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto animate-scale-in flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Eye className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="font-spiritual text-lg sm:text-xl font-bold text-stone-900">
                إعدادات القراءة وسكون المخدع
              </h2>
              <p className="text-[11px] text-stone-500">
                مفتاح تبديل وضع القراءة الليلي، تعديل تباين النصوص، وتخفيف خلفية الورق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Main Night Reading Mode Toggle Switch */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex items-center justify-between gap-4 ${
              isNightMode
                ? 'bg-gradient-to-r from-amber-950/40 via-[#221f1a] to-amber-950/20 border-amber-600/70 shadow-sm'
                : 'bg-gradient-to-r from-amber-50/70 via-stone-50 to-amber-100/40 border-amber-200 shadow-xs'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{isNightMode ? '🌙' : '☀️'}</span>
                <span className="font-spiritual text-base sm:text-lg font-bold text-stone-900">
                  وضع القراءة الليلي المريح للعين
                </span>
                {isNightMode ? (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400">
                    مُفعَّل الآن
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    الوضع النهاري
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
                مفتاح التبديل الرئيسي: يخفف إشعاع الشاشة ويضبط التباين على نغمات بردي دافئة لحماية العين أثناء قراءة النصوص الكنسية والتأملات الطويلة.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isNightMode}
              aria-label="تبديل وضع القراءة الليلي المريح للعين"
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                isNightMode ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  isNightMode ? '-translate-x-8' : 'translate-x-0'
                }`}
              >
                {isNightMode ? (
                  <Moon className="w-4 h-4 text-amber-700 fill-amber-700/20" />
                ) : (
                  <Sun className="w-4 h-4 text-stone-400" />
                )}
              </span>
            </button>
          </div>

          {/* Section 1: تخفيف خلفية الورق والبردي */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>تخفيف خلفية الورق والبردي:</span>
              </label>
              <span className="text-[11px] text-stone-500">
                درجات تعتيق البردي بدون وهج أبيض
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'warm_sepia' as PaperBackgroundTone,
                  name: 'ورق سيبيا دافئ',
                  desc: 'صبغة بردي كنسي دافئة ومريحة',
                  previewBg: 'bg-[#221f1a] border-[#3e372d] text-[#e6decf]',
                },
                {
                  id: 'soft_charcoal' as PaperBackgroundTone,
                  name: 'فحم قلاية خافت',
                  desc: 'سكون مظلم هادئ جداً للعين',
                  previewBg: 'bg-[#1c1a18] border-[#36312a] text-[#ded7c8]',
                },
                {
                  id: 'parchment_muted' as PaperBackgroundTone,
                  name: 'بردي معتّق مخفف',
                  desc: 'تعتيق كنسي خفيف بدون وهج',
                  previewBg: 'bg-[#25211b] border-[#423a2f] text-[#eae2d4]',
                },
              ].map((tone) => {
                const isSelected = paperTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => handleToneChange(tone.id)}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-300'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-spiritual text-xs font-bold text-stone-900">
                          {tone.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-normal">
                        {tone.desc}
                      </p>
                    </div>

                    <div
                      className={`mt-2.5 h-6 rounded-lg border text-[9px] flex items-center justify-center font-spiritual font-bold ${tone.previewBg}`}
                    >
                      «عينة البردي»
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Paper Softening Intensity */}
            <div className="pt-1.5 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                <Feather className="w-3.5 h-3.5 text-amber-700" />
                <span>درجة تخفيف توهج السطح:</span>
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'subtle' as PaperSofteningLevel, label: 'خفيف' },
                  { id: 'balanced' as PaperSofteningLevel, label: 'متوازن (موصى به)' },
                  { id: 'deep' as PaperSofteningLevel, label: 'أقصى سكون' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSofteningChange(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      paperSoftening === s.id
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: تعديل تباين النصوص والخطوط */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-700" />
                <span>تعديل تباين النصوص والخطوط:</span>
              </label>
              <span className="text-[11px] text-stone-500">
                درجة وضوح الحروف في الظلام
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'comfortable' as TextContrastLevel,
                  name: 'تباين هادئ ومريح للعين',
                  desc: 'حروف كريمية دافئة تمنع إجهاد العينين في القراءة المطولة',
                  badge: 'موصى به ليلاً',
                },
                {
                  id: 'high' as TextContrastLevel,
                  name: 'تباين عالي وواضح',
                  desc: 'حروف ناصعة ومتباينة بوضوح تام لسهولة التدقيق والسرعة',
                  badge: 'وضوح فائق',
                },
                {
                  id: 'golden_warm' as TextContrastLevel,
                  name: 'تباين كنسي ذهبي',
                  desc: 'صبغة كهرمانية وقورة ملائمة للمزامير والصلوات الكنسية',
                  badge: 'مظهر ليتورجي',
                },
              ].map((lvl) => {
                const isSelected = contrastLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleContrastChange(lvl.id)}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-2 ring-amber-300'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-spiritual text-xs font-bold text-stone-900">
                          {lvl.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-normal mb-2">
                        {lvl.desc}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block self-start ${
                        isSelected
                          ? 'bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-stone-200/70 text-stone-600'
                      }`}
                    >
                      {lvl.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: حجم الخط في النصوص الكنسية الطويلة */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-amber-700" />
              <span>حجم الخط في النصوص والتأملات الكنسية الطويلة:</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'standard' as ReadingFontSize, label: 'عادي (قياسي)' },
                { id: 'large' as ReadingFontSize, label: 'مكبّر مريح (+20%)' },
                { id: 'xlarge' as ReadingFontSize, label: 'كبير للمزامير (+40%)' },
              ].map((sz) => {
                const isSelected = fontSize === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => handleFontSizeChange(sz.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {sz.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Real-time Live Reading Preview Box */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-600">
                معاينة حية فورية لشكل النص الكنسي والورق:
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isNightMode
                  ? paperTone === 'soft_charcoal'
                    ? 'bg-[#1c1a18] border-[#36312a]'
                    : paperTone === 'parchment_muted'
                    ? 'bg-[#25211b] border-[#423a2f]'
                    : 'bg-[#221f1a] border-[#3e372d]'
                  : 'bg-amber-50/60 border-amber-200 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Quote className="w-3.5 h-3.5 text-amber-500" />
                <span
                  className={`text-xs font-spiritual font-bold ${
                    isNightMode ? 'text-amber-300' : 'text-amber-800'
                  }`}
                >
                  سفر المزامير (119: 105)
                </span>
                {isNightMode && (
                  <span className="text-[9px] text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                    ورق مخفف التوهج
                  </span>
                )}
              </div>

              <p
                className={`font-spiritual leading-relaxed ${
                  fontSize === 'xlarge'
                    ? 'text-lg sm:text-xl'
                    : fontSize === 'large'
                    ? 'text-base sm:text-lg'
                    : 'text-sm sm:text-base'
                } ${
                  isNightMode
                    ? contrastLevel === 'high'
                      ? 'text-[#fffdf9] font-bold'
                      : contrastLevel === 'golden_warm'
                      ? 'text-amber-200'
                      : 'text-[#e6decf]'
                    : 'text-stone-900'
                }`}
              >
                «سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي. حَلَفْتُ فَأُثَبِّتُهُ، أَنْ أَحْفَظَ أَحْكَامَ عَدْلِكَ.»
              </p>

              <div
                className={`mt-2.5 pt-2 border-t text-[11px] font-sans flex items-center justify-between ${
                  isNightMode
                    ? 'border-white/10 text-[#9c9384]'
                    : 'border-amber-200/60 text-stone-600'
                }`}
              >
                <span>— القديس يوحنا ذهبي الفم: «كلام الله بلسم النفس وسراج الظلمة.»</span>
                <span className="text-[10px]">
                  {isNightMode ? '🌙 وضع ليلي' : '☀️ وضع نهاري'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            تُحفظ إعدادات القراءة وسكون المخدع تلقائياً على جهازك.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            تطبيق وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
