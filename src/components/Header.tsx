import React, { useState } from 'react';
import { User, AppView } from '../types';
import { soundManager } from '../utils/audio';
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
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: AppView;
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  onOpenLogin: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRules,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const navLinks = [
    { view: 'home' as AppView, label: 'الرئيسية', icon: Home },
    { view: 'participants' as AppView, label: 'من سجل؟ (المشاركات)', icon: Users },
    { view: 'competitions_hub' as AppView, label: 'الاختبارات والمسابقات', icon: Sparkles },
    { view: 'leaderboard' as AppView, label: 'الترتيب العام', icon: Trophy },
    { view: 'dioceses' as AppView, label: 'الإيبارشيات', icon: Layers },
    { view: 'supervisor' as AppView, label: 'لوحة المشرفة', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
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
              <span className="font-spiritual font-black text-base sm:text-lg text-indigo-950 tracking-wide">
                المكرَّسة المثالية
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>🟢 مفتوحة</span>
              </span>
            </div>
            <p className="text-[10px] text-amber-700 font-medium hidden sm:block">
              مسابقة المعرفة والذكاء والتحدي
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
                    ? 'bg-amber-100/70 text-indigo-950 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-700" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenRules}
            className="py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-700" />
            <span>قواعد المسابقة</span>
          </button>
        </nav>

        {/* Right Actions: PWA Install, Sound & User Profile */}
        <div className="flex items-center gap-2">
          {/* PWA In-App Install Button */}
          <PWAInstallButton variant="header" />

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* User Profile Pill */}
          {currentUser ? (
            <button
              onClick={onOpenLogin}
              className="py-1.5 px-3 rounded-xl bg-amber-50 border border-amber-300 text-right hover:bg-amber-100 transition cursor-pointer flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                {currentUser.role === 'supervisor' ? '👑' : '🕊️'}
              </div>
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-slate-900 line-clamp-1 max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-amber-800 font-mono">
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
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2 text-right animate-fade-in">
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
            <span>📜 قواعد المسابقة</span>
            <BookOpen className="w-4 h-4 text-sky-700" />
          </button>
        </div>
      )}
    </header>
  );
};
