import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const LAST_FLIP_KEY = 'ticket-last-flip-day';

/** True on the first open of each day, so the countdown only flips once a day. */
export function useDailyFlip() {
  const [flipToday, setFlipToday] = useState(false);

  useEffect(() => {
    let active = true;
    const today = new Date().toDateString();
    AsyncStorage.getItem(LAST_FLIP_KEY)
      .then((lastFlip) => {
        if (!active || lastFlip === today) return;
        setFlipToday(true);
        return AsyncStorage.setItem(LAST_FLIP_KEY, today);
      })
      // Without storage the digits simply stay still.
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return flipToday;
}
