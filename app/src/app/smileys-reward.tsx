import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconTile } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Smiley } from '@/components/ui/smiley';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { JUICE, SMILEYS } from '@/data/smileys.sample';
import { useTheme } from '@/hooks/use-theme';

const fmt = (n: number) => n.toLocaleString('en-US');

/** F7·3: a sponsor reward and how redeeming works. Smileys are non-cash. */
export default function SmileysRewardRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const left = SMILEYS.balance - JUICE.cost;
  const enough = left >= 0;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Fresh juice" subtitle={`${JUICE.shopShort} · ${JUICE.category}`} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, styles.hero, { borderColor: theme.strokeWeak }]}>
          <IconTile icon="cup" size={72} iconSize={30} tone="secondarySubtle" color="textPaper" />
          <ThemedText type="etaTitle" accessibilityRole="header">
            {JUICE.title}
          </ThemedText>
          <ThemedText type="note" themeColor="textWeak">
            {JUICE.shop}
          </ThemedText>
          <View style={[styles.price, { backgroundColor: theme.secondarySubtle }]}>
            <Smiley size={22} />
            <ThemedText type="labelLarge" themeColor="textSecondary">{`${JUICE.cost} Smileys`}</ThemedText>
          </View>
          <ThemedText type="caption" themeColor={enough ? 'textWeak' : 'textAccent'}>
            {enough ? `You have ${fmt(SMILEYS.balance)} · ${fmt(left)} left after` : `You need ${fmt(-left)} more Smileys`}
          </ThemedText>
        </View>

        <View style={[styles.card, { borderColor: theme.strokeWeak }]}>
          <ThemedText type="labelLarge" accessibilityRole="header">
            How it works
          </ThemedText>
          {JUICE.steps.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <View style={[styles.number, { backgroundColor: theme.fill }]}>
                <ThemedText type="labelSmall" themeColor="brand">{`${index + 1}`}</ThemedText>
              </View>
              <View style={styles.flex}>
                <ThemedText type="label">{step.title}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {step.note}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.where, { borderColor: theme.strokeWeak }]}>
          <IconTile icon="pin" size={36} iconSize={18} />
          <View style={styles.flex}>
            <ThemedText type="label">{JUICE.where}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {JUICE.rule}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.card, boxShadow: Shadows.stickyFooter, paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <Button label="Redeem" size="large" disabled={!enough} onPress={() => router.replace('/smileys-voucher')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  card: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  number: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  flex: {
    flex: 1,
  },
  where: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
});
