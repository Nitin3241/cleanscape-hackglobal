import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ListRowProps = {
  title: string;
  detail?: string;
  icon?: IconName;
  /** Replaces the chevron, for a value, toggle or badge on the end side. */
  trailing?: ReactNode;
  onPress?: () => void;
  /** A hairline under the row, for rows stacked inside one card. */
  divider?: boolean;
  /** Figma link-card rows (P0, N0, X0): 12 px end padding and a 12 / 16 detail line, 64 tall. */
  linkCard?: boolean;
};

/** One row in a list: optional icon, title and detail, then a chevron or custom trailing content. */
export function ListRow({ title, detail, icon, trailing, onPress, divider = false, linkCard = false }: ListRowProps) {
  const theme = useTheme();
  const content = (
    <>
      {icon && <Icon name={icon} size={22} color="textStrong" strokeWidth={1.75} />}
      <View style={styles.text}>
        <ThemedText type="linkRow">{title}</ThemedText>
        {detail && (
          <ThemedText type="meta" themeColor="textWeak" style={linkCard && styles.linkDetail}>
            {detail}
          </ThemedText>
        )}
      </View>
      {trailing ?? (onPress ? <Icon name="chevron-end" size={18} color="textWeak" /> : null)}
    </>
  );
  const style = [
    styles.row,
    linkCard && styles.linkRow,
    divider && { borderBottomWidth: 1, borderBottomColor: theme.strokeWeak },
  ];

  if (!onPress) return <View style={style}>{content}</View>;
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={detail ? `${title}, ${detail}` : title}
      onPress={onPress}
      style={style}>
      {content}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    minHeight: 56,
    paddingVertical: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  linkRow: {
    gap: Spacing.two,
    paddingEnd: Spacing.twoThreeQuarters,
  },
  linkDetail: {
    lineHeight: 16,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
});
