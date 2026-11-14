import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote, EarthyNoteAction, TileRows } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar, PhotoTag } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { SPOT_CHECK } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/** F10·19 Before / after — stayed clean. SAMPLE: Earthy's verdict and counts are fixed. */
export default function BeforeAfterRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Figma F10·19: Done goes on to F10·11 Litter radar.
  const done = () => router.replace('/litter-radar');

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Kite Beach" subtitle={SPOT_CHECK.afterSub} centred onBack={done} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View
          style={[styles.verdict, { backgroundColor: theme.statusSuccessSubtle }]}
          accessible
          accessibilityLabel={`${SPOT_CHECK.verdict}. ${SPOT_CHECK.counts}`}>
          <View style={[styles.tick, { backgroundColor: theme.statusSuccess }]}>
            <Icon name="check" size={16} color="textOnBrand" strokeWidth={2.2} />
          </View>
          <View style={styles.flex}>
            <ThemedText type="placeTitle" style={styles.verdictTitle}>
              {SPOT_CHECK.verdict}
            </ThemedText>
            <ThemedText type="caption" themeColor="textWeak" style={styles.verdictSub}>
              {SPOT_CHECK.counts}
            </ThemedText>
          </View>
        </View>

        <View style={styles.photos}>
          <View style={styles.photo}>
            <Image
              source={require('@/assets/images/host/spot-before.jpg')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessible
              accessibilityLabel="Before, 14 Nov: litter on the sand"
            />
            <PhotoTag text={SPOT_CHECK.before} style={styles.tag} />
          </View>
          <View style={styles.photo}>
            <Image
              source={require('@/assets/images/host/spot-after.jpg')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessible
              accessibilityLabel="After, 28 Nov: the same beach, clean"
            />
            <PhotoTag text={SPOT_CHECK.after} style={styles.tag} />
          </View>
        </View>

        <EarthyNote title={SPOT_CHECK.compareTitle} body={SPOT_CHECK.earthyNote}>
          {/* Editing Earthy's counts isn't designed yet: says "Coming soon". */}
          <EarthyNoteAction label="Fix count" />
        </EarthyNote>

        <TileRows rows={SPOT_CHECK.next} />
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button
            label="Share result"
            variant="secondary"
            flat
            onPress={() =>
              Share.share({ message: SPOT_CHECK.share }).catch(() => {
                // The share sheet was closed or isn't available; nothing to do.
              })
            }
          />
        </View>
        <View style={styles.flex}>
          <Button
            label="Done"
            flat
            onPress={() => {
              feedback.play('button.primary');
              done();
            }}
          />
        </View>
      </PairBar>
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma verdict: 17 semibold → 26, 12 regular → 18 ("normal" line height).
  verdictTitle: {
    lineHeight: 26,
  },
  verdictSub: {
    lineHeight: 18,
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
  verdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.twoThreeQuarters,
    borderRadius: Radius.option,
  },
  tick: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  photos: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  photo: {
    flex: 1,
    height: 200,
    overflow: 'hidden',
    borderRadius: Radius.option,
  },
  tag: {
    start: Spacing.two,
    bottom: Spacing.two,
  },
});
