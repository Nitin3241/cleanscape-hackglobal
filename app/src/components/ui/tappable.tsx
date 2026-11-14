import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { joySpring } from '@/constants/motion';
import { Motion } from '@/constants/theme';
import { showComingSoon } from '@/state/coming-soon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESSED_OPACITY = 0.7;
const DISABLED_OPACITY = 0.45;

type TappableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Shrink to this size on press and spring back, instead of dimming. */
  pressedScale?: number;
};

/** Pressable with the spec's 100 ms pressed state. Reduce Motion swaps scaling for dimming. */
export function Tappable({ style, pressedScale, onPress, onPressIn, onPressOut, disabled, ...rest }: TappableProps) {
  // A button whose screen isn't built yet says so instead of doing nothing (never a dead tap).
  const isDeadButton = !onPress && !rest.onLongPress && !disabled && rest.accessibilityRole === 'button';
  const reducedMotion = useReducedMotion();
  const scales = pressedScale !== undefined && !reducedMotion;
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const restingOpacity = disabled ? DISABLED_OPACITY : 1;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get() * restingOpacity,
    transform: [{ scale: scale.get() }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      style={[style, animatedStyle]}
      onPress={isDeadButton ? () => showComingSoon() : onPress}
      onPressIn={(event) => {
        if (scales) {
          scale.set(withTiming(pressedScale, { duration: Motion.duration.instant }));
        } else {
          opacity.set(withTiming(PRESSED_OPACITY, { duration: Motion.duration.instant }));
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (scales) {
          scale.set(joySpring(1, Motion.duration.base));
        } else {
          opacity.set(withTiming(1, { duration: Motion.duration.instant }));
        }
        onPressOut?.(event);
      }}
      {...rest}
    />
  );
}
