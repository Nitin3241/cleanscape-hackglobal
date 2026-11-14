import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActionButtonProps = {
  icon: IconName;
  label: string;
  /** marigold: Add to Wallet. added: already in Wallet. outline: Directions, Invite friends. */
  tone: 'marigold' | 'added' | 'outline';
  disabled?: boolean;
  onPress: () => void;
};

/** The half-width actions under a pass (Figma "Action: …"). Use two side by side. */
export function ActionButton({ icon, label, tone, disabled, onPress }: ActionButtonProps) {
  const theme = useTheme();
  const surface = {
    marigold: { backgroundColor: theme.secondary, borderColor: theme.secondary },
    added: { backgroundColor: theme.secondaryContainer, borderColor: theme.secondary },
    outline: { backgroundColor: theme.card, borderColor: theme.strokeControl },
  }[tone];
  const textColor = tone === 'outline' ? 'brand' : 'textStrong';

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[styles.action, surface]}>
      <Icon name={icon} size={18} color={textColor} strokeWidth={1.75} />
      <ThemedText type="link" themeColor={textColor}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
});
