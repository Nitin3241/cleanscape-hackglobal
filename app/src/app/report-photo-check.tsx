import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote, TileRows } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar, PhotoTag } from '@/components/host/photo-parts';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { PHOTO_CHECK } from '@/data/reports.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { finishReport } from '@/state/reports';
import { showComingSoon } from '@/state/coming-soon';

/**
 * R1·2p Check your photo: between R1·2 and R1·3, Earthy shows what it blurred (faces, number plates) before
 * the report goes out. SAMPLE: the blur boxes are Figma's; no photo leaves the phone.
 */
export default function ReportPhotoCheckRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Check your photo" subtitle={PHOTO_CHECK.subtitle} centred />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View style={styles.photo}>
          <Image
            source={require('@/assets/images/host/spot-before.jpg')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessible
            accessibilityLabel="Your photo of the litter, with 2 faces and a number plate blurred"
          />
          {PHOTO_CHECK.blurs.map((blur) => (
            <View key={`${blur.left}-${blur.top}`}>
              <View
                style={[
                  styles.blur,
                  { left: blur.left, top: blur.top, width: blur.width, height: blur.height, borderColor: theme.coverTag },
                ]}>
                <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} experimentalBlurMethod="dimezisBlurView" />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.blurVeil }]} />
              </View>
              <PhotoTag text={blur.label} style={{ left: blur.left, top: blur.top + blur.height + 4 }} />
            </View>
          ))}
        </View>
        <EarthyNote title={PHOTO_CHECK.earthy.title} body={PHOTO_CHECK.earthy.body} />
        <TileRows
          rows={[
            // Blurring more by hand isn't built yet: "Coming soon".
            { ...PHOTO_CHECK.missed, icon: 'eye', onPress: () => showComingSoon() },
            { ...PHOTO_CHECK.place, icon: 'pin' },
          ]}
        />
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button label="Retake" variant="secondary" flat onPress={() => router.back()} />
        </View>
        <View style={styles.flex}>
          <Button
            label="Send report"
            flat
            onPress={() => {
              feedback.play('button.primary');
              finishReport();
              router.replace({ pathname: '/report-sent', params: { kind: 'new' } });
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
  photo: {
    height: 260,
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  blur: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.control,
  },
});
