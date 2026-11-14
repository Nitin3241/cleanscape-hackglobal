// Earthy's orb: matches Figma `AI/Orb` (413:10671) exactly. Used only for the AI, never the logo.
// Look: a diagonal sea → light sea → marigold gradient with a soft white highlight at the top left.
// Motion: transform and opacity only, on the UI thread (no blur, no re-renders).
// The gradient keeps its Figma orientation; it only turns while Earthy is thinking.
import { useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

import { ease, linear } from '@/components/earthy/motion';

/** What Earthy is doing. `still` stops all motion, for example while the page scrolls. */
export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'still';

type EarthyOrbProps = {
  state: OrbState;
  /** Figma sizes: 24 avatar, 52 button, 96 sheet, 180 live voice. */
  size?: number;
  /** Shrinks the orb while speaking, with a scale rather than a size change. */
  compact?: boolean;
  /** The soft sea and marigold halo. Off for small orbs. */
  glow?: boolean;
  /** 0 to 1 mic or voice level, optional. */
  level?: SharedValue<number>;
};

// Figma AI/Orb colours.
const SEA = '#1E6280';
const SEA_LIGHT = '#5FB3C9';
const MARIGOLD = '#F2A516';
const HALO_SUN = '#FFC94D';

export function EarthyOrb({ state, size = 180, compact = false, glow = true, level }: EarthyOrbProps) {
  const reducedMotion = useReducedMotion();
  const turn = useSharedValue(0);
  const breathe = useSharedValue(1);
  const shrink = useSharedValue(compact ? 0.5 : 1);
  const halo = useSharedValue(0.8);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    cancelAnimation(turn);
    cancelAnimation(breathe);
    if (state === 'still' || reducedMotion) {
      breathe.set(withTiming(1, { duration: 150 }));
      turn.set(withTiming(0, { duration: 250, easing: ease }));
      return;
    }
    // Only thinking turns the gradient; every other state eases back to the Figma angle.
    if (state === 'thinking') {
      const from = turn.get() % 360;
      turn.set(from);
      turn.set(withRepeat(withTiming(from + 360, { duration: 3200, easing: linear }), -1, false));
    } else {
      const back = turn.get() % 360 > 180 ? 360 : 0;
      turn.set(withTiming(back, { duration: 500, easing: ease }));
    }
    const amplitude = state === 'thinking' ? 1.035 : state === 'idle' ? 1.04 : 1.025;
    const period = state === 'thinking' ? 700 : state === 'speaking' ? 420 : 1200;
    breathe.set(withRepeat(withTiming(amplitude, { duration: period, easing: ease }), -1, true));
    halo.set(withTiming(state === 'thinking' ? 1 : state === 'listening' ? 0.9 : 0.8, { duration: 400, easing: ease }));
  }, [breathe, halo, reducedMotion, state, turn]);

  useEffect(() => {
    shrink.set(withTiming(compact ? 0.5 : 1, { duration: 450, easing: ease }));
  }, [compact, shrink]);

  const body = useAnimatedStyle(() => {
    const voice = level ? 1 + level.get() * 0.08 : 1;
    return { transform: [{ scale: shrink.get() * breathe.get() * voice }] };
  });
  const gradient = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get()}deg` }] }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: halo.get(),
    transform: [{ scale: shrink.get() * (level ? 1 + level.get() * 0.15 : 1) }],
  }));

  const box = glow ? size * 1.9 : size;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }}>
      {glow && (
        <Animated.View style={[StyleSheet.absoluteFill, haloStyle]}>
          <Svg width={box} height={box}>
            <Defs>
              <RadialGradient id={`${id}sea`} cx="42%" cy="42%" r="50%">
                <Stop offset="0.35" stopColor={SEA_LIGHT} stopOpacity={0.35} />
                <Stop offset="1" stopColor={SEA_LIGHT} stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id={`${id}sun`} cx="62%" cy="62%" r="40%">
                <Stop offset="0.3" stopColor={HALO_SUN} stopOpacity={0.3} />
                <Stop offset="1" stopColor={HALO_SUN} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={box / 2} cy={box / 2} r={box / 2} fill={`url(#${id}sea)`} />
            <Circle cx={box / 2} cy={box / 2} r={box / 2} fill={`url(#${id}sun)`} />
          </Svg>
        </Animated.View>
      )}

      <Animated.View style={[{ width: size, height: size }, body]}>
        {/* The gradient sits in its own layer so it can turn while the highlight stays put. */}
        <Animated.View style={[StyleSheet.absoluteFill, gradient]}>
          <Svg width={size} height={size} viewBox="0 0 96 96">
            <Defs>
              <LinearGradient id={`${id}fill`} x1="13.7" y1="13.7" x2="82.3" y2="82.3" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor={SEA} />
                <Stop offset="0.55" stopColor={SEA_LIGHT} />
                <Stop offset="1" stopColor={MARIGOLD} />
              </LinearGradient>
            </Defs>
            <Circle cx={48} cy={48} r={48} fill={`url(#${id}fill)`} />
          </Svg>
        </Animated.View>
        {/* Soft highlight (a radial fade stands in for Figma's blur). */}
        <Svg width={size} height={size} viewBox="0 0 96 96" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id={`${id}shine`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0.55} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={42} cy={29} rx={31} ry={22} fill={`url(#${id}shine)`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
