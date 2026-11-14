import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/glass';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StickyFooterProps = {
  /** `solid` is a white sheet that runs under the tab bar; `glass` floats above it. */
  variant?: 'solid' | 'glass';
  /** Leaves room for the tab bar under the footer. */
  aboveTabBar?: boolean;
  children: ReactNode;
};

/** The action bar pinned to the bottom of detail screens, such as Register. */
export function StickyFooter({ variant = 'solid', aboveTabBar = true, children }: StickyFooterProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabSpace = aboveTabBar ? TabBarHeight + insets.bottom : Math.max(insets.bottom, Spacing.three);

  if (variant === 'glass') {
    return (
      <View pointerEvents="box-none" style={[styles.floating, { bottom: tabSpace + Spacing.twoHalf }]}>
        <View style={[styles.glassShadow, { boxShadow: Shadows.tabBar }]}>
          <Glass fill="glass" intensity={40} style={styles.glass}>
            <View style={styles.row}>{children}</View>
          </Glass>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.solid,
        { backgroundColor: theme.card, boxShadow: Shadows.footer, paddingBottom: tabSpace + Spacing.twoThreeQuarters },
      ]}>
      <View style={styles.row}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  solid: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderTopStartRadius: Radius.card,
    borderTopEndRadius: Radius.card,
  },
  floating: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
  glassShadow: {
    borderRadius: Radius.card,
  },
  glass: {
    padding: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.twoThreeQuarters,
  },
});
