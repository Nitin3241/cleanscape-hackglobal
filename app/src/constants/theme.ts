/**
 * CleanScape design tokens. Colour names mirror the Figma variables
 * (`text/on-brand-weak` becomes `textOnBrandWeak`).
 */

const light = {
  background: '#FFFFFF',
  card: '#FFFFFF',
  surface: '#F2EADD',
  fill: '#E6F3F8',
  strokeWeak: '#E3E8EB',
  strokeStrong: '#798C94',
  strokeControl: '#D9DEE1',

  brand: '#1E6280',
  brandPressed: '#154A62',
  secondary: '#FFB020',
  secondarySubtle: '#FFF6E0',
  // Amber alert banner, such as "You're already in Kite Beach that day" (R3b).
  alertStroke: '#F5D9A6',
  alertBadge: '#F2A516',
  textAlert: '#5A3A00',
  textAlertWeak: '#7A5A20',
  secondaryContainer: '#FFE3A3',
  accent: '#FF7A70',
  accentSubtle: '#FFEDEA',
  statusSuccess: '#1E7A46',
  statusSuccessSubtle: '#E3F5EA',

  textStrong: '#12252E',
  textWeak: '#50636B',
  textOnBrand: '#FFFFFF',
  textOnBrandWeak: '#E6F3F8',
  textSecondary: '#7A4A00',
  textAccent: '#B8332B',

  // Raw values in Figma, not yet Figma variables.
  scrim: 'rgba(14, 51, 69, 0.55)',
  // Earthy tip spotlight scrim, 60% (Figma, 13 Nov).
  tipScrim: 'rgba(10, 26, 33, 0.6)',
  mapBase: '#F3F2EE',
  unreadDot: '#5FC08E',
  ticketMuted: '#A9C6D2',
  ticketLabel: '#FFC857',
  ticketGlass: 'rgba(11, 44, 58, 0.55)',
  ticketTear: 'rgba(255, 255, 255, 0.28)',
  // Glass surfaces, cards and states from the registration and travel flows.
  glass: 'rgba(255, 255, 255, 0.5)',
  glassStroke: 'rgba(255, 255, 255, 0.55)',
  glassOnBrand: 'rgba(255, 255, 255, 0.16)',
  // Figma Know your waste headers (F4·1, F4·9u): glass on the blue bar is white 18% with a white 35% edge.
  glassOnHeader: 'rgba(255, 255, 255, 0.18)',
  glassOnHeaderStroke: 'rgba(255, 255, 255, 0.35)',
  glassOnArt: 'rgba(255, 255, 255, 0.38)',
  // Filter chips floating on the map.
  glassOnMap: 'rgba(255, 255, 255, 0.6)',
  passGlass: 'rgba(11, 44, 58, 0.35)',
  passGlassStroke: 'rgba(255, 255, 255, 0.3)',
  // Figma F10·13 story glass: white 16% with a 55% edge; gold eyebrow; soft white copy.
  storyGlass: 'rgba(255, 255, 255, 0.16)',
  // Figma F4·1 bin chips: Glass's chip sits darker on its green tile; Textiles' text is a deep pink.
  glassChip: '#D0E5D8',
  donateText: '#A3305E',
  storyGlassStroke: 'rgba(255, 255, 255, 0.55)',
  storyGold: '#FFC94D',
  storyTextSoft: 'rgba(255, 255, 255, 0.85)',
  storyTextMuted: 'rgba(255, 255, 255, 0.75)',
  passLabel: '#FFE2A3',
  passMuted: '#E3EFF4',
  divider: '#E1E8EB',
  cardTint: '#FAFCFD',
  wellCool: '#F2F6F8',
  // Host flow tint: number chips, action chips and notes (Figma F10·15, #EEF6F9).
  hostTint: '#EEF6F9',
  // Card outline on round-2 cards (#E6EBED).
  strokeCard: '#E6EBED',
  // Loader steps card and grey sheet backgrounds (#F4F7F8).
  loaderCard: '#F4F7F8',
  // Ask field on the plastic Earthy sheet (Figma F4·2s, #F1F4F5).
  askField: '#F1F4F5',
  optionStroke: '#6291A6',
  seatEmpty: '#D5DDE0',
  track: '#E8EEF0',
  tierText: '#8A5A00',
  trafficFill: '#DFF2E6',
  trafficText: '#1E6B40',
  metroRed: '#D9473B',
  // Earthy full-screen voice (handoff coral 500).
  endCall: '#F0544A',
  // Know your waste tiles added in Home v2.
  foodSubtle: '#F6EEE6',
  foodText: '#7A4A28',
  eWasteSubtle: '#EEEAF8',
  eWasteText: '#5340A0',
  // Textiles tile in the Know your waste guide (Figma F4·1).
  textilesSubtle: '#FCE8EF',
  // Loading placeholders (Figma skeleton standard, 13 Nov): a grey block with white lines.
  skeleton: '#E6EBED',
  skeletonLine: '#FFFFFF',
  // Earthy thinking-step spinner track.
  spinnerTrack: '#F2E6CC',
  spinnerTrackOnBrand: 'rgba(255, 255, 255, 0.2)',
  avatarCoral: '#E07A5F',
  avatarTeal: '#5FB3C9',
  avatarBlue: '#3D8BA8',
  avatarPlum: '#8C6BB1',
  // Host flow avatars (Figma F10·10 crew seats).
  avatarMarigold: '#F2A93B',
  avatarLavender: '#9C7BD1',
  avatarGold: '#D4A13A',
  // Empty radio ring (#B9C6CB) and the ask-field placeholder (#7E8F96).
  radioRing: '#B9C6CB',
  // Figma F4·1s unselected emirate radio ring.
  radioRingEmirate: '#AAB7BD',
  textPlaceholder: '#7E8F96',
  // Litter level chips and rank tiles (Figma F10·11, 12 Nov).
  levelHighFill: '#FDECEA',
  levelHighText: '#C8403A',
  levelMediumFill: '#FFF1D6',
  levelMediumText: '#B86E00',
  levelLowFill: '#E6F4EC',
  levelLowText: '#1E7A46',
  // Secondary hairline on chips and steppers (#D9DEE1) and the co-host chip (#C9D4D8).
  strokeChip: '#D9DEE1',
  // Ask chips round Earthy's orb (Figma Onb 02.4).
  strokeAskChip: '#D9E5EB',
  strokeCoHost: '#C9D4D8',
  // Selected time chip note (#B9DDEA), photo tag (white 90%), bottom-bar top line (#EEF1F2).
  timeNoteOnBrand: '#B9DDEA',
  coverTag: 'rgba(255, 255, 255, 0.9)',
  dividerSoft: '#EEF1F2',
  // Meeting-point pill on a map (white 70%, stroke white 85%) and the frosted save bar (white 78%) (Figma C1 v2).
  meetPin: 'rgba(255, 255, 255, 0.7)',
  meetPinStroke: 'rgba(255, 255, 255, 0.85)',
  saveBar: 'rgba(255, 255, 255, 0.78)',
  // "In review" dot and the current step ring on F10·16 (#E8A33D).
  reviewPending: '#E8A33D',
  // EEG's change request card on F10·16b (#FFF6F5, stroke #F5C9C6).
  issueFill: '#FFF6F5',
  issueStroke: '#F5C9C6',
  // "You're live" card on F10·17 (#E9F6EE).
  approvedFill: '#E9F6EE',
  // Litter radar (F10·11): pin rank circles, legend dots and heat (#F0544A high, #E08E00 medium, #FFB020 amber heat),
  // the selected pin (ink) and neutral icon tiles on the "Why this spot" sheet (#F2F5F7).
  pinHigh: '#F0544A',
  pinMedium: '#E08E00',
  heatMedium: '#FFB020',
  pinSelected: '#12252E',
  tileNeutral: '#F2F5F7',
  // Add to calendar (CAL1, CAL3–CAL6): close tile, the "Keep it synced" box, list hairlines, list chevrons,
  // the green "In calendar" button, the blue "Syncing / Calendar synced" button and the "Site shared" chip.
  // Friend avatars on P1 (Rahul #4C9A6A, Fatima #C26FA8, Karan #7A8FA6) and the red request badge on P0.
  avatarGreenDeep: '#4C9A6A',
  avatarPink: '#C26FA8',
  avatarSlate: '#7A8FA6',
  // R1·2p: the white veil over a blurred face or plate (white 30%).
  blurVeil: 'rgba(255, 255, 255, 0.3)',
  // F4·9p: the marigold dashed detect box (#E9A23B, fill 10%), the glow on each part row, and the camera dim.
  detectAmber: '#E9A23B',
  detectAmberFill: 'rgba(233, 162, 59, 0.1)',
  detectAmberGlow: 'rgba(233, 162, 59, 0.22)',
  scanDim: 'rgba(11, 26, 32, 0.45)',
  // Figma Know your waste sheets (F4·1s, F4·9c): scrim #0B1A20 at 50%.
  scrimInk: 'rgba(11, 26, 32, 0.5)',
  // F4·2 Crew head scanner (199:3499): camera dim, scrims, marigold brackets and line, progress fill, Recent card,
  // List / Scan pill, the SA avatar.
  scanCameraDim: 'rgba(5, 15, 20, 0.22)',
  scanScrimTop: 'rgba(5, 15, 20, 0.75)',
  scanScrimBottom: 'rgba(5, 15, 20, 0.7)',
  scanBracket: '#E2A145',
  scanLine: 'rgba(233, 162, 59, 0.9)',
  checkInBar: '#4CC38A',
  scanCard: 'rgba(10, 26, 33, 0.4)',
  // Figma F4·7 / F4·7p control panel (ink 38%, white 28% edge) and its flat gallery thumbnail.
  scanPanel: 'rgba(10, 26, 33, 0.38)',
  // Figma stroke/weak in the 13 Nov list pattern (F4·9u, F4·9c, F9·S1): a warm edge, not the cool #E3E8EB.
  strokeWarm: '#EFE6D8',
  scanGallery: '#C9B48E',
  scanCardStroke: 'rgba(255, 255, 255, 0.25)',
  scanToggle: 'rgba(255, 255, 255, 0.64)',
  scanToggleStroke: 'rgba(255, 255, 255, 0.35)',
  avatarSea: '#2A8FA8',
  // F4·2a–c problem sheets: the "YA" avatar (#5FB3CF), the red status circle (#FCEAE8 / #C0392B) and the camera dim
  // (black 35%).
  avatarSky: '#5FB3CF',
  issueRedFill: '#FCEAE8',
  issueRed: '#C0392B',
  scanIssueDim: 'rgba(0, 0, 0, 0.35)',
  // F5·1 bag sticker: photo dim (black 12%) and the "How full is it?" segmented well (#EEF3F5).
  bagDim: 'rgba(0, 0, 0, 0.12)',
  segmentWell: '#EEF3F5',
  closeTile: '#EEF2F4',
  syncFill: '#F2F8FA',
  syncStroke: '#D7E7EE',
  syncingStroke: '#C9DEE7',
  calendarStroke: '#E3E9EC',
  chevronWeak: '#9AA8AE',
  addedFill: '#F1F9F4',
  addedStroke: '#B9DFC8',
  siteSharedFill: '#FFF4E0',
  siteSharedText: '#9A5B00',
  // Toast border (white 35%) (CAL3 snackbar).
  toastStroke: 'rgba(255, 255, 255, 0.35)',
  // F10·9 Spot it: "Other" in the litter mix (#FF7A70) and the dark "~40 m²" area tag (ink 70%).
  mixOther: '#FF7A70',
  areaTag: 'rgba(18, 37, 46, 0.7)',
  // Date tag on a photo, F10·18 / F10·19 (#0A1A21 at 60%).
  photoTag: 'rgba(10, 26, 33, 0.6)',
  avatarGreen: '#5B9A6E',
  // Darker marigold for numbers on white, such as "33 kg" paper (Figma F3·8c).
  textPaper: '#A86600',
  // "You're checked in" tick (Figma F3·7).
  checkedIn: '#2E9E5B',
  // Crew check-in toast: green at 92% (Figma F4·2, 13 Nov).
  // F4·2 "Checked-in toast": status/success at 92%.
  checkInToast: 'rgba(30, 122, 70, 0.92)',
  // Check-in times on the dark scanner (Figma F4·2).
  // F4·2 "Recent" times (#8DF0BD).
  checkedInOnDark: '#8DF0BD',
  // Map pin for a full cleanup: grey ring and face.
  pinFull: '#9AA7AD',
  pinFullFill: '#EEF1F2',
  // Event day (F11·2–11): the red and amber crew avatars and zone states.
  avatarRed: '#F0544A',
  avatarAmber: '#E08E00',
  // Earthy home "Today" tiles (F9v2·1): the sun and smile icons (#B37400).
  iconMarigold: '#B37400',
  // Earthy answers (F9v2): the parent-consent and heat-safety tint (#FBE7E1) and its alert icon (#B4492F),
  // the checklist ticks (#2E8B57) and the quiet bars in "last 6" (#B9DDEA).
  earthyAlertTint: '#FBE7E1',
  earthyAlertIcon: '#B4492F',
  earthyCheck: '#2E8B57',
  earthyBar: '#B9DDEA',
  // AI/Button Danger, "Alert organiser" on heat safety (#D6421B).
  earthyDanger: '#D6421B',
  // Voice transcript (F9v2·0, F9v2·2): the words Earthy hasn't heard yet (#9AABB2).
  earthyUnheard: '#9AABB2',
  // T6 ride chat "Composer": white 62% glass.
  glassComposer: 'rgba(255, 255, 255, 0.62)',
  // T5 Request sent: the "Avatar pulse" halo round the driver (brand at 12%).
  brandHalo: 'rgba(30, 98, 128, 0.12)',
} as const;

export const Colors = {
  light,
  // Figma has no dark palette yet and app.json locks the app to light mode.
  dark: light,
} as const;

export type ThemeColor = keyof typeof Colors.light;

/** Stops for `expo-linear-gradient`. */
export const Gradients = {
  header: {
    colors: ['#1E6280', '#1F6A8A', '#2A8FA8'],
    locations: [0.08, 0.44, 0.88],
    start: { x: 0, y: 0.15 },
    end: { x: 1, y: 0.85 },
  },
  // Figma "Header bar" on Know your waste (F4·1, F4·9u): the same stops at 130.87°. The points are CSS's gradient line for
  // that angle on a 360 × 104 bar, so native and web draw the same band.
  headerBar: {
    colors: ['#1E6280', '#1F6A8A', '#2A8FA8'],
    locations: [0.08, 0.44, 0.88],
    start: { x: 0.143, y: -0.572 },
    end: { x: 0.857, y: 1.572 },
  },
  // Figma CampaignBanner (Home v2 final): sea gradient, glows drawn on top in the ticket card.
  ticket: {
    colors: ['#2C7E9B', '#25708F', '#2D6193'],
    locations: [0, 0.5, 1],
    start: { x: 0.4, y: 0 },
    end: { x: 0.6, y: 1 },
  },
  splash: { colors: ['#D5ECF4', '#E6F3F8', '#F3F9FB'], locations: [0, 0.6, 1] },
  goodToGo: { colors: ['#D5ECF4', light.background] },
  // Figma Onb 12: #D5ECF4 to white at 70%, then white.
  goodToGoOnboarding: { colors: ['#D5ECF4', light.background], locations: [0, 0.7] },
  pass: {
    colors: ['#2C7E9B', '#25708F', '#2D6193'],
    locations: [0.05, 0.5, 0.95],
    start: { x: 0.4, y: 0 },
    end: { x: 0.6, y: 1 },
  },
} as const;

/** `boxShadow` strings, matching the Figma effects. */
export const Shadows = {
  chip: '0px 6px 20px 0px rgba(18, 37, 46, 0.08)',
  /** Figma Onb 02.4 ask chips: y 6, blur 16. */
  askChip: '0px 6px 16px 0px rgba(18, 41, 51, 0.1)',
  ticket: '0px 10px 24px -6px rgba(15, 51, 69, 0.18)',
  digit: '0px 2.48px 0px 0px rgba(13, 51, 69, 0.35)',
  buttonPrimary: `0px 4px 0px 0px ${light.brandPressed}`,
  buttonSecondary: '0px 3px 0px 0px rgba(30, 98, 128, 0.18)',
  tabBar: '0px 8px 24px -6px rgba(18, 37, 46, 0.14)',
  bestCard: '0px 8px 20px -4px rgba(30, 98, 128, 0.16)',
  rideCard: '0px 4px 12px 0px rgba(18, 38, 46, 0.06)',
  /** Figma R2 Earthy pick and list button: drop shadow y 4, blur 12. */
  pickPill: '0px 4px 12px 0px rgba(18, 37, 46, 0.12)',
  optionCard: '0px 4px 6px 0px rgba(18, 38, 46, 0.06)',
  footer: '0px -4px 16px 0px rgba(18, 38, 46, 0.12)',
  glassPill: '0px 8px 12px 0px rgba(18, 37, 46, 0.14)',
  fab: '0px 6px 16px 0px rgba(18, 74, 97, 0.25)',
  /** Figma F10·11: the spots sheet (y −4, blur 24), the selected map pin and the other pins. */
  sheetUp: '0px -4px 24px 0px rgba(0, 0, 0, 0.1)',
  pinSelected: '0px 4px 5px 0px rgba(18, 38, 46, 0.25)',
  pin: '0px 6px 10px 0px rgba(18, 37, 46, 0.07)',
  /** The blue "you are here" dot's soft halo. */
  youHalo: '0px 0px 12px 6px rgba(30, 98, 128, 0.35)',
  /** F10·9 result sheet (y −4, blur 24, black 12%). */
  sheetUpStrong: '0px -4px 24px 0px rgba(0, 0, 0, 0.12)',
  /** CAL3 snackbar (y 8, blur 12, ink 34%). */
  toast: '0px 8px 12px 0px rgba(18, 37, 46, 0.34)',
  sheet: '0px -8px 32px 0px rgba(13, 51, 69, 0.2)',
  mapSheet: '0px -6px 20px 0px rgba(18, 37, 46, 0.1)',
  mapControl: '0px 2px 8px 0px rgba(18, 37, 46, 0.12)',
  /** Figma F11·4 / F11·6 tags on the map (y 2, blur 8, ink 14%). */
  mapTag: '0px 2px 8px 0px rgba(18, 36, 46, 0.14)',
  stickyFooter: '0px -4px 16px 0px rgba(18, 37, 46, 0.08)',
  // Handoff card: white, 1 px border, rgba(18,37,46,0.07) y 6 blur 20.
  card: '0px 6px 20px 0px rgba(18, 37, 46, 0.07)',
  // School group cards and the active segment (Figma F3: y 8, blur 20, 14%).
  classCard: '0px 8px 20px 0px rgba(18, 37, 46, 0.14)',
  // Class impact cards (Figma F3·8c: y 6, blur 20, 8%).
  impactCard: '0px 6px 20px 0px rgba(18, 37, 46, 0.08)',
  /** Figma F4·6 composer and wave button over page content (y 6, blur 10, 10%). */
  composer: '0px 6px 10px 0px rgba(18, 41, 51, 0.1)',
  /** Figma F4·7 scan control panel (y 8, blur 24, spread −6). */
  scanPanel: '0px 8px 24px -6px rgba(18, 37, 46, 0.18)',
  /** Figma F4·7 scan line glow (blur 12, marigold 80%). */
  scanLine: '0px 0px 12px 0px rgba(233, 162, 59, 0.8)',
} as const;

/** Font family names, as registered by `useFonts` in `src/app/_layout.tsx`. */
export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  arabicRegular: 'ReadexPro_400Regular',
  arabicMedium: 'ReadexPro_500Medium',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  oneHalf: 6,
  two: 8,
  twoHalf: 10,
  twoThreeQuarters: 12,
  threeLess: 14,
  three: 16,
  threeHalf: 20,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  check: 4,
  control: 10,
  small: 12,
  medium: 14,
  option: 16,
  large: 18,
  card: 20,
  panel: 24,
  header: 11,
  tab: 28,
  pill: 99,
} as const;

/** Values from the Figma motion spec (node 102:321). Times are in milliseconds. */
export const Motion = {
  duration: {
    instant: 100,
    fast: 150,
    base: 250,
    slow: 400,
    celebrate: 600,
    shimmer: 1200,
  },
  stagger: 60,
  rise: 8,
  easing: {
    standard: [0.2, 0, 0, 1],
    exit: [0.4, 0, 1, 1],
  },
  /** Figma's "Gentle" spring (stiffness 100, damping 15, mass 1) as a damping ratio. */
  springDampingRatio: 0.75,
  /**
   * Screen transitions, standardised in Figma on 9 Nov 2026 (design/CHANGELOG.md):
   * push = smart animate 450 ms, sheets and slide-ins = 400 ms, in-place state changes = 300 ms,
   * tab bar = instant. Onboarding and F11 keep their own timing.
   */
  transition: {
    push: { duration: 450, easing: [0.22, 1, 0.36, 1] },
    sheet: { duration: 400, easing: [0.32, 0.72, 0, 1] },
    state: { duration: 300, easing: [0.22, 1, 0.36, 1] },
  },
} as const;

/** Space the floating tab bar covers, excluding the bottom safe area. */
export const TabBarHeight = 84;
export const MaxContentWidth = 800;
