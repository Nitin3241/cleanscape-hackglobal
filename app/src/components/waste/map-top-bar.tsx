import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Figma map header (F4·3, F4·6g): a white 40 px back button and a white 60% glass search pill, 8 px under the status bar. */
export function MapTopBar({ search, children }: { search: string; children?: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.top, { top: insets.top + Spacing.two }]}>
      <View style={styles.row}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={[styles.back, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <Icon name="chevron-start" size={20} color="textStrong" strokeWidth={1.75} />
        </Tappable>
        <View style={styles.search}>
          <ThemedText type="bodyMedium14">{search}</ThemedText>
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    start: 0,
    end: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.three,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  // Figma Search pill: white 60% glass, 85% white edge, 20 radius, text 15 px in.
  search: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    boxShadow: '0px 4px 16px -4px rgba(18, 37, 46, 0.12)',
  },
});
