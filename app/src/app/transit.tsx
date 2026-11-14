import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { TabBar } from '@/components/ui/tab-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Radius, Spacing, TabBarHeight, ThemeColor } from '@/constants/theme';
import { TRANSIT } from '@/data/events.sample';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const STEP_STYLE: Record<string, { icon: IconName; tone: ThemeColor; color: ThemeColor }> = {
  walk: { icon: 'walk', tone: 'surface', color: 'textWeak' },
  metro: { icon: 'train', tone: 'metroRed', color: 'textOnBrand' },
  bus: { icon: 'bus', tone: 'brand', color: 'textOnBrand' },
};

/** T2: the metro and bus route, step by step, with a nudge towards carpooling. */
export default function TransitRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const carpoolAllowed = !(registration.under18 && registration.guardian === 'transit');
  const loading = useSampleLoading();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Metro + bus" subtitle={TRANSIT.summary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TabBarHeight + insets.bottom + 120 }}>
        <View style={styles.map}>
          <ZoomableMap controls={{ bottom: Spacing.two, end: Spacing.two }}>
            <MapArt left={-80} top={-170} zoom={600 / 510} />
          </ZoomableMap>
        </View>
        <View style={styles.content}>
          <View accessibilityRole="list">
            {TRANSIT.steps.map((step, index) => {
              const look = STEP_STYLE[step.kind];
              const last = index === TRANSIT.steps.length - 1;
              return (
                <Skeleton loading={loading} key={step.title} order={index} radius={Radius.small}>
                  <View style={styles.step} accessible accessibilityLabel={`${step.time}. ${step.title}. ${step.detail}`}>
                    <View style={styles.rail}>
                      <View style={[styles.stepIcon, { backgroundColor: theme[look.tone] }]}>
                        <Icon name={look.icon} size={14} color={look.color} strokeWidth={1.75} />
                      </View>
                      {!last && <View style={[styles.line, { backgroundColor: theme.strokeWeak }]} />}
                    </View>
                    <View style={styles.stepText}>
                      <ThemedText type="label">{step.title}</ThemedText>
                      <ThemedText type="meta" themeColor="textWeak">
                        {step.detail}
                      </ThemedText>
                    </View>
                    <ThemedText type="labelSmall" themeColor="brand">
                      {step.time}
                    </ThemedText>
                  </View>
                </Skeleton>
              );
            })}
          </View>
          <Skeleton loading={loading} order={TRANSIT.steps.length} radius={Radius.small}>
            <View style={[styles.home, { backgroundColor: theme.card, borderColor: theme.strokeWeak }]}>
              <ThemedText type="label">Getting home</ThemedText>
              <ThemedText type="meta" themeColor="textWeak">
                {TRANSIT.home}
              </ThemedText>
            </View>
          </Skeleton>
        </View>
      </ScrollView>
      {carpoolAllowed && (
        <StickyFooter variant="glass">
          <View>
            <ThemedText type="label">Or carpool</ThemedText>
            <ThemedText type="small" themeColor="textWeak">
              3 drivers nearby
            </ThemedText>
          </View>
          <View style={styles.footerButton}>
            <Button label="Find rides" flat onPress={() => router.push('/rides')} />
          </View>
        </StickyFooter>
      )}
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    height: 170,
    overflow: 'hidden',
  },
  content: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  rail: {
    alignItems: 'center',
    width: 28,
  },
  stepIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 24,
  },
  stepText: {
    flex: 1,
    paddingBottom: Spacing.threeHalf,
  },
  home: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.option,
  },
  footerButton: {
    flex: 1,
    maxWidth: 200,
  },
});
