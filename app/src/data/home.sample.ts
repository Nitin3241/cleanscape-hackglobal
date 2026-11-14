/**
 * SAMPLE DATA for the home screen. Nothing here is real: names, points, dates,
 * distances and spots are placeholders copied from the Figma frame.
 * Replace this file with real data when the backend exists.
 */

import { alSafaParkXml, jumeirahBeachXml } from '@/constants/illustrations';

/** SAMPLE: fake loading time so the skeleton is visible. Remove when real data arrives. */
// Figma (9 Nov): Home's skeleton retimed to 0.5 s.
export const SAMPLE_LOADING_MS = 500;

export const SAMPLE_HOME = {
  user: {
    firstName: 'Sara',
    location: 'Al karama, Dubai',
    smileys: '1,240',
    hasUnreadNotifications: true,
  },
  campaign: {
    organiser: 'Emirates Environmental Group',
    name: 'Clean UAE 2026',
    status: 'Registration open',
    fields: [
      { label: 'Dates', value: '5 – 15 Dec' },
      { label: 'Where', value: 'All 7 emirates' },
      { label: 'Your day', value: 'Sat, 5 Dec' },
    ],
    daysToGo: '36',
    crew: [
      { id: 'o', label: 'O', tone: 'secondary' },
      { id: 'l', label: 'L', tone: 'accent' },
      { id: 'more', label: '+3', tone: 'fill' },
    ],
    crewSummary: 'Omar, Lina +3 going',
  },
  nextEvent: {
    status: 'Registered',
    title: 'Clean UAE · Dubai leg',
    time: 'Sat, 5 Dec · 7:00 – 10:00 AM',
    place: 'Exact site shared 2 days before',
    // CAL6: once the exact site is shared, the card shows it.
    sitePlace: 'Kite Beach · near lifeguard tower 3',
  },
  impact: {
    collectedKg: 18,
    goalKg: 25,
    summary: '6 h volunteered · 3-cleanup streak',
    toBadge: '7 kg to badge',
    year: '2026',
    /** Week numbers (1–52) for the year strip. */
    cleanupWeeks: [11, 24, 42],
    thisWeek: 44,
    eventWeek: 49,
  },
  sortDate: '5 Dec',
  nearbyEvents: [
    {
      id: 'jumeirah-beach',
      title: 'Jumeirah Beach sweep',
      day: '12',
      month: 'DEC',
      details: '3.2 km · Sat, 7:00 AM',
      spotsLeft: '18 spots left',
      artwork: jumeirahBeachXml,
    },
    {
      id: 'al-safa-park',
      title: 'Al Safa Park cleanup',
      day: '19',
      month: 'DEC',
      details: '5.8 km · Fri, 4:00 PM',
      spotsLeft: '9 spots left',
      artwork: alSafaParkXml,
    },
  ],
} as const;

/** Same shape as SAMPLE_HOME with any text, so other languages can fill it. Tones stay fixed. */
type Localised<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Localised<U>[]
    : T extends object
      ? { readonly [K in keyof T]: K extends 'tone' ? T[K] : Localised<T[K]> }
      : T;

export type HomeSample = Localised<typeof SAMPLE_HOME>;

/** SAMPLE: the same home in Arabic, text from Figma "07 Home — AR (RTL) · v2". */
export const SAMPLE_HOME_AR: HomeSample = {
  ...SAMPLE_HOME,
  user: { ...SAMPLE_HOME.user, firstName: 'سارة', location: 'الكرامة، دبي' },
  campaign: {
    ...SAMPLE_HOME.campaign,
    organiser: 'مجموعة عمل الإمارات للبيئة',
    name: 'نظّفوا الإمارات 2026',
    status: 'التسجيل مفتوح',
    fields: [
      { label: 'التواريخ', value: '5 – 15 ديسمبر' },
      { label: 'المكان', value: 'الإمارات السبع' },
      { label: 'يومك', value: 'السبت 5/12' },
    ],
    crewSummary: 'عمر ولينا و3 آخرون مشاركون',
  },
  nextEvent: {
    status: 'مسجّل',
    title: 'نظّفوا الإمارات · مرحلة دبي',
    time: 'السبت 5 ديسمبر · 7:00 – 10:00 ص',
    place: 'نرسل الموقع الدقيق قبل يومين',
    sitePlace: 'شاطئ كايت · قرب برج الإنقاذ 3',
  },
  impact: {
    ...SAMPLE_HOME.impact,
    summary: '6 ساعات تطوع · 3 حملات متتالية',
    toBadge: '7 كغ للوسام',
  },
  nearbyEvents: [
    { ...SAMPLE_HOME.nearbyEvents[0], title: 'تنظيف شاطئ جميرا', month: 'ديسمبر', details: '3.2 كم · السبت 7:00 ص', spotsLeft: '18 مقعداً متبقياً' },
    { ...SAMPLE_HOME.nearbyEvents[1], title: 'تنظيف حديقة الصفا', month: 'ديسمبر', details: '5.8 كم · الجمعة 4:00 م', spotsLeft: '9 مقاعد متبقية' },
  ],
};
