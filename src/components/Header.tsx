import React, { useState } from 'react';
import { User, AppView } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  Volume2,
  VolumeX,
  User as UserIcon,
  Shield,
  Layers,
  BookOpen,
  Home,
  Menu,
  X,
  Sparkles,
  Users,
  Heart,
  ScrollText,
  Lock,
  Moon,
  Sun,
  Sliders,
  Globe,
  Gamepad2,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: AppView;
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  onOpenLogin: () => void;
  onOpenRules: () => void;
  onOpenSpiritualGuide: () => void;
  onOpenReadingSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRules,
  onOpenSpiritualGuide,
  onOpenReadingSettings,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isNightMode, toggleNightMode } = useReadingTheme();
  const { language, toggleLanguage } = useLanguage();

  const toggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const navLinks = [
    { view: 'home' as AppView, label: 'الرئيسية', icon: Home },
    { view: 'library' as AppView, label: 'المكتبة المعرفية', icon: BookOpen },
    { view: 'workshops' as AppView, label: 'ورش العمل', icon: Layers },
    { view: 'creative_lab' as AppView, label: 'مختبر الإبداع', icon: Sparkles },
    { view: 'study_tools' as AppView, label: 'منصة التدريب', icon: ScrollText },
    { view: 'spiritual_life' as AppView, label: 'الحياة الروحية', icon: Heart },
    { view: 'monastic_oasis' as AppView, label: 'واحة التكريس', icon: Shield },
    { view: 'biblical_study' as AppView, label: 'الدراسة والآباء', icon: BookOpen },
    { view: 'personal_space' as AppView, label: 'المساحة الشخصية', icon: Lock },
    { view: 'competitions_hub' as AppView, label: 'المسابقات الرسمية', icon: Trophy },
    { view: 'leaderboard' as AppView, label: 'الترتيب', icon: Trophy },
    { view: 'spiritual_games' as AppView, label: 'الألعاب الترفيهية', icon: Gamepad2 },
    { view: 'supervisor' as AppView, label: 'الإشراف', icon: Shield },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
        isNightMode
          ? 'bg-[#181614]/95 border-[#383229] text-[#e0d8cb]'
          : 'bg-white/95 border-amber-200/80 text-slate-800'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none text-right"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition">
            <Trophy className="w-5 h-5 text-indigo-950 fill-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-spiritual font-black text-base sm:text-lg tracking-wide ${
                  isNightMode ? 'text-amber-100' : 'text-indigo-950'
                }`}
              >
                حسب قلب الله
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span>🕊️ واحة التكريس</span>
              </span>
            </div>
            <p className="text-[10px] text-amber-700 font-bold hidden sm:block">
              كاهن – مكرَّسة – راهب – راهبة
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? isNightMode
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-700/60'
                      : 'bg-amber-100/70 text-indigo-950 border border-amber-300'
                    : isNightMode
                    ? 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-500" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenRules}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isNightMode
                ? 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>ميثاق وقواعد المسيرة</span>
          </button>

          {/* Spiritual Guide Direct Action Button */}
          <button
            onClick={onOpenSpiritualGuide}
            className="py-1.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-indigo-950 border border-amber-300 shadow-xs transition flex items-center gap-1.5 cursor-pointer group"
            title="فتح المرشد وأبونا الروحي"
          >
            <span className="text-sm group-hover:scale-110 transition">🕊️</span>
            <span>أبونا الروحي</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </nav>

        {/* Right Actions: Reading Mode Toggle, Reading Settings, PWA Install, Sound & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Night Reading Mode Quick Switch */}
          <button
            onClick={() => {
              soundManager.playTick();
              toggleNightMode();
            }}
            title={isNightMode ? 'التبديل إلى الوضع النهاري' : 'تفعيل وضع القراءة الليلي المريح للعين'}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              isNightMode
                ? 'bg-amber-950/70 border-amber-700/60 text-amber-300 hover:bg-amber-900/80 shadow-xs'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-4 h-4 text-amber-400 fill-amber-400/40" />
                <span className="hidden xl:inline text-[11px] font-bold">وضع ليلي</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="hidden xl:inline text-[11px] font-bold text-stone-600">قراءة ليلية</span>
              </>
            )}
          </button>

          {/* Reading Settings Trigger */}
          <button
            onClick={() => {
              soundManager.playTick();
              onOpenReadingSettings();
            }}
            title="إعدادات التطبيق والقراءة وتخفيف خلفية الورق"
            aria-label="إعدادات التطبيق والقراءة"
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              isNightMode
                ? 'border-[#443c32] bg-[#221f1a] text-amber-300 hover:bg-[#2b2721]'
                : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span className="hidden lg:inline text-[11px] font-bold">إعدادات القراءة</span>
          </button>

          {/* PWA In-App Install Button */}
          <PWAInstallButton variant="header" />

          {/* Language Switch Button */}
          <button
            onClick={() => {
              soundManager.playTick();
              toggleLanguage();
            }}
            title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className={`py-1.5 px-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 font-bold text-xs ${
              isNightMode
                ? 'border-[#443c32] bg-[#221f1a] text-amber-300 hover:bg-[#2b2721]'
                : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isNightMode
                ? 'border-[#443c32] bg-[#221f1a] text-stone-300 hover:bg-[#2b2721]'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* Direct Games Button */}
          <button
            onClick={() => {
              soundManager.playTick();
              onNavigate('spiritual_games');
            }}
            title="الألعاب الترفيهية الروحية"
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 ${
              currentView === 'spiritual_games'
                ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-indigo-950 border border-amber-300'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-indigo-950 fill-amber-100" />
            <span className="font-spiritual font-black">الألعاب الروحية</span>
            <span className="bg-amber-950 text-amber-200 text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold">
              جديد
            </span>
          </button>

          {/* User Profile Pill */}
          {currentUser ? (
            <button
              onClick={onOpenLogin}
              className={`py-1.5 px-3 rounded-xl border text-right transition cursor-pointer flex items-center gap-2 ${
                isNightMode
                  ? 'bg-amber-950/60 border-amber-800/60 hover:bg-amber-900/60 text-amber-200'
                  : 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                {currentUser.role === 'supervisor' ? '👑' : '🕊️'}
              </div>
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold line-clamp-1 max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-amber-500 font-mono">
                  {currentUser.code}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="py-2 px-3.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>دخول / تسجيل</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition ${
              isNightMode
                ? 'border-[#443c32] bg-[#221f1a] text-stone-300'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-3 space-y-2 text-right animate-fade-in ${
            isNightMode ? 'border-[#383229] bg-[#1a1815]' : 'border-slate-200 bg-white'
          }`}
        >
          {/* Quick toggle in mobile menu */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              <span>وضع القراءة الليلي:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playTick();
                  toggleNightMode();
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 text-white shadow-xs"
              >
                {isNightMode ? 'إيقاف ☀️' : 'تشغيل 🌙'}
              </button>
              <button
                onClick={() => {
                  soundManager.playTick();
                  onOpenReadingSettings();
                  setMobileMenuOpen(false);
                }}
                className="p-1.5 rounded-lg border border-amber-400 text-amber-600 text-xs"
                title="تخصيص الإعدادات"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prominent Spiritual Games Banner in Mobile Drawer */}
          <button
            onClick={() => {
              soundManager.playTick();
              onNavigate('spiritual_games');
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-indigo-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-md mb-3 cursor-pointer hover:opacity-95"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎮</span>
              <div className="text-right">
                <span className="block font-spiritual font-black text-sm">واحة الألعاب الترفيهية الروحية</span>
                <span className="block text-[10px] text-indigo-950/80 font-normal">مطابقة الفضائل، فوازير، وعجلة الحكمة</span>
              </div>
            </div>
            <span className="bg-indigo-950 text-amber-300 text-[10px] px-2.5 py-1 rounded-full font-bold">
              ابدأ اللعب ✨
            </span>
          </button>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-100 text-indigo-950 font-black'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <Icon className="w-4 h-4 text-amber-700" />
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenRules();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>📜 ميثاق وقواعد المسيرة</span>
            <BookOpen className="w-4 h-4 text-sky-700" />
          </button>

          <button
            onClick={() => {
              onOpenSpiritualGuide();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-indigo-950 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span>🕊️ أبونا الروحي والمرشد</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            </div>
            <span className="text-[10px] bg-amber-200/90 px-2 py-0.5 rounded-full font-bold">محادثة وصوت</span>
          </button>
        </div>
      )}
    </header>
  );
};
