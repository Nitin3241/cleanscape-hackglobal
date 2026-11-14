import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Dark date tag on a photo ("Before · 14 Nov"), F10·18 and F10·19. */
export function PhotoTag({ text, style }: { text: string; style?: object }) {
  const theme = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: theme.photoTag }, style]}>
      <ThemedText type="smallMedium" themeColor="textOnBrand">
        {text}
      </ThemedText>
    </View>
  );
}

const CORNER = 'M1.25 15.25V1.25H15.25';

/** The four white framing corners over the guide photo (F10·18: 14 px arms, 2.5 stroke, 16 px in). */
export function FrameCorners({ top = 56, inset = 16 }: { top?: number; inset?: number }) {
  const theme = useTheme();
  const corner = (rotate: string, position: object) => (
    <Svg width={16.5} height={16.5} viewBox="0 0 16.5 16.5" style={[styles.corner, position, { transform: [{ rotate }] }]}>
      <Path d={CORNER} stroke={theme.textOnBrand} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </Svg>
  );
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
      {corner('0deg', { top: top - 1.25, start: inset - 1.25 })}
      {corner('90deg', { top: top - 1.25, end: inset - 1.25 })}
      {corner('270deg', { bottom: inset - 1.25, start: inset - 1.25 })}
      {corner('180deg', { bottom: inset - 1.25, end: inset - 1.25 })}
    </View>
  );
}

/** White bottom bar with two buttons side by side and a hairline on top (F10·18, F10·19). */
export function PairBar({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.card, borderTopColor: theme.strokeWeak, paddingBottom: Math.max(insets.bottom, 30) },
      ]}>
      {children}
    </View>
  );
}

/** Height the pair bar covers, for the scroll padding under it. */
export const PAIR_BAR_HEIGHT = 91;

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  corner: {
    position: 'absolute',
  },
  bar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
});
