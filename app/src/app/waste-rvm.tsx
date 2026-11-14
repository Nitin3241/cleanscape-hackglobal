import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { openInMaps, openInWaze } from '@/components/event/open-waze';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { PlacePin } from '@/components/waste/place-pin';
import { RvmAccepts } from '@/components/waste/rvm-accepts';
import { RvmStep } from '@/components/waste/rvm-step';
import { WASTE_MAP_BACKGROUND, WasteMap } from '@/components/waste/waste-map';
import { rvmWalkXml } from '@/constants/plastic-art';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { PLACE_KINDS, PLACES, RVM } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

// Figma draws a 44 px status bar; F4·4's map sits 152 px higher than F4·3's so the pins and route stay visible.
const FIGMA_STATUS_BAR = 44;
const MAP_LIFT = 152;
// Figma Sheet: y 220 in the frame, 176 under the status bar.
const SHEET_TOP = 220 - FIGMA_STATUS_BAR;
// Figma Bottom bar: 96 tall, the buttons 12 from its top, 28 below them for the home indicator.
const BAR_BUTTONS = 12 + 56;
const BAR_BOTTOM = 28;

type PinKind = keyof typeof RVM.pins;
// The oasis first, so the nearer vending pin draws on top.
const PINS: PinKind[] = ['oasis', 'vending'];

/** F4·4 Reverse vending machine (Figma 447:10119): what to bring, how it works, and the way there. */
export default function WasteRvmRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Figma's pins expand into a callout when tapped (Map/Pin component states).
  const [open, setOpen] = useState<PinKind | null>(null);
  const barBottom = Math.max(insets.bottom, BAR_BOTTOM);

  return (
    <View style={[styles.screen, { backgroundColor: WASTE_MAP_BACKGROUND }]}>
      <WasteMap shift={insets.top - FIGMA_STATUS_BAR - MAP_LIFT}>
        {PINS.map((kind) => {
          const place = PLACES.find((item) => item.kind === kind);
          if (!place) return null;
          return (
            <PlacePin
              key={kind}
              place={place}
              // RVM.pins are in the frame; the map is drawn 152 px higher.
              at={{ x: RVM.pins[kind].x, y: RVM.pins[kind].y + MAP_LIFT }}
              open={open === kind}
              onPress={() => setOpen(open === kind ? null : kind)}
            />
          );
        })}
      </WasteMap>

      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={[styles.back, { top: insets.top + Spacing.two, backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
        <Icon name="chevron-start" size={20} color="textStrong" strokeWidth={1.75} />
      </Tappable>

      <View style={[styles.sheet, { top: insets.top + SHEET_TOP, backgroundColor: theme.card }]}>
        <View style={[styles.grabber, { backgroundColor: theme.strokeControl }]} />
        <ScrollView
          contentContainerStyle={[styles.body, { paddingBottom: BAR_BUTTONS + barBottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText style={styles.title} accessibilityRole="header">
              {RVM.name}
            </ThemedText>
            <ThemedText type="body" themeColor="textWeak">
              {RVM.where}
            </ThemedText>
            <View style={styles.openRow}>
              <View style={styles.open}>
                <View style={[styles.openDot, { backgroundColor: PLACE_KINDS.oasis.dot }]} />
                <ThemedText type="chipSelected" themeColor="statusSuccess">
                  {RVM.open}
                </ThemedText>
              </View>
              {/* Reporting a full machine isn't designed yet: Tappable says "Coming soon". */}
              <Tappable accessibilityRole="button" accessibilityLabel="Report full" hitSlop={Spacing.twoHalf}>
                <ThemedText style={styles.report} themeColor="brand">
                  Report full
                </ThemedText>
              </Tappable>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} accessibilityRole="header">
              What to bring
            </ThemedText>
            <RvmAccepts />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} accessibilityRole="header">
              How it works
            </ThemedText>
            <RvmStep />
          </View>
        </ScrollView>
      </View>

      <View style={[styles.bar, { paddingBottom: barBottom, backgroundColor: theme.card }]}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`Walk, ${RVM.walk}`}
          onPress={openInMaps}
          style={[styles.option, { backgroundColor: theme.brand, borderColor: theme.brand }]}>
          <SvgXml xml={rvmWalkXml} width={10} height={20} style={styles.walkIcon} />
          <ThemedText style={[styles.optionTitle, styles.walkTitle]} themeColor="textOnBrand">
            Walk
          </ThemedText>
          <ThemedText style={[styles.optionMeta, styles.walkMeta]} themeColor="textOnBrand">
            {RVM.walk}
          </ThemedText>
        </Tappable>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`Waze, ${RVM.drive}`}
          onPress={openInWaze}
          style={[styles.option, { backgroundColor: theme.card, borderColor: theme.brand }]}>
          <Image source={require('@/assets/images/waze-tile.png')} style={styles.wazeLogo} accessible={false} />
          <ThemedText style={[styles.optionTitle, styles.wazeTitle]} themeColor="brand">
            Waze
          </ThemedText>
          <ThemedText style={[styles.optionMeta, styles.wazeMeta]} themeColor="textWeak">
            {RVM.drive}
          </ThemedText>
        </Tappable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  // Figma back button: white, 40 px, 1 px #E3E8EB edge, 16 from the side and 8 under the status bar.
  back: {
    position: 'absolute',
    start: Spacing.three,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  // Figma Sheet: floating 8 px in, 32 radius, shadow y −4 blur 20 at 10%. It runs on under the bottom bar.
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    bottom: Spacing.two,
    overflow: 'hidden',
    borderRadius: 32,
    boxShadow: '0px -4px 20px 0px rgba(0, 0, 0, 0.1)',
  },
  grabber: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  // Figma Body: 24 px in, 32 from the sheet's top, 16 between sections.
  body: {
    gap: Spacing.three,
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  header: {
    gap: Spacing.oneHalf,
  },
  // Figma: SemiBold 22, line height normal (33).
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    lineHeight: 33,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  open: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Figma: SemiBold 13, line height normal (20).
  report: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  // Figma: SemiBold 15, line height normal (23).
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 23,
  },
  // Figma Bottom bar: white, 16 px sides, 12 gap, buttons 12 from the top.
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.twoThreeQuarters,
  },
  // Figma Option: 56 tall, 16 radius; the icon and the two lines sit at fixed spots. Walk gets a brand-coloured
  // edge too, so both share the 1.5 px border and split the bar evenly (158 each).
  option: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderRadius: Radius.option,
  },
  optionTitle: {
    position: 'absolute',
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  optionMeta: {
    position: 'absolute',
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  // Positions inside the 1.5 px border (Figma measures from the outer edge).
  walkIcon: {
    position: 'absolute',
    start: 13.5,
    top: 15.5,
  },
  walkTitle: {
    start: 42.5,
    top: 6.5,
  },
  // Figma: white at 85%.
  walkMeta: {
    start: 42.5,
    top: 28.5,
    opacity: 0.85,
  },
  wazeLogo: {
    position: 'absolute',
    start: 9,
    top: 13,
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  wazeTitle: {
    start: 41,
    top: 5,
  },
  wazeMeta: {
    start: 41,
    top: 27,
  },
});
