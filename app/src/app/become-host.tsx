import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_STEPS } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';
import { setHostOnboarded } from '@/state/host';

/** F10·15 Become a host — one time. Shown the first time someone taps "Host here", then skipped. */
export default function BecomeHostRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader centred />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 88 + insets.bottom + Spacing.three }]}>
        <ThemedText type="pageTitle" accessibilityRole="header">
          Become a host
        </ThemedText>
        <ThemedText type="body14" themeColor="textWeak">
          You only do this once. On CleanScape every clean-up has a verified host, so volunteers know who they’re meeting and
          their hours count.
        </ThemedText>

        <View style={[styles.steps, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
          {HOST_STEPS.map((step, index) => (
            <View
              key={step.title}
              style={[styles.step, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeCard }]}>
              <View style={[styles.number, { backgroundColor: index === 0 ? theme.brand : theme.hostTint }]}>
                <ThemedText type="labelSmall" themeColor={index === 0 ? 'textOnBrand' : 'brand'}>
                  {index + 1}
                </ThemedText>
              </View>
              <View style={styles.stepText}>
                <ThemedText type="rowTitle">{step.title}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {step.body}
                </ThemedText>
              </View>
              {/* UAE Pass, the team list and the host guide are separate services; they say "Coming soon" for now. */}
              <Tappable
                accessibilityRole="button"
                accessibilityLabel={`${step.action}: ${step.title}`}
                style={[styles.action, { backgroundColor: index === 0 ? theme.brand : theme.hostTint }]}>
                <ThemedText type="chipAction" themeColor={index === 0 ? 'textOnBrand' : 'brand'}>
                  {step.action}
                </ThemedText>
              </Tappable>
            </View>
          ))}
        </View>

        <View style={[styles.note, { backgroundColor: theme.hostTint }]}>
          <EarthyOrb size={18} state="still" glow={false} />
          <ThemedText type="caption" style={styles.noteText}>
            After this, each clean-up you plan is reviewed before it goes live, usually within 2 working days.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={[styles.bar, { backgroundColor: theme.card, paddingBottom: Math.max(insets.bottom, 28) }]}>
        <Button label="Continue" flat onPress={() => {
            setHostOnboarded();
            router.replace('/host-drafting');
          }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  steps: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  number: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  // Poppins renders ~1 px narrower than Figma here, which would let step 3's body wrap to 2 lines, not 3.
  stepText: {
    flex: 1,
    gap: 3,
    paddingEnd: 2,
  },
  action: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: 14,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
  noteText: {
    flex: 1,
  },
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
});
