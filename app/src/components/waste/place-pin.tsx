import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeOut, useReducedMotion, withTiming } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { CALLOUT, MapCallout } from '@/components/waste/map-callout';
import { openPinXml, placePinXml } from '@/constants/plastic-art';
import { Fonts, Motion, Spacing } from '@/constants/theme';
import { PLACE_KINDS, PLACES } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

type Place = (typeof PLACES)[number];

// A slot wider than any distance label, to centre the label on the pin.
const LABEL_SLOT = 96;

// Figma: the pin smart-animates from Collapsed to Expanded (300 ms, bezier 0.22,1,0.36,1).
// The callout grows out of its pin: scale 0.9 → 1, rise 8 px, fade in. Never from scale 0.
const PIN_EASE = Easing.bezier(...Motion.transition.state.easing);
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

/**
 * Figma Map/Pin (452:10185 … 452:10245), as on F4·4: a 40 px pin with its distance label; tapped, the label gives way
 * to the callout card. `at` is the pin's top-left in the map's coordinates. `onOpenDetails` makes the card a button.
 */
export function PlacePin({
  place,
  at,
  open,
  onPress,
  onOpenDetails,
}: {
  place: Place;
  at: { x: number; y: number };
  open: boolean;
  onPress: () => void;
  onOpenDetails?: () => void;
}) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const kind = PLACE_KINDS[place.kind];
  // Figma keeps the card inside the frame: centred on the pin unless that would cross the screen edge.
  const cardLeft = Math.min(Math.max(at.x + 20 - CALLOUT.width / 2, 8), 360 - 8 - CALLOUT.width);
  const callout = (
    <MapCallout
      title={place.pinName}
      takes={place.pinTakes}
      distance={`${place.distance} · ${place.pinHours}`}
      accent={kind.accent}
      distanceColor={kind.ink}
    />
  );

  return (
    <>
      {!open && (
        // Figma centres the distance label over the pin (1.2 km sits 5 px left of it, 2.4 km 7 px).
        <View
          style={[styles.abs, styles.distanceSlot, { left: at.x + 20 - LABEL_SLOT / 2, top: at.y - 26 }]}
          pointerEvents="none">
          <View style={[styles.distance, { backgroundColor: theme.card }]}>
            <ThemedText style={styles.distanceText}>{place.distance}</ThemedText>
          </View>
        </View>
      )}
      {open && (
        <Animated.View
          entering={reducedMotion ? undefined : calloutIn}
          exiting={reducedMotion ? undefined : FadeOut.duration(150)}
          style={[
            styles.abs,
            { left: cardLeft, top: at.y - CALLOUT.abovePin, transformOrigin: `${at.x + 20 - cardLeft}px 100%` },
          ]}>
          {onOpenDetails ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${place.pinName}. ${place.pinTakes}. ${place.distance}, ${place.pinHours}. Open details`}
              onPress={onOpenDetails}>
              {callout}
            </Pressable>
          ) : (
            <View accessible accessibilityLabel={`${place.pinName}. ${place.pinTakes}. ${place.distance}, ${place.pinHours}`}>
              {callout}
            </View>
          )}
        </Animated.View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${place.pinName}, ${place.distance}. ${open ? 'Hide details' : 'Show details'}`}
        accessibilityState={{ expanded: open }}
        aria-expanded={open}
        onPress={onPress}
        style={[styles.abs, { left: at.x - 16, top: at.y - 10 }]}>
        <SvgXml xml={open ? openPinXml(placePinXml[place.kind]) : placePinXml[place.kind]} width={72} height={72} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
  },
  distanceSlot: {
    width: LABEL_SLOT,
    alignItems: 'center',
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
});
