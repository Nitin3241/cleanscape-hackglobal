import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { railCurrentXml, railDoneXml, railTodoXml, tickBadgeXml } from '@/constants/rides-art';
import { Radius, Spacing } from '@/constants/theme';
import { SAMPLE_RIDES } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

type StepState = 'done' | 'current' | 'todo';

/**
 * T5: the request is out. Shows the three steps until the seat is on the pass.
 * Figma draws an edge-to-edge sheet; it floats here (8 px from the edges, 32 px corners) as today's sheet rule asks.
 */
export default function RideRequestedSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const ride = SAMPLE_RIDES.find((item) => item.id === registration.rideId) ?? SAMPLE_RIDES[0];
  const firstName = ride.driver.name.split(' ')[0];
  const accepted = registration.ride === 'accepted';

  // SAMPLE: the time the request went out (Figma T5).
  const steps: { title: string; detail: string; state: StepState }[] = [
    { title: 'Request sent', detail: '11:42 PM', state: 'done' },
    { title: `${firstName} accepts`, detail: accepted ? 'Accepted' : 'Waiting…', state: accepted ? 'done' : 'current' },
    { title: 'Ride added to your pass', detail: `Pickup ${ride.pickupTime} AM, Sat 5 Dec`, state: accepted ? 'done' : 'todo' },
  ];

  return (
    <RouteSheet accessibilityLabel={`Request sent to ${firstName}`} bottomPadding={28}>
      {/* Figma T5 "Sheet": 18 between blocks. */}
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={[styles.halo, { backgroundColor: theme.brandHalo }]}>
            <Avatar initials={ride.driver.initials} tone={ride.driver.tone} size={44} />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="screenTitle" accessibilityRole="header" style={FigmaLines.l30}>
              {accepted ? `${firstName} accepted` : `Request sent to ${firstName}`}
            </ThemedText>
            <ThemedText type="note" themeColor="textWeak" style={FigmaLines.l20}>
              {accepted ? 'Your seat is on your pass' : 'She usually replies within an hour'}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.steps, { backgroundColor: theme.tileNeutral }]} accessibilityLiveRegion="polite">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            const rail =
              step.state === 'done'
                ? railDoneXml(theme.brand, theme.textOnBrand, !last)
                : step.state === 'current'
                  ? railCurrentXml(theme.brand, theme.card, theme.strokeCoHost)
                  : railTodoXml(theme.card, theme.radioRing);
            return (
              <View key={step.title} style={styles.step} accessible accessibilityLabel={`${step.title}. ${step.detail}`}>
                <SvgXml xml={rail} width={16} height={last || step.state === 'todo' ? 36 : 52} />
                <View>
                  <ThemedText
                    type={step.state === 'todo' ? 'link' : 'label'}
                    themeColor={step.state === 'todo' ? 'textWeak' : 'textStrong'}
                    style={FigmaLines.l21}>
                    {step.title}
                  </ThemedText>
                  <ThemedText type="meta" themeColor={step.state === 'current' ? 'brand' : 'textWeak'}>
                    {step.detail}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.note}>
          <SvgXml xml={tickBadgeXml(theme.statusSuccessSubtle, theme.statusSuccess)} width={24} height={24} />
          <ThemedText type="meta" themeColor="textWeak" style={styles.noteText}>
            {"If she can't take you, we'll offer you the next seat automatically."}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Button label="Done" flat onPress={() => router.dismissTo('/pass')} />
          {/* Figma "Button / Tertiary" in accent coral (#FF7A70), as drawn. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={accepted ? 'Cancel ride' : 'Cancel request'}
            onPress={() => {
              registration.cancelRide();
              router.back();
            }}
            style={styles.tertiary}>
            <ThemedText type="buttonPrimary" themeColor="accent">
              {accepted ? 'Cancel ride' : 'Cancel request'}
            </ThemedText>
          </Tappable>
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma's header sits 32 under the sheet top; the shared sheet chrome ends at 30.
  body: {
    gap: 18,
    paddingTop: Spacing.half,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
  },
  // Figma "Avatar pulse": a 56 px brand-12% circle around the 44 px avatar.
  halo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  steps: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  noteText: {
    flex: 1,
  },
  actions: {
    gap: Spacing.two,
  },
  tertiary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
