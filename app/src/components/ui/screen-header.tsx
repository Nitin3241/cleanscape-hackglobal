import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GlassButton } from '@/components/ui/glass-button';
import { type IconName } from '@/components/ui/icon';
import { Gradients, Spacing } from '@/constants/theme';

const GLASS_SIZE = 40;

type ScreenHeaderProps = {
  /** Leave out when the page puts its title in the body (Figma host flow: back button only). */
  title?: string;
  subtitle?: string;
  /** A round glass action on the end side, such as Share. */
  action?: { icon?: IconName; art?: ReactNode; label: string; onPress?: () => void };
  /** Title centred between the two glass buttons (Figma host flow: "Your clean-up"). */
  centred?: boolean;
  onBack?: () => void;
  /** For screens you land on rather than drill into, such as a class space (Figma F3·4). */
  hideBack?: boolean;
  /** Content that sits inside the gradient, under the title. */
  children?: ReactNode;
  /** A custom control at the end of the row instead of a glass button (F4·1 emirate chip). */
  end?: ReactNode;
  /** `header` is the Know your waste bar (F4·9u): 130.87° gradient and white 18% glass with a 35% edge. */
  glass?: 'brand' | 'header';
  /** Figma's exact 130.87° header gradient with the usual brand glass buttons (F11 event day). */
  angled?: boolean;
};

/** The Home blue header used by screens without an illustration at the top: back, title, subtitle. */
export function ScreenHeader({
  title,
  subtitle,
  action,
  onBack = () => router.back(),
  hideBack = false,
  centred = false,
  end,
  glass = 'brand',
  angled = false,
  children,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      {...(glass === 'header' || angled ? Gradients.headerBar : Gradients.header)}
      style={[
        styles.header,
        centred ? styles.headerCentred : styles.headerLeft,
        { paddingTop: insets.top + (centred ? Spacing.two : 6) },
      ]}>
      <StatusBar style="light" />
      <View style={[styles.row, centred ? styles.rowCentred : styles.rowLeft]}>
        {!hideBack && <GlassButton icon="chevron-start" label="Back" onPress={onBack} surface={glass} />}
        <View style={[styles.titles, centred && styles.centred]}>
          {title && (
            <ThemedText
              type={centred ? 'headerTitle' : 'screenTitle'}
              style={centred ? styles.centredTitle : styles.leftTitle}
              themeColor="textOnBrand"
              accessibilityRole="header"
              numberOfLines={1}>
              {title}
            </ThemedText>
          )}
          {subtitle && (
            <ThemedText
              type={centred ? 'ticketCaption' : 'small'}
              themeColor="textOnBrandWeak"
              numberOfLines={1}
              style={centred ? undefined : styles.leftSub}>
              {subtitle}
            </ThemedText>
          )}
        </View>
        {end ??
          (action ? (
            <GlassButton icon={action.icon} art={action.art} label={action.label} onPress={action.onPress} surface={glass} />
          ) : (
            centred && <View style={styles.spacer} />
          ))}
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingBottom: Spacing.twoThreeQuarters,
  },
  // Figma blue header with a left title (P0, F10·5, T1…): 104 tall, title 20 at y 50 (line 30), subtitle 12 (line 18).
  headerLeft: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 6,
  },
  // Figma: the title starts 12 px after the 40 px back button (x 68).
  rowLeft: {
    gap: Spacing.twoThreeQuarters,
  },
  leftTitle: {
    lineHeight: 30,
  },
  leftSub: {
    lineHeight: 18,
  },
  // Figma blue host header (F10·10 and friends): 104 tall, glass buttons at x 16, y 52.
  headerCentred: {
    paddingHorizontal: Spacing.three,
  },
  // Figma host header title: 16 semibold at "normal" height (24), subtitle right under it.
  centredTitle: {
    lineHeight: 24,
  },
  rowCentred: {
    minHeight: GLASS_SIZE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: GLASS_SIZE + Spacing.two,
  },
  titles: {
    flex: 1,
  },
  centred: {
    alignItems: 'center',
  },
  spacer: {
    width: GLASS_SIZE,
  },
});
