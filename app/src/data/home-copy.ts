/**
 * Home's interface wording in English and Arabic, from Figma "01 Home — EN · v2 (3 Final)"
 * and "07 Home — AR (RTL) · v2". Sample content (names, events) lives in home.sample.ts.
 */
import { useLanguage } from '@/state/language';

const en = {
  greeting: (name: string) => `Hi, ${name}`,
  days: 'days',
  toGo: 'to go',
  sortTitle: 'Know your waste',
  sortSubtitle: 'Sort it right in Dubai. Tap one to learn how.',
  seeMore: 'See more',
  hostTitle: 'Host a clean-up',
  hostBody: 'Earthy found 3 spots near you that need help',
  nextCleanup: 'Your next cleanup',
  eventDay: {
    title: 'It’s event day',
    chip: 'Today',
    time: 'Starts 7:00 AM · Kite Beach',
    kit: 'Your kit list and briefing are ready',
    start: 'Start',
  },
  inviteFriends: 'Invite friends',
  addToCalendar: 'Add to calendar',
  inCalendar: 'In calendar',
  syncing: 'Syncing…',
  calendarSynced: 'Calendar synced',
  updateCalendar: 'Update calendar',
  siteShared: 'Site shared',
  impactTitle: 'Your impact this year',
  details: 'Details',
  kgUnit: (goal: number) => `/${goal} kg`,
  collected: 'Collected this year',
  yourYear: (year: string) => `Your ${year}`,
  dotsKey: 'Each dot is a week · Jan → Dec',
  nearby: 'Cleanups near you',
  seeAll: 'See all',
  join: 'Join',
  tabs: { home: 'Home', events: 'Events', smileys: 'Smileys', profile: 'Profile' },
};

const ar: typeof en = {
  greeting: (name: string) => `مرحباً، ${name}`,
  days: 'يوماً',
  toGo: 'متبقية',
  sortTitle: 'ما ستفرزه في 5 ديسمبر',
  sortSubtitle: 'اضغط على مادة لترى ما يوضع فيها',
  seeMore: '',
  // Not in the Arabic Home frame yet; my translation, flagged in docs/OVERNIGHT_LOG.md.
  hostTitle: 'استضف حملة تنظيف',
  hostBody: 'وجد إيرثي 3 مواقع قريبة منك تحتاج إلى المساعدة',
  nextCleanup: 'حملتك القادمة',
  // Event day isn't in the Arabic Home frame yet; my translation, flagged in docs/OVERNIGHT_LOG.md.
  eventDay: {
    title: 'اليوم يوم الحملة',
    chip: 'اليوم',
    time: 'تبدأ 7:00 صباحاً · شاطئ الطائرات الورقية',
    kit: 'قائمة أدواتك والإحاطة جاهزتان',
    start: 'ابدأ',
  },
  inviteFriends: 'ادعُ صديقاً',
  addToCalendar: 'أضف إلى التقويم',
  inCalendar: 'في التقويم',
  syncing: 'جارٍ المزامنة…',
  calendarSynced: 'تمت مزامنة التقويم',
  updateCalendar: 'حدّث التقويم',
  siteShared: 'تمت مشاركة الموقع',
  impactTitle: 'أثرك هذا العام',
  details: 'التفاصيل',
  kgUnit: (goal: number) => `/${goal} كغ`,
  collected: 'جُمعت هذا العام',
  yourYear: (year: string) => `عامك ${year}`,
  dotsKey: 'كل نقطة أسبوع · يناير ← ديسمبر',
  nearby: 'حملات قريبة منك',
  seeAll: 'عرض الكل',
  join: 'انضم',
  tabs: { home: 'الرئيسية', events: 'الفعاليات', smileys: 'الابتسامات', profile: 'حسابي' },
};

export const HOME_COPY = { en, ar } as const;

export function useHomeCopy() {
  return HOME_COPY[useLanguage().language];
}
