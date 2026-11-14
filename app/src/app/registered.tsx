import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { beatOne, beatTwo } from '@/components/motion/celebrate';
import { Confetti, type ConfettiPiece } from '@/components/onboarding/confetti';
import { Mascot } from '@/components/onboarding/mascot';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { Smiley } from '@/components/ui/smiley';
import { CalendarToast } from '@/components/calendar/calendar-toast';
import { TabBar } from '@/components/ui/tab-bar';
import { TextButton } from '@/components/ui/text-button';
import { Gradients, Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { findEvent, meetTime, SAMPLE_FRIEND, SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

// Landing spots, measured from Earthy's centre as on "You're good to go".
const CONFETTI: readonly ConfettiPiece[] = [
  { x: -130, y: -150, rotate: -20, color: 'brand' },
  { x: 110, y: -170, rotate: 30, color: 'secondary' },
  { x: -95, y: -65, rotate: -40, color: 'accent' },
  { x: 125, y: -45, rotate: 15, color: 'brand' },
  { x: -140, y: 10, rotate: -60, color: 'statusSuccess' },
  { x: 40, y: -190, rotate: -10, color: 'accent' },
  { x: 145, y: 30, rotate: -35, color: 'secondary' },
];

/** R5: "You're in", with what happens next. */
export default function RegisteredRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const withFriend = registration.friends > 0;
  const place = event.title.replace(' cleanup', '').replace(' litter walk', '').replace(' sweep', '');
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <LinearGradient {...Gradients.goodToGo} style={StyleSheet.absoluteFill} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 72, paddingBottom: TabBarHeight + insets.bottom + Spacing.four },
        ]}>
        {/* Figma R5 "· enter A/B" (9 Nov): Earthy and the headline are beat 1; the rest, with falling confetti, beat 2. */}
        <Animated.View entering={beatOne()} style={styles.mascot}>
          <Confetti pieces={CONFETTI} fall />
          <Mascot size={120} alive />
        </Animated.View>
        <View style={styles.copy}>
          <Animated.View entering={beatOne()}>
            <ThemedText type="heading" accessibilityRole="header" style={styles.centred}>
              {`You're in, ${SAMPLE_USER.firstName}`}
            </ThemedText>
          </Animated.View>
          <Animated.View entering={beatTwo()}>
            <ThemedText type="lead" themeColor="textWeak" style={styles.centred}>
              {`On Saturday, you${withFriend ? ` and ${SAMPLE_FRIEND.name}` : ''} join ${event.going} volunteers bringing ${place} back to clean.`}
            </ThemedText>
          </Animated.View>
        </View>

        <Animated.View entering={beatTwo()} style={[styles.next, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            What happens next
          </ThemedText>
          <Step
            icon={<IconTile icon="calendar" size={32} iconSize={18} />}
            title="Fri, 4 Dec"
            body="Reminder with weather and parking"
          />
          <Step
            icon={<IconTile icon="clock" size={32} iconSize={18} />}
            title={`Sat, ${meetTime(event)}`}
            body="Show your pass at the check-in tent"
          />
          <Step icon={<Smiley size={32} />} title="+50 Smileys" titleColor="textSecondary" body="Added when you check out" />
        </Animated.View>

        {withFriend && (
          <Animated.View entering={beatTwo()} style={styles.sent}>
            <Icon name="check" size={16} color="brand" />
            <ThemedText type="small" themeColor="textWeak">
              {`${SAMPLE_FRIEND.name}'s pass sent by SMS to ${SAMPLE_FRIEND.phone}`}
            </ThemedText>
          </Animated.View>
        )}

        <Animated.View entering={beatTwo()} style={styles.actions}>
          {/* Opens CAL1 Add to calendar (sheet). */}
          <TextButton label="Save date" onPress={() => router.push('/calendar-add')} />
          <Button label="View pass" size="large" onPress={() => router.replace('/pass')} />
        </Animated.View>
      </ScrollView>
      <TabBar active="events" />
      <CalendarToast />
    </View>
  );
}

function Step({
  icon,
  title,
  titleColor = 'textStrong',
  body,
}: {
  icon: ReactNode;
  title: string;
  titleColor?: 'textStrong' | 'textSecondary';
  body: string;
}) {
  return (
    <View style={styles.step} accessible accessibilityLabel={`${title}. ${body}`}>
      {icon}
      <View style={styles.stepText}>
        <ThemedText type="label" themeColor={titleColor}>
          {title}
        </ThemedText>
        <ThemedText type="meta" themeColor="textWeak">
          {body}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: Spacing.two,
  },
  centred: {
    textAlign: 'center',
  },
  next: {
    gap: Spacing.three,
    padding: Spacing.threeHalf,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  stepText: {
    flex: 1,
  },
  sent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
    marginTop: -Spacing.three,
  },
  actions: {
    gap: Spacing.three,
  },
});
