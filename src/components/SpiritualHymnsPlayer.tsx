import React, { useState } from 'react';
import {
  useHymnsAudio,
  SPIRITUAL_OCCASIONS,
  SpiritualOccasion,
  HymnTrack,
} from '../context/HymnsAudioContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  ListMusic,
  BookOpen,
  Quote,
  ChevronDown,
  ChevronUp,
  Heart,
  Radio,
  Sliders,
} from 'lucide-react';

// Format seconds into MM:SS
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const SpiritualHymnsPlayer: React.FC = () => {
  const {
    currentOccasion,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    isPlayerModalOpen,
    isDockMinimized,
    showLyrics,
    setOccasionById,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    seek,
    openPlayerModal,
    closePlayerModal,
    toggleDockMinimized,
    toggleShowLyrics,
  } = useHymnsAudio();

  const [activeTabInModal, setActiveTabInModal] = useState<'tracks' | 'lyrics'>('tracks');

  return (
    <>
      {/* 1. FLOATING / PERSISTENT DOCK AT SCREEN BOTTOM */}
      <div
        className={`fixed z-40 transition-all duration-300 ${
          isDockMinimized
            ? 'bottom-4 left-4'
            : 'bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-3 pt-1'
        }`}
        dir="rtl"
      >
        {isDockMinimized ? (
          /* Minimized floating pill */
          <button
            onClick={toggleDockMinimized}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-950/95 border border-amber-500/60 shadow-2xl hover:scale-105 transition cursor-pointer text-amber-200 text-xs font-bold backdrop-blur-md"
            title="فتح مشغل الترانيم والألحان"
          >
            <span className="text-base">{currentOccasion.icon}</span>
            <div className="flex items-center gap-1.5">
              {isPlaying ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-2" />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3 delay-75" />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-1.5 delay-150" />
                </div>
              ) : (
                <Music className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="max-w-[120px] truncate">{currentTrack.title}</span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
          </button>
        ) : (
          /* Expanded dock bar */
          <div className="bg-stone-950/95 border border-amber-500/40 rounded-3xl shadow-2xl backdrop-blur-xl p-3 sm:px-5 sm:py-3.5 space-y-2 text-stone-100">
            {/* Top row: Track Info & Controls */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: Track Meta */}
              <div
                onClick={openPlayerModal}
                className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-inner border border-amber-500/40 relative overflow-hidden"
                  style={{ backgroundColor: `${currentOccasion.color}33` }}
                >
                  <span>{currentOccasion.icon}</span>
                  {isPlaying && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-800/40 truncate">
                      {currentOccasion.shortName}
                    </span>
                    <span className="text-[10px] text-stone-400 hidden sm:inline truncate">
                      {currentOccasion.badge}
                    </span>
                  </div>
                  <h4 className="font-spiritual text-xs sm:text-sm font-bold text-stone-100 truncate group-hover:text-amber-300 transition">
                    {currentTrack.title}
                  </h4>
                </div>
              </div>

              {/* Center: Playback Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={prevTrack}
                  className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="الترنيمة السابقة"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition cursor-pointer font-bold"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
                  title="الترنيمة التالية"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Quick Tools */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Volume slider (desktop) */}
                <div className="hidden md:flex items-center gap-2 bg-stone-900/80 px-2.5 py-1 rounded-xl border border-stone-800">
                  <button
                    onClick={toggleMute}
                    className="text-stone-400 hover:text-amber-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 accent-amber-500 h-1 cursor-pointer"
                  />
                </div>

                {/* Lyrics / Meditation button */}
                <button
                  onClick={() => {
                    openPlayerModal();
                    setActiveTabInModal('lyrics');
                  }}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="كلمات وتأملات الترنيمة"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">التأمل</span>
                </button>

                {/* Expand Modal */}
                <button
                  onClick={openPlayerModal}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer"
                  title="تكبير المشغل وقوائم المناسبات"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Minimize to Corner */}
                <button
                  onClick={toggleDockMinimized}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
                  title="تصغير إلى زاوية الشاشة"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom row: Progress bar */}
            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 relative h-1.5 bg-stone-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seek(parseInt(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. FULL MODAL CONTEMPLATIVE PLAYER */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in" dir="rtl">
          <div className="w-full max-w-4xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-right">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl">
                  🎧
                </div>
                <div>
                  <h2 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                    <span>مشغل الترانيم والألحان الكنسية والتأملية</span>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      قوائم المناسبات الروحية
                    </span>
                  </h2>
                  <p className="text-xs text-stone-300">
                    ألحان مقدسة ونغمات تأملية تسكب السكون في القلب أثناء القراءة والمخدع.
                  </p>
                </div>
              </div>

              <button
                onClick={closePlayerModal}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Occasions Selector Pill Bar */}
            <div className="p-3 bg-stone-900/60 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {SPIRITUAL_OCCASIONS.map((occ) => {
                const isSelected = currentOccasion.id === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setOccasionById(occ.id)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border-stone-800 hover:border-amber-600/40'
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span className="font-spiritual">{occ.shortName}</span>
                    <span className="text-[9px] opacity-75 hidden sm:inline">({occ.tracks.length})</span>
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-stone-950 via-stone-900/50 to-stone-950">
              {/* Occasion Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-stone-950 border border-amber-500/20">
                    {currentOccasion.icon}
                  </span>
                  <div>
                    <h3 className="font-spiritual text-base font-bold text-amber-100">
                      {currentOccasion.name}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed mt-0.5">
                      {currentOccasion.description}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-700/50 shrink-0">
                  {currentOccasion.badge}
                </span>
              </div>

              {/* Center Vinyl & Playing Card */}
              <div className="p-6 rounded-3xl bg-stone-900/90 border border-amber-500/30 shadow-xl space-y-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Vinyl Art */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto flex items-center justify-center">
                  <div
                    className={`w-full h-full rounded-full border-4 border-amber-500/50 shadow-2xl flex items-center justify-center bg-radial from-amber-950 via-stone-950 to-black ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '8s' }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-900 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                      {currentOccasion.icon}
                    </div>
                  </div>
                  {isPlaying && (
                    <span className="absolute -bottom-1 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-[10px] font-bold">
                      يعمل الآن بالبركة ♫
                    </span>
                  )}
                </div>

                {/* Track Title */}
                <div className="space-y-1">
                  <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-stone-300">{currentTrack.subtitle}</p>
                </div>

                {/* Progress Slider */}
                <div className="max-w-md mx-auto space-y-1 pt-2">
                  <div className="relative h-2 bg-stone-800 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => seek(parseInt(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Audio Controls */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={prevTrack}
                    className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer"
                    title="الترنيمة السابقة"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition cursor-pointer font-bold"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current translate-x-[-2px]" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer"
                    title="الترنيمة التالية"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume bar */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={toggleMute}
                    className="text-stone-400 hover:text-amber-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-32 accent-amber-500 h-1.5 cursor-pointer"
                  />
                  <span className="text-[10px] text-stone-400 font-mono w-8">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* Switcher Tabs: Playlist vs Lyrics/Meditation */}
              <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                <button
                  onClick={() => setActiveTabInModal('tracks')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTabInModal === 'tracks'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-stone-400 hover:text-white bg-stone-900'
                  }`}
                >
                  <ListMusic className="w-4 h-4" />
                  <span>قائمة ترانيم {currentOccasion.shortName}</span>
                </button>

                <button
                  onClick={() => setActiveTabInModal('lyrics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTabInModal === 'lyrics'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-stone-400 hover:text-white bg-stone-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>كلمات وتأملات الترنيمة الحالية</span>
                </button>
              </div>

              {/* Sub-view 1: Tracks List */}
              {activeTabInModal === 'tracks' && (
                <div className="space-y-2">
                  {currentOccasion.tracks.map((track, idx) => {
                    const isSelected = track.id === currentTrack.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500/80 shadow-md ring-1 ring-amber-400/50'
                            : 'bg-stone-900/90 border-stone-800 hover:border-amber-600/40 hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-amber-500 text-stone-950 font-black'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {isSelected && isPlaying ? '♫' : idx + 1}
                          </span>
                          <div>
                            <h4 className="font-spiritual text-xs sm:text-sm font-bold text-stone-100">
                              {track.title}
                            </h4>
                            <p className="text-[11px] text-stone-400">{track.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-stone-400 font-mono">
                            {formatTime(track.durationSec)}
                          </span>
                          {isSelected && isPlaying ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 text-[10px] font-bold">
                              جارٍ الاستماع
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playTrack(track);
                              }}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-300 transition"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-view 2: Lyrics & Patristic Meditation */}
              {activeTabInModal === 'lyrics' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Lyrics Box */}
                  <div className="rounded-2xl bg-stone-900/90 border border-amber-500/30 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 border-b border-stone-800 pb-2">
                      <Music className="w-4 h-4 text-amber-400" />
                      <span>كلمات الترنيمة والمناجاة:</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual">
                      {currentTrack.lyrics.map((line, lIdx) => (
                        <p key={lIdx} className="italic">
                          «{line}»
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Meditation */}
                  <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>تأمل روحي للمخدع:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                      {currentTrack.meditation}
                    </p>
                  </div>

                  {/* Patristic Quote & Bible Verse */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                        <Quote className="w-3.5 h-3.5" />
                        <span>همسة آبائية:</span>
                      </div>
                      <p className="text-xs text-stone-300 italic leading-relaxed">
                        {currentTrack.patristicQuote}
                      </p>
                      <span className="text-[10px] text-amber-300 font-semibold block text-left">
                        — {currentTrack.patristicSaint}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>شاهد كتابي:</span>
                      </div>
                      <p className="font-spiritual text-xs text-amber-100 font-semibold leading-relaxed">
                        {currentTrack.bibleVerse}
                      </p>
                      <span className="text-[10px] text-amber-300/80 font-mono block text-left">
                        — {currentTrack.bibleRef}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
