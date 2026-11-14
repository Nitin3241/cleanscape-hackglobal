import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast } from '@/components/ui/toast';
import { Spacing, TabBarHeight } from '@/constants/theme';
import { CALENDAR_TOAST_MS, hideCalendarToast, useCalendar } from '@/state/calendar';

/** The snackbar is 65 px tall at 8 px above the tab bar; the Earthy button (16 px above it) rises to 12 px above the snackbar. */
export const FAB_LIFT_FOR_TOAST = 8 + 65 + 12 - 16;

function openEvent() {
  hideCalendarToast();
  router.push({ pathname: '/event-detail', params: { id: 'kite-beach' } });
}

/** CAL3 / CAL5 snackbar: 8 px above the tab bar, 5 s countdown, "Open" opens the clean-up (R7). */
export function CalendarToast() {
  const { toast } = useCalendar();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View style={[styles.wrap, { bottom: TabBarHeight + insets.bottom + Spacing.two }]} pointerEvents="box-none">
      {/* Figma CAL3 / CAL5: the snackbar opens R7, the clean-up you added. */}
      <Toast
        key={toast}
        text={toast}
        action={{ label: 'Open', onPress: openEvent }}
        countdown={CALENDAR_TOAST_MS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
});
