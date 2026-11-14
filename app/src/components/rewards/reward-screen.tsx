import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { beatOne, beatTwo } from '@/components/motion/celebrate';
import { Confetti, type ConfettiPiece } from '@/components/onboarding/confetti';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Smiley } from '@/components/ui/smiley';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const CONFETTI: readonly ConfettiPiece[] = [
  { x: -120, y: -150, rotate: -20, color: 'brand' },
  { x: 100, y: -165, rotate: 30, color: 'secondary' },
  { x: -150, y: -40, rotate: -40, color: 'avatarCoral' },
  { x: 140, y: -60, rotate: 15, color: 'avatarTeal' },
  { x: -110, y: 70, rotate: -60, color: 'avatarTeal' },
  { x: 120, y: 80, rotate: -35, color: 'statusSuccess' },
  { x: 30, y: -195, rotate: -10, color: 'statusSuccess' },
];

type RewardScreenProps = {
  smileys: number;
  message: string;
  /** Three numbers under the message; the last one is the Smileys balance, in gold. */
  stats: readonly [{ value: string; label: string }, { value: string; label: string }, { value: string; label: string }];
  progress: { title: string; trailing: string; value: number; note: string; label: string };
  primary: { label: string; onPress: () => void };
  secondary: { label: string; onPress: () => void };
};

/**
 * The "+N Smileys" moment after a good deed: sorting (Figma F4·11) and bag log (F5·4).
 * Confetti, the Smiley popping in with its +N badge, today's numbers and what's next.
 */
export function RewardScreen({ smileys, message, stats, progress, primary, secondary }: RewardScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    feedback.play('register.success');
  }, []);

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.background, paddingTop: insets.top + 64, paddingBottom: Math.max(insets.bottom, Spacing.three) },
      ]}>
      {/* Figma "· enter A/B" (9 Nov): beat 1 the Smiley and headline, beat 2 the rest and falling confetti. */}
      <View style={styles.hero}>
        <Confetti pieces={CONFETTI} fall />
        <Animated.View entering={beatOne()} style={[styles.halo, { backgroundColor: theme.secondarySubtle }]}>
          <Smiley size={104} />
          <View style={[styles.plus, { backgroundColor: theme.statusSuccess }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand">{`+${smileys}`}</ThemedText>
          </View>
        </Animated.View>
      </View>

      <View style={styles.copy} accessibilityLiveRegion="polite">
        <Animated.View entering={beatOne()}>
          <ThemedText type="heading" accessibilityRole="header">{`+${smileys} Smileys`}</ThemedText>
        </Animated.View>
        <Animated.View entering={beatTwo()}>
          <ThemedText type="lead" themeColor="textWeak" style={styles.centred}>
            {message}
          </ThemedText>
        </Animated.View>
      </View>

      <Animated.View entering={beatTwo()} style={[styles.stats, { borderColor: theme.strokeWeak }]}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={styles.statWrap}>
            {index > 0 && <View style={[styles.rule, { backgroundColor: theme.strokeWeak }]} />}
            <View style={styles.stat} accessible accessibilityLabel={`${stat.value} ${stat.label}`}>
              <ThemedText type="sheetPrompt" themeColor={index === 2 ? 'textPaper' : 'textStrong'}>
                {stat.value}
              </ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                {stat.label}
              </ThemedText>
            </View>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={beatTwo()} style={styles.progress}>
        <View style={styles.rowBetween}>
          <ThemedText type="label">{progress.title}</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            {progress.trailing}
          </ThemedText>
        </View>
        <ProgressBar progress={progress.value} tone="secondary" label={progress.label} />
        <ThemedText type="caption" themeColor="textWeak">
          {progress.note}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={beatTwo()} style={styles.actions}>
        <Button label={primary.label} size="large" onPress={primary.onPress} />
        <TextButton label={secondary.label} onPress={secondary.onPress} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 84,
  },
  plus: {
    position: 'absolute',
    top: 22,
    end: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.small,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  centred: {
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  statWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  rule: {
    width: 1,
    height: 36,
  },
  progress: {
    gap: Spacing.oneHalf,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    marginTop: 'auto',
    gap: Spacing.two,
  },
});
