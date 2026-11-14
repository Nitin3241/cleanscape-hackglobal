import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/school/avatar-stack';
import { GradientBar } from '@/components/school/gradient-bar';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing, TabBarHeight, type ThemeColor } from '@/constants/theme';
import { CLASS, GROUP_LEAD, HERE, ON_THE_WAY } from '@/data/school.sample';
import { useTheme } from '@/hooks/use-theme';

/** DEMO: Figma's prototype moves on to the class impact by itself; this stands in for the cleanup ending. */
const IMPACT_AFTER = 3000; // Figma F3·7 → F3·8c: auto 3 s.

type Tab = 'here' | 'onTheWay';

/** F3·7: you're checked in, and who from the class is here or still on the way. */
export default function ClassCheckInRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('onTheWay');
  const people = tab === 'here' ? HERE : ON_THE_WAY;

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/class-impact'), IMPACT_AFTER);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Class check-in" subtitle="Kite Beach · live" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}>
        <View
          style={[styles.checkCard, { backgroundColor: theme.card, borderColor: theme.strokeWeak, boxShadow: Shadows.rideCard }]}>
          <View style={styles.you} accessibilityLiveRegion="polite">
            <View style={[styles.tick, { backgroundColor: theme.checkedIn }]}>
              <Icon name="check" size={20} color="textOnBrand" strokeWidth={2.5} />
            </View>
            <View style={styles.youText}>
              <ThemedText type="sheetPrompt" accessibilityRole="header">
                {"You're checked in"}
              </ThemedText>
              <ThemedText type="caption" themeColor="textWeak">
                6:44 AM · Blue flag, Gate 2
              </ThemedText>
            </View>
          </View>
          <View style={[styles.rule, { backgroundColor: theme.strokeWeak }]} />
          <View style={styles.classRow}>
            <View style={styles.count}>
              <ThemedText type="etaTitle">{`${CLASS.joined}`}</ThemedText>
              <ThemedText type="note" themeColor="textWeak">
                {`of ${CLASS.size} from ${CLASS.name} here`}
              </ThemedText>
            </View>
            <View style={styles.live}>
              <View style={[styles.liveDot, { backgroundColor: theme.textAccent }]} />
              <ThemedText type="tag" themeColor="textAccent">
                Live
              </ThemedText>
            </View>
          </View>
          <GradientBar
            progress={CLASS.joined / CLASS.size}
            colors={['#1E6280', '#5FB3C9']}
            label={`${CLASS.joined} of ${CLASS.size} from ${CLASS.name} are here`}
          />
          <View style={styles.coming}>
            <AvatarStack people={ON_THE_WAY} size={26} />
            <ThemedText type="caption" themeColor="textWeak">
              Maya, Jad and Noor are on the way
            </ThemedText>
          </View>
        </View>

        <View style={[styles.headsUp, { backgroundColor: theme.accentSubtle }]} accessibilityRole="alert">
          <Icon name="alarm" size={18} color="textAccent" strokeWidth={1.5} />
          <ThemedText type="filterLabel" themeColor="textAccent" style={styles.headsUpText}>
            {`Clean-up starts in 12 min. Meet ${GROUP_LEAD.name.split(' ')[0]} at the blue flag.`}
          </ThemedText>
        </View>

        <View style={[styles.segmented, { backgroundColor: theme.fill }]} accessibilityRole="tablist">
          <Segment label={`Here · ${CLASS.joined}`} active={tab === 'here'} onPress={() => setTab('here')} />
          <Segment label={`On the way · ${ON_THE_WAY.length}`} active={tab === 'onTheWay'} onPress={() => setTab('onTheWay')} />
        </View>

        <View style={[styles.list, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          {people.map((person) => (
            <View key={person.initials} style={styles.person}>
              <Avatar initials={person.initials} tone={person.tone} size={36} ring="card" />
              <View style={styles.personText}>
                <ThemedText type="label">{person.name}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {person.note}
                </ThemedText>
              </View>
              {person.chip && <StatusChip {...person.chip} />}
            </View>
          ))}
          {tab === 'here' && (
            <ThemedText type="caption" themeColor="textWeak" style={styles.more}>
              {`and ${CLASS.joined - HERE.length} more`}
            </ThemedText>
          )}
        </View>
      </ScrollView>
      <TabBar active="events" />
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.segment, active && { backgroundColor: theme.card, boxShadow: Shadows.classCard }]}>
      <ThemedText type={active ? 'labelSmall' : 'bodyMedium'} themeColor={active ? 'textStrong' : 'textWeak'}>
        {label}
      </ThemedText>
    </Tappable>
  );
}

function StatusChip({ icon, label, tone }: { icon: IconName; label: string; tone: ThemeColor }) {
  const theme = useTheme();
  const onBrand = tone === 'fill';
  return (
    <View style={[styles.chip, { backgroundColor: theme[tone] }]}>
      <Icon name={icon} size={14} color={onBrand ? 'brand' : 'textStrong'} strokeWidth={1.5} />
      <ThemedText type="smallMedium" themeColor={onBrand ? 'brand' : 'textStrong'}>
        {label}
      </ThemedText>
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
  checkCard: {
    gap: Spacing.threeLess,
    padding: Spacing.threeHalf,
    borderWidth: 1,
    borderRadius: Radius.panel,
  },
  you: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  tick: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  youText: {
    flex: 1,
  },
  rule: {
    height: 1,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.oneHalf,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  coming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  headsUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  headsUpText: {
    flex: 1,
  },
  segmented: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.pill,
  },
  segment: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  list: {
    gap: Spacing.threeLess,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  personText: {
    flex: 1,
    gap: Spacing.half,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  more: {
    textAlign: 'center',
  },
});
