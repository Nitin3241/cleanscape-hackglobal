import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { RouteTimeline } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Smiley } from '@/components/ui/smiley';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Toggle } from '@/components/ui/toggle';
import { FigmaLines } from '@/constants/figma-lines';
import { minusXml, plusXml, seatXml } from '@/constants/rides-art';
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
  const [rideBack, setRideBack] = useState(true);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Offer seats" subtitle="Kite Beach · Sat 5 Dec" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 120 }]}>
        <View style={styles.hero}>
          <ThemedText type="heading" accessibilityRole="header" style={styles.heroTitle}>
            Share your ride
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak" style={FigmaLines.l20}>
            Riders get to Kite Beach free. You earn Smileys.
          </ThemedText>
        </View>

        <View style={[styles.well, { backgroundColor: theme.tileNeutral }]}>
          <RouteTimeline
            from={{
              time: leave.replace(' AM', ''),
              place: 'Al Karama Metro, exit 2',
              note: 'Your pickup point ·',
              action: (
                <ThemedText type="chipAction" themeColor="brand" style={FigmaLines.l18}>
                  Change
                </ThemedText>
              ),
            }}
            to={{ time: '6:30', place: 'Kite Beach · Gate 2', note: 'Drop-off for the briefing' }}
          />
        </View>

        <View style={[styles.form, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
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
                  <SvgXml
                    key={index}
                    xml={index < seats ? seatXml(theme.brand, 1.65) : seatXml(theme.strokeChip, 1.1)}
                    width={22}
                    height={22}
                  />
                ))}
              </View>
              <ThemedText type="link" style={[styles.flex, FigmaLines.l21]} accessibilityLiveRegion="polite">
                {`${seats} ${seats === 1 ? 'seat' : 'seats'}`}
              </ThemedText>
              <View style={styles.stepper}>
                <StepButton
                  xml={minusXml(theme.brand)}
                  label="Fewer seats"
                  disabled={seats <= 1}
                  onPress={() => setSeats((n) => Math.max(1, n - 1))}
                />
                <StepButton
                  xml={plusXml(theme.brand)}
                  label="More seats"
                  disabled={seats >= MAX_SEATS}
                  onPress={() => setSeats((n) => Math.min(MAX_SEATS, n + 1))}
                />
              </View>
            </View>
          </Field>
          <Field label="Who can join" divider>
            <View style={styles.chips}>
              {WHO.map((option) => (
                <ChoiceChip key={option} label={option} selected={option === who} onPress={() => setWho(option)} />
              ))}
            </View>
          </Field>
          {/* Figma T8 "Row · Ride back". */}
          <View style={[styles.rideBack, { borderTopColor: theme.strokeWeak }]}>
            <View style={[styles.flex, styles.rideBackText]}>
              <ThemedText type="label" style={FigmaLines.l21}>
                Ride back too
              </ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                Gate 2 → Al Karama at 10:15 AM
              </ThemedText>
            </View>
            <Toggle value={rideBack} onValueChange={setRideBack} label="Ride back too" />
          </View>
        </View>
      </ScrollView>

      <StickyFooter tabGap={28} align="start">
        <View style={styles.reward}>
          <View style={styles.rewardRow}>
            <Smiley size={18} />
            <ThemedText type="label" themeColor="textPaper" style={FigmaLines.l21}>
              {`+${seats * SMILEYS_PER_RIDER} Smileys`}
            </ThemedText>
          </View>
          <ThemedText type="meta" themeColor="textWeak">
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
    <View style={[styles.field, divider && { borderTopWidth: 1, borderTopColor: theme.strokeWeak }]}>
      <ThemedText type="fieldLabel" themeColor="textWeak" style={FigmaLines.l20}>
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

/** Figma T8 stepper button: a 33 px brand ring with an 18 px minus or plus. */
function StepButton({ xml, label, disabled, onPress }: { xml: string; label: string; disabled: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={[styles.stepButton, { borderColor: theme.brand }, disabled && styles.stepDisabled]}>
      <SvgXml xml={xml} width={18} height={18} />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma T8 "Form": 20 padding, 20 between blocks.
  content: {
    gap: Spacing.threeHalf,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  hero: {
    gap: Spacing.half,
  },
  heroTitle: {
    lineHeight: 36,
  },
  well: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card,
  },
  form: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  field: {
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  flex: {
    flex: 1,
  },
  // Figma's chips are 38 tall (border outside the 8 px padding); the shared chip is 36, so pad the row by 1.
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingVertical: 1,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  seatIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  stepButton: {
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.pill,
  },
  stepDisabled: {
    opacity: 0.4,
  },
  rideBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderTopWidth: 1,
  },
  rideBackText: {
    gap: Spacing.half,
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
