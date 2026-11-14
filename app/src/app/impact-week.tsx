import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EarthyNote } from '@/components/host/earthy-note';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { WEEK_MEMORY } from '@/data/impact.sample';
import { useTheme } from '@/hooks/use-theme';

/** I2 Week memory (sheet): one clean-up day from the year grid (week 11 on I1). */
export default function ImpactWeekSheet() {
  const theme = useTheme();

  return (
    <RouteSheet accessibilityLabel={`${WEEK_MEMORY.place}, ${WEEK_MEMORY.when}`} bottomPadding={34}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.line30}>
            {WEEK_MEMORY.place}
          </ThemedText>
          <ThemedText type="meta13" themeColor="textWeak" style={styles.line20}>
            {WEEK_MEMORY.when}
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

      <Image
        source={require('@/assets/images/impact/kite-beach-crew.jpg')}
        style={styles.photo}
        contentFit="cover"
        accessible
        accessibilityLabel="Your crew at Kite Beach with full rubbish bags"
      />

      <View style={[styles.stats, { borderColor: theme.strokeWeak }]}>
        {WEEK_MEMORY.stats.map((stat, index) => (
          <View
            key={stat.label}
            style={[styles.stat, index < WEEK_MEMORY.stats.length - 1 && { borderEndWidth: 1, borderEndColor: theme.strokeWeak }]}
            accessible
            accessibilityLabel={`${stat.value} ${stat.label}`}>
            <ThemedText type="cardTitle" style={styles.line27}>
              {stat.value}
            </ThemedText>
            <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
              {stat.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <EarthyNote title={WEEK_MEMORY.recap.title} body={WEEK_MEMORY.recap.body} />

      <View style={styles.buttons}>
        <View style={styles.flex}>
          <Button label="See receipt" variant="secondary" flat onPress={() => router.replace('/impact-receipt')} />
        </View>
        <View style={styles.flex}>
          {/* Figma I2: the second button opens the impact story (F10·13), where sharing happens. */}
          <Button label="Share day" flat onPress={() => router.replace('/impact-story')} />
        </View>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma I2 at "normal" line height: 20 → 30, 13 → 20, 18 → 27, 11 → 17.
  line30: {
    lineHeight: 30,
  },
  line20: {
    lineHeight: 20,
  },
  line27: {
    lineHeight: 27,
  },
  line17: {
    lineHeight: 17,
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
  photo: {
    height: 164,
    borderRadius: Radius.card,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
