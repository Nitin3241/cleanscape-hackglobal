import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EarthyNote, TileRows } from '@/components/host/earthy-note';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_SPOTS, WHY_FAIRNESS, WHY_SPOT } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** F10·11w Why this spot (sheet), from "Why it's ranked N" on the radar's spot card. */
export default function HostWhySheet() {
  const theme = useTheme();
  const { spot: id } = useLocalSearchParams<{ spot?: string }>();
  const spot = HOST_SPOTS.find((item) => item.id === id) ?? HOST_SPOTS[0];
  const why = WHY_SPOT[spot.id];

  return (
    <RouteSheet accessibilityLabel={why.title} bottomPadding={34}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <View style={[styles.rank, { backgroundColor: theme.fill }]}>
            <ThemedText type="smallMedium" themeColor="brand" style={styles.rankText}>
              {`Ranked ${spot.rank} of ${HOST_SPOTS.length} near you`}
            </ThemedText>
          </View>
          <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.place}>
            {why.place}
          </ThemedText>
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={6}
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: theme.tileNeutral }]}>
          <Icon name="close" size={18} color="textStrong" strokeWidth={2} />
        </Tappable>
      </View>

      <EarthyNote title={why.title} body={why.body} />
      <TileRows rows={why.reasons} />

      <View style={[styles.fairness, { backgroundColor: theme.tileNeutral }]}>
        <ThemedText type="meta" themeColor="textWeak">
          {WHY_FAIRNESS}
        </ThemedText>
      </View>

      <View style={styles.buttons}>
        {/* The list of resident reports for a spot isn't designed yet: says "Coming soon". */}
        <View style={styles.flex}>
          <Button label="See reports" variant="secondary" flat />
        </View>
        <View style={styles.flex}>
          <Button
            label="Host here"
            flat
            onPress={() => {
              feedback.play('button.primary');
              router.replace('/spot-it');
            }}
          />
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  // Figma text here is at "normal" line height: 11 px → 17, 20 px → 30.
  rankText: {
    lineHeight: 17,
  },
  place: {
    lineHeight: 30,
  },
  rank: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    marginBottom: Spacing.half,
    borderRadius: Radius.control,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  fairness: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
