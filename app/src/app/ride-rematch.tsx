import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RideCard } from '@/components/events/ride-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { TextButton } from '@/components/ui/text-button';
import { Spacing } from '@/constants/theme';
import { SAMPLE_RIDES } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** T13: the driver cancelled. The place at the cleanup is safe, and the next seat is offered. */
export default function RideRematchSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const cancelled = SAMPLE_RIDES.find((ride) => ride.id === registration.rideId) ?? SAMPLE_RIDES[0];
  const next = SAMPLE_RIDES.find((ride) => ride.id !== cancelled.id) ?? SAMPLE_RIDES[1];
  const firstName = cancelled.driver.name.split(' ')[0];
  const nextName = next.driver.name.split(' ')[0];

  return (
    <RouteSheet accessibilityLabel={`${firstName} can't drive`}>
      <View style={styles.header}>
        <View>
          <View style={styles.faded}>
            <Avatar initials={cancelled.driver.initials} tone={cancelled.driver.tone} size={44} />
          </View>
          <View style={[styles.cross, { backgroundColor: theme.textAccent, borderColor: theme.card }]}>
            <Icon name="close" size={10} color="textOnBrand" strokeWidth={3} />
          </View>
        </View>
        <View style={styles.headerText}>
          <ThemedText type="sheetPrompt" accessibilityRole="header">
            {`${firstName} can't drive on Saturday`}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            Her plans changed. Your spot at Kite Beach is safe.
          </ThemedText>
        </View>
      </View>

      <View style={styles.found}>
        <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
        <ThemedText type="labelSmall" themeColor="statusSuccess">
          We found you another seat
        </ThemedText>
      </View>
      <RideCard ride={{ ...next, dropoffNote: next.dropoffNote, rideNote: next.dropoffNote }} best badge={false} />

      <View style={styles.actions}>
        <Button
          label="Take seat"
          accessibilityLabel={`Take ${nextName}'s seat`}
          size="large"
          onPress={() => {
            registration.takeRide(next.id);
            router.back();
          }}
        />
        <TextButton
          label="Take Metro"
          onPress={() => {
            registration.cancelRide();
            router.replace('/transit');
          }}
        />
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  faded: {
    opacity: 0.6,
  },
  cross: {
    position: 'absolute',
    end: -2,
    bottom: -2,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 9,
  },
  headerText: {
    flex: 1,
  },
  found: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  actions: {
    gap: Spacing.three,
  },
});
