# Round 2 manifest: every Figma frame, what changed, and how to build it accurately

Written 13 Nov 2026 (late evening) by the design session, for Claude Code. This supersedes the "what changed" parts of `docs/BUILD_ROUND_2.md`; that file still gives the phase order.

## Unattended mode (14 Nov: Nitin is resting, keep going without him)
This overrides every "stop and check in", "show Nitin" and "ask Nitin" instruction in this file and in `docs/BUILD_ROUND_2.md` until he is back.
- Do not wait for approval between screens, flows or phases. Work through everything: redo flows A to G with the procedure below, then Phase 3 (existing screens that changed), then the restored screens.
- Still do the fetch, build, compare loop for every frame. Save each comparison to `design/compare/<slug>.png` instead of showing it.
- Commit locally after each flow with `npm run check` passing. Never push, merge, deploy or delete.
- If a frame cannot be fetched from Figma, or a screen will not match after three attempts, do not guess and do not stop: leave it, write the frame, the problem and what you tried in `docs/OVERNIGHT_LOG.md`, and move to the next frame.
- For the three open decisions, take the safe default and log it: Friends = no search, add by QR or class only, parent approval for under-18s; voice quick sheet uses the full-screen question ("Find a beach clean-up this weekend with my friends"); Gloves mode and Locked under 13 open from Demo branches only.
- When everything is done, or nothing more can be done, write a summary at the top of `docs/OVERNIGHT_LOG.md`: what was redone, what was skipped and why, and a tap-through list for Expo Go per flow. Move the changelog entries you built to **Synced** and update `PROJECT_STATUS.md`.

## Bugs found by Nitin in Expo Go (fix these first)
1. **Screens opening as bottom sheets (14 Nov).** "Become a host" slid up as an iOS page sheet over Spot it; in Figma it pushes from the right. Cause: `spot-it` was registered as `fullScreenModal` in `src/app/_layout.tsx`, and on iOS every screen pushed after a modal in the same native stack is presented modally. Fixed for `spot-it` (now a normal push). **Audit the same problem everywhere:** `scanner`, `report`, `bag-log`, `bag-weigh`, `waste-scan`, `earthy`, `earthy-lens`, `event-map`, `wallet-pass` and `impact-story` are modals; any route they push to will also appear as a sheet. Rule: a route is a modal only if nothing is pushed from it. If a flow continues from it, either make it a normal push (when Figma shows a push) or close the modal before navigating (`router.dismiss()` then `router.push`, or `router.replace`). Check each transition against `design/SCREENS.md`.

## Why builds have been inaccurate, and the fix
`design/screens/*.png` is from 8 Nov (168 files). About 60 frames are new since then and most others changed, so **every PNG in that folder is stale** and the changelog is prose, not measurements. Do not build from either.

**For every frame, in this order, no exceptions:**
1. `get_screenshot` on the node ID (Figma MCP is configured in `.mcp.json`) and save it over `design/screens/<slug>.png`.
2. `get_design_context` on the node ID. Take x, y, width, height, padding, gap, radius, font size, weight, line height and colours from it. For anything nested (cards, rows, chips, sheets), call it again on that child node.
3. Read the changelog lines listed for that frame in the table below (`design/CHANGELOG.md`, line numbers).
4. Build. Reuse `src/components/ui/*` and theme tokens; a value with no token is a literal with a comment naming the Figma layer.
5. Run the app at 360 px wide, screenshot the screen, put it beside the Figma PNG, and fix until edges and spacing match within 1 px. Show Nitin both crops.
6. One flow at a time. Do not move on while a screen in the flow is off.

If `get_design_context` or `get_screenshot` fails, stop and tell Nitin. Do not fall back to guessing from the changelog.

## What changed in Figma on 13 Nov, frame by frame (authoritative)
These were edited by hand today. Where this list and an older changelog line disagree, this list and the live frame win.

**Floating bottom sheets.** Every partial-height sheet is now x 8, width 344, 8 px above the bottom edge, radius 32 on all four corners, white; content re-fitted to 344. Frames: `74:278` and `786:12402` (Home voice sheet), `171:2444`, `293:7778`, `413:10806`, `669:11508`, `670:11639`, `447:10048`, `447:10119`, `451:10094`, `451:10226`, `455:10230`, `455:10282`, `460:10200`, `489:11319`, `495:11631`, `596:11179`, `617:11243`, `617:11323`, `626:11237`, `626:11309`, `626:11379`, `632:11242`, `632:11398`, `650:11453`, `817:12774`, `818:12775`, `818:12802`, `818:12863`, `829:12645`, `887:12953`, `888:12733`, `888:12768`, `892:12755`, `892:12799`, `901:12758`, `901:14236`, `939:13653`, `967:13479`, `968:14479`, `968:14605`, `968:14712`, `968:14812`, and the Home-based CAL and tip frames. Already floating before today: `220:3547`, `223:4454`, `223:4702`, `224:6293`, `231:6393`. Not floated on purpose: scrolling page panels (event detail, T1 options, F4·2), camera control panels, Android sheets (`234:6481`, `496:11672`).

**Blue header added** (gradient bar 104 tall, light status bar, glass buttons white 18%, white title, fixed on scroll): `670:11520` F10·10, `887:12727` F10·10s, `883:12671` F10·16, `887:13222` F10·16b, `883:12740` F10·17, `673:11567` F10·14, `199:3557` C1 Clean-up details, `879:12660` F10·15, `446:9983` F4·1 Know your waste (Dubai chip is glass on blue). This replaces the white host-flow header from 12 Nov.

**Scanners.** Crew check-in `199:3499`: yellow box replaced by white corner brackets (240 box, 34 px arms, 4 px stroke) plus a marigold scan line that sweeps 1.3 s each way; check-in toast moved to y 148 under the progress bar, capsule, green 92%, in at 0.2 s, out at 3.4 s. Edge states `626:11237`, `626:11309`, `626:11379`: same brackets, no line. Bag screens `632:11242`, `632:11398`: green brackets (100 box, 22 px arms, 3 px stroke), "Bag #14" tag is a capsule centred 8 px above.

**Earthy tips** `956:13460`, `956:14001`, `956:14221`, `956:14741`, `956:14925`: pointer is a triangle 18 × 9 flush on the tip card (was a rotated square); ring offset 2 px on cards, 6 px on the round Earthy button.

**Event day.** `771:12612` F11·4: a real flag marker (pole, blue pennant, base dot) at the end of the route; avatars to its right; tag = flag icon + "Blue flag". `771:13087` F11·6: zones are 52 px status-coloured circles (fill 16%, C red 26%) with the letter on the rim; chips read Done / Busy / Needs help / OK (C chip solid red); "You" label; dotted route from You to zone C. `771:12442` F11·2 Meet your buddy is back between F11·1 and F11·3.

**Invite neighbours** `888:12733`: real WhatsApp mark, initials in the four avatars.

**Voice** `413:10760`, `649:11374`, `649:11435`, `650:11453`: Figma now matches the motion already in `src/components/earthy/voice-sheet.tsx`. Do not rewrite the app's voice motion. Only check: the quick sheet lights up words as heard.

**Demo branches** `747:12306`: eight new rows in three groups (Hosting, Earthy, Other states); the page scrolls under a fixed header.

**New links**: pass heading (`222:4121`) → F4·1 Check-in pass `3:212`; F10·17 "Crew" → F9v2·13 `413:11547`; "Share story" on `672:11556` and `420:10469` → F9v2·15 `413:11694`; `420:10469` "Watch story" → `672:11556`; N0 heat row → W4h → F9v2·11 `413:11405`.

**Back from the parked section (build or re-check):** T3–T14 `268:7361` `268:7476` `269:7251` `269:7350` `269:7396` `269:7705` `269:7777` `269:7868` `270:7332` `270:7457` `270:7564` `270:7891`, F3·9 `296:8566`, F4·2q1–q4 `794:12737` `794:12771` `794:12804` `794:12837`, F9v2·10 `413:11317`, F9v2·12 `413:11476`, F9v2·15 `413:11694`, F9v2·16 `413:11771`. These were designed before today's rules, so apply the blue header and floating sheet rules in code even where the frame still shows the old look, and tell Nitin which ones.

**Parked today:** `447:10186` F4·5 Choose your emirate (the sheet `817:12774` replaces it).

## Every frame
Status: **NEW** = not in the 8 Nov export, no PNG exists. **CHANGED** = existed on 8 Nov and is named in an unsynced changelog entry. **CHECK** = existed and is not named, but global rules (sheets, headers, skeletons) may still apply; compare a fresh screenshot before skipping. "Lines" are line numbers in `design/CHANGELOG.md` under "Not synced yet" as of this writing; if entries have moved since, search the changelog for the frame name or node ID instead.

Totals: 82 new, 53 changed, 89 to check.

### F0 · Onboarding

| Frame | Node | Status | Lines |
|---|---|---|---|
| 00 Splash — first launch | `141:735` | CHECK | — |
| 00 Splash | `129:426` | CHECK | — |
| 00 Splash — out _(motion state, not a route)_ | `133:545` | CHECK | — |
| Onb 01 — Language | `137:492` | CHECK | — |
| Onb 02.1 — Welcome | `137:538` | CHECK | — |
| Onb 02.2 — Welcome | `137:572` | CHECK | — |
| Onb 02.3 — Welcome | `137:607` | CHECK | — |
| Onb 02.4 — Meet Earthy AI | `442:9970` | CHECK | — |
| Onb 03 — Sign in | `137:641` | CHECK | — |
| Onb 04 — Phone | `137:676` | CHECK | — |
| Onb 05 — Code | `139:566` | CHECK | — |
| Onb 06 — Birthday | `139:602` | CHECK | — |
| Onb 07 — Guardian | `139:647` | CHECK | — |
| Onb 08 — Pledge | `139:686` | CHECK | — |
| Onb 08a — Pledge (before drawing) _(motion state, not a route)_ | `141:658` | CHECK | — |
| Onb 09 — Location | `140:602` | CHECK | — |
| Onb 10 — Interests | `140:639` | CHECK | — |
| Onb 11 — Notifications | `140:705` | CHECK | — |
| Onb 12 — Good to go | `140:740` | CHECK | — |
| Onb 12a — Good to go (before burst) _(motion state, not a route)_ | `141:691` | CHECK | — |

### Home

| Frame | Node | Status | Lines |
|---|---|---|---|
| 01 Home — EN · v2 (3 Final) | `74:278` | **CHANGED** | 51, 52, 53, 79, 90, 109 |
| 01 Home · Motion 1 — Skeleton _(motion state, not a route)_ | `103:722` | **CHANGED** | 51, 52, 53, 79, 90, 109 |
| 01 Home · Motion 2 — Pre-animate _(motion state, not a route)_ | `103:319` | **CHANGED** | 51, 52, 53, 79, 90, 109 |
| 07 Home — AR (RTL) · v2 | `259:6493` | CHECK | — |
| 01 Home — event day | `786:12402` | **NEW** | 51, 52, 53, 79, 90, 109 |
| 01 Home — Earthy tip | `956:13460` | **NEW** | 51, 52, 53, 79, 90, 109 |

### Your impact this year

| Frame | Node | Status | Lines |
|---|---|---|---|
| I0 My impact — loading (skeleton) | `939:13387` | **NEW** | 52, 53, 54, 56, 57 |
| I1 My impact — 2026 | `924:13291` | **NEW** | 50, 53, 54, 56, 57 |
| I2 Week memory (sheet) | `939:13653` | **NEW** | 50, 55, 56, 57 |
| IE1 Earthy — Why March? (sheet) | `948:13383` | **NEW** | 54 |
| IE2 Earthy — Most picked item (sheet) | `948:13671` | **NEW** | 53, 54 |
| I3 Hours & certificate — set up | `940:13383` | **NEW** | 56, 57 |
| I3s Certificate — Earthy preparing (loader) | `940:13695` | **NEW** | 52, 53, 56, 57 |
| I4 Certificate ready | `940:13950` | **NEW** | 54, 56, 57 |
| F10·13 AI impact story | `672:11556` | **CHANGED** | 10, 57, 62, 74, 90 |
| F10·14 Neighbourhood goal | `673:11567` | **CHANGED** | 23, 57, 62, 74, 90 |
| I6 My impact — empty (first clean-up) | `939:13903` | **NEW** | 54, 56, 57 |
| F10·5 Class impact — story ready | `420:10469` | **CHANGED** | 10, 57 |
| I7 Clean-up receipt | `967:14181` | **NEW** | 50 |
| I8 Vote — where next? | `967:14442` | **NEW** | 50 |
| I9 Vote result | `967:14694` | **NEW** | 50 |

### Know your waste

| Frame | Node | Status | Lines |
|---|---|---|---|
| F4·1 Know your waste — guide | `446:9983` | **CHANGED** | 10, 23, 101 |
| F4·1s Choose your emirate — sheet (overlay) | `817:12774` | **NEW** | 12, 101 |
| F4·2 Plastic — how to sort | `446:10139` | **CHANGED** | 25, 37, 63, 87, 89, 91, 92, 93, 101, 102 |
| F4·2s Ask Earthy — plastic (overlay) | `818:12775` | **NEW** | 101 |
| F4·2t Ask Earthy — bottle caps (overlay) | `818:12802` | **NEW** | 99, 101 |
| F4·7p Scan — plastic bottle, Earthy is looking | `818:12832` | **NEW** | 97, 101 |
| F4·9p Scan result — plastic bottle | `818:12863` | **NEW** | 50, 63, 95, 98, 99, 101 |
| F4·3 Drop-off near you — plastic | `447:10048` | **CHANGED** | 95, 96, 101 |
| F4·3a First visit — 3 kinds of drop-off | `451:10094` | CHECK | — |
| F4·3b First visit — start with the nearest | `451:10226` | CHECK | — |
| F4·4 Reverse vending machine | `447:10119` | **CHANGED** | 94 |
| F4·6 Earthy answer — pizza box | `447:10338` | **CHANGED** | 50, 96, 99, 101 |
| F4·6g Green bins near you | `829:12645` | **NEW** | 95, 96 |
| F4·7 Scan — Earthy is looking | `455:10167` | **CHANGED** | 97, 112 |
| F4·8 Scan — found 2 parts | `455:10230` | CHECK | — |
| F4·9 Scan result — pizza box | `455:10282` | **CHANGED** | 63, 96, 98, 99 |
| F4·10 Confirm — did both go in? | `460:10200` | CHECK | — |
| F4·11 Reward — +2 Smileys | `460:10276` | **CHANGED** | 101 |
| F4·11 Reward — +2 Smileys · enter A _(motion state, not a route)_ | `737:11830` | **NEW** | 101 |
| F4·11 Reward — +2 Smileys · enter B _(motion state, not a route)_ | `737:11862` | **NEW** | 101 |
| F4·9u Scan — Earthy isn’t sure | `968:14215` | **NEW** | 50 |
| F4·9c Change this (sheet) | `968:14479` | **NEW** | 50 |
| F4·2q1–q3 Plastic quiz — questions 1–3 | `794:12737` | **NEW** | 19, 103, 112 |
| F4·2q4 Plastic quiz — score | `794:12837` | **NEW** | 112 |

### Host a clean-up

| Frame | Node | Status | Lines |
|---|---|---|---|
| F10·11s Litter radar · Skeleton _(motion state, not a route)_ | `887:12953` | **NEW** | 52, 53, 62, 63, 66, 69 |
| F10·11 Litter radar — where it’s needed | `670:11639` | **CHANGED** | 50, 57, 62, 69, 74, 75, 81, 82, 85, 86 |
| F10·9 Spot it — AI sizes the job | `669:11508` | **CHANGED** | 62, 71, 75, 80, 81, 83, 85, 88, 90 |
| F10·15 Become a host — one time | `879:12660` | **NEW** | 23, 62, 71 |
| F10·10a Earthy drafting (loader) | `887:12689` | **NEW** | 62, 63, 64, 66, 69 |
| F10·10 Earthy drafted your clean-up | `670:11520` | **CHANGED** | 23, 43, 62, 65, 69, 70, 71, 72, 73, 74 |
| F10·10e Earthy · your clean-up (sheet) | `892:12799` | **NEW** | 54, 62, 65 |
| F10·10c Add a co-host (sheet) | `892:12755` | **NEW** | 62, 65 |
| C1 Organiser — create event · EN · v2 | `199:3557` | **CHANGED** | 20, 23, 62, 68, 70, 72, 73, 74, 90, 110 |
| F10·10s Sending request (loader) | `887:12727` | **NEW** | 23, 62, 66, 69 |
| F10·16 Sent to EEG — in review | `883:12671` | **NEW** | 23, 62, 65, 68, 69, 70 |
| F10·16b EEG asked for changes | `887:13222` | **NEW** | 23, 62, 68 |
| F10·17 Approved — you’re live (2 days later) | `883:12740` | **NEW** | 10, 12, 23, 62, 67, 70 |
| F10·17i Invite neighbours (sheet) | `888:12733` | **NEW** | 27, 62, 67 |
| F10·17j Invites sent (sheet) | `888:12768` | **NEW** | 12, 62, 63, 64, 66, 67 |
| F10·11w Why this spot (sheet) | `967:13479` | **NEW** | 50 |
| F10·18 Check the spot — 2 weeks later | `967:13649` | **NEW** | 50 |
| F10·19 Before / after — stayed clean | `967:13912` | **NEW** | 50 |
| F9v2·13 Organiser — Headcount + broadcast | `413:11547` | **CHANGED** | 10, 74, 90 |

### F1 · Find events & register — happy path

| Frame | Node | Status | Lines |
|---|---|---|---|
| R1 Cleanups — list | `219:2955` | **CHANGED** | 43, 51, 52, 53, 80, 85, 109 |
| R2 Cleanups — map | `219:3063` | **CHANGED** | 79, 85 |
| R3 Event detail | `220:3354` | **CHANGED** | 51, 53, 57, 109 |
| R4 Confirm — who's coming | `220:3547` | CHECK | — |
| R5 You're in — celebration | `220:4497` | CHECK | — |
| R6 My pass | `222:4121` | **CHANGED** | 10 |
| R7 Event detail — registered | `222:4419` | **CHANGED** | 109, 110 |
| R6a Pass — directions sheet | `489:11319` | CHECK | — |
| W0 Add to Wallet — why | `495:11631` | CHECK | — |
| R5 · enter A / enter B _(motion state, not a route)_ | `737:11503` | **NEW** | — |
| R1 Cleanups — list · Skeleton _(motion state, not a route)_ | `740:11906` | **NEW** | 43, 51, 52, 53, 80, 85, 109 |
| R1 Cleanups — Earthy tip | `956:14001` | **NEW** | 43, 51, 52, 53, 80, 85, 109 |

### F1 · Edge states

| Frame | Node | Status | Lines |
|---|---|---|---|
| E1 Same day — already booked | `223:4454` | **CHANGED** | 36, 54 |
| E2 Under 18 — guardian number | `223:4702` | **CHANGED** | 36, 53, 54 |
| E3 Pass — waiting for guardian | `223:4929` | CHECK | — |
| E4 Event full — join waitlist | `223:5243` | CHECK | — |
| E5 On the waitlist | `223:5787` | CHECK | — |
| E6 Spot opened — auto-joined (push) | `224:5867` | CHECK | — |
| E7 Cancel — confirm | `224:6293` | **CHANGED** | 36 |
| E8 Cancelled — undo | `224:6602` | CHECK | — |
| E9 No matches — notify me | `224:6801` | CHECK | — |
| E10 Offline — saved cleanups | `224:6884` | CHECK | — |
| E11 Guardian said no | `224:6996` | CHECK | — |
| R3b Event detail — already booked that day | `486:10225` | CHECK | — |
| E8b Cancelled — toast dismissed | `488:10602` | CHECK | — |

### F1 · Add to Wallet

| Frame | Node | Status | Lines |
|---|---|---|---|
| W1 iOS — Add to Apple Wallet sheet | `231:6393` | CHECK | — |
| W2 Pass — added to Wallet | `231:6935` | CHECK | — |
| W3 Apple Wallet — pass | `231:7241` | CHECK | — |
| W4 Lock screen — at Kite Beach | `234:6433` | CHECK | — |
| W5 Lock screen — pass updated | `234:6457` | CHECK | — |
| W6 Android — Save to Google Wallet | `234:6481` | **CHANGED** | 37 |
| W7 Pending — Wallet after approval | `234:6946` | CHECK | — |
| W6a Save to Google Wallet — why | `496:11672` | **CHANGED** | 37 |
| W4h Lock screen — Earthy heat nudge | `956:15167` | **NEW** | 10, 51 |

### Add to calendar

| Frame | Node | Status | Lines |
|---|---|---|---|
| CAL1 Add to calendar — choose (sheet) | `901:12758` | **NEW** | 59, 61 |
| CAL2 Apple Calendar — new event (system) | `901:13242` | **NEW** | 59, 61 |
| CAL3 Home — added to calendar | `901:13776` | **NEW** | 59, 60, 61 |
| CAL4 Keep it synced — subscribe (system) | `901:14236` | **NEW** | 59, 60, 61 |
| CAL4s Home — syncing (loader) | `910:13787` | **NEW** | 59 |
| CAL5 Home — synced | `901:14730` | **NEW** | 59, 60, 61 |
| CAL6 Home — site shared, update calendar | `901:15190` | **NEW** | 61 |

### F2 · Transport & shared rides

| Frame | Node | Status | Lines |
|---|---|---|---|
| 02b Getting there — map | `171:2086` | CHECK | — |
| T1 Getting there — options | `268:6525` | **CHANGED** | 19, 37, 51, 109 |
| T2 Metro + bus — route | `268:6952` | **CHANGED** | 19 |
| T1 Getting there — Earthy tip | `956:14221` | **NEW** | 19, 37, 51, 109 |
| T3 Find a seat — rides | `268:7361` | **CHANGED** | 19, 51, 110 |
| T4 Ride detail — Aisha | `268:7476` | CHECK | — |
| T5 Request sent — pending | `269:7251` | CHECK | — |
| T6 Ride chat — accepted | `269:7350` | CHECK | — |
| T7 Pass — ride added | `269:7396` | CHECK | — |
| T8 Offer seats — one screen | `269:7705` | CHECK | — |
| T9 Licence check — first time | `269:7777` | CHECK | — |
| T10 Ride published | `269:7868` | CHECK | — |
| T11 No seats yet — notify me | `270:7332` | CHECK | — |
| T12 Under 18 — trusted drivers only | `270:7457` | CHECK | — |
| T13 Driver cancelled — rematch | `270:7564` | CHECK | — |
| T14 Guardian chose public transport | `270:7891` | **CHANGED** | 19, 110 |

### F3 · School group (student)

| Frame | Node | Status | Lines |
|---|---|---|---|
| F3·1 Join your class | `293:7715` | **CHANGED** | 109 |
| F3·2 Class found | `293:7778` | CHECK | — |
| F3·3 Parent approval | `294:7734` | CHECK | — |
| F3·4 Your class | `294:7786` | **CHANGED** | 51 |
| F3·5 School bus | `294:7911` | CHECK | — |
| F3·6 Your pass — with class | `296:8124` | CHECK | — |
| F3·7 Class check-in live | `296:8428` | CHECK | — |
| F3·8c Class impact — v3 | `580:11169` | CHECK | — |
| F3·4 Your class — Earthy tip | `956:14741` | **NEW** | 51 |
| F3·9 Invite friends — sheet | `296:8566` | **CHANGED** | 19, 51 |

### F4 · QR check-in, hours & certificate

| Frame | Node | Status | Lines |
|---|---|---|---|
| F4·1 Check-in pass — show to crew leader | `3:212` | **CHANGED** | 10, 23, 101 |
| F4·2 Crew head — scan passes | `199:3499` | **CHANGED** | 25, 37, 63, 87, 89, 91, 92, 93, 101, 102 |
| F4·3 Crew head — roster | `199:3481` | **CHANGED** | 95, 96, 101 |
| F4·4 Volunteer — you’re checked in | `335:8308` | **CHANGED** | 94 |
| F4·2a Scan — not on this roster | `626:11237` | **CHANGED** | 12 |
| F4·2b Scan — already checked in | `626:11309` | CHECK | — |
| F4·2c Scan — parent approval missing | `626:11379` | CHECK | — |
| F4·4 · enter A / enter B _(motion state, not a route)_ | `737:11707` | **NEW** | 94 |

### F5 · Bag log

| Frame | Node | Status | Lines |
|---|---|---|---|
| F5·1 Bag log — this is bag #14 | `632:11242` | **CHANGED** | 26 |
| F5·2 Bag log — hand it to your crew head | `632:11328` | CHECK | — |
| F5·3 Crew head — weigh bag #14 | `632:11398` | **CHANGED** | 26 |
| F5·4 Bag log — Smileys earned | `632:11476` | CHECK | — |
| F5·4 · enter A / enter B _(motion state, not a route)_ | `737:11935` | **NEW** | — |

### F7 · Smileys

| Frame | Node | Status | Lines |
|---|---|---|---|
| F7·1 Smileys — home | `3:548` | **CHANGED** | 51, 52, 53, 57, 109 |
| F7·2 Smileys — badges & levels | `639:11313` | CHECK | — |
| F7·3 Smileys — sponsor reward | `640:11294` | CHECK | — |
| F7·4 Smileys — voucher ready | `640:11358` | CHECK | — |
| F7·4 · enter A / enter B _(motion state, not a route)_ | `737:12297` | **NEW** | — |
| F7·1 Smileys — home · Skeleton _(motion state, not a route)_ | `740:12092` | **NEW** | 51, 52, 53, 57, 109 |
| F7·1 Smileys — Earthy tip | `956:14925` | **NEW** | 51, 52, 53, 57, 109 |

### F9 v2 — AI assistant, full feature set

| Frame | Node | Status | Lines |
|---|---|---|---|
| F9v2·1 Earthy home | `413:10674` | CHECK | — |
| F9v2·2 Voice — listening | `413:10760` | **CHANGED** | 11, 47 |
| F9v2·3 Earthy Lens — ask with camera | `413:10806` | **CHANGED** | 98, 99 |
| F9v2·4 Did you mean? | `413:10845` | CHECK | — |
| F9v2·5 Answer — Next clean-up | `413:10917` | CHECK | — |
| F9v2·6 Answer — What to bring | `413:10999` | CHECK | — |
| F9v2·7 Answer — Hours + Smileys | `413:11089` | CHECK | — |
| F9v2·8 Action — Join with class code | `413:11172` | CHECK | — |
| F9v2·9 Action — Resend parent consent | `413:11243` | CHECK | — |
| F9v2·11 Safety — Heat | `413:11405` | **CHANGED** | 10 |
| F9v2·14 Water break timer | `413:11618` | CHECK | — |
| F9v2·2a Voice — thinking | `649:11374` | **CHANGED** | 11, 47 |
| F9v2·2b Voice — speaking | `649:11435` | **CHANGED** | 11, 47 |
| F9v2·0 Voice — quick sheet | `650:11453` | CHECK | — |
| F9v2·A1–A4 Plan my Saturday | `660:11493` | CHECK | — |
| F9v2·B1–B4 On the day | `660:11841` | CHECK | — |

### AI upgrades and back-in-scope Earthy screens

| Frame | Node | Status | Lines |
|---|---|---|---|
| F9·S1 Earthy — source (sheet) | `968:14605` | **NEW** | 50 |
| F9·S2 Earthy — ask the organiser (sheet) | `968:14712` | **NEW** | 50 |
| F9·S3 Question sent (sheet) | `968:14812` | **NEW** | 50 |
| F9v2·10 Hands-free logging (gloves mode) | `413:11317` | **CHANGED** | 19 |
| F9v2·12 Smart match + ride grouping | `413:11476` | CHECK | — |
| F9v2·15 Caption writer (18+) | `413:11694` | **CHANGED** | 10 |
| F9v2·16 Locked — under 13 | `413:11771` | CHECK | — |

### F11 · Event day

| Frame | Node | Status | Lines |
|---|---|---|---|
| F11·1 Before — pack your kit | `771:12365` | **NEW** | 19, 107, 109, 110 |
| F11·2 Before — meet your buddy | `771:12442` | **NEW** | 19, 110 |
| F11·3 Before — 60-second briefing | `771:12504` | **NEW** | 19, 110 |
| F11·4 Arrival — find your crew | `771:12612` | **NEW** | 17 |
| F11·5 Arrival — your role | `771:13009` | **NEW** | — |
| F11·6 During — zone guide | `771:13087` | **NEW** | 18 |
| F11·7 During — I need help | `772:12421` | **NEW** | 107 |
| F11·8 During — water break | `772:12504` | **NEW** | — |
| F11·9 After — your recap | `772:12574` | **NEW** | — |
| F11·10 After — quick feedback | `772:12662` | **NEW** | — |
| F11·11 After — what’s next | `772:12727` | **NEW** | 107 |

### R — Resident cleanliness reports

| Frame | Node | Status | Lines |
|---|---|---|---|
| R1·1a Report — Earthy framing coach | `604:11211` | CHECK | — |
| R1·1 Report — Earthy detects litter | `595:11171` | CHECK | — |
| R1·1b Report — hazard spotted | `604:11283` | CHECK | — |
| R1·1c Report — voice note (hold Earthy) | `604:11357` | CHECK | — |
| R1·2 Report — Earthy reviews | `596:11179` | **CHANGED** | 50 |
| R1·2p Check your photo | `968:13670` | **NEW** | 50 |
| R1·2b Report — review, hazard | `617:11243` | CHECK | — |
| R1·2c Report — already reported | `617:11323` | CHECK | — |
| R1·3 Report — sent | `596:11272` | **CHANGED** | 50 |
| R1·3c Report — +1 added | `617:11422` | CHECK | — |
| R1·4 Your report — status | `968:13932` | **NEW** | 50 |
| R1·3 / R1·3c · enter A / enter B _(motion state, not a route)_ | `737:12040` | **NEW** | 50 |

### Prototype connections

| Frame | Node | Status | Lines |
|---|---|---|---|
| S0 Scanner — what are you scanning? | `747:11913` | **NEW** | — |
| P0 Profile | `747:12008` | **NEW** | 65 |
| N0 Notifications | `747:12186` | **NEW** | 10, 107, 109 |
| X0 Demo branches | `747:12306` | **NEW** | 9 |
| P1 Friends | `890:12735` | **NEW** | 65 |
| P2 Add friends | `890:12839` | **NEW** | 65 |

### Not a screen

| Frame | Node | Status | Lines |
|---|---|---|---|
| Spec panel | `3:748` | **NEW** | — |
