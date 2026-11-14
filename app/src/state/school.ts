import AsyncStorage from '@react-native-async-storage/async-storage';

const JOINS_WITH_SCHOOL_KEY = 'joins-with-school';

/** Whether the person picked "With my school" during onboarding. Unknown storage counts as no. */
export async function joinsWithSchool() {
  try {
    return (await AsyncStorage.getItem(JOINS_WITH_SCHOOL_KEY)) === 'yes';
  } catch {
    return false;
  }
}

/** Remembers the "With my school" pick so onboarding can end on "Join your class" (Figma F3·1). */
export async function setJoinsWithSchool(yes: boolean) {
  try {
    if (yes) await AsyncStorage.setItem(JOINS_WITH_SCHOOL_KEY, 'yes');
    else await AsyncStorage.removeItem(JOINS_WITH_SCHOOL_KEY);
  } catch {
    // Without storage, onboarding simply ends on Home.
  }
}
