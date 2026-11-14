import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TextLink } from '@/components/ui/text-link';
import { Spacing } from '@/constants/theme';

type SectionTitleProps = {
  title: string;
  actionLabel: string;
  actionAccessibilityLabel: string;
  onAction?: () => void;
};

/** Section heading with a link at the end of the row. */
export function SectionTitle({ title, actionLabel, actionAccessibilityLabel, onAction }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <ThemedText type="sectionTitle" accessibilityRole="header" style={styles.title}>
        {title}
      </ThemedText>
      <TextLink label={actionLabel} accessibilityLabel={actionAccessibilityLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 44,
  },
  title: {
    flexShrink: 1,
  },
});
