import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RevealOrder } from '@/components/home/home-timeline';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MaterialCard } from '@/components/ui/material-card';
import { RevealBlock } from '@/components/ui/reveal-block';
import { Tappable } from '@/components/ui/tappable';
import { eWasteXml, foodXml, glassXml, metalXml, paperXml, plasticXml } from '@/constants/illustrations';
import { FigmaLines } from '@/constants/figma-lines';
import { Radius, Spacing } from '@/constants/theme';
import { useHomeCopy } from '@/data/home-copy';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/state/language';

// English follows Home v2 (Know your waste). The Arabic frame still shows the earlier set.
const MATERIALS = {
  en: [
    { label: 'Plastic', artwork: plasticXml, artworkHeight: 74, background: 'fill', foreground: 'brand' },
    { label: 'Paper', artwork: paperXml, background: 'secondarySubtle', foreground: 'textSecondary' },
    { label: 'Food', artwork: foodXml, background: 'foodSubtle', foreground: 'foodText' },
    { label: 'E-waste', artwork: eWasteXml, background: 'eWasteSubtle', foreground: 'eWasteText' },
  ],
  ar: [
    { label: 'بلاستيك', artwork: plasticXml, artworkHeight: 74, background: 'fill', foreground: 'brand' },
    { label: 'ورق', artwork: paperXml, background: 'secondarySubtle', foreground: 'textSecondary' },
    { label: 'معدن', artwork: metalXml, background: 'accentSubtle', foreground: 'textAccent' },
    { label: 'زجاج', artwork: glassXml, background: 'statusSuccessSubtle', foreground: 'statusSuccess' },
  ],
} as const;

/** Know your waste: the materials to sort, and a way into the full guide. */
export function SortGuide({ loading, onSeeMore }: { loading: boolean; onSeeMore?: () => void }) {
  const theme = useTheme();
  const copy = useHomeCopy();
  const { language } = useLanguage();

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <ThemedText type="sectionTitle" accessibilityRole="header">
          {copy.sortTitle}
        </ThemedText>
        <ThemedText type="body" themeColor="textWeak">
          {copy.sortSubtitle}
        </ThemedText>
      </View>
      <View style={styles.materials}>
        {MATERIALS[language].map((material) => (
          <RevealBlock
            key={material.label}
            loading={loading}
            order={RevealOrder.sortTiles}
            radius={Radius.large}
            lines="tile"
            style={styles.material}>
            {/* Figma: Plastic opens its own page (F4·2); the other tiles open the guide (F4·1). */}
            <MaterialCard
              {...material}
              onPress={() => router.push(material.artwork === plasticXml ? '/waste-plastic' : '/waste-guide')}
            />
          </RevealBlock>
        ))}
      </View>
      {copy.seeMore !== '' && (
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="See more about sorting waste"
          onPress={onSeeMore ?? (() => router.push('/waste-guide'))}
          style={[styles.seeMore, { backgroundColor: theme.wellCool }]}>
          <ThemedText type="labelSmall" themeColor="brand" style={FigmaLines.l20}>
            {copy.seeMore}
          </ThemedText>
          {/* Figma's chevron is 4 × 8, 6 px after the label; the 12 px icon is pulled in to that footprint. */}
          <View style={styles.chevron}>
            <Icon name="chevron-end" size={12} color="brand" strokeWidth={2.5} />
          </View>
        </Tappable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  heading: {
    gap: Spacing.half,
  },
  // Four equal tiles, 8 px apart, no scrolling: 76 × 112 each on a 360 px phone.
  materials: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  material: {
    flex: 1,
  },
  // Figma "See more": 40 px, #F2F5F7, radius 14, SemiBold 13 in brand blue.
  seeMore: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.oneHalf,
    borderRadius: Radius.medium,
  },
  chevron: {
    width: 4,
    alignItems: 'center',
    overflow: 'visible',
  },
});
