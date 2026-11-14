import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Logomark } from '@/components/ui/logomark';
import { Fonts } from '@/constants/theme';
import { CERTIFICATE } from '@/data/impact.sample';
import { useTheme } from '@/hooks/use-theme';

// Figma I4 "Certificate — landscape" (942:13383): a 300 × 212 card drawn at its real size, every position copied.
const PAPER = '#FFFEFB';
// The "verify" QR's dark cells, as [x, y] from the frame (4.2 px squares).
const QR: [number, number][] = [
  [1, 1], [5.4, 1], [14.2, 1], [23, 1], [27.4, 1],
  [1, 5.4], [5.4, 5.4], [14.2, 5.4], [23, 5.4], [27.4, 5.4],
  [5.4, 9.8], [18.6, 9.8], [27.4, 9.8],
  [9.8, 14.2], [18.6, 14.2],
  [1, 18.6], [9.8, 18.6], [23, 18.6],
  [1, 23], [5.4, 23], [14.2, 23], [23, 23],
  [1, 27.4], [5.4, 27.4], [14.2, 27.4], [27.4, 27.4],
];

/** The volunteer certificate preview (school layout). SAMPLE: name and numbers are Figma's. */
export function CertificateCard() {
  const theme = useTheme();
  const tiny = (size: number, weight: 'regular' | 'semi' = 'regular') => ({
    fontSize: size,
    lineHeight: Math.round(size * 1.5),
    fontFamily: weight === 'semi' ? Fonts.semiBold : Fonts.regular,
  });

  return (
    <View
      style={[styles.card, { backgroundColor: PAPER, boxShadow: '0px 8px 20px 0px rgba(18, 38, 46, 0.14)' }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Certificate of volunteer service for ${CERTIFICATE.name}: ${CERTIFICATE.figures.map((f) => `${f.value} ${f.label}`).join(', ')}. Signed for EEG on ${CERTIFICATE.signed}.`}>
      <View style={[styles.blob, { left: -60, top: -60, backgroundColor: theme.fill }]} />
      <View style={[styles.blob, { left: 240, top: 152, backgroundColor: theme.fill }]} />
      <View style={[styles.inner, { borderColor: theme.brand }]} />

      <View style={[styles.abs, styles.lockup, { left: -8, top: 20 }]}>
        <Logomark size={14} />
        <ThemedText style={tiny(8, 'semi')}>CleanScape</ThemedText>
        <ThemedText themeColor="textWeak" style={tiny(8)}>
          ×
        </ThemedText>
        <ThemedText style={tiny(8, 'semi')}>Emirates Environmental Group</ThemedText>
      </View>
      <ThemedText themeColor="textWeak" style={[styles.abs, { left: 234, top: 20 }, tiny(5.5)]}>
        {CERTIFICATE.id}
      </ThemedText>
      <ThemedText themeColor="brand" style={[styles.abs, { left: 74, top: 40, letterSpacing: 0.84 }, tiny(7, 'semi')]}>
        CERTIFICATE OF VOLUNTEER SERVICE
      </ThemedText>
      <ThemedText themeColor="textWeak" style={[styles.abs, { left: 120, top: 60 }, tiny(7)]}>
        This certifies that
      </ThemedText>
      <ThemedText style={[styles.abs, { left: 76, top: 70, letterSpacing: -0.2 }, tiny(20, 'semi'), { lineHeight: 30 }]}>
        {CERTIFICATE.name}
      </ThemedText>
      <View style={[styles.abs, { left: 75, top: 101, width: 150, height: 0.75, backgroundColor: theme.heatMedium }]} />
      <ThemedText style={[styles.abs, styles.centred, { left: 40, top: 107, width: 220 }, tiny(7)]}>{CERTIFICATE.line}</ThemedText>

      {CERTIFICATE.figures.map((figure, index) => {
        const left = [82, 146, 199][index];
        const labelLeft = [77, 136, 199][index];
        return (
          <View key={figure.label}>
            <ThemedText themeColor="brand" style={[styles.abs, { left, top: 128 }, tiny(12, 'semi')]}>
              {figure.value}
            </ThemedText>
            <ThemedText themeColor="textWeak" style={[styles.abs, { left: labelLeft, top: 145 }, tiny(6.5)]}>
              {figure.label}
            </ThemedText>
          </View>
        );
      })}
      <View style={[styles.abs, styles.rule, { left: 118, backgroundColor: theme.strokeWeak }]} />
      <View style={[styles.abs, styles.rule, { left: 182, backgroundColor: theme.strokeWeak }]} />

      <Svg width={47} height={9.1} viewBox="0 0 47 9.1" style={[styles.abs, { left: 29.5, top: 164.5 }]}>
        <Path
          d="M0.5 8.6C4.5 -1.4 8.5 -1.4 9.5 4.6C10.5 10.6 12.5 2.6 15.5 1.6C18.5 0.6 17.5 8.6 20.5 7.6C24.5 6.6 25.5 0.6 29.5 2.6C32.5 4.6 31.5 9.6 36.5 7.6C40.5 5.6 42.5 1.6 46.5 3.6"
          stroke={theme.brand}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={[styles.abs, { left: 26, top: 181, width: 70, height: 0.75, backgroundColor: theme.textStrong }]} />
      <ThemedText themeColor="textWeak" style={[styles.abs, { left: 26, top: 184 }, tiny(6)]}>
        Signed for EEG
      </ThemedText>
      <ThemedText themeColor="textWeak" style={[styles.abs, { left: 26, top: 192 }, tiny(6)]}>
        {CERTIFICATE.signed}
      </ThemedText>

      <Svg width={40} height={40} viewBox="0 0 40 40" style={[styles.abs, { left: 130, top: 162 }]}>
        <Rect x={1} y={1} width={38} height={38} rx={19} fill={theme.brand} stroke={theme.heatMedium} strokeWidth={2} />
        <Circle cx={20} cy={20} r={15.625} stroke="#FFFFFF" strokeWidth={0.75} fill="none" />
        <Path
          d="M19.25 26C17.933 26.004 16.663 25.513 15.691 24.624C14.719 23.735 14.117 22.514 14.004 21.202C13.89 19.89 14.274 18.583 15.079 17.541C15.885 16.498 17.052 15.797 18.35 15.575C22.625 14.75 23.75 14.36 25.25 12.5C26 14 26.75 15.635 26.75 18.5C26.75 22.625 23.165 26 19.25 26Z"
          stroke="#FFFFFF"
          strokeWidth={1.52}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path d="M12.5 26.75C12.5 24.5 13.888 22.73 16.31 22.25C18.125 21.89 20 20.75 20.75 20" stroke="#FFFFFF" strokeWidth={1.52} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>

      <Svg width={32} height={32} style={[styles.abs, { left: 242, top: 160 }]}>
        {QR.map(([x, y]) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={4.2} height={4.2} fill={theme.textStrong} />
        ))}
      </Svg>
      <ThemedText themeColor="textWeak" style={[styles.abs, { left: 234, top: 194 }, tiny(6)]}>
        Scan to verify
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 212,
    overflow: 'hidden',
    borderRadius: 6,
  },
  blob: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  inner: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 284,
    height: 196,
    borderWidth: 0.75,
    borderRadius: 3,
  },
  abs: {
    position: 'absolute',
  },
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  centred: {
    textAlign: 'center',
  },
  rule: {
    top: 130,
    width: 0.75,
    height: 20,
  },
});
