import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RoundButton } from '@/components/ui/round-button';
import { Tappable } from '@/components/ui/tappable';
import { PlasticHero } from '@/components/waste/plastic-hero';
import { BinToggle, ResinExplorer, StepCards } from '@/components/waste/plastic-lesson';
import { scanRowIconXml } from '@/constants/plastic-art';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { PLASTIC_LESSON } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';

// Figma: the hero fill is 280 tall and the white content starts at y 260, over the hero's bottom.
const HERO_HEIGHT = 280;
const SHEET_TOP = 260;
const FIGMA_STATUS_BAR = 44;

/**
 * F4·2 Plastic — how to sort (Figma 446:10139, 13 Nov): flip the bottle to see its number, tick off the
 * three steps, look up any resin code, and switch between the green and black bin lists.
 */
export default function WastePlasticRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Figma draws a 44 px status bar; on a phone the hero grows or shrinks with the real one.
  const statusShift = insets.top - FIGMA_STATUS_BAR;

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.fill, height: HERO_HEIGHT + statusShift, paddingTop: Math.max(statusShift, 0) }]}>
          <View style={{ marginTop: Math.min(statusShift, 0) }}>
            <PlasticHero />
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <ThemedText style={styles.title} accessibilityRole="header">
              Plastic
            </ThemedText>
            <View style={[styles.binChip, { backgroundColor: theme.statusSuccessSubtle }]}>
              <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
              <ThemedText type="smallMedium" themeColor="statusSuccess">
                {PLASTIC_LESSON.chip}
              </ThemedText>
            </View>
          </View>

          <Section title="Before it goes in the bin" subtitle="Tap each step once you’ve done it.">
            <StepCards />
          </Section>

          <Section title="Which plastic is it?" subtitle="Turn the bottle over, and tap the number">
            <ResinExplorer />
          </Section>

          <Section title="Green bin or black bin?" subtitle="Common things and where they go.">
            <BinToggle />
          </Section>

          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Still not sure? Scan it. Earthy will tell you which bin"
            onPress={() => router.push('/bottle-scan')}
            style={[styles.scanRow, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
            <View style={[styles.scanIcon, { backgroundColor: theme.fill }]}>
              <SvgXml xml={scanRowIconXml} width={18} height={18} />
            </View>
            <View style={styles.flex}>
              <ThemedText type="linkRow">Still not sure? Scan it</ThemedText>
              <ThemedText type="small" themeColor="textWeak">
                Earthy will tell you which bin
              </ThemedText>
            </View>
            <Icon name="chevron-end" size={18} color="textStrong" />
          </Tappable>
        </View>
      </ScrollView>

      <View style={[styles.back, { top: insets.top + Spacing.two }]}>
        <RoundButton icon="chevron-start" label="Back" onPress={() => router.back()} outlined />
      </View>

      {/* Figma Bottom bar: 96 tall, white, 1 px top stroke; Find drop-off 196 wide, Ask Earthy beside it. */}
      <View
        style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.strokeWeak, paddingBottom: Math.max(insets.bottom, 34) }]}>
        <View style={styles.findDropOff}>
          <Button label="Find drop-off" pill flat onPress={() => router.push({ pathname: '/waste-dropoff', params: { intro: '1' } })} />
        </View>
        <Tappable accessibilityRole="button" accessibilityLabel="Ask Earthy" onPress={() => router.push('/plastic-ask')} style={styles.ask}>
          <EarthyOrb size={22} state="still" glow={false} />
          <ThemedText type="buttonPrimary" themeColor="brand">
            Ask Earthy
          </ThemedText>
        </Tappable>
      </View>
    </View>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <ThemedText style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </ThemedText>
        <ThemedText type="meta13" themeColor="textWeak">
          {subtitle}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    overflow: 'hidden',
  },
  // Figma Content: white, top corners 24, 24 px padding all round, 24 gap.
  content: {
    marginTop: SHEET_TOP - HERO_HEIGHT,
    gap: Spacing.four,
    padding: Spacing.four,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
  header: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  // Figma: Poppins SemiBold 26, line height "normal" (39).
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 26,
    lineHeight: 39,
  },
  binChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.control,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  section: {
    gap: Spacing.twoThreeQuarters,
  },
  heading: {
    gap: Spacing.half,
  },
  // Figma section headings: SemiBold 17 / 24.
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  scanIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  flex: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    start: Spacing.three,
  },
  bottomBar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingTop: 13,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
  },
  findDropOff: {
    width: 196,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
