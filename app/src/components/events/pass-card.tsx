import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Line, SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { ticketArtXml } from '@/constants/illustrations';
import { Gradients, Radius, Shadows, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ART_HEIGHT = 128;
const NOTCH = 24;
const QR_SIZE = 126;

type PassCardProps = {
  eyebrow: string;
  title: string;
  fields: readonly { label: string; value: string }[];
  tag: { label: string; dot: ThemeColor };
  /** SAMPLE: a long press on the tag steps through replies for design review. */
  onTagLongPress?: () => void;
  /** What sits under the tear line: the QR code, or a status message. */
  stub: { kind: 'qr'; value: string; caption: string; onPress?: () => void; pressLabel?: string } | StubMessage;
};

type StubMessage = {
  kind: 'message';
  icon: IconName;
  title: string;
  body: string;
  actions: readonly { label: string; onPress: () => void }[];
};

/** The event pass: art, details, a tear line and a stub with the check-in code or a status. */
export function PassCard({ eyebrow, title, fields, tag, onTagLongPress, stub }: PassCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.shadow, { boxShadow: Shadows.ticket }]}>
      <LinearGradient {...Gradients.pass} style={styles.card}>
        <View style={styles.art}>
          <View style={styles.illustration}>
            <SvgXml xml={ticketArtXml} width="100%" height={180} preserveAspectRatio="xMidYMid slice" />
          </View>
          <Pressable
            accessibilityRole="text"
            accessibilityLabel={tag.label}
            delayLongPress={600}
            onLongPress={onTagLongPress}
            style={[styles.tag, { backgroundColor: theme.passGlass, borderColor: theme.passGlassStroke }]}>
            <View style={[styles.dot, { backgroundColor: theme[tag.dot] }]} />
            <ThemedText type="ticketTag" themeColor="textOnBrand">
              {tag.label}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.heading}>
            <ThemedText type="ticketEyebrow" themeColor="passMuted">
              {eyebrow}
            </ThemedText>
            <ThemedText type="etaTitle" themeColor="textOnBrand" accessibilityRole="header">
              {title}
            </ThemedText>
          </View>
          <View style={styles.fields}>
            {fields.map(({ label, value }) => (
              <View key={label} accessible accessibilityLabel={`${label}: ${value}`} style={styles.field}>
                <ThemedText type="ticketFieldLabel" themeColor="passLabel">
                  {label}
                </ThemedText>
                <ThemedText type="link" themeColor="textOnBrand" numberOfLines={1}>
                  {value}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.perforation}>
          <View style={styles.tear}>
            <Svg width="100%" height={1.5}>
              <Line
                x1={0.75}
                x2="100%"
                y1={0.75}
                y2={0.75}
                stroke={theme.ticketTear}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={[6, 6]}
              />
            </Svg>
          </View>
          <View style={[styles.notch, styles.notchStart, { backgroundColor: theme.background }]} />
          <View style={[styles.notch, styles.notchEnd, { backgroundColor: theme.background }]} />
        </View>

        <View style={styles.stub}>
          {stub.kind === 'qr' ? (
            <>
              {stub.onPress ? (
                // DEMO: tapping the code stands in for scanning it at the tent (Figma F3·6 → F3·7).
                <Tappable
                  accessibilityRole="button"
                  accessibilityLabel={stub.pressLabel ?? 'Check-in code'}
                  onPress={stub.onPress}
                  style={[styles.qr, { backgroundColor: theme.card }]}>
                  <QRCode value={stub.value} size={QR_SIZE} color={theme.textStrong} backgroundColor={theme.card} />
                </Tappable>
              ) : (
                <View accessible accessibilityLabel="Check-in code" style={[styles.qr, { backgroundColor: theme.card }]}>
                  <QRCode value={stub.value} size={QR_SIZE} color={theme.textStrong} backgroundColor={theme.card} />
                </View>
              )}
              <ThemedText type="small" themeColor="textOnBrandWeak">
                {stub.caption}
              </ThemedText>
            </>
          ) : (
            <StubStatus {...stub} />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

function StubStatus({ icon, title, body, actions }: StubMessage) {
  const theme = useTheme();

  return (
    <View style={styles.status} accessibilityLiveRegion="polite">
      <View style={[styles.statusIcon, { backgroundColor: theme.card }]}>
        <Icon name={icon} size={24} color="brand" strokeWidth={1.75} />
      </View>
      <ThemedText type="eventTitle" themeColor="textOnBrand" style={styles.centred}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textOnBrandWeak" style={styles.centred}>
        {body}
      </ThemedText>
      <View style={styles.statusActions}>
        {actions.map((action) => (
          <PillButton key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
}

function PillButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.pill, { borderColor: theme.textOnBrand }]}>
      <ThemedText type="bodyMedium" themeColor="textOnBrand">
        {label}
      </ThemedText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radius.card,
  },
  card: {
    overflow: 'hidden',
    borderRadius: Radius.card,
  },
  art: {
    height: ART_HEIGHT,
    overflow: 'hidden',
  },
  illustration: {
    position: 'absolute',
    top: -30,
    start: 0,
    end: 0,
    height: 180,
  },
  tag: {
    position: 'absolute',
    top: Spacing.twoThreeQuarters,
    start: Spacing.twoThreeQuarters,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    gap: Spacing.threeLess,
    paddingHorizontal: Spacing.threeHalf,
    paddingVertical: 18,
  },
  heading: {
    gap: Spacing.one,
  },
  fields: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  field: {
    flex: 1,
    gap: Spacing.half,
  },
  perforation: {
    height: NOTCH,
  },
  tear: {
    position: 'absolute',
    top: 11,
    start: Spacing.threeHalf,
    end: Spacing.threeHalf,
  },
  notch: {
    position: 'absolute',
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
  },
  notchStart: {
    start: -NOTCH / 2,
  },
  notchEnd: {
    end: -NOTCH / 2,
  },
  stub: {
    minHeight: 208,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.twoHalf,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.threeHalf,
    paddingHorizontal: Spacing.threeHalf,
  },
  qr: {
    padding: 13,
    borderRadius: Radius.medium,
  },
  status: {
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  statusIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
    borderRadius: 26,
  },
  centred: {
    textAlign: 'center',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.twoHalf,
  },
  pill: {
    paddingHorizontal: Spacing.threeLess,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
});
