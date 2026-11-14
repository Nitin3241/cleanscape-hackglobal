import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { metaPinXml } from '@/constants/ask-earthy-art';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EventListCardProps = {
  artwork: string;
  when: string;
  title: string;
  meta: string;
  /** `best` is the brand pill with a star; `pick` is Earthy's white pill on results. */
  badge?: 'best' | 'pick';
  /** Why it matches, shown in a pale chip. */
  matches?: string;
  onPress?: () => void;
};

/** A cleanup in a list: two-tone art, dateline, title and where. The best match gets a brand edge. */
export function EventListCard({ artwork, when, title, meta, badge, matches, onPress }: EventListCardProps) {
  const theme = useTheme();
  const emphasised = badge === 'best';

  return (
    <Tappable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${badge ? 'Best match. ' : ''}${title}, ${when}, ${meta}`}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.card },
        emphasised
          ? { borderColor: theme.brand, borderWidth: 1.5, boxShadow: Shadows.bestCard }
          : { borderColor: theme.strokeWeak },
      ]}>
      <View style={styles.art}>
        <SvgXml xml={artwork} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
      {badge === 'best' && (
        <View style={[styles.badge, styles.bestBadge, { backgroundColor: theme.brand }]}>
          <Icon name="star" size={12} color="secondary" fill="secondary" strokeWidth={1} />
          <ThemedText type="tag" themeColor="textOnBrand">
            Best match
          </ThemedText>
        </View>
      )}
      {badge === 'pick' && (
        <View style={[styles.badge, { backgroundColor: theme.card }]}>
          <ThemedText type="tag">Best match</ThemedText>
        </View>
      )}
      <View style={styles.body}>
        <ThemedText type="dateline" themeColor="brand">
          {when}
        </ThemedText>
        <ThemedText type="eventTitle">{title}</ThemedText>
        <View style={styles.meta}>
          <SvgXml xml={metaPinXml} width={14} height={14} />
          <ThemedText type="meta13" themeColor="textWeak" style={styles.metaText}>
            {meta}
          </ThemedText>
        </View>
        {matches && (
          <View style={[styles.matches, { backgroundColor: theme.fill }]}>
            <ThemedText type="chip" themeColor="brand">
              {matches}
            </ThemedText>
          </View>
        )}
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  art: {
    height: 132,
  },
  badge: {
    position: 'absolute',
    top: Spacing.twoHalf,
    start: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingStart: Spacing.two,
  },
  body: {
    gap: Spacing.one,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  metaText: {
    flexShrink: 1,
  },
  matches: {
    alignSelf: 'flex-start',
    marginTop: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
});
