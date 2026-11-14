import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BinChip, NotRight, Sheet } from '@/app/waste-scan';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { PartGlow } from '@/components/scan/part-glow';
import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { TextButton } from '@/components/ui/text-button';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BOTTLE_FEED = require('@/assets/images/lens-bottle-camera.png');
/** Figma F9v2·3 answer sheet: 370 tall, from y 422 to 8 px above the bottom. */
const SHEET_HEIGHT = 370;
// The thumbnail is the frame's camera photo zoomed on the bottle: x 75–260, y 242–426 of the 360 × 800 feed.
const THUMB_SCALE = 52 / 184.5;

/** SAMPLE: what Earthy Lens "sees" in Figma's photo. No image leaves the phone in the demo. */
const BOTTLE = {
  name: 'Plastic bottle',
  confidence: 96,
  part: 'Whole bottle',
  note: 'Empty it, cap on',
  bin: 'Green bin',
  tip: 'Tip: squash it so the bag holds more.',
  smileys: 5,
};

/**
 * F9v2·3 Earthy Lens: ask a question with the camera ("Where does this go?") and get one answer
 * sheet. "Not right?" goes to Know your waste; "Find bins" to drop-off points.
 */
export default function EarthyLensRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [binned, setBinned] = useState(false);

  return (
    <Scanner
      feed={BOTTLE_FEED}
      closeArt={<Icon name="chevron-down" size={24} color="textOnBrand" />}
      center={
        <View
          style={[styles.question, { backgroundColor: theme.glassOnMap }]}
          accessibilityLabel="You asked: Where does this go?">
          <EarthyOrb size={18} state="still" glow={false} />
          <ThemedText type="fieldLabel">“Where does this go?”</ThemedText>
        </View>
      }>
      {/* Figma draws the dim over the detect box too, so both sit under the answer sheet. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
        <View
          style={[styles.box, { top: insets.top + 68, borderColor: theme.detectAmber, backgroundColor: theme.detectAmberFill }]}>
          <View style={[styles.boxLabel, { backgroundColor: theme.detectAmber }]}>
            <ThemedText type="fieldLabel" themeColor="textSecondary" style={styles.boxText} numberOfLines={1}>
              {`${BOTTLE.name} · ${BOTTLE.confidence}%`}
            </ThemedText>
          </View>
        </View>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.scanDim }]} />
      </View>

      <Sheet height={SHEET_HEIGHT}>
        {binned ? (
          <View style={styles.done} accessibilityLiveRegion="polite">
            <Smiley size={48} />
            <ThemedText type="sheetPrompt" accessibilityRole="header">{`+${BOTTLE.smileys} Smileys`}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              Thanks for binning it right.
            </ThemedText>
            <View style={styles.full}>
              <Button label="Done" size="large" pill onPress={() => router.back()} />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.head}>
              <View style={styles.thumb}>
                <Image source={BOTTLE_FEED} style={styles.thumbPhoto} contentFit="fill" accessible={false} />
              </View>
              <View style={styles.flex}>
                <ThemedText style={styles.title} accessibilityRole="header">
                  {BOTTLE.name}
                </ThemedText>
                <View style={styles.from}>
                  <EarthyOrb size={16} state="still" glow={false} />
                  <ThemedText type="chip" themeColor="textWeak">{`Earthy · ${BOTTLE.confidence}% sure`}</ThemedText>
                </View>
              </View>
              <NotRight onPress={() => router.replace('/waste-guide')} />
            </View>
            <View
              style={[styles.part, { backgroundColor: theme.tileNeutral }]}
              accessible
              accessibilityLabel={`${BOTTLE.part}, ${BOTTLE.note}: ${BOTTLE.bin}`}>
              <PartGlow delay={350} />
              <View style={styles.flex}>
                <ThemedText type="rowTitle">{BOTTLE.part}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {BOTTLE.note}
                </ThemedText>
              </View>
              <BinChip text={BOTTLE.bin} bin="green" />
            </View>
            <View style={[styles.tip, { backgroundColor: theme.secondarySubtle }]}>
              <ThemedText type="caption" themeColor="textSecondary">
                {BOTTLE.tip}
              </ThemedText>
            </View>
            <ThemedText type="chipSelected" themeColor="statusSuccess" style={styles.reward}>
              {`Bin it to earn +${BOTTLE.smileys} Smileys`}
            </ThemedText>
            <View style={styles.actions}>
              <View style={styles.binned}>
                <Button label="Binned it" pill flat onPress={() => setBinned(true)} />
              </View>
              <TextButton label="Find bins" onPress={() => router.replace('/waste-dropoff')} />
            </View>
          </>
        )}
      </Sheet>
    </Scanner>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  // Figma "Asked": 14 / 8 padding, 8 px gap, its top at y 62, 8 px lower than centred on the close button
  // (a nudge, so the top bar keeps its height).
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    transform: [{ translateY: 8 }],
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: Radius.pill,
  },
  // Figma detect box: 210 × 310 at x 78, y 112.
  box: {
    position: 'absolute',
    start: 78,
    width: 210,
    height: 310,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  boxLabel: {
    position: 'absolute',
    top: 5.5,
    start: 5.5,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: 14,
  },
  boxText: {
    lineHeight: 20,
  },
  // Figma: the header starts 18 px under the grabber; 6 px between the photo and the name.
  head: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.oneHalf,
  },
  thumb: {
    width: 52,
    height: 52,
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  thumbPhoto: {
    position: 'absolute',
    left: -75 * THUMB_SCALE,
    top: -242 * THUMB_SCALE,
    width: 360 * THUMB_SCALE,
    height: 800 * THUMB_SCALE,
  },
  // Figma: SemiBold 20, line height normal (30).
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 30,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  // Figma Part: 72 tall at y 104, 20 px under the header.
  part: {
    marginTop: Spacing.threeHalf,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.option,
  },
  // Figma Tip: 44 tall at y 188, text 12 px in.
  tip: {
    marginTop: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: 13,
    borderRadius: Radius.small,
  },
  // Figma Reward: y 250.
  reward: {
    marginTop: 18,
  },
  // Figma: "Binned it" 196 wide at y 294, "Find bins" 14 px after it.
  actions: {
    marginTop: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
  },
  binned: {
    width: 196,
  },
  done: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  full: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
});
