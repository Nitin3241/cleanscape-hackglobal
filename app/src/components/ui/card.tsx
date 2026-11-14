import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = {
  children: ReactNode;
  /** Makes the whole card one button. Give it a label that says what it opens. */
  onPress?: () => void;
  accessibilityLabel?: string;
  /** Inner spacing. Pass 0 for cards with edge-to-edge artwork. */
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

/** Handoff card: white, 1 px #E3E8EB border, radius 18 and a soft shadow. */
export function Card({ children, onPress, accessibilityLabel, padding = Spacing.three, style }: CardProps) {
  const theme = useTheme();
  const look = [
    styles.card,
    { padding, backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.card },
    style,
  ];

  if (!onPress) return <View style={look}>{children}</View>;
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={look}>
      {children}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.large,
  },
});
