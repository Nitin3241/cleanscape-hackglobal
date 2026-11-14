import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { VOTE } from '@/data/impact.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { showComingSoon } from '@/state/coming-soon';

/**
 * I8 Vote — where next? "Vote" shows I9 Vote result. SAMPLE: the vote closes at once and the counts are Figma's.
 */
export default function ImpactVoteRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [picked, setPicked] = useState<string>(VOTE.options[0].id);
  const [voted, setVoted] = useState(false);
  const bottom = PAIR_BAR_HEIGHT + insets.bottom + Spacing.three;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title={voted ? 'Next spot' : 'Where next?'} subtitle={voted ? VOTE.resultSubtitle : VOTE.subtitle} centred />
      {voted ? (
        <Animated.View key="result" entering={FadeIn.duration(300)} style={styles.flex}>
          <ScrollView contentContainerStyle={[styles.body, { paddingBottom: bottom }]}>
            <View style={styles.options}>
              {VOTE.options.map((option, index) => {
                const winner = index === 0;
                return (
                  <View
                    key={option.id}
                    style={[
                      styles.option,
                      styles.result,
                      winner ? { borderWidth: 2, borderColor: theme.brand } : { borderWidth: 1, borderColor: theme.strokeWeak },
                    ]}
                    accessible
                    accessibilityLabel={`${option.name}${winner ? ', winner' : ''}: ${option.share}%, ${option.votes} votes, ${option.distance} from you`}>
                    <View style={styles.top}>
                      <ThemedText type="reasonTitle" style={styles.line23}>
                        {option.name}
                      </ThemedText>
                      {winner && (
                        <View style={[styles.winner, { backgroundColor: theme.statusSuccessSubtle }]}>
                          <ThemedText type="smallMedium" themeColor="statusSuccess" style={styles.line17}>
                            Winner
                          </ThemedText>
                        </View>
                      )}
                      <View style={styles.flex} />
                      <ThemedText type="rowTitle" style={styles.line23}>{`${option.share}%`}</ThemedText>
                    </View>
                    <View style={[styles.track, { backgroundColor: theme.tileNeutral }]}>
                      <View
                        style={[
                          styles.bar,
                          { width: `${option.share}%`, backgroundColor: winner ? theme.brand : theme.textWeak },
                        ]}
                      />
                    </View>
                    <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
                      {`${option.votes} votes · ${option.distance} from you`}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
            <EarthyNote title={VOTE.result.title} body={VOTE.result.body} />
          </ScrollView>
        </Animated.View>
      ) : (
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: bottom }]}>
          <EarthyNote title={VOTE.earthy.title} body={VOTE.earthy.body} />
          <View accessibilityRole="radiogroup" style={styles.options}>
            {VOTE.options.map((option) => {
              const on = option.id === picked;
              return (
                <Tappable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${option.name}. ${option.note}. ${option.distance}`}
                  onPress={() => {
                    feedback.play('toggle.on');
                    setPicked(option.id);
                  }}
                  style={[
                    styles.option,
                    styles.choice,
                    on ? { borderWidth: 2, borderColor: theme.brand } : { borderWidth: 1, borderColor: theme.strokeWeak },
                  ]}>
                  <View
                    style={[
                      styles.radio,
                      on ? { borderWidth: 7, borderColor: theme.brand } : { borderWidth: 1.5, borderColor: theme.strokeChip },
                    ]}
                  />
                  <View style={styles.text}>
                    <ThemedText type="reasonTitle" style={styles.line23}>
                      {option.name}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
                      {option.note}
                    </ThemedText>
                  </View>
                  <ThemedText type="filterLabel" themeColor="textWeak" style={styles.line18}>
                    {option.distance}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
          <ThemedText type="caption" themeColor="textWeak" style={styles.line18}>
            {VOTE.turnout}
          </ThemedText>
        </ScrollView>
      )}

      <PairBar>
        {voted ? (
          <>
            <View style={styles.flex}>
              {/* Alerts aren't built yet: "Notify me" says "Coming soon". */}
              <Button label="Notify me" variant="secondary" flat onPress={() => showComingSoon()} />
            </View>
            <View style={styles.flex}>
              <Button label="Host it" flat onPress={() => router.push('/litter-radar')} />
            </View>
          </>
        ) : (
          <View style={styles.flex}>
            <Button
              label="Vote"
              flat
              onPress={() => {
                feedback.play('button.primary');
                setVoted(true);
              }}
            />
          </View>
        )}
      </PairBar>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma I8 / I9 at "normal" line height: 15 → 23, 12 → 18, 11 → 17.
  line23: {
    lineHeight: 23,
  },
  line18: {
    lineHeight: 18,
  },
  line17: {
    lineHeight: 17,
  },
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  options: {
    gap: Spacing.two,
  },
  option: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  result: {
    gap: Spacing.two,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  winner: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  track: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
});
