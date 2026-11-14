import { useEffect, useState } from 'react';

/** SAMPLE: how long a screen pretends to fetch, so its skeleton can be seen. */
export const SAMPLE_SCREEN_LOADING_MS = 1200; // Figma (13 Nov): skeletons hold 1.2 s so the shimmer reads.

/**
 * SAMPLE: true for a moment after the screen opens, standing in for a network request.
 * Replace with the real request state when the events and rides services exist.
 */
export function useSampleLoading(duration = SAMPLE_SCREEN_LOADING_MS) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
}
