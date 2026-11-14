import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Share, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, SvgXml } from 'react-native-svg';

import { MapArt } from '@/components/event/map-art';
import { openInWaze } from '@/components/event/open-waze';
import { Avatars, Card, EarthyNote, IconRow, ListCard, StatTiles } from '@/components/event-day/day-parts';
import { DayLayout } from '@/components/event-day/day-layout';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import {
  breakRingXml,
  crewRouteXml,
  crewYouXml,
  flagIconXml,
  flagMarkerXml,
  playXml,
  routeToCXml,
  zoneYouXml,
} from '@/constants/event-day-art';
import { Fonts, Radius, Shadows, Spacing } from '@/constants/theme';
import {
  BREAK,
  BRIEFING,
  BUDDY,
  CREW,
  DAY_STEPS,
  type DayPhase,
  FEEDBACK,
  HELP,
  NEXT,
  PACKED,
  RECAP,
  ROLE,
  STREAK,
  ZONES,
} from '@/data/event-day.sample';
import { useTheme } from '@/hooks/use-theme';
import { markTabEntry } from '@/state/tab-entry';

const FIRST_OF: Record<DayPhase, number> = { before: 1, arrival: 4, during: 6, after: 9 };

const goTo = (step: number) => router.push({ pathname: '/event-day', params: { step: String(step) } });

/**
 * F11 Earthy on event day: 11 cards from the night before to the day after (`?step=1…11`), as drawn on 13 Nov.
 * Both footer buttons move on as Figma's prototype chains them; the phase bar jumps between phases and the Help
 * button on F11·6 and F11·8 opens F11·7. SAMPLE: everything is scripted for Kite Beach.
 */
export default function EventDayRoute() {
  const params = useLocalSearchParams<{ step?: string }>();
  const step = Math.min(Math.max(Number(params.step) || 1, 1), DAY_STEPS.length);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const header = { ...DAY_STEPS[step - 1], toast, onPhase: (phase: DayPhase) => goTo(FIRST_OF[phase]) };
  const help = () => goTo(7);

  switch (step) {
    case 1:
      return (
        <DayLayout
          {...header}
          title={PACKED.title}
          subtitle="3 of 5 ready. Tick things off as you pack."
          primary={{ label: 'All packed', onPress: () => goTo(2) }}
          secondary={{ label: 'Remind 9 PM', onPress: () => goTo(2) }}>
          <Packed />
        </DayLayout>
      );
    case 2:
      return (
        <DayLayout
          {...header}
          title="Meet your buddy"
          subtitle="Your first clean-up is easier with someone who’s done it before."
          primary={{ label: 'Say hi', onPress: () => goTo(3) }}
          secondary={{ label: 'Skip', onPress: () => goTo(3) }}>
          <Buddy />
        </DayLayout>
      );
    case 3:
      return (
        <DayLayout
          {...header}
          title="Your 60-second briefing"
          subtitle="Everything you need before you leave."
          primary={{
            label: 'Open Waze',
            onPress: () => {
              goTo(4);
              openInWaze();
            },
          }}
          secondary={{ label: 'Got it', onPress: () => goTo(4) }}>
          <Briefing />
        </DayLayout>
      );
    case 4:
      return (
        <DayLayout
          {...header}
          title="Your crew is at the blue flag"
          subtitle={CREW.distance}
          primary={{ label: 'I’m here', onPress: () => goTo(5) }}
          secondary={{
            label: 'Call lead',
            onPress: () => {
              goTo(5);
              Linking.openURL(CREW.leadPhone).catch(() => {});
            },
          }}>
          <FindCrew />
        </DayLayout>
      );
    case 5:
      return (
        <DayLayout
          {...header}
          title={ROLE.title}
          subtitle={ROLE.team}
          primary={{ label: 'Got it', onPress: () => goTo(6) }}
          secondary={{ label: 'Swap role', onPress: () => goTo(6) }}>
          <Role />
        </DayLayout>
      );
    case 6:
      return (
        <DayLayout
          {...header}
          title="Zone C needs your help"
          subtitle="3 more people would finish it in about 20 min."
          onHelp={help}
          // Figma F11·6: both choices move on to the water break (F11·8).
          primary={{ label: 'Go to C', onPress: () => goTo(8) }}
          secondary={{ label: 'Stay here', onPress: () => goTo(8) }}>
          <ZoneMap />
        </DayLayout>
      );
    case 7:
      return (
        <DayLayout {...header} title="What do you need?" subtitle={HELP.lead}>
          <Help onShare={() => Share.share({ message: 'I’m at Kite Beach, zone B. Here’s my spot.' }).catch(() => {})} />
        </DayLayout>
      );
    case 8:
      return (
        <DayLayout
          {...header}
          title="Water break in 5 minutes"
          subtitle={BREAK.note}
          onHelp={help}
          // Figma: both buttons move on to the recap (F11·9).
          primary={{ label: 'Start now', onPress: () => goTo(9) }}
          secondary={{ label: 'In 10 min', onPress: () => goTo(9) }}>
          <WaterBreak />
        </DayLayout>
      );
    case 9:
      return (
        <DayLayout
          {...header}
          title="Great work, Sara"
          subtitle="Here’s what you did today."
          primary={{ label: 'Share story', onPress: () => goTo(10) }}
          secondary={{ label: 'Certificate', onPress: () => goTo(10) }}>
          <Recap />
        </DayLayout>
      );
    case 10:
      return (
        <DayLayout
          {...header}
          title="How was today?"
          subtitle="Takes 10 seconds. It helps the organiser plan the next one."
          primary={{ label: 'Send', onPress: () => goTo(11) }}
          secondary={{ label: 'Skip', onPress: () => goTo(11) }}>
          <Feedback />
        </DayLayout>
      );
    default:
      return (
        <DayLayout
          {...header}
          title="Keep it going"
          subtitle="Your crew’s next 3 clean-ups."
          // Figma: both land on their tab screen's skeleton (R1 · Skeleton, Home Motion 1).
          primary={{
            label: 'See all',
            onPress: () => {
              markTabEntry('/events');
              router.navigate('/events');
            },
          }}
          secondary={{
            label: 'Not now',
            onPress: () => {
              markTabEntry('/home');
              router.dismissTo('/home');
            },
          }}>
          <NextThree onJoin={(place) => setToast(`You’re in · ${place}`)} />
        </DayLayout>
      );
  }
}

function Packed() {
  const theme = useTheme();
  const [items, setItems] = useState(PACKED.items);
  return (
    <>
      <StatTiles stats={PACKED.stats} />
      <ListCard>
        {items.map((item, index) => (
          <Tappable
            key={item.label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.packed }}
            accessibilityLabel={item.note ? `${item.label}, ${item.note}` : item.label}
            onPress={() => setItems((list) => list.map((it, i) => (i === index ? { ...it, packed: !it.packed } : it)))}
            style={styles.checkRow}>
            <View
              style={[
                styles.box,
                item.packed
                  ? { backgroundColor: theme.brand }
                  : { backgroundColor: theme.card, borderColor: theme.strokeStrong, borderWidth: 1.5 },
              ]}>
              {item.packed && <Icon name="check" size={16} color="textOnBrand" strokeWidth={2.5} />}
            </View>
            <ThemedText type="lead" themeColor={item.packed ? 'textWeak' : 'textStrong'} style={styles.flex}>
              {item.label}
            </ThemedText>
            {item.note && (
              <ThemedText type="filterLabelTight" themeColor="statusSuccess">
                {item.note}
              </ThemedText>
            )}
          </Tappable>
        ))}
      </ListCard>
      <EarthyNote text="Based on tomorrow’s forecast and the organiser’s list." />
    </>
  );
}

function Buddy() {
  const theme = useTheme();
  return (
    <>
      <Card style={styles.buddyCard}>
        <View style={styles.buddyTop}>
          <View style={[styles.buddyAvatar, { backgroundColor: theme.avatarRed, borderColor: theme.card }]}>
            <ThemedText type="coverTitle" themeColor="textOnBrand" style={styles.buddyInitials}>
              {BUDDY.initials}
            </ThemedText>
          </View>
          <View style={[styles.flex, styles.tight]}>
            <ThemedText type="placeTitle">{BUDDY.name}</ThemedText>
            <ThemedText type="small" themeColor="textWeak">
              {BUDDY.meta}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.message, { backgroundColor: theme.fill }]}>
          <ThemedText type="filterLabelTight" themeColor="brand">
            Hana says
          </ThemedText>
          <ThemedText type="hint">{BUDDY.says}</ThemedText>
        </View>
      </Card>
      <ListCard>
        {BUDDY.rows.map((row) => (
          <IconRow key={row.title} {...row} />
        ))}
      </ListCard>
    </>
  );
}

function Briefing() {
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const [left, setLeft] = useState(BRIEFING.length);
  const [arabic, setArabic] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setLeft((s) => s - 1);
      if (left <= 1) setPlaying(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [playing, left]);

  // Figma shows five of sixteen bars played at 0:58; the played share grows with the demo timer.
  const played = Math.max(5, Math.round(((BRIEFING.length - left) / BRIEFING.length) * BRIEFING.bars.length));

  // DEMO: no audio plays; the timer runs as if it does.
  return (
    <>
      <Card style={styles.player}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={`${playing ? 'Pause' : 'Play'} the briefing in ${arabic ? 'Arabic' : 'English'}`}
          onPress={() => {
            if (left <= 0) setLeft(BRIEFING.length);
            setPlaying((p) => !p);
          }}
          style={[styles.playButton, { backgroundColor: theme.brand }]}>
          {playing ? (
            <Icon name="pause" size={20} color="textOnBrand" fill="textOnBrand" strokeWidth={0} />
          ) : (
            <SvgXml xml={playXml} width={20} height={20} />
          )}
        </Tappable>
        <View style={styles.wave} aria-hidden>
          {BRIEFING.bars.map((height, index) => (
            <View
              key={index}
              style={[styles.bar, { height, backgroundColor: index < played ? theme.brand : theme.strokeWeak }]}
            />
          ))}
        </View>
        <ThemedText type="chipSelected" themeColor="textWeak">{`0:${String(Math.max(left, 0)).padStart(2, '0')}`}</ThemedText>
      </Card>
      <View style={[styles.segment, { backgroundColor: theme.fill }]} accessibilityRole="radiogroup">
        {(['English', 'العربية'] as const).map((label, index) => {
          const on = arabic === (index === 1);
          return (
            <Tappable
              key={label}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={index === 1 ? 'Arabic' : 'English'}
              onPress={() => {
                setArabic(index === 1);
                setLeft(BRIEFING.length);
                setPlaying(false);
              }}
              style={[styles.segmentItem, on && { backgroundColor: theme.card }]}>
              <ThemedText type="chip" themeColor={on ? 'textStrong' : 'textWeak'}>
                {label}
              </ThemedText>
            </Tappable>
          );
        })}
      </View>
      <ListCard>
        {BRIEFING.rows.map((row) => (
          <IconRow key={row.title} {...row} pad={Spacing.two} />
        ))}
      </ListCard>
    </>
  );
}

// Figma map art sits at (−147, −61) inside the 236 px map card at the 600 px zoom. Children of a bordered card are
// placed inside the 1 px edge here, so every Figma position below is 1 less.
const MAP_ZOOM = 600 / 510;
const EDGE = 1;

function FindCrew() {
  const theme = useTheme();
  return (
    <>
      <Card style={styles.map}>
        <View
          style={StyleSheet.absoluteFill}
          accessible
          accessibilityLabel={`Map: your crew is at the blue flag, ${CREW.distance}`}>
          <MapArt left={-147 - EDGE} top={-61 - EDGE} zoom={MAP_ZOOM} plain />
          <View style={[styles.abs, { left: 109 - EDGE, top: 79 - EDGE }]}>
            <SvgXml xml={crewRouteXml} width={120} height={110} />
          </View>
          <View style={[styles.abs, { left: 211 - EDGE, top: 177 - EDGE }]}>
            <SvgXml xml={crewYouXml} width={18} height={18} />
          </View>
          <View style={[styles.abs, { left: 118 - EDGE, top: 61 - EDGE }]}>
            <SvgXml xml={flagMarkerXml} width={26} height={35} />
          </View>
          <View style={[styles.abs, { left: 147 - EDGE, top: 55 - EDGE }]}>
            <Avatars people={CREW.people} size={30} />
          </View>
          <View
            style={[
              styles.abs,
              styles.flagTag,
              { left: 155 - EDGE, top: 93 - EDGE, backgroundColor: theme.card, boxShadow: Shadows.mapTag },
            ]}>
            <SvgXml xml={flagIconXml} width={10} height={7} />
            <ThemedText type="chip">Blue flag</ThemedText>
          </View>
        </View>
      </Card>
      <ListCard>
        <View style={styles.textRow}>
          <ThemedText type="reasonTitle">{CREW.names}</ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {CREW.checkedIn}
          </ThemedText>
        </View>
      </ListCard>
      <EarthyNote text="From your location and your crew’s check-ins." />
    </>
  );
}

function Role() {
  const theme = useTheme();
  return (
    <>
      <Card style={styles.steps}>
        {ROLE.steps.map(([title, note], index) => (
          <View key={title} style={styles.roleStep}>
            <View style={[styles.num, { backgroundColor: theme.fill }]}>
              <ThemedText type="labelSmall" themeColor="brand" style={styles.numText}>{`${index + 1}`}</ThemedText>
            </View>
            <View style={[styles.flex, styles.tight]}>
              <ThemedText type="reasonTitle">{title}</ThemedText>
              <ThemedText type="small" themeColor="textWeak">
                {note}
              </ThemedText>
            </View>
          </View>
        ))}
      </Card>
      <Card style={styles.team}>
        <ThemedText type="label">Your team</ThemedText>
        <View style={styles.teamRow}>
          <Avatars people={ROLE.team6} size={32} />
          <ThemedText type="small" themeColor="textWeak" style={styles.flex}>
            {ROLE.lead}
          </ThemedText>
        </View>
      </Card>
      <EarthyNote text="You said you like organising, so Earthy picked sorting." />
    </>
  );
}

// Figma F11·6 "Zones v2" sits at (−1, −1) in the map card, so zones and badges are 2 less here, chips and "You" 1 less.
const ZONE_SHIFT = 2;
const ZONE_SIZE = 52;
const BADGE_SIZE = 22;

/**
 * F11·6 live zones: a status circle per zone (52 px, fill 16%, solid edge; C red at 26%) with its letter on the rim
 * and a status chip beside it. Figma's distance stats and Earthy note sit under the map in the frame, so they don't show.
 */
function ZoneMap() {
  const theme = useTheme();
  return (
    <Card style={styles.map}>
      <View
        style={StyleSheet.absoluteFill}
        accessible
        accessibilityLabel="Live zones: A done, B busy (you are here), C needs help, D OK. Zone C is 90 m south-west.">
        <MapArt left={-147 - EDGE} top={-61 - EDGE} zoom={MAP_ZOOM} plain />
        {ZONES.map((zone) => {
          const color = theme[zone.tone];
          const help = 'help' in zone;
          const [x, y] = zone.circle;
          return (
            <View key={zone.id} style={[styles.abs, { left: x - ZONE_SHIFT, top: y - ZONE_SHIFT }]}>
              <Svg width={ZONE_SIZE} height={ZONE_SIZE}>
                <Circle
                  cx={26}
                  cy={26}
                  r={help ? 24.75 : 25}
                  fill={color}
                  fillOpacity={help ? 0.26 : 0.16}
                  stroke={color}
                  strokeWidth={help ? 2.5 : 2}
                />
              </Svg>
              <View
                style={[
                  styles.badge,
                  help
                    ? { backgroundColor: color, borderColor: theme.card }
                    : { backgroundColor: theme.card, borderColor: color },
                ]}>
                <ThemedText type="tabLabelActive" themeColor={help ? 'textOnBrand' : 'textStrong'}>
                  {zone.id}
                </ThemedText>
              </View>
            </View>
          );
        })}
        {ZONES.map((zone) => {
          const help = 'help' in zone;
          const [x, y] = zone.chip;
          return (
            <View
              key={`chip-${zone.id}`}
              style={[
                styles.abs,
                styles.zoneChip,
                {
                  left: x - EDGE,
                  top: y - EDGE,
                  backgroundColor: help ? theme[zone.tone] : theme.card,
                  boxShadow: Shadows.mapTag,
                },
              ]}>
              <View style={[styles.dot, { backgroundColor: help ? theme.card : theme[zone.tone] }]} />
              <ThemedText type={help ? 'tabLabelActive' : 'tabLabel'} themeColor={help ? 'textOnBrand' : 'textStrong'}>
                {zone.label}
              </ThemedText>
            </View>
          );
        })}
        <View style={[styles.abs, { left: 160.5 - ZONE_SHIFT, top: 107.5 - ZONE_SHIFT }]}>
          <SvgXml xml={routeToCXml} width={22.0008} height={9.50082} />
        </View>
        <View style={[styles.abs, styles.youLabel, { left: 182 - EDGE, top: 107 - EDGE, backgroundColor: theme.brand }]}>
          <ThemedText type="avatarSmall" themeColor="textOnBrand" style={styles.youText}>
            You
          </ThemedText>
        </View>
        <View style={[styles.abs, { left: 144 - EDGE, top: 93 - EDGE }]}>
          <SvgXml xml={zoneYouXml} width={16} height={16} />
        </View>
      </View>
    </Card>
  );
}

function Help({ onShare }: { onShare: () => void }) {
  return (
    <>
      <ListCard>
        {HELP.options.map((option) => (
          <IconRow
            key={option.title}
            icon={option.icon}
            title={option.title}
            note={option.note}
            // Figma F11·7: every option does its job and returns to the card you came from.
            onPress={
              option.does === 'share'
                ? () => {
                    onShare();
                    router.back();
                  }
                : option.does === 'call'
                  ? () => {
                      Linking.openURL(HELP.organiserPhone).catch(() => {});
                      router.back();
                    }
                  : () => router.back()
            }
          />
        ))}
      </ListCard>
      <ListCard>
        <IconRow
          icon="alert"
          title={HELP.emergency.title}
          note={HELP.emergency.note}
          danger
          onPress={() => {
            Linking.openURL('tel:999').catch(() => {});
            router.back();
          }}
        />
      </ListCard>
      <EarthyNote text={HELP.note} />
    </>
  );
}

function WaterBreak() {
  const left = BREAK.seconds;
  const shown = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return (
    <>
      <Card style={styles.countdown}>
        <View style={styles.timer} accessible accessibilityLabel={`${shown} minutes left`}>
          <SvgXml xml={breakRingXml} width={132} height={132} style={StyleSheet.absoluteFill} />
          <ThemedText type="busTime" style={[styles.timerText, styles.timerValue]}>
            {shown}
          </ThemedText>
          <ThemedText type="small" themeColor="textWeak" style={[styles.timerText, styles.timerLabel]}>
            minutes left
          </ThemedText>
        </View>
      </Card>
      {/* Directions to the water truck and shade aren't designed yet. */}
      <ListCard>
        {BREAK.places.map((place) => (
          <IconRow key={place.title} icon={place.icon} title={place.title} note={place.note} end={place.time} />
        ))}
      </ListCard>
      <EarthyNote text="Based on the heat and 40 minutes since your last break." />
    </>
  );
}

function Recap() {
  const theme = useTheme();
  return (
    <>
      <StatTiles stats={RECAP.stats} large />
      <Card style={styles.team}>
        <ThemedText type="label">Highlights</ThemedText>
        {RECAP.highlights.map((text) => (
          <View key={text} style={styles.teamRow}>
            <View style={[styles.tick, { backgroundColor: theme.statusSuccessSubtle }]}>
              <Icon name="check" size={12} color="statusSuccess" strokeWidth={1.75} />
            </View>
            <ThemedText type="hint" style={styles.flex}>
              {text}
            </ThemedText>
          </View>
        ))}
      </Card>
      <ListCard>
        <IconRow {...RECAP.certificate} onPress={() => router.push('/impact-certificate')} />
        <IconRow {...RECAP.school} />
      </ListCard>
    </>
  );
}

function Feedback() {
  const theme = useTheme();
  const [mood, setMood] = useState(2);
  return (
    <>
      <View style={styles.moods} accessibilityRole="radiogroup">
        {FEEDBACK.moods.map((option, index) => {
          const on = mood === index;
          return (
            <Tappable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={option.label}
              onPress={() => setMood(index)}
              style={[
                styles.mood,
                on
                  ? { backgroundColor: theme.fill, borderColor: theme.brand, borderWidth: 2 }
                  : { backgroundColor: theme.card, borderColor: theme.strokeWeak, borderWidth: 1 },
              ]}>
              <Icon name={option.icon} size={28} color={on ? 'brand' : 'strokeStrong'} strokeWidth={1.75} />
              <ThemedText type={on ? 'chipAction' : 'filterLabelTight'} themeColor={on ? 'brand' : 'textWeak'}>
                {option.label}
              </ThemedText>
            </Tappable>
          );
        })}
      </View>
      <View style={[styles.comment, { borderColor: theme.strokeStrong }]}>
        <ThemedText type="filterLabelTight" themeColor="textWeak">
          Anything to add? (optional)
        </ThemedText>
        <TextInput
          accessibilityLabel="Anything to add? (optional)"
          defaultValue={FEEDBACK.comment}
          returnKeyType="done"
          style={[styles.commentInput, { color: theme.textStrong }]}
        />
      </View>
    </>
  );
}

function NextThree({ onJoin }: { onJoin: (place: string) => void }) {
  const theme = useTheme();
  const [joined, setJoined] = useState<readonly string[]>([]);
  return (
    <>
      <Card style={styles.streak}>
        <View style={[styles.flame, { backgroundColor: theme.secondarySubtle }]}>
          <Icon name="flame" size={20} color="avatarAmber" strokeWidth={1.75} />
        </View>
        <View style={[styles.flex, styles.tight]}>
          <ThemedText type="labelLarge">{STREAK.title}</ThemedText>
          <ThemedText type="small" themeColor="textWeak">
            {STREAK.note}
          </ThemedText>
        </View>
      </Card>
      <ListCard>
        {NEXT.map((item) => {
          const on = joined.includes(item.place);
          return (
            <View key={item.place} style={styles.nextRow}>
              <View style={[styles.date, { backgroundColor: theme.fill }]}>
                <ThemedText type="tabLabel" themeColor="brand" style={styles.dateDay}>
                  {item.day}
                </ThemedText>
                <ThemedText type="dateNumber" themeColor="brand" style={styles.dateNumber}>
                  {item.date}
                </ThemedText>
              </View>
              <View style={[styles.flex, styles.nextText]}>
                <ThemedText type="reasonTitle">{item.place}</ThemedText>
                <View style={styles.crew}>
                  <Avatars people={item.people} size={24} />
                  <ThemedText type="small" themeColor="textWeak">
                    {item.crew}
                  </ThemedText>
                </View>
              </View>
              <Tappable
                accessibilityRole="button"
                accessibilityLabel={on ? `Joined ${item.place}` : `Join ${item.place}`}
                hitSlop={12}
                onPress={() => {
                  if (on) return;
                  setJoined((list) => [...list, item.place]);
                  onJoin(`${item.day} ${item.date}, ${item.place}`);
                }}>
                <ThemedText type="label" themeColor={on ? 'statusSuccess' : 'brand'}>
                  {on ? 'Joined' : 'Join'}
                </ThemedText>
              </Tappable>
            </View>
          );
        })}
      </ListCard>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tight: {
    gap: Spacing.half,
  },
  abs: {
    position: 'absolute',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  box: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  buddyCard: {
    gap: Spacing.threeLess,
  },
  buddyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  buddyAvatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 26,
  },
  buddyInitials: {
    lineHeight: 26,
  },
  message: {
    gap: Spacing.one,
    padding: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    padding: Spacing.twoThreeQuarters,
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  wave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  segment: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.half,
    padding: 3,
    borderRadius: Radius.pill,
  },
  segmentItem: {
    paddingHorizontal: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  map: {
    height: 236,
    padding: 0,
    overflow: 'hidden',
  },
  flagTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  textRow: {
    gap: Spacing.half,
    paddingVertical: Spacing.twoHalf,
  },
  steps: {
    gap: Spacing.one,
  },
  roleStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.two,
  },
  num: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  numText: {
    lineHeight: 20,
  },
  team: {
    gap: Spacing.twoHalf,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  badge: {
    position: 'absolute',
    left: -3.38,
    top: -3.38,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: BADGE_SIZE / 2,
  },
  zoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.twoHalf,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  youLabel: {
    paddingHorizontal: 7,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  youText: {
    lineHeight: 15,
  },
  countdown: {
    alignItems: 'center',
  },
  timer: {
    width: 132,
    height: 132,
  },
  timerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  timerValue: {
    top: 36,
  },
  timerLabel: {
    top: 76,
  },
  tick: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  moods: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  mood: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingTop: Spacing.threeLess,
    paddingBottom: Spacing.twoThreeQuarters,
    borderRadius: Radius.medium,
  },
  comment: {
    gap: Spacing.one,
    padding: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  commentInput: {
    height: 22,
    padding: 0,
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  flame: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
    paddingVertical: Spacing.twoThreeQuarters,
  },
  date: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  dateDay: {
    lineHeight: 14,
  },
  dateNumber: {
    lineHeight: 24,
  },
  nextText: {
    gap: Spacing.one,
  },
  crew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
});
