import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { logomarkTileXml } from '@/constants/brand';

/** The CleanScape logomark tile. Decorative: give the text next to it the name. */
export function Logomark({ size }: { size: number }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <SvgXml xml={logomarkTileXml} width={size} height={size} />
    </View>
  );
}
