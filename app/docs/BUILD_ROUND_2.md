# CleanScape: build round 2 (instructions for Claude Code)

Written 13 Nov 2026. This covers every Figma change since the overnight build of 9 Nov.
Read this whole file, then `CLAUDE.md`, `PROJECT_RULES.md` and `DESIGN_SYSTEM.md`, before writing code.
**Read `design/ROUND_2_MANIFEST.md` first:** it lists every frame with its node ID and status, and the fetch-build-compare procedure that is required for each one.
Work through the phases in order. Stop and check in with Nitin after each phase; he tests in Expo Go and reports what is wrong.

Figma file `6Jc3DgUuXJDOdc5Z4IC4Lm` · page **Rain Ready (UAE)**.
- Main section `3:2` "🌿 CleanScape × EEG — MVP (New Iteration)": all feature screens, one row per feature.
- Section `747:11910` "🔗 Prototype connections — entry points": S0 Scanner `747:11913`, P0 Profile `747:12008`, N0 Notifications `747:12186`, X0 Demo branches `747:12306`, P1 Friends `890:12735`, P2 Add friends `890:12839`. The export script does NOT cover this section; read these six with the Figma MCP.
- Section `786:12912` "⏸ Later — parked": do not build anything in it.

## Ground rules (unchanged, repeated because they matter)
- Never push, merge, deploy or delete without Nitin's OK. Commit locally only.
- Expo Go only: no custom native modules. All data is sample data behind `DEMO_MODE`.
- Reuse `src/components/ui/*` and `src/constants/theme.ts`. Animate only transform and opacity, respect `useReducedMotion()`.
- RTL must keep working (`start`/`end`, never `left`/`right`).
- No emojis. Button labels are 2 words or fewer. 16 px is the spacing unit.
- `npm run check` must pass before every commit. (In some sandboxes `expo lint` cannot resolve `@/` imports and reports ~1,800 false errors; if so, rely on `tsc --noEmit` and say so.)

## Phase 0: get in sync (do this first)
1. `git status`. There are uncommitted changes from 13 Nov: `src/components/home/home-header.tsx` (Map button + three 36 px glass controls) and `src/constants/theme.ts` (grey skeleton). Nitin has not seen them on a device. Ask him to check Home in Expo Go, then commit them.
2. Git has no user identity on this machine. Ask Nitin to set `user.name` / `user.email` if commits fail.
3. Ask Nitin for a Figma token and run `FIGMA_TOKEN=<token> node scripts/figma-export.mjs`. This refreshes `design/SCREENS.md` (now about 230 screens, with every prototype link), `design/screens.json` and the PNGs.
4. Read `design/CHANGELOG.md`, section **Not synced yet**. It is the detailed spec for everything below (exact sizes, colours, timings, copy). This file is the map; the changelog is the detail; Figma wins if they disagree.
5. Update `docs/NAVIGATION_MAP.md` as you wire each flow. No dead taps: an unbuilt target shows a "Coming soon" toast.

## Phase 1: app-wide rules that changed
Build these once, in shared components, before any screen.

| Rule | What to do | Figma reference |
|---|---|---|
| Blue header | Every standard page with a back button and title uses the blue header: gradient bar 104, light status bar, glass back/action buttons (white 18%), white title, fixed on scroll. Applies now to the Host flow, Neighbourhood goal, Clean-up details and Know your waste. | I1 `924:13291` |
| No blue header | Onboarding, camera/scan, map or photo-hero screens, Earthy chat and voice, celebration screens, full-screen loaders, sheets, lock screen, Wallet. | — |
| Floating sheets | A sheet resting at partial height floats: 8 px gap left, right and bottom, 32 px radius on all four corners, white. At full height it is edge to edge. `Sheet` (`src/components/ui/sheet.tsx`) needs `detached` + inset at partial snap points, animating to 0 at full. The voice sheet uses it: keep the orb centred. | R4 `220:3547` |
| Skeletons | Grey block `#E6EBED`, no outline, white lines, white shimmer left to right (1.1 s per pass, every 1.2 s). Hold 1.2 s. Colour is already in the theme. | I0 `939:13387` |
| Skeleton vs spinner | Skeleton when a screen opens and only data is loading. Spinner or staged loader when the user triggered an action. | F10·10a `887:12689`, F10·10s `887:12727` |
| Staged loader | Steps go pending ring → spinning arc → green tick that pops; Earthy orb breathes. Reuse `thinking-steps.tsx`. | F10·10a, I3s `940:13695` |
| Success tick | Spinner fades, green circle pops, tick draws. Plays once. | F10·17j `888:12768` |
| Back | Back never replays a skeleton. | — |
| Toast | Sits 8 px above the tab bar, leading check icon, capsule "Open" button; the tab bar does not move. | CAL3 `901:13776` |
| Scanner frame | White corner brackets + marigold scan line on every scanner (crew check-in included). Bag sticker uses green brackets, no line. | F4·2 crew `199:3499`, F5·1 `632:11242` |
| Earthy tip | Coach mark: scrim 60% with a cut-out, 2 px white ring (2 px offset on cards, 6 px on the round Earthy button), tip card with a triangle pointer, Action + "Not now". Shows once per screen (persist a `tipSeen` flag). | Component `956:13437` |

## Phase 2: new flows (not in the app yet)
Suggested routes in brackets. Node IDs are the Figma frames.

**A. Host a clean-up, reworked** (replaces most of `litter-radar`, `spot-it`, `cleanup-draft`, `organiser-new`)
F10·11s radar skeleton `887:12953` → F10·11 Litter radar, hosting only `670:11639` → F10·11w Why this spot (sheet) `967:13479` → F10·9 Spot it `669:11508` → F10·15 Become a host `879:12660` → F10·10a Earthy drafting (loader) `887:12689` → F10·10 Your clean-up `670:11520` (+ F10·10e Earthy sheet `892:12799`, F10·10c Add a co-host `892:12755`, C1 Clean-up details `199:3557`) → F10·10s Sending (loader) `887:12727` → F10·16 Sent to EEG `883:12671` (edge: F10·16b EEG asked for changes `887:13222`) → F10·17 Approved, you're live `883:12740` → F10·17i Invite neighbours `888:12733` → F10·17j Invites sent `888:12768`. Later: F10·18 Check the spot `967:13649` → F10·19 Before / after `967:13912`. F10·17 "Crew" opens F9v2·13 Headcount `413:11547`.

**B. Your impact** (`impact`, `impact-week`, `impact-certificate`, …)
I0 skeleton `939:13387` → I1 My impact `924:13291` → IE1 Why March? `948:13383`, IE2 Most picked item `948:13671`, I2 Week memory (sheet) `939:13653`, I3 Hours & certificate `940:13383` → I3s loader `940:13695` → I4 Certificate ready `940:13950`; I7 Clean-up receipt `967:14181` → I8 Vote `967:14442` → I9 Vote result `967:14694`; I6 empty state `939:13903`; F10·14 Neighbourhood goal `673:11567`; F10·13 AI impact story `672:11556` ("Share story" opens the caption writer); F10·5 Class story ready `420:10469`.

**C. Add to calendar** (from the Home "next clean-up" card)
CAL1 choose (sheet) `901:12758` → CAL2 new event `901:13242` → CAL3 Home + toast `901:13776`; synced path CAL4 subscribe alert `901:14236` → CAL4s syncing `910:13787` → CAL5 synced `901:14730`; CAL6 site changed `901:15190`. CAL2 and CAL4 are iOS system screens: do not rebuild them. Use `expo-calendar` if it runs in Expo Go, otherwise skip straight to the toast in `DEMO_MODE`.

**D. Friends** (`friends`, `friends-add`)
P0 Profile gets a Community section → P1 Friends `890:12735` → P2 Add friends `890:12839`. Open question for Nitin before building search: under-18s and open friend search (see "Decisions").

**E. Earthy tips and nudges**
Tips on Home `956:13460`, Cleanups `956:14001`, Getting there `956:14221`, Your class `956:14741`, Smileys `956:14925`. W4h lock-screen heat nudge `956:15167` is a notification mock: not a route.

**F. AI upgrades**
R1·2p Check your photo `968:13670`, R1·4 Your report status `968:13932`, F4·9u Earthy isn't sure `968:14215`, F4·9c Change this (sheet) `968:14479`, F9·S1 Source `968:14605`, F9·S2 Ask the organiser `968:14712`, F9·S3 Question sent `968:14812`.

**G. Demo branches**
X0 `747:12306`, opened from Profile. A list of edge states for demos; every row must open its screen.

## Phase 3: existing screens that changed
Run `/figma-sync` on each group. The changelog has the details.
- **Home**: header (done, uncommitted), card links (banner and "See all" → Cleanups, event cards → detail, next clean-up → registered detail, impact → My impact), "event day" state `786:12402`, Add to calendar button.
- **Know your waste**: F4·1 guide `446:9983` (blue header, emirate chip opens sheet F4·1s `817:12774`), F4·2 Plastic lesson `446:10139` (flip bottle, animated step cards, code picker, quiz F4·2q1–q4 `794:12737` `794:12771` `794:12804` `794:12837`), F4·2s/F4·2t Ask Earthy sheets `818:12775` `818:12802`, F4·3 copy `447:10048`, F4·4 RVM `447:10119`, F4·6g Green bins `829:12645`, F4·7p/F4·9p plastic scan `818:12832` `818:12863`, scan timing 2.5 s and the result-card glow sweep.
- **Check-in and bags**: scanner brackets; crew check-in toast moved under the progress bar.
- **Event day (F11)**: F11·2 Meet your buddy `771:12442` is back between steps 1 and 3; F11·4 has a real blue flag on the map `771:12612`; F11·6 zone map is status-coloured with a route to the zone that needs help `771:13087`.
- **Earthy**: F9v2·10 Gloves mode `413:11317`, F9v2·12 Smart match `413:11476`, F9v2·15 Caption writer `413:11694`, F9v2·16 Locked under 13 `413:11771` are back in scope. Voice motion already matches Figma; do not rewrite it.
- **Rides (T3–T14)**: restored to the main section, already built. Check blue header and floating sheets only.
- **Reports**: R1·2 now goes to R1·2p before sending; R1·3 has "Track" → R1·4.

## Do not build
- Anything in "⏸ Later": voice v1, `02 Event detail — v2`, F10·7, old C1, F10·12 Daily mission (its route exists; leave it), old drafts.
- Motion-state frames (`· enter A/B`, `· Skeleton`, `Motion 1/2`, `Pre-animate`): build them as the screen's entrance or loading state, never as routes.
- Lock screens (W4, W5, W4h), Apple Wallet (W3) and the iOS calendar screens: system UI.

## Decisions waiting on Nitin (ask, don't guess)
1. Friends and under-18s: open search and requests look like a social network for minors; a UAE rule on under-15s and social media was flagged for a lawyer. Safer build: no search, add by QR or class only, parent approval.
2. The voice quick sheet says "Find a cleanup this weekend near me" but the full voice turn says "Find a beach clean-up this weekend with my friends". Pick one.
3. Gloves mode and Locked under 13 have no button leading to them in Figma (only Demo branches). Where should they open from in the app?

## Check before you say a phase is done
1. `npm run check`.
2. Open every new screen from its real entry point, and leave it with Back, Close and the scrim.
3. Compare each screen with its Figma PNG at 360 px wide; fix to within 1 px.
4. Arabic (RTL) and Reduce Motion still work on the screens you touched.
5. Move the changelog entries you built from **Not synced yet** to **Synced** with the commit hash, update `PROJECT_STATUS.md` and `docs/NAVIGATION_MAP.md`.
6. Give Nitin a short tap-through list for Expo Go: where to start, what to tap, what he should see.
