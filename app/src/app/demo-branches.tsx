import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinkGroup, type LinkItem } from '@/components/ui/link-group';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { shareSite } from '@/state/calendar';
import { resetInsight } from '@/state/insights';
import { setOnboarded } from '@/state/onboarded';

const chat = (start: string) => () => router.push({ pathname: '/earthy-chat', params: { start } });

/**
 * X0 Demo branches (prototype only, from Profile → Settings): edge states to show in a demo that a normal
 * tap-through never reaches. Every row opens its state.
 */
export default function DemoBranchesRoute() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const groups: { title: string; items: LinkItem[] }[] = [
    {
      title: 'Report litter',
      items: [
        { title: 'Hazard spotted', detail: 'Broken glass, don’t touch it', onPress: () => router.push({ pathname: '/report-review', params: { kind: 'hazard' } }) },
        { title: 'Already reported nearby', detail: 'Add +1 instead', onPress: () => router.push({ pathname: '/report-review', params: { kind: 'already' } }) },
      ],
    },
    {
      // F4·2q1–q4 aren't linked from any frame in the Figma prototype, so the quiz starts here.
      title: 'Know your waste',
      items: [{ title: 'Plastic quiz', detail: '3 questions, then your score', href: '/plastic-quiz' }],
    },
    {
      title: 'Bag log',
      items: [{ title: 'Crew head weighs bag #14', detail: 'Crew head view', href: '/bag-weigh' }],
    },
    {
      title: 'First launch',
      items: [
        {
          title: 'Splash, first launch',
          detail: 'Starts onboarding',
          onPress: () => setOnboarded(false).then(() => router.replace('/')),
        },
      ],
    },
    {
      title: 'Hosting',
      items: [
        { title: 'EEG asked for changes', detail: 'The review came back with one fix', href: '/host-changes' },
        { title: 'Check the spot', detail: '2 weeks after the clean-up', href: '/check-spot' },
      ],
    },
    {
      title: 'Earthy',
      items: [
        { title: 'Gloves mode', detail: 'Hands-free bag logging', onPress: chat('gloves') },
        { title: 'Earthy isn’t sure', detail: 'A scan with two possible answers', href: '/scan-unsure' },
        { title: 'Locked for under 13', detail: 'Earthy is off until a parent allows it', onPress: chat('locked') },
      ],
    },
    {
      title: 'Other states',
      items: [
        {
          title: 'Site changed',
          detail: 'Update your calendar',
          onPress: () => {
            shareSite();
            router.navigate('/home');
          },
        },
        { title: 'First clean-up', detail: 'My impact when it is still empty', onPress: () => router.push({ pathname: '/impact', params: { empty: '1' } }) },
        {
          title: 'Class story ready',
          detail: 'After your class clean-up',
          onPress: () => resetInsight('class-impact').then(() => router.push('/class-impact')),
        },
      ],
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Demo branches" subtitle="Edge cases to show in a demo" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]} showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <LinkGroup key={group.title} title={group.title} items={group.items} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    padding: Spacing.three,
  },
});
