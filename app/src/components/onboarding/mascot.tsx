import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { mascotBodyXml, mascotEyesXml } from '@/constants/onboarding-art';

const BREATHE_SCALE = 1.03;
const BREATHE_CYCLE = 2000;
const BLINK_DELAY = 800;
const BLINK_DURATION = 90;
const CLOSED_EYES = 0.1;

type MascotProps = {
  size: number;
  /** Breathes on a loop and blinks once. Reduce Motion keeps Earthy still. */
  alive?: boolean;
};

/** Earthy, the CleanScape mascot (Figma component `Mascot / Earthy`). */
export function Mascot({ size, alive = false }: MascotProps) {
  const reducedMotion = useReducedMotion();
  const breath = useSharedValue(1);
  const eyes = useSharedValue(1);

  useEffect(() => {
    if (!alive || reducedMotion) return;
    const ease = Easing.inOut(Easing.ease);
    breath.set(
      withRepeat(
        withSequence(
          withTiming(BREATHE_SCALE, { duration: BREATHE_CYCLE / 2, easing: ease }),
          withTiming(1, { duration: BREATHE_CYCLE / 2, easing: ease }),
        ),
        -1,
      ),
    );
    eyes.set(
      withDelay(
        BLINK_DELAY,
        withSequence(
          withTiming(CLOSED_EYES, { duration: BLINK_DURATION }),
          withTiming(1, { duration: BLINK_DURATION }),
        ),
      ),
    );
  }, [alive, breath, eyes, reducedMotion]);

  const breathStyle = useAnimatedStyle(() => ({ transform: [{ scale: breath.get() }] }));
  const eyesStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: eyes.get() }] }));

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Earthy, a smiling Earth with a green sprout"
      style={[{ width: size, height: size }, breathStyle]}>
      <SvgXml xml={mascotBodyXml} width={size} height={size} />
      <Animated.View style={[styles.eyes, eyesStyle]}>
        <SvgXml xml={mascotEyesXml} width={size} height={size} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  eyes: {
    ...StyleSheet.absoluteFill,
    // The eyes sit at y = 98 of the 160 px artwork.
    transformOrigin: '50% 61%',
  },
});
