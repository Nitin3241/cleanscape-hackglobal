import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** The List / Scan switch shared by the scanner (F4·2) and the roster (F4·3). */
export function ListScanToggle({ active, light = false }: { active: 'list' | 'scan'; light?: boolean }) {
  const theme = useTheme();
  const go = (to: 'list' | 'scan') => to !== active && router.replace(to === 'list' ? '/crew-roster' : '/crew-scan');
  const inactiveText = light ? 'textStrong' : 'textOnBrand';

  return (
    <Glass
      fill={light ? 'glass' : 'scanToggle'}
      intensity={30}
      style={[styles.toggle, !light && { borderWidth: 1, borderColor: theme.scanToggleStroke }]}>
      {(['list', 'scan'] as const).map((key) => {
        const on = key === active;
        return (
          <Tappable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={key === 'list' ? 'Roster list' : 'Scanner'}
            onPress={() => go(key)}
            style={[styles.toggleItem, on && { backgroundColor: theme.brand }]}>
            <ThemedText type="labelMedium14" themeColor={on ? 'textOnBrand' : inactiveText}>
              {key === 'list' ? 'List' : 'Scan'}
            </ThemedText>
          </Tappable>
        );
      })}
    </Glass>
  );
}

const styles = StyleSheet.create({
  // Figma "List / Scan" (F4·2): 4 px padding and gap, 24 radius; segments 20 × 9 padding, 20 radius, 14 SemiBold.
  toggle: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    borderRadius: 24,
  },
  toggleItem: {
    paddingHorizontal: Spacing.threeHalf,
    paddingVertical: 9,
    borderRadius: Radius.card,
  },
});
