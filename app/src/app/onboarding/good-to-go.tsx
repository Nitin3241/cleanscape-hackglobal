import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Confetti, type ConfettiPiece } from '@/components/onboarding/confetti';
import { Mascot } from '@/components/onboarding/mascot';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { joySpring } from '@/constants/motion';
import { Gradients, Motion, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useFadeUp } from '@/hooks/use-fade-up';
import { setOnboarded } from '@/state/onboarded';
import { joinsWithSchool } from '@/state/school';

const FINAL_SIZE = 180;
const START_SCALE = 120 / FINAL_SIZE;
const START_OPACITY = 0.4;
const TEXT_RISE = 12;
const FRAME_STATUS_BAR = 44;
const FRAME_MASCOT_TOP = 200;

// Landing spots from the Figma frame, measured from Earthy's centre.
const CONFETTI: readonly ConfettiPiece[] = [
  { x: -115, y: -119, rotate: -20, color: 'secondary' },
  { x: 113, y: -95, rotate: 30, color: 'accent' },
  { x: -135, y: 39, rotate: -40, color: 'statusSuccess' },
  { x: 124, y: 34, rotate: 15, color: 'secondary' },
  { x: 5, y: -143, rotate: -60, color: 'accent' },
  { x: -65, y: -148, rotate: -10, color: 'brand' },
  { x: 75, y: -151, rotate: -35, color: 'secondary' },
  { x: -99, y: -25, rotate: 50, color: 'accent' },
  { x: 106, y: -30, rotate: -25, color: 'brand' },
];

export default function GoodToGoRoute() {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const grow = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    feedback.play('onboarding.goodToGo');
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    grow.set(joySpring(1, Motion.duration.celebrate));
  }, [grow, reducedMotion]);

  const mascotStyle = useAnimatedStyle(() => ({
    opacity: START_OPACITY + (1 - START_OPACITY) * Math.min(grow.get(), 1),
    transform: [{ scale: START_SCALE + (1 - START_SCALE) * grow.get() }],
  }));
  // The text arrives last, once Earthy has grown.
  const textStyle = useFadeUp({ delay: Motion.duration.celebrate, distance: TEXT_RISE });

  return (
    <View style={styles.screen}>
      <LinearGradient {...Gradients.goodToGo} style={StyleSheet.absoluteFill} />

      <View style={[styles.body, { paddingTop: insets.top + FRAME_MASCOT_TOP - FRAME_STATUS_BAR }]}>
        <View style={styles.mascot}>
          <Confetti pieces={CONFETTI} />
          <Animated.View style={mascotStyle}>
            <Mascot size={FINAL_SIZE} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.copy, textStyle]}>
          <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
            {"You're good to go!"}
          </ThemedText>
          <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.lead]}>
            Your first cleanup is waiting. Welcome to the crew.
          </ThemedText>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + Spacing.twoThreeQuarters, 36) }]}>
        <Button
          label="Find cleanups"
          size="large"
          onPress={async () => {
            setOnboarded(true);
            // "With my school" picked on interests: go straight to joining the class (F3·1).
            if (await joinsWithSchool()) {
              router.replace('/home');
              router.push('/class-join');
            } else router.replace('/home');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  mascot: {
    width: FINAL_SIZE,
    height: FINAL_SIZE,
  },
  copy: {
    marginTop: Spacing.five + Spacing.two,
    maxWidth: 312,
  },
  centred: {
    textAlign: 'center',
  },
  lead: {
    marginTop: Spacing.two,
    maxWidth: 296,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
});
