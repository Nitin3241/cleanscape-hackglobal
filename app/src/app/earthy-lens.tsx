import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Smiley } from '@/components/ui/smiley';
import { TextButton } from '@/components/ui/text-button';
import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BOTTLE_FEED = require('@/assets/images/lens-bottle-camera.png');

/** SAMPLE: what Earthy Lens "sees" in Figma's photo. No image leaves the phone in the demo. */
const BOTTLE = { name: 'Plastic bottle', confidence: 96, part: 'Whole bottle', note: 'Empty it, cap on', bin: 'Green bin', tip: 'Tip: squash it so the bag holds more.', smileys: 5 };

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
      center={
        <View style={styles.question} accessibilityLabel="You asked: Where does this go?">
          <EarthyOrb size={18} state="still" glow={false} />
          <ThemedText type="note">“Where does this go?”</ThemedText>
        </View>
      }>
      {/* Figma dims the feed under the answer so the sheet and the frame stand out. */}
      <View style={[StyleSheet.absoluteFill, styles.dimmed]} pointerEvents="none" />
      <View style={[styles.box, { top: insets.top + 112 }]} pointerEvents="none" aria-hidden>
        <View style={[styles.boxLabel, { backgroundColor: theme.secondary }]}>
          <ThemedText type="smallMedium">{`${BOTTLE.name} · ${BOTTLE.confidence}%`}</ThemedText>
        </View>
      </View>

      <Animated.View
        entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
        style={[styles.sheet, { backgroundColor: theme.card, paddingBottom: insets.bottom + Spacing.three }]}>
        <View style={[styles.grabber, { backgroundColor: theme.seatEmpty }]} />
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
              <Image source={BOTTLE_FEED} style={styles.thumb} contentFit="cover" accessible={false} />
              <View style={styles.flex}>
                <ThemedText type="sheetPrompt" accessibilityRole="header">
                  {BOTTLE.name}
                </ThemedText>
                <View style={styles.from}>
                  <EarthyOrb size={14} state="still" glow={false} />
                  <ThemedText type="caption" themeColor="textWeak">{`Earthy · ${BOTTLE.confidence}% sure`}</ThemedText>
                </View>
              </View>
              <TextButton label="Not right?" onPress={() => router.replace('/waste-guide')} />
            </View>
            <View
              style={[styles.partRow, { backgroundColor: theme.wellCool }]}
              accessible
              accessibilityLabel={`${BOTTLE.part}, ${BOTTLE.note}: ${BOTTLE.bin}`}>
              <View style={[styles.partBar, { backgroundColor: theme.secondary }]} />
              <View style={styles.flex}>
                <ThemedText type="labelLarge">{BOTTLE.part}</ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {BOTTLE.note}
                </ThemedText>
              </View>
              <View style={[styles.binChip, { backgroundColor: theme.statusSuccessSubtle }]}>
                <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]} />
                <ThemedText type="smallMedium">{BOTTLE.bin}</ThemedText>
              </View>
            </View>
            <View style={[styles.tip, { backgroundColor: theme.secondarySubtle }]}>
              <ThemedText type="caption" themeColor="textSecondary">
                {BOTTLE.tip}
              </ThemedText>
            </View>
            <ThemedText type="bodyMedium" themeColor="statusSuccess">{`Bin it to earn +${BOTTLE.smileys} Smileys`}</ThemedText>
            <View style={styles.actions}>
              <View style={styles.flex}>
                <Button label="Binned it" size="large" pill onPress={() => setBinned(true)} />
              </View>
              <TextButton label="Find bins" onPress={() => router.replace('/waste-dropoff')} />
            </View>
          </>
        )}
      </Animated.View>
    </Scanner>
  );
}

const styles = StyleSheet.create({
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  dimmed: {
    backgroundColor: 'rgba(11, 26, 32, 0.3)',
  },
  box: {
    position: 'absolute',
    start: 86,
    end: 72,
    height: 296,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F2A516',
    borderRadius: 10,
  },
  boxLabel: {
    position: 'absolute',
    top: 8,
    start: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  sheet: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderTopStartRadius: Radius.panel,
    borderTopEndRadius: Radius.panel,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.small,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  flex: {
    flex: 1,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    padding: Spacing.threeLess,
    borderRadius: Radius.option,
  },
  partBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  binChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  done: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  full: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
});
