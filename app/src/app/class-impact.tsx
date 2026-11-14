import { useRef } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { GradientBar } from '@/components/school/gradient-bar';
import { ImpactChart } from '@/components/school/impact-chart';
import { Sparkline } from '@/components/school/sparkline';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Smiley } from '@/components/ui/smiley';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { ScreenInsight } from '@/components/earthy/insight';
import { TabBar } from '@/components/ui/tab-bar';
import { ticketArtXml } from '@/constants/illustrations';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { CLASS, IMPACT } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

/** F3·8c (v3): what the class removed together, by material, against last time and other classes. */
export default function ClassImpactRoute() {
  const tipTarget = useRef<ViewInstance>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toGo = IMPACT.goal - IMPACT.kg;
  const { smileys } = IMPACT;

  // Back goes to the class space, as in Figma (the check-in screen has been replaced).
  // Figma F3·8c: back goes to F3·4 Your class, past the pass and the live check-in underneath.
  const back = () => router.dismissTo('/class');

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title={`${CLASS.name}'s impact`} subtitle="Kite Beach · Sat 5 Dec" onBack={back} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + 110 }]}>
        <View
          ref={tipTarget}
          collapsable={false}
          style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.surface, boxShadow: Shadows.impactCard }]}>
          <View style={styles.art}>
            <SvgXml xml={ticketArtXml} width="100%" height={180} preserveAspectRatio="xMidYMid slice" />
            <View style={[styles.rank, { backgroundColor: theme.glass, borderColor: theme.glassStroke }]}>
              <Icon name="star" size={14} color="textStrong" strokeWidth={1.5} />
              <ThemedText type="tag">{IMPACT.rank}</ThemedText>
            </View>
          </View>
          <View style={styles.heroBody}>
            <ThemedText type="tag" themeColor="textWeak" style={styles.caps}>
              Together you removed
            </ThemedText>
            <View style={styles.numberRow} accessible accessibilityLabel={`${IMPACT.kg} kilograms, ${IMPACT.vsLast}`}>
              <View style={styles.number}>
                <ThemedText type="impactNumber">{`${IMPACT.kg}`}</ThemedText>
                <ThemedText type="screenTitle" themeColor="textWeak">
                  kg
                </ThemedText>
              </View>
              <View style={[styles.trend, { backgroundColor: theme.statusSuccessSubtle }]}>
                <Icon name="trend-up" size={12} color="statusSuccess" strokeWidth={2} />
                <ThemedText type="tag" themeColor="statusSuccess">
                  {IMPACT.vsLast}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="note" themeColor="textWeak">
              {`By ${IMPACT.people} of you · as heavy as ${IMPACT.bottles} bottles`}
            </ThemedText>
            <View style={styles.goal}>
              <View style={styles.rowBetween}>
                <ThemedText type="filterLabel" themeColor="textWeak">
                  {`Class goal · ${IMPACT.goal} kg`}
                </ThemedText>
                <ThemedText type="dateline" themeColor="brand">
                  {`${toGo} kg to go`}
                </ThemedText>
              </View>
              <GradientBar
                progress={IMPACT.kg / IMPACT.goal}
                colors={['#2A8FA8', '#FFB020']}
                height={10}
                label={`${IMPACT.kg} of ${IMPACT.goal} kilograms, ${toGo} to go`}
              />
            </View>
          </View>
        </View>

        <View
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.impactCard }]}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              What you picked up
            </ThemedText>
            <ThemedText type="filterLabel" themeColor="textWeak">
              {`${IMPACT.kg} kg total`}
            </ThemedText>
          </View>
          <ImpactChart materials={IMPACT.materials} />
        </View>

        <View
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.impactCard }]}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              Since last time
            </ThemedText>
            <ThemedText type="filterLabel" themeColor="textWeak">
              vs Oct
            </ThemedText>
          </View>
          {IMPACT.sinceLast.map((row, index) => (
            <View key={row.label}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: theme.strokeWeak }]} />}
              <View style={styles.trendRow} accessible accessibilityLabel={`${row.label}: ${row.detail}`}>
                <View>
                  <ThemedText type="label">{row.label}</ThemedText>
                  <ThemedText type="caption" themeColor="textWeak">
                    {row.detail}
                  </ThemedText>
                </View>
                <Sparkline points={row.points} />
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.share, { backgroundColor: theme.secondarySubtle }]}>
          <View style={styles.shareRow}>
            <Smiley size={36} />
            <View style={styles.shareText}>
              <ThemedText type="sheetPrompt" themeColor="textSecondary">
                {`+${smileys.earned} Smileys`}
              </ThemedText>
              <ThemedText type="caption">{smileys.note}</ThemedText>
            </View>
          </View>
          <View style={styles.tier}>
            <View style={styles.rowBetween}>
              <ThemedText type="filterLabel">{`${smileys.progress} / ${smileys.nextTier} to ${smileys.tierName}`}</ThemedText>
              <ThemedText type="filterLabel" themeColor="textSecondary">
                {`${smileys.nextTier - smileys.progress} to go`}
              </ThemedText>
            </View>
            <ProgressBar
              progress={smileys.progress / smileys.nextTier}
              tone="secondary"
              trackTone="card"
              label={`${smileys.progress} of ${smileys.nextTier} Smileys to ${smileys.tierName}`}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText type="labelLarge" accessibilityRole="header">
              {`Classes at ${CLASS.schoolShort}`}
            </ThemedText>
            {/* The full school ranking isn't designed yet. */}
            <ThemedText type="bodyMedium" themeColor="brand">
              All 12
            </ThemedText>
          </View>
          <View style={[styles.ranking, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
            {IMPACT.ranking.map((row) => (
              <View
                key={row.rank}
                accessible
                accessibilityLabel={`${row.rank}. ${row.name}, ${row.kg} kilograms`}
                style={[styles.rankRow, row.mine && { backgroundColor: theme.fill }]}>
                <ThemedText type="label" themeColor="textWeak" style={styles.rankNumber}>
                  {`${row.rank}`}
                </ThemedText>
                <ThemedText
                  type={row.mine ? 'label' : 'hint'}
                  themeColor={row.mine ? 'brand' : 'textStrong'}
                  style={styles.rankName}>
                  {row.name}
                </ThemedText>
                <ThemedText type="link">{`${row.kg} kg`}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <StickyFooter variant="glass">
        <View style={styles.footerButton}>
          <Button label="Share story" flat onPress={shareStory} />
        </View>
      </StickyFooter>
      <TabBar active="events" />
      <ScreenInsight id="class-impact" target={tipTarget} onAction={() => router.push('/impact-story')} />
    </View>
  );
}

/** Share story opens Earthy's caption writer (F9v2·15, 18 and over), as in Figma (13 Nov). */
function shareStory() {
  router.push({ pathname: '/earthy-chat', params: { start: 'caption' } });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  hero: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  art: {
    height: 121,
    overflow: 'hidden',
  },
  rank: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    start: Spacing.twoThreeQuarters,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  heroBody: {
    gap: Spacing.one,
    padding: Spacing.threeHalf,
  },
  caps: {
    textTransform: 'uppercase',
    letterSpacing: 0.66,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  number: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  goal: {
    gap: Spacing.two,
    marginTop: Spacing.threeHalf,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.twoThreeQuarters,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  share: {
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  shareText: {
    flex: 1,
  },
  tier: {
    gap: Spacing.oneHalf,
  },
  section: {
    gap: Spacing.twoHalf,
  },
  ranking: {
    padding: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.control,
  },
  rankNumber: {
    width: 14,
  },
  rankName: {
    flex: 1,
  },
  footerButton: {
    flex: 1,
  },
});
