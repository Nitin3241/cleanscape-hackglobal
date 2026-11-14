import { router, useLocalSearchParams } from 'expo-router';
import { useNetworkState } from 'expo-network';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect, useState } from 'react';
import { I18nManager, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { openInMaps, openInWaze } from '@/components/event/open-waze';
import { ThemedText } from '@/components/themed-text';
import { AlertBanner, SpotsBar } from '@/components/ui/parts';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Smiley } from '@/components/ui/smiley';
import { Tappable } from '@/components/ui/tappable';
import {
  calendarPlusXml,
  calendarXml,
  capXml,
  carXml,
  carpoolXml,
  contactXml,
  expandXml,
  glovesXml,
  heroXml,
  inviteXml,
  otherMapsXml,
  peopleXml,
  rowChevronXml,
  schoolXml,
  shareXml,
  shoesXml,
  waterXml,
  wazeNavXml,
} from '@/constants/ask-earthy-art';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { SAMPLE_EVENT } from '@/data/ask-earthy.sample';
import { findEvent, SAMPLE_FRIEND, SAMPLE_GUARDIAN, SAMPLE_NEXT_ON_WAITLIST } from '@/data/events.sample';
import { feedback } from '@/feedback';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const HERO_HEIGHT = 300;
const HERO_ART_WIDTH = 546.667;
const SHEET_OVERLAP = 24;
const DARK_STATUS_AFTER = HERO_HEIGHT - 60;
const FOOTER_SPACE = 104;
// Figma E8 → E8b: auto 4 s.
const UNDO_WINDOW = 4000;
const WAITLIST_POSITION = 5;

const BRING_ITEMS = [
  { label: 'Water', art: waterXml },
  { label: 'Cap', art: capXml },
  { label: 'Closed shoes', art: shoesXml },
];

const LINKS = [
  { label: 'Add to calendar', art: calendarPlusXml },
  { label: 'Invite a friend', art: inviteXml },
  { label: 'Registering a school or company?', art: schoolXml },
  { label: 'Contact the organiser', art: contactXml },
];

/** R3 and its states: the event, with a footer that follows the user's registration. */
export default function EventDetailRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; cancelled?: string }>();
  const registration = useRegistration();
  const network = useNetworkState();
  const offline = network.isConnected === false;
  const [pastHero, setPastHero] = useState(false);
  const loading = useSampleLoading();
  const [undoShown, setUndoShown] = useState(params.cancelled === '1');
  const details = findEvent(params.id);
  const isKiteBeach = details.id === 'kite-beach';
  const event = {
    ...SAMPLE_EVENT,
    when: details.whenLong,
    title: details.title,
    ages: { title: details.ages, detail: details.agesDetail },
    eta: `${details.driveMinutes} min · ${details.distanceKm} km`,
    directions: isKiteBeach
      ? SAMPLE_EVENT.directions
      : `${details.place}. Meet at the main gate 15 min before the start.`,
  };
  const mine = registration.eventId === details.id;
  const bookedElsewhere =
    !mine && registration.eventId !== null && (registration.status === 'going' || registration.status === 'waiting');
  const otherEvent = bookedElsewhere ? findEvent(registration.eventId ?? undefined) : null;
  const full = details.spotsLeft === 0;
  const goingSummary = full
    ? `${details.going} going · full · ${details.waiting} waiting`
    : `${details.going} going · ${details.spotsLeft} spots left`;

  // Cancelling returns to this screen when it is already open, so react to the param changing,
  // then clear it so a second cancel shows Undo again.
  const [seenCancelled, setSeenCancelled] = useState(params.cancelled);
  if (params.cancelled !== seenCancelled) {
    setSeenCancelled(params.cancelled);
    if (params.cancelled === '1') setUndoShown(true);
  }
  useEffect(() => {
    if (params.cancelled === '1') router.setParams({ cancelled: undefined });
  }, [params.cancelled]);

  useEffect(() => {
    if (!undoShown) return;
    const timer = setTimeout(() => setUndoShown(false), UNDO_WINDOW);
    return () => clearTimeout(timer);
  }, [undoShown]);

  function register() {
    if (bookedElsewhere) router.push({ pathname: '/switch-event', params: { id: details.id } });
    else router.push({ pathname: '/register', params: { id: details.id } });
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style={pastHero ? 'dark' : 'light'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={(scroll) => setPastHero(scroll.nativeEvent.contentOffset.y > DARK_STATUS_AFTER)}
        contentContainerStyle={{ paddingBottom: FOOTER_SPACE + TabBarHeight + insets.bottom }}>
        <View style={[styles.hero, { backgroundColor: theme.fill }]}>
          <View style={styles.heroArt}>
            <SvgXml xml={heroXml} width={HERO_ART_WIDTH} height={HERO_HEIGHT} />
          </View>
          <View style={[styles.heroActions, { top: insets.top + Spacing.two }]}>
            <RoundButton label="Back" onPress={() => router.back()}>
              <Icon name="chevron-start" size={20} color="textStrong" />
            </RoundButton>
            {/* Sharing isn't connected yet. */}
            <RoundButton label="Share">
              <SvgXml xml={shareXml} width={20} height={20} />
            </RoundButton>
          </View>
        </View>

        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.headline}>
            <View style={[styles.dateChip, { backgroundColor: theme.fill }]}>
              <SvgXml xml={calendarXml} width={14} height={14} />
              <ThemedText type="dateline" themeColor="brand">
                {event.when}
              </ThemedText>
            </View>
            <ThemedText type="heading" accessibilityRole="header">
              {event.title}
            </ThemedText>
            <ThemedText type="hint" themeColor="textWeak">
              {event.subtitle}
            </ThemedText>
          </View>

          {otherEvent && (
            <AlertBanner
              title={`You're already in ${otherEvent.title.replace(' cleanup', '')} that day`}
              body={`${otherEvent.slot}. Joining this means picking one.`}
            />
          )}

          <Skeleton loading={loading} radius={Radius.small} lines="tile">
            <View style={styles.going}>
              <View style={styles.avatars} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                {event.going.initials.map((initials, index) => (
                  <View
                    key={initials}
                    style={[
                      styles.avatar,
                      { start: index * 16, backgroundColor: theme.fill, borderColor: theme.background },
                    ]}>
                    <ThemedText type="avatarSmall" maxFontSizeMultiplier={1}>
                      {initials}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <ThemedText type="link">{goingSummary}</ThemedText>
            </View>
          </Skeleton>

          <Skeleton loading={loading} order={1} lines="tile">
            <View style={styles.row}>
              <Fact icon={<Smiley size={28} />} title={event.smileys} detail="Smileys" />
              <Fact
                icon={<SvgXml xml={glovesXml} width={28} height={28} />}
                title={event.gloves.title}
                detail={event.gloves.detail}
              />
              <Fact
                icon={<SvgXml xml={peopleXml} width={28} height={28} />}
                title={event.ages.title}
                detail={event.ages.detail}
              />
            </View>
          </Skeleton>

          <Skeleton loading={loading} order={2}>
            <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
              {isKiteBeach && (
                <View style={styles.mapPreview}>
                  <ZoomableMap
                    controls={{ bottom: Spacing.two, end: Spacing.two }}
                    accessibilityLabel={`Open the map. ${event.eta}`}
                    onPress={() => {
                      feedback.play('map.expand');
                      router.push('/event-map');
                    }}>
                    <MapArt left={-137} top={-184} />
                  </ZoomableMap>
                  {/* Decorative badges: taps pass through to the map, which opens it. */}
                  <View
                    pointerEvents="none"
                    style={[styles.expand, { backgroundColor: theme.card, boxShadow: Shadows.mapControl }]}>
                    <SvgXml xml={expandXml} width={16} height={16} />
                  </View>
                  <View
                    pointerEvents="none"
                    style={[styles.eta, { backgroundColor: theme.card, boxShadow: Shadows.mapControl }]}>
                    <SvgXml xml={carXml} width={14} height={14} />
                    <ThemedText type="dateline">{event.eta}</ThemedText>
                  </View>
                </View>
              )}
              <View style={styles.panelBody}>
                <ThemedText type="sectionTitle" accessibilityRole="header">
                  Getting there
                </ThemedText>
                <ThemedText type="hint" themeColor="textWeak">
                  {event.directions}
                </ThemedText>
                <View style={styles.navButtons}>
                  <View style={styles.wazeButton}>
                    <Button
                      label="Open in Waze"
                      pill
                      flat
                      leading={<SvgXml xml={wazeNavXml} width={18} height={18} />}
                      onPress={openInWaze}
                    />
                  </View>
                  <Tappable
                    accessibilityRole="button"
                    accessibilityLabel="Other maps"
                    onPress={openInMaps}
                    style={[styles.otherMaps, { backgroundColor: theme.card, borderColor: theme.strokeStrong }]}>
                    <SvgXml xml={otherMapsXml} width={20} height={20} />
                  </Tappable>
                </View>
              </View>
            </View>
          </Skeleton>

          <Skeleton loading={loading} order={3}>
            <View style={[styles.panel, styles.carpool, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
              <View style={[styles.iconTile, { backgroundColor: theme.fill }]}>
                <SvgXml xml={carpoolXml} width={24} height={24} />
              </View>
              <ThemedText type="sectionTitle" accessibilityRole="header">
                {event.carpool.title}
              </ThemedText>
              <ThemedText type="hint" themeColor="textWeak">
                {event.carpool.body}
              </ThemedText>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="Find a carpool"
                onPress={() => router.push('/getting-there')}
                style={[styles.carpoolButton, { backgroundColor: theme.card, borderColor: theme.strokeStrong }]}>
                <ThemedText type="labelLarge">Find a carpool</ThemedText>
              </Tappable>
            </View>
          </Skeleton>

          <Skeleton loading={loading} order={4}>
            <View style={styles.bring}>
              <ThemedText type="sectionTitle" accessibilityRole="header">
                What to bring
              </ThemedText>
              <View style={styles.row}>
                {BRING_ITEMS.map((item) => (
                  <View
                    key={item.label}
                    style={[styles.bringItem, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
                    <SvgXml xml={item.art} width={28} height={28} />
                    <ThemedText type="bodyMedium" style={styles.centred}>
                      {item.label}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <ThemedText type="meta13" themeColor="textWeak">
                {event.bringNote}
              </ThemedText>
            </View>
          </Skeleton>

          <Skeleton loading={loading} order={5}>
            <View style={[styles.links, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
              {LINKS.map((link, index) => (
                <Tappable
                  key={link.label}
                  accessibilityRole="button"
                  accessibilityLabel={link.label}
                  style={[
                    styles.link,
                    index < LINKS.length - 1 && { borderBottomColor: theme.strokeWeak, borderBottomWidth: 1 },
                  ]}>
                  <SvgXml xml={link.art} width={22} height={22} />
                  <ThemedText type="linkRow" style={styles.linkLabel}>
                    {link.label}
                  </ThemedText>
                  <View style={I18nManager.isRTL ? styles.mirrored : undefined}>
                    <SvgXml xml={rowChevronXml} width={18} height={18} />
                  </View>
                </Tappable>
              ))}
            </View>
          </Skeleton>
        </View>
      </ScrollView>

      <Footer
        slot={details.slot}
        startTime={details.when.split(' · ').pop() ?? ''}
        spotsLeft={details.spotsLeft}
        capacity={details.capacity}
        waiting={details.waiting}
        state={
          mine && registration.status === 'going'
            ? 'going'
            : mine && registration.status === 'waiting'
              ? 'awaitingGuardian'
              : mine && registration.status === 'waitlisted'
                ? 'waitlisted'
                : full
                  ? 'full'
                  : undoShown
                    ? 'cancelled'
                    : 'open'
        }
        crew={registration.friends > 0 ? `You + ${SAMPLE_FRIEND.name}` : 'Just you'}
        offline={offline}
        onRegister={register}
        onJoinWaitlist={() => registration.joinWaitlist(details.id)}
        onLeaveWaitlist={() => registration.leaveWaitlist()}
      />
      {undoShown && (
        <View style={[styles.toast, { bottom: TabBarHeight + insets.bottom + 92 }]}>
          <Toast
            text={`Spot cancelled. ${SAMPLE_NEXT_ON_WAITLIST}'s in.`}
            countdown={UNDO_WINDOW}
            action={{
              label: 'Undo',
              onPress: () => {
                registration.undoCancel();
                setUndoShown(false);
              },
            }}
          />
        </View>
      )}
      <TabBar active="events" />
    </View>
  );
}

type FooterState = 'open' | 'going' | 'awaitingGuardian' | 'waitlisted' | 'full' | 'cancelled';

function Footer({
  slot,
  startTime,
  spotsLeft,
  capacity,
  waiting,
  state,
  crew,
  offline,
  onRegister,
  onJoinWaitlist,
  onLeaveWaitlist,
}: {
  slot: string;
  /** Start time, such as "4 PM". */
  startTime: string;
  spotsLeft: number;
  capacity: number;
  waiting: number;
  state: FooterState;
  crew: string;
  offline: boolean;
  onRegister: () => void;
  onJoinWaitlist: () => void;
  onLeaveWaitlist: () => void;
}) {
  const insets = useSafeAreaInsets();

  if (state === 'open') {
    return (
      <StickyFooter>
        <View style={styles.footerInfo}>
          <ThemedText type="label">{slot}</ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {offline ? "You're offline · register when you're back" : `Free · ${spotsLeft} of ${capacity} spots left`}
          </ThemedText>
          <SpotsBar filled={(capacity - spotsLeft) / capacity} />
        </View>
        <View style={styles.footerButton}>
          <Button label="Register" flat disabled={offline} onPress={onRegister} />
        </View>
      </StickyFooter>
    );
  }

  const glass = {
    going: { title: "You're going", detail: `${crew} · ${startTime}`, action: 'View pass', outline: true },
    awaitingGuardian: { title: 'Waiting for approval', detail: `${SAMPLE_GUARDIAN.name} has the link`, action: 'View my pass', outline: true },
    waitlisted: { title: 'On waitlist', detail: `You're #${WAITLIST_POSITION}`, action: 'Leave waitlist', outline: true },
    full: { title: 'Full', detail: `${waiting} on the waitlist`, action: 'Join waitlist', outline: false },
    cancelled: { title: 'Free', detail: `${spotsLeft} spots left`, action: 'Register', outline: false },
  }[state];

  return (
    <>
      {state === 'waitlisted' && (
        <View style={[styles.toast, { bottom: TabBarHeight + insets.bottom + 92 }]}>
          <Toast
            icon="bell"
            text={`You're #${WAITLIST_POSITION}. If a spot opens, we'll book you in automatically and send your pass.`}
          />
        </View>
      )}
      <StickyFooter variant="glass">
        <View style={styles.footerInfo}>
          <ThemedText type="eventTitle" themeColor={state === 'going' || state === 'waitlisted' ? 'brand' : 'textStrong'}>
            {glass.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {glass.detail}
          </ThemedText>
        </View>
        <View style={styles.footerButton}>
          <Button
            label={glass.action}
            flat
            variant={glass.outline ? 'secondary' : 'primary'}
            disabled={offline && !glass.outline}
            onPress={() => {
              if (state === 'going' || state === 'awaitingGuardian') router.push('/pass');
              else if (state === 'waitlisted') onLeaveWaitlist();
              else if (state === 'full') onJoinWaitlist();
              else onRegister();
            }}
          />
        </View>
      </StickyFooter>
    </>
  );
}

function RoundButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress?: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      style={[styles.round, { backgroundColor: theme.glassOnArt, borderColor: theme.glassStroke, boxShadow: Shadows.tabBar }]}>
      {children}
    </Tappable>
  );
}

function Fact({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${title} ${detail}`}
      style={[styles.fact, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
      {icon}
      <ThemedText type="label">{title}</ThemedText>
      <ThemedText type="small" themeColor="textWeak">
        {detail}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroArt: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    alignItems: 'center',
  },
  heroActions: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  round: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    gap: Spacing.three,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderTopStartRadius: Radius.panel,
    borderTopEndRadius: Radius.panel,
  },
  headline: {
    gap: Spacing.two,
  },
  dateChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  going: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  avatars: {
    width: 76,
    height: 28,
  },
  avatar: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  fact: {
    flex: 1,
    gap: Spacing.oneHalf,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  panel: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  mapPreview: {
    height: 184,
    overflow: 'hidden',
  },
  expand: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    end: Spacing.twoThreeQuarters,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  eta: {
    position: 'absolute',
    start: Spacing.twoThreeQuarters,
    bottom: Spacing.twoThreeQuarters,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  panelBody: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
  },
  navButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  wazeButton: {
    flex: 1,
  },
  otherMaps: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 24,
  },
  carpool: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  iconTile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  carpoolButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 24,
  },
  bring: {
    gap: Spacing.twoThreeQuarters,
  },
  bringItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.threeLess,
    paddingBottom: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  centred: {
    textAlign: 'center',
  },
  links: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
    paddingVertical: Spacing.threeLess,
  },
  linkLabel: {
    flex: 1,
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  footerInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  footerButton: {
    minWidth: 132,
  },
  toast: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
});
