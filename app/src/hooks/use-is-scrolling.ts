import { useEffect, useRef, useState } from 'react';

const SCROLL_END_DELAY = 150;

/** Pass `onScroll` to a scroll view. `isScrolling` stays true until the scroll comes to rest. */
export function useIsScrolling() {
  const [isScrolling, setIsScrolling] = useState(false);
  const restTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(restTimer.current), []);

  function onScroll() {
    setIsScrolling(true);
    clearTimeout(restTimer.current);
    restTimer.current = setTimeout(() => setIsScrolling(false), SCROLL_END_DELAY);
  }

  return { isScrolling, onScroll };
}
