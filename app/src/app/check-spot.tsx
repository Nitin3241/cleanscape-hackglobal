import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote, TileRows } from '@/components/host/earthy-note';
import { FrameCorners, PAIR_BAR_HEIGHT, PairBar, PhotoTag } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { SPOT_CHECK } from '@/data/host.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';

/**
 * F10·18 Check the spot — 2 weeks later. The host retakes the first photo from the same place.
 * SAMPLE: "Take photo" skips the camera and shows F10·19 with Figma's after photo.
 */
export default function CheckSpotRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Check the spot" subtitle={SPOT_CHECK.place} centred onBack={close} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <EarthyNote title={SPOT_CHECK.title} body={SPOT_CHECK.body} />
        <ThemedText type="eventTitle" accessibilityRole="header" style={styles.section}>
          Match this view
        </ThemedText>
        <View style={styles.photo}>
          <Image
            source={require('@/assets/images/host/spot-before.jpg')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessible
            accessibilityLabel="The first photo of Kite Beach, from 14 Nov, with litter on the sand"
          />
          <PhotoTag text={SPOT_CHECK.before} style={styles.tag} />
          <FrameCorners />
        </View>
        <TileRows rows={SPOT_CHECK.tips} />
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button label="Not now" variant="secondary" flat onPress={close} />
        </View>
        <View style={styles.flex}>
          <Button
            label="Take photo"
            flat
            onPress={() => {
              feedback.play('button.primary');
              router.replace('/before-after');
            }}
          />
        </View>
      </PairBar>
    </View>
  );
}

const styles = StyleSheet.create({
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
  section: {
    lineHeight: 24,
  },
  photo: {
    height: 236,
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  tag: {
    top: Spacing.twoThreeQuarters,
    start: Spacing.twoThreeQuarters,
  },
});
