import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/events/action-button';
import { ListRow } from '@/components/ui/list-row';
import { PassCard } from '@/components/events/pass-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Avatar, Notice } from '@/components/ui/parts';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TabBar } from '@/components/ui/tab-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tappable } from '@/components/ui/tappable';
import { Toast } from '@/components/ui/toast';
import { Radius, Spacing, TabBarHeight } from '@/constants/theme';
import { findEvent, SAMPLE_FRIEND, SAMPLE_GUARDIAN, SAMPLE_RIDES, SAMPLE_USER } from '@/data/events.sample';
import { useSampleLoading } from '@/hooks/use-sample-loading';
import { useTheme } from '@/hooks/use-theme';
import { type GuardianAnswer, useRegistration } from '@/state/registration';

const TOAST_TIME = 4000;
// SAMPLE: the order a long press on the pass tag steps through, standing in for the guardian's reply.
const REVIEW_ANSWERS: readonly GuardianAnswer[] = ['pending', 'approved', 'transit', 'declined'];

/** R6 and its states: the pass, waiting for a guardian (E3, W7), not approved (E11), with a ride (T7). */
export default function PassRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const registration = useRegistration();
  const event = findEvent(registration.eventId ?? undefined);
  const loading = useSampleLoading();
  const [toast, setToast] = useState<string | null>(null);
  const wasInWallet = useRef(registration.walletAdded);
  const ride = SAMPLE_RIDES.find((item) => item.id === registration.rideId);

  useEffect(() => {
    if (registration.walletAdded && !wasInWallet.current) {
      setToast(`Added. It'll pop up on your lock screen when you reach ${event.title.replace(' cleanup', '')}.`);
    }
    wasInWallet.current = registration.walletAdded;
  }, [event.title, registration.walletAdded]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_TIME);
    return () => clearTimeout(timer);
  }, [toast]);

  if (registration.status === 'none' || registration.status === 'waitlisted') {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <ScreenHeader title="Your pass" />
        <View style={styles.empty}>
          <EmptyState
            art={<Icon name="wallet" size={48} color="brand" strokeWidth={1.25} />}
            title={registration.status === 'waitlisted' ? "You're on the waitlist" : 'No pass yet'}
            body="Your pass appears here once you have a spot at a cleanup.">
            <Button label="Find a cleanup" flat onPress={() => router.navigate('/events')} />
          </EmptyState>
        </View>
        <TabBar active="events" />
      </View>
    );
  }

  const waiting = registration.status === 'waiting';
  const declined = registration.status === 'declined';
  const crew = registration.friends > 0 ? `You + ${SAMPLE_FRIEND.name}` : registration.under18 ? 'You' : 'Just you';
  const guardianPhone = registration.guardianPhone || SAMPLE_GUARDIAN.phone;
  const time = event.slot.split(' · ')[1].replace('–', ' – ');

  function reviewNextAnswer() {
    if (!registration.under18) return;
    const index = REVIEW_ANSWERS.indexOf(registration.guardian);
    registration.answerAsGuardian(REVIEW_ANSWERS[(index + 1) % REVIEW_ANSWERS.length]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Your pass" action={{ icon: 'share', label: 'Share' }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TabBarHeight + insets.bottom + Spacing.four }]}>
        <Skeleton loading={loading} radius={24} lines="card">
          <PassCard
            eyebrow="Clean UAE 2026 · Dubai"
            title={event.title}
            fields={[
              { label: 'Date', value: event.day },
              { label: 'Time', value: time },
              { label: 'Crew', value: crew },
            ]}
            tag={
              waiting
                ? { label: 'Waiting for approval', dot: 'secondary' }
                : declined
                  ? { label: 'Not approved', dot: 'secondary' }
                  : { label: "You're going", dot: 'unreadDot' }
            }
            onTagLongPress={reviewNextAnswer}
            stub={
              waiting
                ? {
                    kind: 'message',
                    icon: 'hourglass',
                    title: `Waiting for ${SAMPLE_GUARDIAN.name} to approve`,
                    body: `Sent just now on ${registration.guardianChannel} to ${guardianPhone}`,
                    actions: [
                      { label: 'Resend link', onPress: () => setToast(`Link sent again to ${guardianPhone}`) },
                      {
                        label: 'Change number',
                        onPress: () => router.push({ pathname: '/guardian-request', params: { id: event.id } }),
                      },
                    ],
                  }
                : declined
                  ? {
                      kind: 'message',
                      icon: 'info',
                      title: `${SAMPLE_GUARDIAN.name} didn't approve this one`,
                      body: 'Your spot has been released for someone else',
                      actions: [
                        {
                          label: 'Find another cleanup',
                          onPress: () => {
                            registration.reset();
                            router.navigate('/events');
                          },
                        },
                        { label: 'Ask again', onPress: () => registration.answerAsGuardian('pending') },
                      ],
                    }
                  : { kind: 'qr', value: `CLEANSCAPE-PASS:${SAMPLE_USER.passCode}`, caption: 'Show this at the check-in tent' }
            }
          />
        </Skeleton>

        {ride && registration.ride !== 'none' && !declined && (
          <Skeleton loading={loading} order={1} radius={Radius.small}>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel={`Your ride with ${ride.driver.name}, ${ride.pickupTime} from ${ride.pickup}. Open chat`}
              delayLongPress={600}
              // SAMPLE: a long press stands in for the driver cancelling, to show the rematch.
              onLongPress={() => {
                registration.driverCancels();
                router.push('/ride-rematch');
              }}
              onPress={() => router.push(registration.ride === 'accepted' ? '/ride-chat' : '/ride')}
              style={[styles.ride, { backgroundColor: theme.card, borderColor: theme.brand }]}>
              <Avatar initials={ride.driver.initials} tone={ride.driver.tone} />
              <View style={styles.rideText}>
                <ThemedText type="label">{`Your ride · ${ride.driver.name.split(' ')[0]}`}</ThemedText>
                <ThemedText type="meta" themeColor="textWeak">
                  {registration.ride === 'requested' ? 'Request sent · waiting for a reply' : `${ride.pickupTime} · ${ride.pickup}`}
                </ThemedText>
              </View>
              <View style={[styles.rideChat, { backgroundColor: theme.fill }]}>
                <Icon name="chat" size={18} color="brand" strokeWidth={1.5} />
              </View>
            </Tappable>
          </Skeleton>
        )}

        {!declined && (
          <View style={styles.actions}>
            <ActionButton
              icon={registration.walletAdded ? 'check' : 'wallet'}
              label={registration.walletAdded ? 'In Wallet' : 'Add to Wallet'}
              tone={registration.walletAdded ? 'added' : 'marigold'}
              disabled={waiting}
              onPress={() => router.push(registration.walletAdded ? '/wallet-pass' : '/wallet')}
            />
            <ActionButton icon="navigate" label="Directions" tone="outline" onPress={() => router.push('/directions')} />
          </View>
        )}

        {/* Event day (F11): Earthy's plan for the morning. DEMO: always shown so the flow is reachable. */}
        {!declined && !waiting && (
          <View style={[styles.eventDay, { borderColor: theme.strokeWeak, backgroundColor: theme.card }]}>
            <ListRow
              icon="sun"
              title="It's event day"
              detail="Find your crew, role and zone with Earthy"
              onPress={() => router.push('/event-day')}
            />
          </View>
        )}

        {waiting && (
          <Notice
            icon="shield-check"
            text={`Wallet unlocks once ${SAMPLE_GUARDIAN.name} approves. Your spot is held for 24 hours.`}
          />
        )}
        {declined && <Notice icon="shield-check" text="Try a cleanup closer to home, or one your guardian can join." />}

        {!declined && (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Can't make it? Cancel your spot"
            onPress={() => router.push('/cancel-spot')}
            style={styles.cancel}>
            <ThemedText type="bodyMedium" themeColor="textWeak">
              {"Can't make it? Cancel your spot"}
            </ThemedText>
          </Tappable>
        )}
      </ScrollView>

      {toast && (
        <View pointerEvents="box-none" style={[styles.toast, { bottom: TabBarHeight + insets.bottom + Spacing.two }]}>
          <Toast icon="wallet" text={toast} />
        </View>
      )}
      <TabBar active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  eventDay: {
    borderWidth: 1,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: TabBarHeight,
  },
  ride: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1.5,
    borderRadius: Radius.option,
  },
  rideText: {
    flex: 1,
  },
  rideChat: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  cancel: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
  },
  toast: {
    position: 'absolute',
    start: Spacing.three,
    end: Spacing.three,
  },
});
