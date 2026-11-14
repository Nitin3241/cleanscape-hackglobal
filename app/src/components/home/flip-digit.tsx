import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { exitTiming, joySpring } from '@/constants/motion';
import { Motion, Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WIDTH = 32.24;
const HEIGHT = 42.16;
const RADIUS = 8.68;
const FOLD = HEIGHT / 2;
const PERSPECTIVE = 250;
const FALL_DURATION = Motion.duration.celebrate * 0.4;
const LAND_DURATION = Motion.duration.celebrate * 0.6;
// Springs run about 1.5 times their nominal duration.
const SETTLE_TIME = FALL_DURATION + LAND_DURATION * 1.5;

type FlipDigitProps = {
  /** The digit showing before the flip. */
  from: string;
  to: string;
  /** Flips once true. Digits that don't change, and Reduce Motion, skip the flip. */
  play: boolean;
  /** Milliseconds to wait after `play` turns true. */
  delay: number;
};

/** One tile of the split-flap countdown: the top half falls, then the bottom half lands. */
export function FlipDigit({ from, to, play, delay }: FlipDigitProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const flips = from !== to && !reducedMotion;
  const [settled, setSettled] = useState(false);
  // One value drives both halves so they can't drift apart: 0 to 1 is the top
  // half falling, 1 to 2 is the bottom half landing.
  const flip = useSharedValue(0);

  useEffect(() => {
    if (!play || !flips) return;
    flip.set(
      withDelay(delay, withSequence(exitTiming(1, FALL_DURATION), joySpring(2, LAND_DURATION))),
    );
    // Back to one solid digit, so the number can't stay split if frames are dropped.
    const timer = setTimeout(() => setSettled(true), delay + SETTLE_TIME);
    return () => clearTimeout(timer);
  }, [delay, flip, flips, play]);

  const fallStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: `${-90 * Math.min(flip.get(), 1)}deg` },
    ],
  }));
  const landStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: `${90 * (2 - Math.max(flip.get(), 1))}deg` },
    ],
  }));

  return (
    <View style={[styles.tile, { backgroundColor: theme.card, boxShadow: Shadows.digit }]}>
      {flips && !settled ? (
        <>
          <TopHalf digit={to} />
          <BottomHalf digit={from} />
          <Animated.View style={[styles.flap, styles.flapTop, fallStyle]}>
            <TopHalf digit={from} />
          </Animated.View>
          <Animated.View style={[styles.flap, styles.flapBottom, landStyle]}>
            <BottomHalf digit={to} />
          </Animated.View>
        </>
      ) : (
        <Face digit={to} />
      )}
      <View style={[styles.fold, { backgroundColor: theme.brandPressed }]} />
    </View>
  );
}

function Face({ digit }: { digit: string }) {
  return (
    <View style={styles.face}>
      <ThemedText type="digit" themeColor="brandPressed" maxFontSizeMultiplier={1}>
        {digit}
      </ThemedText>
    </View>
  );
}

function TopHalf({ digit }: { digit: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.half, styles.halfTop, { backgroundColor: theme.card }]}>
      <Face digit={digit} />
    </View>
  );
}

function BottomHalf({ digit }: { digit: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.half, styles.halfBottom, { backgroundColor: theme.card }]}>
      <View style={styles.bottomFace}>
        <Face digit={digit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: RADIUS,
  },
  face: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  half: {
    position: 'absolute',
    start: 0,
    end: 0,
    height: FOLD,
    overflow: 'hidden',
  },
  halfTop: {
    top: 0,
    borderTopStartRadius: RADIUS,
    borderTopEndRadius: RADIUS,
  },
  halfBottom: {
    top: FOLD,
    borderBottomStartRadius: RADIUS,
    borderBottomEndRadius: RADIUS,
  },
  bottomFace: {
    marginTop: -FOLD,
  },
  flap: {
    ...StyleSheet.absoluteFill,
  },
  flapTop: {
    transformOrigin: `50% ${FOLD}px`,
  },
  flapBottom: {
    transformOrigin: `50% ${FOLD}px`,
  },
  fold: {
    position: 'absolute',
    top: FOLD,
    start: 0,
    end: 0,
    height: 0.93,
    opacity: 0.6,
  },
});
