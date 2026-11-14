import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { SAMPLE_RIDES } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** T5: the request is out. Shows the three steps until the seat is on the pass. */
export default function RideRequestedSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const ride = SAMPLE_RIDES.find((item) => item.id === registration.rideId) ?? SAMPLE_RIDES[0];
  const firstName = ride.driver.name.split(' ')[0];
  const accepted = registration.ride === 'accepted';

  const steps = [
    { title: 'Request sent', detail: 'Just now', done: true },
    { title: `${firstName} accepts`, detail: accepted ? 'Accepted' : 'Waiting…', done: accepted, current: !accepted },
    { title: 'Ride added to your pass', detail: `Pickup ${ride.pickupTime} AM, Sat 5 Dec`, done: accepted },
  ];

  return (
    <RouteSheet accessibilityLabel={`Request sent to ${firstName}`}>
      <View style={styles.header}>
        <View style={[styles.avatarRing, { borderColor: theme.wellCool }]}>
          <Avatar initials={ride.driver.initials} tone={ride.driver.tone} size={48} />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="screenTitle" accessibilityRole="header">
            {accepted ? `${firstName} accepted` : `Request sent to ${firstName}`}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            {accepted ? 'Your seat is on your pass' : 'She usually replies within an hour'}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.steps, { backgroundColor: theme.wellCool }]} accessibilityLiveRegion="polite">
        {steps.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  step.done
                    ? { backgroundColor: theme.brand, borderColor: theme.brand }
                    : { backgroundColor: theme.card, borderColor: step.current ? theme.brand : theme.seatEmpty },
                ]}>
                {step.done && <Icon name="tick" size={11} color="textOnBrand" strokeWidth={2.5} />}
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: step.done ? theme.brand : theme.seatEmpty }]} />
              )}
            </View>
            <View style={styles.stepText}>
              <ThemedText type="label" themeColor={step.done || step.current ? 'textStrong' : 'textWeak'}>
                {step.title}
              </ThemedText>
              <ThemedText type="meta" themeColor={step.current ? 'brand' : 'textWeak'}>
                {step.detail}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <View style={[styles.noteIcon, { backgroundColor: theme.statusSuccessSubtle }]}>
          <Icon name="check" size={14} color="statusSuccess" />
        </View>
        <ThemedText type="small" themeColor="textWeak" style={styles.noteText}>
          {"If she can't take you, we'll offer you the next seat automatically."}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button label="Done" size="large" onPress={() => router.dismissTo('/pass')} />
        <TextButton
          label={accepted ? 'Cancel ride' : 'Cancel request'}
          color="textAccent"
          onPress={() => {
            registration.cancelRide();
            router.back();
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
  avatarRing: {
    borderWidth: 4,
    borderRadius: 30,
  },
  headerText: {
    flex: 1,
  },
  steps: {
    padding: Spacing.three,
    borderRadius: Radius.option,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  rail: {
    alignItems: 'center',
    width: 18,
  },
  dot: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 9,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 18,
  },
  stepText: {
    flex: 1,
    paddingBottom: Spacing.threeLess,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
  },
  noteIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
  },
  actions: {
    gap: Spacing.three,
  },
});
