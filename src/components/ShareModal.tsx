import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle, QrCode } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedPre, setCopiedPre] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Exact URLs for this applet
  const devUrl = 'https://ais-dev-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app';
  const preUrl = 'https://ais-pre-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app';

  // Primary URL is current browser origin or devUrl
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : devUrl;

  const shareText = `🕊️ مسيرة «حَسَبَ قَلْبِ اللهِ» (كاهن – مكرَّسة – راهب – راهبة) في العلوم الكنسية والعمق الروحي والرهباني.\nشارك الآن في رحلة المراجعة والنمو الروحي:\n${currentUrl}`;

  const handleCopy = (url: string, isDev: boolean) => {
    navigator.clipboard.writeText(url).then(() => {
      soundManager.playTick();
      if (isDev) {
        setCopiedDev(true);
        setTimeout(() => setCopiedDev(false), 2500);
      } else {
        setCopiedPre(true);
        setTimeout(() => setCopiedPre(false), 2500);
      }
    });
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('🕊️ مسيرة «حَسَبَ قَلْبِ اللهِ» (كاهن – مكرَّسة – راهب – راهبة)')}`;
    window.open(url, '_blank');
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-[#fdfbf7] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-spiritual text-xl font-bold text-amber-200">
              روابط تشغيل ومشاركة المسيرة
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-400 text-amber-900 mx-auto flex items-center justify-center shadow-inner text-2xl">
              🕊️
            </div>
            <h3 className="font-spiritual text-2xl font-bold text-stone-900">
              روابط منصة «حَسَبَ قَلْبِ اللهِ»
            </h3>
            <p className="text-xs text-stone-600 font-sans max-w-sm mx-auto leading-relaxed">
              يمكنكم استخدام ومشاركة الرابط المباشر الفوري أدناه للوصول للمنصة وتثبيتها:
            </p>
          </div>

          {/* Direct Working Link Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>الرابط المباشر الفوري (شغال الآن):</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                جاهز للفتح فوراً
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-300 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={devUrl}
                className="flex-1 text-xs text-stone-700 bg-transparent outline-none font-mono select-all truncate text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => handleCopy(devUrl, true)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0 shadow-xs"
              >
                {copiedDev ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Public Link Box with note */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                رابط النشر والمشاركة العامة (Public Shared Link):
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-300 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={preUrl}
                className="flex-1 text-xs text-stone-700 bg-transparent outline-none font-mono select-all truncate text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => handleCopy(preUrl, false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedPre ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed font-sans pt-1">
              💡 <strong>تنبيه لنشر الرابط للجمهور:</strong> لتفعيل الرابط المشترك للجميع خارج حسابكِ، اضغطي على زر <strong>«Share»</strong> الموجود في الزاوية العلوية اليمنى في شاشة استوديو الذكاء الاصطناعي ليتم تفعيله تلقائياً.
            </p>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>مشاركة عبر واتساب</span>
            </button>

            <button
              type="button"
              onClick={handleShareTelegram}
              className="p-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>مشاركة عبر تيليجرام</span>
            </button>
          </div>

          {/* Toggle QR Code */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 font-bold underline"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQr ? 'إخفاء رمز الاستجابة (QR Code)' : 'عرض رمز الاستجابة السريعة (QR Code) للمسح بكاميرا الهاتف'}</span>
            </button>

            {showQr && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200 inline-block shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="QR Code لرابط المسابقة"
                  className="w-44 h-44 mx-auto"
                />
                <p className="text-[11px] text-stone-500 font-sans mt-2">
                  امسحي الرمز بكاميرا الهاتف للدخول الفوري للمسابقة
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
