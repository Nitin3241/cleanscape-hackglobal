import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Spacing } from '@/constants/theme';

type ScannerProps = {
  /**
   * DEMO: the camera feed is a still photo from Figma, so the demo never depends on a live
   * camera. A custom build would put expo-camera's CameraView here and call onScan from it.
   */
  feed: ImageSource;
  title?: string;
  subtitle?: string;
  /** Replaces the title, such as Earthy Lens's spoken question. */
  center?: ReactNode;
  /** Content under the top bar, such as the check-in progress. */
  header?: ReactNode;
  onClose?: () => void;
  /** Hides the torch where Figma has none (F5·1 bag sticker). */
  torch?: boolean;
  /** Everything drawn over the feed: scan frame, labels, sheets. */
  children?: ReactNode;
};

/**
 * The one scanner used across the app (build guide: "one scanner component for everything"):
 * crew-head pass scanning (F4·2), Earthy's waste scan (F4·7–F4·10) and bag stickers (F5).
 * Full-screen feed, a close button, an optional title, and a torch toggle.
 */
export function Scanner({
  feed,
  title,
  subtitle,
  center,
  header,
  onClose = () => router.back(),
  torch: showTorch = true,
  children,
}: ScannerProps) {
  const insets = useSafeAreaInsets();
  const [torch, setTorch] = useState(false);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image source={feed} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      {/* Figma scanners (F4·2, F4·7p, F4·9c): close and torch at y 52, 8 px under the status bar. */}
      <View style={[styles.top, { paddingTop: insets.top + Spacing.two }]}>
        <View style={styles.bar}>
          <GlassButton icon="close" label="Close scanner" onPress={onClose} surface="brand" />
          <View style={styles.titles}>
            {center}
            {title && (
              <ThemedText type="sectionTitle" themeColor="textOnBrand" accessibilityRole="header" numberOfLines={1}>
                {title}
              </ThemedText>
            )}
            {subtitle && (
              <ThemedText type="meta" themeColor="timeNoteOnBrand" numberOfLines={1}>
                {subtitle}
              </ThemedText>
            )}
          </View>
          {/* DEMO: the torch only toggles the button; a camera build would switch the light. */}
          {showTorch ? (
            <GlassButton
              icon="flash"
              label={torch ? 'Turn the torch off' : 'Turn the torch on'}
              onPress={() => setTorch((on) => !on)}
              surface="brand"
            />
          ) : (
            <View style={styles.torchSpace} />
          )}
        </View>
        {header}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1A20',
  },
  top: {
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    zIndex: 2,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  torchSpace: {
    width: 40,
  },
  titles: {
    flex: 1,
    alignItems: 'center',
  },
});
