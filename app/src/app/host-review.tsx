import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOST_BAR_HEIGHT, HostBottomBar, HostEventCard } from '@/components/host/host-parts';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { HOST_REVIEW } from '@/data/host.sample';
import { useTheme } from '@/hooks/use-theme';

type StepState = (typeof HOST_REVIEW.steps)[number]['state'];

/**
 * F10·16 Sent to EEG — in review. "Done" goes on to F10·17 You're live, standing in for EEG's approval in
 * this demo. "Cancel request" takes the host back to F10·10. SAMPLE: nothing was sent.
 */
export default function HostReviewRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const home = () => router.replace('/home');

  return (
    <View style={[styles.screen, { backgroundColor: theme.card }]}>
      <ScreenHeader title="Your clean-up" centred onBack={home} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: HOST_BAR_HEIGHT + insets.bottom + Spacing.three }]}>
        <HostEventCard status="review" />
        <ThemedText type="heading" accessibilityRole="header">
          Sent to EEG
        </ThemedText>
        <ThemedText type="body14" themeColor="textWeak">
          {HOST_REVIEW.body}
        </ThemedText>

        <View style={[styles.progress, { backgroundColor: theme.loaderCard }]}>
          {HOST_REVIEW.steps.map((step, index) => (
            <View
              key={step.title}
              style={styles.step}
              accessible
              accessibilityLabel={`${step.title}, ${step.state === 'done' ? 'done' : step.state === 'current' ? 'now' : 'next'}. ${step.body}`}>
              <View style={styles.rail}>
                <Mark state={step.state} />
                {index < HOST_REVIEW.steps.length - 1 && (
                  <View style={[styles.line, { backgroundColor: step.state === 'done' ? theme.statusSuccess : theme.seatEmpty }]} />
                )}
              </View>
              <View style={styles.stepText}>
                <ThemedText type="labelMedium14" themeColor={step.state === 'todo' ? 'textWeak' : 'textStrong'} style={styles.stepTitle}>
                  {step.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="textWeak">
                  {step.body}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <ThemedText type="labelSmall" themeColor="textWeak" accessibilityRole="header">
          While you wait
        </ThemedText>
        <View style={[styles.list, { backgroundColor: theme.card, borderColor: theme.strokeCard }]}>
          <WaitRow icon="user-plus" title="Add a co-host" body="Shares the lead on the day" onPress={() => router.push('/host-co-host')} />
          <WaitRow
            icon="pencil"
            title="Edit details"
            body="Changes go to EEG with your request"
            divider
            onPress={() => router.push('/cleanup-details')}
          />
        </View>

        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Cancel request"
          onPress={() => router.replace('/cleanup-draft')}
          style={styles.cancel}>
          <ThemedText type="labelMedium14" themeColor="levelHighText" style={styles.stepTitle}>
            Cancel request
          </ThemedText>
        </Tappable>
      </ScrollView>

      <HostBottomBar>
        <Button label="Done" flat onPress={() => router.replace('/host-live')} />
      </HostBottomBar>
    </View>
  );
}

/** Rail marks: solid green tick (done), marigold ring with a dot (now), hollow ring (next). */
function Mark({ state }: { state: StepState }) {
  const theme = useTheme();
  if (state === 'done') {
    return (
      <View style={[styles.mark, { backgroundColor: theme.statusSuccess }]}>
        <Icon name="check" size={14} color="textOnBrand" strokeWidth={2.5} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.mark, { backgroundColor: theme.card, borderColor: theme.reviewPending, borderWidth: 2 }]}>
        <View style={[styles.core, { backgroundColor: theme.reviewPending }]} />
      </View>
    );
  }
  return <View style={[styles.mark, { backgroundColor: theme.card, borderColor: theme.strokeCoHost, borderWidth: 1.5 }]} />;
}

function WaitRow({
  icon,
  title,
  body,
  divider = false,
  onPress,
}: {
  icon: IconName;
  title: string;
  body: string;
  divider?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      onPress={onPress}
      style={[styles.row, divider && { borderTopWidth: 1, borderTopColor: theme.strokeCard }]}>
      <Icon name={icon} size={20} color="brand" strokeWidth={1.6} />
      <View style={styles.stepText}>
        <ThemedText type="bodyMedium14">{title}</ThemedText>
        <ThemedText type="caption" themeColor="textWeak">
          {body}
        </ThemedText>
      </View>
      <Icon name="chevron-end" size={14} color="textStrong" strokeWidth={2} />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  progress: {
    padding: Spacing.three,
    borderRadius: Radius.card,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  rail: {
    alignItems: 'center',
  },
  mark: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  core: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    height: 26,
  },
  stepText: {
    flex: 1,
    gap: 1,
  },
  stepTitle: {
    lineHeight: 20,
  },
  list: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
  },
  cancel: {
    alignSelf: 'center',
    paddingTop: Spacing.one,
  },
});
