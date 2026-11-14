import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { scanXml } from '@/constants/rides-art';
import { Radius, Spacing } from '@/constants/theme';
import { DRIVER_TIERS, SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/**
 * T9: first-time drivers add a licence for the verified badge. SAMPLE: there's no
 * camera or UAE PASS connection yet, so both buttons mark the licence as checked.
 */
export default function LicenceSheet() {
  const theme = useTheme();
  const registration = useRegistration();

  function verified() {
    registration.addLicence();
    registration.publishRide();
    router.dismissTo('/offer-seats');
    router.replace('/ride-published');
  }

  return (
    <RouteSheet accessibilityLabel="Add your driving licence" bottomPadding={25}>
      {/* Figma T9 "Sheet": a 1 px edge, 16 padding and 18 between blocks; content starts 33 under the top. */}
      <View style={styles.body}>
        <View style={[styles.art, { backgroundColor: theme.fill }]} accessible={false}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={[styles.photo, { backgroundColor: theme.surface }]} />
            <View style={styles.lines}>
              <View style={[styles.line, { backgroundColor: theme.strokeControl, width: 90 }]} />
              <View style={[styles.line, { backgroundColor: theme.strokeControl, width: 120 }]} />
              <View style={[styles.line, { backgroundColor: theme.strokeControl, width: 70 }]} />
            </View>
          </View>
          <SvgXml xml={scanXml(theme.brand)} width={28} height={28} />
        </View>

        <View style={styles.heading}>
          <ThemedText type="screenTitle" accessibilityRole="header" style={FigmaLines.l30}>
            Add your driving licence
          </ThemedText>
          <ThemedText type="body14" themeColor="textWeak">
            A quick scan earns you the Licence verified badge. We check it once and never show your details to riders.
          </ThemedText>
        </View>

        <View style={[styles.tiers, { borderColor: theme.strokeWeak }]}>
          <ThemedText type="chipAction" style={FigmaLines.l18}>
            Your driver tier grows with Smileys
          </ThemedText>
          <View style={styles.tierRow}>
            {DRIVER_TIERS.map((tier) => (
              <View key={tier.label} style={[styles.tier, { backgroundColor: theme.fill }]}>
                <ThemedText type="chipAction" themeColor="brand" style={FigmaLines.l18}>
                  {tier.label}
                </ThemedText>
                <ThemedText type="micro" themeColor="brand" style={styles.tierFrom}>
                  {tier.from}
                </ThemedText>
              </View>
            ))}
          </View>
          <ThemedText type="smallMedium" themeColor="textSecondary" style={FigmaLines.l17}>
            {`You have ${SAMPLE_USER.smileys.toLocaleString('en')} Smileys, so you start as Champion`}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Button label="Scan licence" flat onPress={verified} />
          {/* Figma "Button / Tertiary": 48 tall, 15 semibold brand. */}
          <Tappable accessibilityRole="button" accessibilityLabel="Use UAE PASS" onPress={verified} style={styles.tertiary}>
            <ThemedText type="buttonPrimary" themeColor="brand">
              Use UAE PASS
            </ThemedText>
          </Tappable>
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 18,
    paddingTop: 3,
    paddingHorizontal: 1,
  },
  art: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.option,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    width: 200,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.control,
  },
  photo: {
    width: 36,
    height: 44,
    borderRadius: Spacing.oneHalf,
  },
  lines: {
    flex: 1,
    gap: Spacing.oneHalf,
  },
  line: {
    height: 6,
    borderRadius: 3,
  },
  heading: {
    gap: Spacing.oneHalf,
  },
  tiers: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  tierRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tier: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Spacing.two,
  },
  tierFrom: {
    lineHeight: 15,
  },
  actions: {
    gap: Spacing.one,
  },
  tertiary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
