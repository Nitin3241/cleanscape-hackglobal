import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EarthyActions, EarthyAnswer, EarthyAskField, EarthyChoices, EarthySheetHeader } from '@/components/earthy/earthy-sheet-parts';
import { ThemedText } from '@/components/themed-text';
import { RouteSheet } from '@/components/ui/route-sheet';
import { HOST_EARTHY } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

/** F10·10e Earthy · your clean-up (sheet): a co-host suggestion, more Earthy help and an ask field. */
export default function HostEarthySheet() {
  const theme = useTheme();
  const toCoHost = () => router.replace('/host-co-host');

  return (
    <RouteSheet accessibilityLabel="Earthy, helping with Kite Beach clean-up">
      <EarthySheetHeader subtitle={HOST_EARTHY.subtitle} />
      <EarthyAnswer>
        <View style={styles.faces} accessibilityElementsHidden>
          <View style={[styles.face, styles.overlap, { backgroundColor: theme.avatarMarigold }]}>
            <ThemedText type="labelMedium14" themeColor="textOnBrand">
              O
            </ThemedText>
          </View>
          <View style={[styles.face, { backgroundColor: theme.avatarTeal }]}>
            <ThemedText type="labelMedium14" themeColor="textOnBrand">
              L
            </ThemedText>
          </View>
        </View>
        <ThemedText type="answer14">{HOST_EARTHY.insight}</ThemedText>
        <EarthyChoices primary={{ label: 'Ask Omar', onPress: toCoHost }} secondary={{ label: 'Someone else', onPress: toCoHost }} />
      </EarthyAnswer>
      {/* Earthy's answers to these aren't designed yet: each says "Coming soon". */}
      <EarthyActions items={HOST_EARTHY.more} />
      <EarthyAskField placeholder="Ask about your clean-up" />
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  faces: {
    flexDirection: 'row',
  },
  face: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  overlap: {
    marginEnd: -8,
    zIndex: 1,
  },
});
