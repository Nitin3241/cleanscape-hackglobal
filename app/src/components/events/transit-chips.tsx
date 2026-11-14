import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Red Line, then bus F16, then a short walk, as coloured chips. */
export function TransitChips() {
  const theme = useTheme();

  return (
    <View style={styles.row} accessible accessibilityLabel="Red Line metro, then bus F16, then a 6 minute walk">
      <View style={[styles.chip, { backgroundColor: theme.metroRed }]}>
        <Icon name="train" size={12} color="textOnBrand" strokeWidth={1.5} />
        <ThemedText type="tag" themeColor="textOnBrand">
          Red
        </ThemedText>
      </View>
      <Icon name="chevron-end" size={12} color="textWeak" />
      <View style={[styles.chip, { backgroundColor: theme.brand }]}>
        <Icon name="bus" size={12} color="textOnBrand" strokeWidth={1.5} />
        <ThemedText type="tag" themeColor="textOnBrand">
          F16
        </ThemedText>
      </View>
      <Icon name="chevron-end" size={12} color="textWeak" />
      <View style={styles.walk}>
        <Icon name="walk" size={14} color="textWeak" strokeWidth={1.5} />
        <ThemedText type="ringCaption" themeColor="textWeak">
          6
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: 2,
    borderRadius: Radius.check + 2,
  },
  walk: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
