import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { RevealBlock } from '@/components/ui/reveal-block';
import { Radius } from '@/constants/theme';

type SkeletonProps = {
  loading: boolean;
  /** Position in the screen's reveal order, 60 ms apart. */
  order?: number;
  radius?: number;
  lines?: 'wide' | 'card' | 'tile';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/** A placeholder the exact size of its content while a screen loads, then the content fades up. */
export function Skeleton({ loading, order = 0, radius = Radius.card, lines = 'wide', style, children }: SkeletonProps) {
  return (
    <RevealBlock loading={loading} order={order} radius={radius} lines={lines} style={style}>
      {children}
    </RevealBlock>
  );
}
