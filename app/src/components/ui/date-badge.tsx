import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Day and month tile on event cards. */
export function DateBadge({ day, month }: { day: string; month: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme.secondarySubtle }]}>
      <ThemedText type="dateNumber" maxFontSizeMultiplier={1.2}>
        {day}
      </ThemedText>
      <ThemedText type="microMedium" themeColor="textSecondary" maxFontSizeMultiplier={1.2}>
        {month}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.medium,
  },
});
