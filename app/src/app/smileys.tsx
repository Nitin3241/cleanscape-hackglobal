import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/parts';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Smiley } from '@/components/ui/smiley';
import { ScreenInsight } from '@/components/earthy/insight';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Gradients, Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { BADGES, CLASS_SMILEYS, HOURS, OFFER_FILTERS, OFFERS, SMILEYS } from '@/data/smileys.sample';
import { useTheme } from '@/hooks/use-theme';
import { useTabSkeleton } from '@/state/tab-entry';

const fmt = (n: number) => n.toLocaleString('en-US');

/** F7·1: Smileys home. Balance and level, verified hours, the class total, sponsor offers and badges. */
export default function SmileysRoute() {
  const tipTarget = useRef<ViewInstance>(null);
  const theme = useTheme();
  // Figma F7·1 · Skeleton (9 Nov): 0.5 s skeleton when you arrive from the Smileys tab.
  const loading = useTabSkeleton('/smileys');
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<(typeof OFFER_FILTERS)[number]>('All');
  const offers = OFFERS.filter((offer) => filter === 'All' || offer.category === filter);
  const toNext = SMILEYS.nextLevelAt - SMILEYS.balance;
  const earned = BADGES.filter((badge) => badge.earned);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <LinearGradient {...Gradients.header} style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <ThemedText type="heading" themeColor="textOnBrand" accessibilityRole="header">
          Smileys
        </ThemedText>
        {/* "Learn more" isn't designed yet. */}
        <ThemedText type="bodyMedium" themeColor="textOnBrand">
          Learn more
        </ThemedText>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}
        showsVerticalScrollIndicator={false}>
        <Skeleton loading={loading} radius={Radius.panel} lines="card">
          <View ref={tipTarget} collapsable={false}>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel={`Your Smileys: ${fmt(SMILEYS.balance)}. Level ${SMILEYS.level}, ${SMILEYS.levelName}. ${toNext} to Level ${SMILEYS.level + 1}. See badges and levels`}
              onPress={() => router.push('/smileys-badges')}
              style={[styles.balanceShadow, { boxShadow: Shadows.ticket }]}>
              <LinearGradient {...Gradients.ticket} style={styles.balance}>
                <View style={styles.balanceTop}>
                  <Smiley size={48} />
                  <View>
                    <ThemedText type="note" themeColor="textOnBrandWeak">
                      Your Smileys
                    </ThemedText>
                    <ThemedText type="impactNumber" themeColor="textOnBrand" style={styles.balanceNumber}>
                      {fmt(SMILEYS.balance)}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.rowBetween}>
                  <ThemedText
                    type="labelSmall"
                    themeColor="textOnBrand">{`Level ${SMILEYS.level} · ${SMILEYS.levelName}`}</ThemedText>
                  <ThemedText type="caption" themeColor="textOnBrandWeak">{`${toNext} to Level ${SMILEYS.level + 1}`}</ThemedText>
                </View>
                <ProgressBar
                  progress={SMILEYS.balance / SMILEYS.nextLevelAt}
                  tone="secondary"
                  trackTone="glassOnBrand"
                  label={`${toNext} Smileys to the next level`}
                />
                <View style={styles.perks}>
                  <Perk icon="alarm" text={SMILEYS.streak} />
                  <Perk icon="shield-check" text={SMILEYS.perk} />
                </View>
              </LinearGradient>
            </Tappable>
          </View>
        </Skeleton>

        <Skeleton loading={loading} order={1} lines="card">
          <View style={[styles.card, { borderColor: theme.strokeWeak }]}>
            <View style={styles.cardHead}>
              <IconTile icon="clock" size={40} iconSize={20} tone="statusSuccessSubtle" color="statusSuccess" />
              <View style={styles.flex}>
                <ThemedText type="sheetPrompt">{`${HOURS.verified} h verified`}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  Volunteer hours
                </ThemedText>
              </View>
              {/* The certificate (F4 "hours & certificate") has no frame yet. */}
              <ThemedText type="labelSmall" themeColor="brand">
                Certificate
              </ThemedText>
            </View>
            <HoursRow label={HOURS.school.label} goal={HOURS.school.goal} tone="statusSuccess" />
            <HoursRow label={HOURS.goldenVisa.label} goal={HOURS.goldenVisa.goal} tone="avatarTeal" />
            <ThemedText type="caption" themeColor="textWeak">
              {HOURS.note}
            </ThemedText>
          </View>
        </Skeleton>

        <Skeleton loading={loading} order={2} lines="card">
          <View style={[styles.card, { borderColor: theme.strokeWeak }]}>
            <View style={styles.cardHead}>
              <IconTile icon="users" size={40} iconSize={20} />
              <View style={styles.flex}>
                <ThemedText type="sheetPrompt">{CLASS_SMILEYS.name}</ThemedText>
                <ThemedText
                  type="caption"
                  themeColor="textWeak">{`${CLASS_SMILEYS.total} Smileys · ${CLASS_SMILEYS.rank}`}</ThemedText>
              </View>
              <View style={[styles.fromYou, { backgroundColor: theme.secondarySubtle }]}>
                <ThemedText type="smallMedium" themeColor="textSecondary">{`+${CLASS_SMILEYS.fromYou} from you`}</ThemedText>
              </View>
            </View>
            <View style={styles.rowBetween}>
              <ThemedText type="note">{`Class goal · ${CLASS_SMILEYS.goal}`}</ThemedText>
              <ThemedText type="labelSmall">{`${CLASS_SMILEYS.percent}%`}</ThemedText>
            </View>
            <ProgressBar progress={CLASS_SMILEYS.percent / 100} label={`${CLASS_SMILEYS.percent}% of the class goal`} />
          </View>
        </Skeleton>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              Spend at sponsor shops
            </ThemedText>
            {/* The full shop list isn't designed yet. */}
            <ThemedText type="bodyMedium" themeColor="brand">
              See all
            </ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {OFFER_FILTERS.map((option) => (
              <ChoiceChip key={option} label={option} selected={filter === option} onPress={() => setFilter(option)} />
            ))}
          </ScrollView>
          <View style={styles.offers}>
            {offers.map((offer) => (
              <Tappable
                key={offer.key}
                accessibilityRole="button"
                accessibilityLabel={`${offer.title} at ${offer.shop}, ${offer.cost} Smileys`}
                // Only the juice reward has a detail screen in Figma (F7·3).
                disabled={offer.key !== 'juice'}
                onPress={() => router.push('/smileys-reward')}
                style={[styles.offer, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
                <IconTile icon={offer.icon} size={44} iconSize={22} tone={offer.tone} color="textStrong" />
                <ThemedText type="label">{offer.title}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {offer.shop}
                </ThemedText>
                <View style={styles.cost}>
                  <Smiley size={18} />
                  <ThemedText type="labelSmall" themeColor="textSecondary">{`${offer.cost}`}</ThemedText>
                </View>
              </Tappable>
            ))}
            {offers.length === 0 && (
              <ThemedText type="note" themeColor="textWeak">
                No offers here yet. New ones arrive every week.
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">{`Badges · ${earned.length} of 12`}</ThemedText>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="See all badges"
              onPress={() => router.push('/smileys-badges')}>
              <ThemedText type="bodyMedium" themeColor="brand">
                See all
              </ThemedText>
            </Tappable>
          </View>
          <View style={styles.badgeRow}>
            {earned.map((badge) => (
              <View
                key={badge.name}
                style={[styles.badge, { backgroundColor: theme[badge.tone] }]}
                accessible
                accessibilityLabel={`${badge.name} badge`}>
                <Icon name={badge.icon} size={22} color={badge.color} strokeWidth={1.5} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TabBar active="smileys" />
      <ScreenInsight id="smileys" target={tipTarget} onAction={() => router.push('/events')} />
    </View>
  );
}

function Perk({ icon, text }: { icon: 'alarm' | 'shield-check'; text: string }) {
  return (
    <View style={styles.perk}>
      <Icon name={icon} size={14} color="secondary" strokeWidth={1.5} />
      <ThemedText type="smallMedium" themeColor="textOnBrand">
        {text}
      </ThemedText>
    </View>
  );
}

function HoursRow({ label, goal, tone }: { label: string; goal: number; tone: 'statusSuccess' | 'avatarTeal' }) {
  return (
    <View style={styles.hoursRow}>
      <View style={styles.rowBetween}>
        <ThemedText type="note">{label}</ThemedText>
        <ThemedText type="labelSmall">{`${HOURS.verified} / ${goal} h`}</ThemedText>
      </View>
      <ProgressBar progress={HOURS.verified / goal} tone={tone} label={`${label}: ${HOURS.verified} of ${goal} hours`} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  balanceShadow: {
    borderRadius: Radius.panel,
  },
  balance: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeHalf,
    borderRadius: Radius.panel,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  balanceNumber: {
    fontSize: 34,
    lineHeight: 42,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perks: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: Radius.small,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  card: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  flex: {
    flex: 1,
  },
  hoursRow: {
    gap: Spacing.oneHalf,
  },
  fromYou: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  filters: {
    gap: Spacing.two,
  },
  offers: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  offer: {
    flex: 1,
    gap: Spacing.one,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  cost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.twoHalf,
  },
  badge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
});
