import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EarthyNote } from '@/components/host/earthy-note';
import { PAIR_BAR_HEIGHT, PairBar } from '@/components/host/photo-parts';
import { ThemedText } from '@/components/themed-text';
import { FigmaLines } from '@/constants/figma-lines';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { REPORT_STATUS } from '@/data/reports.sample';
import { useTheme } from '@/hooks/use-theme';

type StepState = (typeof REPORT_STATUS.steps)[number]['state'];

/** R1·4 Your report — status: from "Track report" on R1·3. Sent → Earthy → neighbours confirm → EEG → cleaned. */
export default function ReportStatusRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const done = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Your report" subtitle={REPORT_STATUS.subtitle} centred onBack={done} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: PAIR_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <View
          style={[styles.card, styles.summary, { borderColor: theme.strokeWeak }]}
          accessible
          accessibilityLabel={`${REPORT_STATUS.summary.title}. ${REPORT_STATUS.summary.body}`}>
          <Image
            source={require('@/assets/images/host/spot-before.jpg')}
            style={styles.thumb}
            contentFit="cover"
            accessible={false}
          />
          <View style={styles.text}>
            <ThemedText style={FigmaLines.l23} type="reasonTitle">
              {REPORT_STATUS.summary.title}
            </ThemedText>
            <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
              {REPORT_STATUS.summary.body}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.card, styles.timeline, { borderColor: theme.strokeWeak }]}>
          {REPORT_STATUS.steps.map((step, index) => {
            const last = index === REPORT_STATUS.steps.length - 1;
            const todo = step.state === 'todo';
            return (
              <View
                key={step.title}
                style={styles.step}
                accessible
                accessibilityLabel={`${step.title}, ${step.state === 'done' ? 'done' : step.state === 'now' ? 'now' : 'next'}. ${step.body}`}>
                <View style={styles.marker}>
                  <Dot state={step.state} />
                  {!last && (
                    <View
                      style={[styles.line, { backgroundColor: step.state === 'done' ? theme.statusSuccess : theme.strokeChip }]}
                    />
                  )}
                </View>
                <View style={[styles.text, styles.stepText]}>
                  <ThemedText type={todo ? 'reasonTitleRegular' : 'reasonTitle'} themeColor={todo ? 'textWeak' : 'textStrong'} style={FigmaLines.l23}>
                    {step.title}
                  </ThemedText>
                  <ThemedText style={FigmaLines.l18} type="caption" themeColor="textWeak">
                    {step.body}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        <EarthyNote title={REPORT_STATUS.earthy.title} body={REPORT_STATUS.earthy.body} />
      </ScrollView>

      <PairBar>
        <View style={styles.flex}>
          <Button
            label="Share report"
            variant="secondary"
            flat
            onPress={() => Share.share({ message: REPORT_STATUS.share }).catch(() => {})}
          />
        </View>
        <View style={styles.flex}>
          <Button label="Done" flat onPress={done} />
        </View>
      </PairBar>
    </View>
  );
}

function Dot({ state }: { state: StepState }) {
  const theme = useTheme();
  if (state === 'done') {
    return (
      <View style={[styles.dot, { backgroundColor: theme.statusSuccess }]}>
        <Icon name="check" size={14} color="textOnBrand" strokeWidth={2.5} />
      </View>
    );
  }
  if (state === 'now')
    return <View style={[styles.dot, { backgroundColor: theme.card, borderWidth: 6, borderColor: theme.brand }]} />;
  return <View style={[styles.dot, { backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.strokeChip }]} />;
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
  card: {
    borderWidth: 1,
    borderRadius: 24,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.small,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  timeline: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.twoThreeQuarters,
  },
  marker: {
    width: 22,
    alignItems: 'center',
  },
  dot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  // Figma "Line": a 2 × 10 stub under each dot, not a continuous rail.
  line: {
    width: 2,
    height: 10,
  },
  stepText: {
    paddingBottom: 18,
  },
});
