import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatTileProps = {
  value: string;
  label: string;
  /** Icon or artwork above the value. */
  art?: ReactNode;
};

/** A number with its label, such as "46 h · volunteered". Tiles sit side by side in a row. */
export function StatTile({ value, label, art }: StatTileProps) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      style={[styles.tile, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
      {art}
      <ThemedText type="eventTitle">{value}</ThemedText>
      <ThemedText type="meta" themeColor="textWeak">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    gap: Spacing.half,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
});
