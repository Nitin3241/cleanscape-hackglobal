import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Skeleton } from '@/components/ui/skeleton';
import { metaPinXml, replayXml } from '@/constants/ask-earthy-art';
import { Gradients, Radius, Spacing } from '@/constants/theme';
import { SAMPLE_RESULTS } from '@/data/ask-earthy.sample';
import { feedback } from '@/feedback';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';

export default function CleanupsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const fadeUp = useFadeUp();
  const loading = useSampleLoading();
  const [filters, setFilters] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SAMPLE_RESULTS.filters.map((filter) => [filter.label, filter.selected])),
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <LinearGradient {...Gradients.header} style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={10}
          onPress={() => router.back()}>
          <Icon name="chevron-start" size={24} color="textOnBrand" />
        </Tappable>
        <ThemedText type="screenTitle" themeColor="textOnBrand" accessibilityRole="header" style={styles.title}>
          {SAMPLE_RESULTS.title}
        </ThemedText>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}>
        <Animated.View style={[styles.body, fadeUp]}>
          <View style={[styles.says, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            <EarthyOrb size={36} state="still" glow={false} />
            <ThemedText type="note" style={styles.saysText}>
              {SAMPLE_RESULTS.summary}
            </ThemedText>
            {/* Reading the summary aloud isn't connected yet. */}
            <Tappable accessibilityRole="button" accessibilityLabel="Read this aloud" hitSlop={12}>
              <SvgXml xml={replayXml} width={20} height={20} />
            </Tappable>
          </View>

          <ThemedText type="filterLabel" themeColor="textWeak" style={styles.filterLabel}>
            Curated filters
          </ThemedText>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}>
          {SAMPLE_RESULTS.filters.map(({ label }) => (
            <ChoiceChip
              key={label}
              label={label}
              selected={filters[label]}
              onPress={() => {
                if (!filters[label]) feedback.play('filter.applied');
                setFilters((current) => ({ ...current, [label]: !current[label] }));
              }}
            />
          ))}
        </ScrollView>

        <View style={styles.cards}>
          {SAMPLE_RESULTS.events.map((event, index) => (
            <Skeleton key={event.id} loading={loading} order={index} lines="card">
              <ResultCard
                {...event}
                // Only Kite Beach has a detail screen in Figma so far.
                onPress={event.id === 'kite-beach' ? () => router.push('/event-detail') : undefined}
              />
            </Skeleton>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type ResultCardProps = {
  artwork: string;
  bestMatch: boolean;
  when: string;
  title: string;
  meta: string;
  onPress?: () => void;
};

function ResultCard({ artwork, bestMatch, when, title, meta, onPress }: ResultCardProps) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${bestMatch ? 'Best match. ' : ''}${title}, ${when}, ${meta}`}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}
      onPress={onPress}>
      <View style={styles.cardArt}>
        <SvgXml xml={artwork} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
      {bestMatch && (
        <View style={[styles.badge, { backgroundColor: theme.card }]}>
          <ThemedText type="tag">Best match</ThemedText>
        </View>
      )}
      <View style={styles.cardBody}>
        <ThemedText type="dateline" themeColor="brand">
          {when}
        </ThemedText>
        <ThemedText type="eventTitle">{title}</ThemedText>
        <View style={styles.meta}>
          <SvgXml xml={metaPinXml} width={14} height={14} />
          <ThemedText type="meta13" themeColor="textWeak" style={styles.metaText}>
            {meta}
          </ThemedText>
        </View>
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingBottom: 23,
  },
  title: {
    flex: 1,
  },
  body: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  says: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingVertical: Spacing.twoHalf,
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  saysText: {
    flex: 1,
  },
  filterLabel: {
    marginTop: Spacing.twoThreeQuarters,
    marginBottom: Spacing.oneHalf + 1,
  },
  filters: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  cards: {
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  cardArt: {
    height: 132,
  },
  badge: {
    position: 'absolute',
    top: Spacing.twoHalf,
    start: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  cardBody: {
    gap: Spacing.one,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.three,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  metaText: {
    flexShrink: 1,
  },
});
