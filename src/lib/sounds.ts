type SoundName = "click" | "gem" | "explosion" | "cashout" | "start";

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("mines-muted", JSON.stringify(muted));
    }
  }

  getMuted(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mines-muted");
      if (stored !== null) {
        this.muted = JSON.parse(stored);
      }
    }
    return this.muted;
  }

  play(name: SoundName) {
    if (this.muted || typeof window === "undefined") return;

    const ctx = this.getContext();
    if (ctx.state === "suspended") ctx.resume();

    switch (name) {
      case "click":
        this.playTone(ctx, 600, 0.06, "sine", 0.15);
        break;
      case "gem":
        this.playChime(ctx);
        break;
      case "explosion":
        this.playExplosion(ctx);
        break;
      case "cashout":
        this.playCashout(ctx);
        break;
      case "start":
        this.playStart(ctx);
        break;
    }
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playChime(ctx: AudioContext) {
    const notes = [880, 1100, 1320];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(ctx, freq, 0.15, "sine", 0.12);
      }, i * 60);
    });
  }

  private playExplosion(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  private playCashout(ctx: AudioContext) {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(ctx, freq, 0.2, "sine", 0.1);
      }, i * 80);
    });
  }

  private playStart(ctx: AudioContext) {
    this.playTone(ctx, 440, 0.1, "square", 0.08);
    setTimeout(() => {
      this.playTone(ctx, 660, 0.15, "square", 0.08);
    }, 100);
  }
}

export const soundManager = new SoundManager();
