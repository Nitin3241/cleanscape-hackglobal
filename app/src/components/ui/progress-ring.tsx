import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';
import { joySpring, standardTiming } from '@/constants/motion';
import { Motion } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 84;
const STROKE = 6.72;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;
const KNOB_RADIUS = 4;
const KNOB_SETTLE_RADIUS = 5.5;

type ProgressRingProps = {
  /** From 0 to 1. */
  progress: number;
  /** Starts the fill once true. */
  play: boolean;
  /** Milliseconds to wait after `play` turns true. */
  delay: number;
};

/** Circular progress with a leaf in the middle. The knob settles after the fill ends. */
export function ProgressRing({ progress, play, delay }: ProgressRingProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const target = Math.min(Math.max(progress, 0), 1);
  const fill = useSharedValue(reducedMotion ? target : 0);
  const knobRadius = useSharedValue(KNOB_RADIUS);

  useEffect(() => {
    if (!play || reducedMotion) return;
    fill.set(withDelay(delay, standardTiming(target, Motion.duration.slow)));
    knobRadius.set(
      withDelay(
        delay + Motion.duration.slow,
        withSequence(
          withTiming(KNOB_SETTLE_RADIUS, { duration: Motion.duration.instant }),
          joySpring(KNOB_RADIUS, Motion.duration.fast),
        ),
      ),
    );
  }, [delay, fill, knobRadius, play, reducedMotion, target]);

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - fill.get()),
  }));
  const knobProps = useAnimatedProps(() => {
    const angle = fill.get() * 2 * Math.PI;
    return {
      cx: CENTER + RADIUS * Math.sin(angle),
      cy: CENTER - RADIUS * Math.cos(angle),
      r: knobRadius.get(),
    };
  });

  return (
    <View style={styles.ring}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={theme.fill} strokeWidth={STROKE} fill="none" />
        <AnimatedCircle
          animatedProps={arcProps}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={theme.brand}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={[CIRCUMFERENCE, CIRCUMFERENCE]}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
        <AnimatedCircle
          animatedProps={knobProps}
          fill={theme.secondary}
          stroke={theme.card}
          strokeWidth={2}
        />
      </Svg>
      <View style={styles.icon}>
        <Icon name="leaf" size={26} color="brand" strokeWidth={2.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: SIZE,
    height: SIZE,
  },
  icon: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
