import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { openInMaps } from '@/components/event/open-waze';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PlaceRowProps = {
  iconXml: string;
  name: string;
  distance: string;
  nearest?: boolean;
  /** The "what it takes" tag under the distance (F4·3). */
  tag?: { label: string; background: string; color: string };
  /** Without one the row says "Coming soon". */
  onPress?: () => void;
  divider: boolean;
};

/**
 * Figma "Place row" (F4·3, F4·6g): 76 tall, 44 px icon, name, distance with a "Nearest" tag beside it, an optional
 * tag line, and a round directions button. The divider runs from under the text to the end.
 */
export function PlaceRow({ iconXml, name, distance, nearest = false, tag, onPress, divider }: PlaceRowProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`${name}. ${distance}${nearest ? '. Nearest' : ''}${tag ? `. ${tag.label}` : ''}`}
        onPress={onPress}
        style={styles.main}>
        <SvgXml xml={iconXml} width={44} height={44} />
        <View style={styles.text}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <View style={styles.distanceLine}>
            <ThemedText style={styles.distance} themeColor="textWeak">
              {distance}
            </ThemedText>
            {nearest && (
              <View style={[styles.tag, { backgroundColor: theme.secondarySubtle }]}>
                <ThemedText style={styles.nearestText} themeColor="textSecondary">
                  Nearest
                </ThemedText>
              </View>
            )}
          </View>
          {tag && (
            <View style={[styles.tag, styles.tagLine, { backgroundColor: tag.background }]}>
              <ThemedText style={[styles.tagText, { color: tag.color }]}>{tag.label}</ThemedText>
            </View>
          )}
        </View>
      </Tappable>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={`Walking directions to ${name}`}
        // DEMO: every place opens directions to the sample location; real places need a map service.
        onPress={openInMaps}
        style={[styles.go, { backgroundColor: theme.wellCool }]}>
        <Icon name="navigate" size={18} color="brand" strokeWidth={2} />
      </Tappable>
      {divider && <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: icon at y 14, name at y 10, distance at y 32, tag at y 52, Go at y 18; 76 tall.
  row: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.threeLess,
  },
  text: {
    flex: 1,
    marginTop: -Spacing.one,
  },
  // Figma: SemiBold 15 (23), Regular 12 (18).
  name: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 23,
  },
  distanceLine: {
    marginTop: -1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  distance: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  tag: {
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tagLine: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  nearestText: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    lineHeight: 15,
  },
  // Figma: Medium 11 (17).
  tagText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    lineHeight: 17,
  },
  go: {
    marginTop: 18,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  divider: {
    position: 'absolute',
    left: 56,
    right: 0,
    bottom: 0,
    height: 1,
  },
});
