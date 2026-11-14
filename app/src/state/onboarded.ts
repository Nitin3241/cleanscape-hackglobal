import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDED_KEY = 'onboarding-complete';

/** Whether this phone has finished onboarding. Unknown storage counts as not yet. */
export async function hasOnboarded() {
  try {
    return (await AsyncStorage.getItem(ONBOARDED_KEY)) === 'yes';
  } catch {
    return false;
  }
}

/** Remembers the end of onboarding, or forgets it so the next launch shows onboarding again. */
export async function setOnboarded(done: boolean) {
  try {
    if (done) await AsyncStorage.setItem(ONBOARDED_KEY, 'yes');
    else await AsyncStorage.removeItem(ONBOARDED_KEY);
  } catch {
    // Without storage, onboarding simply shows again next time.
  }
}
