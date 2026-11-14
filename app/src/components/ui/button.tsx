import { ReactNode } from 'react';
import { StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { feedback, type FeedbackEvent } from '@/feedback';
import { showComingSoon } from '@/state/coming-soon';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  /** `outline` is the 52 px bordered style used on sign-in. */
  variant?: 'primary' | 'secondary' | 'outline';
  /** `large` is the 52 px flat button used on splash and onboarding screens. */
  size?: 'default' | 'large';
  icon?: IconName;
  /** Artwork before the label, for logos that aren't line icons. */
  leading?: ReactNode;
  /** No shadow, as on event and map screens. */
  flat?: boolean;
  /** Fully rounded, as in Ask Earthy and on event detail. */
  pill?: boolean;
  /** Plays instead of the usual primary press, for buttons with their own moment. */
  feedbackEvent?: FeedbackEvent;
};

/** Full-width button (Figma component `Button`). */
export function Button({
  label,
  variant = 'primary',
  size = 'default',
  icon,
  leading,
  flat = false,
  pill = false,
  feedbackEvent,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isLarge = size === 'large' || isOutline;

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={[
        styles.button,
        isLarge && styles.large,
        isPrimary && { backgroundColor: theme.brand },
        isPrimary && !isLarge && !flat && { boxShadow: Shadows.buttonPrimary },
        pill && styles.pill,
        variant === 'secondary' && {
          backgroundColor: theme.card,
          borderColor: theme.brand,
          borderWidth: 1.5,
          ...(!flat && { boxShadow: Shadows.buttonSecondary }),
        },
        isOutline && {
          backgroundColor: theme.card,
          borderColor: theme.strokeStrong,
          borderWidth: 1,
          gap: Spacing.twoHalf,
        },
      ]}
      onPress={(event) => {
        // No action yet means the screen isn't built: say so instead of doing nothing.
        if (!onPress) {
          showComingSoon();
          return;
        }
        // The action goes first, so any feedback of its own wins over the plain press.
        onPress(event);
        if (feedbackEvent) feedback.play(feedbackEvent);
        else if (isPrimary) feedback.play('button.primary');
      }}
      {...rest}>
      {leading}
      {icon && <Icon name={icon} size={18} color={isPrimary ? 'textOnBrand' : 'brand'} />}
      <ThemedText
        // Figma Button (3:23 / 3:25): Primary and Secondary labels are both 15 semibold.
        type="buttonPrimary"
        themeColor={isPrimary ? 'textOnBrand' : isOutline ? 'textStrong' : 'brand'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.threeHalf,
    borderRadius: Radius.small,
  },
  large: {
    minHeight: 52,
  },
  pill: {
    borderRadius: 24,
  },
});
