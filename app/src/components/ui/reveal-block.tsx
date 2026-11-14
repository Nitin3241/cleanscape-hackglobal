import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { standardTiming } from '@/constants/motion';
import { Motion, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SKELETON_LINES = {
  wide: [180, 115],
  card: [136, 87],
  tile: [42, 27],
} as const;

type RevealBlockProps = {
  loading: boolean;
  /** Position in the entrance sequence. */
  order: number;
  radius: number;
  lines: keyof typeof SKELETON_LINES;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Shows a skeleton the exact size of `children` while loading, then fades the
 * content up 8 px. With Reduce Motion on, it's a plain 150 ms crossfade.
 */
export function RevealBlock({ loading, order, radius, lines, style, children }: RevealBlockProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(loading ? 0 : 1);

  useEffect(() => {
    // Back to the skeleton at once when a screen loads again (a tab tap on a screen already open).
    if (loading) {
      progress.set(0);
      return;
    }
    progress.set(
      reducedMotion
        ? withTiming(1, { duration: Motion.duration.fast })
        : withDelay(order * Motion.stagger, standardTiming(1, Motion.transition.state.duration)),
    );
  }, [loading, order, progress, reducedMotion]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: reducedMotion ? 0 : (1 - progress.get()) * Motion.rise }],
  }));
  const skeletonStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.get() }));

  return (
    <View style={style}>
      <Animated.View
        pointerEvents={loading ? 'none' : 'auto'}
        accessibilityElementsHidden={loading}
        importantForAccessibility={loading ? 'no-hide-descendants' : 'auto'}
        style={contentStyle}>
        {children}
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.skeleton,
          { backgroundColor: theme.skeleton, borderRadius: radius },
          skeletonStyle,
        ]}>
        {loading && !reducedMotion && <Shimmer />}
        {SKELETON_LINES[lines].map((width, index) => (
          <View
            key={width}
            style={[
              styles.line,
              { width, top: 18 + index * 24, backgroundColor: theme.skeletonLine },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const SHIMMER_PASS_MS = 1100;
const SHIMMER_EVERY_MS = 1200;

/** Soft white highlight that sweeps across a skeleton. */
export function Shimmer() {
  const [width, setWidth] = useState(0);
  const sweep = useSharedValue(0);

  useEffect(() => {
    // Figma skeleton standard (13 Nov): one sweep left to right in 1.1 s (in-out), a new one every 1.2 s.
    sweep.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: SHIMMER_PASS_MS, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 0 }),
          withDelay(SHIMMER_EVERY_MS - SHIMMER_PASS_MS, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(sweep);
  }, [sweep]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(sweep.get(), [0, 1], [-width, width]) }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    start: Spacing.three,
    height: 12,
    borderRadius: 6,
  },
});
