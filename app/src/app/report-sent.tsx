import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { beatOne, beatTwo } from '@/components/motion/celebrate';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { SENT } from '@/data/reports.sample';
import { useTheme } from '@/hooks/use-theme';

/**
 * R1·3 Report sent / R1·3c +1 added: what happens next, and the Smileys once it's confirmed.
 * "Done" goes back to the camera for the next report, as in Figma.
 */
export default function ReportSentRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const data = kind === 'plusOne' ? SENT.plusOne : SENT.new;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.five }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={beatOne()} style={[styles.halo, { backgroundColor: theme.secondarySubtle }]}>
          <Smiley size={88} />
          <View style={[styles.badge, { backgroundColor: theme.statusSuccess }]}>
            <ThemedText type="labelSmall" themeColor="textOnBrand">
              {data.badge}
            </ThemedText>
          </View>
        </Animated.View>
        <View style={styles.titles}>
          <Animated.View entering={beatOne()}>
            <ThemedText type="welcomeTitle" accessibilityRole="header" style={styles.center}>
              {data.title}
            </ThemedText>
          </Animated.View>
          <Animated.View entering={beatTwo()}>
            <ThemedText type="hint" themeColor="textWeak" style={styles.center}>
              {data.body}
            </ThemedText>
          </Animated.View>
        </View>

        <Animated.View entering={beatTwo()} style={[styles.card, { borderColor: theme.strokeWeak }]}>
          <ThemedText type="label">What happens next</ThemedText>
          {data.steps.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    step.state === 'done' && { backgroundColor: theme.statusSuccess, borderColor: theme.statusSuccess },
                    step.state === 'current' && { borderColor: theme.brand },
                    step.state === 'todo' && { borderColor: theme.strokeControl },
                  ]}>
                  {step.state === 'done' && <Icon name="check" size={12} color="textOnBrand" strokeWidth={3} />}
                  {step.state === 'current' && <View style={[styles.inner, { backgroundColor: theme.brand }]} />}
                </View>
                {index < data.steps.length - 1 && (
                  <View
                    style={[styles.line, { backgroundColor: step.state === 'done' ? theme.statusSuccess : theme.strokeControl }]}
                  />
                )}
              </View>
              <View style={styles.stepText}>
                <ThemedText
                  type={step.state === 'todo' ? 'hint' : 'label'}
                  themeColor={step.state === 'todo' ? 'textWeak' : 'textStrong'}>
                  {step.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {step.note}
                </ThemedText>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={beatTwo()} style={[styles.reward, { backgroundColor: theme.secondarySubtle }]}>
          <Smiley size={26} />
          <View style={styles.flex}>
            <ThemedText type="labelSmall" themeColor="textSecondary">
              {data.reward.title}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {data.reward.note}
            </ThemedText>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={beatTwo()} style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        {/* Tracking a report over time isn't designed yet; it opens your Smileys for now. */}
        <Button label="Track report" size="large" onPress={() => router.push('/report-status')} />
        {/* Figma sends Done back to the camera (R1·1a) for the next report; close the camera to leave. */}
        <TextButton label="Done" onPress={() => router.replace('/report')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  halo: {
    alignSelf: 'center',
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 72,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 0,
    minWidth: 32,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    borderRadius: 9,
    transform: [{ rotate: '-8deg' }],
  },
  titles: {
    gap: Spacing.one,
  },
  center: {
    textAlign: 'center',
  },
  card: {
    gap: Spacing.twoHalf,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  rail: {
    alignItems: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  inner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 16,
    marginVertical: 2,
  },
  stepText: {
    flex: 1,
    paddingBottom: Spacing.one,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  flex: {
    flex: 1,
  },
  footer: {
    gap: Spacing.one,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'stretch',
  },
});
