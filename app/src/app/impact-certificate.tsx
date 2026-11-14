import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { StepSpinner } from '@/components/earthy/step-spinner';
import { EarthyNote, TileRows } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar } from '@/components/host/photo-parts';
import { CertificateCard } from '@/components/impact/certificate-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Shimmer } from '@/components/ui/reveal-block';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DoneMark, PendingRing } from '@/components/ui/staged-loader';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { CERTIFICATE, CERTIFICATE_SETUP } from '@/data/impact.sample';
import { useTheme } from '@/hooks/use-theme';
import { showComingSoon } from '@/state/coming-soon';

// Same loader timing as F10·10a: steps start 0.3 s apart by 0.62 s, spin 0.5 s, then the result shows.
const STARTS = [300, 920, 1540];
const SPIN = 500;
const TOTAL = 2600;
const BAR = 200;

type StepState = 'pending' | 'active' | 'done';

/** I3s Certificate — Earthy preparing (loader), then I4 Certificate ready. Plays once. */
export default function ImpactCertificateRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Certificate" subtitle={ready ? CERTIFICATE.readySubtitle : CERTIFICATE_SETUP.subtitle} centred />
      {ready ? <Ready bottom={PAIR_BAR_HEIGHT + insets.bottom + Spacing.three} /> : <Preparing onDone={() => setReady(true)} />}
      {ready && (
        <PairBar>
          <View style={styles.flex}>
            {/* Saving a PDF needs the certificate service: says "Coming soon". */}
            <Button label="Download PDF" flat />
          </View>
        </PairBar>
      )}
    </View>
  );
}

function Preparing({ onDone }: { onDone: () => void }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [states, setStates] = useState<StepState[]>(() => CERTIFICATE.steps.map(() => 'pending'));
  const fill = useSharedValue(reducedMotion ? BAR : 0);

  useEffect(() => {
    const timers = STARTS.flatMap((begin, index) => [
      setTimeout(() => setStates((s) => s.map((v, i) => (i === index ? 'active' : v))), begin),
      setTimeout(() => setStates((s) => s.map((v, i) => (i === index ? 'done' : v))), begin + SPIN),
    ]);
    timers.push(setTimeout(onDone, TOTAL));
    if (!reducedMotion) fill.set(withTiming(BAR, { duration: TOTAL, easing: Easing.bezier(0.37, 0, 0.63, 1) }));
    return () => timers.forEach(clearTimeout);
    // Plays once for the life of the screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barStyle = useAnimatedStyle(() => ({ width: fill.get() }));
  const current = states.findIndex((s) => s !== 'done');

  return (
    <View style={styles.body} accessibilityLiveRegion="polite">
      <View style={[styles.preparing, { backgroundColor: theme.fill }]}>
        <EarthyOrb size={56} state={reducedMotion ? 'still' : 'thinking'} glow={false} />
        <ThemedText type="headerTitle" accessibilityRole="header" style={styles.line24}>
          {CERTIFICATE.preparing}
        </ThemedText>
        <View style={[styles.track, { backgroundColor: theme.card }]}>
          <Animated.View style={[styles.bar, { backgroundColor: theme.brand }, barStyle]} />
        </View>
        <View style={styles.steps}>
          {CERTIFICATE.steps.map((label, index) => (
            <View
              key={label}
              style={styles.step}
              accessible
              accessibilityLabel={`${label}, ${states[index] === 'done' ? 'done' : states[index] === 'active' ? 'in progress' : 'waiting'}`}>
              <View style={styles.mark}>
                {states[index] === 'done' ? (
                  <DoneMark />
                ) : states[index] === 'active' ? (
                  <StepSpinner size={20} />
                ) : (
                  <PendingRing />
                )}
              </View>
              <ThemedText
                type={index === current || (current === -1 && index === states.length - 1) ? 'labelMedium14' : 'hint'}
                themeColor={index === current || (current === -1 && index === states.length - 1) ? 'textStrong' : 'textWeak'}
                style={styles.line21}>
                {label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.skeleton, { backgroundColor: theme.strokeCard }]} accessibilityElementsHidden>
        {[
          { top: 22, width: 110, height: 10 },
          { top: 48, width: 200, height: 22 },
          { top: 90, width: 260, height: 10 },
          { top: 108, width: 230, height: 10 },
          { top: 126, width: 180, height: 10 },
          { top: 184, width: 120, height: 10 },
        ].map((line) => (
          <View
            key={line.top}
            style={[
              styles.bone,
              {
                top: line.top,
                width: line.width,
                height: line.height,
                borderRadius: line.height / 2,
                backgroundColor: theme.card,
              },
            ]}
          />
        ))}
        <Shimmer />
      </View>
    </View>
  );
}

function Ready({ bottom }: { bottom: number }) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: bottom }]}>
        <View style={[styles.stage, { backgroundColor: theme.loaderCard }]}>
          {/* Full-size view isn't designed yet: "Tap to view full size" says "Coming soon". */}
          <Tappable accessibilityRole="button" accessibilityLabel="View the certificate full size">
            <CertificateCard />
          </Tappable>
          <ThemedText type="filterLabelTight" themeColor="brand" style={styles.line18}>
            Tap to view full size
          </ThemedText>
        </View>
        <EarthyNote title={CERTIFICATE.earthy.title} body={CERTIFICATE.earthy.body} />
        <TileRows
          rows={[
            {
              title: 'Share link',
              body: 'Anyone with it can verify',
              icon: 'share',
              onPress: () => Share.share({ message: CERTIFICATE.share }).catch(() => {}),
            },
            // Emailing a teacher needs the certificate service: "Coming soon" until then.
            { title: 'Send to my teacher', body: 'Attaches the PDF', icon: 'mail', onPress: () => showComingSoon() },
          ]}
        />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Figma I3s / I4 at "normal" line height: 16 → 24, 14 → 21, 12 → 18.
  line24: {
    lineHeight: 24,
  },
  line21: {
    lineHeight: 21,
  },
  line18: {
    lineHeight: 18,
  },
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  preparing: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.threeHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
  },
  track: {
    width: BAR,
    height: 6,
    overflow: 'hidden',
    borderRadius: 3,
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },
  steps: {
    alignSelf: 'stretch',
    gap: Spacing.twoThreeQuarters,
    paddingTop: Spacing.one,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  mark: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    height: 230,
    overflow: 'hidden',
    borderRadius: Radius.option,
  },
  bone: {
    position: 'absolute',
    left: 20,
  },
  stage: {
    alignItems: 'center',
    gap: Spacing.twoHalf,
    paddingTop: Spacing.threeHalf,
    paddingBottom: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.threeLess,
    borderRadius: 24,
  },
});
