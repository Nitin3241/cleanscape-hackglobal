import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { GlassButton } from '@/components/ui/glass-button';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { emirateChevronXml, emiratePinXml, guideChevronXml, guideSearchXml } from '@/constants/plastic-art';
import { type ThemeColor, Gradients, Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { type Bin, BIN_DOT, BIN_LABEL, WASTE_MATERIALS } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';
import { useEmirate } from '@/state/emirate';
import { useRtlScope } from '@/state/language';

/** F4·1: Know your waste. Which bin each material goes in, under the chosen emirate's rules. */
export default function WasteGuideRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const emirate = useEmirate();
  const rtl = useRtlScope() || I18nManager.isRTL;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      {/* Figma header bar: 104 tall, fixed while the page scrolls; light status bar on the blue. */}
      <LinearGradient {...Gradients.headerBar} style={[styles.header, { height: insets.top + 60 }]}>
        <StatusBar style="light" />
        <View style={[styles.headerRow, { marginTop: insets.top + Spacing.two }]}>
          <GlassButton icon="chevron-start" label="Back" onPress={() => router.back()} surface="header" />
          <ThemedText
            type="screenTitle"
            themeColor="textOnBrand"
            accessibilityRole="header"
            numberOfLines={1}
            style={styles.title}>
            Know your waste
          </ThemedText>
          {/* Figma "Emirate chip": glass on the blue header, opens F4·1s. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel={`Emirate: ${emirate}. Change`}
            onPress={() => router.push('/waste-emirate')}
            style={[styles.emirate, { backgroundColor: theme.glassOnHeader, borderColor: theme.glassOnHeaderStroke }]}>
            <SvgXml xml={emiratePinXml} width={11} height={14.17} style={styles.pin} />
            <ThemedText type="fieldLabel" themeColor="textOnBrandWeak" style={FigmaLines.l20}>
              {emirate}
            </ThemedText>
            <SvgXml xml={emirateChevronXml} width={10} height={6} style={styles.chipChevron} />
          </Tappable>
        </View>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}
        showsVerticalScrollIndicator={false}>
        {/* Search isn't a real search yet: in the demo it shows Earthy's answer for a pizza box (Figma F4·6). */}
        <Tappable
          accessibilityRole="search"
          accessibilityLabel="Search an item to discard"
          onPress={() => router.push('/waste-answer')}
          style={[styles.search, { backgroundColor: theme.tileNeutral }]}>
          <SvgXml xml={guideSearchXml} width={18} height={19} />
          <ThemedText type="hintTight" themeColor="textPlaceholder" style={FigmaLines.l21}>
            Search an item to discard
          </ThemedText>
        </Tappable>

        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Not sure? Ask AI. Earthy tells you the right bin"
          onPress={() => router.push('/waste-answer')}
          style={[styles.askCard, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <EarthyOrb size={40} state="still" glow={false} />
          <View style={styles.askText}>
            <ThemedText type="rowTitle" style={FigmaLines.l23}>
              Not sure? Ask Ai
            </ThemedText>
            <ThemedText type="caption" themeColor="textWeak" style={FigmaLines.l18}>
              Earthy tells you the right bin
            </ThemedText>
          </View>
          <SvgXml xml={guideChevronXml} width={7} height={12} style={rtl && styles.mirrored} />
        </Tappable>

        <ThemedText type="tag" themeColor="textWeak" style={[styles.caps, FigmaLines.l17]}>
          {`${WASTE_MATERIALS.length} materials · ${emirate} rules`}
        </ThemedText>

        <View style={styles.grid}>
          {WASTE_MATERIALS.map((material) => {
            const chip = BIN_CHIP[material.bin];
            const body = (
              <>
                <View style={styles.art}>
                  <SvgXml xml={material.art} width={56} height={56} />
                </View>
                <View style={styles.tileText}>
                  <ThemedText type="labelMedium14" style={FigmaLines.l21}>
                    {material.label}
                  </ThemedText>
                  <View style={[styles.bin, { backgroundColor: theme[material.key === 'glass' ? 'glassChip' : chip.fill] }]}>
                    <View style={[styles.binDot, { backgroundColor: theme[BIN_DOT[material.bin]] }]} />
                    <ThemedText type="smallMedium" themeColor={chip.text} style={FigmaLines.l17}>
                      {BIN_LABEL[material.bin]}
                    </ThemedText>
                  </View>
                </View>
              </>
            );
            const tileStyle = [styles.tile, { backgroundColor: theme[material.background] }];
            // Only Plastic has its own page in Figma (F4·2); the other tiles are information only for now.
            return material.key === 'plastic' ? (
              <Tappable
                key={material.key}
                accessibilityRole="button"
                accessibilityLabel={`${material.label}: ${BIN_LABEL[material.bin]}. How to sort it`}
                onPress={() => router.push('/waste-plastic')}
                style={tileStyle}>
                {body}
              </Tappable>
            ) : (
              <View
                key={material.key}
                accessible
                accessibilityLabel={`${material.label}: ${BIN_LABEL[material.bin]}`}
                style={tileStyle}>
                {body}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <TabBar active="home" />
    </View>
  );
}

/** Figma bin chips: fill and text colour per bin. */
const BIN_CHIP: Record<Bin, { fill: ThemeColor; text: ThemeColor }> = {
  green: { fill: 'statusSuccessSubtle', text: 'statusSuccess' },
  black: { fill: 'strokeWeak', text: 'textStrong' },
  dropOff: { fill: 'secondarySubtle', text: 'textSecondary' },
  donate: { fill: 'textilesSubtle', text: 'donateText' },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma body: search at y 108 (4 under the header), 12 to the Earthy card, 20 to the label, 9 to the tiles.
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  header: {
    zIndex: 1,
  },
  // Figma: back 40 at (16, 52); title 20 SemiBold at (68, 58); emirate chip 87 × 34 at (259, 58), 14 from the end.
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingStart: Spacing.three,
    paddingEnd: Spacing.threeLess,
  },
  title: {
    flex: 1,
    marginStart: Spacing.twoThreeQuarters,
    marginTop: Spacing.oneHalf,
    lineHeight: 30,
  },
  // Figma "Emirate chip": white 18% glass, 35% edge, 10 / 6 padding, 4 gap, 16 radius.
  emirate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  // The pin and chevron SVGs carry their strokes outside the 10 × 13 and 8 × 4 Figma boxes.
  pin: {
    marginHorizontal: -0.5,
    marginVertical: -0.6,
  },
  chipChevron: {
    margin: -1,
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  // Figma "Search": 48 tall, #F2F5F7, 24 radius; glass at x 18, text at x 44.
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 48,
    paddingStart: Spacing.three + Spacing.half,
    borderRadius: 24,
  },
  // Figma "Scan card": 72 tall, 18 radius, 1 px edge, no shadow; orb at x 14, text at x 66, chevron 5 × 10 at x 306.
  askCard: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    marginTop: Spacing.twoThreeQuarters,
    paddingStart: 13,
    paddingEnd: 15,
    borderWidth: 1,
    borderRadius: 18,
  },
  // Figma: the title sits 13 px from the card's top edge (not centred).
  askText: {
    flex: 1,
    alignSelf: 'flex-start',
    gap: 1,
    paddingTop: 13,
  },
  caps: {
    marginTop: Spacing.threeHalf,
    textTransform: 'uppercase',
    letterSpacing: 0.66,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.three,
    rowGap: Spacing.twoThreeQuarters,
    marginTop: 9,
  },
  // Figma "Guide/…": 156 × 92, 18 radius; art 56 at (6, 18), text from x 68.
  tile: {
    width: 156,
    height: 92,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 18,
    overflow: 'hidden',
  },
  art: {
    marginStart: Spacing.oneHalf,
    marginTop: 18,
  },
  tileText: {
    marginStart: Spacing.oneHalf,
    marginTop: Spacing.four,
    gap: 5,
  },
  bin: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  binDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
