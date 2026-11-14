import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyFab } from '@/components/ask-earthy/earthy-fab';
import { CalendarToast, FAB_LIFT_FOR_TOAST } from '@/components/calendar/calendar-toast';
import { ScreenInsight } from '@/components/earthy/insight';
import { VoiceSheet } from '@/components/earthy/voice-sheet';
import { HomeHeader, StatusBarBackdrop } from '@/components/home/home-header';
import { ImpactSection } from '@/components/home/impact-section';
import { NearbyCleanups } from '@/components/home/nearby-cleanups';
import { HostNudge } from '@/components/home/host-nudge';
import { NextEventCard } from '@/components/home/next-event-card';
import { SortGuide } from '@/components/home/sort-guide';
import { TicketCard } from '@/components/home/ticket-card';
import { DirectionView } from '@/components/ui/direction-view';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { MaxContentWidth, Spacing, TabBarHeight } from '@/constants/theme';
import { SAMPLE_EVENTS } from '@/data/events.sample';
import { SAMPLE_HOME, SAMPLE_HOME_AR, SAMPLE_LOADING_MS } from '@/data/home.sample';
import { useIsScrolling } from '@/hooks/use-is-scrolling';
import { useTheme } from '@/hooks/use-theme';
import { useCalendar } from '@/state/calendar';
import { RtlScope, useLanguage } from '@/state/language';
import { useRegistration } from '@/state/registration';
import { useTabSkeleton } from '@/state/tab-entry';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { rtl } = useLanguage();
  // "01 Home — event day": opened from the N0 notification "It's event day: get ready" (/home?day=event).
  const eventDay = useLocalSearchParams<{ day?: string }>().day === 'event';
  const { user, campaign, nextEvent, impact, nearbyEvents } = rtl ? SAMPLE_HOME_AR : SAMPLE_HOME;
  const registration = useRegistration();
  const calendarToast = useCalendar().toast;
  const [firstLoad, setLoading] = useState(true);
  // The same skeleton again when you come back from the Home tab (Figma, 9 Nov: tab taps only).
  const tabLoading = useTabSkeleton('/home');
  const loading = firstLoad || tabLoading;
  // Bumped by pull to refresh, so the cards load and reveal again.
  const [round, setRound] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [askingEarthy, setAskingEarthy] = useState(false);
  const fabRef = useRef<ViewInstance>(null);
  const { isScrolling, onScroll } = useIsScrolling();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, SAMPLE_LOADING_MS);
    return () => clearTimeout(timer);
  }, [round]);

  /** SAMPLE: pull down to start the demo again. Clears registration, pass, Wallet and ride. */
  function refresh() {
    registration.reset();
    setRefreshing(true);
    setLoading(true);
    setRound((current) => current + 1);
  }

  return (
    // Arabic flips this screen right to left in place (Figma 07 Home — AR).
    <RtlScope rtl={rtl}>
      <DirectionView direction={rtl ? 'rtl' : 'ltr'} style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar style="light" />
        {/* Fills the space revealed above the header while pulling to refresh. */}
        <View style={[styles.pullBackdrop, { backgroundColor: theme.brand }]} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}
          onScroll={onScroll}
          contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom, backgroundColor: theme.background }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.textOnBrand}
              colors={[theme.brand]}
              progressViewOffset={insets.top}
              accessibilityLabel="Pull to refresh and start the demo again"
            />
          }>
          <HomeHeader key={`header-${round}`} {...user} loading={loading} />
          <View key={`body-${round}`} style={styles.body}>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="See Clean UAE cleanups"
              onPress={() => router.push('/events')}>
              <TicketCard {...campaign} loading={loading} replayFlip={round > 0} />
            </Tappable>
            <SortGuide loading={loading} />
            <HostNudge loading={loading} />
            <NextEventCard
              {...nextEvent}
              eventDay={eventDay}
              loading={loading}
              onOpen={() => router.push({ pathname: '/event-detail', params: { id: 'kite-beach' } })}
            />
            <ImpactSection {...impact} eventDay={eventDay} loading={loading} />
            <NearbyCleanups
              events={nearbyEvents}
              loading={loading}
              onSeeAll={() => router.push('/events')}
              onOpen={(id) =>
                SAMPLE_EVENTS.some((event) => event.id === id)
                  ? router.push({ pathname: '/event-detail', params: { id } })
                  : router.push('/events')
              }
            />
          </View>
        </ScrollView>
        <StatusBarBackdrop />
        <TabBar active="home" />
        <CalendarToast />
        <EarthyFab
          paused={isScrolling}
          onPress={() => router.push('/earthy')}
          buttonRef={fabRef}
          lift={calendarToast ? FAB_LIFT_FOR_TOAST : 0}
        />
        <ScreenInsight id="home" target={fabRef} onAction={() => router.push('/litter-radar')} />
        {askingEarthy && (
          <VoiceSheet
            onClose={() => setAskingEarthy(false)}
            onBook={() => router.push({ pathname: '/earthy-chat', params: { start: 'next' } })}
          />
        )}
      </DirectionView>
    </RtlScope>
  );
}

const styles = StyleSheet.create({
  // Keeps the Earthy button's rings from widening the page.
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  pullBackdrop: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    height: '50%',
  },
  body: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
});
