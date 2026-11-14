import { ComponentRef, useRef } from 'react';
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PADDING_ROWS = (VISIBLE_ROWS - 1) / 2;

type WheelColumnProps = {
  /** What the column picks, read out by screen readers. */
  label: string;
  items: readonly string[];
  index: number;
  onChange: (index: number) => void;
  /** Figma Onb 06 sizes the columns 80 / 90 / 80 rather than splitting the width evenly. */
  width?: number;
};

/** One scrolling column of a date wheel. The middle row is the selected one. */
export function WheelColumn({ label, items, index, onChange, width }: WheelColumnProps) {
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);

  function scrollTo(next: number, animated: boolean) {
    scroller.current?.scrollTo({ y: next * ROW_HEIGHT, animated });
  }

  return (
    <View
      style={width ? { width } : styles.column}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: items[index] }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const step = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        const next = Math.min(Math.max(index + step, 0), items.length - 1);
        onChange(next);
        scrollTo(next, false);
      }}>
      <ScrollView
        ref={scroller}
        showsVerticalScrollIndicator={false}
        snapToInterval={ROW_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        onLayout={() => scrollTo(index, false)}
        onScroll={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.y / ROW_HEIGHT);
          const clamped = Math.min(Math.max(next, 0), items.length - 1);
          if (clamped !== index) onChange(clamped);
        }}>
        {items.map((item, itemIndex) => (
          <View key={item} style={styles.row}>
            <ThemedText
              type={itemIndex === index ? 'wheelSelected' : 'wheel'}
              themeColor={itemIndex === index ? 'textStrong' : 'textWeak'}
              maxFontSizeMultiplier={1.2}>
              {item}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** The frame and highlight band that holds wheel columns. */
export function DateWheel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();

  return (
    <View style={[styles.wheel, style]}>
      <View style={[styles.band, { backgroundColor: theme.fill }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: {
    height: ROW_HEIGHT * VISIBLE_ROWS,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: ROW_HEIGHT * PADDING_ROWS,
    start: 0,
    end: 0,
    height: ROW_HEIGHT,
    borderRadius: Radius.small,
  },
  column: {
    flex: 1,
  },
  content: {
    paddingVertical: ROW_HEIGHT * PADDING_ROWS,
  },
  row: {
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
