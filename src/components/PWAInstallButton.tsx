import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Smartphone, Check, X, Sparkles, Monitor, ExternalLink, HelpCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside installed standalone PWA
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const result = await install();
      if (result.handled && result.success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 6000);
      } else if (!result.handled) {
        // If native beforeinstallprompt prompt wasn't available in current window, show guided install modal
        setShowGuideModal(true);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      {justInstalled ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold animate-fade-in shadow-2xs">
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span>تم تثبيت التطبيق بنجاح! 🎉</span>
        </span>
      ) : variant === 'hero' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 transition transform active:scale-95 cursor-pointer disabled:opacity-75 ${className}`}
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>📲 {isInstallable ? 'تثبيت التطبيق بنقرة واحدة (PWA)' : 'تثبيت التطبيق على جهازك'}</span>
        </button>
      ) : variant === 'banner' ? (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-4 text-white shadow-md border border-amber-300/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-100 flex items-center gap-1.5">
                <span>تثبيت تطبيق «حَسَبَ قَلْبِ اللهِ» على هاتفك أو حاسوبك</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                تصفح بسرعة فائقة، وعمل مستقل عن المتصفح، مع إمكانية التصفح دون اتصال بالإنترنت.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-indigo-950 font-black text-xs shadow-md transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isInstallable ? 'تثبيت الآن بنقرة واحدة' : 'تثبيت التطبيق'}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="تثبيت التطبيق على جهازك"
          className={`py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-75 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تثبيت التطبيق</span>
          <span className="sm:hidden">تثبيت</span>
        </button>
      )}

      {/* Guided Install Modal for devices where beforeinstallprompt is deferred or iOS */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-right">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-amber-300 text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">
                  تثبيت تطبيق «حَسَبَ قَلْبِ اللهِ»
                </span>
                <span className="text-xl">📲</span>
              </div>
            </div>

            {/* iOS Safari Guide */}
            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  لإضافة التطبيق إلى شاشتك الرئيسية في متصفح Safari على iPhone أو iPad:
                </p>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-indigo-950 flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <span>اضغط على زر المشاركة</span>
                    <Share2 className="w-4 h-4 text-sky-600" />
                    <span className="text-[11px] text-slate-500">(بأسفل شاشة Safari)</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-indigo-950 flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    <span>مرر لأسفل واختر:</span>
                    <span className="text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 font-bold">
                      «إضافة إلى الشاشة الرئيسية» (Add to Home Screen)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-indigo-950 flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    <span>اضغط على «إضافة» (Add) بأعلى اليمين</span>
                  </div>
                </div>
              </div>
            ) : isAndroid ? (
              /* Android Chrome Guide */
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  لتثبيت التطبيق على جهاز أندرويد عبر متصفح Chrome:
                </p>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <span>اضغط على قائمة النقاط الثلاث <strong>(⋮)</strong> بأعلى المتصفح</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    <span>اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    <span>أكّد التثبيت لتظهر أيقونة التطبيق مباشرة على شاشتك</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Chrome / Edge Guide */
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  لتثبيت التطبيق على الكمبيوتر (Windows / Mac):
                </p>
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <span>انظر إلى شريط العنوان في أعلى المتصفح (Address Bar)</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    <span>اضغط على أيقونة التثبيت <strong>(⊕ أو 💻)</strong> بأقصى يسار أو يمين شريط العنوان</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black">
                      3
                    </span>
                    <span>اختر <strong>«تثبيت» (Install)</strong> لتشغيله كنافذة مستقلة وسريعة</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>مميزات التثبيت:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pr-1">
                <li>فتح فوري دون أشرطة المتصفح المزدحمة.</li>
                <li>تخزين البيانات والدروس للعمل في حالات ضعف الاتصال.</li>
                <li>أداء أسرع واستهلاك أقل للبيانات.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs transition cursor-pointer"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
