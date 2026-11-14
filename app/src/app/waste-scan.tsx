import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Scanner } from '@/components/scan/scanner';
import { PartGlow } from '@/components/scan/part-glow';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { SHEET_EASING } from '@/constants/motion';
import { scanBracketsXml, scanShutterXml } from '@/constants/plastic-art';
import { Fonts, Motion, Radius, Shadows, Spacing } from '@/constants/theme';
import { BIN_LABEL, PIZZA } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

type Step = 'looking' | 'found' | 'result' | 'confirm';

/** DEMO: Earthy "finds" the parts after this long, as Figma's prototype does (F4·7 → F4·8). */
const LOOKING_FOR = 2500;
const PIZZA_FEED = require('@/assets/images/scan-pizza-camera.png');

/**
 * F4·7–F4·10: point the camera at an item and Earthy says which bin each part goes in.
 * SAMPLE: always finds Figma's pizza box; no image is sent anywhere.
 */
export default function WasteScanRoute() {
  const [step, setStep] = useState<Step>('looking');

  useEffect(() => {
    if (step !== 'looking') return;
    const timer = setTimeout(() => setStep('found'), LOOKING_FOR);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <Scanner feed={PIZZA_FEED}>
      {step === 'looking' ? <Looking onShutter={() => setStep('found')} /> : <PartBoxes dim={step !== 'found'} />}
      {step === 'found' && <FoundPeek onOpen={() => setStep('result')} />}
      {step === 'result' && <Result onNotRight={() => setStep('looking')} onBinned={() => setStep('confirm')} />}
      {step === 'confirm' && <Confirm />}
    </Scanner>
  );
}

/** Figma F4·7 / F4·7p sparks: [x, y, size] on the 360 × 800 frame. */
const SPARKS = [
  [70, 170, 8],
  [210, 150, 6],
  [290, 260, 9],
  [120, 300, 6],
  [250, 420, 8],
  [160, 480, 5],
  [80, 520, 5],
  [280, 560, 6],
] as const;

/** F4·7 / F4·7p: brackets, sparks and the scan line while Earthy looks, over the control panel. Also used by the bottle scan. */
export function Looking({ onShutter }: { onShutter: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Figma positions are on the 800 px frame with a 44 px status bar.
  const y = (frameY: number) => insets.top - 44 + frameY;
  return (
    <>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
        <SvgXml xml={scanBracketsXml} width={316} height={482} style={[styles.brackets, { top: y(98) }]} />
        {SPARKS.map(([x, top, size]) => (
          <View
            key={`${x}-${top}`}
            style={[styles.spark, { left: x, top: y(top), width: size, height: size, borderRadius: size / 2 }]}
          />
        ))}
        <View style={[styles.scanLine, { top: y(300), backgroundColor: theme.scanLine, boxShadow: Shadows.scanLine }]} />
      </View>
      <View
        style={[
          styles.lookingPanel,
          {
            bottom: Math.max(insets.bottom, Spacing.twoThreeQuarters),
            backgroundColor: theme.scanPanel,
            borderColor: theme.ticketTear,
            boxShadow: Shadows.scanPanel,
          },
        ]}>
        <View style={styles.lookingRow} accessibilityLiveRegion="polite">
          <EarthyOrb size={30} state="thinking" glow={false} />
          <View style={styles.lookingText}>
            <ThemedText type="labelLarge" themeColor="textOnBrand" style={styles.lookingTitle}>
              Earthy is looking…
            </ThemedText>
            <ThemedText type="meta" themeColor="timeNoteOnBrand">
              Hold steady over the item
            </ThemedText>
          </View>
        </View>
        {/* Picking a photo from the library isn't designed yet; Figma draws the gallery as a flat swatch. */}
        <View style={[styles.gallery, { backgroundColor: theme.scanGallery }]} />
        <Tappable accessibilityRole="button" accessibilityLabel="Take photo" onPress={onShutter} style={styles.shutter}>
          <SvgXml xml={scanShutterXml} width={82} height={82} />
        </Tappable>
        {/* Figma's Ask button has no link from this frame. */}
        <View style={[styles.askOrb, { backgroundColor: theme.glassOnBrand, borderColor: theme.glassStroke }]}>
          <EarthyOrb size={28} state="still" glow={false} />
        </View>
      </View>
    </>
  );
}

/** F4·8: dashed boxes around the two parts Earthy found, with confidence labels (dimmed under the result). */
function PartBoxes({ dim }: { dim: boolean }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const lid = PIZZA.parts[1];
  const base = PIZZA.parts[0];
  const box = { borderColor: theme.detectAmber, backgroundColor: theme.detectAmberFill };
  return (
    <View style={[StyleSheet.absoluteFill, dim && styles.dim]} pointerEvents="none">
      <View style={[styles.box, box, { top: insets.top + 68, height: 262 }]}>
        <Label text={`${lid.name} · ${lid.confidence}%`} />
      </View>
      <View style={[styles.box, box, { top: insets.top + 340, height: 258 }]}>
        <Label text={`${base.name} · ${base.confidence}%`} />
      </View>
    </View>
  );
}

function Label({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.boxLabel, { backgroundColor: theme.detectAmber }]}>
      <ThemedText type="fieldLabel" themeColor="textSecondary" style={styles.boxLabelText} numberOfLines={1}>
        {text}
      </ThemedText>
    </View>
  );
}

/**
 * The white result sheet that slides up over the camera. Figma floats it 8 px from the edges with 32 px corners
 * (F4·8, F4·9, F4·9p); the full result is 500 tall with its buttons at the bottom (`height`).
 */
export function Sheet({ children, peek = false, height }: { children: React.ReactNode; peek?: boolean; height?: number }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      entering={peek ? FadeIn.duration(200) : SlideInDown.duration(Motion.transition.sheet.duration).easing(SHEET_EASING)}
      style={[
        styles.sheet,
        { backgroundColor: theme.card, bottom: Math.max(insets.bottom, Spacing.two) },
        height !== undefined && { height, gap: 0 },
      ]}>
      <View style={[styles.grabber, { backgroundColor: theme.strokeControl }]} />
      {children}
    </Animated.View>
  );
}

/** F4·8: the floating peek (344 × 148, 8 px from the edges); tapping it opens the F4·9 result. */
function FoundPeek({ onOpen }: { onOpen: () => void }) {
  return (
    <Sheet peek height={148}>
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Pizza box: split it. 2 parts go in 2 different bins. Show details"
        onPress={onOpen}
        style={styles.peek}>
        <View style={styles.peekHead}>
          <View style={styles.peekOrb}>
            <EarthyOrb size={36} state="still" glow={false} />
          </View>
          <View style={styles.flex}>
            <ThemedText type="placeTitle" style={styles.peekTitle}>
              Pizza box: split it
            </ThemedText>
            {/* Figma oddity, built as drawn: the subtitle starts 8 px left of the title (x 58 vs 66). */}
            <ThemedText type="location" themeColor="textWeak" style={styles.peekSub}>
              2 parts go in 2 different bins
            </ThemedText>
          </View>
          <View style={styles.up}>
            <Icon name="chevron-down" size={24} color="textWeak" />
          </View>
        </View>
        <View style={styles.chips}>
          <BinChip text="Lid → Green bin" bin="green" medium />
          <BinChip text="Base → Black bin" bin="black" medium />
        </View>
      </Tappable>
    </Sheet>
  );
}

/** "Not right?" on a scan result (F4·9, F4·9p): opens the fix sheet. */
export function NotRight({ onPress }: { onPress: () => void }) {
  return (
    <Tappable accessibilityRole="button" accessibilityLabel="Not right?" onPress={onPress} hitSlop={8} style={styles.notRight}>
      <ThemedText type="labelSmall" themeColor="brand" style={styles.notRightText}>
        Not right?
      </ThemedText>
    </Tappable>
  );
}

export function BinChip({
  text,
  bin,
  medium = false,
}: {
  text: string;
  bin: 'green' | 'black';
  /** Figma F4·8 peek chips are Medium, not SemiBold. */ medium?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.binChip, { backgroundColor: bin === 'green' ? theme.statusSuccessSubtle : theme.strokeWeak }]}>
      <View style={[styles.binDot, { backgroundColor: bin === 'green' ? '#2E9E5B' : '#2F3A44' }]} />
      <ThemedText type={medium ? 'chip' : 'chipAction'} style={styles.binText}>
        {text}
      </ThemedText>
    </View>
  );
}

function Result({ onNotRight, onBinned }: { onNotRight: () => void; onBinned: () => void }) {
  const theme = useTheme();
  return (
    // Figma F4·9 result sheet: 500 tall, from y 292 to 8 px above the bottom.
    <Sheet height={500}>
      <View style={styles.resultHead}>
        <Image source={PIZZA_FEED} style={styles.resultThumb} contentFit="cover" accessible={false} />
        <View style={styles.flex}>
          <ThemedText style={styles.resultTitle} accessibilityRole="header">
            Pizza box
          </ThemedText>
          <View style={styles.from}>
            <EarthyOrb size={16} state="still" glow={false} />
            <ThemedText type="chip" themeColor="textWeak">
              Earthy · 2 parts found
            </ThemedText>
          </View>
        </View>
        <NotRight onPress={onNotRight} />
      </View>
      {[PIZZA.parts[1], PIZZA.parts[0]].map((part, index) => (
        <View
          key={part.name}
          style={[styles.partRow, { backgroundColor: theme.tileNeutral, marginTop: index === 0 ? 20 : 10 }]}
          accessible
          accessibilityLabel={`${part.name}, ${part.note}: ${BIN_LABEL[part.bin]}`}>
          {/* Figma glow v3 + sweep v4 replaces the old coloured bar: light sweeps at 0.35 s, then 0.57 s. */}
          <PartGlow delay={350 + index * 220} />
          <View style={styles.flex}>
            <ThemedText type="rowTitle">{part.name}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {part.note}
            </ThemedText>
          </View>
          <BinChip text={BIN_LABEL[part.bin]} bin={part.bin as 'green' | 'black'} />
        </View>
      ))}
      <View style={[styles.tip, styles.resultTip, { backgroundColor: theme.secondarySubtle }]}>
        <ThemedText type="caption" themeColor="textSecondary">
          Tip: tear along the fold. No need to wash it.
        </ThemedText>
      </View>
      <ThemedText type="bodyMedium" themeColor="statusSuccess" style={styles.reward}>
        Bin both parts to earn +2 Smileys
      </ThemedText>
      <View style={styles.resultActions}>
        <View style={styles.binned}>
          <Button label="Binned it" pill flat onPress={onBinned} />
        </View>
        <TextButton label="Find bins" onPress={() => router.replace('/waste-bins')} />
      </View>
    </Sheet>
  );
}

function Confirm() {
  const theme = useTheme();
  // Figma shows both ticked; the person ticks each part themselves here.
  const [ticked, setTicked] = useState<readonly string[]>([]);
  const parts = [PIZZA.parts[1], PIZZA.parts[0]];
  const all = ticked.length === parts.length;

  return (
    <Sheet>
      <View>
        <ThemedText type="sheetPrompt" accessibilityRole="header">
          Did both go in?
        </ThemedText>
        <ThemedText type="caption" themeColor="textWeak">
          {"Tick each part once it's in the bin."}
        </ThemedText>
      </View>
      {parts.map((part) => {
        const on = ticked.includes(part.name);
        return (
          <Tappable
            key={part.name}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${part.name} is in the ${BIN_LABEL[part.bin].toLowerCase()}`}
            onPress={() => {
              feedback.play(on ? 'toggle.off' : 'toggle.on');
              setTicked((current) => (on ? current.filter((name) => name !== part.name) : [...current, part.name]));
            }}
            style={[styles.tickRow, { borderColor: on ? theme.brand : theme.strokeControl }]}>
            <View
              style={[
                styles.check,
                on ? { backgroundColor: theme.brand, borderColor: theme.brand } : { borderColor: theme.strokeStrong },
              ]}>
              {on && <Icon name="check" size={14} color="textOnBrand" strokeWidth={2.5} />}
            </View>
            <ThemedText type="labelLarge" style={styles.flex}>
              {part.name}
            </ThemedText>
            <BinChip text={BIN_LABEL[part.bin]} bin={part.bin as 'green' | 'black'} />
          </Tappable>
        );
      })}
      {/* The +1 bin photo bonus isn't designed further; shown as in Figma. */}
      <View style={[styles.bonus, { borderColor: theme.strokeControl }]}>
        <View style={[styles.bonusIcon, { backgroundColor: theme.wellCool }]}>
          <Icon name="camera" size={16} color="brand" strokeWidth={1.5} />
        </View>
        <View style={styles.flex}>
          <ThemedText type="label">Snap the bin for +1 bonus</ThemedText>
          <ThemedText type="caption" themeColor="textWeak">
            Optional. Helps us map bins near you.
          </ThemedText>
        </View>
      </View>
      <Button label="Claim Smileys" size="large" disabled={!all} onPress={() => router.replace('/waste-reward')} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  // Figma Brackets: 312 × 478 at x 24, y 100 (the 4 px strokes overhang by 2).
  brackets: {
    position: 'absolute',
    left: 22,
  },
  spark: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  // Figma Scan line: 300 × 3 at x 30, y 300, with a marigold glow.
  scanLine: {
    position: 'absolute',
    left: 30,
    width: 300,
    height: 3,
    borderRadius: 1.5,
  },
  // Figma Control panel: 336 × 194, 12 px from the sides and bottom, 32 radius, 1 px white 28% edge. Children are
  // placed from Figma's frame, less the 1 px border.
  lookingPanel: {
    position: 'absolute',
    start: Spacing.twoThreeQuarters,
    end: Spacing.twoThreeQuarters,
    height: 194,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 32,
  },
  // Figma Earthy status: x 3, y 11, 328 wide, 14 / 12 padding, 12 gap, 30 px orb.
  lookingRow: {
    position: 'absolute',
    top: 10,
    start: 2,
    width: 328,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  lookingText: {
    flex: 1,
    gap: Spacing.half,
  },
  // Figma: SemiBold 15, line height normal (22.5).
  lookingTitle: {
    lineHeight: 22.5,
  },
  // Figma Gallery: 44 at x 40, y 707; 2 px white edge, 10 radius.
  gallery: {
    position: 'absolute',
    top: 112,
    start: 27,
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: Radius.control,
  },
  // Figma Shutter: 72 at x 144, y 693, with a 5 px white 50% ring drawn outside it (82 overall).
  shutter: {
    position: 'absolute',
    top: 93,
    start: 126,
    width: 82,
    height: 82,
  },
  // Figma Ask: 44 at x 276, y 707, glass with a 28 px orb.
  askOrb: {
    position: 'absolute',
    top: 112,
    start: 263,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
  },
  dim: {
    opacity: 0.55,
  },
  // Figma F4·8 Detect boxes: 300 wide at x 30 (lid y 112 × 262, base y 384 × 258), 2.5 px dashed marigold, 14 radius.
  box: {
    position: 'absolute',
    start: 30,
    end: 30,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderRadius: Radius.medium,
  },
  // Figma Label: 8 px in from the box corner (5.5 inside its border), 10 / 4 padding, Medium 13 / 20.
  boxLabel: {
    position: 'absolute',
    top: 5.5,
    start: 5.5,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: 14,
  },
  boxLabelText: {
    lineHeight: 20,
  },
  // Figma Sheet: floating, 8 px from the edges, 32 radius, 20 px sides, grabber 10 px from the top.
  sheet: {
    position: 'absolute',
    start: Spacing.two,
    end: Spacing.two,
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeHalf,
    paddingBottom: Spacing.threeHalf,
    borderRadius: 32,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  // Figma F4·8 peek: orb 36 at x 20, y 30; title at y 28 (x 66); chevron 12 × 6 at x 304, y 40.
  peek: {
    flex: 1,
  },
  peekHead: {
    marginTop: Spacing.threeLess,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoHalf,
  },
  peekOrb: {
    marginTop: Spacing.half,
  },
  peekTitle: {
    lineHeight: 24,
  },
  peekSub: {
    marginStart: -Spacing.two,
  },
  up: {
    marginTop: 3,
    marginEnd: Spacing.half,
    transform: [{ rotate: '180deg' }],
  },
  flex: {
    flex: 1,
  },
  // Figma Peek chips: x 12 (8 px outside the sheet's 20 px side), y 88.
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 17,
    marginStart: -Spacing.two,
  },
  // Figma Bin chip: 28 tall, 10 / 5 padding, 6 gap, 12 radius, 7 px dot (green #2E9E5B, black #2F3A44), SemiBold 12.
  binChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: 5,
    borderRadius: Radius.small,
  },
  binDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  binText: {
    lineHeight: 18,
  },
  notRightText: {
    lineHeight: 20,
  },
  // Figma "Not right?": SemiBold 13 / 20, 8 px below the header's top, 13 px in from the sheet's edge.
  notRight: {
    marginTop: Spacing.two,
    marginEnd: 13,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Figma F4·9: header 18 px under the grabber, 6 px between the photo and the name.
  resultHead: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.oneHalf,
  },
  // Figma: SemiBold 20, line height normal (30).
  resultTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 30,
  },
  // Figma Tip: 44 tall, text 12 px in; the text runs to 2 px from the end, so it stays on one line.
  resultTip: {
    marginTop: Spacing.threeLess,
    paddingStart: Spacing.twoThreeQuarters,
    paddingEnd: 2,
    paddingVertical: 13,
  },
  reward: {
    marginTop: 18,
  },
  binned: {
    width: 196,
  },
  resultThumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.small,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  // Figma Part (F4·9): 72 tall, #F2F5F7, 16 radius, text 16 px in; clips its glow.
  partRow: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.option,
  },
  tip: {
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.small,
  },
  // Figma: Binned it (196 × 48) and Find bins 14 apart, 32 px above the sheet's bottom edge.
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
    marginTop: 'auto',
    marginBottom: Spacing.twoThreeQuarters,
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1.5,
    borderRadius: Radius.small,
  },
  check: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 6,
  },
  bonus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.small,
  },
  bonusIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.control,
  },
});
