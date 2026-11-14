import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar, PhotoTag } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Button } from '@/components/ui/button';
import { ChoiceList } from '@/components/ui/choice-list';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { SCAN_UNSURE } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

const ASK_CREW_LEAD = () => router.push({ pathname: '/earthy-chat', params: { start: 'organiser' } });

/**
 * F4·9u Scan — Earthy isn't sure (low confidence): Earthy asks rather than guesses. Opened from Demo branches.
 * "Choose item" opens F4·9c; "Ask crew lead" opens the crew chat. SAMPLE: always Figma's crushed bottle.
 */
export default function ScanUnsureRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const choose = () => router.push({ pathname: '/scan-fix', params: { from: 'unsure' } });

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Scan result" subtitle="Dubai rules" centred glass="header" />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View style={styles.photo}>
          <Image
            source={require('@/assets/images/waste/crushed-bottle.jpg')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessible
            accessibilityLabel="Your photo: a crushed, stained bottle"
          />
          <PhotoTag text="Your photo" style={styles.tag} />
        </View>
        <EarthyNote title={SCAN_UNSURE.earthy.title} body={SCAN_UNSURE.earthy.body} />
        <ThemedText type="sectionTitle" accessibilityRole="header">
          It could be
        </ThemedText>
        <ChoiceList items={SCAN_UNSURE.candidates} onSelect={(id) => (id === 'oil' ? ASK_CREW_LEAD() : choose())} />
        <View style={[styles.safety, { backgroundColor: theme.secondarySubtle }]}>
          <ThemedText style={FigmaLines.l20} type="fieldLabel" themeColor="textSecondary">
            {SCAN_UNSURE.safety}
          </ThemedText>
        </View>
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button label="Choose item" variant="secondary" flat onPress={choose} />
        </View>
        <View style={styles.flex}>
          {/* Figma F4·9u: asking the crew lead is the main action when Earthy isn't sure. */}
          <Button label="Ask crew lead" flat onPress={ASK_CREW_LEAD} />
        </View>
      </PairBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  photo: {
    height: 180,
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  tag: {
    top: Spacing.twoThreeQuarters,
    start: Spacing.twoThreeQuarters,
  },
  safety: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
});
