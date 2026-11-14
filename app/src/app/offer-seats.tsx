import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Icon } from '@/components/ui/icon';
import { RouteTimeline, Stepper } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Smiley } from '@/components/ui/smiley';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { LEAVE_TIMES } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const MAX_SEATS = 4;
const SMILEYS_PER_RIDER = 10;
const WHO = ['Any verified volunteer', 'Women only'] as const;

/** T8: offer seats in one screen. First-time drivers add a licence before publishing (T9). */
export default function OfferSeatsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const [leave, setLeave] = useState(LEAVE_TIMES[1]);
  const [seats, setSeats] = useState(3);
  const [who, setWho] = useState<(typeof WHO)[number]>(WHO[0]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Offer seats" subtitle="Kite Beach · Sat 5 Dec" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 120 }]}>
        <View>
          <ThemedText type="heading" accessibilityRole="header">
            Share your ride
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            Riders get to Kite Beach free. You earn Smileys.
          </ThemedText>
        </View>

        <View style={[styles.well, { backgroundColor: theme.wellCool }]}>
          <RouteTimeline
            from={{
              time: leave.replace(' AM', ''),
              place: 'Al Karama Metro, exit 2',
              note: 'Your pickup point ·',
              action: (
                <ThemedText type="tag" themeColor="brand">
                  Change
                </ThemedText>
              ),
            }}
            to={{ time: '6:30', place: 'Kite Beach · Gate 2', note: 'Drop-off for the briefing' }}
          />
        </View>

        <View style={[styles.form, { backgroundColor: theme.card, borderColor: theme.divider }]}>
          <Field label="Leave at">
            <View style={styles.chips}>
              {LEAVE_TIMES.map((time) => (
                <ChoiceChip key={time} label={time} selected={time === leave} onPress={() => setLeave(time)} />
              ))}
            </View>
          </Field>
          <Field label="Seats you can offer" divider>
            <View style={styles.seatsRow}>
              <View style={styles.seatIcons} accessible={false}>
                {Array.from({ length: MAX_SEATS }, (_, index) => (
                  <Icon key={index} name="seat" size={18} color={index < seats ? 'brand' : 'seatEmpty'} strokeWidth={1.5} />
                ))}
                <ThemedText type="label" style={styles.seatCount}>
                  {`${seats} ${seats === 1 ? 'seat' : 'seats'}`}
                </ThemedText>
              </View>
              <Stepper value={seats} min={1} max={MAX_SEATS} label="seats" onChange={setSeats} />
            </View>
          </Field>
          <Field label="Who can join" divider>
            <View style={styles.chips}>
              {WHO.map((option) => (
                <ChoiceChip key={option} label={option} selected={option === who} onPress={() => setWho(option)} />
              ))}
            </View>
          </Field>
        </View>
      </ScrollView>

      <StickyFooter>
        <View style={styles.reward}>
          <View style={styles.rewardRow}>
            <Smiley size={18} />
            <ThemedText type="label" themeColor="textSecondary">
              {`+${seats * SMILEYS_PER_RIDER} Smileys`}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textWeak">
            {`+${SMILEYS_PER_RIDER} per rider you bring`}
          </ThemedText>
        </View>
        <View style={styles.footerButton}>
          <Button
            label="Publish ride"
            flat
            onPress={() => {
              if (registration.licenceAdded) {
                registration.publishRide();
                router.replace('/ride-published');
              } else {
                router.push('/licence');
              }
            }}
          />
        </View>
      </StickyFooter>
      <TabBar active="events" />
    </View>
  );
}

function Field({ label, divider = false, children }: { label: string; divider?: boolean; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.field, divider && { borderTopWidth: 1, borderTopColor: theme.divider }]}>
      <ThemedText type="fieldLabel" themeColor="textWeak">
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  well: {
    padding: Spacing.three,
    paddingBottom: 0,
    borderRadius: Radius.option,
  },
  form: {
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  field: {
    gap: Spacing.twoHalf,
    padding: Spacing.three,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  seatCount: {
    marginStart: Spacing.two,
  },
  reward: {
    gap: Spacing.half,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  footerButton: {
    minWidth: 140,
  },
});
