import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo } from 'react-native';

import { FEEDBACK_EVENTS } from './events.generated';
import { playHaptic } from './haptic-player';
import { DEFAULT_SETTINGS, type FeedbackSettings, resolveFeedback } from './policy';
import { preloadSounds, prepareAudio, playSound } from './sound-player';

export type FeedbackEvent = keyof typeof FEEDBACK_EVENTS;

const SETTINGS_KEY = 'feedback-settings';
const PLAYED_ONCE_KEY = 'feedback-played-once';
const HAPTIC_MIN_GAP = 80;
// The sounds that play by default, loaded early so the first one isn't late.
const PRELOAD = ['cs-done', 'cs-done-reward'];

let settings: FeedbackSettings = DEFAULT_SETTINGS;
let kidMode = false;
let speaking = false;
let typing = false;
let reduceMotion = false;
let lastHapticAt = -HAPTIC_MIN_GAP;
const lastPlayedAt = new Map<FeedbackEvent, number>();

function minutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function fire(event: FeedbackEvent) {
  const spec = FEEDBACK_EVENTS[event];
  const now = Date.now();
  if (spec.cooldownMs && now - (lastPlayedAt.get(event) ?? -Infinity) < spec.cooldownMs) return;
  lastPlayedAt.set(event, now);
  const { sound, haptic } = resolveFeedback(spec, {
    settings,
    kidMode,
    speaking,
    typing,
    reduceMotion,
    minutesNow: minutesNow(),
  });
  if (sound) playSound(sound.name, sound.volume);
  if (haptic && now - lastHapticAt >= HAPTIC_MIN_GAP) {
    lastHapticAt = now;
    playHaptic(haptic);
  }
}

async function fireOnce(event: FeedbackEvent) {
  try {
    const played: string[] = JSON.parse((await AsyncStorage.getItem(PLAYED_ONCE_KEY)) ?? '[]');
    if (played.includes(event)) return;
    await AsyncStorage.setItem(PLAYED_ONCE_KEY, JSON.stringify([...played, event]));
  } catch {
    // Without storage it's better to stay quiet than to repeat on every launch.
    return;
  }
  fire(event);
}

/** Maps app events to their sound and haptic, and applies settings, quiet hours and kid mode. */
export const feedback = {
  /** Call once when the app starts. */
  async init() {
    prepareAudio();
    preloadSounds(PRELOAD);
    AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reduceMotion = enabled;
    });
    try {
      reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // The defaults still work.
    }
  },

  play(event: FeedbackEvent) {
    if (FEEDBACK_EVENTS[event].once) fireOnce(event);
    else fire(event);
  },

  getSettings: () => settings,

  updateSettings(changes: Partial<FeedbackSettings>) {
    settings = { ...settings, ...changes };
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(() => {});
  },

  /** For under-18 accounts. */
  setKidMode(enabled: boolean) {
    kidMode = enabled;
  },

  /** While Earthy is speaking, UI sounds are dropped so nothing plays over speech. */
  setSpeaking(enabled: boolean) {
    speaking = enabled;
  },

  /** While the user types, the in-app banner loses its haptic. */
  setTyping(enabled: boolean) {
    typing = enabled;
  },
};
