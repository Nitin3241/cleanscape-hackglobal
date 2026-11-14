import { Easing, withSpring, withTiming } from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

const [sx1, sy1, sx2, sy2] = Motion.easing.standard;
const [ex1, ey1, ex2, ey2] = Motion.easing.exit;

/** Most UI movement: things entering or moving. */
export function standardTiming(toValue: number, duration: number) {
  return withTiming(toValue, { duration, easing: Easing.bezier(sx1, sy1, sx2, sy2) });
}

/** Things leaving. */
export function exitTiming(toValue: number, duration: number) {
  return withTiming(toValue, { duration, easing: Easing.bezier(ex1, ey1, ex2, ey2) });
}

/** The "Joy spring": rewards, flip digits and the Scan bounce. */
export function joySpring(toValue: number, duration: number) {
  return withSpring(toValue, { duration, dampingRatio: Motion.springDampingRatio });
}

const [shx1, shy1, shx2, shy2] = Motion.transition.sheet.easing;
const [stx1, sty1, stx2, sty2] = Motion.transition.state.easing;

/** Sheets and slide-ins (Figma: 400 ms, bezier(0.32, 0.72, 0, 1)). */
export function sheetTiming(toValue: number) {
  return withTiming(toValue, { duration: Motion.transition.sheet.duration, easing: Easing.bezier(shx1, shy1, shx2, shy2) });
}

/** In-place state changes on the same screen (Figma: 300 ms, bezier(0.22, 1, 0.36, 1)). */
export function stateTiming(toValue: number) {
  return withTiming(toValue, { duration: Motion.transition.state.duration, easing: Easing.bezier(stx1, sty1, stx2, sty2) });
}

/** The same curves for Reanimated layout animations (entering / exiting). */
export const SHEET_EASING = Easing.bezier(shx1, shy1, shx2, shy2);
export const STATE_EASING = Easing.bezier(stx1, sty1, stx2, sty2);
