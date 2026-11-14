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
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/parts';
import { Tappable } from '@/components/ui/tappable';
import { SHEET_EASING } from '@/constants/motion';
import { floatingSheetEdge } from '@/constants/sheet-edge';
import { Fonts, Motion, Radius, Spacing } from '@/constants/theme';
import { BAG, BAG_RESULT, EXPECTED_KG } from '@/data/bag-log.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const STEP = 0.1;

/** F5·3 (crew head): the volunteer's bag sticker is scanned; enter the weight from the scale. */
export default function BagWeighRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [kg, setKg] = useState(BAG_RESULT.kg);
  const range = EXPECTED_KG.full;
  const normal = kg >= range.min && kg <= range.max;

  const change = (delta: number) => setKg((current) => Math.max(0, Math.round((current + delta) * 10) / 10));

  return (
    <Scanner feed={require('@/assets/images/scan-bag-camera.jpg')} torch={false}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bagDim }]} pointerEvents="none" />
      {/* Figma F5·3: "Bag #14" tag at y 142, green brackets (120 box, 3.6 stroke) at x 128, y 176. */}
      <View style={[styles.sticker, { top: insets.top + 98 }]} pointerEvents="none">
        <View style={[styles.stickerTag, { backgroundColor: theme.statusSuccess }]}>
          <ThemedText type="chipAction" themeColor="textOnBrand" style={styles.tagText}>{`Bag #${BAG.number}`}</ThemedText>
        </View>
        <ScanBrackets size={120} arm={26.4} stroke={3.6} radius={9.32} color="checkInBar" />
      </View>

      <Animated.View
        entering={SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
        style={[styles.sheet, { backgroundColor: theme.card, ...floatingSheetEdge(insets.bottom) }]}>
        <View style={[styles.grabber, { backgroundColor: theme.strokeChip }]} />
        <View style={styles.head}>
          <Avatar initials={BAG.volunteer.initials} tone="avatarSea" size={40} />
          <View>
            <ThemedText
              type="sheetTitle"
              accessibilityRole="header"
              style={styles.title}>{`Bag #${BAG.number} · ${BAG.volunteer.name}`}</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              Full · plastic bottles, cans
            </ThemedText>
          </View>
        </View>

        <View style={styles.group}>
          <ThemedText type="labelSmall" style={styles.label}>
            Weight on the scale
          </ThemedText>
          <View
            style={[styles.stepper, { backgroundColor: theme.segmentWell }]}
            accessibilityRole="adjustable"
            accessibilityLabel={`Weight: ${kg.toFixed(1)} kilograms`}>
            <StepButton label="Less weight" sign="−" onPress={() => change(-STEP)} />
            <View style={styles.reading}>
              <ThemedText type="receiptTotal">{kg.toFixed(1)}</ThemedText>
              <ThemedText type="sectionTitle" themeColor="textWeak">
                kg
              </ThemedText>
            </View>
            <StepButton label="More weight" sign="+" onPress={() => change(STEP)} />
          </View>
        </View>

        {/* Reading the scale from a photo isn't built; shown as in Figma. */}
        <View style={[styles.snap, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
          <EarthyOrb size={28} state="still" glow={false} />
          <View style={styles.flex}>
            <ThemedText type="labelMedium14">Snap the scale instead</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              Earthy reads the number for you
            </ThemedText>
          </View>
          {/* Figma "icon/cam": 20 px, 1.82 stroke on the 20 frame (2.18 in Lucide's 24 grid). */}
          <Icon name="camera" size={20} color="brand" strokeWidth={2.18} />
        </View>

        <View style={styles.note} accessibilityLiveRegion="polite">
          <View style={[styles.dot, { backgroundColor: normal ? theme.statusSuccess : theme.secondary }]} />
          <ThemedText type="chip" themeColor={normal ? 'statusSuccess' : 'textSecondary'}>
            {normal
              ? `Normal for a full bag (${range.min}–${range.max} kg)`
              : `Check again: a full bag is usually ${range.min}–${range.max} kg`}
          </ThemedText>
        </View>

        <Button
          label="Save weight"
          flat
          disabled={kg <= 0}
          onPress={() => {
            feedback.play('register.success');
            router.back();
          }}
        />
      </Animated.View>
    </Scanner>
  );
}

function StepButton({ label, sign, onPress }: { label: string; sign: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.stepButton, { backgroundColor: theme.card, borderColor: theme.strokeChip }]}>
      <ThemedText style={styles.sign}>{sign}</ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    start: '50%',
    marginStart: -52, // brackets at x 128 (centre 180): the sticker sits right of centre in the photo
    width: 120,
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
  group: {
    gap: Spacing.twoHalf,
  },
  // Figma "Stepper": #EEF3F5 well, 8 padding, 18 radius.
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.two,
    borderRadius: 18,
  },
  reading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  stepButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 26,
  },
  // Figma "−" / "+": 24 medium; no text token at that size and weight.
  sign: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    lineHeight: 30,
  },
  // Figma "Snap scale": 12 / 14 padding, 12 gap, 16 radius, 1 px #E3E8EB.
  snap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  flex: {
    flex: 1,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
