import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

type Choice = { id: string; title: string; body: string };

/**
 * A white card of rows with a title and a line under it (Figma 13 Nov list pattern, 24 px corners).
 * `selected` turns the rows into a radio group (22 px radios); without it each row is a link with a chevron.
 */
export function ChoiceList({
  items,
  selected,
  onSelect,
}: {
  items: readonly Choice[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();
  const radio = selected !== undefined;
  return (
    <View
      accessibilityRole={radio ? 'radiogroup' : undefined}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWarm }]}>
      {items.map((item, index) => {
        const on = item.id === selected;
        return (
          <Tappable
            key={item.id}
            accessibilityRole={radio ? 'radio' : 'button'}
            accessibilityState={radio ? { selected: on } : undefined}
            accessibilityLabel={item.body ? `${item.title}. ${item.body}` : item.title}
            onPress={() => {
              if (radio) feedback.play('toggle.on');
              onSelect(item.id);
            }}
            style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeWarm }]}>
            <View style={styles.text}>
              <ThemedText style={FigmaLines.l23} type="reasonTitle">
                {item.title}
              </ThemedText>
              {item.body ? (
                <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
                  {item.body}
                </ThemedText>
              ) : null}
            </View>
            {radio ? (
              <View
                style={[
                  styles.radio,
                  on ? { borderWidth: 7, borderColor: theme.brand } : { borderWidth: 1.5, borderColor: theme.strokeChip },
                ]}
              />
            ) : (
              <Icon name="chevron-end" size={16} color="textWeak" strokeWidth={2} />
            )}
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
