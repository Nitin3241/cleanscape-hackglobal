import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BinChip, Looking, NotRight, Sheet } from '@/app/waste-scan';
import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { Scanner } from '@/components/scan/scanner';
import { PartGlow } from '@/components/scan/part-glow';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { BOTTLE } from '@/data/waste.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const FEED = require('@/assets/images/waste/crushed-bottle.jpg');
/** DEMO: Earthy "finds" the bottle after this long (Figma F4·7p: auto 2.5 s → F4·9p). */
const LOOKING_FOR = 2500;
/** Figma F4·9p result sheet: 500 tall, from y 292 to 8 px above the bottom. */
const RESULT_HEIGHT = 500;

/**
 * F4·7p Scan — plastic bottle, Earthy is looking → F4·9p Scan result. "Not right?" opens F4·9c; "Binned it" goes to
 * F4·2 Plastic; "Find bins" to F4·6g Green bins near you. SAMPLE: always Figma's bottle; no image is sent anywhere.
 */
export default function BottleScanRoute() {
  // `found=1` opens straight on the result (F4·9c → F4·9p when the fix sheet came from F4·9u).
  const params = useLocalSearchParams<{ found?: string }>();
  const [found, setFound] = useState(params.found === '1');

  useEffect(() => {
    if (found) return;
    const timer = setTimeout(() => setFound(true), LOOKING_FOR);
    return () => clearTimeout(timer);
  }, [found]);

  return (
    <Scanner feed={FEED}>
      {found ? (
        <>
          <Detect />
          <Result />
        </>
      ) : (
        <Looking onShutter={() => setFound(true)} />
      )}
    </Scanner>
  );
}

/** Dashed marigold box round the bottle, with its confidence label (Figma 148 × 262 at x 106, y 186). */
function Detect() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.scanDim }]} pointerEvents="none">
      <View
        style={[
          styles.detect,
          { top: insets.top + 142, borderColor: theme.detectAmber, backgroundColor: theme.detectAmberFill },
        ]}>
        <View style={[styles.detectLabel, { backgroundColor: theme.detectAmber }]}>
          <ThemedText
            type="fieldLabel"
            themeColor="textSecondary"
            style={styles.detectText}
            numberOfLines={1}>{`${BOTTLE.name} · ${BOTTLE.confidence}%`}</ThemedText>
        </View>
      </View>
    </View>
  );
}

function Result() {
  const theme = useTheme();
  return (
    <Sheet height={RESULT_HEIGHT}>
      <View style={styles.head}>
        <Image source={FEED} style={styles.thumb} contentFit="cover" accessible={false} />
        <View style={styles.flex}>
          <ThemedText style={styles.title} accessibilityRole="header">
            {BOTTLE.name}
          </ThemedText>
          <View style={styles.from}>
            <EarthyOrb size={16} state="still" glow={false} />
            <ThemedText type="chip" themeColor="textWeak">
              {BOTTLE.found}
            </ThemedText>
          </View>
        </View>
        <NotRight onPress={() => router.push('/scan-fix')} />
      </View>
      {BOTTLE.parts.map((part, index) => (
        <View
          key={part.name}
          style={[styles.part, { backgroundColor: theme.tileNeutral, marginTop: index === 0 ? 20 : 10 }]}
          accessible
          accessibilityLabel={`${part.name}, ${part.note}: green bin`}>
          {/* Figma glow v3 + sweep v4: the first card's light sweeps at 0.35 s, the second at 0.57 s. */}
          <PartGlow delay={350 + index * 220} />
          <View style={styles.flex}>
            <ThemedText type="rowTitle">{part.name}</ThemedText>
            <ThemedText type="caption" themeColor="textWeak">
              {part.note}
            </ThemedText>
          </View>
          <BinChip text="Green bin" bin="green" />
        </View>
      ))}
      <View style={[styles.tip, { backgroundColor: theme.secondarySubtle }]}>
        <ThemedText type="caption" themeColor="textSecondary">
          {BOTTLE.tip}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        <View style={styles.binned}>
          <Button
            label="Binned it"
            pill
            flat
            onPress={() => {
              feedback.play('button.primary');
              router.replace('/waste-plastic');
            }}
          />
        </View>
        <TextButton label="Find bins" onPress={() => router.push('/waste-bins')} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  detect: {
    position: 'absolute',
    alignSelf: 'center',
    width: 148,
    height: 262,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderRadius: Radius.medium,
  },
  // Figma Label: 8 px in from the box corner (5.5 inside its 2.5 px border), 142 wide (it overhangs the 148 px box
  // by 2 px), 10 / 4 padding.
  detectLabel: {
    position: 'absolute',
    top: 5.5,
    start: 5.5,
    width: 142,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: 14,
  },
  detectText: {
    lineHeight: 20,
  },
  // Figma: the header starts 18 px under the grabber; 6 px between the photo and the name.
  head: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.oneHalf,
  },
  // Figma: SemiBold 20, line height normal (30).
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 30,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.small,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  part: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.option,
  },
  // Figma Tip: text 12 px in, running to 2 px from the end so it stays on one line.
  tip: {
    marginTop: Spacing.threeLess,
    paddingStart: Spacing.twoThreeQuarters,
    paddingEnd: 2,
    paddingVertical: 13,
    borderRadius: Radius.small,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.threeLess,
    // Figma: the buttons sit 32 px above the sheet's bottom edge.
    marginTop: 'auto',
    marginBottom: Spacing.twoThreeQuarters,
  },
  binned: {
    width: 196,
  },
});
