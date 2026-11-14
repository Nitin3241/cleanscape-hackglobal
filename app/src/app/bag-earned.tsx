import { router } from 'expo-router';

import { RewardScreen } from '@/components/rewards/reward-screen';
import { BAG, BAG_RESULT } from '@/data/bag-log.sample';

/** F5·4: the bag is weighed and the Smileys land, with today's numbers and the class goal. */
export default function BagEarnedRoute() {
  const r = BAG_RESULT;
  return (
    <RewardScreen
      smileys={r.smileys}
      message={`Bag #${BAG.number} weighed ${r.kg} kg. Nice haul, ${BAG.volunteer.firstName}.`}
      stats={[
        { value: `${r.bagsToday}`, label: 'bags today' },
        { value: r.removed, label: 'you removed' },
        { value: r.balance, label: 'Smileys' },
      ]}
      progress={{
        title: `Class goal · ${r.classGoal} kg`,
        trailing: `${r.classNow} kg`,
        value: r.classNow / r.classGoal,
        note: `Your bag pushed ${r.className} to ${Math.round((r.classNow / r.classGoal) * 100)}%`,
        label: `${r.classNow} of ${r.classGoal} kilograms for ${r.className}`,
      }}
      // Figma sends both buttons back to F5·1; here "Done" leaves the bag log.
      primary={{ label: 'Log bag', onPress: () => router.replace('/bag-log') }}
      secondary={{ label: 'Done', onPress: () => router.dismissTo('/home') }}
    />
  );
}
