import { router } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, SvgXml } from 'react-native-svg';

import { EarthyOrb } from '@/components/earthy/earthy-orb';
import { MapArt } from '@/components/event/map-art';
import { ZoomableMap } from '@/components/map/zoomable-map';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Avatar, SpotsBar } from '@/components/ui/parts';
import { Tappable } from '@/components/ui/tappable';
import { Radius, Shadows, Spacing, TabBarHeight } from '@/constants/theme';
import { BEST_MATCH_ID, type CleanupEvent, MAP_MARKERS } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';

const FRAME_WIDTH = 360;
// The map area starts under the header, at 124 px in the Figma frame.
const MAP_TOP = 124;
const CARD_WIDTH = 300;

type EventsMapProps = {
  events: readonly CleanupEvent[];
  chips: ReactNode;
  onOpen: (event: CleanupEvent) => void;
  onShowList: () => void;
};

/** R2: the cleanups on the Kite Beach map illustration, with a card row to swipe through. */
export function EventsMap({ events, chips, onOpen, onShowList }: EventsMapProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scale = Math.max(width / FRAME_WIDTH, 1);
  const visible = new Set(events.map((event) => event.id));
  const markers = MAP_MARKERS.filter((marker) => visible.has(marker.eventId));
  // Earthy only suggests its best match; other filters hide the bubble but keep the list button.
  const best = events.find((event) => event.id === BEST_MATCH_ID);

  return (
    <View style={styles.area}>
      <ZoomableMap controls={{ top: 64, end: Spacing.three }}>
      <MapArt left={-130} top={-64} zoom={600 / 510} plain />
      {/* Figma R2 (9 Nov): you are at 242, 368 in the frame, the centre of both rings. */}
      <Reach x={242 * scale} y={(368 - MAP_TOP) * scale} scale={scale} />
      {markers.map((marker, index) => {
        const event = events.find((item) => item.id === marker.eventId);
        if (!event) return null;
        return (
          <Marker
            key={index}
            x={marker.x * scale}
            y={(marker.y - MAP_TOP) * scale}
            time={marker.time}
            fill={(event.capacity - event.spotsLeft) / event.capacity}
            large={marker.size === 'large'}
            full={event.spotsLeft === 0}
            friends={marker.size === 'large' ? 2 : 0}
            label={`${event.title}, ${marker.time}`}
            onPress={() => onOpen(event)}
          />
        );
      })}
      </ZoomableMap>

      {/* Figma R2 (9 Nov): the list button sits at the start of the chip row. */}
      <View style={styles.chipRow} pointerEvents="box-none">
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Show as a list"
          onPress={onShowList}
          style={[styles.listButton, { backgroundColor: theme.card, boxShadow: Shadows.pickPill }]}>
          <Icon name="menu" size={20} color="textStrong" />
        </Tappable>
        <View style={styles.chipScroll}>{chips}</View>
      </View>

      <View style={[styles.bottom, { paddingBottom: TabBarHeight + insets.bottom + Spacing.two }]} pointerEvents="box-none">
        {best ? (
          <View style={styles.pickRow} pointerEvents="box-none">
            {/* Figma R2 (9 Nov): a solid white pill, with a marigold star after the label. */}
            <View style={[styles.pick, { backgroundColor: theme.card, boxShadow: Shadows.pickPill }]}>
              <EarthyOrb size={24} state="still" glow={false} />
              <View>
                <View style={styles.pickLabel}>
                  <ThemedText type="small" themeColor="brand">
                    Earthy pick
                  </ThemedText>
                  <Icon name="star" size={8} color="secondary" fill="secondary" strokeWidth={1} />
                </View>
                <ThemedText type="bodyMedium" numberOfLines={1}>
                  {`${best.title.replace(' cleanup', '')} fits your Saturday`}
                </ThemedText>
              </View>
            </View>
          </View>
        ) : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + Spacing.twoHalf}
          decelerationRate="fast"
          contentContainerStyle={styles.cards}>
          {events.map((event) => (
            <MapCard key={event.id} event={event} onPress={() => onOpen(event)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

/** Where the user is, with rings for 10 and 25 minutes away. */
function Reach({ x, y, scale }: { x: number; y: number; scale: number }) {
  const theme = useTheme();
  const ring = (diameter: number) => ({
    left: x - (diameter * scale) / 2,
    top: y - (diameter * scale) / 2,
    width: diameter * scale,
    height: diameter * scale,
    borderRadius: (diameter * scale) / 2,
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessible={false}>
      <View style={[styles.ring, ring(300), { borderColor: theme.optionStroke }]} />
      <View
        style={[
          styles.ring,
          ring(140),
          {
            borderColor: theme.optionStroke,
            backgroundColor: theme.glassOnBrand,
          },
        ]}
      />
      {/* Figma R2: "25 min" at 86, 384 and "10 min" at 262, 486, measured from the centre. */}
      <RingLabel text="25 min" left={x - 156 * scale} top={y + 16 * scale} />
      <RingLabel text="10 min" left={x + 20 * scale} top={y + 118 * scale} />
      <View style={[styles.youHalo, ring(40), { backgroundColor: theme.fill }]} />
      <View style={[styles.youDot, ring(16), { backgroundColor: theme.brand, borderColor: theme.card }]} />
    </View>
  );
}

function RingLabel({ text, left, top }: { text: string; left: number; top: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.ringLabel, { left, top, backgroundColor: theme.card }]}>
      <ThemedText type="ringCaption" themeColor="brand">
        {text}
      </ThemedText>
    </View>
  );
}

/** A cleanup pin: the ring shows how full it is, coral when it still needs people. */
function Marker({
  x,
  y,
  time,
  fill,
  large,
  full,
  friends,
  label,
  onPress,
}: {
  x: number;
  y: number;
  time: string;
  fill: number;
  large: boolean;
  full: boolean;
  /** Friends going, shown as a coral "+2" badge on the picked pin. */
  friends: number;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  const size = large ? 58 : 46;
  // Figma rings are the outer fifth of the pin (inner radius 0.8).
  const stroke = size * 0.1;
  const radius = size / 2 - stroke / 2;
  const length = 2 * Math.PI * radius;
  const needsPeople = !full && fill < 0.5;
  const ringColor = full ? theme.pinFull : needsPeople ? theme.avatarCoral : theme.brand;
  const face = large ? 42 : 30;

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={full ? `${label}, full` : needsPeople ? `${label}, needs people` : label}
      onPress={onPress}
      style={[styles.marker, { left: x - size / 2, top: y - size / 2 }]}>
      <View
        style={[
          styles.markerCircle,
          { width: size, height: size, borderRadius: size / 2 },
          { backgroundColor: theme.card, boxShadow: Shadows.mapControl },
        ]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeOpacity={0.18}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={[length * (full ? 1 : fill), length]}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View
          style={[
            styles.face,
            { width: face, height: face, borderRadius: face / 2 },
            {
              backgroundColor: large ? theme.brand : full ? theme.pinFullFill : theme.fill,
            },
          ]}>
          <Icon
            name="waves"
            size={large ? 24 : 18}
            color={large ? 'textOnBrand' : full ? 'pinFull' : 'brand'}
            strokeWidth={large ? 2 : 1.5}
          />
        </View>
        {friends > 0 && (
          <View style={[styles.friendsBadge, { backgroundColor: theme.avatarCoral, borderColor: theme.card }]}>
            <ThemedText type="ringCaption" themeColor="textOnBrand">
              {`+${friends}`}
            </ThemedText>
          </View>
        )}
      </View>
      <View
        style={[
          styles.time,
          {
            backgroundColor: large ? theme.brand : theme.card,
            boxShadow: Shadows.mapControl,
          },
        ]}>
        <ThemedText type="tag" themeColor={large ? 'textOnBrand' : full ? 'strokeStrong' : 'textStrong'}>
          {time}
        </ThemedText>
      </View>
    </Tappable>
  );
}

function MapCard({ event, onPress }: { event: CleanupEvent; onPress: () => void }) {
  const theme = useTheme();
  const full = event.spotsLeft === 0;
  const filled = (event.capacity - event.spotsLeft) / event.capacity;
  const needsPeople = !full && filled < 0.5;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, boxShadow: Shadows.tabBar }]}>
      <View style={styles.cardTop}>
        <View style={styles.thumb}>
          <View style={styles.thumbArt}>
            <SvgXml xml={event.artwork} width={328} height={132} />
          </View>
        </View>
        <View style={styles.cardText}>
          <ThemedText type="avatar" themeColor="brand">
            {event.slot.replace(' · ', ' · ').toUpperCase()}
          </ThemedText>
          <ThemedText type="eventTitle" numberOfLines={1}>
            {event.title}
          </ThemedText>
          <ThemedText type="meta" themeColor="textWeak" numberOfLines={1}>
            {`${event.driveMinutes} min drive · ${event.place}`}
          </ThemedText>
          <SpotsBar filled={filled} width={150} needsPeople={needsPeople} />
          <ThemedText type="meta" themeColor={needsPeople ? 'textAccent' : 'textWeak'}>
            {full
              ? `Full · ${event.waiting} waiting`
              : needsPeople
                ? `Needs ${event.spotsLeft} more people`
                : `${event.spotsLeft} of ${event.capacity} spots left`}
          </ThemedText>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.friends}>
          <Avatar initials="OM" tone="avatarCoral" size={24} ring="card" />
          <View style={styles.overlap}>
            <Avatar initials="LI" tone="statusSuccess" size={24} ring="card" />
          </View>
          <ThemedText type="meta" themeColor="textWeak">
            Omar, Lina going
          </ThemedText>
        </View>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`${full ? 'View' : 'Join'} ${event.title}`}
          // Figma R2: Join goes straight to R4 Confirm; a full clean-up's View opens its details.
          onPress={full ? onPress : () => router.push({ pathname: '/register', params: { id: event.id } })}
          style={[styles.join, { backgroundColor: theme.brand }]}>
          <ThemedText type="label" themeColor="textOnBrand">
            {full ? 'View' : 'Join'}
          </ThemedText>
        </Tappable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    overflow: 'hidden',
  },
  chipRow: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    start: 0,
    end: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: Spacing.three,
  },
  // Figma: chips start 58 px in, so the first chip clears the list button.
  chipScroll: {
    flex: 1,
    marginStart: -2,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  ringLabel: {
    position: 'absolute',
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: 1,
    borderRadius: Radius.pill,
  },
  youHalo: {
    position: 'absolute',
    opacity: 0.8,
  },
  youDot: {
    position: 'absolute',
    borderWidth: 2.5,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsBadge: {
    position: 'absolute',
    top: -4,
    end: -3,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderRadius: 11,
  },
  time: {
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  bottom: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    gap: Spacing.twoHalf,
  },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  pick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.threeLess,
    paddingVertical: Spacing.oneHalf,
    // Figma: fixed 299 px wide, radius 20.
    minWidth: 299,
    borderRadius: 20,
  },
  pickLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  listButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  cards: {
    gap: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
  },
  card: {
    width: CARD_WIDTH,
    gap: Spacing.twoHalf,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.card,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.twoThreeQuarters,
  },
  thumb: {
    width: 76,
    height: 76,
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  // Figma crops the event art to the flag end of the beach.
  thumbArt: {
    position: 'absolute',
    start: -210,
    top: -30,
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  overlap: {
    marginStart: -14,
  },
  join: {
    paddingHorizontal: Spacing.threeHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
  },
});
