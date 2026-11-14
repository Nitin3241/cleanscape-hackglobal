import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { BADGES, CURRENT_LEVEL_INDEX, LEVELS, SMILEYS } from '@/data/smileys.sample';
import { useTheme } from '@/hooks/use-theme';

const fmt = (n: number) => n.toLocaleString('en-US');

/** F7·2: the level ladder (Seed to Mangrove) and all twelve badges, earned and still to earn. */
export default function SmileysBadgesRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const earned = BADGES.filter((badge) => badge.earned).length;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Badges & levels" subtitle={`Level ${SMILEYS.level} · ${earned} of 12 badges`} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { borderColor: theme.strokeWeak }]}>
          <View style={styles.rowBetween}>
            <ThemedText type="sheetPrompt" accessibilityRole="header">
              {SMILEYS.levelName}
            </ThemedText>
            <ThemedText type="labelSmall">{`${fmt(SMILEYS.balance)} / ${fmt(SMILEYS.nextLevelAt)}`}</ThemedText>
          </View>
          <View
            style={styles.ladder}
            accessible
            accessibilityLabel={`Levels: ${LEVELS.join(', ')}. You are at ${LEVELS[CURRENT_LEVEL_INDEX]}.`}>
            <View style={[styles.ladderLine, { backgroundColor: theme.track }]} />
            <View style={[styles.ladderLine, styles.ladderDone, { backgroundColor: theme.brand, width: `${(CURRENT_LEVEL_INDEX / (LEVELS.length - 1)) * 80}%` }]} />
            {LEVELS.map((level, index) => {
              const done = index < CURRENT_LEVEL_INDEX;
              const current = index === CURRENT_LEVEL_INDEX;
              return (
                <View key={level} style={styles.step}>
                  <View
                    style={[
                      styles.node,
                      done && { backgroundColor: theme.brand, borderColor: theme.brand },
                      current && { backgroundColor: theme.secondary, borderColor: theme.textPaper, width: 26, height: 26, borderRadius: 13 },
                      !done && !current && { backgroundColor: theme.card, borderColor: theme.strokeControl },
                    ]}
                  />
                  <ThemedText type={current ? 'labelSmall' : 'caption'} themeColor={current ? 'textStrong' : 'textWeak'}>
                    {level}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          <ThemedText type="caption" themeColor="textWeak">{`${SMILEYS.nextLevelAt - SMILEYS.balance} more Smileys to reach ${LEVELS[CURRENT_LEVEL_INDEX + 1]}`}</ThemedText>
        </View>

        <ThemedText type="labelLarge" accessibilityRole="header">
          Badges
        </ThemedText>
        <View style={styles.grid}>
          {BADGES.map((badge) => (
            <View
              key={badge.name}
              accessible
              accessibilityLabel={`${badge.name}, ${badge.note}${badge.earned ? '' : ', not earned yet'}`}
              style={[styles.badge, { borderColor: theme.strokeWeak }]}>
              <View style={[styles.badgeIcon, { backgroundColor: theme[badge.tone] }]}>
                <Icon name={badge.icon} size={24} color={badge.color} strokeWidth={1.5} />
                {!badge.earned && (
                  <View style={[styles.lock, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
                    <Icon name="lock" size={10} color="textWeak" strokeWidth={2} />
                  </View>
                )}
              </View>
              <ThemedText type="labelSmall" style={styles.centred} themeColor={badge.earned ? 'textStrong' : 'textWeak'}>
                {badge.name}
              </ThemedText>
              <ThemedText type="caption" themeColor="textWeak" style={styles.centred}>
                {badge.note}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
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
    gap: Spacing.three,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ladder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ladderLine: {
    position: 'absolute',
    top: 11,
    start: '10%',
    end: '10%',
    height: 3,
    borderRadius: 2,
  },
  ladderDone: {
    end: undefined,
  },
  step: {
    width: '20%',
    alignItems: 'center',
    gap: Spacing.one,
  },
  node: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderWidth: 2,
    borderRadius: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.twoHalf,
  },
  badge: {
    width: '31%',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.threeLess,
    paddingHorizontal: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  badgeIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
    borderRadius: 26,
  },
  lock: {
    position: 'absolute',
    end: -2,
    bottom: -2,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9,
  },
  centred: {
    textAlign: 'center',
  },
});
