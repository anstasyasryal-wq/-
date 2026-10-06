/**
 * Web Audio API synthesizer for reverent sound effects and Coptic hymn melodies
 * Completely self-contained with zero external audio assets
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mokarasa_sound_muted');
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mokarasa_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Harmonious bell chime for correct answers
   */
  public playCorrect() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E Major chime

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.25);
      });
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Gentle, mellow wooden tone for incorrect answers
   */
  public playWrong() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.35);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }

  /**
   * Soft timer click
   */
  public playTick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  /**
   * Celebratory fanfare on qualification or stage completion
   */
  public playVictory() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.45);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Synthesize classic Coptic Hymn melodic snippets for Stage 4 (Sensory / Audio Challenge)
   */
  public playHymnSnippet(tune: string): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note frequency mappings
      const noteMap: Record<string, number> = {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.0,
        A4: 440.0,
        B4: 493.88,
        C5: 523.25,
        D5: 587.33,
        E5: 659.25,
      };

      // Sequences for classic hymns
      let sequence: Array<{ note: string; dur: number }> = [];

      switch (tune) {
        case 'golgotha':
          // Solemn, slow meditative minor cadence (C4, D4, Eb4 -> E4, D4, C4)
          sequence = [
            { note: 'E4', dur: 0.5 },
            { note: 'D4', dur: 0.5 },
            { note: 'C4', dur: 0.7 },
            { note: 'D4', dur: 0.4 },
            { note: 'E4', dur: 0.8 },
            { note: 'D4', dur: 0.6 },
            { note: 'C4', dur: 1.2 },
          ];
          break;
        case 'tenen':
          // Fast joyous midnight praise rhythm (G4, A4, B4, C5, B4, A4, G4)
          sequence = [
            { note: 'G4', dur: 0.25 },
            { note: 'A4', dur: 0.25 },
            { note: 'B4', dur: 0.35 },
            { note: 'C5', dur: 0.35 },
            { note: 'B4', dur: 0.25 },
            { note: 'A4', dur: 0.25 },
            { note: 'G4', dur: 0.6 },
          ];
          break;
        case 'shere_ne_maria':
          // Marian Doxology warm melodic phrase (C4, E4, G4, A4, G4, E4, C4)
          sequence = [
            { note: 'C4', dur: 0.35 },
            { note: 'E4', dur: 0.35 },
            { note: 'G4', dur: 0.4 },
            { note: 'A4', dur: 0.5 },
            { note: 'G4', dur: 0.4 },
            { note: 'E4', dur: 0.4 },
            { note: 'C4', dur: 0.8 },
          ];
          break;
        case 'epouro':
          // O King of Peace royal triumphant cadence
          sequence = [
            { note: 'G4', dur: 0.4 },
            { note: 'C5', dur: 0.6 },
            { note: 'B4', dur: 0.3 },
            { note: 'A4', dur: 0.4 },
            { note: 'G4', dur: 0.5 },
            { note: 'A4', dur: 0.4 },
            { note: 'G4', dur: 0.8 },
          ];
          break;
        default:
          // Default gentle chime
          sequence = [
            { note: 'C4', dur: 0.3 },
            { note: 'E4', dur: 0.3 },
            { note: 'G4', dur: 0.5 },
          ];
      }

      let elapsed = 0;
      sequence.forEach((item) => {
        const freq = noteMap[item.note] || 440;
        const startTime = now + elapsed;
        const dur = item.dur;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Use flute-like sine wave with soft envelope
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.02);

        elapsed += dur * 0.9;
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Buzzer tone
   */
  public playBuzzer() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundEffectsManager();
