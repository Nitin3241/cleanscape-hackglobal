import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionCardProps = {
  icon: IconName;
  title: string;
  detail: string;
  /** "Best for you" on the recommended way, with why. */
  best?: string;
  /** Greyed out, for a way that isn't allowed. */
  off?: boolean;
  /** Content between the title and the detail, such as the route chips. */
  inline?: ReactNode;
  /** Content below the whole row, such as buttons. */
  footer?: ReactNode;
  /** Trailing content, such as the drivers' avatars. */
  trailing?: ReactNode;
  onPress?: () => void;
};

/** One way to get there. The recommended way gets a tinted panel and a stronger edge. */
export function OptionCard({ icon, title, detail, best, off = false, inline, footer, trailing, onPress }: OptionCardProps) {
  const theme = useTheme();
  const highlighted = best !== undefined;
  const body = (
    <>
      {best !== undefined && (
        <View style={styles.best}>
          <Icon name="star" size={11} color="secondary" fill="secondary" strokeWidth={1} />
          <ThemedText type="tag" themeColor="brand">
            Best for you
          </ThemedText>
          <ThemedText type="ringCaption" themeColor="textWeak">
            {best}
          </ThemedText>
        </View>
      )}
      <View style={styles.row}>
        <IconTile icon={icon} size={34} iconSize={20} tone={off ? 'wellCool' : 'fill'} color={off ? 'strokeStrong' : 'brand'} />
        <View style={styles.text}>
          <ThemedText type="labelLarge" themeColor={off ? 'textWeak' : 'textStrong'}>
            {title}
          </ThemedText>
          {inline}
          <ThemedText type="meta" themeColor="textWeak">
            {detail}
          </ThemedText>
        </View>
        {trailing}
        {onPress && <Icon name="chevron-end" size={18} color="textWeak" />}
      </View>
      {footer}
    </>
  );

  const surface = [
    styles.card,
    highlighted
      ? { backgroundColor: theme.wellCool, borderColor: theme.optionStroke, borderWidth: 1.5 }
      : { backgroundColor: theme.card, borderColor: theme.divider, boxShadow: off ? undefined : Shadows.optionCard },
    off && { opacity: 0.7 },
  ];

  if (onPress) {
    return (
      <Tappable accessibilityRole="button" accessibilityLabel={`${title}. ${detail}`} onPress={onPress} style={surface}>
        {body}
      </Tappable>
    );
  }
  return (
    <View style={surface} accessibilityLabel={off ? `${title}. ${detail}` : undefined}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  best: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  text: {
    flex: 1,
    gap: Spacing.one,
  },
});
