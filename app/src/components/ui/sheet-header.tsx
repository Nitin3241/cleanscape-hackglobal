import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Sheet title (20 px) with an optional line under it and the round grey close button (Figma 13 Nov sheets). */
export function SheetHeader({
  title,
  subtitle,
  onClose = () => router.back(),
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <View style={[styles.flex, styles.titles]}>
        <ThemedText style={FigmaLines.l30} type="sheetTitle" accessibilityRole="header">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={FigmaLines.l20} type="meta13" themeColor="textWeak">
            {subtitle}
          </ThemedText>
        )}
      </View>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={6}
        onPress={onClose}
        style={[styles.close, { backgroundColor: theme.tileNeutral }]}>
        <Icon name="close" size={18} color="textStrong" strokeWidth={2} />
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: 2 px between the sheet title and the line under it.
  titles: {
    gap: 2,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});
