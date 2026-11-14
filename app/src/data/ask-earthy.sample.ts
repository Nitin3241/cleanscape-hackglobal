/**
 * SAMPLE DATA for Ask Earthy, the cleanup results, event detail and map. Nothing
 * here is real: the conversation, events, people, routes and coordinates are
 * placeholders copied from Figma. Replace this file when real services exist.
 */

import { kiteEventXml, mushrifEventXml, rasAlKhorEventXml } from '@/constants/ask-earthy-art';

export const SAMPLE_RESULTS = {
  title: 'Cleanups this weekend',
  summary: 'Found 3 near you. Kite Beach is the best fit, and it still has spots!',
  filters: [
    { label: 'This weekend', selected: true },
    { label: 'Near me', selected: true },
    { label: 'Beach', selected: true },
    { label: 'Kids OK', selected: false },
  ],
  events: [
    {
      id: 'kite-beach',
      artwork: kiteEventXml,
      bestMatch: true,
      when: 'SAT, 5 DEC · 7 AM',
      title: 'Kite Beach cleanup',
      meta: 'Umm Suqeim · 4.2 km  ·  22 spots left',
    },
    {
      id: 'mushrif-park',
      artwork: mushrifEventXml,
      bestMatch: false,
      when: 'SUN, 6 DEC · 8 AM',
      title: 'Mushrif Park litter walk',
      meta: 'Mushrif · 11 km  ·  Family friendly',
    },
    {
      id: 'ras-al-khor',
      artwork: rasAlKhorEventXml,
      bestMatch: false,
      when: 'SAT, 5 DEC · 4 PM',
      title: 'Ras Al Khor mangrove sweep',
      meta: 'Ras Al Khor · 9 km  ·  Ages 12+',
    },
  ],
} as const;

export const SAMPLE_EVENT = {
  when: 'SAT, 5 DEC · 7:00–10:00 AM',
  title: 'Kite Beach cleanup',
  subtitle: 'Clean UAE · Dubai leg · by Emirates Environmental Group',
  going: { initials: ['AM', 'RK', 'SF', '+'], summary: '128 going · 22 spots left' },
  smileys: '+50',
  gloves: { title: 'Gloves', detail: 'provided' },
  ages: { title: 'Ages 8+', detail: 'with adult' },
  eta: '18 min · 14 km',
  directions: 'Kite Beach, Umm Suqeim 1. Meet at Gate 2 by 6:45 AM.',
  carpool: {
    title: 'Share a ride, earn +10',
    body: 'Beach parking fills up by 7 AM. Carpool with people from your area, or park at Lot B.',
  },
  bringNote: 'EEG brings gloves, bags and grabbers.',
  price: 'Free',
  spotsLeft: '22 spots left',
  register: 'Register for 5 Dec',
  mapSubtitle: 'Sat 5 Dec · Meet 6:45 AM',
  driveTime: '18 min drive',
  leaveAt: '6:25 AM',
  route: '14 km via Al Wasl Rd · light traffic now',
  meetingPoint: 'Gate 2, by lifeguard tower 3',
  parking: 'Lot B · free · fills by 6:45 AM',
  crewLead: { initials: 'AK', name: 'Aisha K.', role: 'Crew lead · EEG' },
  // Approximate, for opening a navigation app in this prototype.
  coordinates: { latitude: 25.1583, longitude: 55.1975 },
} as const;
