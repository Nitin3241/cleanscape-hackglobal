import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { meetEarthyGlowXml } from '@/constants/onboarding-art';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ORB = 132;
const GLOW = 220;

/** Positions from Figma "Onb 02.4 — Meet Earthy AI", relative to the 312 × 240 slide area (frame x 24, y 150). */
const BUBBLES = [
  { text: '“What should I bring?”', style: { start: -4, top: -24 } },
  { text: '“Where does this bottle go?”', style: { start: 103, end: -4, top: 96 } },
  { text: '“Find a clean-up near me”', style: { start: 4, top: 184 } },
] as const;

/** Welcome slide 4: Earthy's orb with three things people ask it. */
export function MeetEarthyArt() {
  const theme = useTheme();

  return (
    <View style={styles.area} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <SvgXml xml={meetEarthyGlowXml} width={GLOW} height={GLOW} style={styles.glow} />
      <View style={styles.orb}>
        <EarthyOrb state="idle" size={ORB} glow={false} />
      </View>
      {BUBBLES.map((bubble) => (
        <View
          key={bubble.text}
          style={[
            styles.bubble,
            bubble.style,
            { backgroundColor: theme.card, borderColor: theme.strokeAskChip, boxShadow: Shadows.askChip },
          ]}>
          <ThemedText type="meta13">{bubble.text}</ThemedText>
        </View>
      ))}
    </View>
  );
}

/** Small "AI-POWERED" tag with a mini orb, top right on the Earthy slide. */
export function AiPoweredTag() {
  const theme = useTheme();

  return (
    <View style={[styles.tag, { backgroundColor: theme.fill }]}>
      <EarthyOrb state="still" size={14} glow={false} />
      <ThemedText type="tag" themeColor="brand" style={styles.tagText}>
        AI-POWERED
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    width: 312,
    height: 240,
  },
  glow: {
    position: 'absolute',
    left: 46,
    top: -22,
  },
  orb: {
    position: 'absolute',
    left: 90,
    top: 22,
  },
  bubble: {
    position: 'absolute',
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoHalf,
    borderWidth: 1,
    borderRadius: Radius.large,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  tagText: {
    letterSpacing: 0.66,
  },
});
