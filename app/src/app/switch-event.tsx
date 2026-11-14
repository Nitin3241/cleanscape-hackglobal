import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RouteSheet } from '@/components/ui/route-sheet';
import { TextButton } from '@/components/ui/text-button';
import { Radius, Spacing } from '@/constants/theme';
import { type CleanupEvent, findEvent } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';
import { useRegistration } from '@/state/registration';

/** E1: already booked on the same day. Switch to the new cleanup, or keep the first. */
export default function SwitchEventSheet() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const registration = useRegistration();
  const next = findEvent(id);
  const current = findEvent(registration.eventId ?? undefined);

  return (
    <RouteSheet accessibilityLabel="Already booked that day">
      <View style={styles.heading}>
        <ThemedText type="screenTitle" accessibilityRole="header">
          {`You're already in on ${current.day}`}
        </ThemedText>
        <ThemedText type="hint" themeColor="textWeak">
          {`One clean-up a day keeps every site fully crewed. Switch if ${next.title.replace(' litter walk', '').replace(' cleanup', '')} suits you better.`}
        </ThemedText>
      </View>

      <View style={styles.choices}>
        <Choice event={current} badge="Booked" />
        <Icon name="chevron-down" size={20} color="textWeak" />
        <Choice event={next} badge="New" selected />
      </View>

      <View style={styles.actions}>
        <Button
          label="Switch"
          size="large"
          feedbackEvent="register.success"
          onPress={() => {
            registration.register(next.id, registration.friends);
            router.replace('/registered');
          }}
        />
        {/* Figma E1: Keep mine opens R7, the clean-up you're already booked on. */}
        <TextButton label="Keep mine" onPress={() => router.replace({ pathname: '/event-detail', params: { id: current.id } })} />
      </View>
    </RouteSheet>
  );
}

function Choice({ event, badge, selected = false }: { event: CleanupEvent; badge: string; selected?: boolean }) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${badge}: ${event.title}, ${event.when}`}
      style={[
        styles.choice,
        selected
          ? { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 1.5 }
          : { backgroundColor: theme.card, borderColor: theme.strokeControl },
      ]}>
      <View style={[styles.thumb, { backgroundColor: theme.fill }]}>
        {event.thumb ? (
          <SvgXml xml={event.thumb} width={52} height={52} />
        ) : (
          // Figma crops the full 325 × 132 card art at (-150, -50).
          <View style={styles.thumbArt}>
            <SvgXml xml={event.artwork} width={325} height={132} />
          </View>
        )}
      </View>
      <View style={styles.text}>
        <ThemedText type="avatar" themeColor="brand">
          {event.when}
        </ThemedText>
        <ThemedText type="label">{event.title}</ThemedText>
      </View>
      <View style={[styles.badge, { backgroundColor: selected ? theme.brand : theme.surface }]}>
        <ThemedText type="avatar" themeColor={selected ? 'textOnBrand' : 'textWeak'}>
          {badge}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: Spacing.oneHalf,
  },
  choices: {
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  choice: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
    borderWidth: 1,
    borderRadius: Radius.small,
  },
  thumb: {
    width: 52,
    height: 52,
    overflow: 'hidden',
    borderRadius: Radius.control,
  },
  thumbArt: {
    position: 'absolute',
    start: -150,
    top: -50,
  },
  text: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  actions: {
    gap: Spacing.three,
    alignItems: 'stretch',
  },
});
