import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { RevealOrder } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Icon, type IconName } from '@/components/ui/icon';
import { RevealBlock } from '@/components/ui/reveal-block';
import { Tappable } from '@/components/ui/tappable';
import { type ThemeColor, Radius, Shadows, Spacing } from '@/constants/theme';
import { useHomeCopy } from '@/data/home-copy';
import { useTheme } from '@/hooks/use-theme';
import { type CalendarStatus, updateSite, useCalendar } from '@/state/calendar';

type NextEventCardProps = {
  status: string;
  title: string;
  time: string;
  place: string;
  /** The exact meeting point, shown once it's shared (CAL6). */
  sitePlace: string;
  loading: boolean;
  /** Opens the event. The calendar button stays separate. */
  onOpen: () => void;
  /** Figma "01 Home — event day" (786:12402): today's clean-up, with Start instead of the calendar button. */
  eventDay?: boolean;
};

/** The event the volunteer has signed up for next, with its place in their calendar (Figma CAL1–CAL6). */
export function NextEventCard({ status, title, time, place, sitePlace, loading, onOpen, eventDay = false }: NextEventCardProps) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const calendar = useCalendar();
  const siteShared = !eventDay && calendar.status === 'site-shared';
  const when = eventDay ? copy.eventDay.time : time;
  const where = eventDay ? copy.eventDay.kit : siteShared ? sitePlace : place;
  const open = eventDay ? () => router.push('/event-day') : onOpen;

  return (
    <View style={styles.section}>
      <ThemedText type="sectionTitle" accessibilityRole="header">
        {eventDay ? copy.eventDay.title : copy.nextCleanup}
      </ThemedText>
      <RevealBlock loading={loading} order={RevealOrder.nextCleanup} radius={Radius.panel} lines="wide">
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`${eventDay ? copy.eventDay.title : copy.nextCleanup}: ${title}, ${when}, ${where}`}
            onPress={open}
            style={styles.summary}>
            <View style={styles.chips}>
              <Chip label={eventDay ? copy.eventDay.chip : status} tone="success" icon="check" />
              {siteShared && (
                <View style={[styles.siteChip, { backgroundColor: theme.siteSharedFill }]}>
                  <ThemedText type="filterLabel" themeColor="siteSharedText">
                    {copy.siteShared}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText type="cardTitle">{title}</ThemedText>
            <View style={styles.meta}>
              <MetaRow icon="calendar" text={when} />
              <MetaRow icon="pin" text={where} />
            </View>
          </Tappable>
          {eventDay ? <StartButton onPress={open} label={copy.eventDay.start} /> : <CalendarButton status={calendar.status} />}
        </View>
      </RevealBlock>
    </View>
  );
}

const LOOK: Record<CalendarStatus, { fill: ThemeColor; stroke: ThemeColor; text: ThemeColor; icon: IconName | 'spinner' }> = {
  none: { fill: 'card', stroke: 'brand', text: 'brand', icon: 'calendar-plus' },
  added: { fill: 'addedFill', stroke: 'addedStroke', text: 'statusSuccess', icon: 'check' },
  syncing: { fill: 'syncFill', stroke: 'syncingStroke', text: 'brand', icon: 'spinner' },
  synced: { fill: 'syncFill', stroke: 'syncingStroke', text: 'brand', icon: 'check' },
  'site-shared': { fill: 'card', stroke: 'brand', text: 'brand', icon: 'refresh' },
};

/** The one calendar button: Add → In calendar (CAL3), or Syncing… → Calendar synced (CAL4s, CAL5), or Update (CAL6). */
function CalendarButton({ status }: { status: CalendarStatus }) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const look = LOOK[status];
  const label = {
    none: copy.addToCalendar,
    added: copy.inCalendar,
    syncing: copy.syncing,
    synced: copy.calendarSynced,
    'site-shared': copy.updateCalendar,
  }[status];
  const onPress = status === 'site-shared' ? updateSite : status === 'syncing' ? undefined : () => router.push('/calendar-add');

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: status === 'syncing', disabled: status === 'syncing' }}
      disabled={status === 'syncing'}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme[look.fill], borderColor: theme[look.stroke], boxShadow: Shadows.buttonSecondary },
      ]}>
      {look.icon === 'spinner' ? (
        <ActivityIndicator size="small" color={theme.brand} />
      ) : (
        <Icon name={look.icon} size={18} color={look.text} strokeWidth={2} />
      )}
      <ThemedText type="label" themeColor={look.text}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

/** Event day: the card's button starts the day (F11·1). Figma keeps the calendar-plus icon here. */
function StartButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.card, borderColor: theme.brand, boxShadow: Shadows.buttonSecondary }]}>
      <Icon name="calendar-plus" size={18} color="brand" strokeWidth={2} />
      <ThemedText type="label" themeColor="brand">
        {label}
      </ThemedText>
    </Tappable>
  );
}

function MetaRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Icon name={icon} size={16} color="textWeak" />
      <ThemedText type="body" themeColor="textWeak" style={styles.metaText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  card: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  summary: {
    gap: Spacing.twoThreeQuarters,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  siteChip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: 13,
  },
  meta: {
    gap: Spacing.oneHalf,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  metaText: {
    flexShrink: 1,
  },
  button: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderRadius: Radius.small,
  },
});
