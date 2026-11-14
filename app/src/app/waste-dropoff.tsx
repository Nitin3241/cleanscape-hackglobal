import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { FloatingMapSheet } from '@/components/waste/floating-map-sheet';
import { CALLOUT, MapCallout } from '@/components/waste/map-callout';
import { MapTopBar } from '@/components/waste/map-top-bar';
import { PlaceRow } from '@/components/waste/place-row';
import { WASTE_MAP_BACKGROUND, WasteMap } from '@/components/waste/waste-map';
import { openPinXml, placePinXml, placeRowIconXml } from '@/constants/plastic-art';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { DROP_OFF, PLACE_KINDS, PLACES, type PlaceKind } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

type Filter = 'all' | PlaceKind;

const FIGMA_STATUS_BAR = 44;

/**
 * F4·3 Drop-off near you — plastic (Figma 447:10048): places that take what the home green bin doesn't, or pay
 * points for bottles. Pins expand into a callout; the vending machine row opens F4·4. From "Find drop-off" on F4·2
 * it starts with the two first-visit tips (F4·3a, F4·3b).
 */
export default function WasteDropOffRoute() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ intro?: string }>();
  // First visit (from Find drop-off): two tips, then the map. Skip or Got it ends them.
  const [tip, setTip] = useState<0 | 1 | 2>(params.intro === '1' ? 1 : 0);
  const [filter, setFilter] = useState<Filter>('all');
  // Figma's pins expand into a callout when tapped (variants 452:10185 to 452:10245).
  const [open, setOpen] = useState<PlaceKind | null>('vending');
  const places = PLACES.filter((place) => filter === 'all' || place.kind === filter);

  return (
    <View style={[styles.screen, { backgroundColor: WASTE_MAP_BACKGROUND }]}>
      <WasteMap shift={insets.top - FIGMA_STATUS_BAR}>
        {places.map((place) => (
          <Pin
            key={place.kind}
            place={place}
            open={open === place.kind}
            onPress={() => setOpen(open === place.kind ? null : place.kind)}
          />
        ))}
      </WasteMap>

      <MapTopBar search={DROP_OFF.search}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={`All ${PLACES.length}`} active={filter === 'all'} onPress={() => setFilter('all')} />
          {(Object.keys(PLACE_KINDS) as PlaceKind[]).map((kind) => (
            <Chip
              key={kind}
              label={PLACE_KINDS[kind].label}
              dot={PLACE_KINDS[kind].dot}
              active={filter === kind}
              onPress={() => setFilter(kind)}
            />
          ))}
        </ScrollView>
      </MapTopBar>

      <FloatingMapSheet title={DROP_OFF.title} subtitle={DROP_OFF.subtitle}>
        {places.map((place, index) => (
          <View key={place.kind} style={tip === 2 && index === 0 && styles.hidden}>
            <Row place={place} divider={index < places.length - 1} />
          </View>
        ))}
      </FloatingMapSheet>

      {tip !== 0 && <FirstVisitTips tip={tip} onNext={() => setTip(2)} onDone={() => setTip(0)} />}
    </View>
  );
}

// Figma F4·3 sheet: 348 tall, its first place row 84 px from the top.
const SHEET_HEIGHT = 348;
const FIRST_ROW = 84;

/**
 * F4·3a / F4·3b first-visit tips (Figma 451:10094, 451:10226): the screen dims, the filters (then the nearest place)
 * are lifted above the dim inside a soft white ring, and a tip card points at them.
 */
function FirstVisitTips({ tip, onNext, onDone }: { tip: 1 | 2; onNext: () => void; onDone: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  // The nearest place's row, where the sheet draws it.
  const rowTop = height - Math.max(insets.bottom, Spacing.two) - SHEET_HEIGHT + FIRST_ROW;
  const chipsTop = insets.top + 60;

  return (
    <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />
      {tip === 1 ? (
        <>
          <View style={[styles.ring, styles.chipsRing, { top: chipsTop - 6 }]} />
          <View style={[styles.liftedChips, { top: chipsTop }]} accessibilityElementsHidden>
            <Chip label={`All ${PLACES.length}`} active onPress={() => {}} />
            {(Object.keys(PLACE_KINDS) as PlaceKind[]).map((kind) => (
              <Chip
                key={kind}
                label={PLACE_KINDS[kind].label}
                dot={PLACE_KINDS[kind].dot}
                active={false}
                solid
                onPress={() => {}}
              />
            ))}
          </View>
          <View style={[styles.tipCard, { top: chipsTop + 52, backgroundColor: theme.card }]} accessibilityViewIsModal>
            <SvgXml xml={TIP_CARET_UP} width={20} height={10} style={[styles.caret, { left: 174, top: -9 }]} />
            <ThemedText style={styles.tipTitle} accessibilityRole="header">
              3 kinds of drop-off
            </ThemedText>
            {(Object.keys(PLACE_KINDS) as PlaceKind[]).map((kind) => (
              <View key={kind} style={styles.tipRow}>
                <View style={[styles.tipDot, { backgroundColor: PLACE_KINDS[kind].dot, borderColor: theme.card }]} />
                <ThemedText style={styles.tipLabel}>{PLACE_KINDS[kind].label}</ThemedText>
                <ThemedText style={styles.tipTakes} themeColor="textWeak">
                  {PLACE_KINDS[kind].takes}
                </ThemedText>
              </View>
            ))}
            <ThemedText style={styles.tipNote} themeColor="textWeak">
              Got a bottle? Vending is quickest.
            </ThemedText>
            <View style={styles.tipFooter}>
              <ThemedText style={styles.tipStep} themeColor="textWeak">
                1 of 2
              </ThemedText>
              <View style={styles.tipButtons}>
                <TextButton label="Skip" onPress={onDone} />
                <TipButton label="Next" width={84} onPress={onNext} />
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.liftedRow, { top: rowTop - 6, backgroundColor: theme.card }]}>
            <Row place={PLACES[0]} divider={false} />
          </View>
          <View style={[styles.ring, styles.rowRing, { top: rowTop - 6 }]} pointerEvents="none" />
          <View
            style={[styles.tipCard, { bottom: height - (rowTop - 6) + 12, backgroundColor: theme.card }]}
            accessibilityViewIsModal>
            <ThemedText style={styles.tipTitle} accessibilityRole="header">
              Start with the nearest
            </ThemedText>
            <ThemedText style={styles.tipTakes} themeColor="textWeak">
              Tags show what each place takes. Tap the arrow for walking directions.
            </ThemedText>
            <View style={styles.tipFooter}>
              <ThemedText style={styles.tipStep} themeColor="textWeak">
                2 of 2
              </ThemedText>
              <TipButton label="Got it" width={96} onPress={onDone} />
            </View>
            <SvgXml xml={TIP_CARET_DOWN} width={20} height={10} style={[styles.caret, { left: 290, bottom: -9 }]} />
          </View>
        </>
      )}
    </Animated.View>
  );
}

const TIP_CARET_UP =
  '<svg width="20" height="10" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 10L10 0L20 10Z" fill="#FFFFFF"/></svg>';
const TIP_CARET_DOWN =
  '<svg width="20" height="10" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg"><path d="M0 0L10 10L20 0Z" fill="#FFFFFF"/></svg>';

/** Figma AI/Button Primary in the tips: a 40 px brand pill of a fixed width, SemiBold 15 label. */
function TipButton({ label, width, onPress }: { label: string; width: number; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.tipButton, { width, backgroundColor: theme.brand }]}>
      <ThemedText type="buttonPrimary" themeColor="textOnBrand">
        {label}
      </ThemedText>
    </Tappable>
  );
}

function Row({ place, divider }: { place: (typeof PLACES)[number]; divider: boolean }) {
  return (
    <PlaceRow
      iconXml={placeRowIconXml[place.kind]}
      name={place.name}
      distance={`${place.distance} · ${place.hours}`}
      nearest={place.nearest}
      tag={place.tag}
      // Only the vending machine has a details screen in Figma (F4·4); the others say "Coming soon".
      onPress={place.kind === 'vending' ? () => router.push('/waste-rvm') : undefined}
      divider={divider}
    />
  );
}

/** Figma Filter chips: the selected one solid navy; the rest white 60% glass with a coloured dot. */
function Chip({
  label,
  dot,
  active,
  solid = false,
  onPress,
}: {
  label: string;
  dot?: string;
  active: boolean;
  /** Solid white instead of glass (the chips lifted above the dim in F4·3a). */
  solid?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.chip,
        active
          ? [styles.chipActive, { backgroundColor: theme.textStrong }]
          : solid
            ? { backgroundColor: theme.card }
            : styles.chipGlass,
      ]}>
      {dot && <View style={[styles.chipDot, { backgroundColor: dot }]} />}
      <ThemedText style={styles.chipText} themeColor={active ? 'textOnBrand' : 'textStrong'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

// Figma: the pin smart-animates from Collapsed to Expanded (300 ms, bezier 0.22,1,0.36,1).
// The callout grows out of its pin: scale 0.9 → 1, rise 8 px, fade in. Never from scale 0.
const PIN_EASE = Easing.bezier(0.22, 1, 0.36, 1);
const calloutIn = () => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 8 }, { scale: 0.9 }] },
    animations: {
      opacity: withTiming(1, { duration: 300, easing: PIN_EASE }),
      transform: [
        { translateY: withTiming(0, { duration: 300, easing: PIN_EASE }) },
        { scale: withTiming(1, { duration: 300, easing: PIN_EASE }) },
      ],
    },
  };
};

/** Figma Map/Pin: a 40 px pin with its distance label; tapped, the label gives way to the callout card. */
function Pin({ place, open, onPress }: { place: (typeof PLACES)[number]; open: boolean; onPress: () => void }) {
  const theme = useTheme();
  const kind = PLACE_KINDS[place.kind];
  // Figma keeps the card inside the frame: centred on the pin unless that would cross the screen edge.
  const cardLeft = Math.min(Math.max(place.pin.x + 20 - CALLOUT.width / 2, 8), 360 - 8 - CALLOUT.width);
  return (
    <>
      {!open && (
        <View
          style={[styles.abs, styles.distance, { left: place.pin.x - 7, top: place.pin.y - 26, backgroundColor: theme.card }]}
          pointerEvents="none">
          <ThemedText style={styles.distanceText}>{place.distance}</ThemedText>
        </View>
      )}
      {open && (
        <Animated.View
          entering={calloutIn}
          exiting={FadeOut.duration(150)}
          style={[
            styles.abs,
            { left: cardLeft, top: place.pin.y - CALLOUT.abovePin, transformOrigin: `${place.pin.x + 20 - cardLeft}px 100%` },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${place.pinName}. ${place.pinTakes}. ${place.distance}, ${place.pinHours}. Open details`}
            onPress={() => place.kind === 'vending' && router.push('/waste-rvm')}>
            <MapCallout
              title={place.pinName}
              takes={place.pinTakes}
              distance={`${place.distance} · ${place.pinHours}`}
              accent={kind.accent}
              distanceColor={kind.ink}
            />
          </Pressable>
        </Animated.View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${place.pinName}, ${place.distance}. ${open ? 'Hide details' : 'Show details'}`}
        onPress={onPress}
        style={[styles.abs, { left: place.pin.x - 16, top: place.pin.y - 10 }]}>
        <SvgXml xml={open ? openPinXml(placePinXml[place.kind]) : placePinXml[place.kind]} width={72} height={72} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  abs: {
    position: 'absolute',
  },
  hidden: {
    opacity: 0,
  },
  // Figma distance label: white, 10 radius, 8 / 3 padding, SemiBold 11.
  distance: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: 10,
    boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.18)',
  },
  distanceText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    lineHeight: 17,
  },
  // Figma Filters: y 100 (8 under the search), 16 px sides, 4 px top and bottom, 8 gap.
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginTop: Spacing.two - Spacing.one,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.twoThreeQuarters,
    paddingEnd: Spacing.threeLess,
    paddingVertical: 7,
    borderRadius: 18,
  },
  chipActive: {
    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
  },
  // RN draws the border outside the padding, so the glass chips trim 1 px to keep Figma's 34 px height.
  chipGlass: {
    paddingStart: Spacing.twoThreeQuarters - 1,
    paddingEnd: Spacing.threeLess - 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    boxShadow: '0px 4px 8px 0px rgba(18, 37, 46, 0.12)',
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Figma: Medium 13, line height normal (20).
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  // Figma Scrim: #0B1A20 at 50%.
  scrim: {
    backgroundColor: 'rgba(11, 26, 32, 0.5)',
  },
  // Figma Ring: white 18% with a soft dark glow, around what the tip points at.
  ring: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    boxShadow: '0px 0px 18px 0px rgba(0, 0, 0, 0.35)',
  },
  chipsRing: {
    left: 8,
    width: 350,
    height: 46,
    borderRadius: 24,
  },
  liftedChips: {
    position: 'absolute',
    left: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.oneHalf,
  },
  rowRing: {
    left: 18,
    width: 324,
    height: 88,
    borderRadius: 18,
  },
  liftedRow: {
    position: 'absolute',
    left: 18,
    width: 324,
    height: 88,
    paddingHorizontal: Spacing.oneHalf,
    paddingTop: Spacing.oneHalf,
    borderRadius: 18,
  },
  // Figma Tooltip: 328 wide at x 16, 16 padding, 12 gap, 20 radius, shadow 0 8 24 at 22%.
  tipCard: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderRadius: Radius.card,
    boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.22)',
  },
  caret: {
    position: 'absolute',
  },
  // Figma: SemiBold 16 (24), rows SemiBold / Regular 14 (21), note 12 (18).
  tipTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  tipDot: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  tipLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 21,
  },
  tipTakes: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  tipNote: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  tipStep: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  tipFooter: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  tipButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
