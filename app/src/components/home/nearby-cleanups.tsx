import { ComponentProps } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { RevealOrder } from '@/components/home/home-timeline';
import { EventCard } from '@/components/ui/event-card';
import { RevealBlock } from '@/components/ui/reveal-block';
import { SectionTitle } from '@/components/ui/section-title';
import { Radius, Spacing } from '@/constants/theme';
import { useHomeCopy } from '@/data/home-copy';

type NearbyCleanupsProps = {
  events: readonly (ComponentProps<typeof EventCard> & { id: string })[];
  onOpen: (id: string) => void;
  onSeeAll: () => void;
  loading: boolean;
};

/** Sideways-scrolling rail that runs to the screen edges. */
export function NearbyCleanups({ events, loading, onOpen, onSeeAll }: NearbyCleanupsProps) {
  const copy = useHomeCopy();
  return (
    <View style={styles.section}>
      <SectionTitle
        title={copy.nearby}
        actionLabel={copy.seeAll}
        actionAccessibilityLabel="See all cleanups near you"
        onAction={onSeeAll}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rail}
        contentContainerStyle={styles.railContent}>
        {events.map(({ id, ...event }) => (
          <RevealBlock key={id} loading={loading} order={RevealOrder.nearYou} radius={Radius.card} lines="card">
            <EventCard {...event} joinLabel={copy.join} onOpen={() => onOpen(id)} />
          </RevealBlock>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  rail: {
    marginHorizontal: -Spacing.three,
  },
  railContent: {
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.twoThreeQuarters,
  },
});
