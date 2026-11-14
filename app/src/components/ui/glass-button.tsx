import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Glass } from '@/components/ui/glass';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 40;

type GlassButtonProps = {
  icon?: IconName;
  /** Artwork instead of an icon, such as the Earthy orb (Figma F10·10 "Ask Earthy"). */
  art?: ReactNode;
  /** Read out by screen readers, such as "Back" or "Share". */
  label: string;
  onPress?: () => void;
  /**
   * What the button sits on: the blue header, a photo or illustration, or a light page. `header` is the Know your
   * waste blue bar (F4·1, F4·9u): white 18% with a 35% edge and Figma's 23 px-tall chevron.
   */
  surface?: 'brand' | 'header' | 'art' | 'light';
};

const LOOK: Record<NonNullable<GlassButtonProps['surface']>, { fill: ThemeColor; icon: ThemeColor }> = {
  brand: { fill: 'glassOnBrand', icon: 'textOnBrand' },
  header: { fill: 'glassOnHeader', icon: 'textOnBrand' },
  art: { fill: 'glassOnArt', icon: 'textStrong' },
  light: { fill: 'glass', icon: 'textStrong' },
};

/** Round Liquid Glass button (handoff section 4): 40 px circle with a 44 px tap area. */
export function GlassButton({ icon, art, label, onPress, surface = 'light' }: GlassButtonProps) {
  const theme = useTheme();
  const look = LOOK[surface];
  // Figma glass buttons (Back, Layers, header actions) draw a 20 px icon.
  const glyph = art ?? (icon ? <Icon name={icon} size={surface === 'header' ? 23 : 20} color={look.icon} /> : null);

  return (
    <Tappable accessibilityRole="button" accessibilityLabel={label} hitSlop={2} onPress={onPress}>
      {surface === 'brand' || surface === 'header' ? (
        // On the blue header a blur would wash out to white, so this is a plain tint.
        <View
          style={[
            styles.glass,
            styles.edge,
            {
              backgroundColor: theme[look.fill],
              borderColor: surface === 'header' ? theme.glassOnHeaderStroke : theme.glassStroke,
            },
          ]}>
          {glyph}
        </View>
      ) : (
        <Glass fill={look.fill} intensity={40} style={styles.glass}>
          {/* A bare SVG would paint under Glass's absolute fill layers on web; a view keeps it on top. */}
          <View>{glyph}</View>
        </Glass>
      )}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
  },
  edge: {
    borderWidth: 1,
  },
});
