import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { BAG, BAG_RESULT, FULLNESS } from '@/data/bag-log.sample';
import { useTheme } from '@/hooks/use-theme';

/** DEMO: Figma's prototype moves on once the crew head has weighed the bag (F5·2 → F5·4). */
const WEIGHED_AFTER = 3000; // Figma F5·2 → F5·4: auto 3 s.

/** F5·2: hand the bag to the crew head. Smileys land after the weigh-in. */
export default function BagHandedRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ fullness?: string; inside?: string }>();
  const fullness = FULLNESS.find((option) => option.key === params.fullness) ?? FULLNESS[1];
  const inside = (params.inside || BAG.earthyFound.join(', ')).toLowerCase();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/bag-earned'), WEIGHED_AFTER);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { title: `Bag #${BAG.number} logged`, note: `${fullness.label} · ${inside}`, state: 'done' },
    { title: 'Weigh-in', note: 'Your crew head checks the kg', state: 'now' },
    { title: 'Smileys added', note: `About +${BAG_RESULT.estimate} for a full bag`, state: 'next' },
  ] as const;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.five, paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.halo, { backgroundColor: theme.secondarySubtle }]}>
          <Smiley size={110} />
          <View style={[styles.wait, { backgroundColor: theme.secondary }]}>
            <Icon name="hourglass" size={14} color="textStrong" strokeWidth={2} />
          </View>
        </View>
        <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
          Hand it in
        </ThemedText>
        <ThemedText type="lead" themeColor="textWeak" style={styles.centred}>
          {`Give bag #${BAG.number} to ${BAG.crewHead}, your crew head, at the tent. Smileys come after the weigh-in.`}
        </ThemedText>

        <View style={[styles.card, { borderColor: theme.strokeWeak }]} accessibilityLiveRegion="polite">
          <ThemedText type="labelLarge" accessibilityRole="header">
            What happens next
          </ThemedText>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.mark,
                    step.state === 'done' && { backgroundColor: theme.statusSuccess, borderColor: theme.statusSuccess },
                    step.state === 'now' && { borderColor: theme.brand, borderWidth: 2 },
                    step.state === 'next' && { borderColor: theme.strokeControl },
                  ]}>
                  {step.state === 'done' && <Icon name="check" size={12} color="textOnBrand" strokeWidth={3} />}
                  {step.state === 'now' && <View style={[styles.nowDot, { backgroundColor: theme.brand }]} />}
                </View>
                {index < steps.length - 1 && <View style={[styles.line, { backgroundColor: theme.strokeControl }]} />}
              </View>
              <View style={styles.flex}>
                <ThemedText type="label" themeColor={step.state === 'next' ? 'textWeak' : 'textStrong'}>
                  {step.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {step.note}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.note, { backgroundColor: theme.secondarySubtle }]}>
          <Smiley size={28} />
          <View style={styles.flex}>
            <ThemedText type="labelSmall" themeColor="textSecondary">{`About +${BAG_RESULT.estimate} Smileys on the way`}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Added once your bag is weighed
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <Button label="Log another" size="large" onPress={() => router.replace('/bag-log')} />
        <TextButton label="Done" onPress={() => router.dismissTo('/home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  halo: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
  },
  wait: {
    position: 'absolute',
    top: 32,
    end: 6,
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  centred: {
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  rail: {
    alignItems: 'center',
  },
  mark: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 1.5,
    flex: 1,
    minHeight: 18,
    marginVertical: 2,
  },
  flex: {
    flex: 1,
  },
  note: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  actions: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    bottom: 0,
    gap: Spacing.two,
  },
});
