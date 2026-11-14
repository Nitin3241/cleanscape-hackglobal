// "Thinking" checklist: each step slides in, spins while active, then turns into a tick.
// Text keeps ONE font weight in every state (only its colour changes), so nothing jumps sideways.
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { dur, ease } from '@/components/earthy/motion';
import { StepCheck } from '@/components/earthy/step-check';
import { StepSpinner } from '@/components/earthy/step-spinner';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThinkingStep = { id: string; label: string; status: 'active' | 'done' };

function StepRow({ step }: { step: ThinkingStep }) {
  const theme = useTheme();
  const done = useSharedValue(step.status === 'done' ? 1 : 0);

  useEffect(() => {
    done.set(withTiming(step.status === 'done' ? 1 : 0, { duration: dur.base, easing: ease }));
  }, [done, step.status]);

  const text = useAnimatedStyle(() => ({
    color: interpolateColor(done.get(), [0, 1], [theme.textStrong, theme.textWeak]),
  }));

  return (
    <Animated.View
      style={styles.row}
      entering={FadeInUp.duration(dur.base).easing(ease).withInitialValues({ opacity: 0, transform: [{ translateY: 6 }] })}
      layout={LinearTransition.duration(dur.base).easing(ease)}>
      <View style={styles.icon}>
        {step.status === 'active' ? (
          <Animated.View key="spin" exiting={FadeOut.duration(dur.fast)}>
            <StepSpinner />
          </Animated.View>
        ) : (
          <StepCheck key="check" />
        )}
      </View>
      <Animated.Text style={[styles.label, text]} numberOfLines={1}>
        {step.label}
      </Animated.Text>
    </Animated.View>
  );
}

export function ThinkingSteps({ steps }: { steps: readonly ThinkingStep[] }) {
  return (
    <View style={styles.list} accessibilityLiveRegion="polite">
      {steps.map((step) => (
        <StepRow key={step.id} step={step} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.twoHalf },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.twoHalf },
  icon: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  // Same family and weight in every state. Size from the Figma frame F9v2·2a.
  label: { flexShrink: 1, fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
});
