import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { AvatarStack } from '@/components/school/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { CLASS, CLASSMATES, SCHOOL_BUS, TEACHER } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

/** F3·5: the school bus. When it leaves, the stops, and who's on it. */
export default function ClassBusRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="School bus" subtitle={`${CLASS.name} · Sat 5 Dec`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom + 110 }}>
        <View style={styles.map} accessible accessibilityLabel="Map of the route to Kite Beach">
          <ZoomableMap controls={{ bottom: Spacing.two, end: Spacing.two }}>
            <MapArt left={-80} top={-112} zoom={600 / 510} />
          </ZoomableMap>
        </View>

        <View style={styles.content}>
          <View style={[styles.card, styles.departure, { backgroundColor: theme.card, boxShadow: Shadows.classCard }]}>
            <ThemedText type="filterLabel" themeColor="textWeak">
              Leaves at
            </ThemedText>
            <View style={styles.timeRow}>
              <ThemedText type="busTime" accessibilityRole="header">
                {SCHOOL_BUS.leaves}
              </ThemedText>
              <View style={[styles.onTime, { backgroundColor: theme.fill }]}>
                <Icon name="check" size={12} color="brand" />
                <ThemedText type="smallMedium" themeColor="brand">
                  On time
                </ThemedText>
              </View>
            </View>
            <ThemedText type="caption" themeColor="textWeak">
              {SCHOOL_BUS.beAt}
            </ThemedText>
          </View>

          <View
            accessible
            accessibilityLabel={`Leaves the main gate, ${CLASS.school}, at ${SCHOOL_BUS.leaves}. Arrives at Kite Beach, next to the check-in tent, at ${SCHOOL_BUS.arrives}.`}
            style={[styles.card, styles.stops, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <Stop filled title="Main gate" note={CLASS.school} time={SCHOOL_BUS.leaves} />
            <View style={[styles.rail, { backgroundColor: theme.strokeControl }]} />
            <Stop title="Kite Beach" note="Drop-off next to the check-in tent" time={SCHOOL_BUS.arrives} />
          </View>

          <View style={[styles.card, styles.riders, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <AvatarStack people={CLASSMATES.slice(0, 4)} size={28} />
            <View style={styles.ridersText}>
              <ThemedText type="labelLarge">{`${SCHOOL_BUS.riders} classmates on this bus`}</ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                {`${TEACHER.short} rides with you`}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.note, { backgroundColor: theme.fill }]}>
            <Icon name="leaf" size={16} color="brand" strokeWidth={1.5} />
            <ThemedText type="filterLabel" themeColor="brand" style={styles.noteText}>
              One bus instead of 14 car rides keeps about 45 kg of CO₂ out of the air
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <StickyFooter variant="glass">
        <View style={styles.footerButton}>
          <Button label="Show pass" flat onPress={() => router.push('/class-pass')} />
        </View>
      </StickyFooter>
      <TabBar active="events" />
    </View>
  );
}

function Stop({ title, note, time, filled = false }: { title: string; note: string; time: string; filled?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.stop}>
      <View
        style={[
          styles.stopDot,
          filled ? { backgroundColor: theme.brand } : { borderWidth: 2, borderColor: theme.brand, backgroundColor: theme.card },
        ]}
      />
      <View style={styles.stopText}>
        <ThemedText type="label">{title}</ThemedText>
        <ThemedText type="caption" themeColor="textWeak">
          {note}
        </ThemedText>
      </View>
      <ThemedText type="bodyMedium">{time}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    height: 150,
    overflow: 'hidden',
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  card: {
    borderRadius: Radius.option,
  },
  departure: {
    gap: Spacing.one,
    padding: Spacing.threeLess,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  onTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  stops: {
    padding: Spacing.threeLess,
    borderWidth: 1,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  stopDot: {
    width: 12,
    height: 12,
    marginTop: 4,
    borderRadius: 6,
  },
  stopText: {
    flex: 1,
    gap: Spacing.half,
  },
  rail: {
    width: 2,
    height: 22,
    marginStart: 5,
    marginVertical: Spacing.one,
  },
  riders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderWidth: 1,
  },
  ridersText: {
    flex: 1,
    gap: Spacing.half,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  noteText: {
    flex: 1,
  },
  footerButton: {
    flex: 1,
  },
});
