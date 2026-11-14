import { StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Spacing } from '@/constants/theme';

type TextLinkProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  /** What the link opens, read out by screen readers. */
  accessibilityLabel: string;
  emphasis?: 'medium' | 'strong';
  /** Looks like a link but isn't one, for inside a card that is already the tap target. */
  inert?: boolean;
};

/** Brand-coloured text with a chevron, like "See all" or "Join". */
export function TextLink({ label, emphasis = 'medium', inert = false, ...rest }: TextLinkProps) {
  const content = (
    <>
      <ThemedText type={emphasis === 'strong' ? 'label' : 'link'} themeColor="brand">
        {label}
      </ThemedText>
      <Icon name="chevron-end" size={16} color="brand" />
    </>
  );
  if (inert) {
    return (
      <View style={styles.link} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {content}
      </View>
    );
  }
  return (
    <Tappable accessibilityRole="button" hitSlop={{ top: 4, bottom: 4 }} style={styles.link} {...rest}>
      {content}
    </Tappable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
  },
});
