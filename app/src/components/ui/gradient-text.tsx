import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const STOPS = ['#1E6280', '#2A8FA8', '#E0A21C'] as const;

/**
 * One line of text filled with Earthy's sea-to-sand gradient ("Hello, Sara" on Earthy home).
 * Drawn with SVG, so no masked-view package is needed. Sized from an invisible copy of the
 * text, which also gives screen readers the words.
 */
export function GradientText({ text, size = 26, lineHeight = 34 }: { text: string; size?: number; lineHeight?: number }) {
  const [width, setWidth] = useState(0);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={text}>
      <ThemedText
        style={{ fontFamily: Fonts.semiBold, fontSize: size, lineHeight, opacity: 0, alignSelf: 'flex-start' }}
        onLayout={(event) => setWidth(Math.ceil(event.nativeEvent.layout.width))}>
        {text}
      </ThemedText>
      {width > 0 && (
        <View style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none" aria-hidden>
          <Svg width={width + 4} height={lineHeight}>
            <Defs>
              <LinearGradient id="earthyText" x1="0" y1="0" x2="1" y2="0">
                {STOPS.map((color, index) => (
                  <Stop key={color} offset={index / (STOPS.length - 1)} stopColor={color} />
                ))}
              </LinearGradient>
            </Defs>
            <SvgText x={0} y={lineHeight * 0.74} fontFamily={Fonts.semiBold} fontSize={size} fill="url(#earthyText)">
              {text}
            </SvgText>
          </Svg>
        </View>
      )}
    </View>
  );
}
