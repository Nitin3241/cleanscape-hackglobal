import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Motion } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WIDTH = 51;
const HEIGHT = 31;
const THUMB = 27;
const TRAVEL = WIDTH - THUMB - 4;

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Read out by screen readers. */
  label: string;
  disabled?: boolean;
};

/** On/off switch. The thumb slides with a transform, so it stays smooth. */
export function Toggle({ value, onValueChange, label, disabled = false }: ToggleProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const on = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    on.set(withTiming(value ? 1 : 0, { duration: reducedMotion ? 0 : Motion.duration.base }));
  }, [on, reducedMotion, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.get(), [0, 1], [theme.seatEmpty, theme.brand]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: on.get() * TRAVEL }] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={disabled && styles.disabled}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, { backgroundColor: theme.card }, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    padding: 2,
    borderRadius: HEIGHT / 2,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    boxShadow: '0px 2px 4px 0px rgba(18, 37, 46, 0.2)',
  },
  disabled: {
    opacity: 0.4,
  },
});
