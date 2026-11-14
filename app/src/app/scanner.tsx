import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Glass } from '@/components/ui/glass';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { sheetTiming } from '@/constants/motion';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FEED = require('@/assets/images/scan-pizza-camera.png');

const OPTIONS: readonly { icon: IconName; title: string; note: string; href: Href }[] = [
  { icon: 'qr', title: 'Check in', note: 'Show your pass to the crew head', href: '/check-in' },
  { icon: 'recycle', title: 'Sort an item', note: 'Earthy tells you which bin', href: '/waste-scan' },
  { icon: 'bag', title: 'Log a bag', note: 'Scan the sticker on your bag', href: '/bag-log' },
  { icon: 'flag', title: 'Report litter', note: 'Flag a spot that needs a clean-up', href: '/report' },
  { icon: 'scan', title: 'Scan passes', note: 'Crew head only', href: '/crew-scan' },
];

/**
 * S0 Scanner (Figma "🔗 Prototype connections", 9 Nov 2026): the tab bar's Scan button opens the
 * camera with a chooser. Each row opens that scanner. SAMPLE: the camera feed is Figma's photo.
 */
export default function ScannerRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  // The chooser rises in on the sheet curve (400 ms), like the other slide-ins.
  const appear = useSharedValue(0);
  useEffect(() => {
    appear.set(sheetTiming(1));
  }, [appear]);
  const panelStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? appear.get() : Math.min(1, appear.get() * 2),
    transform: [{ translateY: reducedMotion ? 0 : (1 - appear.get()) * 120 }],
  }));

  return (
    <Scanner feed={FEED}>
      <View style={[styles.corners, { top: insets.top + 56 }]} pointerEvents="none" aria-hidden>
        {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
          <View key={corner} style={[styles.corner, styles[corner]]} />
        ))}
      </View>

      <Animated.View style={[styles.panelWrap, { bottom: Math.max(insets.bottom, Spacing.twoHalf) }, panelStyle]}>
        {/* Frosted like Figma S0: the camera stays visible but soft behind the chooser. */}
        <Glass fill="glassOnMap" intensity={50} style={[styles.panel, { borderColor: theme.glassStroke }]}>
          <View style={styles.head}>
            <ThemedText type="sheetPrompt" accessibilityRole="header">
              What are you scanning?
            </ThemedText>
            <ThemedText type="note" themeColor="textWeak">
              Point at it and Earthy will tell. Or pick one.
            </ThemedText>
          </View>
          {OPTIONS.map((option) => (
            <Tappable
              key={option.title}
              accessibilityRole="button"
              accessibilityLabel={`${option.title}. ${option.note}`}
              onPress={() => router.replace(option.href)}
              style={styles.row}>
              <View style={[styles.iconTile, { backgroundColor: theme.fill }]}>
                <Icon name={option.icon} size={18} color="brand" strokeWidth={1.75} />
              </View>
              <View style={styles.flex}>
                <ThemedText type="linkRow">{option.title}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {option.note}
                </ThemedText>
              </View>
              <Icon name="chevron-end" size={18} color="textWeak" />
            </Tappable>
          ))}
        </Glass>
      </Animated.View>
    </Scanner>
  );
}

const styles = StyleSheet.create({
  corners: {
    position: 'absolute',
    start: 22,
    end: 22,
    height: 480,
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#FFFFFF',
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 14 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 14 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 14 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 14 },
  panelWrap: {
    position: 'absolute',
    start: Spacing.twoThreeQuarters,
    end: Spacing.twoThreeQuarters,
  },
  panel: {
    overflow: 'hidden',
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  head: {
    gap: Spacing.half,
    paddingHorizontal: Spacing.twoHalf,
    paddingBottom: Spacing.two,
  },
  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoHalf,
  },
  iconTile: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  flex: {
    flex: 1,
  },
});
