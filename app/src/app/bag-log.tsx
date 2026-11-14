import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ScanBrackets } from '@/components/scan/scan-brackets';
import { Scanner } from '@/components/scan/scanner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Tappable } from '@/components/ui/tappable';
import { SHEET_EASING } from '@/constants/motion';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { BAG, FULLNESS, type Fullness } from '@/data/bag-log.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** F5·1: scan the bag's sticker, say what's inside and how full it is, then log it. */
export default function BagLogRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [inside, setInside] = useState<readonly string[]>(BAG.earthyFound);
  const [fullness, setFullness] = useState<Fullness>('full');

  const toggle = (item: string) => {
    feedback.play(inside.includes(item) ? 'toggle.off' : 'toggle.on');
    setInside((current) => (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]));
  };

  return (
    <Scanner feed={require('@/assets/images/scan-bag-camera.jpg')} torch={false}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bagDim }]} pointerEvents="none" />
      {/* Figma F5·1: "Bag #14" tag at y 142, green brackets (123 box, 3.69 stroke) at x 126, y 176. */}
      <View style={[styles.sticker, { top: insets.top + 98 }]} pointerEvents="none">
        <View style={[styles.stickerTag, { backgroundColor: theme.statusSuccess }]}>
          <ThemedText type="chipAction" themeColor="textOnBrand" style={styles.tagText}>{`Bag #${BAG.number}`}</ThemedText>
        </View>
        <ScanBrackets size={123} arm={27} stroke={3.69} radius={9.55} color="checkInBar" />
      </View>

      <Animated.View
        entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
        style={[styles.sheet, { backgroundColor: theme.card, bottom: Math.max(insets.bottom, Spacing.two) }]}>
        <View style={[styles.grabber, { backgroundColor: theme.strokeChip }]} />
        <View style={styles.head}>
          <EarthyOrb size={24} state="still" glow={false} />
          <View>
            <ThemedText type="sheetTitle" accessibilityRole="header" style={styles.title}>{`Bag #${BAG.number}`}</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              {BAG.crew}
            </ThemedText>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText type="labelSmall" style={styles.label}>
            What’s inside? Earthy had a peek
          </ThemedText>
          <View style={styles.chips}>
            {BAG.contents.map((item) => {
              const on = inside.includes(item);
              return (
                <Tappable
                  key={item}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={item}
                  onPress={() => toggle(item)}
                  style={[styles.chip, on ? { backgroundColor: theme.fill, borderColor: theme.brand } : { backgroundColor: theme.card, borderColor: theme.strokeChip }]}>
                  {on && (
                    <ThemedText type="chipAction" themeColor="brand" style={styles.tick}>
                      ✓
                    </ThemedText>
                  )}
                  <ThemedText type="fieldLabel" themeColor={on ? 'brand' : 'textStrong'} style={styles.label}>
                    {item}
                  </ThemedText>
                </Tappable>
              );
            })}
            {/* Adding a material that isn't listed isn't designed yet: says "Coming soon". */}
            <Tappable accessibilityRole="button" accessibilityLabel="Add another material" style={[styles.chip, { backgroundColor: theme.card, borderColor: theme.strokeChip }]}>
              <ThemedText type="fieldLabel" style={styles.label}>
                + Add
              </ThemedText>
            </Tappable>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText type="labelSmall" style={styles.label}>
            How full is it?
          </ThemedText>
          <View style={[styles.segments, { backgroundColor: theme.segmentWell }]} accessibilityRole="radiogroup">
            {FULLNESS.map((option) => {
              const on = option.key === fullness;
              return (
                <Tappable
                  key={option.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${option.label}, ${option.note}`}
                  onPress={() => setFullness(option.key)}
                  style={[styles.segment, on && { backgroundColor: theme.card, boxShadow: '0px 2px 3px 0px rgba(0, 0, 0, 0.08)' }]}>
                  <ThemedText type="labelSmall" themeColor={on ? 'brand' : 'textStrong'} style={styles.label}>
                    {option.label}
                  </ThemedText>
                  <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.note}>
                    {option.note}
                  </ThemedText>
                </Tappable>
              );
            })}
          </View>
        </View>

        <Button
          label="Log bag"
          flat
          disabled={inside.length === 0}
          onPress={() => router.replace({ pathname: '/bag-handed', params: { fullness, inside: inside.join(', ') } })}
        />
      </Animated.View>
    </Scanner>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    start: '50%',
    marginStart: -54, // brackets at x 126 (centre 187.5): the sticker sits right of centre in the photo
    width: 123,
    alignItems: 'center',
  },
  stickerTag: {
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: 13,
  },
  tagText: {
    lineHeight: 18,
  },
  // Figma "Sheet": floating, x 8, 344 wide, 32 radius, 12 / 28 / 20 padding, 18 gap.
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    gap: 18,
    paddingTop: Spacing.twoThreeQuarters,
    paddingBottom: 28,
    paddingHorizontal: Spacing.threeHalf,
    borderRadius: 32,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  title: {
    lineHeight: 30,
  },
  label: {
    lineHeight: 20,
  },
  note: {
    lineHeight: 17,
  },
  // Figma's ✓ is 10 px wide; the fallback font draws it narrower, so the width is fixed.
  tick: {
    width: 10,
    textAlign: 'center',
  },
  group: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: 7,
    borderWidth: 1.2,
    borderRadius: Radius.option,
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
    borderRadius: Radius.medium,
  },
  // Figma pads options 6 px but lets "Needs 2 people" (86 px) overflow its 84 px; 4 px keeps it on one line.
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
    borderRadius: Radius.control,
  },
});
