import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { kiteBeachMapXml } from '@/constants/kite-beach-map';
import { useTheme } from '@/hooks/use-theme';

const ART_WIDTH = 510;
const ART_HEIGHT = 595;
const FRAME_WIDTH = 360;

type MapArtProps = {
  /** Where the map's top-left corner sits in the Figma frame's 360 px layout. */
  left: number;
  top: number;
  /** Figma draws the larger map views from a 600 px version: pass 600 / 510 for those. */
  zoom?: number;
  /** Leaves out the route, the event pin, parking and the user, for screens that draw their own. */
  plain?: boolean;
};

// The overlays drawn into the Figma map, removed for the plain version.
const OVERLAYS = [
  /<path id="Vector_212"[^>]*\/>/,
  /<g id="Event pin".*?<\/g>/s,
  /<path id="Label: Kite Beach"[^>]*\/>/,
  /<g id="Parking">.*?<\/g>/s,
  /<circle id="You halo"[^>]*\/>/,
  /<circle id="You"[^>]*\/>/,
];
const plainMapXml = OVERLAYS.reduce((xml, overlay) => xml.replace(overlay, ''), kiteBeachMapXml);

/** The Kite Beach map illustration, cropped by its parent. It grows with wider phones so it always fills. */
export function MapArt({ left, top, zoom = 1, plain = false }: MapArtProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const scale = Math.max(width / FRAME_WIDTH, 1) * zoom;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.mapBase }]}>
      <View style={{ position: 'absolute', left: left * scale / zoom, top: top * scale / zoom }}>
        <SvgXml xml={plain ? plainMapXml : kiteBeachMapXml} width={ART_WIDTH * scale} height={ART_HEIGHT * scale} />
      </View>
    </View>
  );
}
