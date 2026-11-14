import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { FloatingMapSheet } from '@/components/waste/floating-map-sheet';
import { CALLOUT, MapCallout } from '@/components/waste/map-callout';
import { MapTopBar } from '@/components/waste/map-top-bar';
import { PlaceRow } from '@/components/waste/place-row';
import { WASTE_MAP_BACKGROUND, WasteMap } from '@/components/waste/waste-map';
import { binPinNearestXml, binPinXml, binRowIconXml } from '@/constants/plastic-art';
import { GREEN_BINS } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

const FIGMA_STATUS_BAR = 44;

/**
 * F4·6g Green bins near you (Figma 829:12645), from "Find bins" on a scan result and "Find a green bin near me" on
 * the pizza box answer: only green bins on the map, the nearest one called out with a walking route.
 */
export default function WasteBinsRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [nearest, ...others] = GREEN_BINS.bins;

  return (
    <View style={[styles.screen, { backgroundColor: WASTE_MAP_BACKGROUND }]}>
      <WasteMap shift={insets.top - FIGMA_STATUS_BAR}>
        {others.map((bin) => (
          <SvgXml
            key={bin.name}
            xml={binPinXml}
            width={46}
            height={46}
            style={[styles.abs, { left: bin.pin.x - 8, top: bin.pin.y - 5 }]}
          />
        ))}
        <SvgXml
          xml={binPinNearestXml}
          width={56}
          height={56}
          style={[styles.abs, { left: nearest.pin.x - 8, top: nearest.pin.y - 5 }]}
        />
        <View
          style={[styles.abs, { left: nearest.pin.x + 20 - CALLOUT.width / 2, top: nearest.pin.y - CALLOUT.abovePin }]}
          accessible
          accessibilityLabel={`${GREEN_BINS.callout.title}. ${GREEN_BINS.callout.takes}. ${GREEN_BINS.callout.distance}`}>
          <MapCallout {...GREEN_BINS.callout} accent={theme.statusSuccess} distanceColor={theme.brand} />
        </View>
      </WasteMap>

      <MapTopBar search={GREEN_BINS.search} />

      <FloatingMapSheet title={GREEN_BINS.title} subtitle={GREEN_BINS.subtitle}>
        {GREEN_BINS.bins.map((bin, index) => (
          <PlaceRow
            key={bin.name}
            iconXml={binRowIconXml}
            name={bin.name}
            distance={bin.distance}
            nearest={bin.nearest}
            // Figma links only the first row, to F4·4; the others say "Coming soon".
            onPress={index === 0 ? () => router.push('/waste-rvm') : undefined}
            divider={index < GREEN_BINS.bins.length - 1}
          />
        ))}
      </FloatingMapSheet>
    </View>
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
});
