import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mascot } from '@/components/onboarding/mascot';
import { ThemedText } from '@/components/themed-text';
import { Logomark } from '@/components/ui/logomark';
import { Gradients, Motion, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { hasOnboarded } from '@/state/onboarded';

// Figma 00 Splash: auto 1.4 s to the next screen = 1 s hold + the 0.4 s lift.
const HOLD_TIME = 1000;
const REDUCED_HOLD_TIME = 1200;
const LIFT_DISTANCE = 16;
// Figma 00 Splash: Earthy's top sits at y 250 of the 800 px frame, under a 44 px status bar.
const FRAME_STATUS_BAR = 44;
const FRAME_MASCOT_TOP = 250;

/** First screen: Earthy breathes and blinks, then lifts away as the background settles. */
export default function SplashRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const leaving = useSharedValue(0);

  useEffect(() => {
    feedback.play('launch.logo');
  }, []);

  useEffect(() => {
    const hold = reducedMotion ? REDUCED_HOLD_TIME : HOLD_TIME;
    const duration = reducedMotion ? Motion.duration.fast : Motion.duration.slow;
    leaving.set(withDelay(hold, withTiming(1, { duration, easing: Easing.inOut(Easing.ease) })));
    // First launch goes to onboarding; a returning user goes straight to Home (Figma 00 Splash → out).
    const firstVisit = hasOnboarded().then((done) => !done);
    const timer = setTimeout(() => {
      firstVisit.then((first) => router.replace(first ? '/onboarding/language' : '/home'));
    }, hold + duration);
    return () => clearTimeout(timer);
  }, [leaving, reducedMotion]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: 1 - leaving.get(),
    transform: [{ translateY: reducedMotion ? 0 : -leaving.get() * LIFT_DISTANCE }],
  }));
  const settleStyle = useAnimatedStyle(() => ({ opacity: leaving.get() }));

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <LinearGradient {...Gradients.splash} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.centre, { paddingTop: insets.top + FRAME_MASCOT_TOP - FRAME_STATUS_BAR }, contentStyle]}>
        <Mascot size={168} alive />
        <ThemedText type="splashLine" style={styles.line}>
          A cleaner UAE starts with you
        </ThemedText>
        <ThemedText type="arabicLead" themeColor="textWeak" style={styles.arabic}>
          إمارات أنظف تبدأ بك
        </ThemedText>
      </Animated.View>

      <Animated.View style={[styles.wordmark, { bottom: Math.max(insets.bottom, 58) }, contentStyle]}>
        <Logomark size={28} />
        <ThemedText type="wordmark" themeColor="brand">
          CleanScape
        </ThemedText>
        <View style={[styles.divider, { backgroundColor: theme.strokeStrong }]} />
        <ThemedText type="arabicBrand" themeColor="brand">
          كلين سكيب
        </ThemedText>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }, settleStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  centre: {
    alignItems: 'center',
  },
  line: {
    marginTop: Spacing.threeHalf,
    textAlign: 'center',
  },
  arabic: {
    marginTop: 3,
    textAlign: 'center',
  },
  wordmark: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  divider: {
    width: 1,
    height: 16,
  },
});
