import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { StepSpinner } from '@/components/earthy/step-spinner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_DRAFT } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const SENDING_MS = 1200;

/**
 * F10·10 Your clean-up (invite-first): the top card is the invite neighbours will see. "Request review"
 * shows F10·10s (white spinner + "Sending", not tappable) for 1.2 s, then F10·16 Sent to EEG.
 */
export default function CleanupDraftRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState(0);
  const [crewSize, setCrewSize] = useState<number>(HOST_DRAFT.crewSize);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!sending) return;
    const timer = setTimeout(() => router.replace('/host-review'), SENDING_MS);
    return () => clearTimeout(timer);
  }, [sending]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Your clean-up"
        centred
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/spot-it'))}
        action={{
          art: <EarthyOrb size={22} state="still" glow={false} />,
          label: 'Ask Earthy about your clean-up',
          onPress: () => router.push('/host-earthy'),
        }}
      />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 112 + insets.bottom }]}>
        <InviteCard onCoHost={() => router.push('/host-co-host')} onPlace={() => router.push('/cleanup-details')} />

        <View style={styles.section}>
          <View style={styles.head}>
            <ThemedText type="rowTitle" style={styles.flex}>
              Pick a time
            </ThemedText>
            {/* Letting neighbours vote isn't built yet: shows "Coming soon". */}
            <Tappable accessibilityRole="button" accessibilityLabel="Let neighbours vote" hitSlop={8}>
              <ThemedText type="chipAction" themeColor="brand">
                Let neighbours vote
              </ThemedText>
            </Tappable>
          </View>
          <View style={styles.times}>
            {HOST_DRAFT.times.map((slot, index) => {
              const on = index === time;
              return (
                <Tappable
                  key={slot.time}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${slot.time}, ${slot.note}`}
                  onPress={() => {
                    feedback.play('toggle.on');
                    setTime(index);
                  }}
                  style={[
                    styles.time,
                    on
                      ? { backgroundColor: theme.brand, borderColor: theme.brand }
                      : { backgroundColor: theme.card, borderColor: theme.strokeChip },
                  ]}>
                  <ThemedText type="labelMedium14" themeColor={on ? 'textOnBrand' : 'textStrong'}>
                    {slot.time}
                  </ThemedText>
                  <ThemedText type="micro11" themeColor={on ? 'timeNoteOnBrand' : 'textWeak'} style={styles.slotNote}>
                    {slot.note}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>

        <View style={[styles.crew, { backgroundColor: theme.loaderCard }]}>
          <View style={styles.head}>
            <View style={styles.flex}>
              <ThemedText type="rowTitle">Crew</ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                {`3 of ${crewSize} spots filled`}
              </ThemedText>
            </View>
            <View style={[styles.stepper, { borderColor: theme.strokeChip }]}>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="Fewer people"
                hitSlop={8}
                disabled={crewSize <= 4}
                onPress={() => setCrewSize((n) => Math.max(4, n - 1))}>
                <ThemedText type="fieldValue" themeColor="brand" style={styles.stepGlyph}>
                  –
                </ThemedText>
              </Tappable>
              <ThemedText type="labelMedium14" accessibilityLiveRegion="polite">
                {crewSize}
              </ThemedText>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel="More people"
                hitSlop={8}
                disabled={crewSize >= 25}
                onPress={() => setCrewSize((n) => Math.min(25, n + 1))}>
                <ThemedText type="fieldValue" themeColor="brand" style={styles.stepGlyph}>
                  +
                </ThemedText>
              </Tappable>
            </View>
          </View>
          <View style={styles.seatGroup}>
            <Seats size={crewSize} />
            <ThemedText type="caption" themeColor="textWeak">
              {HOST_DRAFT.roles}
            </ThemedText>
          </View>
          <View style={styles.inviteGroup}>
            {/* The event isn't live yet, so inviting comes after EEG approves it (F10·17). */}
            <Button label="Invite neighbours" variant="secondary" flat />
            <ThemedText type="micro11" themeColor="textWeak">
              {HOST_DRAFT.neighbours}
            </ThemedText>
          </View>
        </View>

        <View style={styles.kit}>
          <View style={styles.kitHead}>
            <EarthyOrb size={16} state="still" glow={false} />
            <ThemedText type="labelSmall" style={styles.flex}>
              {`What to bring for ${crewSize} people`}
            </ThemedText>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Edit what to bring"
              hitSlop={8}
              onPress={() => router.push('/cleanup-details')}>
              <ThemedText type="chipAction" themeColor="brand">
                Edit
              </ThemedText>
            </Tappable>
          </View>
          <ThemedText type="caption" themeColor="textWeak">
            Earthy made this list from the spot’s size. You can change it.
          </ThemedText>
          <View style={styles.items}>
            {HOST_DRAFT.kit.map((item) => (
              <View key={item} style={[styles.item, { backgroundColor: theme.loaderCard }]}>
                <ThemedText type="filterLabelTight">{item}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.note, { backgroundColor: theme.hostTint }]}>
          <Icon name="clock" size={16} color="brand" />
          <ThemedText type="caption" style={styles.flex}>
            {HOST_DRAFT.review}
          </ThemedText>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bar,
          { backgroundColor: theme.card, borderTopColor: theme.dividerSoft, paddingBottom: Math.max(insets.bottom, 27) },
        ]}>
        {sending ? (
          <View
            accessible
            accessibilityRole="button"
            accessibilityLabel="Sending"
            accessibilityState={{ disabled: true, busy: true }}
            style={[styles.sending, { backgroundColor: theme.brand }]}>
            {/* Figma F10·10s: the label stays centred and the 18 px spinner sits 10.5 px to its left. */}
            <View style={styles.spinnerSlot}>
              <View style={styles.spinner}>
                <StepSpinner size={18} stroke={2} color="textOnBrand" track="spinnerTrackOnBrand" arc={0.3} />
              </View>
            </View>
            <ThemedText type="buttonPrimary" themeColor="textOnBrand">
              Sending
            </ThemedText>
          </View>
        ) : (
          <Button
            label="Request review"
            flat
            onPress={() => {
              feedback.play('button.primary');
              setSending(true);
            }}
          />
        )}
      </View>
    </View>
  );
}

/** The invite neighbours will see (F10·10 "Invite card"); also used on F10·17 You're live. */
export function InviteCard({
  onCoHost,
  onPlace,
  tag = 'drafted',
}: {
  onCoHost: () => void;
  onPlace?: () => void;
  tag?: 'drafted' | 'live';
}) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
      <View style={styles.cover}>
        <Image
          source={require('@/assets/images/host/kite-beach-cover.jpg')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessible={false}
        />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} locations={[0.2, 1]} style={StyleSheet.absoluteFill} />
        {tag === 'drafted' ? (
          <View style={[styles.tag, { backgroundColor: theme.coverTag }]}>
            <EarthyOrb size={14} state="still" glow={false} />
            <ThemedText type="smallMedium" style={styles.tagText}>
              Drafted by Earthy
            </ThemedText>
          </View>
        ) : (
          <View style={[styles.tag, { backgroundColor: theme.coverTag }]}>
            <View style={[styles.liveDot, { backgroundColor: theme.statusSuccess }]} />
            <ThemedText type="smallMedium" style={styles.tagText}>
              Live
            </ThemedText>
          </View>
        )}
        <ThemedText type="coverTitle" themeColor="textOnBrand" style={styles.coverTitle}>
          {HOST_DRAFT.title}
        </ThemedText>
      </View>
      <View style={styles.details}>
        <View style={styles.line}>
          <Icon name="calendar" size={16} color="brand" />
          <ThemedText type="bodyMedium" style={styles.flex}>
            {HOST_DRAFT.when}
          </ThemedText>
        </View>
        {onPlace ? (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Place: ${HOST_DRAFT.place}. Change`}
            onPress={onPlace}
            style={styles.line}>
            <Icon name="pin" size={16} color="brand" />
            <ThemedText type="bodyMedium" style={styles.flex}>
              {HOST_DRAFT.place}
            </ThemedText>
            <Icon name="chevron-end" size={14} color="textWeak" />
          </Tappable>
        ) : (
          // An approved event's meeting point can't be edited from here (Figma F10·17).
          <View style={styles.line}>
            <Icon name="pin" size={16} color="brand" />
            <ThemedText type="bodyMedium" style={styles.flex}>
              {HOST_DRAFT.place}
            </ThemedText>
          </View>
        )}
        <View style={[styles.line, styles.hostLine]}>
          <View style={[styles.avatar, { backgroundColor: theme.brand }]}>
            <ThemedText type="micro10" themeColor="textOnBrand">
              S
            </ThemedText>
          </View>
          <ThemedText type="bodyMedium" style={styles.flex}>
            Hosted by you
          </ThemedText>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Add a co-host"
            onPress={onCoHost}
            style={[styles.coHost, { borderColor: theme.strokeCoHost }]}>
            <ThemedText type="chipAction" themeColor="brand">
              + Co-host
            </ThemedText>
          </Tappable>
        </View>
      </View>
    </View>
  );
}

/** One seat per crew spot: the three people in, then dashed empty seats (F10·10 "Seats"). */
export function Seats({ size }: { size: number }) {
  const theme = useTheme();
  return (
    <View style={styles.seats} accessible accessibilityLabel={`${HOST_DRAFT.crew.length} of ${size} seats filled`}>
      {Array.from({ length: size }, (_, index) => {
        const person = HOST_DRAFT.crew[index];
        return person ? (
          <View key={index} style={[styles.seat, { backgroundColor: theme[person.tone] }]}>
            <ThemedText type="micro9" themeColor="textOnBrand">
              {person.initials}
            </ThemedText>
          </View>
        ) : (
          <Image key={index} source={require('@/assets/images/host/empty-seat.png')} style={styles.seat} accessible={false} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma "Body v2" starts right under the 104 px header with no top padding (logged for Nitin).
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  cover: {
    height: 96,
    overflow: 'hidden',
  },
  tag: {
    position: 'absolute',
    top: 10,
    start: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingStart: Spacing.oneHalf,
    paddingEnd: 9,
    paddingVertical: 3,
    borderRadius: Radius.small,
  },
  tagText: {
    lineHeight: 15,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  coverTitle: {
    position: 'absolute',
    start: 14,
    top: 57,
  },
  details: {
    gap: Spacing.twoHalf,
    padding: Spacing.three,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  hostLine: {
    paddingTop: Spacing.one,
  },
  avatar: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  coHost: {
    paddingStart: Spacing.twoHalf,
    paddingEnd: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  times: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  time: {
    flex: 1,
    gap: 2,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  crew: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  // Figma stepper glyphs are text: 16 medium, normal line height (24).
  // Figma time-slot note: 11 regular at normal line height (17).
  slotNote: {
    lineHeight: 17,
  },
  stepGlyph: {
    lineHeight: 24,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  seatGroup: {
    gap: Spacing.two,
  },
  seats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.oneHalf,
  },
  seat: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  inviteGroup: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  kit: {
    gap: Spacing.twoHalf,
  },
  kitHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  item: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: 5,
    borderRadius: Radius.medium,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
  sending: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
    opacity: 0.85,
  },
  // Zero-width slot so the spinner doesn't push "Sending" off centre.
  spinnerSlot: {
    width: 0,
    height: 18,
  },
  spinner: {
    position: 'absolute',
    end: 10.5,
  },
});
