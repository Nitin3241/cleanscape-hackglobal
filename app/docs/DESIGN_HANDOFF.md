# CleanScape — design handoff for Claude Code

Last design update: 8 Nov 2026. Source of truth: Figma file `6Jc3DgUuXJDOdc5Z4IC4Lm`, page **Rain Ready (UAE)**, section **🌿 CleanScape × EEG — MVP (New Iteration)**.

> **How to use this file.** Put it at `docs/DESIGN_HANDOFF.md` with `assets/brand/cleanscape-logomark.svg`, then tell Claude Code:
> "Read docs/DESIGN_HANDOFF.md and implement section by section. Ask me before changing navigation structure."
> If the Figma MCP server is connected in Claude Code, it can pull exact layouts with `get_design_context` using the node IDs below.

The app is an **Expo (React Native)** app, demoed by screen-recording in **Expo Go** for investors. Everything below must work in Expo Go (no custom native modules).

---

## 1. Libraries (all Expo Go compatible)

| Need | Package |
|---|---|
| Motion | `react-native-reanimated` (+ `react-native-gesture-handler`) |
| Liquid Glass | `expo-blur` (`BlurView`) — `expo-glass-effect` only on iOS 26+, fall back to BlurView |
| Gradients (AI orb) | `expo-linear-gradient` |
| Bottom sheets | `@gorhom/bottom-sheet` |
| Fonts | `expo-font` + `@expo-google-fonts/poppins`, `@expo-google-fonts/readex-pro` |
| Icons | `lucide-react-native` (line icons). **No emojis anywhere.** |
| SVG logo | `react-native-svg` |
| Haptics | `expo-haptics` (light tap on primary actions, success on check-in) |

---

## 2. Tokens

```ts
// theme/tokens.ts
export const color = {
  sea:      { 100:'#E6F3F8', 200:'#B9DDEA', 300:'#5FB3CF', 400:'#2A8FA8', 500:'#1E6280', 600:'#154A62', 700:'#0E3345' },
  marigold: { 100:'#FFF6E0', 200:'#FFE3A3', 300:'#FFC94D', 400:'#FFB020', 500:'#E08E00', 600:'#A86600', 700:'#7A4A00' },
  coral:    { 100:'#FFEDEA', 200:'#FFD0C9', 300:'#FFA196', 400:'#FF7A70', 500:'#F0544A', 600:'#B8332B', 700:'#85231D' },
  ink: '#12252E', inkSoft: '#50636B',
  stroke: '#798C94', strokeCard: '#E3E8EB', strokeChip: '#D9DEE1',
  background: '#FFFFFF', card: '#FFFFFF',
  success: '#1E7A46', successSubtle: '#E3F5EA',
  error: '#C0392B', errorSubtle: '#FCEAE8',
};
export const brand = color.sea[500];          // interactive colour
export const motion = {
  duration: { instant:100, fast:150, base:250, slow:400, celebrate:600 },
  stagger: 60,
  easeOut:  [0.2, 0.8, 0.2, 1],               // default for everything
  pop:      [0.34, 1.56, 0.64, 1],            // pop-in (cards, rewards)
};
export const radius = { chip: 12, card: 18, sheet: 28, button: 999 };
export const space = [4, 8, 12, 16, 24, 32, 48];
```

Rules:
- **White background everywhere** (`#FFFFFF`). Do not use the sand colour as a page background.
- **Bottom sheets are white**, radius 28 top corners, grabber 36×4.
- **Cards:** white, 1 px `#E3E8EB` border, radius 18–22, shadow `rgba(18,37,46,0.07)` y 6 blur 20.
- **Chips:** white, 1 px `#D9DEE1`. Coloured fills only when the colour means something (status, warning, success).
- **Typography:** Poppins (Regular 400, Medium 500, SemiBold 600). Arabic: Readex Pro Medium. Body 16, small 14, caption 12, titles 20/24/28.
- **CTAs:** two words max ("Book seat", "Confirm", "Resend").
- Bilingual EN/AR: support RTL (`I18nManager`), mirror chevrons.

---

## 3. Logo (updated)

- New mark: `assets/brand/cleanscape-logomark.svg` (white glyph on `#1E6280` rounded square, radius ≈ 23% of size).
- Wordmark lockup: `[logomark] CleanScape | كلين سكيب` — Poppins SemiBold 16 `#1E6280`, 1×16 divider, Arabic in Readex Pro Medium 15.
- Use it on: splash, app icon (`app.json` → `icon`, `adaptiveIcon`), wallet-pass header, notifications, lock-screen widgets.
- **Do not** use the logo for the AI. The AI has its own identity (next section).
- Ask the designer for the original vector if available; the SVG here is a redraw.

---

## 4. Liquid Glass (floating controls only)

Apply to: header round buttons, floating composer, FAB, map controls, scanner panel.

```tsx
<BlurView intensity={40} tint="light" style={{ borderRadius: 999, overflow: 'hidden',
  backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)' }} />
// on photos: backgroundColor rgba(255,255,255,0.16), borderColor rgba(255,255,255,0.55)
```

---

## 5. Earthy (the AI) — what changed

**Identity:** the gradient **AI orb** (Figma component `AI/Orb`, node `413:10671`) is used **only** for AI. Build it as a circle with a linear gradient (sea → marigold/green highlight) plus a soft white highlight ellipse at the top left. It slowly breathes (scale 1 → 1.04, 2.4 s loop) while Earthy is idle, and pulses with the mic level while listening.

### 5.1 Entry: FAB → quick voice sheet
- Home FAB (`167:1711`) tap → white **bottom sheet** (Figma `F9v2·0`, node `650:11453`), not a new screen.
- Sheet contents: grabber, **Full screen** pill (top left, expand icon), close (top right), orb, prompt, live transcript, mic button with level rings, "Type instead" link, EN/ع toggle.
- **Full screen** → full-screen voice mode. **Type instead** → Earthy chat home.

### 5.2 Full-screen voice (Gemini Live style)
Frames: `F9v2·2` listening `413:10760` → `F9v2·2a` thinking `649:11374` → `F9v2·2b` speaking `649:11435`.
- Listening: big orb, live transcript, bottom bar Mute / Show / Type / End.
- Thinking: step list with ticks ("Looking at clean-ups near Al Karama", "Checking who in Grade 9B is going", "Checking Saturday's heat") — ticks appear with 60 ms stagger.
- Speaking: answer text + a result card that pops in; "Tap anywhere to interrupt".
- Footer: "Earthy can make mistakes. Check event details."

### 5.3 Chat screens
Every chat screen has the same header: **Close** (down-chevron, glass, top left → dismiss), Earthy title with small orb (centre), **Full screen** (expand icon, glass, top right → full-screen voice). Floating composer at the bottom: + , "Ask Earthy", mic, lens | wave button (wave = full-screen voice).

Answer anatomy: user bubble (right) → "Earthy" label row with orb + speaker icon → answer text → one result card → feedback icons (thumbs up/down, copy, share) → suggestion chips (list rows, 40 px).

### 5.4 Demo stories (use these for the investor video)
Build these as real, scripted conversations with mocked data. Each step appends to the same thread.

**Story A — Plan my Saturday** (`F9v2·A1–A4`, nodes `660:11493`, `660:11566`, `660:11669`, `660:11754`)
1. "Find something near me with my friends" → best-match card (Kite Beach, Sat 5 Dec 7 AM, Maya and Omar going, carpool with Omar) → **Book seat**
2. "What should I bring?" → checklist card (water 1 L, hat + sunscreen, closed shoes; gloves and bags provided) → chips: Add these to my reminders / Join with class code
3. "Join with code K7F2" → confirm card (Grade 9B · Al Barsha School, Kite Beach · Sat 5 Dec, "Mum gets a WhatsApp to approve") → **Confirm** / Cancel
4. "Did my mum approve?" → consent status card (Waiting, sent yesterday 7:40 PM) → **Resend** / Not now

**Story B — On the day** (`F9v2·B1–B4`, nodes `660:11841`, `660:11930`, `660:12019`, `660:12103`)
1. Gloves mode: "Add two bags of plastic" → tally card (Plastic 3 bags, Mixed 2 bags, Cans 12) → Undo last / Add a photo / chip "Remind me to drink water"
2. "Remind me to drink water" → timer card "Next water break in 12 min" (Every 15 / Every 30 / Stop) → chip "I don't feel well"
3. "It's really hot, I feel dizzy" → safety card (shade, water, "Safety guidance, not medical advice") → **Alert organiser** / Call 999
4. "كم ساعة تطوعت؟" → impact card (hours vs school goal, Smileys, clean-ups) — shows Arabic support

Edge screens to support (not in the stories): did-you-mean (`413:10845`), Earthy Lens camera (`413:10806`), organiser headcount (`413:11547`), caption writer 18+ (`413:11694`), locked under 13 (`413:11771`).

---

## 6. Motion spec (Reanimated)

Keep it subtle. **No tab bar animation.**

| Moment | Spec |
|---|---|
| Default transition | 450 ms, bezier(0.2, 0.8, 0.2, 1) |
| New chat turn | previous messages `translateY` up by new content height (450 ms easeOut); new user bubble fades in + slides 12 px up; Earthy answer text fades in 150 ms later; result card pops (scale 0.8 → 1, opacity 0 → 1, 550 ms, bezier(0.34,1.56,0.64,1)) after another 150 ms; chips stagger 60 ms |
| FAB → voice sheet | sheet springs up (damping 20, stiffness 180); scrim fades to 30% black in 250 ms; FAB glow fades out |
| Sheet → full screen | sheet expands to full height (400 ms easeOut), orb scales 1 → 1.6 and moves to centre (shared value) |
| Listening | orb scale follows mic level (0.98–1.08), 2 rings ripple outward every 1.2 s |
| Thinking | step ticks appear with 60 ms stagger; orb rotates gradient slowly |
| Reward (+Smileys) | number counts up over 600 ms; badge pops with the pop curve; success haptic |
| Cards on screen load | fade + 8 px rise, 60 ms stagger, max 5 items |
| Press state | scale 0.97 in 100 ms, back in 150 ms |

Respect reduced motion (`useReducedMotion()` → skip transforms, keep fades).

---

## 7. Other recent design decisions

- **One scanner for everything** (QR check-in, bag log, item sorting). Earthy auto-detects what is being scanned. Scanner has a glass bottom panel. Reference frame: F4·7 scanner `455:10167`.
- **Reporting (residents):** R1 flow — Earthy detects litter → coach → hazard → voice note → review → sent (`595:11171` onwards).
- **Smileys:** reward currency, redeemable at sponsor stores (food, clothes). F7 frames `3:548`, `639:11313`, `640:11294`, `640:11358`.
- **POV labels:** Volunteer POV (blue) and Crew head POV (amber). Organiser POV comes later.
- Real photos for events (Kite Beach etc.), not illustrations.

---

## 8. Demo-mode checklist for the Expo Go recording

- Add a `DEMO_MODE` flag that loads mock data (user Sara, Grade 9B, Kite Beach Sat 5 Dec, 1,240 Smileys) and scripted Earthy replies, so the video never depends on network or a live model.
- Scripted replies should "stream" word by word (30–40 ms per word) to feel live.
- Hide the dev menu, set the status bar to 9:41, full battery (iOS: use Simulator `xcrun simctl status_bar` or record on device with Focus mode on).
- Record at 60 fps; keep each story under 30 seconds.

---

## 9. Known open items (design side)

- Hours data conflict: F9v2·7 says 14 h of 20, F7·1 says 46 h of 60. Use **one** set in mocks once decided.
- Some concept rows (F10, F11) are not fully prototyped yet; build Earthy stories (section 5.4) first.
