import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: keyof typeof styles;
  themeColor?: ThemeColor;
};

/** Text in one of the CleanScape type styles from Figma. */
export function ThemedText({ style, type = 'body', themeColor, children, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  // Arabic text always uses Readex Pro (handoff), whatever the style's Latin font.
  const arabic = typeof children === 'string' && ARABIC.test(children) ? arabicFont(styles[type]) : null;

  return (
    <Text style={[{ color: theme[themeColor ?? 'textStrong'] }, styles[type], arabic, style]} {...rest}>
      {children}
    </Text>
  );
}

const ARABIC = /[\u0600-\u06FF]/;

/** Readex Pro Regular for regular text, Medium for everything heavier. No letter spacing or caps. */
function arabicFont(base: { fontFamily?: string }) {
  return {
    fontFamily: base.fontFamily === Fonts.regular ? Fonts.arabicRegular : Fonts.arabicMedium,
    letterSpacing: 0,
    textTransform: 'none' as const,
  };
}

const styles = StyleSheet.create({
  etaTitle: { fontFamily: Fonts.semiBold, fontSize: 22, lineHeight: 30 },
  // School bus departure time (Figma F3·5).
  busTime: { fontFamily: Fonts.semiBold, fontSize: 30, lineHeight: 38 },
  // Class impact total (Figma F3·8c draws 52 Bold; the app has no Bold, so SemiBold).
  impactNumber: { fontFamily: Fonts.semiBold, fontSize: 52, lineHeight: 60 },
  screenTitle: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 29 },
  transcript: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 28 },
  sheetPrompt: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 25 },
  eventTitle: { fontFamily: Fonts.semiBold, fontSize: 16, lineHeight: 22 },
  linkRow: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
  chipSelected: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 20 },
  toggle: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 18 },
  toggleArabic: { fontFamily: Fonts.arabicRegular, fontSize: 13, lineHeight: 18 },
  meta13: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 17 },
  filterLabel: { fontFamily: Fonts.medium, fontSize: 12, lineHeight: 17 },
  dateline: { fontFamily: Fonts.semiBold, fontSize: 12, lineHeight: 18 },
  small: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 16 },
  tag: { fontFamily: Fonts.semiBold, fontSize: 11, lineHeight: 16 },
  avatarSmall: { fontFamily: Fonts.semiBold, fontSize: 10, lineHeight: 14 },
  welcomeTitle: { fontFamily: Fonts.semiBold, fontSize: 26, lineHeight: 34 },
  languageTitle: { fontFamily: Fonts.semiBold, fontSize: 24, lineHeight: 35 },
  arabicTitle: { fontFamily: Fonts.arabicRegular, fontSize: 20, lineHeight: 29 },
  optionTitle: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 26 },
  arabicOption: { fontFamily: Fonts.arabicRegular, fontSize: 18, lineHeight: 26 },
  splashLine: { fontFamily: Fonts.medium, fontSize: 17, lineHeight: 25 },
  wordmark: { fontFamily: Fonts.semiBold, fontSize: 16, lineHeight: 22 },
  lead: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },
  arabicLead: { fontFamily: Fonts.arabicRegular, fontSize: 15, lineHeight: 22 },
  arabicBrand: { fontFamily: Fonts.arabicMedium, fontSize: 15, lineHeight: 22 },
  labelLarge: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 22 },
  skip: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
  codeDigit: { fontFamily: Fonts.semiBold, fontSize: 22, lineHeight: 28 },
  phonePrefix: { fontFamily: Fonts.medium, fontSize: 20, lineHeight: 30 },
  wheel: { fontFamily: Fonts.regular, fontSize: 17, lineHeight: 24 },
  /** Earthy's answers in chat (F9 v2). */
  answer: { fontFamily: Fonts.regular, fontSize: 17, lineHeight: 25 },
  wheelSelected: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 28 },
  hint: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  note: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 19 },
  fieldLabel: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 19 },
  sectionCaps: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 19 },
  terms: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 17 },
  numeral: { fontFamily: Fonts.semiBold, fontSize: 44, lineHeight: 52 },
  digit: { fontFamily: Fonts.semiBold, fontSize: 26.04, lineHeight: 31 },
  heading: { fontFamily: Fonts.semiBold, fontSize: 24, lineHeight: 32 },
  cardTitle: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 26 },
  dateNumber: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 22 },
  sectionTitle: { fontFamily: Fonts.semiBold, fontSize: 16, lineHeight: 24 },
  unit: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 22 },
  buttonPrimary: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: Fonts.semiBold, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: Fonts.medium, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 20 },
  location: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 19 },
  bodyMedium: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
  labelSmall: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 18 },
  eyebrow: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 18, letterSpacing: 1.04 },
  eyebrowDate: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 18, letterSpacing: 1.04 },
  meta: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 18 },
  chip: { fontFamily: Fonts.medium, fontSize: 12, lineHeight: 18 },
  avatar: { fontFamily: Fonts.semiBold, fontSize: 11, lineHeight: 14 },
  ringCaption: { fontFamily: Fonts.regular, fontSize: 11, lineHeight: 14 },
  tabLabel: { fontFamily: Fonts.medium, fontSize: 11, lineHeight: 16 },
  tabLabelActive: { fontFamily: Fonts.semiBold, fontSize: 11, lineHeight: 16 },
  ticketEyebrow: { fontFamily: Fonts.medium, fontSize: 11, lineHeight: 16, letterSpacing: 0.66, textTransform: 'uppercase' },
  ticketTag: { fontFamily: Fonts.medium, fontSize: 11, lineHeight: 16 },
  ticketCaption: { fontFamily: Fonts.regular, fontSize: 11, lineHeight: 16 },
  ticketFieldLabel: { fontFamily: Fonts.semiBold, fontSize: 10, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  micro: { fontFamily: Fonts.regular, fontSize: 10, lineHeight: 14 },
  microMedium: { fontFamily: Fonts.medium, fontSize: 10, lineHeight: 14 },
  smallMedium: { fontFamily: Fonts.medium, fontSize: 11, lineHeight: 16 },
  // Round 2 host and impact screens (Figma, 13 Nov).
  pageTitle: { fontFamily: Fonts.semiBold, fontSize: 26, lineHeight: 34 },
  body14: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 21 },
  rowTitle: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 21 },
  chipAction: { fontFamily: Fonts.semiBold, fontSize: 12, lineHeight: 16 },
  bodyMedium14: { fontFamily: Fonts.medium, fontSize: 14, lineHeight: 20 },
  headerTitle: { fontFamily: Fonts.semiBold, fontSize: 16, lineHeight: 22 },
  labelMedium14: { fontFamily: Fonts.semiBold, fontSize: 14, lineHeight: 21 },
  micro11: { fontFamily: Fonts.regular, fontSize: 11, lineHeight: 15 },
  micro10: { fontFamily: Fonts.semiBold, fontSize: 10, lineHeight: 12 },
  micro9: { fontFamily: Fonts.semiBold, fontSize: 9, lineHeight: 12 },
  filterLabelTight: { fontFamily: Fonts.medium, fontSize: 12, lineHeight: 16 },
  /** Figma F4·2 step titles (15 SemiBold / 20). */
  stepTitle: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 20 },
  /** Figma resin code numbers (13 SemiBold / 16). */
  codeNumber: { fontFamily: Fonts.semiBold, fontSize: 13, lineHeight: 16 },
  coverTitle: { fontFamily: Fonts.semiBold, fontSize: 19, lineHeight: 25 },
  answer14: { fontFamily: Fonts.medium, fontSize: 14, lineHeight: 21 },
  pinLabel: { fontFamily: Fonts.semiBold, fontSize: 12, lineHeight: 18 },
  fieldValue: { fontFamily: Fonts.medium, fontSize: 16, lineHeight: 22 },
  sheetTitle: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 27 },
  placeTitle: { fontFamily: Fonts.semiBold, fontSize: 17, lineHeight: 24 },
  rankNumber: { fontFamily: Fonts.semiBold, fontSize: 17, lineHeight: 22 },
  reasonTitle: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
  creditLabel: { fontFamily: Fonts.semiBold, fontSize: 12.5, lineHeight: 19 },
  micro10Medium: { fontFamily: Fonts.medium, fontSize: 10, lineHeight: 15 },
  dateMonth9: { fontFamily: Fonts.medium, fontSize: 9, lineHeight: 13 },
  receiptTotal: { fontFamily: Fonts.semiBold, fontSize: 36, lineHeight: 54 },
  reasonTitleRegular: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },
  issueGlyph: { fontFamily: Fonts.semiBold, fontSize: 22, lineHeight: 33 },
  hintTight: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  /** Figma F4·6 Earthy's answer (18 Medium / normal). */
  answer18: { fontFamily: Fonts.medium, fontSize: 18, lineHeight: 27 },
  /** Figma F4·6 bin chips (11 Medium / normal). */
  binChip: { fontFamily: Fonts.medium, fontSize: 11, lineHeight: 17 },
});
