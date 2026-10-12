import React, { createContext, useContext, useState, useEffect } from 'react';

export type PaperBackgroundTone = 'warm_sepia' | 'soft_charcoal' | 'parchment_muted';
export type TextContrastLevel = 'comfortable' | 'high' | 'golden_warm';
export type PaperSofteningLevel = 'subtle' | 'balanced' | 'deep';
export type ReadingFontSize = 'standard' | 'large' | 'xlarge';

interface ReadingThemeContextType {
  isNightMode: boolean;
  toggleNightMode: () => void;
  setNightMode: (enabled: boolean) => void;
  paperTone: PaperBackgroundTone;
  setPaperTone: (tone: PaperBackgroundTone) => void;
  contrastLevel: TextContrastLevel;
  setContrastLevel: (level: TextContrastLevel) => void;
  paperSoftening: PaperSofteningLevel;
  setPaperSoftening: (level: PaperSofteningLevel) => void;
  fontSize: ReadingFontSize;
  setFontSize: (size: ReadingFontSize) => void;
  // Styling helpers
  getContainerClass: () => string;
  getCardClass: () => string;
  getHeaderTextClass: () => string;
  getBodyTextClass: () => string;
  getMutedTextClass: () => string;
  getVerseBoxClass: () => string;
  getPatristicBoxClass: () => string;
  getFontSizeClass: () => string;
  getBorderClass: () => string;
}

const ReadingThemeContext = createContext<ReadingThemeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NIGHT_MODE: 'hql_night_reading_mode',
  PAPER_TONE: 'hql_reading_paper_tone',
  CONTRAST: 'hql_reading_contrast_level',
  PAPER_SOFTENING: 'hql_reading_paper_softening',
  FONT_SIZE: 'hql_reading_font_size',
};

export const ReadingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNightMode, setIsNightModeState] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEYS.NIGHT_MODE) === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [paperTone, setPaperToneState] = useState<PaperBackgroundTone>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.PAPER_TONE) as PaperBackgroundTone;
        if (saved && ['warm_sepia', 'soft_charcoal', 'parchment_muted'].includes(saved)) {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    return 'warm_sepia';
  });

  const [contrastLevel, setContrastLevelState] = useState<TextContrastLevel>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.CONTRAST) as TextContrastLevel;
        if (saved && ['comfortable', 'high', 'golden_warm'].includes(saved)) {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    return 'comfortable';
  });

  const [paperSoftening, setPaperSofteningState] = useState<PaperSofteningLevel>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.PAPER_SOFTENING) as PaperSofteningLevel;
        if (saved && ['subtle', 'balanced', 'deep'].includes(saved)) {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    return 'balanced';
  });

  const [fontSize, setFontSizeState] = useState<ReadingFontSize>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as ReadingFontSize;
        if (saved && ['standard', 'large', 'xlarge'].includes(saved)) {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    return 'standard';
  });

  // Synchronize with document body
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.NIGHT_MODE, String(isNightMode));
        localStorage.setItem(STORAGE_KEYS.PAPER_TONE, paperTone);
        localStorage.setItem(STORAGE_KEYS.CONTRAST, contrastLevel);
        localStorage.setItem(STORAGE_KEYS.PAPER_SOFTENING, paperSoftening);
        localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);

        if (isNightMode) {
          document.body.classList.add('night-reading-active');
          document.documentElement.classList.add('dark-reading-mode');
        } else {
          document.body.classList.remove('night-reading-active');
          document.documentElement.classList.remove('dark-reading-mode');
        }
      }
    } catch (e) {
      console.warn('Failed to save reading preferences:', e);
    }
  }, [isNightMode, paperTone, contrastLevel, paperSoftening, fontSize]);

  const toggleNightMode = () => {
    setIsNightModeState((prev) => !prev);
  };

  const setNightMode = (enabled: boolean) => {
    setIsNightModeState(enabled);
  };

  const setPaperTone = (tone: PaperBackgroundTone) => {
    setPaperToneState(tone);
  };

  const setContrastLevel = (level: TextContrastLevel) => {
    setContrastLevelState(level);
  };

  const setPaperSoftening = (level: PaperSofteningLevel) => {
    setPaperSofteningState(level);
  };

  const setFontSize = (size: ReadingFontSize) => {
    setFontSizeState(size);
  };

  // Dynamic class helpers for ecclesiastical reading surfaces
  const getContainerClass = () => {
    if (!isNightMode) {
      return 'bg-slate-50 text-slate-800 transition-colors duration-300';
    }
    if (paperTone === 'soft_charcoal') {
      return paperSoftening === 'deep'
        ? 'bg-[#121110] text-[#ded7c8] transition-colors duration-300'
        : 'bg-[#161514] text-[#ded7c8] transition-colors duration-300';
    }
    if (paperTone === 'parchment_muted') {
      return paperSoftening === 'deep'
        ? 'bg-[#181613] text-[#e8dfcf] transition-colors duration-300'
        : 'bg-[#1d1a16] text-[#e8dfcf] transition-colors duration-300';
    }
    // warm_sepia default
    return paperSoftening === 'deep'
      ? 'bg-[#151311] text-[#e4dbcc] transition-colors duration-300'
      : 'bg-[#1a1715] text-[#e4dbcc] transition-colors duration-300';
  };

  const getCardClass = () => {
    if (!isNightMode) {
      return 'bg-white border-stone-200 text-stone-900 shadow-xs transition-colors duration-200';
    }
    if (paperTone === 'soft_charcoal') {
      return 'bg-[#1c1a18] border-[#36312a] text-[#ded7c8] shadow-md transition-colors duration-200';
    }
    if (paperTone === 'parchment_muted') {
      return 'bg-[#25211b] border-[#423a2f] text-[#eae2d4] shadow-md transition-colors duration-200';
    }
    // warm_sepia
    return 'bg-[#221f1a] border-[#3e372d] text-[#e6decf] shadow-md transition-colors duration-200';
  };

  const getHeaderTextClass = () => {
    if (!isNightMode) {
      return 'text-stone-900';
    }
    if (contrastLevel === 'high') {
      return 'text-[#fffdf9] font-black drop-shadow-2xs';
    }
    if (contrastLevel === 'golden_warm') {
      return 'text-amber-200 font-bold';
    }
    return 'text-[#f5ede0] font-bold';
  };

  const getBodyTextClass = () => {
    if (!isNightMode) {
      return 'text-stone-700';
    }
    if (contrastLevel === 'high') {
      return 'text-[#fcfaf5] font-medium';
    }
    if (contrastLevel === 'golden_warm') {
      return 'text-[#ebdcc4]';
    }
    return 'text-[#d6cebe]';
  };

  const getMutedTextClass = () => {
    if (!isNightMode) {
      return 'text-stone-500';
    }
    return 'text-[#9c9384]';
  };

  const getVerseBoxClass = () => {
    if (!isNightMode) {
      return 'bg-amber-50/80 border-amber-200 text-amber-950';
    }
    if (contrastLevel === 'high') {
      return 'bg-[#2d261e] border-amber-700/80 text-amber-50';
    }
    if (contrastLevel === 'golden_warm') {
      return 'bg-[#282118] border-amber-700/60 text-amber-200';
    }
    return 'bg-[#28221a] border-amber-800/60 text-amber-100';
  };

  const getPatristicBoxClass = () => {
    if (!isNightMode) {
      return 'bg-indigo-50/40 border-indigo-100 text-indigo-950';
    }
    return 'bg-[#1a2029] border-[#2d3848] text-[#dce4f0]';
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg leading-relaxed';
    if (fontSize === 'xlarge') return 'text-lg sm:text-xl leading-loose';
    return 'text-xs sm:text-sm leading-normal';
  };

  const getBorderClass = () => {
    if (!isNightMode) {
      return 'border-stone-200';
    }
    return 'border-[#383229]';
  };

  return (
    <ReadingThemeContext.Provider
      value={{
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
        getContainerClass,
        getCardClass,
        getHeaderTextClass,
        getBodyTextClass,
        getMutedTextClass,
        getVerseBoxClass,
        getPatristicBoxClass,
        getFontSizeClass,
        getBorderClass,
      }}
    >
      {children}
    </ReadingThemeContext.Provider>
  );
};

export const useReadingTheme = (): ReadingThemeContextType => {
  const context = useContext(ReadingThemeContext);
  if (!context) {
    throw new Error('useReadingTheme must be used within a ReadingThemeProvider');
  }
  return context;
};
