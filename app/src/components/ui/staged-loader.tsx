import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { StepSpinner } from '@/components/earthy/step-spinner';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StepState = 'pending' | 'active' | 'done';

type StagedLoaderProps = {
  title: string;
  subtitle?: string;
  steps: readonly string[];
  /** Called once, `total` ms after the screen opens. */
  onDone: () => void;
  /** When each step starts, in ms (Figma F10·10a: 300, 920, 1540, 2160). */
  starts?: readonly number[];
  /** How long each step spins before its tick (Figma: 500 ms). */
  spin?: number;
  /** Auto-continue time (Figma F10·10a: 3.4 s). */
  total?: number;
};

const BACK = Easing.bezier(0.34, 1.4, 0.64, 1);

/**
 * Staged loader for an action the person started (Figma loader rule, 13 Nov; F10·10a, I3s): each step goes
 * pending ring → spinning arc → green tick that pops; the Earthy orb breathes. Plays once and never restarts.
 */
export function StagedLoader({
  title,
  subtitle,
  steps,
  onDone,
  starts = [300, 920, 1540, 2160],
  spin = 500,
  total = 3400,
}: StagedLoaderProps) {
  const reducedMotion = useReducedMotion();
  const [states, setStates] = useState<StepState[]>(() => steps.map(() => 'pending'));
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, index) => {
      const begin = starts[index] ?? starts[starts.length - 1] + (index - starts.length + 1) * 620;
      timers.push(setTimeout(() => setStates((s) => s.map((v, i) => (i === index ? 'active' : v))), begin));
      timers.push(setTimeout(() => setStates((s) => s.map((v, i) => (i === index ? 'done' : v))), begin + spin));
    });
    timers.push(setTimeout(() => done.current(), total));
    return () => timers.forEach(clearTimeout);
    // Plays once for the life of the screen, by design (it must never restart while waiting).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <EarthyOrb state={reducedMotion ? 'still' : 'thinking'} size={64} glow={false} />
      <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.centred}>
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText type="meta13" themeColor="textWeak" style={styles.centred}>
          {subtitle}
        </ThemedText>
      )}
      <StepsCard steps={steps} states={states} />
    </View>
  );
}

/** The grey card of steps (F10·10a "Steps": #F4F7F8, 20 px corners, 16 px padding, 14 px gap). */
export function StepsCard({ steps, states }: { steps: readonly string[]; states: readonly StepState[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.loaderCard }]}>
      {steps.map((label, index) => (
        <Step key={label} label={label} state={states[index] ?? 'pending'} />
      ))}
    </View>
  );
}

function Step({ label, state }: { label: string; state: StepState }) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    if (state !== 'pending') opacity.set(withTiming(1, { duration: 200 }));
  }, [opacity, state]);

  const textStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <View
      style={styles.step}
      accessible
      accessibilityLabel={`${label}, ${state === 'done' ? 'done' : state === 'active' ? 'in progress' : 'waiting'}`}>
      <View style={styles.mark}>
        {state === 'done' ? <DoneMark /> : state === 'active' ? <StepSpinner size={20} /> : <PendingRing />}
      </View>
      <Animated.View style={[styles.flex, textStyle]}>
        <ThemedText type="bodyMedium14">{label}</ThemedText>
      </Animated.View>
    </View>
  );
}

export function PendingRing() {
  const theme = useTheme();
  return <View style={[styles.ring, { borderColor: theme.strokeControl }]} />;
}

/** Solid green circle with a white tick, popping in (scale 0.5 → 1, back ease). */
export function DoneMark() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(reducedMotion ? 1 : 0.5);

  useEffect(() => {
    if (!reducedMotion) scale.set(withTiming(1, { duration: 320, easing: BACK }));
  }, [reducedMotion, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={[styles.done, { backgroundColor: theme.statusSuccess }, style]}>
      <Icon name="check" size={13} color="textOnBrand" strokeWidth={3} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  centred: {
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    gap: Spacing.threeLess,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  mark: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
  },
  done: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  flex: {
    flex: 1,
  },
});
