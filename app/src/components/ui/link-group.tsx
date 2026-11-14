import { router, type Href } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ListRow } from '@/components/ui/list-row';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type LinkItem = { title: string; detail: string; href?: Href; onPress?: () => void; trailing?: ReactNode };

/** A titled card of tappable rows (Figma P0 Profile, N0 Notifications): title, detail, chevron. */
export function LinkGroup({ title, items }: { title: string; items: readonly LinkItem[] }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <ThemedText type="label" themeColor="textWeak" accessibilityRole="header" style={styles.title}>
        {title}
      </ThemedText>
      <View style={[styles.card, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
        {items.map((item, index) => (
          <ListRow
            key={item.title}
            title={item.title}
            detail={item.detail}
            onPress={item.onPress ?? (item.href ? () => router.push(item.href!) : undefined)}
            divider={index < items.length - 1}
            trailing={item.trailing}
            linkCard
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  title: {},
  // Figma "Card": 18 px corners.
  card: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
});
