import { StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tappable } from '@/components/ui/tappable';
import { ThemeColor } from '@/constants/theme';

type TextButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  color?: ThemeColor;
};

/** Centred text-only action, like "Use email instead" or "Not now". */
export function TextButton({ label, color = 'brand', disabled, ...rest }: TextButtonProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      style={styles.button}
      {...rest}>
      <ThemedText type="label" themeColor={color}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
});
