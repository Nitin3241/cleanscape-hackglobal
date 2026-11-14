import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { Radius, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Figma Home 74:278, Materials > Material/*: 112 px tall, art 70 px wide. */
const TILE_HEIGHT = 112;
const ART_WIDTH = 70;
const LABEL_TOP = 10;

type MaterialCardProps = {
  label: string;
  artwork: string;
  /** Most art is 70 × 70; Plastic's bottle is taller (74) and the tile clips it, as in Figma. */
  artworkHeight?: number;
  background: ThemeColor;
  foreground: ThemeColor;
  onPress?: () => void;
};

/** A waste material tile in "Know your waste": label at the top, art standing on the bottom edge. */
export function MaterialCard({ label, artwork, artworkHeight = ART_WIDTH, background, foreground, onPress }: MaterialCardProps) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${label}: see what goes in`}
      onPress={onPress}
      style={[styles.tile, { backgroundColor: theme[background] }]}>
      {/* A full-width layer on the bottom edge centres the art, so it lands at (tileWidth - 70) / 2 in LTR and RTL. */}
      <View style={styles.artLayer} pointerEvents="none">
        <SvgXml xml={artwork} width={ART_WIDTH} height={artworkHeight} />
      </View>
      <ThemedText
        type="labelSmall"
        themeColor={foreground}
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={styles.label}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: TILE_HEIGHT,
    overflow: 'hidden',
    borderRadius: Radius.large,
  },
  label: {
    alignSelf: 'center',
    marginTop: LABEL_TOP,
    textAlign: 'center',
  },
  artLayer: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    alignItems: 'center',
  },
});
