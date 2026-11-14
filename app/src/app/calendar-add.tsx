import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CalendarAppIcon } from '@/components/calendar/calendar-app-icon';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { addOnce, type CalendarApp, subscribe } from '@/state/calendar';

/**
 * CAL1 Add to calendar — choose (sheet). "Keep it synced" subscribes (CAL4 → CAL4s → CAL5); "Or add just this one"
 * adds one event (CAL2 → CAL3). CAL2 and CAL4 are iOS screens, so the demo goes straight to the result.
 */
export default function CalendarAddSheet() {
  const theme = useTheme();

  const pick = (action: (app: CalendarApp) => void, app: CalendarApp) => {
    feedback.play('button.primary');
    router.back();
    action(app);
  };

  return (
    <RouteSheet accessibilityLabel="Add to calendar" bottomPadding={34}>
      <View style={styles.header}>
        <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.line30}>
          Add to calendar
        </ThemedText>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={6}
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: theme.closeTile }]}>
          <Icon name="close" size={18} color="textStrong" strokeWidth={1.8} />
        </Tappable>
      </View>

      <View style={[styles.synced, { backgroundColor: theme.syncFill, borderColor: theme.syncStroke }]}>
        <View style={styles.titleRow}>
          <ThemedText type="rowTitle" style={styles.line23}>
            Keep it synced
          </ThemedText>
          <View style={[styles.recommended, { backgroundColor: theme.approvedFill }]}>
            <ThemedText type="smallMedium" themeColor="statusSuccess" style={styles.line17}>
              Recommended
            </ThemedText>
          </View>
        </View>
        <ThemedText type="meta13" themeColor="textWeak" style={styles.line20}>
          All your clean-ups in one calendar. The exact site and any time change update on their own.
        </ThemedText>
        <View style={styles.tiles}>
          {(['Apple', 'Google'] as const).map((app) => (
            <Tappable
              key={app}
              accessibilityRole="button"
              accessibilityLabel={`Keep clean-ups synced in ${app} Calendar`}
              onPress={() => pick(subscribe, app)}
              style={[styles.tile, { backgroundColor: theme.card, borderColor: theme.calendarStroke }]}>
              <CalendarAppIcon app={app} />
              <ThemedText type="fieldLabel" style={styles.line20}>
                {app}
              </ThemedText>
            </Tappable>
          ))}
        </View>
      </View>

      <ThemedText type="labelSmall" themeColor="textWeak" style={styles.line20}>
        Or add just this one
      </ThemedText>
      <View style={[styles.list, { borderColor: theme.calendarStroke }]}>
        {(['Apple', 'Google', 'Outlook'] as const).map((app, index) => {
          const name = app === 'Outlook' ? 'Outlook' : `${app} Calendar`;
          return (
            <Tappable
              key={app}
              accessibilityRole="button"
              accessibilityLabel={`Add this clean-up to ${name}`}
              onPress={() => pick(addOnce, app)}
              style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.calendarStroke }]}>
              <CalendarAppIcon app={app} />
              <ThemedText type="bodyMedium14" style={[styles.flex, styles.line21]}>
                {name}
              </ThemedText>
              <Icon name="chevron-end" size={16} color="chevronWeak" strokeWidth={2} />
            </Tappable>
          );
        })}
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma CAL1 at "normal" line height: 20 → 30, 15 → 23, 14 → 21, 13 → 20, 11 → 17.
  line30: {
    lineHeight: 30,
  },
  line23: {
    lineHeight: 23,
  },
  line21: {
    lineHeight: 21,
  },
  line20: {
    lineHeight: 20,
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
    justifyContent: 'space-between',
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  synced: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  recommended: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  tiles: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tile: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  list: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
});
