import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useSelection, useSelectionTween } from '@/hooks/use-selection';
import { useTheme } from '@/hooks/use-theme';

const INDICATOR_SIZE = 20;

type ChoiceCardProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  /** `radio` picks one, `checkbox` picks any. */
  indicator: 'radio' | 'checkbox';
  titleType?: ThemedTextProps['type'];
};

/** Selectable card: the border and fill tween on select, then the indicator pops in with a spring. */
export function ChoiceCard({
  title,
  subtitle,
  selected,
  onPress,
  indicator,
  titleType = 'label',
}: ChoiceCardProps) {
  const theme = useTheme();
  const tween = useSelectionTween(selected);
  const pop = useSelection(selected);
  const isRadio = indicator === 'radio';

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(tween.get(), [0, 1], [theme.card, theme.fill]),
    borderColor: interpolateColor(tween.get(), [0, 1], [theme.strokeControl, theme.brand]),
    borderWidth: 1 + tween.get() * 0.5,
  }));
  const markStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  return (
    <Tappable
      accessibilityRole={indicator}
      accessibilityLabel={`${title}, ${subtitle}`}
      accessibilityState={{ checked: selected }}
      onPress={() => {
        feedback.play(selected ? 'toggle.off' : 'toggle.on');
        onPress();
      }}>
      <Animated.View style={[styles.card, isRadio ? styles.radioCard : styles.checkboxCard, cardStyle]}>
        <View style={styles.copy}>
          <ThemedText type={titleType} style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
            {subtitle}
          </ThemedText>
        </View>
        <View
          style={[
            styles.indicator,
            isRadio ? styles.radio : styles.checkbox,
            { backgroundColor: theme.card, borderColor: theme.strokeStrong },
          ]}>
          <Animated.View
            style={[
              styles.mark,
              isRadio ? styles.radio : styles.checkbox,
              { backgroundColor: theme.brand },
              markStyle,
            ]}>
            {!isRadio && <Icon name="tick" size={14} color="textOnBrand" strokeWidth={3} />}
          </Animated.View>
        </View>
      </Animated.View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.twoThreeQuarters,
  },
  radioCard: {
    minHeight: 72,
    paddingHorizontal: Spacing.threeHalf,
    borderRadius: Radius.small,
  },
  checkboxCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.control,
  },
  copy: {
    flex: 1,
  },
  // Arabic titles line up with their English subtitles, as in Figma.
  title: {
    textAlign: 'left',
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 1.5,
  },
  radio: {
    borderRadius: INDICATOR_SIZE / 2,
  },
  checkbox: {
    borderRadius: Radius.check,
  },
  mark: {
    position: 'absolute',
    top: -1.5,
    start: -1.5,
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
