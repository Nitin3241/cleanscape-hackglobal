// Shared Earthy motion tokens (from the Claude Code kit). Every Earthy animation uses these,
// so timing feels like one system. Animate only transform and opacity, on the UI thread.
import { Easing } from 'react-native-reanimated';

export const ease = Easing.bezier(0.2, 0.8, 0.2, 1); // default ease-out
export const pop = Easing.bezier(0.34, 1.56, 0.64, 1); // small overshoot for ticks and cards
export const linear = Easing.linear;

export const dur = { fast: 150, base: 250, slow: 400, celebrate: 600 } as const;
export const stagger = 60;

/** The handoff's sea and marigold scale, for the orb's gradient and glow. */
export const orbColor = {
  sea600: '#154A62',
  sea400: '#2A8FA8',
  sea300: '#5FB3CF',
  marigold300: '#FFC94D',
  marigold500: '#E08E00',
} as const;
