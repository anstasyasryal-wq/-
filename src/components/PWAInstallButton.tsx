import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Smartphone, Check, X, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running inside installed standalone PWA
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 5000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // If not running in a browser that supports either flow, hide button
  if (!isInstallable && !isIOS && !justInstalled) {
    return null;
  }

  return (
    <>
      {justInstalled ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold animate-fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>تم تثبيت التطبيق بنجاح! 🎉</span>
        </span>
      ) : variant === 'hero' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>📲 تثبيت التطبيق (PWA)</span>
        </button>
      ) : variant === 'banner' ? (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-4 text-white shadow-md border border-amber-300/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-100 flex items-center gap-1.5">
                <span>تثبيت تطبيق «حَسَبَ قَلْبِ اللهِ» على جهازك</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                تصفح بسرعة فائقة، إشعارات المسيرة، وعمل مستقل عن المتصفح على الهواتف والكمبيوتر.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 font-black text-xs hover:brightness-105 shadow-sm transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isIOS ? 'إضافة إلى الشاشة الرئيسية' : 'تثبيت الآن'}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          title="تثبيت التطبيق على جهازك"
          className={`py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تثبيت التطبيق</span>
          <span className="sm:hidden">تثبيت</span>
        </button>
      )}

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-right">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-amber-300 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">
                  تثبيت التطبيق على iPhone / iPad
                </span>
                <span className="text-xl">🍏</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">
                لإضافة تطبيق «حَسَبَ قَلْبِ اللهِ» إلى شاشتك الرئيسية في متصفح Safari:
              </p>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-950 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-indigo-950 flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  <span>اضغط على زر المشاركة</span>
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px] text-slate-500">(أسفل شاشة Safari)</span>
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
              <p className="text-[11px] text-slate-500 text-center">
                سيعمل التطبيق كأيقونة مستقلة سريعة دون أشرطة المتصفح.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-950 text-white font-bold text-xs hover:bg-indigo-900 transition cursor-pointer"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
