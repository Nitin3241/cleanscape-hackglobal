import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { beatOne, beatTwo } from '@/components/motion/celebrate';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { BEFORE_YOU_START, CHECK_IN } from '@/data/check-in.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { setCheckedIn } from '@/state/event-day';
import { useEffect } from 'react';

/** F4·4: the volunteer's side once the crew head has scanned them. Hours start now. */
export default function CheckedInRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    feedback.play('register.success');
    setCheckedIn(true);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Check-in" subtitle={CHECK_IN.place} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero} accessibilityLiveRegion="polite">
          {/* Figma F4·4 "· enter A/B" (9 Nov): the tick and headline are beat 1, everything else beat 2. */}
          <Animated.View entering={beatOne()} style={[styles.halo, { backgroundColor: theme.statusSuccessSubtle }]}>
            <View style={[styles.tick, { backgroundColor: theme.statusSuccess }]}>
              <Icon name="check" size={32} color="textOnBrand" strokeWidth={2.5} />
            </View>
          </Animated.View>
          <Animated.View entering={beatOne()}>
            <ThemedText type="heading" accessibilityRole="header">
              {"You're checked in"}
            </ThemedText>
          </Animated.View>
          <Animated.View entering={beatTwo()}>
            <ThemedText type="note" themeColor="textWeak">
              {`${CHECK_IN.time} · by ${CHECK_IN.crewHead}, your crew head`}
            </ThemedText>
          </Animated.View>
          <Animated.View entering={beatTwo()} style={[styles.hours, { backgroundColor: theme.statusSuccessSubtle }]}>
            <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
            <ThemedText type="smallMedium" themeColor="statusSuccess">
              Your hours have started
            </ThemedText>
          </Animated.View>
        </View>

        <Animated.View entering={beatTwo()} style={[styles.card, styles.crew, { borderColor: theme.strokeWeak }]}>
          <View style={[styles.crewBadge, { backgroundColor: theme.statusSuccessSubtle }]}>
            <ThemedText type="labelLarge" themeColor="statusSuccess">
              {CHECK_IN.crew.letter}
            </ThemedText>
          </View>
          <View style={styles.flex}>
            <ThemedText type="labelLarge">{CHECK_IN.crew.name}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {CHECK_IN.crew.note}
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={beatTwo()} style={[styles.card, styles.before, { borderColor: theme.strokeWeak }]}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              Before you start
            </ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              30 sec
            </ThemedText>
          </View>
          {BEFORE_YOU_START.map((row) => (
            <View key={row.title} style={styles.tip}>
              <IconTile
                icon={row.icon}
                size={32}
                iconSize={16}
                tone={row.tone}
                color={row.tone === 'accentSubtle' ? 'textAccent' : 'brand'}
              />
              <View style={styles.flex}>
                <ThemedText type="label">{row.title}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {row.note}
                </ThemedText>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <Animated.View
        entering={beatTwo()}
        style={[
          styles.footer,
          { backgroundColor: theme.card, boxShadow: Shadows.stickyFooter, paddingBottom: Math.max(insets.bottom, Spacing.three) },
        ]}>
        <Button label="I'm ready" size="large" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
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
    padding: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  halo: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.threeLess,
    borderRadius: 44,
  },
  tick: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  crew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  crewBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  flex: {
    flex: 1,
  },
  before: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  footer: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
});
