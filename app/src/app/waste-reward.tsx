import { router } from 'expo-router';

import { RewardScreen } from '@/components/rewards/reward-screen';
import { SORT_REWARD } from '@/data/waste.sample';

/** F4·11: the sort is done. +2 Smileys, today's count and the next badge. */
export default function WasteRewardRoute() {
  const r = SORT_REWARD;
  return (
    <RewardScreen
      smileys={r.smileys}
      message="Your pizza box is sorted. The lid gets a second life."
      stats={[
        { value: `${r.sortedToday}`, label: 'sorted today' },
        { value: r.streak, label: 'streak' },
        { value: r.total, label: 'Smileys' },
      ]}
      progress={{
        title: `Next badge: ${r.badge}`,
        trailing: `${r.progress} of ${r.goal}`,
        value: r.progress / r.goal,
        note: `${r.goal - r.progress} more correct sorts to unlock pro tier`,
        label: `${r.progress} of ${r.goal} sorts to ${r.badge}`,
      }}
      primary={{ label: 'Done', onPress: () => router.dismissTo('/home') }}
      secondary={{ label: 'Scan more', onPress: () => router.replace('/waste-scan') }}
    />
  );
}
