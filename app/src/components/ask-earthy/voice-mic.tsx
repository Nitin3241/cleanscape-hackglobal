import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { joySpring } from '@/constants/motion';
import { Motion } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type VoiceMicState = 'idle' | 'listening' | 'done';

const BOX = 140;
// One full breath in and out takes 1.6 s when idle.
const CYCLE = { idle: 800, listening: 900 } as const;
const BUTTON = 56;

// Sizes from the Figma component `Voice mic`, as [rest, peak] diameters.
const SIZES = {
  idle: { glow: [64, 76], outerRing: [64, 94], innerRing: [64, 78] },
  listening: { glow: [72, 88], outerRing: [70, 126], innerRing: [64, 98] },
  done: { glow: [72, 72], outerRing: [64, 64], innerRing: [64, 64] },
} as const;

const BAR_HEIGHTS = [
  [6, 14],
  [14, 8],
  [20, 16],
  [12, 20],
  [8, 10],
] as const;

type VoiceMicProps = {
  state: VoiceMicState;
  onPress: () => void;
  accessibilityLabel: string;
};

/** The sheet's main control: a mic that breathes, a waveform that pulses, then a tick. */
export function VoiceMic({ state, onPress, accessibilityLabel }: VoiceMicProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion || state === 'done') {
      pulse.set(withTiming(0, { duration: Motion.duration.fast }));
    } else {
      const ease = Easing.inOut(Easing.ease);
      const duration = CYCLE[state];
      pulse.set(
        withRepeat(
          withSequence(
            withTiming(1, { duration, easing: ease }),
            withTiming(0, { duration, easing: ease }),
          ),
          -1,
        ),
      );
    }
    if (state === 'done' && !reducedMotion) {
      pop.set(withSequence(withTiming(0.9, { duration: Motion.duration.instant }), joySpring(1, Motion.duration.base)));
    }
  }, [pop, pulse, reducedMotion, state]);

  const sizes = SIZES[state];
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.get(), [0, 1], [sizes.glow[0], sizes.glow[1]]) / BOX }],
  }));
  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.get(), [0, 1], [sizes.outerRing[0], sizes.outerRing[1]]) / BOX }],
  }));
  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.get(), [0, 1], [sizes.innerRing[0], sizes.innerRing[1]]) / BOX }],
  }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  return (
    <View style={styles.box}>
      <Animated.View style={[styles.layer, { borderColor: theme.brand }, styles.ring, outerStyle]} />
      <Animated.View style={[styles.layer, { borderColor: theme.brand }, styles.ring, innerStyle]} />
      <Animated.View style={[styles.layer, { backgroundColor: theme.brand }, glowStyle]} />
      <Animated.View style={popStyle}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: state === 'done' }}
          disabled={state === 'done'}
          hitSlop={8}
          onPress={onPress}
          style={[styles.button, { backgroundColor: theme.brand }]}>
          {state === 'idle' && <Icon name="mic" size={22} color="textOnBrand" strokeWidth={1.6} />}
          {state === 'done' && <Icon name="check" size={20} color="textOnBrand" />}
          {state === 'listening' && (
            <View style={styles.bars}>
              {BAR_HEIGHTS.map(([rest, peak], index) => (
                <Bar key={index} rest={rest} peak={peak} pulse={pulse} />
              ))}
            </View>
          )}
        </Tappable>
      </Animated.View>
    </View>
  );
}

function Bar({
  rest,
  peak,
  pulse,
}: {
  rest: number;
  peak: number;
  pulse: ReturnType<typeof useSharedValue<number>>;
}) {
  const theme = useTheme();
  const barStyle = useAnimatedStyle(() => ({
    height: interpolate(pulse.get(), [0, 1], [rest, peak]),
  }));
  return <Animated.View style={[styles.bar, { backgroundColor: theme.textOnBrand }, barStyle]} />;
}

const styles = StyleSheet.create({
  box: {
    width: BOX,
    height: BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Layers are drawn at full size and scaled down, so edges stay crisp as they pulse.
  layer: {
    position: 'absolute',
    width: BOX,
    height: BOX,
    borderRadius: BOX / 2,
  },
  ring: {
    borderWidth: 3,
  },
  button: {
    width: BUTTON,
    height: BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON / 2,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bar: {
    width: 2.5,
    borderRadius: 1.25,
  },
});
