import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { TextButton } from '@/components/ui/text-button';
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
    <RouteSheet accessibilityLabel="Add your driving licence">
      <View style={[styles.art, { backgroundColor: theme.fill }]} accessible={false}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={[styles.photo, { backgroundColor: theme.surface }]} />
          <View style={styles.lines}>
            <View style={[styles.line, { backgroundColor: theme.seatEmpty, width: '80%' }]} />
            <View style={[styles.line, { backgroundColor: theme.seatEmpty, width: '95%' }]} />
            <View style={[styles.line, { backgroundColor: theme.seatEmpty, width: '60%' }]} />
          </View>
        </View>
        <Icon name="scan" size={22} color="brand" strokeWidth={1.5} />
      </View>

      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          Add your driving licence
        </ThemedText>
        <ThemedText type="hint" themeColor="textWeak">
          A quick scan earns you the Licence verified badge. We check it once and never show your details to riders.
        </ThemedText>
      </View>

      <View style={[styles.tiers, { borderColor: theme.strokeWeak }]}>
        <ThemedText type="labelSmall">Your driver tier grows with Smileys</ThemedText>
        <View style={styles.tierRow}>
          {DRIVER_TIERS.map((tier) => (
            <View key={tier.label} style={[styles.tier, { backgroundColor: theme.fill }]}>
              <ThemedText type="labelSmall" themeColor="brand">
                {tier.label}
              </ThemedText>
              <ThemedText type="micro" themeColor="textWeak">
                {tier.from}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText type="smallMedium" themeColor="textSecondary">
          {`You have ${SAMPLE_USER.smileys.toLocaleString('en')} Smileys, so you start as Champion`}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button label="Scan licence" size="large" onPress={verified} />
        <TextButton label="Use UAE PASS" onPress={verified} />
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  art: {
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    width: 200,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  photo: {
    width: 36,
    height: 44,
    borderRadius: Radius.check,
  },
  lines: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.oneHalf,
  },
  line: {
    height: 5,
    borderRadius: 3,
  },
  heading: {
    gap: Spacing.oneHalf,
  },
  tiers: {
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  tierRow: {
    flexDirection: 'row',
    gap: Spacing.oneHalf,
  },
  tier: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.check + 2,
  },
  actions: {
    gap: Spacing.three,
  },
});
