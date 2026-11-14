import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatComposer, ChatHeader, composerClearance, SuggestionRow } from '@/components/earthy-chat/chat-chrome';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { GradientText } from '@/components/ui/gradient-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { earthyHomeGlowXml } from '@/constants/illustrations';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { EARTHY_HOME, type StepId } from '@/data/earthy-chat.sample';
import { useTheme } from '@/hooks/use-theme';
import { earthyIsLive } from '@/services/earthy-api';

const openChat = (start: StepId) => router.push({ pathname: '/earthy-chat', params: { start } });

const TILE_ICON_COLOR = { fill: 'brand', secondarySubtle: 'iconMarigold', statusSuccessSubtle: 'iconMarigold' } as const;

/**
 * F9v2·1 Earthy home: a greeting, today at a glance and starting suggestions. Each one opens its
 * answer screen (Close there comes back here). "Type instead" on the voice sheet lands here.
 */
export default function EarthyHomeRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const home = EARTHY_HOME;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      {/* Figma "Earthy glow": 560 × 360 at x −100, y 600 (the SVG adds 40 of blur on each side). */}
      <View style={styles.glow} pointerEvents="none" aria-hidden>
        <SvgXml xml={earthyHomeGlowXml} width={640} height={440} />
      </View>
      <ChatHeader home />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: composerClearance(insets.bottom) }]}
        showsVerticalScrollIndicator={false}>
        <EarthyOrb size={56} state="idle" glow={false} />
        <View style={styles.hello}>
          <GradientText text={home.greeting} size={30} lineHeight={44} />
          <ThemedText type="welcomeTitle" themeColor="strokeStrong" style={styles.prompt}>
            {home.prompt}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="tag" themeColor="textWeak">
            TODAY
          </ThemedText>
          {/* Figma: three 106 px tiles, 10 apart; the third runs off the edge, so the row scrolls sideways. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.todayScroll}
            contentContainerStyle={styles.today}>
            {home.today.map((item) => (
              <Tappable
                key={item.title}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${item.note}`}
                onPress={() => openChat(item.start)}
                style={[styles.tile, { backgroundColor: theme[item.tone] }]}>
                <Icon name={item.icon} size={20} color={TILE_ICON_COLOR[item.tone]} strokeWidth={2} />
                <ThemedText type="labelSmall" style={styles.tileTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText type="micro11" themeColor="textWeak" style={styles.tileNote}>
                  {item.note}
                </ThemedText>
              </Tappable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.suggestions}>
          {home.suggestions.map((suggestion) => (
            <SuggestionRow key={suggestion.label} large label={suggestion.label} onPress={() => openChat(suggestion.start)} />
          ))}
        </View>
      </ScrollView>
      {/* With the Earthy server set (HackGlobal), typing opens the live chat; without it, the scripted turn. */}
      <ChatComposer onAsk={() => (earthyIsLive ? router.push('/earthy-live') : openChat('didYouMean'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    start: -140,
    bottom: -200,
  },
  // Figma: one column 20 from the sides, 4 apart, the orb at y 124.
  content: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.threeHalf,
    paddingTop: Spacing.four,
  },
  hello: {
    gap: Spacing.half,
    paddingTop: Spacing.threeLess,
  },
  // "What can I sort for you?": 28 regular at 1.45 (Figma rounds each line to 41).
  prompt: {
    fontFamily: Fonts.regular,
    fontSize: 28,
    lineHeight: 41,
  },
  section: {
    gap: Spacing.twoHalf,
    paddingTop: 22,
  },
  todayScroll: {
    marginHorizontal: -Spacing.threeHalf,
  },
  today: {
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  // Figma tile: 82 px of text, 12 × 14 padding, 4 gap, 20 corners; each tile as tall as its text.
  tile: {
    width: 106,
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  // 13 semibold and 11 regular at 1.45, rounded per line as Figma draws them (19, 16).
  tileTitle: {
    lineHeight: 19,
  },
  tileNote: {
    lineHeight: 16,
  },
  suggestions: {
    paddingTop: Spacing.threeLess,
  },
});
