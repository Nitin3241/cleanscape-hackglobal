import { type Ref, useEffect } from 'react';
import { StyleSheet, type ViewInstance } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Tappable } from '@/components/ui/tappable';
import { Motion, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The 52 px brand circle plus its 2 px white border.
const SIZE = 56;
const RING_SCALE = 92 / SIZE;
const RING_CYCLE = 2200;
const RING_OPACITY = 0.25;

type EarthyFabProps = {
  onPress: () => void;
  /** Stops the rings, for example while the screen is scrolling. */
  paused: boolean;
  /** Lets Earthy's Home tip (F10·1) point at the button. */
  buttonRef?: Ref<ViewInstance>;
  /** How far to rise, so a toast above the tab bar never covers it (Figma CAL3: 12 px above the toast). */
  lift?: number;
};

/**
 * Floating Earthy button, Figma `Earthy FAB` (167:1711, State=Rest): the AI orb gradient
 * (#1E6280 → #5FB3C9 → #F2A516) with a 2 px white ring and a white voice-wave icon.
 * No highlight and no mic badge. Two soft rings invite a tap.
 */
export function EarthyFab({ onPress, paused, buttonRef, lift = 0 }: EarthyFabProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const rise = useSharedValue(lift);

  useEffect(() => {
    rise.set(withTiming(lift, { duration: reducedMotion ? 0 : Motion.duration.base, easing: Easing.bezier(0.37, 0, 0.63, 1) }));
  }, [lift, reducedMotion, rise]);

  const riseStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -rise.get() }] }));

  return (
    <Animated.View
      ref={buttonRef}
      collapsable={false}
      pointerEvents="box-none"
      style={[styles.position, { bottom: TabBarHeight + insets.bottom + Spacing.three }, riseStyle]}>
      {!reducedMotion && (
        <>
          <Ring paused={paused} delay={0} />
          <Ring paused={paused} delay={RING_CYCLE / 2} />
        </>
      )}
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Ask Earthy"
        pressedScale={0.92}
        onPress={onPress}
        style={[
          styles.button,
          { borderColor: theme.textOnBrand, boxShadow: Shadows.fab },
        ]}>
        <FabFace />
      </Tappable>
    </Animated.View>
  );
}

/** Orb gradient plus the wave icon, drawn once as SVG (no per-frame work). */
function FabFace() {
  return (
    <Svg width={52} height={52} viewBox="0 0 52 52">
      <Defs>
        <LinearGradient id="earthyFab" x1="7.6" y1="7.6" x2="44.4" y2="44.4" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#1E6280" />
          <Stop offset="0.55" stopColor="#5FB3C9" />
          <Stop offset="1" stopColor="#F2A516" />
        </LinearGradient>
      </Defs>
      <Circle cx={26} cy={26} r={26} fill="url(#earthyFab)" />
      <Path
        transform="translate(15 15)"
        d="M4.58 9.17V12.83M8.25 6.42V15.58M11.92 3.67V18.33M15.58 7.33V14.67M19.25 10.08V11.92"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Ring({ paused, delay }: { paused: boolean; delay: number }) {
  const theme = useTheme();
  // 1 is fully expanded and faded out, so a stopped ring can't be seen.
  const ring = useSharedValue(1);

  useEffect(() => {
    if (paused) {
      ring.set(withTiming(1, { duration: Motion.duration.fast }));
      return;
    }
    ring.set(0);
    ring.set(
      withDelay(
        delay,
        withRepeat(withTiming(1, { duration: RING_CYCLE, easing: Easing.out(Easing.ease) }), -1),
      ),
    );
  }, [delay, paused, ring]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - ring.get()) * RING_OPACITY,
    transform: [{ scale: 1 + (RING_SCALE - 1) * ring.get() }],
  }));

  return <Animated.View pointerEvents="none" style={[styles.ring, { backgroundColor: theme.brand }, ringStyle]} />;
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    end: Spacing.three,
    width: SIZE,
    height: SIZE,
  },
  ring: {
    ...StyleSheet.absoluteFill,
    borderRadius: SIZE / 2,
  },
  button: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
  },
});
