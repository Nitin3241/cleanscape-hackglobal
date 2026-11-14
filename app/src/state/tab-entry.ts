import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

/**
 * Tab screens show a short skeleton, then crossfade to content, only when you arrive by tapping a
 * tab (Figma, 9 Nov 2026: 0.5 s skeleton, 300 ms crossfade). Coming back with the back button,
 * or opening the screen from a link, shows the content straight away.
 */
export const TAB_SKELETON_MS = 1200; // Figma (13 Nov): skeletons hold 1.2 s.

let pending: string | null = null;

/** The tab bar calls this just before it navigates. */
export function markTabEntry(href: string) {
  pending = href;
}

/** True for 0.5 s each time this screen gains focus from a tab tap. `initial` also covers the first mount. */
export function useTabSkeleton(href: string, { initial = false }: { initial?: boolean } = {}) {
  // Start loading on the very first frame when this mount came from a tab tap, so content never flashes.
  const [loading, setLoading] = useState(() => initial || pending === href);
  const first = useRef(true);

  useFocusEffect(
    useCallback(() => {
      const fromTab = pending === href;
      if (fromTab) pending = null;
      const show = fromTab || (initial && first.current);
      first.current = false;
      if (!show) return;
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), TAB_SKELETON_MS);
      return () => clearTimeout(timer);
    }, [href, initial]),
  );

  return loading;
}
