import { type Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { ChoiceList } from '@/components/ui/choice-list';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { SheetHeader } from '@/components/ui/sheet-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { earthyIsLive } from '@/services/earthy-api';

// What people most often want from Earthy. Each goal is a real question sent to the live assistant,
// except sorting, which opens Know your waste (the guide, the scanner and the drop-off map).
const GOALS = [
  { id: 'ready', title: 'Get ready for my clean-up', body: 'When, where and what to bring', ask: 'When is my next clean-up, where is it and what should I bring?' },
  { id: 'sort', title: 'Sort an item', body: 'Open Know your waste', ask: '' },
  { id: 'heat', title: 'Stay safe in the heat', body: 'What to do on a hot day', ask: 'How do I stay safe in the heat at a clean-up?' },
] as const;

/**
 * Ask Earthy (sheet): the Earthy button on Home asks what you want to get done before anything starts,
 * so the microphone never opens by surprise. A goal is one tap; "Ask anything" types and the mic talks.
 * Added for the HackGlobal demo; Figma opens voice directly.
 */
export default function EarthyStartSheet() {
  const theme = useTheme();
  // Picking something hides the sheet at once, so it doesn't linger or fade over the screen that opens.
  const [leaving, setLeaving] = useState(false);

  function go(to: Href) {
    setLeaving(true);
    router.replace(to);
  }

  // Replace the sheet, so closing Earthy lands back on Home and not on this question.
  function type(ask?: string) {
    if (earthyIsLive) go(ask ? { pathname: '/earthy-live', params: { ask } } : '/earthy-live');
    else go('/earthy');
  }

  function choose(id: string) {
    const goal = GOALS.find((item) => item.id === id);
    if (!goal || goal.id === 'sort') go('/waste-guide');
    else type(goal.ask);
  }

  if (leaving) return null;

  return (
    <RouteSheet accessibilityLabel="Ask Earthy">
      <SheetHeader title="What do you need?" subtitle="Pick one, or ask in your own words" />
      <ChoiceList items={GOALS} onSelect={choose} />
      <View style={styles.ask}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Ask anything, type your question"
          onPress={() => type()}
          style={[styles.field, { backgroundColor: theme.card, borderColor: theme.strokeStrong }]}>
          <EarthyOrb state="idle" size={24} glow={false} />
          <ThemedText type="hintTight" themeColor="textWeak">
            Ask anything
          </ThemedText>
        </Tappable>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Talk to Earthy"
          onPress={() => go('/earthy-voice')}
          style={[styles.mic, { backgroundColor: theme.brand }]}>
          <Icon name="mic" size={22} color="textOnBrand" />
        </Tappable>
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 52,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  mic: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
});
