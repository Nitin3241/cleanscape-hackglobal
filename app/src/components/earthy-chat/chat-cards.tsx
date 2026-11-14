import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop, SvgXml } from 'react-native-svg';

import { openInWaze } from '@/components/event/open-waze';
import { GradientBar } from '@/components/school/gradient-bar';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Smiley } from '@/components/ui/smiley';
import { Tappable } from '@/components/ui/tappable';
import { FigmaLines } from '@/constants/figma-lines';
import { ticketArtXml } from '@/constants/illustrations';
import { Radius, Spacing } from '@/constants/theme';
import { type ChatCard, type ChatLink, VOLUNTEERING } from '@/data/earthy-chat.sample';
import { useTheme } from '@/hooks/use-theme';

/**
 * Earthy's result card for one answer (handoff 5.3: "one result card"), by kind. Cards made of
 * several parts (match, tally, timer, captions) stack them 14 apart, like the rest of the thread.
 */
export function ChatCardView({ card, onPick }: { card: ChatCard; onPick: (to: ChatLink) => void }) {
  switch (card.kind) {
    case 'event':
      return <EventCard {...card} />;
    case 'match':
      return <MatchCard {...card} />;
    case 'checklist':
      return <Checklist items={card.items} />;
    case 'volunteering':
      return <Volunteering />;
    case 'classCode':
      return <ClassCodeCard {...card} />;
    case 'consent':
      return <Consent {...card} />;
    case 'tally':
      return <Tally {...card} />;
    case 'safety':
      return <Safety />;
    case 'timer':
      return <Timer {...card} />;
    case 'headcount':
      return <Headcount {...card} />;
    case 'captions':
      return <Captions options={card.options} />;
    case 'locked':
      return <Locked text={card.text} />;
    case 'didYouMean':
      return <DidYouMean options={card.options} onPick={onPick} />;
  }
}

/** Figma answer card: white, 1 px #E3E8EB edge, no shadow, 16 × 14 padding, 6 gap, 20 corners. */
function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.strokeWeak }, style]}>{children}</View>;
}

/** The same card in a tint, without the edge (consent, safety, gloves mode). */
function Tinted({
  children,
  color,
  style,
}: {
  children: React.ReactNode;
  color: 'earthyAlertTint' | 'secondarySubtle';
  style?: object;
}) {
  const theme = useTheme();
  return <View style={[styles.tinted, { backgroundColor: theme[color] }, style]}>{children}</View>;
}

function Art() {
  return (
    <View style={styles.art} aria-hidden>
      <SvgXml xml={ticketArtXml} width="100%" height={92} preserveAspectRatio="xMidYMid slice" />
    </View>
  );
}

/** Tag, title and note under the event art. F9v2·5 sets the title at 17, the others at 16. */
function EventText({ tag, title, meta, large = false }: { tag: string; title: string; meta: string; large?: boolean }) {
  return (
    <>
      <ThemedText type="tag" themeColor="brand">
        {tag}
      </ThemedText>
      <ThemedText type={large ? 'splashLine' : 'fieldValue'} style={!large && styles.title16}>
        {title}
      </ThemedText>
      <ThemedText type="note" themeColor="textWeak">
        {meta}
      </ThemedText>
    </>
  );
}

function EventCard({ tag, title, meta, actions }: Extract<ChatCard, { kind: 'event' }>) {
  return (
    <Card>
      <Art />
      <EventText tag={tag} title={title} meta={meta} large />
      {actions && (
        <View style={styles.eventActions}>
          <View style={styles.flex}>
            <Button label={actions[0]} pill flat onPress={openInWaze} />
          </View>
          <View style={styles.flex}>
            <Button label={actions[1]} variant="secondary" pill flat onPress={() => router.push('/pass')} />
          </View>
        </View>
      )}
    </Card>
  );
}

function MatchCard({ tag, title, meta, ride }: Extract<ChatCard, { kind: 'match' }>) {
  return (
    <View style={styles.parts}>
      <Card>
        <Art />
        <EventText tag={tag} title={title} meta={meta} />
      </Card>
      <Card>
        <ThemedText type="link">{ride.title}</ThemedText>
        <ThemedText type="note" themeColor="textWeak">
          {ride.meta}
        </ThemedText>
      </Card>
    </View>
  );
}

function ClassCodeCard({ school, title, meta }: Extract<ChatCard, { kind: 'classCode' }>) {
  return (
    <Card>
      <Art />
      <EventText tag={school} title={title} meta={meta} />
    </Card>
  );
}

function Checklist({ items }: { items: readonly string[] }) {
  return (
    <Card>
      {items.map((item) => (
        <View key={item} style={styles.check}>
          <Icon name="check" size={18} color="earthyCheck" strokeWidth={2.5} />
          <ThemedText type="lead">{item}</ThemedText>
        </View>
      ))}
    </Card>
  );
}

// Figma icon/cert (12 px): a ribbon with two lines, status green.
const CERT_XML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 4H7.5M4.5 5.5H6.5M3 1.5H9V8.5L6 7L3 8.5V1.5Z" stroke-width="1.09091" stroke-linecap="round" stroke-linejoin="round" stroke="#1E7A46"/>
</svg>`;

/** Figma "Impact card" (F9v2·7, B4): hours ring, school goal, Smileys, clean-ups and the last six. */
function Volunteering() {
  const theme = useTheme();
  const v = VOLUNTEERING;
  const size = 96;
  const stroke = 9.6;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  return (
    <Card style={styles.impact}>
      <View style={styles.rowBetween}>
        <ThemedText type="labelMedium14">Your volunteering</ThemedText>
        <View style={[styles.year, { backgroundColor: theme.segmentWell }]}>
          <ThemedText type="binChip" themeColor="textWeak">
            {v.year}
          </ThemedText>
        </View>
      </View>
      <View style={styles.hero}>
        <View accessible accessibilityLabel={`${v.hours} of ${v.goal} hours`} style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <Defs>
              {/* Figma "Progress": brand at the top fading to sea at the bottom. The ring is turned −90° to start at
                  12 o'clock, so the gradient runs right to left before that turn. */}
              <SvgGradient id="hoursRing" x1="1" y1="0" x2="0" y2="0">
                <Stop offset="0" stopColor={theme.brand} />
                <Stop offset="1" stopColor={theme.avatarSea} />
              </SvgGradient>
            </Defs>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.fill} strokeWidth={stroke} fill="none" />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#hoursRing)"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={[length * (v.hours / v.goal), length]}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.ringText}>
            <ThemedText type="issueGlyph">{`${v.hours} h`}</ThemedText>
            <ThemedText type="micro11" themeColor="textWeak" style={FigmaLines.l17}>{`of ${v.goal}`}</ThemedText>
          </View>
        </View>
        <View style={styles.goal}>
          <ThemedText type="labelMedium14">{v.toGoal}</ThemedText>
          <ThemedText type="meta" themeColor="textWeak">
            {v.note}
          </ThemedText>
          <View style={[styles.verified, { backgroundColor: theme.statusSuccessSubtle }]}>
            <SvgXml xml={CERT_XML} width={12} height={12} />
            <ThemedText type="tag" themeColor="statusSuccess" style={FigmaLines.l17}>
              Verified hours
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={[styles.rule, { backgroundColor: theme.segmentWell }]} />
      <View style={styles.rowBetween}>
        <View style={styles.stat}>
          <View style={[styles.statTile, { backgroundColor: theme.secondarySubtle }]}>
            <Smiley size={22} />
          </View>
          <View>
            <ThemedText type="sectionTitle">{v.smileys}</ThemedText>
            <ThemedText type="micro11" themeColor="textWeak" style={FigmaLines.l17}>
              Smileys
            </ThemedText>
          </View>
        </View>
        <View style={styles.stat}>
          <View style={[styles.statTile, { backgroundColor: theme.statusSuccessSubtle }]}>
            <Icon name="leaf" size={18} color="statusSuccess" strokeWidth={1.5} />
          </View>
          <View>
            <ThemedText type="sectionTitle">{`${v.cleanUps}`}</ThemedText>
            <ThemedText type="micro11" themeColor="textWeak" style={FigmaLines.l17}>
              Clean-ups
            </ThemedText>
          </View>
        </View>
        <View style={styles.bars} accessible accessibilityLabel="Hours in your last 6 clean-ups">
          <View style={styles.barRow}>
            {v.lastSix.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  { height, backgroundColor: index === v.lastSix.length - 1 ? theme.avatarAmber : theme.earthyBar },
                ]}
              />
            ))}
          </View>
          <ThemedText type="micro" themeColor="textWeak" style={styles.barLabel}>
            last 6
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

function Consent({ status, meta }: Extract<ChatCard, { kind: 'consent' }>) {
  const theme = useTheme();
  return (
    <Tinted color="earthyAlertTint">
      <View style={styles.rowBetween}>
        <ThemedText type="reasonTitle">Parent consent</ThemedText>
        <View style={[styles.chip, { backgroundColor: theme.card }]}>
          <ThemedText type="meta13">{status}</ThemedText>
        </View>
      </View>
      <ThemedText type="note" themeColor="textWeak">
        {meta}
      </ThemedText>
    </Tinted>
  );
}

function Tally({ rows, notice }: Extract<ChatCard, { kind: 'tally' }>) {
  return (
    <View style={styles.parts}>
      <Tinted color="secondarySubtle">
        <ThemedText type="fieldLabel" themeColor="textSecondary">
          {notice}
        </ThemedText>
      </Tinted>
      <Card>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.rowBetween}>
            <ThemedText type="reasonTitleRegular">{label}</ThemedText>
            <ThemedText type="reasonTitle">{value}</ThemedText>
          </View>
        ))}
      </Card>
    </View>
  );
}

function Safety() {
  return (
    <Tinted color="earthyAlertTint" style={styles.safety}>
      <View accessibilityRole="alert" style={styles.safetyRow}>
        <Icon name="alert" size={20} color="earthyAlertIcon" strokeWidth={2} />
        <ThemedText type="fieldLabel" themeColor="textAccent">
          Safety guidance, not medical advice
        </ThemedText>
      </View>
    </Tinted>
  );
}

function Timer({ label, value, options }: Extract<ChatCard, { kind: 'timer' }>) {
  const theme = useTheme();
  const [picked, setPicked] = useState<string | null>(null);
  const stopped = picked === 'Stop';
  return (
    <View style={styles.parts}>
      <Card style={styles.timer}>
        <Icon name="timer" size={26} color="brand" strokeWidth={2} />
        <View accessibilityLiveRegion="polite">
          <ThemedText type="note" themeColor="textWeak">
            {stopped ? 'Water reminders' : label}
          </ThemedText>
          <ThemedText type="etaTitle" style={styles.timerValue}>
            {stopped ? 'Stopped' : picked ? picked.toLowerCase() : value}
          </ThemedText>
        </View>
      </Card>
      <View style={styles.chips}>
        {options.map((option) => (
          <Tappable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: picked === option }}
            accessibilityLabel={option}
            onPress={() => setPicked(option)}
            style={[styles.chip, { backgroundColor: picked === option ? theme.fill : theme.tileNeutral }]}>
            <ThemedText type="meta13" themeColor={picked === option ? 'brand' : 'textStrong'}>
              {option}
            </ThemedText>
          </Tappable>
        ))}
      </View>
    </View>
  );
}

function Headcount({ here, total, message }: Extract<ChatCard, { kind: 'headcount' }>) {
  return (
    <View style={styles.parts}>
      <Card>
        <ThemedText type="heading" style={styles.count}>{`${here} / ${total}`}</ThemedText>
        {/* Figma "Rectangle": the Earthy gradient (brand → sky at 55% → marigold) at 135° across the fill, on a white track. */}
        <GradientBar
          progress={here / total}
          colors={['#1E6280', '#5FB3C9', '#F2A516']}
          locations={[0, 0.55, 1]}
          track="card"
          diagonal
          label={`${here} of ${total} checked in`}
        />
      </Card>
      <Card>
        <ThemedText
          type="tag"
          themeColor="textWeak"
          style={[styles.caps, styles.capsLine]}>{`Message to ${total - here} latecomers`}</ThemedText>
        <ThemedText type="lead">{message}</ThemedText>
      </Card>
    </View>
  );
}

function Captions({ options }: { options: readonly string[] }) {
  const [copied, setCopied] = useState<number | null>(null);
  return (
    <View style={styles.parts}>
      {options.map((text, index) => (
        <Tappable
          key={text}
          accessibilityRole="button"
          accessibilityLabel={`${copied === index ? 'Copied' : 'Copy'}: ${text}`}
          onPress={async () => {
            await Clipboard.setStringAsync(text);
            setCopied(index);
          }}>
          <Card>
            <ThemedText type="lead">{text}</ThemedText>
            {copied === index && (
              <ThemedText type="caption" themeColor="statusSuccess">
                Copied
              </ThemedText>
            )}
          </Card>
        </Tappable>
      ))}
    </View>
  );
}

function Locked({ text }: { text: string }) {
  return (
    <Card style={styles.locked}>
      <Icon name="lock" size={24} color="brand" strokeWidth={2} />
      <ThemedText type="hint" style={styles.flex}>
        {text}
      </ThemedText>
    </Card>
  );
}

function DidYouMean({
  options,
  onPick,
}: {
  options: readonly { label: string; to: ChatLink }[];
  onPick: (to: ChatLink) => void;
}) {
  return (
    <View style={styles.parts}>
      {options.map((option) => (
        <Tappable
          key={option.label}
          accessibilityRole="button"
          accessibilityLabel={option.label}
          onPress={() => onPick(option.to)}>
          <Card>
            <ThemedText type="reasonTitle">{option.label}</ThemedText>
          </Card>
        </Tappable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  tinted: {
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.threeLess,
    borderRadius: Radius.card,
  },
  parts: {
    gap: 14,
  },
  art: {
    height: 92,
    overflow: 'hidden',
    borderRadius: Radius.small,
  },
  // 16 medium at 1.45, as Figma draws it (23).
  title16: {
    lineHeight: 23,
  },
  eventActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.oneHalf,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  // Figma "Impact card": 16 padding, 14 gap, 22 corners.
  impact: {
    gap: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: 22,
  },
  year: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  ringText: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goal: {
    flex: 1,
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  rule: {
    height: 1,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  statTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
  },
  bars: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  bar: {
    width: 8,
    borderRadius: 3,
  },
  barLabel: {
    lineHeight: 15,
  },
  // Figma AI/Chip: 16 × 10 padding, 12 corners.
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.small,
  },
  safety: {
    gap: 0,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoHalf,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
  // 22 semibold at 1.45 (32).
  timerValue: {
    lineHeight: 32,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  // "212 / 240": 24 semibold at 1.45.
  count: {
    lineHeight: 35,
  },
  capsLine: {
    lineHeight: 16,
  },
  caps: {
    textTransform: 'uppercase',
    letterSpacing: 0.66,
  },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.twoThreeQuarters,
  },
});
