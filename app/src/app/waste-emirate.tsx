import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Button } from '@/components/ui/button';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { EMIRATES } from '@/data/waste.sample';
import { useTheme } from '@/hooks/use-theme';
import { setEmirate, useEmirate } from '@/state/emirate';

/** F4·1s Choose your emirate (Figma 817:12774): pick the emirate whose bin rules to show. Fades in, no slide. */
export default function WasteEmirateSheet() {
  const theme = useTheme();
  const saved = useEmirate();
  const [picked, setPicked] = useState(saved);

  return (
    <RouteSheet accessibilityLabel="Your emirate" fadeIn scrim="scrimInk" bottomPadding={Spacing.twoThreeQuarters}>
      <View style={styles.heading}>
        <ThemedText type="sheetTitle" accessibilityRole="header" style={FigmaLines.l30}>
          Your emirate
        </ThemedText>
        <ThemedText type="meta13" themeColor="textWeak" style={FigmaLines.l20}>
          Bin rules change across the UAE. We’ll show yours.
        </ThemedText>
      </View>
      <View style={styles.list} accessibilityRole="radiogroup">
        {EMIRATES.map((emirate) => {
          const selected = emirate.name === picked;
          return (
            <Tappable
              key={emirate.name}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={emirate.rules ? `${emirate.name}. ${emirate.rules}` : emirate.name}
              onPress={() => setPicked(emirate.name)}
              style={[styles.row, selected && { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 1.5 }]}>
              <View style={styles.flex}>
                <ThemedText type={selected ? 'rowTitle' : 'reasonTitle'} style={emirate.rules ? styles.name : FigmaLines.l23}>
                  {emirate.name}
                </ThemedText>
                {emirate.rules && (
                  <ThemedText type="caption" themeColor="textWeak" style={FigmaLines.l18}>
                    {emirate.rules}
                  </ThemedText>
                )}
              </View>
              <View
                style={[
                  styles.radio,
                  { backgroundColor: theme.card, borderColor: selected ? theme.brand : theme.radioRingEmirate },
                ]}>
                {selected && <View style={[styles.radioDot, { backgroundColor: theme.brand }]} />}
              </View>
            </Tappable>
          );
        })}
        {/* Figma "AI/Button Primary": a 48 px pill, 4 px under the last emirate. */}
        <Button
          label="Save"
          pill
          flat
          onPress={() => {
            setEmirate(picked);
            router.back();
          }}
        />
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  // Figma F4·1s: the title block is inset 24 in the sheet (options 16), options start 14 below it.
  heading: {
    gap: 2,
    marginHorizontal: Spacing.two,
    marginBottom: -2,
  },
  list: {
    gap: Spacing.one,
  },
  // Figma "Option": 52 tall, 14 radius; text 14 in (12.5 + the 1.5 border every option keeps), radio 12 from the end.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingStart: 12.5,
    paddingEnd: 10.5,
    paddingVertical: 4.5,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: Radius.medium,
  },
  name: {
    lineHeight: 22,
  },
  flex: {
    flex: 1,
  },
  // Figma radio: 20 px, white, 2 px ring (#AAB7BD off, brand on) with a 10 px brand dot.
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
