import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InfoNoteProps = {
  text: string;
  icon: IconName;
  background: ThemeColor;
  foreground: ThemeColor;
};

/** Small reassurance message with an icon. */
export function InfoNote({ text, icon, background, foreground }: InfoNoteProps) {
  const theme = useTheme();

  return (
    <View style={[styles.note, { backgroundColor: theme[background] }]}>
      <Icon name={icon} size={18} color={foreground} />
      <ThemedText type="note" themeColor={foreground} style={styles.text}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
  text: {
    flex: 1,
  },
});
