import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CheckBox } from '@/components/ui/check-box';
import { RouteSheet } from '@/components/ui/route-sheet';
import { Tappable } from '@/components/ui/tappable';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { SAMPLE_FRIEND, SAMPLE_NEXT_ON_WAITLIST } from '@/data/events.sample';
import { feedback } from '@/feedback';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** E7: confirm cancelling. The spot goes straight to the next person on the waitlist. */
export default function CancelSpotSheet() {
  const theme = useTheme();
  const registration = useRegistration();
  const [alsoFriend, setAlsoFriend] = useState(true);
  const eventId = registration.eventId ?? undefined;

  return (
    <RouteSheet accessibilityLabel="Cancel your spot">
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          Cancel your spot?
        </ThemedText>
        <ThemedText type="hint" themeColor="textWeak">
          {`No problem. Your spot goes straight to ${SAMPLE_NEXT_ON_WAITLIST}, who's next on the waitlist.`}
        </ThemedText>
      </View>

      {registration.friends > 0 && (
        <Tappable
          accessibilityRole="checkbox"
          accessibilityLabel={`Also cancel ${SAMPLE_FRIEND.name}'s spot`}
          accessibilityState={{ checked: alsoFriend }}
          onPress={() => setAlsoFriend((value) => !value)}
          style={[
            styles.option,
            alsoFriend
              ? { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 1.5 }
              : { backgroundColor: theme.card, borderColor: theme.strokeControl },
          ]}>
          <View style={styles.optionText}>
            <ThemedText type="label">{`Also cancel ${SAMPLE_FRIEND.name}'s spot`}</ThemedText>
            <ThemedText type="meta" themeColor="textWeak">
              {"We'll let him know by SMS"}
            </ThemedText>
          </View>
          <CheckBox checked={alsoFriend} />
        </Tappable>
      )}

      <View style={styles.actions}>
        <Button label="Keep spot" size="large" onPress={() => router.back()} />
        <TextButton
          label="Cancel my spot"
          color="textAccent"
          onPress={() => {
            feedback.play('register.cancel');
            registration.cancel();
            router.dismissTo({ pathname: '/event-detail', params: { id: eventId, cancelled: '1' } });
          }}
        />
      </View>
    </RouteSheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.oneHalf,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  optionText: {
    flex: 1,
  },
  actions: {
    gap: Spacing.three,
  },
});
