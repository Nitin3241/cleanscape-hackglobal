import { router } from 'expo-router';
import { I18nManager, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ChatComposer } from '@/components/earthy-chat/chat-chrome';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { BackButton } from '@/components/ui/back-button';
import { Tappable } from '@/components/ui/tappable';
import { followUpArrowXml, pizzaBaseXml, searchClearXml } from '@/constants/plastic-art';
import { Radius, Spacing } from '@/constants/theme';
import { BIN_LABEL, PIZZA } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRtlScope } from '@/state/language';

/** Figma F4·6 card and dot colours that have no theme token: the warm "black bin" card and its dark dot. */
const BASE_CARD = '#F1EEE8';
const BLACK_DOT = '#2F3A44';
const LID_SWATCH = '#E8C38A';

/**
 * F4·6: Earthy's answer for "pizza box" (Figma 447:10338). SAMPLE: the question and answer are
 * scripted for the demo; no model is called. Replace with Earthy's real answer when the assistant is live.
 */
export default function WasteAnswerRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const rtl = useRtlScope() || I18nManager.isRTL;
  const parts = PIZZA.parts;

  // Figma links the first follow-up to the scan (F4·7) and the last to green bins (F4·6g); the middle one has no link.
  const followUps = [
    { label: PIZZA.followUps[0], onPress: () => router.push('/waste-scan') },
    { label: PIZZA.followUps[1] },
    { label: PIZZA.followUps[2], onPress: () => router.push('/waste-bins') },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + Spacing.two }]}>
      <View style={styles.searchRow}>
        <BackButton />
        <View style={[styles.search, { backgroundColor: theme.tileNeutral }]}>
          <ThemedText type="answer14" style={styles.flex} numberOfLines={1}>
            {PIZZA.query}
          </ThemedText>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.clear}>
            <SvgXml xml={searchClearXml} width={10} height={10} />
          </Tappable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.from}>
          <EarthyOrb size={24} state="still" glow={false} />
          <ThemedText type="chipSelected" themeColor="textWeak">
            Earthy
          </ThemedText>
          {/* F9·S1: where the answer comes from. */}
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Source: EEG guide. See where this answer comes from"
            hitSlop={8}
            onPress={() => router.push('/earthy-source')}
            style={[styles.source, { backgroundColor: theme.fill }]}>
            <ThemedText type="chip" themeColor="brand">
              Source: EEG guide
            </ThemedText>
          </Tappable>
        </View>
        <ThemedText type="answer18" accessibilityLiveRegion="polite" style={styles.answer}>
          {PIZZA.answer}
        </ThemedText>

        <View style={styles.parts}>
          {parts.map((part) => {
            const black = part.bin === 'black';
            return (
              <View
                key={part.name}
                accessible
                accessibilityLabel={`${part.name}: ${BIN_LABEL[part.bin]}`}
                style={[styles.part, { backgroundColor: black ? BASE_CARD : theme.statusSuccessSubtle }]}>
                {black ? (
                  <SvgXml xml={pizzaBaseXml} width={64} height={44} style={styles.swatch} />
                ) : (
                  <View style={[styles.swatch, styles.lid]} />
                )}
                <ThemedText type="labelMedium14" style={styles.partName}>
                  {part.name}
                </ThemedText>
                <View style={[styles.bin, { backgroundColor: theme.card }]}>
                  <View style={[styles.dot, { backgroundColor: black ? BLACK_DOT : theme.checkedIn }]} />
                  <ThemedText type="binChip">{BIN_LABEL[part.bin]}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.tip, { backgroundColor: theme.tileNeutral }]}>
          <ThemedText type="meta" themeColor="textWeak">
            {PIZZA.tip}
          </ThemedText>
        </View>

        <View style={styles.followUps}>
          {followUps.map((item) => {
            const row = (
              <>
                <ThemedText type="body14">{item.label}</ThemedText>
                <SvgXml
                  xml={followUpArrowXml}
                  width={14}
                  height={12}
                  style={[styles.arrow, rtl && { transform: [{ scaleX: -1 }] }]}
                />
              </>
            );
            // Figma gives "What about coffee cups?" no link yet, so it is plain text, not a dead button.
            return item.onPress ? (
              <Tappable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={item.onPress}
                style={styles.followUp}>
                {row}
              </Tappable>
            ) : (
              <View key={item.label} style={styles.followUp}>
                {row}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Ask field → F9·S2 Ask the organiser (a question Earthy has no approved answer for). */}
      <ChatComposer elevated onAsk={() => router.push('/earthy-ask')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Figma: back 40 at x 16, search 276 × 40 at x 68, both at y 52.
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
  },
  search: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: Spacing.three,
    paddingEnd: 15,
    borderRadius: 20,
  },
  clear: {
    width: 10,
    height: 10,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
  },
  // Figma: orb at y 116, the Source pill pinned to the end at y 115.
  from: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  source: {
    marginStart: 'auto',
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  answer: {
    marginTop: Spacing.twoThreeQuarters,
  },
  // Figma: two 158 × 150 cards at y 256, 12 apart.
  parts: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
    marginTop: 23,
  },
  part: {
    flex: 1,
    height: 150,
    paddingTop: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeLess,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  swatch: {
    width: 64,
    height: 44,
    alignSelf: 'center',
  },
  lid: {
    borderRadius: 6,
    backgroundColor: LID_SWATCH,
  },
  partName: {
    marginTop: Spacing.threeLess,
  },
  bin: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    marginTop: 9,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Figma: 328 × 48 at y 422; the line runs on one row from x 12 (no end padding in the frame).
  tip: {
    height: 48,
    justifyContent: 'center',
    marginTop: Spacing.three,
    paddingStart: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  followUps: {
    marginTop: Spacing.four,
  },
  // Figma: 44 tall rows, the 12 × 10 arrow 2 px in from the end.
  followUp: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    marginEnd: 1,
  },
});
