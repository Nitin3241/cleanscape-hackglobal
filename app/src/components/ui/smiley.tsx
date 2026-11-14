import { SvgXml } from 'react-native-svg';

import { smileyXml } from '@/constants/illustrations';

/** The Smileys reward glyph (Figma component `Smiley`). */
export function Smiley({ size = 24 }: { size?: number }) {
  return <SvgXml xml={smileyXml} width={size} height={size} />;
}
