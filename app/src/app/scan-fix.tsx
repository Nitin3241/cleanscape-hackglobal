import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Button } from '@/components/ui/button';
import { ChoiceList } from '@/components/ui/choice-list';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { SCAN_FIX } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { showNotice } from '@/state/coming-soon';

/**
 * F4·9c Change this (sheet): fix what Earthy saw. Figma: Scrim / Close / Update result → F4·9p, the plastic-bottle
 * result drawn under the sheet. Opened from F4·9p it simply closes; opened from F4·9u ("Choose item", `from=unsure`)
 * it replaces itself with the F4·9p result. SAMPLE: the fix is confirmed with a toast; the result doesn't change.
 */
export default function ScanFixSheet() {
  const theme = useTheme();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [picked, setPicked] = useState('other');
  const choice = SCAN_FIX.options.find((option) => option.id === picked) ?? SCAN_FIX.options[1];
  const toResult = () =>
    from === 'unsure' ? router.replace({ pathname: '/bottle-scan', params: { found: '1' } }) : router.back();

  return (
    <RouteSheet accessibilityLabel="What is it?" bottomPadding={34} scrim="scrimInk" onClose={toResult}>
      <View style={styles.header}>
        <View style={[styles.flex, styles.titles]}>
          <ThemedText style={FigmaLines.l30} type="sheetTitle" accessibilityRole="header">
            What is it?
          </ThemedText>
          <ThemedText style={FigmaLines.l20} type="meta13" themeColor="textWeak">
            {SCAN_FIX.earthySaid}
          </ThemedText>
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={6}
          onPress={toResult}
          style={[styles.close, { backgroundColor: theme.tileNeutral }]}>
          <Icon name="close" size={20} color="textStrong" strokeWidth={1.8} />
        </Tappable>
      </View>
      <ChoiceList items={SCAN_FIX.options} selected={picked} onSelect={setPicked} />
      <View style={[styles.note, { backgroundColor: theme.tileNeutral }]}>
        <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
          {SCAN_FIX.note}
        </ThemedText>
      </View>
      <Button
        label="Update result"
        flat
        onPress={() => {
          feedback.play('button.primary');
          toResult();
          showNotice(`Updated: ${choice.title}`);
        }}
      />
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma: 2 px between the sheet title and the line under it.
  titles: {
    gap: 2,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  note: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
});
