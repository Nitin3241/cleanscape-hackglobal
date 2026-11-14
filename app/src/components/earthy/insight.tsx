import { type RefObject, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Spacing } from '@/constants/theme';
import { INSIGHTS } from '@/data/insights.sample';
import { useTheme } from '@/hooks/use-theme';
import { type InsightKey, useInsight } from '@/state/insights';
import { useLanguage } from '@/state/language';

/** Measurable host element; React Native views and DOM nodes on web both have this. */
type Measurable = { measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void };

type Rect = { x: number; y: number; width: number; height: number };

export type InsightContent = {
  title: string;
  body: string;
  /** "Why: …" line, so a suggestion always says where it came from (F10 principle). */
  why: string;
  action: { label: string; onPress: () => void };
};

type EarthyInsightProps = InsightContent & {
  /** The element Earthy points at. It's ringed and left undimmed. */
  target: RefObject<Measurable | null>;
  /** Corner radius of the target, so the ring follows it 2 px out (most cards are 24). */
  targetRadius?: number;
  onDismiss: () => void;
};

const SHOW_AFTER = 700;

/** SVG path for a rounded rectangle, drawn the opposite way round so it cuts a hole. */
function roundedRect({ x, y, width, height }: Rect, r: number) {
  const radius = Math.min(r, width / 2, height / 2);
  return [
    `M${x + radius} ${y}`,
    `A${radius} ${radius} 0 0 0 ${x} ${y + radius}`,
    `V${y + height - radius}`,
    `A${radius} ${radius} 0 0 0 ${x + radius} ${y + height}`,
    `H${x + width - radius}`,
    `A${radius} ${radius} 0 0 0 ${x + width} ${y + height - radius}`,
    `V${y + radius}`,
    `A${radius} ${radius} 0 0 0 ${x + width - radius} ${y}`,
    'Z',
  ].join(' ');
}
// Figma Earthy tip (956:13460 and siblings): 2 px white ring, 2 px off a card and 6 px off the round Earthy
// button; the card sits 14 px from the ring, 16 px from the screen edges, and an 18 × 9 triangle pointer sits
// flush on it, centred on the target.
const RING_ON_CARD = 2;
const RING_ON_ROUND = 6;
/** How long a tip stays before it leaves by itself. */
const AUTO_DISMISS = 3000;
const GAP = 14;
const POINTER_W = 18;
const POINTER_H = 9;

/**
 * "Earthy noticed" (F10·1–7): the screen dims, the thing Earthy means is ringed, and a small card
 * says what it noticed, why, and one action, with "Got it" to dismiss. Shown a beat after the
 * screen opens. Place it last inside the screen's root view.
 */
export function EarthyInsight({ target, targetRadius = Radius.panel, title, body, why, action, onDismiss }: EarthyInsightProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const shown = rect !== null;

  // A tip leaves by itself 3 s after it appears (Nitin, 14 Nov), so it never blocks the screen.
  useEffect(() => {
    if (!shown) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS);
    return () => clearTimeout(timer);
    // Counts from the moment the tip shows; onDismiss is not stable between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  useEffect(() => {
    const measure = () =>
      target.current?.measureInWindow((x, y, w, h) => {
        if (w <= 0 || h <= 0) return;
        setRect((prev) =>
          prev && Math.abs(prev.x - x) < 0.5 && Math.abs(prev.y - y) < 0.5 && prev.width === w && prev.height === h
            ? prev
            : { x, y, width: w, height: h },
        );
      });
    // The target may still be settling (a panel rising in, a skeleton revealing), so keep measuring
    // every 200 ms for up to 5 s after the tip appears and follow it while it moves.
    let follow: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      measure();
      follow = setInterval(measure, 200);
    }, SHOW_AFTER);
    const stop = setTimeout(() => clearInterval(follow), SHOW_AFTER + 5000);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
      clearInterval(follow);
    };
  }, [target]);

  if (!rect) return null;

  const round = Math.abs(rect.width - rect.height) < 4;
  const RING = round ? RING_ON_ROUND : RING_ON_CARD;
  const hole = { x: rect.x - RING, y: rect.y - RING, width: rect.width + RING * 2, height: rect.height + RING * 2 };
  // Below the target when it sits in the top half, otherwise above it.
  const below = rect.y + rect.height / 2 < height / 2;
  const cardWidth = width - Spacing.three * 2;
  const centre = rect.x + rect.width / 2;
  const cardLeft = Math.min(Math.max(centre - cardWidth / 2, Spacing.three), width - Spacing.three - cardWidth);
  const pointerLeft = Math.min(Math.max(centre - cardLeft - POINTER_W / 2, Radius.card), cardWidth - Radius.card - POINTER_W);
  // Round targets (the Earthy button) get a round hole; cards get their own radius plus the 2 px offset.
  const radius = round ? hole.width / 2 : targetRadius + RING;

  return (
    <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(160)} style={StyleSheet.absoluteFill}>
      {/* The dimmed screen with a hole cut out around the target (even-odd fill). */}
      <Tappable accessibilityLabel="Dismiss Earthy's tip" onPress={onDismiss} style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height} aria-hidden>
          <Path d={`M0 0H${width}V${height}H0Z ${roundedRect(hole, radius)}`} fill={theme.tipScrim} fillRule="evenodd" />
        </Svg>
      </Tappable>
      <View
        pointerEvents="none"
        style={[
          styles.ring,
          { left: hole.x, top: hole.y, width: hole.width, height: hole.height, borderRadius: radius, borderColor: theme.card },
        ]}
      />

      <View
        accessibilityViewIsModal
        style={[
          styles.card,
          { width: cardWidth, left: cardLeft, backgroundColor: theme.card },
          below ? { top: hole.y + hole.height + GAP } : { bottom: height - hole.y + GAP },
        ]}>
        <Svg
          width={POINTER_W}
          height={POINTER_H}
          aria-hidden
          style={[styles.pointer, { left: pointerLeft }, below ? { top: -POINTER_H } : { bottom: -POINTER_H }]}>
          <Path
            d={
              below
                ? `M0 ${POINTER_H}L${POINTER_W / 2} 0L${POINTER_W} ${POINTER_H}Z`
                : `M0 0L${POINTER_W / 2} ${POINTER_H}L${POINTER_W} 0Z`
            }
            fill={theme.card}
          />
        </Svg>
        <View style={styles.head}>
          <EarthyOrb size={28} state="still" glow={false} />
          <ThemedText type="sectionTitle" style={styles.flex} accessibilityRole="header">
            {title}
          </ThemedText>
        </View>
        <ThemedText type="body14">{body}</ThemedText>
        <View style={[styles.why, { backgroundColor: theme.tileNeutral }]}>
          <Icon name="info" size={16} color="textWeak" />
          <ThemedText type="meta" themeColor="textWeak" style={styles.flex}>{`Why: ${why}`}</ThemedText>
        </View>
        <View style={styles.actions}>
          <View style={styles.flex}>
            <Button
              label={action.label}
              flat
              onPress={() => {
                onDismiss();
                action.onPress();
              }}
            />
          </View>
          {/* Figma "Dismiss": a 48 px text button, 20 px each side. */}
          <Tappable accessibilityRole="button" accessibilityLabel="Not now" onPress={onDismiss} style={styles.dismiss}>
            <ThemedText type="buttonPrimary" themeColor="brand">
              Not now
            </ThemedText>
          </Tappable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  // Figma "Earthy tip": 16 padding, 12 gap, 20 radius, shadow 0 12 32 rgba(10, 26, 33, 0.22).
  card: {
    position: 'absolute',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.three,
    borderRadius: Radius.card,
    boxShadow: '0px 12px 32px 0px rgba(10, 26, 33, 0.22)',
  },
  pointer: {
    position: 'absolute',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  // Figma "Why": 8 / 10 padding, 8 gap, 12 radius.
  why: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
  dismiss: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.threeHalf,
  },
  flex: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});

/**
 * The tip for one screen (F10·1–7): its sample copy, shown once per session.
 * `onAction` runs the tip's button, such as "Join friends".
 */
export function ScreenInsight({
  id,
  target,
  targetRadius,
  onAction,
}: {
  id: InsightKey;
  target: RefObject<Measurable | null>;
  targetRadius?: number;
  onAction: () => void;
}) {
  const [open, dismiss] = useInsight(id);
  const { rtl } = useLanguage();
  // Tip copy exists in English only (Figma has no Arabic tips yet), so tips stay hidden in Arabic.
  if (!open || rtl) return null;
  const tip = INSIGHTS[id];
  return (
    <EarthyInsight
      target={target}
      targetRadius={targetRadius}
      title={tip.title}
      body={tip.body}
      why={tip.why}
      action={{ label: tip.action, onPress: onAction }}
      onDismiss={dismiss}
    />
  );
}
