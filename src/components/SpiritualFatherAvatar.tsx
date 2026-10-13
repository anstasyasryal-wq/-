import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Activity, Sparkles, WifiOff } from 'lucide-react';
import spiritualFatherImg from '../assets/images/spiritual_father_avatar_1791703349048.jpg';

export interface SpiritualFatherAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  isMuted: boolean;
  isMotionEnabled: boolean;
  dialect: 'standard' | 'egyptian';
  isLipSyncOpen?: boolean;
  isOnline: boolean;
  onToggleMute: () => void;
  onToggleListening: () => void;
  onToggleMotion: () => void;
  onToggleDialect: () => void;
  activeStatusText?: string;
  size?: 'sm' | 'md' | 'lg';
  customPhoto?: string | null;
}

export const SpiritualFatherAvatar: React.FC<SpiritualFatherAvatarProps> = ({
  isSpeaking,
  isListening,
  isThinking,
  isMuted,
  isMotionEnabled,
  dialect,
  isLipSyncOpen = false,
  isOnline,
  onToggleMute,
  onToggleListening,
  onToggleMotion,
  onToggleDialect,
  activeStatusText,
  size = 'md',
  customPhoto,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [customPhoto]);

  // Natural periodic eye blink effect (every 4-6 seconds)
  useEffect(() => {
    if (!isMotionEnabled) {
      setIsBlinking(false);
      return;
    }

    let blinkTimeout: number;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160); // 160ms blink duration
      const nextDelay = 3500 + Math.random() * 3000;
      blinkTimeout = window.setTimeout(triggerBlink, nextDelay);
    };

    blinkTimeout = window.setTimeout(triggerBlink, 4000);
    return () => clearTimeout(blinkTimeout);
  }, [isMotionEnabled]);

  // Dimensions based on size prop
  const containerClasses = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-56 h-56 sm:w-64 sm:h-64',
  }[size];

  // Head tilt & breathing motion classes
  let motionClasses = '';
  if (isMotionEnabled) {
    if (isSpeaking) {
      motionClasses = 'animate-[pulse_2.2s_ease-in-out_infinite] scale-[1.015]';
    } else if (isListening) {
      motionClasses = 'rotate-[-1deg] translate-y-[-2px] transition-transform duration-500';
    } else if (isThinking) {
      motionClasses = 'rotate-[1deg] translate-y-[1px] transition-transform duration-700';
    } else {
      motionClasses = 'hover:scale-[1.02] transition-transform duration-700';
    }
  }

  const getStatusBadge = () => {
    if (isListening) {
      return {
        text: 'ينصت إليك بمحبة...',
        bg: 'bg-rose-500/90 text-white border-rose-300',
        dot: 'bg-white animate-ping',
      };
    }
    if (isThinking) {
      return {
        text: 'يتأمل ويعدّ الإرشاد...',
        bg: 'bg-amber-500/90 text-indigo-950 border-amber-300',
        dot: 'bg-amber-200 animate-pulse',
      };
    }
    if (isSpeaking) {
      return {
        text: 'يتحدث بالبركة والنصيحة...',
        bg: 'bg-emerald-600/95 text-white border-emerald-300',
        dot: 'bg-emerald-200 animate-pulse',
      };
    }
    return {
      text: activeStatusText || 'مستعد للإرشاد الروحي',
      bg: 'bg-indigo-900/85 text-amber-100 border-amber-400/30',
      dot: 'bg-emerald-400',
    };
  };

  const status = getStatusBadge();

  return (
    <div className="flex flex-col items-center select-none text-center">
      {/* Outer Glow Halo & Frame */}
      <div className="relative group">
        {/* Divine golden halo aura */}
        <div
          className={`absolute -inset-2.5 rounded-full blur-xl transition-all duration-700 pointer-events-none ${
            isSpeaking
              ? 'bg-gradient-to-r from-amber-400/40 via-emerald-400/30 to-amber-500/40 scale-105'
              : isListening
              ? 'bg-gradient-to-r from-rose-500/40 via-amber-400/30 to-rose-400/40 scale-105'
              : isThinking
              ? 'bg-gradient-to-r from-amber-300/30 via-indigo-400/30 to-amber-400/30'
              : 'bg-gradient-to-r from-amber-500/20 via-amber-300/15 to-indigo-500/20'
          }`}
        />

        {/* Circular Portrait Frame */}
        <div
          className={`relative ${containerClasses} rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-700 via-amber-400 to-amber-200 shadow-xl border-2 border-amber-200/90 transition-all ${motionClasses}`}
        >
          {/* Inner Image Container */}
          <div className="w-full h-full rounded-full overflow-hidden bg-indigo-950 relative flex items-center justify-center">
            {!imageError ? (
              <>
                <img
                  src={(customPhoto && !imageError) ? customPhoto : spiritualFatherImg}
                  alt="المرشد الروحي الأبوي"
                  className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
                  onError={() => setImageError(true)}
                  loading="eager"
                />

                {/* Simulated Eye Blink Overlay */}
                {isBlinking && (
                  <div
                    className="absolute top-[34%] left-[25%] right-[25%] h-3 bg-amber-950/90 backdrop-blur-[1px] rounded-full transition-opacity duration-100 pointer-events-none"
                    style={{ filter: 'blur(0.5px)' }}
                  />
                )}

                {/* Lip Sync Mouth Overlay when Speaking */}
                {isSpeaking && (
                  <div
                    className={`absolute bottom-[28%] left-[42%] right-[42%] transition-all duration-150 rounded-full bg-amber-950/70 border border-amber-800/40 pointer-events-none ${
                      isLipSyncOpen ? 'h-2 scale-y-125 opacity-90' : 'h-1 scale-y-75 opacity-40'
                    }`}
                  />
                )}
              </>
            ) : (
              /* Reverent Coptic Graphic Fallback when image is unavailable */
              <div className="w-full h-full bg-gradient-to-b from-indigo-950 via-indigo-900 to-amber-950 flex flex-col items-center justify-center text-amber-200 p-4">
                <span className="text-3xl sm:text-4xl">⛪</span>
                <span className="text-xs font-spiritual font-bold text-amber-100 mt-1">
                  أبونا الروحي
                </span>
                <span className="text-[10px] text-amber-300/80">المرشد والأب الروحي</span>
              </div>
            )}

            {/* Offline badge overlay on avatar if disconnected */}
            {!isOnline && (
              <div className="absolute top-2 right-2 bg-slate-900/80 text-amber-200 p-1 rounded-full border border-amber-400/40 shadow-xs" title="يعمل بالوضع المحلي الآمن (دون اتصال)">
                <WifiOff className="w-3 h-3 text-amber-300" />
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Waves Visualizer (When speaking or listening) */}
        {(isSpeaking || isListening) && isMotionEnabled && (
          <div className="absolute -bottom-2 inset-x-4 flex items-center justify-center gap-1 bg-indigo-950/90 py-0.5 px-3 rounded-full border border-amber-400/50 shadow-md">
            <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-2 bg-amber-300 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="w-1 h-4 bg-emerald-300 rounded-full animate-bounce [animation-delay:100ms]" />
            <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:200ms]" />
          </div>
        )}
      </div>

      {/* Reverent Title & Status Pill */}
      <div className="mt-3.5 space-y-1 max-w-xs">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-sm sm:text-base font-spiritual font-black text-slate-900">
            أبونا الروحي
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
            مرشد رقمي وقور
          </span>
        </div>

        {/* Dynamic status pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs transition-all ${status.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span>{status.text}</span>
        </div>
      </div>

      {/* Control Buttons Toolbar (Voice, Mic, Motion, Dialect) */}
      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        {/* Toggle Listening (Microphone) */}
        <button
          type="button"
          onClick={onToggleListening}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border border-rose-400 ring-2 ring-rose-400/40 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
          }`}
          title={isListening ? 'إيقاف الاستماع' : 'تحدث بالصوت'}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5 text-white" />
              <span>جاري الاستماع</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-indigo-900" />
              <span>تحدث بالصوت</span>
            </>
          )}
        </button>

        {/* Toggle Speech / Sound (Mute/Unmute) */}
        <button
          type="button"
          onClick={onToggleMute}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
            isMuted
              ? 'bg-slate-100 text-slate-500 border border-slate-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
          }`}
          title={isMuted ? 'الصوت مكتوم (انقر للتشغيل)' : 'الصوت مفعل (انقر للكتم)'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>الصوت مكتوم</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>الصوت مفعّل</span>
            </>
          )}
        </button>

        {/* Toggle Motion (Enable / Disable subtle animations) */}
        <button
          type="button"
          onClick={onToggleMotion}
          className={`py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer ${
            isMotionEnabled
              ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
          title={isMotionEnabled ? 'إيقاف حركة الوجه' : 'تشغيل حركة الوجه'}
        >
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">الحركة:</span>
          <span>{isMotionEnabled ? 'مفعّلة' : 'ثابت'}</span>
        </button>

        {/* Toggle Dialect (Egyptian Colloquial vs. Standard Church Arabic) */}
        <button
          type="button"
          onClick={onToggleDialect}
          className="py-1.5 px-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-indigo-950 border border-indigo-200 transition shadow-xs flex items-center gap-1 cursor-pointer"
          title="تبديل اللهجة بين العامية المصرية والفصحى"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
          <span>{dialect === 'egyptian' ? 'عامية مصرية 🇪🇬' : 'عربية فصحى 📖'}</span>
        </button>
      </div>
    </div>
  );
};
