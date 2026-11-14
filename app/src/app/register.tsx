import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CheckBox } from '@/components/ui/check-box';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconTile, Notice, Stepper } from '@/components/ui/parts';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { findEvent, meetTime, SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

const MAX_FRIENDS = 3;

/** R4: who's coming, then confirm. Under-18s go to guardian approval instead. */
export default function RegisterSheet() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const event = findEvent(id);
  const registration = useRegistration();
  const [friends, setFriends] = useState(1);
  const spots = friends + 1;
  const who = friends === 0 ? 'You join' : friends === 1 ? 'You two join' : `The ${spots} of you join`;

  return (
    <RouteSheet accessibilityLabel={`Join ${event.title}`}>
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          {`Join ${event.title}`}
        </ThemedText>
        <ThemedText type="note" themeColor="textWeak">
          {`${event.day} · ${event.whenLong.split(' · ')[1].replace('–', ' – ')} · ${event.place}`}
        </ThemedText>
      </View>

      <View style={styles.group}>
        <ThemedText type="labelLarge" accessibilityRole="header">
          {"Who's coming"}
        </ThemedText>
        <View
          accessible
          accessibilityLabel={`You, ${SAMPLE_USER.fullName}, coming`}
          style={[styles.option, { backgroundColor: theme.card, borderColor: theme.strokeControl }]}>
          <View style={styles.optionText}>
            <ThemedText type="label">You</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              {`${SAMPLE_USER.fullName} · ${SAMPLE_USER.age}`}
            </ThemedText>
          </View>
          <CheckBox checked />
        </View>
        <View
          style={[
            styles.option,
            friends > 0
              ? { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 1.5 }
              : { backgroundColor: theme.card, borderColor: theme.strokeControl },
          ]}>
          <View style={styles.optionText}>
            <ThemedText type="label">Friends or family</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              {`Up to ${MAX_FRIENDS} · own pass each`}
            </ThemedText>
          </View>
          <Stepper value={friends} min={0} max={MAX_FRIENDS} label="friends" onChange={setFriends} />
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="I'm under 18. A parent approves by SMS"
          onPress={() => router.replace({ pathname: '/guardian-request', params: { id: event.id } })}
          style={[styles.option, { backgroundColor: theme.card, borderColor: theme.strokeControl }]}>
          <IconTile icon="shield-check" size={36} iconSize={18} />
          <View style={styles.optionText}>
            <ThemedText type="label">{"I'm under 18"}</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              A parent approves by SMS
            </ThemedText>
          </View>
          <Icon name="chevron-end" size={20} color="textStrong" />
        </Tappable>
      </View>

      <View style={styles.group}>
        <ThemedText type="labelLarge" accessibilityRole="header">
          Before you go
        </ThemedText>
        <Tip icon="clock" text={`Arrive by ${meetTime(event)} for a 10-min safety briefing`} />
        <Tip icon="hand" text="Gloves, bags and water are provided. Wear closed shoes" />
      </View>

      <Notice
        icon="leaf"
        text={`${who} ${event.going} volunteers aiming to lift 400 kg of litter off ${event.title.replace(' cleanup', '')}.`}
      />

      <View style={styles.confirm}>
        <Button
          label="Confirm"
          accessibilityLabel={`Confirm ${spots} ${spots === 1 ? 'spot' : 'spots'}`}
          size="large"
          feedbackEvent="register.success"
          onPress={() => {
            registration.register(event.id, friends);
            router.replace('/registered');
          }}
        />
        <ThemedText type="meta" themeColor="textWeak" style={styles.centred}>
          Free · Cancel anytime from your pass
        </ThemedText>
      </View>
    </RouteSheet>
  );
}

function Tip({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.tip}>
      <IconTile icon={icon} size={32} iconSize={18} />
      <ThemedText type="hint" style={styles.optionText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.one,
  },
  group: {
    gap: Spacing.twoHalf,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    minHeight: 64,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  optionText: {
    flex: 1,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.twoThreeQuarters,
  },
  confirm: {
    gap: Spacing.twoHalf,
  },
  centred: {
    textAlign: 'center',
  },
});
