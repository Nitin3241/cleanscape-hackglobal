import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SvgXml } from 'react-native-svg';

import { logomarkGlyphXml } from '@/constants/brand';
import { ticketArtXml } from '@/constants/illustrations';
import { Gradients } from '@/constants/theme';
import { type CleanupEvent, meetTime, SAMPLE_USER } from '@/data/events.sample';
import { useTheme } from '@/hooks/use-theme';

/** Figma draws the Wallet pass 300 px wide; other widths scale from this. */
const BASE_WIDTH = 300;

type WalletPassProps = {
  event: CleanupEvent;
  crew: string;
  width: number;
  /** Google's sheet shrinks the type a little (Figma W6). */
  scale?: number;
};

/**
 * DEMO MOCK: the pass as Apple Wallet and Google Wallet draw it (Figma W1, W3, W6).
 * It uses the phone's system font, like the real Wallet apps, not Poppins.
 */
export function WalletPass({ event, crew, width, scale = 1 }: WalletPassProps) {
  const theme = useTheme();
  const ratio = width / BASE_WIDTH;
  const s = (value: number) => value * scale;

  return (
    <View
      accessible
      accessibilityLabel={`CleanScape pass. ${event.title}, ${event.day}. Check-in ${meetTime(event)}, ${crew}, meet at Gate 2.`}
      style={[styles.shadow, { width, borderRadius: 14 }]}>
      <LinearGradient {...Gradients.pass} style={styles.card}>
        <View style={[styles.header, { height: s(57), paddingHorizontal: s(16) }]}>
          <View style={styles.brand}>
            <SvgXml xml={logomarkGlyphXml} width={s(24)} height={s(24)} />
            <Text style={[styles.brandName, { fontSize: s(15) }]}>CleanScape</Text>
          </View>
          <View style={styles.end}>
            <Text style={[styles.label, { fontSize: s(9) }]}>DATE</Text>
            <Text style={[styles.value, { fontSize: s(15) }]}>{event.day}</Text>
          </View>
        </View>

        <View style={[styles.strip, { height: s(92) * ratio }]}>
          <View style={{ marginTop: -s(70) * ratio }}>
            <SvgXml xml={ticketArtXml} width={width} height={s(165) * ratio} preserveAspectRatio="xMidYMid slice" />
          </View>
        </View>

        <View style={{ paddingHorizontal: s(16), paddingTop: s(14), height: s(60) }}>
          <Text style={[styles.label, { fontSize: s(9) }]}>EVENT</Text>
          <Text style={[styles.value, { fontSize: s(22) }]} numberOfLines={1}>
            {event.title}
          </Text>
        </View>

        <View style={[styles.fields, { paddingHorizontal: s(16), paddingTop: s(8), height: s(50) }]}>
          <Field label="CHECK-IN" value={meetTime(event)} size={s(14)} labelSize={s(9)} />
          <Field label="CREW" value={crew} size={s(14)} labelSize={s(9)} />
          <Field label="MEET" value="Gate 2" size={s(14)} labelSize={s(9)} end />
        </View>

        <View style={[styles.barcode, { paddingTop: s(6), paddingBottom: s(16), gap: s(12) }]}>
          <View style={{ padding: s(10), borderRadius: s(10), backgroundColor: theme.card }}>
            <QRCode value={`CLEANSCAPE-PASS:${SAMPLE_USER.passCode}`} size={s(112)} color={theme.textStrong} />
          </View>
          <Text style={[styles.holder, { fontSize: s(9) }]}>
            {`${SAMPLE_USER.fullName.toUpperCase()} · ${SAMPLE_USER.passCode}`}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function Field({
  label,
  value,
  size,
  labelSize,
  end = false,
}: {
  label: string;
  value: string;
  size: number;
  labelSize: number;
  end?: boolean;
}) {
  return (
    <View style={end && styles.end}>
      <Text style={[styles.label, { fontSize: labelSize }]}>{label}</Text>
      <Text style={[styles.value, { fontSize: size }]}>{value}</Text>
    </View>
  );
}

// Wallet passes use the system font. Colours are fixed: they match the pass art, not the app theme.
const styles = StyleSheet.create({
  shadow: {
    boxShadow: '0px 12px 24px 0px rgba(13, 51, 71, 0.30)',
  },
  card: {
    overflow: 'hidden',
    borderRadius: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  end: {
    alignItems: 'flex-end',
  },
  label: {
    color: '#FFE2A3',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  value: {
    color: '#FFFFFF',
  },
  strip: {
    overflow: 'hidden',
  },
  fields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barcode: {
    alignItems: 'center',
  },
  holder: {
    color: '#E3EFF4',
    letterSpacing: 0.4,
  },
});
