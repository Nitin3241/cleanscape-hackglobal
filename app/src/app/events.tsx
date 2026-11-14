import { router, useLocalSearchParams } from 'expo-router';
import { useNetworkState } from 'expo-network';
import { type RefObject, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventListCard } from '@/components/events/event-list-card';
import { EventsMap } from '@/components/events/events-map';
import { Mascot } from '@/components/onboarding/mascot';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { EmptyState } from '@/components/ui/empty-state';
import { Glass } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ScreenInsight } from '@/components/earthy/insight';
import { TabBar } from '@/components/ui/tab-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { BEST_MATCH_ID, CAMPAIGN, EVENT_FILTERS, type CleanupEvent, type EventFilter, SAMPLE_EVENTS } from '@/data/events.sample';
import { useFadeUp } from '@/hooks/use-fade-up';
import { useTheme } from '@/hooks/use-theme';
import { useTabSkeleton } from '@/state/tab-entry';

function metaFor(event: CleanupEvent) {
  const spots = event.spotsLeft > 0 ? `  ·  ${event.spotsLeft} spots left` : '  ·  Full';
  return `${event.place} · ${event.distanceKm} km${spots}`;
}

/** R1 and R2: Clean UAE cleanups as a list or on a map, with filters. */
export default function EventsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const network = useNetworkState();
  const offline = network.isConnected === false;
  // Home's map chip opens R2 straight on the map (`?view=map`).
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<'list' | 'map'>(params.view === 'map' ? 'map' : 'list');
  // Figma (9 Nov): 0.5 s skeleton only when you arrive from the Events tab.
  const loading = useTabSkeleton('/events');
  const [filters, setFilters] = useState<readonly EventFilter[]>([]);
  const [notifying, setNotifying] = useState(false);
  // Map only (R2): cleanups under half full. Figma swaps "Near me" for this chip on the map.
  const [needsPeople, setNeedsPeople] = useState(false);
  const onMap = view === 'map';
  const bestRef = useRef<ViewInstance>(null);

  const matching = SAMPLE_EVENTS.filter(
    (event) =>
      filters.every((filter) => (onMap && filter === 'nearMe') || event.tags.includes(filter)) &&
      (!onMap || !needsPeople || (event.spotsLeft > 0 && event.spotsLeft / event.capacity > 0.5)),
  );
  const best = matching.find((event) => event.id === BEST_MATCH_ID);
  const others = matching.filter((event) => event !== best);
  const open = (event: CleanupEvent) => router.push({ pathname: '/event-detail', params: { id: event.id } });

  function toggle(filter: EventFilter) {
    setNotifying(false);
    setFilters((current) => (current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter]));
  }

  const chips = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      <View accessible accessibilityLabel={`Date: ${CAMPAIGN.date}`} style={[styles.dateChip, { backgroundColor: theme.brand }]}>
        <Icon name="calendar" size={16} color="textOnBrand" strokeWidth={1.5} />
        <ThemedText type="chipSelected" themeColor="textOnBrand">
          {CAMPAIGN.date}
        </ThemedText>
      </View>
      {onMap && (
        <ChoiceChip
          label="Needs people"
          dot="avatarCoral"
          onMap
          selected={needsPeople}
          onPress={() => setNeedsPeople((current) => !current)}
        />
      )}
      {EVENT_FILTERS.filter(
        // With no matches (E9), Figma keeps only the active filters, so the cause is plain to see.
        (filter) => (!onMap || filter.key !== 'nearMe') && (matching.length > 0 || filters.includes(filter.key)),
      ).map((filter) => (
        <ChoiceChip
          key={filter.key}
          label={filter.label}
          onMap={onMap}
          selected={filters.includes(filter.key)}
          onPress={() => toggle(filter.key)}
        />
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={CAMPAIGN.title} subtitle={CAMPAIGN.subtitle} onBack={() => router.navigate('/home')} />

      {view === 'map' ? (
        <EventsMap events={matching} chips={chips} onOpen={open} onShowList={() => setView('list')} />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom + Spacing.six }}>
            <View style={styles.chipBar}>{chips}</View>
            {offline && (
              <View style={styles.offline}>
                <Notice
                  tone="warning"
                  icon="wifi-off"
                  text="You're offline. Showing cleanups saved 10 min ago. Register when you're back."
                />
              </View>
            )}
            {matching.length === 0 ? (
              <View style={styles.empty}>
                <EmptyState
                  art={<Mascot size={96} />}
                  title={`No ${describe(filters)} on 5 Dec`}
                  body="Organisers add new ones every week. We'll tell you the moment one fits.">
                  <View style={styles.emptyActions}>
                    <Button
                      label={notifying ? "We'll tell you" : 'Notify me'}
                      icon={notifying ? 'check' : 'bell'}
                      flat
                      disabled={notifying}
                      onPress={() => setNotifying(true)}
                    />
                    <TextButton label="Clear filters" onPress={() => setFilters([])} />
                  </View>
                </EmptyState>
              </View>
            ) : (
              <List best={best} others={others} onOpen={open} loading={loading} bestRef={bestRef} />
            )}
          </ScrollView>
          {matching.length > 0 && (
            <View pointerEvents="box-none" style={[styles.mapPill, { bottom: TabBarHeight + insets.bottom + Spacing.three }]}>
              <View style={[styles.pillShadow, { boxShadow: Shadows.glassPill }]}>
                <Glass fill="glassOnArt" style={styles.pill}>
                  <Tappable
                    accessibilityRole="button"
                    accessibilityLabel="Show on a map"
                    onPress={() => setView('map')}
                    style={styles.pillInner}>
                    <Icon name="map" size={18} color="textStrong" strokeWidth={1.5} />
                    <ThemedText type="bodyMedium">Map</ThemedText>
                  </Tappable>
                </Glass>
              </View>
            </View>
          )}
        </>
      )}

      <TabBar active="events" />
      {!onMap && !loading && best && (
        <ScreenInsight
          id="events"
          target={bestRef}
          onAction={() => router.push({ pathname: '/event-detail', params: { id: best.id } })}
        />
      )}
    </View>
  );
}

function List({
  best,
  others,
  onOpen,
  loading,
  bestRef,
}: {
  bestRef: RefObject<ViewInstance | null>;
  best?: CleanupEvent;
  others: readonly CleanupEvent[];
  onOpen: (event: CleanupEvent) => void;
  loading: boolean;
}) {
  const theme = useTheme();
  const fadeUp = useFadeUp();

  return (
    <Animated.View style={[styles.list, fadeUp]}>
      {/* Figma R1 (9 Nov): the Host card sits under the chips, 14 px above "Best for you". */}
      <View style={styles.topGroup}>
        <Skeleton loading={loading} radius={Radius.large} lines="wide">
          {/* Hosting (F10): a way in besides Earthy's first-run tips. Opens the litter radar → Spot it → draft. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Host a clean-up. Earthy found 3 spots near you that need help"
            onPress={() => router.push('/litter-radar')}
            style={[styles.host, { backgroundColor: theme.fill }]}>
            <EarthyOrb state="still" size={36} glow={false} />
            <View style={styles.hostText}>
              <ThemedText type="labelLarge">Host a clean-up</ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                Earthy found 3 spots near you that need help
              </ThemedText>
            </View>
            <Icon name="chevron-end" size={20} color="brand" />
          </Tappable>
        </Skeleton>
        {best && (
          <View style={styles.section}>
            <View>
              <ThemedText type="labelLarge" accessibilityRole="header">
                Best for you
              </ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                Beach · weekends · within 10 km
              </ThemedText>
            </View>
            <Skeleton loading={loading} lines="card">
              <View ref={bestRef} collapsable={false}>
                <EventListCard
                  artwork={best.artwork}
                  when={best.when}
                  title={best.title}
                  meta={metaFor(best)}
                  badge="best"
                  matches={best.matches}
                  onPress={() => onOpen(best)}
                />
              </View>
            </Skeleton>
          </View>
        )}
      </View>
      {others.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            {best ? `Also on ${CAMPAIGN.date}` : `On ${CAMPAIGN.date}`}
          </ThemedText>
          {others.map((event, index) => (
            <Skeleton key={event.id} loading={loading} order={index + 1} lines="card">
              <EventListCard
                artwork={event.artwork}
                when={event.when}
                title={event.title}
                meta={metaFor(event)}
                onPress={() => onOpen(event)}
              />
            </Skeleton>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

/** "mangrove cleanups for kids", for the empty state's title. */
function describe(filters: readonly EventFilter[]) {
  const kind = filters.includes('mangroves')
    ? 'mangrove cleanups'
    : filters.includes('parks')
      ? 'park cleanups'
      : filters.includes('beach')
        ? 'beach cleanups'
        : 'cleanups';
  const extras = [filters.includes('kids') && 'for kids', filters.includes('nearMe') && 'near you'].filter(Boolean);
  return [kind, ...extras].join(' ');
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  chipBar: {
    paddingTop: Spacing.twoThreeQuarters,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  offline: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
  },
  list: {
    gap: Spacing.four,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  // Figma R1: card at y 192 (4 px lower than the list's usual start), 76 px tall, 14 px above "Best for you".
  topGroup: {
    gap: Spacing.threeLess,
    marginTop: Spacing.one,
  },
  host: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.large,
  },
  hostText: {
    flex: 1,
    gap: 2,
  },
  empty: {
    paddingTop: 48,
  },
  emptyActions: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  mapPill: {
    position: 'absolute',
    alignSelf: 'center',
  },
  pillShadow: {
    borderRadius: Radius.pill,
  },
  pill: {
    borderRadius: Radius.pill,
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
  },
});
