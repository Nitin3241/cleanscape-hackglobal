import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RoundButton } from '@/components/ui/round-button';
import { Spacing } from '@/constants/theme';

type PlainHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** The end-side control, such as Share or Earthy's orb. */
  end?: ReactNode;
};

/** White page header (Figma F10·10–14): back, a centred title and subtitle, one end control. */
export function PlainHeader({ title, subtitle, onBack = () => router.back(), end }: PlainHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <RoundButton icon="chevron-start" label="Back" onPress={onBack} />
      <View style={styles.titles}>
        <ThemedText type="sectionTitle" accessibilityRole="header" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="caption" themeColor="textWeak" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <View style={styles.end}>{end}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  titles: {
    flex: 1,
    alignItems: 'center',
  },
  end: {
    width: 40,
    alignItems: 'center',
  },
});
