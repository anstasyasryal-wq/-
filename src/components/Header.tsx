import React, { useState } from 'react';
import { User, AppView } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import {
  Trophy,
  Volume2,
  VolumeX,
  User as UserIcon,
  BookOpen,
  Home,
  Menu,
  X,
  Sparkles,
  Heart,
  ScrollText,
  Moon,
  Sun,
  Gamepad2,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  onOpenLogin: () => void;
  onOpenRules: () => void;
  onOpenSpiritualGuide: () => void;
  onOpenReadingSettings?: () => void;
  onOpenHeavenlyMessage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRules,
  onOpenSpiritualGuide,
  onOpenHeavenlyMessage,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isNightMode, toggleNightMode } = useReadingTheme();

  const toggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const navLinks = [
    { view: 'home' as AppView, label: 'الرئيسية (العجلة)', icon: Home },
    { view: 'monastic_oasis' as AppView, label: 'دستور المكرس', icon: Compass },
    { view: 'spiritual_life' as AppView, label: 'الحياة الروحية', icon: Heart },
    { view: 'competitions_hub' as AppView, label: 'المسابقات والتقييم', icon: Trophy },
    { view: 'leaderboard' as AppView, label: 'لوحة الصدارة', icon: Trophy },
    { view: 'biblical_study' as AppView, label: 'الدراسة والآباء', icon: BookOpen },
    { view: 'library' as AppView, label: 'المكتبة المعرفية', icon: BookOpen },
    { view: 'workshops' as AppView, label: 'ورش العمل', icon: ScrollText },
    { view: 'spiritual_games' as AppView, label: 'واحة الألعاب', icon: Gamepad2 },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
        isNightMode
          ? 'bg-[#181614]/95 border-[#383229] text-[#e0d8cb]'
          : 'bg-stone-950/95 border-amber-600/30 text-stone-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none text-right"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition font-bold text-xl">
            ✝️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-spiritual font-black text-lg sm:text-xl tracking-wide text-amber-100">
                حسب قلب الله
              </span>
            </div>
            <p className="text-[10px] text-amber-400/80 hidden sm:block">
              بوابة التكريس والعلوم الكنسية والتقييم الروحي
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 5).map((l) => (
            <button
              key={l.view}
              onClick={() => onNavigate(l.view)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                currentView === l.view
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>{l.label}</span>
            </button>
          ))}
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Heavenly Message Button */}
          <button
            onClick={onOpenHeavenlyMessage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/30 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-400/50 text-amber-200 text-xs font-bold shadow-sm transition cursor-pointer group"
            title="رسالة خاصة من أبيك السماوي بالحظ أو القرعة"
          >
            <span className="text-sm group-hover:scale-125 transition-transform duration-200">💌</span>
            <span className="hidden md:inline">رسالة من أبيك السماوي</span>
            <span className="md:hidden">رسالة اليوم</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition cursor-pointer"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleNightMode}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition cursor-pointer"
            title="تبديل وضع القراءة"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Rules / Guide */}
          <button
            onClick={onOpenRules}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>الدليل</span>
          </button>

          {/* User Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'تسجيل البطاقة'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 p-4 space-y-3 bg-stone-950 animate-fade-in text-right">
          <button
            onClick={() => {
              onOpenHeavenlyMessage?.();
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-700/30 border border-amber-400/40 text-amber-200 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💌</span>
            <span>رسالة من أبيك السماوي (اسحب رسالتك اليوم)</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((l) => (
              <button
                key={l.view}
                onClick={() => {
                  onNavigate(l.view);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-right transition flex items-center gap-2 ${
                  currentView === l.view
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-900 text-stone-200 hover:bg-stone-800'
                }`}
              >
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
