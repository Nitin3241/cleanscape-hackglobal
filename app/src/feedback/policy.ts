export type FeedbackSettings = {
  /** Master switch for all sounds. */
  sounds: boolean;
  /** The "All sounds" setting. Without it, only the sounds marked `defaultOn` play. */
  allSounds: boolean;
  haptics: boolean;
  /** The user's own quiet times, in minutes after midnight. */
  quietWindows: readonly { start: number; end: number }[];
};

export const DEFAULT_SETTINGS: FeedbackSettings = {
  sounds: true,
  allSounds: false,
  haptics: true,
  quietWindows: [],
};

export type EventSpec = {
  sound: string | null;
  defaultOn: boolean;
  essential: boolean;
  volume: number;
  haptic: string;
  skipHapticWhileTyping: boolean;
};

export type FeedbackState = {
  settings: FeedbackSettings;
  kidMode: boolean;
  speaking: boolean;
  typing: boolean;
  reduceMotion: boolean;
  /** Local time, in minutes after midnight. */
  minutesNow: number;
};

const NIGHT = { start: 22 * 60, end: 7 * 60 };
const KID_VOLUME = 0.7;

function inWindow(minutes: number, { start, end }: { start: number; end: number }) {
  // A window that passes midnight has its end before its start.
  return start <= end ? minutes >= start && minutes < end : minutes >= start || minutes < end;
}

export function isQuietTime(minutes: number, settings: FeedbackSettings) {
  return inWindow(minutes, NIGHT) || settings.quietWindows.some((window) => inWindow(minutes, window));
}

function soundIsAllowed(spec: EventSpec, state: FeedbackState) {
  if (!spec.sound || !state.settings.sounds || state.speaking) return false;
  if (!state.settings.allSounds && !spec.defaultOn) return false;
  return spec.essential || !isQuietTime(state.minutesNow, state.settings);
}

function resolveHaptic(spec: EventSpec, state: FeedbackState) {
  if (!state.settings.haptics || spec.haptic === 'none') return null;
  if (state.typing && spec.skipHapticWhileTyping) return null;
  if (state.reduceMotion && spec.haptic.startsWith('signature:')) return 'notification:success';
  return spec.haptic;
}

/** Decides what an event does right now. It has no side effects, so the rules are easy to check. */
export function resolveFeedback(spec: EventSpec, state: FeedbackState) {
  return {
    sound: soundIsAllowed(spec, state)
      ? { name: spec.sound as string, volume: spec.volume * (state.kidMode ? KID_VOLUME : 1) }
      : null,
    haptic: resolveHaptic(spec, state),
  };
}
