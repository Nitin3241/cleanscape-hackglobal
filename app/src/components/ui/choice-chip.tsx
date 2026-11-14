import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useSelectionTween } from '@/hooks/use-selection';
import { useTheme } from '@/hooks/use-theme';

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Frosted chip for floating on the map (R2). */
  onMap?: boolean;
  /** A small coloured dot before the label, such as coral for "Needs people". */
  dot?: ThemeColor;
  /** Figma Onb 10 draws the border outside the 8 × 12 padding, so its chips are 38 px tall, not 36. */
  borderOutsidePadding?: boolean;
};

/** Selectable pill for picking any number of options, in onboarding and filters. */
export function ChoiceChip({ label, selected, onPress, onMap = false, dot, borderOutsidePadding = false }: ChoiceChipProps) {
  const theme = useTheme();
  const selection = useSelectionTween(selected);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(selection.get(), [0, 1], [onMap ? theme.glassOnMap : theme.card, theme.brand]),
    borderColor: interpolateColor(selection.get(), [0, 1], [onMap ? theme.glassStroke : theme.strokeControl, theme.brand]),
  }));

  return (
    <Tappable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      hitSlop={{ top: 4, bottom: 4 }}
      onPress={() => {
        feedback.play(selected ? 'toggle.off' : 'toggle.on');
        onPress();
      }}>
      <Animated.View style={[styles.chip, borderOutsidePadding && styles.chipOutside, chipStyle]}>
        {dot && <View style={[styles.dot, { backgroundColor: selected ? theme.textOnBrand : theme[dot] }]} />}
        <ThemedText type={selected ? 'chipSelected' : 'body'} themeColor={selected ? 'textOnBrand' : 'textStrong'}>
          {label}
        </ThemedText>
      </Animated.View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  // The 1 px border sits inside Figma's 8 x 12 padding, so selecting doesn't change the size.
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoThreeQuarters - 1,
    paddingVertical: Spacing.two - 1,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  chipOutside: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
