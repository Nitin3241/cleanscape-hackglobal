import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { Confetti, type ConfettiPiece } from '@/components/onboarding/confetti';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Long enough to be a deliberate mark rather than a tap, however fast it's drawn.
const MIN_STROKE_LENGTH = 60;
// The tick from Figma, used when a screen reader user makes the pledge without drawing.
const SAMPLE_TICK = 'M85 125C99 135 115 155 125 169C151 119 185 83 229 65';

const CONFETTI: readonly ConfettiPiece[] = [
  { x: -122, y: -90, rotate: -20, color: 'secondary' },
  { x: 106, y: -76, rotate: 30, color: 'accent' },
  { x: -102, y: 68, rotate: -40, color: 'statusSuccess' },
  { x: 117, y: 63, rotate: 15, color: 'secondary' },
  { x: -2, y: -100, rotate: -60, color: 'accent' },
  { x: 88, y: -9, rotate: -10, color: 'fill' },
];

export default function PledgeRoute() {
  const theme = useTheme();
  const [started, setStarted] = useState(false);
  const [pledged, setPledged] = useState(false);
  const path = useSharedValue('');
  const strokeLength = useSharedValue(0);
  const lastPoint = useSharedValue({ x: 0, y: 0 });

  function finishPledge() {
    setPledged(true);
    feedback.play('pledge.signed');
  }

  function clear() {
    path.set('');
    strokeLength.set(0);
    setStarted(false);
    setPledged(false);
  }

  const draw = Gesture.Pan()
    .minDistance(0)
    .onBegin((event) => {
      path.set(`${path.get()}M${event.x} ${event.y}`);
      lastPoint.set({ x: event.x, y: event.y });
      scheduleOnRN(setStarted, true);
    })
    .onUpdate((event) => {
      path.set(`${path.get()}L${event.x} ${event.y}`);
      const last = lastPoint.get();
      strokeLength.set(strokeLength.get() + Math.hypot(event.x - last.x, event.y - last.y));
      lastPoint.set({ x: event.x, y: event.y });
    })
    .onFinalize(() => {
      if (strokeLength.get() >= MIN_STROKE_LENGTH) scheduleOnRN(finishPledge);
    });

  const strokeProps = useAnimatedProps(() => ({ d: path.get() }));

  return (
    <OnboardingScreen
      top={120}
      scrollable={false}
      footer={<Button label="I pledge" size="large" disabled={!pledged} onPress={() => router.push('/onboarding/location')} />}>
      <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
        Make your pledge
      </ThemedText>
      <ThemedText type="lead" themeColor="textWeak" style={[styles.centred, styles.body]}>
        {"Draw a tick to promise you'll leave every place cleaner than you found it."}
      </ThemedText>

      <GestureDetector gesture={draw}>
        <View
          collapsable={false}
          accessible
          accessibilityRole="button"
          accessibilityLabel={pledged ? 'Pledge made' : 'Pledge pad. Double tap to make your pledge.'}
          onAccessibilityTap={() => {
            path.set(SAMPLE_TICK);
            setStarted(true);
            finishPledge();
          }}
          style={[styles.pad, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          {!started && (
            <View pointerEvents="none" style={styles.hint}>
              <ThemedText type="hint" themeColor="strokeStrong">
                Draw a tick here
              </ThemedText>
            </View>
          )}
          <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <AnimatedPath
              animatedProps={strokeProps}
              fill="none"
              stroke={theme.brand}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          {pledged && <Confetti pieces={CONFETTI} />}
        </View>
      </GestureDetector>

      <View style={styles.clear}>
        <TextButton label="Clear" color="textWeak" disabled={!started} onPress={clear} />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.two,
    maxWidth: 296,
    alignSelf: 'center',
  },
  pad: {
    marginTop: Spacing.five,
    height: 240,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.panel,
  },
  // Figma Onb 08a sits the hint 3 px above the pad's centre (y 107 of 240).
  hint: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.oneHalf,
  },
  clear: {
    marginTop: Spacing.threeLess,
  },
});
