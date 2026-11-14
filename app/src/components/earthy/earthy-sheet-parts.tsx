import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Parts of the Earthy answer sheets (Figma F10·10e pattern, reused by IE1 and IE2): header, the tinted answer box
// with a "you asked" pill and two pill choices, the "Earthy can also" list and the ask field.

export function EarthySheetHeader({ subtitle }: { subtitle: string }) {
  return (
    <View style={styles.header}>
      <EarthyOrb size={36} state="still" glow={false} />
      <View>
        <ThemedText type="sheetPrompt" accessibilityRole="header" style={styles.title}>
          Earthy
        </ThemedText>
        <ThemedText type="meta13" themeColor="textWeak">
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
}

/** The tinted answer box (#EEF6F9, 20 px corners, 16 × 14 padding, 12 gap). */
export function EarthyAnswer({ asked, children }: { asked?: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.answer, { backgroundColor: theme.hostTint }]}>
      {asked && (
        <View style={[styles.asked, { backgroundColor: theme.card }]}>
          <ThemedText type="fieldLabel" themeColor="brand" style={styles.askedText}>
            {asked}
          </ThemedText>
        </View>
      )}
      {children}
    </View>
  );
}

type Choice = { label: string; onPress?: () => void };

/** A filled and an outlined pill under an Earthy answer. */
export function EarthyChoices({ primary, secondary }: { primary: Choice; secondary: Choice }) {
  const theme = useTheme();
  return (
    <View style={styles.choices}>
      <Tappable accessibilityRole="button" accessibilityLabel={primary.label} onPress={primary.onPress} style={[styles.pill, { backgroundColor: theme.brand }]}>
        <ThemedText type="labelSmall" themeColor="textOnBrand">
          {primary.label}
        </ThemedText>
      </Tappable>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={secondary.label}
        onPress={secondary.onPress}
        style={[styles.pill, styles.outline, { backgroundColor: theme.card, borderColor: theme.brand }]}>
        <ThemedText type="labelSmall" themeColor="brand">
          {secondary.label}
        </ThemedText>
      </Tappable>
    </View>
  );
}

/** "Earthy can also": a white list of follow-up actions. Without an onPress each says "Coming soon". */
export function EarthyActions({ items }: { items: readonly { title: string; body: string; onPress?: () => void }[] }) {
  const theme = useTheme();
  return (
    <>
      <ThemedText type="labelSmall" themeColor="textWeak">
        Earthy can also
      </ThemedText>
      <View style={[styles.actions, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
        {items.map((item, index) => (
          <Tappable
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.body}`}
            onPress={item.onPress}
            style={[styles.action, index > 0 && { borderTopWidth: 1, borderTopColor: theme.strokeCard }]}>
            <View style={[styles.flex, styles.actionText]}>
              <ThemedText type="bodyMedium14">{item.title}</ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                {item.body}
              </ThemedText>
            </View>
            <Icon name="chevron-end" size={14} color="textStrong" />
          </Tappable>
        ))}
      </View>
    </>
  );
}

/** The grey ask field with a round send button. Typing to Earthy here isn't built yet: says "Coming soon". */
export function EarthyAskField({ placeholder, onPress }: { placeholder: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Tappable accessibilityRole="button" accessibilityLabel={placeholder} onPress={onPress} style={[styles.ask, { backgroundColor: theme.loaderCard }]}>
      <ThemedText type="hintTight" themeColor="textPlaceholder" style={styles.flex}>
        {placeholder}
      </ThemedText>
      <View style={[styles.send, { backgroundColor: theme.brand }]}>
        <Icon name="arrow-up" size={18} color="textOnBrand" strokeWidth={2.25} />
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  // Figma F10·10e header title: 18 semibold at 26.
  title: {
    lineHeight: 26,
  },
  // Figma "You asked" pill: 32 tall (6 + 20 + 6).
  askedText: {
    lineHeight: 20,
  },
  actionText: {
    gap: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  answer: {
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  asked: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.medium,
  },
  choices: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: 18,
  },
  outline: {
    borderWidth: 1.25,
  },
  actions: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Spacing.four,
  },
  send: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
});
