import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const TICK_LENGTH = 40;
// Figma F10·17j success tick v2: plays once, then holds still.
const BACK = Easing.bezier(0.34, 1.4, 0.64, 1);
const IN_OUT = Easing.bezier(0.37, 0, 0.63, 1);

type SuccessTickProps = {
  size?: number;
  /** "solid" = green circle with a white tick (F10·17j); "soft" = light green circle with a green tick. */
  tone?: 'solid' | 'soft';
};

/** Green circle pops in, the tick draws left to right, one soft ripple spreads out. Plays once. */
export function SuccessTick({ size = 56, tone = 'solid' }: SuccessTickProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const circle = useSharedValue(reducedMotion ? 1 : 0.3);
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const draw = useSharedValue(reducedMotion ? 0 : TICK_LENGTH);
  const ripple = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    opacity.set(withDelay(100, withTiming(1, { duration: 100 })));
    circle.set(withDelay(100, withTiming(1, { duration: 350, easing: BACK })));
    draw.set(withDelay(350, withTiming(0, { duration: 300, easing: IN_OUT })));
    ripple.set(withDelay(400, withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) })));
  }, [circle, draw, opacity, reducedMotion, ripple]);

  const circleStyle = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: circle.get() }] }));
  const rippleStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0 : 0.35 * (1 - ripple.get()),
    transform: [{ scale: 1 + 0.6 * ripple.get() }],
  }));
  const tickProps = useAnimatedProps(() => ({ strokeDashoffset: draw.get() }));
  const fill = tone === 'solid' ? theme.statusSuccess : theme.statusSuccessSubtle;
  const stroke = tone === 'solid' ? theme.textOnBrand : theme.statusSuccess;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Done" style={{ width: size, height: size }}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2, borderWidth: 2, borderColor: theme.statusSuccess }, rippleStyle]}
      />
      <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, backgroundColor: fill }, circleStyle]}>
        <Svg width={size} height={size} viewBox="0 0 56 56">
          <AnimatedPath
            d="M17 29l7.5 7.5L39 21.5"
            stroke={stroke}
            strokeWidth={4.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TICK_LENGTH}
            animatedProps={tickProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
