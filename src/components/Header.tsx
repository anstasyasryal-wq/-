import React from 'react';
import { QuizMode } from '../types';
import { 
  Award, 
  Users, 
  User, 
  Zap, 
  BookOpen, 
  Trophy, 
  Volume2, 
  VolumeX, 
  PlusCircle,
  Home,
  Compass,
  Lightbulb
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentMode: QuizMode;
  onSelectMode: (mode: QuizMode) => void;
  onOpenAddQuestion: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenAddQuestion,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 text-stone-100 backdrop-blur-md border-b border-amber-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Spiritual Title */}
          <button 
            onClick={() => onSelectMode('home')}
            className="flex items-center gap-3.5 text-right group focus:outline-none"
            aria-label="الصفحة الرئيسية للمسابقة"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 flex items-center justify-center shadow-md border border-amber-500/30 group-hover:scale-105 transition-transform">
              {/* Coptic / Christian Cross SVG Emblem */}
              <svg 
                viewBox="0 0 24 24" 
                className="w-7 h-7 text-amber-100 fill-current" 
                aria-hidden="true"
              >
                <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
                <circle cx="12" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="6" cy="10" r="1" />
                <circle cx="18" cy="10" r="1" />
                <circle cx="12" cy="4" r="1" />
                <circle cx="12" cy="18" r="1" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-spiritual text-2xl font-bold tracking-wide text-amber-200">
                  مسابقة المكرسة المثالية
                </span>
                <span className="hidden md:inline-block text-[11px] font-sans px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50">
                  إصدار بيوت التكريس والخدام
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans hidden sm:block">
                مسابقة إلكترونية في العلوم الدينية والثقافية والرهبانية
              </p>
            </div>
          </button>

          {/* Navigation Controls */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-stone-950/60 p-1.5 rounded-xl border border-stone-800" aria-label="أقسام التطبيق">
            <button
              onClick={() => onSelectMode('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'home'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => onSelectMode('solo')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'solo'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>المسابقة الفردية</span>
            </button>

            <button
              onClick={() => onSelectMode('team')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'team'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>المسابقة الجماعية</span>
            </button>

            <button
              onClick={() => onSelectMode('oasis')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'oasis'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>واحة الفضائل والتراث</span>
            </button>

            <button
              onClick={() => onSelectMode('creative')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'creative'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>المسابقات الإبداعية</span>
            </button>

            <button
              onClick={() => onSelectMode('speed')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'speed'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>سرعة البرية</span>
            </button>

            <button
              onClick={() => onSelectMode('study')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'study'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>بنك الاستذكار</span>
            </button>

            <button
              onClick={() => onSelectMode('leaderboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'leaderboard'
                  ? 'bg-amber-800/80 text-amber-100 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>لوحة الشرف</span>
            </button>
          </nav>

          {/* Quick Actions (Sound + Add Question) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddQuestion}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 transition-colors"
              title="إضافة سؤال جديد للمسابقة"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">إضافة سؤال</span>
            </button>

            <button
              onClick={onToggleMute}
              className={`p-2.5 rounded-lg border transition-colors ${
                isMuted
                  ? 'bg-stone-800/80 text-stone-500 border-stone-700'
                  : 'bg-stone-800 text-amber-300 border-amber-800/60 hover:bg-stone-700'
              }`}
              title={isMuted ? 'تشغيل المؤثرات الصوتية الروحية' : 'كتم المؤثرات الصوتية'}
              aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2.5 border-t border-stone-800 overflow-x-auto gap-1">
          <button
            onClick={() => onSelectMode('home')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'home' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectMode('solo')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'solo' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الفردية
          </button>
          <button
            onClick={() => onSelectMode('team')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'team' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الجماعية
          </button>
          <button
            onClick={() => onSelectMode('oasis')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'oasis' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الواحة والفضائل
          </button>
          <button
            onClick={() => onSelectMode('creative')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'creative' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            المسابقات الإبداعية
          </button>
          <button
            onClick={() => onSelectMode('speed')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'speed' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            سرعة البرية
          </button>
          <button
            onClick={() => onSelectMode('study')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'study' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الاستذكار
          </button>
          <button
            onClick={() => onSelectMode('leaderboard')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentMode === 'leaderboard' ? 'bg-amber-800 text-amber-100' : 'text-stone-400'
            }`}
          >
            الشرف
          </button>
        </div>

      </div>
    </header>
  );
};

