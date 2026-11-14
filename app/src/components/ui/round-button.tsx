import { StyleSheet } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** White round header button with a soft shadow (Figma AI/Icon button), for white pages where glass would vanish. */
export function RoundButton({
  icon,
  label,
  onPress,
  outlined = false,
  iconSize = 20,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  /** Figma chat header (F9v2): white 60% with a 1 px #E3E8EB edge and no shadow. */
  outlined?: boolean;
  iconSize?: number;
}) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={[
        styles.round,
        outlined
          ? { backgroundColor: theme.glassOnMap, borderWidth: 1, borderColor: theme.strokeWeak }
          : { backgroundColor: theme.card, boxShadow: Shadows.chip },
      ]}>
      <Icon name={icon} size={iconSize} color="textStrong" strokeWidth={1.75} />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
