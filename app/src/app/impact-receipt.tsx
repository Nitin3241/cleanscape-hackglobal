import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import { EarthyNote, EarthyNoteAction } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { RECEIPT } from '@/data/impact.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

const PHOTOS = [
  { source: require('@/assets/images/impact/kite-beach-crew.jpg'), label: 'The crew' },
  { source: require('@/assets/images/host/spot-before.jpg'), label: 'The spot before' },
  { source: require('@/assets/images/host/spot-after.jpg'), label: 'The spot after' },
];

/** I7 Clean-up receipt: what the crew did and your share, from check-in and bag weights. */
export default function ImpactReceiptRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Clean-up receipt" subtitle={RECEIPT.subtitle} centred />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View style={[styles.receipt, { borderColor: theme.strokeWeak }]}>
          <View style={styles.between}>
            <ThemedText type="labelSmall" themeColor="brand" style={styles.line20}>
              {RECEIPT.org}
            </ThemedText>
            <ThemedText type="ticketCaption" themeColor="textWeak" style={styles.line17}>
              {RECEIPT.number}
            </ThemedText>
          </View>
          <View accessible accessibilityLabel={`${RECEIPT.total} ${RECEIPT.totalNote}`}>
            <ThemedText type="receiptTotal">{RECEIPT.total}</ThemedText>
            <ThemedText type="meta13" themeColor="textWeak" style={styles.line20}>
              {RECEIPT.totalNote}
            </ThemedText>
          </View>
          <Dashes />
          {RECEIPT.lines.map((line) => (
            <View key={line.label} style={styles.between} accessible accessibilityLabel={`${line.label}: ${line.value}`}>
              <ThemedText type="hint" themeColor="textWeak" style={styles.line21}>
                {line.label}
              </ThemedText>
              <ThemedText type={line.strong ? 'label' : 'link'} style={styles.line21}>
                {line.value}
              </ThemedText>
            </View>
          ))}
          <Dashes />
          <View style={styles.photos}>
            {PHOTOS.map((photo) => (
              <Image
                key={photo.label}
                source={photo.source}
                style={styles.photo}
                contentFit="cover"
                accessible
                accessibilityLabel={photo.label}
              />
            ))}
          </View>
        </View>

        <EarthyNote title={RECEIPT.earthy.title} body={RECEIPT.earthy.body}>
          {/* Correcting a receipt isn't designed yet: says "Coming soon". */}
          <EarthyNoteAction label="Fix receipt" />
        </EarthyNote>
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button
            label="Share"
            variant="secondary"
            flat
            onPress={() => Share.share({ message: RECEIPT.share }).catch(() => {})}
          />
        </View>
        <View style={styles.flex}>
          <Button
            label="Vote next"
            flat
            onPress={() => {
              feedback.play('button.primary');
              router.push('/impact-vote');
            }}
          />
        </View>
      </PairBar>
    </View>
  );
}

/** Dashed rule (Figma: 4 px dashes, 4 px gaps). */
function Dashes() {
  const theme = useTheme();
  return (
    // Figma draws the dashed "Line" with no height, so it takes no space between the 12 px gaps.
    <View style={styles.dashes} aria-hidden>
      <Svg height={1} width="100%" style={styles.dashLine}>
        <Line x1={0} y1={0.5} x2="100%" y2={0.5} stroke={theme.strokeWeak} strokeDasharray="4 4" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma I7 at "normal" line height: 14 → 21, 13 → 20, 11 → 17.
  dashes: {
    height: 0,
  },
  dashLine: {
    position: 'absolute',
    top: -0.5,
  },
  line21: {
    lineHeight: 21,
  },
  line20: {
    lineHeight: 20,
  },
  line17: {
    lineHeight: 17,
  },
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  receipt: {
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: 18,
    borderWidth: 1,
    borderRadius: 24,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photos: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  photo: {
    flex: 1,
    height: 72,
    borderRadius: Radius.small,
  },
});
