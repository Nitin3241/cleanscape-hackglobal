/**
 * Earthy's audio in a browser: the same recorder and player the phone app gets from expo-audio
 * (see `earthy-audio.ts`), built on the browser's own audio so the voice and scan screens run unchanged.
 *
 * What a browser does differently, and how this file deals with it:
 * - A page may only start sound by itself on an audio element that was first used during a tap. A few
 *   elements are made ready on the visitor's first tap and every player borrows one of them.
 * - A clip is fetched whole before it plays, so its length is known and it never stops to wait for the network.
 * - A recording is turned into a small WAV file before it is sent, so every browser sends the same format.
 * - The microphone needs a secure (https) page. Without one, asking for it simply answers "not allowed".
 */
import { useEffect, useState } from 'react';

type AudioSource = { uri?: string } | string | number | null | undefined;
type ContextConstructor = typeof AudioContext;
type SessionType = 'auto' | 'playback' | 'play-and-record';

const LEVEL_FLOOR = -90;
const POOL_SIZE = 4;
const DEFAULT_INTERVAL = 500;
const WAV_RATE = 16000;
// With no sound allowed and no known length, a clip is treated as this long so the screen still moves on.
const UNKNOWN_LENGTH = 3;

/* ------------------------------------------------------------------ shared pieces */

let context: AudioContext | null = null;

/** One AudioContext for the page: it measures the microphone and reads how long a clip is. It plays nothing. */
function audioContext(): AudioContext | null {
  if (context) return context;
  if (typeof window === 'undefined') return null;
  const Constructor: ContextConstructor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: ContextConstructor }).webkitAudioContext;
  if (!Constructor) return null;
  try {
    context = new Constructor();
  } catch {
    context = null;
  }
  return context;
}

/** Decodes a sound file. Older Safari only has the callback form, so that is the one used. */
function decode(audio: BaseAudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const pending = audio.decodeAudioData(data, resolve, reject) as Promise<AudioBuffer> | undefined;
    // Newer browsers return a promise as well; its failure is already reported through `reject`.
    if (pending && typeof pending.catch === 'function') pending.catch(() => {});
  });
}

/** iPhone: says whether the page is recording or playing, so playback comes out of the speaker at full volume. */
function setSession(type: SessionType) {
  try {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session && session.type !== type) session.type = type;
  } catch {
    // Not every browser has this. Sound still works without it.
  }
}

/** Writes sound samples as a one-channel 16-bit WAV file, the plainest sound format there is. */
function wavFile(samples: Float32Array, rate: number): Blob {
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const write = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return new Blob([bytes], { type: 'audio/wav' });
}

/* ------------------------------------------------------------------ audio elements, made ready on a tap */

const pool: HTMLAudioElement[] = [];
const borrowed = new Set<HTMLAudioElement>();
const ready = new WeakSet<HTMLAudioElement>();
// A twentieth of a second of silence. Playing it during a tap is what makes an audio element ready.
let silence = '';
let watching = false;

function makeElement(): HTMLAudioElement {
  const element = new Audio();
  element.preload = 'auto';
  element.setAttribute('playsinline', '');
  return element;
}

/** Runs inside every tap until each spare element has been started once, which is what lets it play later. */
function prepareOnTap() {
  const audio = audioContext();
  if (audio && audio.state !== 'running') audio.resume().catch(() => {});
  for (const element of pool) {
    if (ready.has(element) || borrowed.has(element)) continue;
    try {
      element.src = silence;
      const started = element.play();
      const settle = () => {
        ready.add(element);
        // Only stop the silence: by now a player may have borrowed this element and started a real clip.
        if (element.src === silence) {
          element.pause();
          element.currentTime = 0;
        }
      };
      if (started) started.then(settle).catch(() => {});
      else settle();
    } catch {
      // Try again on the next tap.
    }
  }
}

function watchTaps() {
  if (watching || typeof document === 'undefined') return;
  watching = true;
  silence = URL.createObjectURL(wavFile(new Float32Array(2205), 44100));
  for (let index = 0; index < POOL_SIZE; index += 1) pool.push(makeElement());
  // `touchend` and `click` are the events a browser counts as a tap. Capture runs before the app's own handlers.
  document.addEventListener('touchend', prepareOnTap, true);
  document.addEventListener('click', prepareOnTap, true);
  document.addEventListener('keydown', prepareOnTap, true);
}

function borrowElement(): HTMLAudioElement {
  watchTaps();
  // Prefer one that a tap has already made ready.
  const spare = pool.find((element) => !borrowed.has(element) && ready.has(element)) ?? pool.find((element) => !borrowed.has(element));
  const element = spare ?? makeElement();
  borrowed.add(element);
  return element;
}

function returnElement(element: HTMLAudioElement) {
  element.pause();
  borrowed.delete(element);
}

watchTaps();

/* ------------------------------------------------------------------ player */

export type AudioStatus = {
  currentTime: number;
  duration: number;
  playing: boolean;
  didJustFinish: boolean;
  isLoaded: boolean;
};

class WebPlayer {
  isLoaded = false;
  didJustFinish = false;

  private element: HTMLAudioElement | null = null;
  private listeners = new Set<() => void>();
  private ticker: ReturnType<typeof setInterval> | null = null;
  private loading = 0;
  private objectUrl: string | null = null;
  private length = 0;
  private wantsToPlay = false;
  // Set while the browser refuses to start sound: time still passes, so the words light up and the screen moves on.
  private silent: { startedAt: number; from: number } | null = null;
  private readonly onEnded = () => this.finish();
  private readonly onChange = () => this.tell();
  private readonly onLength = () => {
    const element = this.element;
    if (element && this.length === 0 && Number.isFinite(element.duration)) this.length = element.duration;
    this.tell();
  };

  constructor(private readonly interval: number) {}

  private audio(): HTMLAudioElement {
    if (!this.element) {
      const element = borrowElement();
      element.addEventListener('ended', this.onEnded);
      element.addEventListener('play', this.onChange);
      element.addEventListener('pause', this.onChange);
      element.addEventListener('playing', this.onChange);
      element.addEventListener('loadedmetadata', this.onLength);
      element.addEventListener('durationchange', this.onLength);
      this.element = element;
    }
    return this.element;
  }

  get duration(): number {
    if (this.length > 0) return this.length;
    const length = this.element?.duration;
    return typeof length === 'number' && Number.isFinite(length) ? length : 0;
  }

  get currentTime(): number {
    if (this.silent) {
      const now = this.silent.from + (Date.now() - this.silent.startedAt) / 1000;
      return Math.min(now, this.duration || UNKNOWN_LENGTH);
    }
    return this.element?.currentTime ?? 0;
  }

  get playing(): boolean {
    if (this.silent) return true;
    const element = this.element;
    return Boolean(element && !element.paused && !element.ended);
  }

  get paused(): boolean {
    return !this.playing;
  }

  get volume(): number {
    return this.element?.volume ?? 1;
  }

  set volume(value: number) {
    this.audio().volume = Math.min(1, Math.max(0, value));
  }

  snapshot(): AudioStatus {
    return {
      currentTime: this.currentTime,
      duration: this.duration,
      playing: this.playing,
      didJustFinish: this.didJustFinish,
      isLoaded: this.isLoaded,
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private tell() {
    this.listeners.forEach((listener) => listener());
  }

  /** Loads a new clip. It is fetched whole first, so its length is known and playback never waits for the network. */
  replace(source: AudioSource) {
    const uri = typeof source === 'string' ? source : source && typeof source === 'object' ? source.uri : undefined;
    const id = ++this.loading;
    this.stopClock();
    this.stopTicker();
    this.isLoaded = false;
    this.didJustFinish = false;
    this.wantsToPlay = false;
    this.length = 0;
    this.element?.pause();
    if (!uri) {
      this.tell();
      return;
    }
    void this.load(uri, id);
  }

  private async load(uri: string, id: number) {
    let address = uri;
    let saved: string | null = null;
    try {
      const response = await fetch(uri);
      if (!response.ok) throw new Error(`The sound answered ${response.status}`);
      const clip = await response.blob();
      if (id !== this.loading) return;
      try {
        const audio = audioContext();
        if (audio) {
          const sound = await decode(audio, await clip.arrayBuffer());
          if (id === this.loading) this.length = sound.duration;
        }
      } catch {
        // The length will come from the audio element instead.
      }
      if (id !== this.loading) return;
      saved = URL.createObjectURL(clip);
      address = saved;
    } catch {
      // Let the audio element fetch it by itself.
      if (id !== this.loading) return;
    }
    const element = this.audio();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = saved;
    element.src = address;
    element.load();
    this.isLoaded = true;
    this.tell();
    if (this.wantsToPlay) this.start();
  }

  play() {
    this.didJustFinish = false;
    if (!this.isLoaded) {
      this.wantsToPlay = true;
      return;
    }
    this.start();
  }

  private start() {
    this.wantsToPlay = false;
    const element = this.audio();
    if (element.ended || (this.duration > 0 && element.currentTime >= this.duration - 0.05)) element.currentTime = 0;
    setSession('playback');
    this.startTicker();
    let started: Promise<void> | undefined;
    try {
      started = element.play();
    } catch {
      this.startClock();
      return;
    }
    if (!started) return;
    started
      .then(() => this.tell())
      .catch((error: unknown) => {
        // "AbortError" only means pause() arrived first. Anything else means the browser will not play it.
        const name = error instanceof Error ? error.name : '';
        if (name !== 'AbortError' && element.paused && this.ticker) this.startClock();
      });
  }

  pause() {
    this.wantsToPlay = false;
    this.stopClock();
    this.stopTicker();
    this.element?.pause();
    this.tell();
  }

  seekTo(seconds: number): Promise<void> {
    try {
      this.audio().currentTime = Math.max(0, seconds);
    } catch {
      // Not loaded far enough to move yet.
    }
    this.tell();
    return Promise.resolve();
  }

  /** Called when the screen that made the player goes away. */
  release() {
    this.loading += 1;
    this.stopClock();
    this.stopTicker();
    const element = this.element;
    this.element = null;
    if (element) {
      element.removeEventListener('ended', this.onEnded);
      element.removeEventListener('play', this.onChange);
      element.removeEventListener('pause', this.onChange);
      element.removeEventListener('playing', this.onChange);
      element.removeEventListener('loadedmetadata', this.onLength);
      element.removeEventListener('durationchange', this.onLength);
      returnElement(element);
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
    this.isLoaded = false;
  }

  remove() {
    this.release();
  }

  private finish() {
    this.stopClock();
    this.stopTicker();
    this.didJustFinish = true;
    this.tell();
  }

  private startTicker() {
    if (this.ticker) return;
    this.ticker = setInterval(() => {
      if (this.silent && this.currentTime >= (this.duration || UNKNOWN_LENGTH)) {
        this.finish();
        return;
      }
      this.tell();
    }, this.interval);
  }

  private stopTicker() {
    if (this.ticker) clearInterval(this.ticker);
    this.ticker = null;
  }

  private startClock() {
    this.silent = { startedAt: Date.now(), from: this.element?.currentTime ?? 0 };
    this.tell();
  }

  private stopClock() {
    this.silent = null;
  }
}

/** A player for one screen. It gives its audio element back when the screen closes. */
export function useAudioPlayer(source?: AudioSource, options?: { updateInterval?: number } | number): WebPlayer {
  const interval = typeof options === 'number' ? options : (options?.updateInterval ?? DEFAULT_INTERVAL);
  const [player] = useState(() => new WebPlayer(interval));
  useEffect(() => {
    if (source) player.replace(source);
    return () => player.release();
    // The first source only: later clips are loaded with replace().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);
  return player;
}

/** Where the player is, refreshed a few times a second while it plays. */
export function useAudioPlayerStatus(player: WebPlayer): AudioStatus {
  const [status, setStatus] = useState<AudioStatus>(() => player.snapshot());
  useEffect(() => player.subscribe(() => setStatus(player.snapshot())), [player]);
  return status;
}

/* ------------------------------------------------------------------ microphone */

type Permission = { granted: boolean; status: 'granted' | 'denied'; canAskAgain: boolean; expires: 'never' };

// A microphone opened while asking for permission, kept for the recording that follows so the browser asks once.
let held: MediaStream | null = null;
let heldTimer: ReturnType<typeof setTimeout> | null = null;

function closeStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function dropHeld() {
  if (heldTimer) clearTimeout(heldTimer);
  heldTimer = null;
  closeStream(held);
  held = null;
}

function openMicrophone(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return Promise.reject(new Error('This page cannot use the microphone'));
  }
  setSession('auto');
  return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
}

/** Asks for the microphone. The browser shows its own prompt the first time. */
export async function requestRecordingPermissionsAsync(): Promise<Permission> {
  try {
    dropHeld();
    held = await openMicrophone();
    // If no recording follows, let the microphone go again.
    heldTimer = setTimeout(dropHeld, 10000);
    return { granted: true, status: 'granted', canAskAgain: true, expires: 'never' };
  } catch {
    return { granted: false, status: 'denied', canAskAgain: true, expires: 'never' };
  }
}

/** The phone needs to be told when it is recording. A browser works that out by itself. */
export function setAudioModeAsync(): Promise<void> {
  return Promise.resolve();
}

/** The format a browser records best. Chrome and Android record WebM. Safari, and every browser on an iPhone, records MP4. */
function recordingType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return undefined;
  const apple = /apple/i.test(navigator.vendor ?? '');
  const types = apple ? ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'] : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return types.find((type) => MediaRecorder.isTypeSupported(type));
}

/** Brings raw microphone samples down to 16 kHz by averaging, and writes them as a WAV file. Null if there is no sound in them. */
function samplesToWav(pieces: Float32Array[], rate: number): Blob | null {
  const length = pieces.reduce((total, piece) => total + piece.length, 0);
  if (rate <= 0 || length < rate * 0.25) return null;
  const step = rate / WAV_RATE;
  const output = new Float32Array(Math.floor(length / step));
  let piece = 0;
  let offset = 0;
  let loudest = 0;
  for (let index = 0; index < output.length; index += 1) {
    const until = Math.floor((index + 1) * step) - Math.floor(index * step);
    let total = 0;
    let count = 0;
    while (count < until && piece < pieces.length) {
      total += pieces[piece][offset];
      count += 1;
      offset += 1;
      if (offset >= pieces[piece].length) {
        piece += 1;
        offset = 0;
      }
    }
    const value = count > 0 ? total / count : 0;
    output[index] = value;
    if (Math.abs(value) > loudest) loudest = Math.abs(value);
  }
  // All zeros means the microphone was never really read this way.
  return loudest > 0.00001 ? wavFile(output, WAV_RATE) : null;
}

/** Turns a recording into a one-channel 16 kHz WAV: small, and read the same way by every speech model. */
async function toWav(recording: Blob): Promise<Blob> {
  const audio = audioContext();
  if (!audio) throw new Error('No audio support');
  const sound = await decode(audio, await recording.arrayBuffer());
  const Offline: typeof OfflineAudioContext | undefined =
    window.OfflineAudioContext ?? (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  if (!Offline) throw new Error('No offline audio support');
  const offline = new Offline(1, Math.max(1, Math.ceil(sound.duration * WAV_RATE)), WAV_RATE);
  const source = offline.createBufferSource();
  source.buffer = sound;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return wavFile(rendered.getChannelData(0), WAV_RATE);
}

class WebRecorder {
  /** Where the finished recording is, once stop() has ended. */
  uri: string | null = null;

  private stream: MediaStream | null = null;
  private media: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private microphone: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private samples: Float32Array<ArrayBuffer> | null = null;
  // The raw sound, collected next to the browser's own recording. When it is there it becomes the WAV file
  // directly, with nothing to decode.
  private tap: ScriptProcessorNode | null = null;
  private quiet: GainNode | null = null;
  private raw: Float32Array[] = [];
  private objectUrl: string | null = null;

  /** Opens the microphone and gets ready. record() starts it. */
  async prepareToRecordAsync(): Promise<void> {
    this.letGo();
    let stream = held;
    if (stream) {
      if (heldTimer) clearTimeout(heldTimer);
      heldTimer = null;
      held = null;
    } else {
      stream = await openMicrophone();
    }
    this.stream = stream;
    this.chunks = [];
    this.raw = [];
    const type = recordingType();
    const media = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
    const chunks = this.chunks;
    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };
    this.media = media;
    this.listen(stream);
  }

  record() {
    const media = this.media;
    if (!media) return;
    if (media.state === 'inactive') media.start();
    else if (media.state === 'paused') media.resume();
  }

  pause() {
    if (this.media?.state === 'recording') this.media.pause();
  }

  /** Ends the recording, lets the microphone go and leaves the result in `uri`. */
  async stop(): Promise<void> {
    const media = this.media;
    const stream = this.stream;
    const chunks = this.chunks;
    const raw = this.raw;
    const rate = context?.sampleRate ?? 0;
    this.media = null;
    this.stream = null;
    this.raw = [];
    this.stopListening();
    if (media && media.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        media.onstop = () => resolve();
        media.onerror = () => resolve();
        try {
          media.stop();
        } catch {
          resolve();
        }
      });
    }
    closeStream(stream);
    setSession('playback');
    if (!media) return;
    // First choice: the raw sound as a WAV. Second: the browser's recording, turned into a WAV. Last: the
    // browser's recording as it is, which the server can still read.
    let file: Blob | null = samplesToWav(raw, rate);
    if (!file) {
      const recording = new Blob(chunks, { type: media.mimeType || chunks[0]?.type || 'audio/webm' });
      file = recording.size > 0 ? recording : null;
      if (file) {
        try {
          file = await toWav(file);
        } catch {
          // Send it in the format the browser recorded.
        }
      }
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = file ? URL.createObjectURL(file) : null;
    this.uri = this.objectUrl;
  }

  /** `metering` is the microphone level in dB (0 is the loudest), or undefined when it can't be measured. */
  getStatus(): { metering: number | undefined; isRecording: boolean } {
    return { metering: this.level(), isRecording: this.media?.state === 'recording' };
  }

  /** Called when the screen that made the recorder goes away. */
  release() {
    this.letGo();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
  }

  private letGo() {
    const media = this.media;
    this.media = null;
    if (media && media.state !== 'inactive') {
      try {
        media.stop();
      } catch {
        // Already stopped.
      }
    }
    this.stopListening();
    closeStream(this.stream);
    this.stream = null;
  }

  private listen(stream: MediaStream) {
    const audio = audioContext();
    if (!audio) return;
    if (audio.state !== 'running') audio.resume().catch(() => {});
    try {
      this.microphone = audio.createMediaStreamSource(stream);
      this.analyser = audio.createAnalyser();
      this.analyser.fftSize = 2048;
      this.microphone.connect(this.analyser);
      this.samples = new Float32Array(this.analyser.fftSize);
    } catch {
      this.stopListening();
      return;
    }
    try {
      // Collect the raw sound too. The node only runs when it leads to the speakers, so it goes there through
      // a volume of zero.
      const tap = audio.createScriptProcessor(4096, 1, 1);
      const quiet = audio.createGain();
      quiet.gain.value = 0;
      const raw = this.raw;
      tap.onaudioprocess = (event) => {
        if (this.media?.state === 'recording') raw.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      };
      this.microphone.connect(tap);
      tap.connect(quiet);
      quiet.connect(audio.destination);
      this.tap = tap;
      this.quiet = quiet;
    } catch {
      // The browser's own recording is still running.
    }
  }

  private stopListening() {
    try {
      this.microphone?.disconnect();
      this.tap?.disconnect();
      this.quiet?.disconnect();
    } catch {
      // Already disconnected.
    }
    if (this.tap) this.tap.onaudioprocess = null;
    this.tap = null;
    this.quiet = null;
    this.microphone = null;
    this.analyser = null;
    this.samples = null;
  }

  private level(): number | undefined {
    const analyser = this.analyser;
    const samples = this.samples;
    if (!analyser || !samples || !context || context.state !== 'running') return undefined;
    if (this.media?.state !== 'recording') return undefined;
    analyser.getFloatTimeDomainData(samples);
    let total = 0;
    for (let index = 0; index < samples.length; index += 1) total += samples[index] * samples[index];
    const strength = Math.sqrt(total / samples.length);
    // Nothing at all means the microphone isn't being read, not that the room is silent.
    if (!(strength > 0)) return undefined;
    return Math.max(LEVEL_FLOOR, 20 * Math.log10(strength));
  }
}

export const RecordingPresets = { HIGH_QUALITY: {}, LOW_QUALITY: {} } as const;

/** A recorder for one screen. It lets the microphone go when the screen closes. */
export function useAudioRecorder(_options?: unknown): WebRecorder {
  const [recorder] = useState(() => new WebRecorder());
  useEffect(() => () => recorder.release(), [recorder]);
  return recorder;
}
