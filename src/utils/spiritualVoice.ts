// Speech-to-Text and Text-to-Speech service for the Spiritual Guide

export type VisemeState = 'idle' | 'speaking' | 'listening' | 'thinking';

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (error: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

class SpiritualVoiceService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private mouthAnimationInterval: number | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        if (this.recognition) {
          this.recognition.lang = 'ar-EG'; // Egyptian Arabic preference, falls back to Arabic
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
        }
      } catch (err) {
        console.warn('Speech recognition not available', err);
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  /**
   * Start listening to user voice input
   */
  public startListening(
    onResult: (text: string) => void,
    onStateChange?: (isListening: boolean) => void,
    onError?: (err: string) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('خاصية التعرف على الصوت غير مدعومة في هذا المتصفح');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
      return false;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStateChange) onStateChange(true);
      };

      this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript.trim()) {
          onResult(transcript.trim());
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('Recognition error:', err);
        this.isListening = false;
        if (onStateChange) onStateChange(false);
        if (onError) onError('تعذر التقاط الصوت، يرجى المحاولة ثانية');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onStateChange) onStateChange(false);
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Failed to start recognition', err);
      this.isListening = false;
      if (onStateChange) onStateChange(false);
      if (onError) onError('يرجى السماح بالوصول إلى الميكروفون');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition', err);
      }
      this.isListening = false;
    }
  }

  /**
   * Speak response using Text-to-Speech and synchronize lip-sync callback
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onLipSync?: (isMouthOpen: boolean) => void;
      pitch?: number;
      rate?: number;
    }
  ): void {
    if (!this.isSpeechSynthesisSupported()) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.stopSpeaking();

    // Clean text of markdown, asterisks, brackets for natural oral reading
    const cleanText = text
      .replace(/[*#_~`[\]()«»]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Select warm fatherly Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice =
        voices.find((v) => v.lang.startsWith('ar-EG')) ||
        voices.find((v) => v.lang.startsWith('ar')) ||
        voices.find((v) => v.name.toLowerCase().includes('arabic'));

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.lang = 'ar-EG';
      // Dignified, warm, calm, slightly slower tempo for reverent fatherly tone
      utterance.rate = options?.rate ?? 0.88;
      utterance.pitch = options?.pitch ?? 0.92;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (options?.onStart) options.onStart();

        // Lip-sync simulation: mouth toggles smoothly while utterance runs
        let mouthOpen = false;
        this.mouthAnimationInterval = window.setInterval(() => {
          mouthOpen = !mouthOpen;
          if (options?.onLipSync) options.onLipSync(mouthOpen);
        }, 160);
      };

      utterance.onend = () => {
        this.cleanupSpeech();
        if (options?.onLipSync) options.onLipSync(false);
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error', e);
        this.cleanupSpeech();
        if (options?.onLipSync) options.onLipSync(false);
        if (options?.onEnd) options.onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error', err);
      this.cleanupSpeech();
      if (options?.onEnd) options.onEnd();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Error cancelling speech', err);
      }
    }
    this.cleanupSpeech();
  }

  private cleanupSpeech(): void {
    this.isSpeaking = false;
    this.currentUtterance = null;
    if (this.mouthAnimationInterval !== null) {
      clearInterval(this.mouthAnimationInterval);
      this.mouthAnimationInterval = null;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const spiritualVoiceService = new SpiritualVoiceService();
