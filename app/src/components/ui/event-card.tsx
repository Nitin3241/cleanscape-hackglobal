import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { DateBadge } from '@/components/ui/date-badge';
import { Tappable } from '@/components/ui/tappable';
import { TextLink } from '@/components/ui/text-link';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EventCardProps = {
  title: string;
  day: string;
  month: string;
  details: string;
  spotsLeft: string;
  artwork: string;
  /** Makes the whole card one button that opens the event. */
  onOpen?: () => void;
  /** The Join link's wording. */
  joinLabel?: string;
};

/** Cleanup event summary, used in the "Cleanups near you" rail. */
export function EventCard({ title, day, month, details, spotsLeft, artwork, onOpen, joinLabel = 'Join' }: EventCardProps) {
  const theme = useTheme();
  const cardStyle = [styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }];

  const content = (
    <>
      <View style={styles.image}>
        <SvgXml xml={artwork} width={232} height={120} />
      </View>

      <View style={styles.row}>
        <DateBadge day={day} month={month} />
        <View style={styles.copy}>
          <ThemedText type="label">{title}</ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
            {details}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.row, styles.footer]}>
        <Chip label={spotsLeft} tone="accent" />
        <TextLink label={joinLabel} emphasis="strong" accessibilityLabel={`${joinLabel} ${title}`} inert={!!onOpen} />
      </View>
    </>
  );

  if (!onOpen) return <View style={cardStyle}>{content}</View>;
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${details}, ${spotsLeft}`}
      onPress={onOpen}
      style={cardStyle}>
      {content}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 248,
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.threeLess,
    paddingHorizontal: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  image: {
    height: 120,
    overflow: 'hidden',
    borderRadius: Radius.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.oneHalf,
  },
  footer: {
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
});
