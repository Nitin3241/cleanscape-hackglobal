# Overnight build log

## 14 Nov 2026 (afternoon): round 2 finish, session 9e38f8dc — progress

Working list (updated as I go):
- [x] Spot it is a push (11f6a90); round 2 docs committed (4f6b890)
- [x] Modal audit (72f4bdb): R1·2p, R1·4 registered as full-screen modals; event map and impact story dismiss before navigating
- [x] Getting there fix cherry-picked (9bafab4); T1 tip comparison + tip follows its target (0cd06cb)
- [x] F4·2 Plastic lesson, F4·2s/F4·2t Ask Earthy sheet (8ed99f3)
- [x] F4·2q1–q4 Plastic quiz (this commit)
- [x] F4·6g Green bins near you; Find bins (F4·9, F4·9p) and the pizza answer's green-bin follow-up open it; F4·1s and F4·2s fade in
- [x] F4·3 Drop-off near you (copy rewrite, new map and pins, floating sheet) and F4·3a/F4·3b tips
- [x] F4·4 Reverse vending machine rebuilt (12 Nov redesign); F4·9 / F4·9p result sheets, glow wash + sweep, 2.5 s scan timing
- [x] Know your waste done: F4·1, F4·1s, F4·6, F4·7/7p, F4·8, F4·9u, F4·9c (helper agent, checked here)
- [x] Link audit of SCREENS.md: 9 timers and 14 wrong taps fixed (see Decisions)
- [x] Event day F11·1–11 rebuilt to the live redesign (blue header, phase bar, cards), Home event day Details → Smileys
- [x] Earthy chat F9v2·1, ·4–·16 matched; Plan my Saturday A1–A4 and On the day B1–B4 built
- [ ] Earthy voice ·0/·2/·2a/·2b words, Lens ·3, F9·S1–S3
- [ ] Rides T3–T14, F3·9 (blue header, floating sheets)
- [ ] Reports R1·2 → R1·2p, R1·3 Track → R1·4
- [ ] F10·10 / F10·10s invite card: follow Figma, no extra 20 px
- [ ] Every CHECK frame; every SCREENS.md link wired
- [ ] Changelog → Synced, PROJECT_STATUS.md, NAVIGATION_MAP.md, summary at top

## 14 Nov 2026: round 2 redo, unattended (in progress)

Following `design/ROUND_2_MANIFEST.md` → Unattended mode. Every frame: fresh `get_screenshot` saved over
`design/screens/<slug>.png`, `get_design_context` (plus read-only `use_figma` for exact boxes), build, then a
360 × 800 side-by-side saved to `design/compare/<slug>.png`. Commit per flow; nothing pushed.

### Decisions and problems

- **Earthy chat now follows the prototype screen by screen** (`/earthy-chat?start=<step>`): each tap pushes the next
  frame, Close goes back, links to F9v2·1 return to Earthy home. Plan my Saturday (A1–A4) and On the day (B1–B4) are
  new. Earthy home shows Figma's four suggestion rows; the five extra rows were removed (F10·7 organiser-new, parked
  in Figma, now has no entry). ·11 "Alert organiser" has no Figma link: it goes to B4 ("crew head is on the way")
  rather than stay dead. "Alert organiser" red #D6421B is ~4.1:1 with white, just under AA: built as drawn.
  ·6 "Add these to my reminders" → ·14 water timer, as the prototype says.

- **Event day was redesigned in Figma** (blue header "Kite Beach clean-up", 4-pill phase bar, white cards, two pill
  buttons), so all 11 cards were rebuilt rather than patched (helper agent, checked here). F11·4 has the real blue
  flag; F11·6 the status-coloured zone circles; F11·6 and F11·8 gained the Help button (→ F11·7). F11·6's frame hides
  three stat tiles and a note under its map: built as drawn (not shown). Cards without an Earthy note in Figma lost
  their old "Why:" line. "Certificate ready" on F11·9 now opens the certificate. Comment field on F11·10 is one line.

- **Prototype timers now match Figma exactly** (all were longer in the app): splash 1.4 s, E5 → E6 3.5 s, E8 undo 4 s,
  CAL4s 1.2 s, F3·7 → F3·8c 3 s, F4·1 check-in → F4·4 3 s, F5·2 → F5·4 3 s, R1·1a 2 s, R1·1c 2.5 s. Some feel quick
  on a phone; Nitin to judge in Expo Go.
- **Taps rewired to the prototype:** Home map chip → R2 on the map; R2 map Join → R4; E1 Keep mine → R7; calendar
  snackbar "Open" → R7 (it used to open the phone's calendar app); 02b Minimise → R7; F3·8c back → F3·4; I3 → I4
  replaces so I4's back lands on I1; I2 "Share day" → impact story; F10·17 back → back; F10·19 Done → litter radar;
  N0 "Earthy noticed 3 spots" → radar, "Picked for you" → Kite Beach; F11·6 → F11·8; F11·7 options do their job
  and go back; T11 Notify me → T1; hazard review R1·2b → R1·3 (no photo check).
- **Not wired, logged:** T12 "newer driver hidden" ↔ T14 guardian line (needs a guardian answer in the sample state);
  F5·4 Done still goes home (earlier agreed deviation).

- **F4·4 rebuilt** (by a helper agent, checked here): sheet from y 220 as the frame draws (the changelog says 228),
  Bring / Leave at home control and the 1→2→3 step card. "Squashed bottles" is clipped in Figma; the app wraps it
  to two lines. "Report full" says "Coming soon". The opened vending pin card reads "Earn points for bottles"
  (shared F4·3 data); the Figma pin component still says "Bottles and cans".

- **Scan results (F4·9, F4·9p) float now:** the shared scan sheet sits 8 px from the edges with 32 px corners and
  20 px sides; the full result is 500 tall with its buttons 32 px from the bottom, as drawn. The pizza part cards
  lost their coloured left bar (changelog line 99). Both use a shared `PartGlow`: the static orange wash plus the
  one-time sweep (0.35 s and 0.57 s, 1.1 s each, skipped with Reduce Motion). The glow is an SVG radial gradient
  standing in for Figma's blurred ellipses.
- **F4·9p detection label** is one line, 142 px wide, overhanging the box by 2 px as drawn (it used to wrap).
- **The web preview can't show the scan sheet rising while its tab is in the background** (animation frames pause);
  checked it in the front tab.

- **F4·3 was rebuilt, not just re-worded.** The live frame uses the same flat map as F4·6g, moved pins, glass filter
  chips and a floating sheet; the app had the older street map. Map, callout, sheet, place row and top bar are now
  shared components in `src/components/waste/`. The F4·3 subtitle sits at x 8 and row 1's name at x 48 in the frame
  (others at 16 and 56): treated as slips and aligned.
- **F4·3a / F4·3b are out of date in Figma** (old copy "Drop-off for plastic", "Vending" chip, old sheet). The app shows
  the live F4·3 underneath and matches the tip cards, scrim, ring and pointers exactly. The tip still says "Got a
  bottle? Vending is quickest." as drawn, while its rows use the new "Machine" filter name. Nitin to confirm.

- **F4·6g frame slips:** rows 1 and 3 put the place name at x 48 (row 2 at 56), and the "Nearest" tag sits on top of
  "walk". Built all names at 56 and the tag beside the distance (as changelog line 95 describes), so no text overlaps.
- **F4·6g first row opens F4·4 Reverse vending machine** (the only link in the frame), even though it's a green bin.
  Built as drawn; rows 2–3 say "Coming soon". Go buttons open walking directions to the sample spot.
- **Know your waste sheets fade in** (changelog line 101): RouteSheet has a new `fadeIn` option, used by F4·1s and F4·2s.

- **F4·2s sheet padding is 20 px** (Figma), so the sheet body adds 4 px to RouteSheet's shared 16. The shared grabber
  stays 36 wide (Figma draws 40 here); changing it would move every sheet.
- **F4·2s: only "Do bottle caps go in?" has an answer drawn** (F4·2t). The other two questions and "What about bags?"
  say "Coming soon".
- **Plastic quiz has no way in on the Figma prototype** (nothing links to F4·2q1). It opens from Profile → Settings →
  Demo branches → Know your waste → Plastic quiz. Nitin may want an entry on F4·2.
- **Quiz Wrong state marks the option you actually tapped.** Figma has one Wrong variant per question, drawn for one
  wrong pick (Q1 always shows Green bin wrong, even after tapping Black bin). The app marks your pick red and the right
  answer green, as the variant intends.
- **Quiz feedback panel ends 40 px above the frame's bottom** in Figma (the component is 620 tall from y 140). Built as
  drawn on web; on a phone it ends at the home indicator instead. Score counts real right answers ("2 of 3 right").
- **Quiz is not under the blue header rule:** it has a back button but no title, like a step flow. Kept as drawn.
- **No Prettier config in the project.** Running `npx prettier` with defaults turns quotes double, so new files are
  formatted with `--single-quote --print-width 130 --bracket-same-line` to match.

- **Crew-scan brackets are marigold, not white.** The manifest text says white corner brackets on `199:3499`;
  the live frame draws them #E2A145 (marigold), with white only on the three problem states. Followed the frame.
- **Earthy tip copy.** All five tip frames use the same "Kite Beach" placeholder copy (one component); the app
  keeps each screen's own tip text from `src/data/insights.sample.ts`.
- **F10·10 / F10·10s invite card sits 20 px below the header in the app.** In Figma, Body starts at y 104 with
  no padding, so the card's rounded top tucks under the header. Looks like a frame slip; kept 20 px. Nitin to confirm.
- **Getting there crashes on a direct web load** (pre-existing hydration error, plus a nested button in the map
  zoom controls). Being fixed in a separate session; T1's option cards also sit 4 px further in each side than Figma.
- **Figma spinner loops 540° in 1.2 s** (jumps on repeat). Built as the same speed, 360° per 0.8 s, so it's seamless.
- **Figma "normal" line height = round(1.5 × size)** (15 → 23, 12 → 18, 11 → 17). Many app tokens are a px tighter;
  fixed per screen with commented `lineHeight` overrides rather than changing shared tokens (older screens rely on them).
- **`src/app/_layout.tsx` has an uncommitted change that isn't mine** (Spot it pushed instead of a modal). Left out of every
  commit for its owner.
- **F10·5 Class impact (420:10469) is out of date in Figma.** It still shows the old tip (close ×, "Got it", pill button)
  over an older class card. Its changelog lines are links only, which the app has. Kept the app's F3·8c card and the
  13 Nov Earthy tip; not redrawn to the old frame.
- **F10·13 story: "86 kg" is Bold in Figma;** the app has no Poppins Bold, so SemiBold with "in 2 hours" nudged 6 px to
  keep Figma's x. The EN · عربي pill is 5 px wider (Arabic glyph width in Readex Pro).
- **F10·14 pace chart** now uses Figma's exported chart SVG (was a hand-drawn approximation).
- **Friends (safe default):** no open search. P2 "Name or @username" field is left out (add by QR, share link or class);
  P1's "Search friends" only searches your own friends. Parent approval for under-18s unchanged.
- **Profile (P0) follows the frame:** removed the "Earthy" (Hands-free mode, Heat safety, Caption writer, Under-13 view)
  and "Organiser" sections that weren't in Figma. Gloves mode and Locked under 13 now open from Demo branches only, as
  decided; Heat safety opens from the heat notification, Caption writer from Share story, Headcount from F10·17 Crew.
  Added "Join your class" as in the frame.
- **Blue header with a left title** (P0, T-screens, F10·5, …) is now 104 px like Figma (title at y 50, 30 / 18 line
  heights, 12 px after the back button). Affects ~20 screens; each gets its own check in Phase 3.
- **Disabled buttons** use 45% opacity app-wide; Figma's skeleton "Host here" is 40%. Left at 45%.

### Progress

- Done earlier today, from Figma: F4·2 crew scan + F4·2a–c (4ca9c18), F5·1, F5·3 (4ca9c18), Earthy tips ×5 (e3b4e90).
- F10·10s Sending: 18 px ring spinner beside a centred label (within 0.4 px).
- **Flow A** redone (cbc57af): F10·11s skeleton, F10·11, F10·11w, F10·9, F10·15, F10·10a, F10·10, F10·10e, F10·10c, C1,
  F10·10s, F10·16, F10·16b, F10·17, F10·17i, F10·17j, F10·18, F10·19, F9v2·13. All text boxes within 1 px.
- **Flow B** redone: I0 skeleton (exact block layout), I1, IE1 and IE2 (tall edge-to-edge sheets), I2, I3, I3s, I4, I6,
  I7, I8, I9, F10·14 (rebuilt to the current frame), F10·13. F10·5 kept (see above). (18cbf7c)
- **Flow C** (538f07e): CAL1 sheet, CAL3/CAL5 snackbar, next-cleanup card states CAL3–CAL6 (measured relative to the card).
- **Flow D** (482698d): P0 Profile (rows, 18 px cards, header), P1 Friends, P2 Add friends.
- **Flow E**: the five Earthy tips (e3b4e90); comparisons in design/compare. T1's tip can't be captured on a direct web
  load until the Getting there crash is fixed (separate session).
- **Flow F**: R1·2p, R1·4 (timeline stubs, not a rail), F4·9u (Ask crew lead is the main button, as in Figma), F4·9c,
  F9·S1 (quote has no vertical padding), F9·S2, F9·S3. Sheets on these frames pad 34 at the bottom.
- **Flow G**: X0 Demo branches matches (rows, 18 px cards, 104 px header); all 12 rows open their screens.
- **X0 has two spacers stacked above "Hosting"** ("Spacer" + "NEW·spacer"), so that one gap is 40 px where every other
  group gap is 24. Looks accidental; kept 24.
- **Home (Phase 3):** added Figma's "Host a clean-up" Earthy card (→ Litter radar) between Know your waste and the next
  clean-up; Smileys count 13 px; See more chevron footprint. The whole page now lines up with 74:278 down to "Cleanups
  near you".
- **01 Home — event day (786:12402) built:** the next-cleanup card becomes "It's event day" / Today / Start → F11·1.
  Opened from N0's "It's event day: get ready", as Figma links it (/home?day=event).
- **Arabic copy I wrote (not from Figma), please check:** Home's host card and event-day card in Arabic.
- **Earthy tips are English-only**, so they're hidden when the app is in Arabic (they appeared in English over the RTL
  Home). Needs Arabic tip copy.
- **07 Home — AR is older than the EN frame** (white bell and Smileys pill, no Map button). Kept the AR app consistent
  with the current EN header.
- **R1·4 card edges are warm (#EFE6D8) in Figma** where every other frame uses #E3E8EB for stroke/weak. Treated as a
  Figma variable slip; kept #E3E8EB.


## 9 Nov 2026 run

Started 9 Nov 2026, building the remaining flows from `docs/BUILD_ALL_SCREENS.md` in order, without
stopping to ask. Each entry is a judgement call made when something was blocked or unclear.
Nothing was pushed, merged, deployed or deleted.

## General

- **No `/figma-sync` skill exists in this project.** Frames are pulled live with the Figma connector
  (screenshots into `design/screens/`, layer details read-only), the same way as every earlier flow.
- **Checks per flow:** `npm run check` (tsc + expo lint), then a visual pass in expo web at 360 × 800
  against the Figma PNGs. Motion can't be judged in the web preview; it needs a look in Expo Go.
- `.claude/skills/replica-*` is untracked and not part of this work; left alone.

## F3 · School group (student)

- **Persona.** Figma's F3 student is **Layla** at **Al Waha International School**; the build guide's demo
  profile is **Sara** at **Al Barsha School**. Followed Figma. All names live in `src/data/school.sample.ts`
  (`STUDENT`, `CLASS`), so switching is one edit.
- **Entry point.** F3 has no link in from other flows. Picking "With my school" on onboarding's
  interests screen is now remembered, and "Find cleanups" at the end of onboarding opens F3·1 Join your
  class (over Home). Otherwise onboarding ends on Home as before.
- **Class code.** Any 6 letters/numbers find Grade 9B in the demo (Figma shows K7BQ2M). "Scan teacher's QR"
  skips the camera and goes straight to Class found, as in Figma's prototype.
- **Parent approval.** "Send WhatsApp" doesn't send anything in the demo; it goes on to the class space,
  as Figma's prototype does. "Change" (contact) isn't designed; left as text.
- **Unlinked in Figma, left inert with a comment:** "Details" on the class card, "See all" classmates,
  "All 12" classes, and "Can't make it? Let Ms. Hessa know" (shown as text, not a button).
- **Check-in "Here" tab.** Figma only draws "On the way". "Here" shows a short SAMPLE list (Ms. Hessa,
  Rayan, Fatima, "and 18 more") so the segmented control isn't dead.
- **Check-in → impact.** Figma's prototype moves from F3·7 to the class impact by itself. Done with a
  10-second timer (replace), as the demo's stand-in for the cleanup ending. Figma links that auto step
  to an older impact frame (296:8497); built only v3 (F3·8c).
- **Impact chart.** Rebuilt Figma's radial chart in SVG (5 wedges × 5 rings, ring opacities copied from
  Figma). Close to Figma, not vector-identical.
- **Numbers.** 52 px "186" is Bold in Figma; the app has no Bold weight, so SemiBold.
- **Invite friends.** Copy, WhatsApp (falls back to the share sheet), Show QR (shows a QR of the link
  inline; not designed in Figma), More and Share link all do real things.
- Added `expo-clipboard` for Copy.
- **Web console warning (pre-existing, not fixed).** React Native Web rejects `accessibilityElementsHidden`
  and `importantForAccessibility` on Views, which several older components use (logomark, reveal block,
  ticket card, Earthy orb, wallet). New F3 components use `aria-hidden` instead. Worth swapping the rest.
- **`src/app/ride-chat.tsx` was being edited by someone else** during the run (a keyboard fix). Not
  touched or committed by this run.
- Added a `hideBack` option to `ScreenHeader` (F3·4 has no back button) and a `trackTone` option to
  `ProgressBar`. Moved the pass's half-width action buttons into `components/events/action-button.tsx`.

## F4 · QR check-in, hours & certificate + Know your waste / Earthy scan

- **One scanner component** (`components/scan/scanner.tsx`), used by the crew-head pass scanner and
  Earthy's waste scan (and F5's bag scan). **No live camera:** the feed is the still photo from each Figma
  frame, so the demo never depends on the camera or permission prompts. Tapping the scan window or the
  shutter stands in for a scan. A real build would put expo-camera's `CameraView` inside the same component.
  (The photos come from Figma at 1×, so they're soft on a phone; re-export at 3× when convenient.)
- **Entry points.** The orange Scan button in the tab bar (previously a no-op) opens check-in: the volunteer
  pass (F4·1), or the crew-head scanner (F4·2) when the demo role switch is on "Crew head". The role switch
  sits on both screens and swaps between them. Home's "Know your waste" tiles and "See more" now open the
  guide, as Figma links them (Plastic opens its own page).
- **Personas.** F4's volunteer is "Sara Ahmed, Grade 9B · Crew Green" and the crew head "Ms. Huda", as in
  Figma (different from the demo profile and from F3's teacher).
- **Auto steps.** F4·1 → F4·4 (pass scanned) after 6 s, and F4·7 → F4·8 (Earthy found the parts) after
  2.5 s, as Figma's prototype does. The "you're checked in" tick pops in (Figma's 646:11340).
- **Crew scan problems.** Each tap on the scan window steps through Figma's cases: not on this roster →
  already checked in → parent approval missing. "Add guest" and "Call parent" aren't designed further; they
  close the sheet.
- **Roster.** Filters (All / In / Not in), search and manual "Check in" work in memory.
- **Know your waste.** Only Plastic has its own page in Figma, so the other guide tiles are information-only
  (not buttons). Search and "Not sure? Ask Ai" open Earthy's scripted pizza-box answer (F4·6). Emirate choice
  is saved. Drop-off map is a drawn city-block map (no map service); pins expand into Figma's callouts; the
  first visit shows the two tips (F4·3a/b). Directions open the phone's maps to the sample location.
- **Not designed, left as text:** "Report full", "What about coffee cups?", the photo-library thumbnail and the
  +1 "Snap the bin" bonus.
- **Confirm step.** Figma shows both parts ticked; here the person ticks them and "Claim Smileys" unlocks
  when both are ticked.
- Added: back button for white pages (`components/ui/back-button.tsx`), `onChange` on the role switcher,
  Batteries and Textiles art, emirate store (`state/emirate.ts`).

## F5 · Bag log

- **Entry points (none in Figma).** Volunteer: once checked in (F4·4), the tab bar's Scan button opens the
  bag log (before check-in it still shows the check-in pass). Crew head: in the crew scanner, the scan after
  Figma's three problem cases is a bag sticker and opens the weigh-in (F5·3).
- Scanner feed is Figma's bag photo (same shared Scanner). Earthy's "peek" at the contents is scripted.
- **Auto step.** F5·2 → F5·4 after 7 s, standing in for the crew head weighing the bag.
- **F5·4 buttons.** Figma sends both "Done" and "Log bag" back to F5·1; here "Done" leaves the bag log
  (to Home) and "Log bag" starts the next bag.
- **Weigh-in.** The −/+ buttons step by 0.1 kg; the note turns amber if the weight is outside the usual
  range for a full bag (3–6 kg). "Snap the scale instead" and "+ Add" aren't designed further; shown as text.
- The "+N Smileys" screen is now one shared component (`components/rewards/reward-screen.tsx`) used by
  F4·11 and F5·4.
- Event-day "checked in" is kept in memory (`state/event-day.ts`).

## F7 · Smileys

- **Smileys tab** now opens the Smileys home (it did nothing before).
- **Tabs from deeper screens.** A tab now goes to its main screen unless you're already on it, so e.g. the
  Events tab works from the pass or "You're in" (previously it did nothing there).
- **Hours conflict, still open.** F7 uses 46 of 60 h (school) and 46 of 500 h (Golden Visa) as in its frame;
  F9 v2·7 says 14 of 20 h. Kept in `src/data/smileys.sample.ts` for one-line change once decided.
- F7·1's sponsor offers and badge row sit below Figma's 800 px fold; built from the frame's own layers
  (offer cards with category filters, badge circles).
- Only the juice offer has a detail screen (F7·3); the tees card is a plain card. "Learn more", "See all"
  shops and "Certificate" aren't designed yet; shown as text.
- **Voucher.** The 15-minute timer starts at Figma's 14:52 and counts down live; at 0 the QR fades and it
  says the Smileys came back. Redeem is disabled when the balance is too low.

## F9 v2 · AI assistant (incl. Story A and Story B)

- **"10 known flaws" not found.** I searched the repo, docs, the build kit, every Figma page and earlier
  transcripts and couldn't find this list. Built to the frames as they are; please paste the list and I'll
  check each one against the build.
- **One chat screen, not 16.** F9v2·4–16 and A1–A4 / B1–B4 are one thread (`/earthy-chat?start=…`).
  Suggestions and "Did you mean?" picks append the next turn, as handoff 5.4 asks; earlier answers
  condense to their short form, as in Figma's longer threads. Story A = find with friends → bring →
  class code → waiting for Mum. Story B = gloves mode → water → feeling unwell → hours.
- **Routes:** `/earthy` (home), `/earthy-chat`, `/earthy-voice` (the existing voice sheet, opened full
  screen), `/earthy-lens` (camera ask, Figma's bottle photo).
- **Entry points.** Home's Earthy button still opens the voice quick sheet (F9v2·0); its "Type instead"
  and Type go to Earthy home, Show goes to Lens.
- **Actions.** Book seat, Confirm, Resend, Alert organiser and Send message show Earthy's follow-up
  ("Booked your seat…", "Sent again…"). Cancel says nothing changed. Call 999 opens the phone dialler.
  Figma's "Not now" / "Ask parent" go back. Figma sends some of these to Earthy home or to the
  Next clean-up answer instead; following up in the same thread felt closer to handoff 5.4.
- **Not wired (shown as in Figma):** chat history, thumbs up/down, the read-aloud speaker, the + button,
  typing (tapping "Ask Earthy" asks the scripted Arabic question, as Figma's prototype does),
  "Add a photo", "Make it shorter", "Write it in Arabic". "None of these, let me type" goes back.
- **Lens.** Binned it shows +5 Smileys in the sheet (Figma has no next frame). "Not right?" opens
  Know your waste, "Find bins" the drop-off map. The photo is dimmed under the sheet as in Figma.
- **Hours.** F9 uses 14 of 20 h (see the F7 note).
- New shared bits: `GradientText` ("Hello, Sara"), an `answer` text style (17/25), a `center` slot on
  the shared Scanner, and `onLeave` on the voice sheet so it can be its own route.

## F10 · Proactive AI

- **One tip component.** F10·1–6 are the same "Earthy noticed" pattern, built once
  (`components/earthy/insight.tsx`): the screen dims with a cut-out around the thing Earthy means, and a
  card says what, why, one action and "Got it". Copy is in `data/insights.sample.ts`.
- **When tips show.** Each shows once per app session, a beat after the screen opens (in memory only,
  `state/insights.ts`). Reload the app to see them again. On Events it waits for the list to load and
  only shows on the list view; on Getting there only when carpool is offered.
- **Tip actions:** Home "Start clean-up" → Spot it (F10·9). Events "Join friends" → Kite Beach detail.
  Getting there "Request seat" → Find a seat (rides). Class "Send link" → Invite sheet. Class impact
  "Watch story" → Impact story (F10·13). Smileys "Find event" → Clean-ups list.
- **F10·7 (organiser "Draft with Earthy")** needs the organiser's New clean-up form, which is part of the
  Organiser console; it's wired there (see that section).
- **F10·8 (lock-screen heat nudge) is not built as a screen.** It's a phone notification, not app UI.
  Real delivery needs push notifications (expo-notifications + a server), which is out of scope tonight.
- **New screens:** `/spot-it` (F10·9), `/cleanup-draft` (F10·10), `/litter-radar` (F10·11),
  `/mission` (F10·12), `/impact-story` (F10·13), `/neighbourhood-goal` (F10·14). Links follow Figma:
  radar pin → Spot it → Host → Draft → Get approval → Goal → Co-host → Draft.
- **Entry points I added (not in Figma).** Litter radar and the daily mission aren't linked from anywhere
  in Figma, so Earthy home (F9v2·1) gets two more suggestion rows: "Where does litter need help?" and
  "Today's 5-minute mission". Easy to remove.
- **Radar:** "Host" rows open Spot it, "Join" rows open the clean-ups list (those spots have no event
  pages). Map layers isn't designed; shown only.
- **Draft:** time slots, crew stepper (2–30) and invite toggle work. Editing Where/Kit isn't designed
  (chevrons only). "Preview" opens the event page.
- **Mission:** "Log manually" (or the dashed "1 more") completes the mission; "Scan item" opens the waste
  scanner. The swap button isn't designed.
- **Story:** only slide 1 is designed. Copy link copies a sample link; Save isn't built; Share uses the
  phone's share sheet. EN · عربي is shown only.
- Photos (Al Sufouh spot, crew photo) and the radar/route maps are 1× exports from Figma; they may look
  soft on a 3× phone. Swap for full-size files when available.
- New shared bits: `RoundButton` (white round header button, now also used by Earthy chat) and
  `PlainHeader` (white page header with centred title). Icons added: download, layers, swap.

## F11 · Earthy on event day

- **One route, 11 cards:** `/event-day?step=1…11`, built on a shared layout
  (`components/event-day/day-layout.tsx`): corner pill on Before/Arrival cards, event title and a
  phase stepper on During/After cards, "Why: …" on every card, up to two actions.
- **No links in Figma, so I chose the flow.** Each card's action moves to the next card where it completes
  the moment (e.g. "Got it", "I'm here", "Skip"); confirmations ("Remind 9 PM", "Say hi", "Go to C",
  "Certificate", "Send") show a short message, then move on after ~1 s. The stepper's ticks and the
  empty dot jump to the first card of that phase.
- **Entry point I added (not in Figma):** Earthy home → "Get ready for Kite Beach".
- **F11·7 "What do you need?"** is on-demand in Figma ("you tapped I need help"), so cards 6 and 8 have an
  "I need help" link that opens it. Its rows: Share my spot (share sheet), Call organiser (dialler, sample
  number), Find my team (back to the crew card), Hurt or unwell (dials 999).
- **Working bits:** packing checklist ticks; briefing play/pause with a live 0:58 countdown (no audio in the
  demo) and EN/Arabic switch; break timer counts down live from 5:00 after "Start now"; mood picker;
  "Join" on the next three clean-ups.
- **Shown but not built:** Scan bag opens Earthy Lens (bag check isn't designed separately), "Hold to
  talk" (voice notes), the photo gallery, directions to water/shade, Swap role (just confirms).
- Sample phone numbers for the crew lead and the EEG desk are placeholders (`data/event-day.sample.ts`).

## R · Resident cleanliness reports

- **Routes:** `/report` (camera: framing coach → detection → voice note), `/report-review`
  (R1·2 normal, R1·2b hazard, R1·2c already reported), `/report-sent` (R1·3 sent, R1·3c +1 added).
- **Entry point.** The flow notes say "Scan button → Spot mode", but the Scan tab button already switches
  between check-in, bag log and crew scan by role, and there's no Spot mode toggle designed. So for now
  it's on Earthy home → "Report a dirty spot". A Spot mode on the scanner needs a design decision.
- **Seeing all three cases.** Detection is scripted, so the camera rotates scenes: the 1st report is a
  normal spot, the 2nd a hazard (broken glass, red frame), the 3rd "already reported nearby" (+1).
  Each "Send report" / "Add +1" moves to the next. In memory only (`state/reports.ts`).
- **Timers:** the framing tip shows 2.5 s, then Earthy "sees" the litter (R1·1a → R1·1). The Earthy
  button records a voice note for 3.5 s, then opens review with the note filled in (Figma: "hold Earthy";
  here it's a tap, since there's no real recording).
- **Review:** item chips toggle, size picker works, anonymous toggle works; Send is disabled if no items
  are ticked. "+ Add" and "Adjust" location aren't designed; shown only.
- **Sent:** "Track report" isn't designed; it opens Smileys for now. "Done" returns to the camera, as in
  Figma. The +1 screen thanks "Layla" as in Figma (a different persona from Sara); kept as designed.
- Photo is a 1× export of Figma's AI-generated Kite Beach image.

## Organiser console

- **Built C1 v2 only** (`/organiser-new`). v1 is the earlier "OFF-SYSTEM" wireframe of the same form with
  sample placeholders; v2 is the finished design, so v1 isn't built separately.
- **F10·7 "Draft with Earthy"** tip shows on the name field (once per session). "Draft it" opens Earthy's
  drafted clean-up (F10·10).
- **Works:** name field, capacity stepper (5–500, steps of 5), Under-18s and Shared Rides toggles (the
  guardian note hides when Under-18s is off), Smileys per check-in stepper. "Submit for Review" needs a
  name, then confirms and closes; "Save Draft" confirms. Nothing is sent (sample).
- **Not designed, shown only:** date and time pickers, Edit meeting point, the "…" menu.
- **Entry point I added (not in Figma):** Earthy home → "Host your own clean-up". There's no organiser
  role in the demo role switcher yet (volunteer / crew head only); the build guide says the organiser POV
  comes later.
