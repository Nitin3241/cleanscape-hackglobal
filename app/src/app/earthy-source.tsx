import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EarthyNote, TileRows } from '@/components/host/earthy-note';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceList } from '@/components/ui/choice-list';
import { RouteSheet } from '@/components/ui/route-sheet';
import { SheetHeader } from '@/components/ui/sheet-header';
import { Radius, Spacing } from '@/constants/theme';
import { ANSWER_SOURCE } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';
import { showComingSoon } from '@/state/coming-soon';

/** F9·S1 Earthy — source (sheet): the approved text Earthy's sorting answer comes from. */
export default function EarthySourceSheet() {
  const theme = useTheme();
  return (
    <RouteSheet accessibilityLabel="Where this comes from" bottomPadding={34}>
      <SheetHeader title="Where this comes from" />
      <TileRows rows={[{ ...ANSWER_SOURCE.guide, icon: 'file' }]} />
      <View style={[styles.quote, { backgroundColor: theme.tileNeutral }]}>
        <View style={[styles.bar, { backgroundColor: theme.brand }]} />
        <ThemedText type="answer14" style={styles.quoteText}>
          {ANSWER_SOURCE.quote}
        </ThemedText>
      </View>
      <EarthyNote title={ANSWER_SOURCE.earthy.title} body={ANSWER_SOURCE.earthy.body} />
      {/* The full guide and the wrong-answer report aren't built yet: both say "Coming soon". */}
      <ChoiceList
        items={[
          { id: 'read', title: 'Read the full guide', body: '' },
          { id: 'report', title: 'Report a wrong answer', body: '' },
        ]}
        onSelect={() => showComingSoon()}
      />
      <Button label="Got it" flat onPress={() => router.back()} />
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  quote: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    overflow: 'hidden',
    paddingEnd: Spacing.threeLess,
    borderRadius: Radius.small,
  },
  bar: {
    width: 4,
  },
  // Figma "Quote": the text fills the box's height (no vertical padding), 282 wide beside a 4 px bar.
  quoteText: {
    flex: 1,
  },
});
