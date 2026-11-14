import { useState } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { rvmBottleXml, rvmCanXml, rvmCartonOffXml, rvmGlassOffXml, rvmSquashedOffXml } from '@/constants/plastic-art';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { RVM } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

type Show = 'bring' | 'leave';

const ICONS: Record<string, string> = {
  bottles: rvmBottleXml,
  cans: rvmCanXml,
  glass: rvmGlassOffXml,
  cartons: rvmCartonOffXml,
  squashed: rvmSquashedOffXml,
};

// Figma: smart animate 300 ms, bezier 0.22,1,0.36,1 (the "state" transition).
const EASE = Easing.bezier(...Motion.transition.state.easing);
const DURATION = Motion.transition.state.duration;

// Figma segment padding and gap (4 px each).
const SEGMENT_INSET = Spacing.one;

/**
 * Figma "RVM accepts" (835:12760): a Bring / Leave at home segmented control over the matching tiles. Bring shows
 * green-tinted tiles, Leave at home grey tiles with a red slash. The white thumb slides between the two halves.
 */
export function RvmAccepts() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState<Show>('bring');
  // Only a switch fades the tiles in; the first ones are simply there.
  const [switched, setSwitched] = useState(false);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const thumbWidth = Math.max((segmentWidth - SEGMENT_INSET * 3) / 2, 0);
  const offset = show === 'leave' ? thumbWidth + SEGMENT_INSET : 0;
  const choose = (next: Show) => {
    if (next !== show) setSwitched(true);
    setShow(next);
  };
  const items = show === 'bring' ? RVM.bring : RVM.leave;

  const thumbStyle = useAnimatedStyle(() => {
    const x = I18nManager.isRTL ? -offset : offset;
    return {
      transform: [{ translateX: reducedMotion ? x : withTiming(x, { duration: DURATION, easing: EASE }) }],
    };
  }, [offset, reducedMotion]);

  return (
    <View style={styles.root}>
      <View
        accessibilityRole="tablist"
        style={[styles.segment, { backgroundColor: theme.askField }]}
        onLayout={(event) => setSegmentWidth(event.nativeEvent.layout.width)}>
        {segmentWidth > 0 && (
          <Animated.View style={[styles.thumb, { width: thumbWidth, backgroundColor: theme.card }, thumbStyle]} />
        )}
        <Segment label="Bring" selected={show === 'bring'} onPress={() => choose('bring')} />
        <Segment label="Leave at home" selected={show === 'leave'} onPress={() => choose('leave')} />
      </View>

      <Animated.View
        key={show}
        entering={reducedMotion || !switched ? undefined : FadeIn.duration(DURATION).easing(EASE)}
        style={styles.items}
        accessibilityLabel={show === 'bring' ? 'Bring' : 'Leave at home'}>
        {items.map((item) => (
          <View
            key={item.id}
            accessible
            accessibilityLabel={show === 'bring' ? item.label : `${item.label}, not taken`}
            style={[styles.item, { backgroundColor: show === 'bring' ? BRING_TILE : LEAVE_TILE }]}>
            <SvgXml xml={ICONS[item.id]} width={32} height={32} />
            <ThemedText
              type="filterLabelTight"
              themeColor={show === 'bring' ? 'textStrong' : 'textWeak'}
              style={styles.itemLabel}>
              {item.label}
            </ThemedText>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// Figma tile tints with no matching token: Bring #EAF6EF, Leave at home #F2F4F5.
const BRING_TILE = '#EAF6EF';
const LEAVE_TILE = '#F2F4F5';

function Segment({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Tappable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      aria-selected={selected}
      onPress={onPress}
      style={styles.segmentButton}>
      <ThemedText type={selected ? 'toggle' : 'bodyMedium'} themeColor={selected ? 'textStrong' : 'textWeak'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.twoHalf,
  },
  // Figma Segment: #F1F4F5, 4 px padding and gap, 14 radius; each half 9 px above and below its 18 px label.
  segment: {
    flexDirection: 'row',
    gap: SEGMENT_INSET,
    padding: SEGMENT_INSET,
    borderRadius: Radius.medium,
  },
  thumb: {
    position: 'absolute',
    top: SEGMENT_INSET,
    bottom: SEGMENT_INSET,
    start: SEGMENT_INSET,
    borderRadius: Radius.control,
    boxShadow: '0px 1px 3px 0px rgba(18, 38, 46, 0.08)',
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
  },
  items: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  // Figma Item: 16 radius, 8 / 10 padding, 6 gap, 32 px icon over a Medium 12 label.
  item: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.option,
    overflow: 'hidden',
  },
  // Figma lets "Squashed bottles" run past its 77 px tile and clips it; here it wraps onto a second line instead.
  itemLabel: {
    textAlign: 'center',
  },
});
