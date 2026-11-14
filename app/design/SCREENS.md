# CleanScape screens

Exported 13 Nov 2026 through the Figma connector (file `6Jc3DgUuXJDOdc5Z4IC4Lm`, page Rain Ready (UAE)). 238 screens: 232 in section `3:2` (MVP, new iteration) and 6 in `747:11910` (prototype entry points). Section `786:12912` (Later, parked) is left out on purpose.

How to read it:
- Rows follow the Figma canvas (one row per feature). A few frames sit under a neighbouring row label in Figma; they are listed where Figma puts them, with a note (F11 sits under the F10 label; F9·S1–S3 and F9v2·10/12/15/16 under Story A).
- Links come from the Figma prototype. Tab bar and Scan button links are left out (every screen has them: Home, Events → R1 skeleton, Smileys → F7·1 skeleton, Profile → P0, Scan → S0).
- `?id` means the link points at a node that is not a screen in these sections (a component state, a parked frame or a deleted draft).
- "(motion state, not a route)": build as the entrance or loading state of the screen it leads to, never as its own route.
- Screenshots are fetched per flow with the connector as each flow is built (saved to `design/screens/`).
- The export script (`scripts/figma-export.mjs`) does the same with a personal token, plus PNGs and on-screen text.

## F0 · Onboarding
_Splash → language → welcome → sign-in → birthday/guardian → pledge → location → interests → notifications → good to go_
- **00 Splash — first launch** `141:735`: auto 1.4s → Onb 01 — Language
- **00 Splash** `129:426`: auto 1.4s → 00 Splash — out
- **00 Splash — out** `133:545` (motion state, not a route): auto 0.01s → 01 Home · Motion 1 — Skeleton
- **Onb 01 — Language** `137:492`: Continue → Onb 02.1 — Welcome
- **Onb 02.1 — Welcome** `137:538`: Skip → Onb 03 — Sign in; Next → Onb 02.2
- **Onb 02.2 — Welcome** `137:572`: Skip → Onb 03; Next → Onb 02.3
- **Onb 02.3 — Welcome** `137:607`: Next → Onb 02.4 — Meet Earthy AI; Skip → Onb 03
- **Onb 02.4 — Meet Earthy AI** `442:9970`: Get started → Onb 03 — Sign in
- **Onb 03 — Sign in** `137:641`: Back → back; UAE PASS / Apple / Google → Onb 06 — Birthday; Use phone or email instead → Onb 04 — Phone
- **Onb 04 — Phone** `137:676`: Back → back; Send code → Onb 05 — Code
- **Onb 05 — Code** `139:566`: Back → back; Verify → Onb 06 — Birthday
- **Onb 06 — Birthday** `139:602`: Back → back; Continue → Onb 07 — Guardian
- **Onb 07 — Guardian** `139:647`: Back → back; Send link → Onb 08a — Pledge (before drawing)
- **Onb 08 — Pledge** `139:686`: Back → back; I pledge → Onb 09 — Location
- **Onb 08a — Pledge (before drawing)** `141:658` (motion state, not a route): Pledge pad → Onb 08 — Pledge
- **Onb 09 — Location** `140:602`: Back → back; Skip / Allow location / Pick my emirate → Onb 10 — Interests
- **Onb 10 — Interests** `140:639`: Back → back; Skip / Continue → Onb 11 — Notifications; With my school → sets a prototype variable
- **Onb 11 — Notifications** `140:705`: Back → back; Skip / Turn on reminders / Not now → Onb 12a
- **Onb 12 — Good to go** `140:740`: Find a cleanup → 01 Home · Motion 1 — Skeleton
- **Onb 12a — Good to go (before burst)** `141:691` (motion state, not a route): auto 0.15s → Onb 12 — Good to go

## Home
_Final home (EN), loading and motion states, Arabic RTL, event-day version_
- **01 Home — EN · v2 (3 Final)** `74:278`: auto 1s → shows the Earthy tip once (conditional on tipSeen); MapChip → R2 Cleanups — map; Notifications → N0 Notifications; CampaignBanner → R1 Cleanups — list; Material/Plastic → F4·2 Plastic — how to sort; Material/Paper, Food, E-waste, See more → F4·1 Know your waste — guide; HostCleanup → F10·11s Litter radar · Skeleton; NextEventCard → R7 Event detail — registered; Add to calendar → CAL1 Add to calendar — choose (sheet); ImpactCard → I0 My impact — loading (skeleton); Near you See all → R1; EventCard/Jumeirah Beach sweep, EventCard/Al Safa Park cleanup → R3 Event detail; Earthy FAB → F9v2·0 Voice — quick sheet
- **01 Home · Motion 1 — Skeleton** `103:722` (motion state, not a route): auto 1.2s → Motion 2; MapChip → R2; Notifications → N0; HostCleanup → F10·11s
- **01 Home · Motion 2 — Pre-animate** `103:319` (motion state, not a route): auto 0.15s → 01 Home; same card links as Home, except ImpactCard → F7·1 Smileys (older link)
- **07 Home — AR (RTL) · v2** `259:6493`: frame → back
- **01 Home — event day** `786:12402`: Home's links, except NextEventCard and Add to calendar → F11·1 Before — pack your kit; ImpactCard → F7·1 Smileys
- **01 Home — Earthy tip** `956:13460`: Home's links, plus Spotlight scrim / Dismiss → sets tipSeen, back to Home; Action → sets tipSeen, F10·11s Litter radar · Skeleton

## Your impact this year
_Home impact card → I0 skeleton → I1 My impact → I2 week memory · I3 certificate purpose → I3s Earthy preparing → I4 certificate. I6 = first-time empty state._
- **I0 My impact — loading (skeleton)** `939:13387`: auto 1.2s → I1 My impact — 2026; Back → 01 Home
- **I1 My impact — 2026** `924:13291`: AI/Chip → IE1 Earthy — Why March? (sheet); AI/Chip → IE2 Earthy — Most picked item (sheet); Week 11 → I2 Week memory (sheet); Event · Sat 21 Nov → R3; Row · Hours → I3 Hours & certificate — set up; Row · Area → F10·14 Neighbourhood goal; Row · Story → F10·13 AI impact story; Earthy · host nudge → F10·11 Litter radar; Back → 01 Home
- **I2 Week memory (sheet)** `939:13653`: Scrim / Close → I1; Button → I7 Clean-up receipt; Button → F10·13 AI impact story
- **IE1 Earthy — Why March? (sheet)** `948:13383`: Scrim → I1 (I1's links underneath)
- **IE2 Earthy — Most picked item (sheet)** `948:13671`: Scrim → I1 (I1's links underneath)
- **I3 Hours & certificate — set up** `940:13383`: Back → I1; Button → I3s Certificate — Earthy preparing (loader)
- **I3s Certificate — Earthy preparing (loader)** `940:13695`: auto 2.7s → I4 Certificate ready; Back → I3
- **I4 Certificate ready** `940:13950`: Back → I1
- **F10·13 AI impact story** `672:11556`: Close → back; Button (Share story) → F9v2·15 Caption writer (18+)
- **F10·14 Neighbourhood goal** `673:11567`: Button → F10·10 Earthy drafted your clean-up; Back → back
- **I6 My impact — empty (first clean-up)** `939:13903`: Back → 01 Home
- **F10·5 Class impact — story ready** `420:10469`: back → F3·4 Your class; Button (Share story) → F9v2·15 Caption writer; AI/Button Primary (Watch story) → F10·13 AI impact story
- **I7 Clean-up receipt** `967:14181`: Back → back; Vote next → I8 Vote — where next?
- **I8 Vote — where next?** `967:14442`: Back → back; Vote → I9 Vote result
- **I9 Vote result** `967:14694`: Back → back; Host it → F10·11 Litter radar

## Know your waste
_Guide → emirate sheet → Plastic lesson (Ask Earthy, scan) → drop-off places → pizza box answer, green bins, scan, reward_
- **F4·1 Know your waste — guide** `446:9983`: Search / Scan card → F4·6 Earthy answer — pizza box; Guide/Plastic → F4·2 Plastic — how to sort; Frame → back; Emirate chip → F4·1s Choose your emirate (overlay)
- **F4·1s Choose your emirate — sheet (overlay)** `817:12774`: Scrim / Option / Save → close overlay
- **F4·2 Plastic — how to sort** `446:10139`: hero bottle, bin steps, codes 2–7, Keep out → component states; Scan row → F4·7p; Frame → back; AI/Button Primary → F4·3a First visit — 3 kinds of drop-off; Ask Earthy → F4·2s (overlay)
- **F4·2s Ask Earthy — plastic (overlay)** `818:12775`: Scrim → close overlay; Question → F4·2t
- **F4·2t Ask Earthy — bottle caps (overlay)** `818:12802`: Scrim → close overlay; Follow-up → F4·7p
- **F4·7p Scan — plastic bottle, Earthy is looking** `818:12832`: auto 2.5s → F4·9p; Close → back
- **F4·9p Scan result — plastic bottle** `818:12863`: Close / Binned it → F4·2; Not right → F4·9c Change this (sheet); Find bins → F4·6g Green bins near you
- **F4·3 Drop-off near you — plastic** `447:10048`: Frame → back; map pins → component states; Place row → F4·4 Reverse vending machine
- **F4·3a First visit — 3 kinds of drop-off** `451:10094`: Skip → F4·3; Primary → F4·3b
- **F4·3b First visit — start with the nearest** `451:10226`: Primary → F4·3
- **F4·4 Reverse vending machine** `447:10119`: Frame → back; pins, Bring / Leave at home, RVM step → component states
- **F4·6 Earthy answer — pizza box** `447:10338`: Frame → back; Follow-up → F4·7; Follow-up → F4·6g; Ask field → F9·S2 Earthy — ask the organiser (sheet); Source pill → F9·S1 Earthy — source (sheet)
- **F4·6g Green bins near you** `829:12645`: Frame → back; Place row → F4·4
- **F4·7 Scan — Earthy is looking** `455:10167`: auto 2.5s → F4·8; Close → back
- **F4·8 Scan — found 2 parts** `455:10230`: Close → back; Peek sheet → F4·9
- **F4·9 Scan result — pizza box** `455:10282`: Close → back; Not right → F4·7; Primary → F4·10; Find bins → F4·6g
- **F4·10 Confirm — did both go in?** `460:10200`: Close → back; Primary → F4·11 · enter A
- **F4·11 Reward — +2 Smileys** `460:10276`: auto 0.15s → ?646:11419; Primary → 01 Home; Scan more → F4·7
- **F4·11 Reward — +2 Smileys · enter A** `737:11830` (motion state, not a route): auto → enter B
- **F4·11 Reward — +2 Smileys · enter B** `737:11862` (motion state, not a route): auto → F4·11
- **F4·9u Scan — Earthy isn’t sure** `968:14215`: Back → back; Choose item → F4·9c
- **F4·9c Change this (sheet)** `968:14479`: Scrim / Close / Update result → F4·9p (F4·9p's links underneath)
- **F4·2q1–q3 Plastic quiz — questions 1–3** `794:12737` `794:12771` `794:12804`: Frame → F4·2; options → answer states
- **F4·2q4 Plastic quiz — score** `794:12837`: Back to plastic → F4·2; Find drop-off → F4·3

## Host a clean-up
_Home "Host a clean-up" → Litter radar → Spot it → Become a host → Earthy drafts → review by EEG → live → invite_
- **F10·11s Litter radar · Skeleton** `887:12953` (motion state, not a route): auto 1.2s → F10·11; Back → back
- **F10·11 Litter radar — where it’s needed** `670:11639`: Back → 01 Home; Host here → F10·9 Spot it; pins / spot card → spot-card states; Somewhere else → ?420:10645 (parked); Why → F10·11w Why this spot (sheet)
- **F10·9 Spot it — AI sizes the job** `669:11508`: Close → back; Host here → F10·15 Become a host — one time
- **F10·15 Become a host — one time** `879:12660`: Continue → F10·10a Earthy drafting (loader); Back → back
- **F10·10a Earthy drafting (loader)** `887:12689`: auto 3.41s → F10·10 Earthy drafted your clean-up
- **F10·10 Earthy drafted your clean-up** `670:11520`: place row / Edit → C1 Clean-up details; Add co-host → F10·10c (overlay); Request review → F10·10s Sending request (loader); Back → F10·9; Ask Earthy → F10·10e (overlay)
- **F10·10e Earthy · your clean-up (sheet)** `892:12799`: Scrim → close; Ask Omar / Someone else → F10·10c Add a co-host (sheet)
- **F10·10c Add a co-host (sheet)** `892:12755`: Scrim / Ask Omar → close; Not in the list? Add friends → P2 Add friends
- **C1 Organiser — create event · EN · v2** (Clean-up details) `199:3557`: Recentre / Save changes / Back → back
- **F10·10s Sending request (loader)** `887:12727`: auto 1.2s → F10·16 Sent to EEG — in review; Back → back
- **F10·16 Sent to EEG — in review** `883:12671`: Add a co-host → F10·10c (overlay); Edit details → C1; Cancel request / Back → F10·10; Done → F10·17 Approved — you’re live
- **F10·16b EEG asked for changes** `887:13222`: Fix it → C1; Back → back
- **F10·17 Approved — you’re live (2 days later)** `883:12740`: Crew → F9v2·13 Organiser — Headcount + broadcast; Invite neighbours → F10·17i (overlay); Back → back
- **F10·17i Invite neighbours (sheet)** `888:12733`: Scrim → close; Send invites → F10·17j
- **F10·17j Invites sent (sheet)** `888:12768`: Scrim → close; Done → F10·17
- **F10·11w Why this spot (sheet)** `967:13479`: Scrim / Close → F10·11; Host here → F10·9
- **F10·18 Check the spot — 2 weeks later** `967:13649`: Back / Not now → back; Take photo → F10·19 Before / after — stayed clean
- **F10·19 Before / after — stayed clean** `967:13912`: Back → back; Done → F10·11
- **F9v2·13 Organiser — Headcount + broadcast** `413:11547`: Close → back; Primary → F9v2·1 Earthy home (plus the Earthy answer links)

## F1 · Find events & register — happy path
_Home card → list / map → detail → confirm → you're in → pass → registered_
- **R1 Cleanups — list** `219:2955`: auto 1s → shows the Earthy tip once (conditional); best card → R3; full card → E4; Mushrif Park → R3b; Host a clean-up → F10·11s; back → 01 Home; Kids OK → E9; Map → R2
- **R2 Cleanups — map** `219:3063`: back → back; Full pin → E4; Kite Beach pin / card → R3; List → R1; Join → R4
- **R3 Event detail** `220:3354`: Back → back; Register → R4
- **R4 Confirm — who's coming** `220:3547`: Back → back; Scrim → R3; Under 18 → E2; Confirm → R5 · enter A
- **R5 You're in — celebration** `220:4497`: View my pass → R6
- **R6 My pass** `222:4121`: back → R7; Heading → F4·1 Check-in pass; Add to Wallet → W0; Directions → R6a; Cancel link → E7
- **R7 Event detail — registered** `222:4419`: Back → back; Getting there → T1; View pass → R6
- **R6a Pass — directions sheet** `489:11319`: back / Scrim / Cancel → back
- **W0 Add to Wallet — why** `495:11631`: Scrim / Close / Not now → back; Add to Apple Wallet → W1
- **R5 · enter A / enter B** `737:11503` `737:11547` (motion states, not routes)
- **R1 Cleanups — list · Skeleton** `740:11906` (motion state, not a route): auto 1.2s → R1
- **R1 Cleanups — Earthy tip** `956:14001`: R1's links, plus Scrim / Dismiss → sets tipSeen, back to R1; Action → sets tipSeen, R3

## F1 · Edge states
_Same day · under-18 guardian · waitlist auto-join · cancel + undo · no matches · offline · guardian declined_
- **E1 Same day — already booked** `223:4454`: Back → back; Switch → R5 · enter A; Keep mine → R7
- **E2 Under 18 — guardian number** `223:4702`: Back → back; Send request → E3
- **E3 Pass — waiting for guardian** `223:4929`: auto 5s → E11; back → back; Change number → E2; Cancel link → E7
- **E4 Event full — join waitlist** `223:5243`: Back → back; Join waitlist → E5
- **E5 On the waitlist** `223:5787`: auto 3.5s → E6; Back → back; Leave waitlist → E4
- **E6 Spot opened — auto-joined (push)** `224:5867`: NextEventCard → R7; Push notification → R6
- **E7 Cancel — confirm** `224:6293`: back → back; Add to Wallet → W1; Directions → R6a; Keep spot → R6; Cancel my spot → E8
- **E8 Cancelled — undo** `224:6602`: auto 4s → E8b; Back → back; Register → R4; Snackbar (Undo) → R7
- **E9 No matches — notify me** `224:6801`: back → back; Clear filters → R1
- **E10 Offline — saved cleanups** `224:6884`: back → back; best card → R3; Offline banner → R1
- **E11 Guardian said no** `224:6996`: auto 4s → E10; back → back; Resend link → R1; Change number → E2
- **R3b Event detail — already booked that day** `486:10225`: Back → back; Register → E1
- **E8b Cancelled — toast dismissed** `488:10602`: Back → back; Register → R4

## F1 · Add to Wallet
_Apple Wallet add sheet → added → Wallet → lock screen on the day → pass updated · Google Wallet · pending guardian_
- **W1 iOS — Add to Apple Wallet sheet** `231:6393`: back / Cancel → back; Directions → R6a; Cancel link → E7; Add → W2
- **W2 Pass — added to Wallet** `231:6935`: back → R7; In Wallet → W3; Directions → R6a
- **W3 Apple Wallet — pass** `231:7241`: Done → W2
- **W4 Lock screen — at Kite Beach** `234:6433`: system UI, not built
- **W5 Lock screen — pass updated** `234:6457`: system UI, not built
- **W6 Android — Save to Google Wallet** `234:6481`: back → R7; Directions → R6a; Cancel link → E7; Scrim / Cancel → back; Save → W2
- **W7 Pending — Wallet after approval** `234:6946`: Directions → R6a
- **W6a Save to Google Wallet — why** `496:11672`: Scrim / Close / Not now → back; Add to Google Wallet → W6
- **W4h Lock screen — Earthy heat nudge** `956:15167`: notification → F9v2·11 Safety — Heat (notification mock, not a route)

## Add to calendar
_From the Registered card on Home. Keep it synced (updates the exact site on its own) or add just this one. CAL6: what one-off adders see when the site is shared._
Every CAL frame is drawn over Home and repeats Home's links; only its own links are listed.
- **CAL1 Add to calendar — choose (sheet)** `901:12758`: Scrim / Close → 01 Home; Apple tile (keep synced) → CAL4; Apple Calendar row (just this one) → CAL2
- **CAL2 Apple Calendar — new event (system)** `901:13242`: Close → CAL1; Add → CAL3 (iOS system sheet, do not rebuild)
- **CAL3 Home — added to calendar** `901:13776`: Snackbar → R7
- **CAL4 Keep it synced — subscribe (system)** `901:14236`: Cancel → CAL1; Subscribe → CAL4s (iOS system alert, do not rebuild)
- **CAL4s Home — syncing (loader)** `910:13787`: auto 1.2s → CAL5
- **CAL5 Home — synced** `901:14730`: Snackbar → R7
- **CAL6 Home — site shared, update calendar** `901:15190`: Update calendar → CAL2

## F2 · Transport & shared rides
_Event detail → Getting there (carpool · Metro + bus · drive) → find / request a seat → chat → ride on pass · offer seats → licence → published · edge states_
- **02b Getting there — map** `171:2086`: Minimise → R7; Other ways → T1
- **T1 Getting there — options** `268:6525`: auto 1s → shows the Earthy tip once (conditional); Map strip / Drive → 02b; Find rides → T3; Offer seats → T8; Metro + bus → T2; back → R7
- **T2 Metro + bus — route** `268:6952`: back → T1; Find rides → T3
- **T1 Getting there — Earthy tip** `956:14221`: T1's links, plus Scrim / Dismiss → sets tipSeen, back to T1; Action → sets tipSeen, T3
- **T3 Find a seat — rides** `268:7361`: back → T1; Women only → T11; Aisha → T4
- **T4 Ride detail — Aisha** `268:7476`: back → T3; Request seat → T5
- **T5 Request sent — pending** `269:7251`: Done → T7
- **T6 Ride chat — accepted** `269:7350`: back → T7
- **T7 Pass — ride added** `269:7396`: back → R7; Add to Wallet → W1; Cancel link → E7; Your ride → T13; Chat → T6
- **T8 Offer seats — one screen** `269:7705`: back → T1; Publish ride → T9
- **T9 Licence check — first time** `269:7777`: Scan licence → T10
- **T10 Ride published** `269:7868`: View ride → T7
- **T11 No seats yet — notify me** `270:7332`: back / Women only → T3; Notify me → T1; Metro → T2; Offer seats → T8
- **T12 Under 18 — trusted drivers only** `270:7457`: back → T1; Women only → T11; Rule → T14; Aisha → T4
- **T13 Driver cancelled — rematch** `270:7564`: back → R7; Add to Wallet → W1; Cancel link → E7; Scrim / Take seat → T7; Take Metro → T2
- **T14 Guardian chose public transport** `270:7891`: back → R7; Map strip / Drive → 02b; Guardian line → T12; Metro + bus → T2

## F3 · School group (student)
_Join class by code → parent approval → class space → school bus → own pass + invite friends → live class check-in → class impact_
- **F3·1 Join your class** `293:7715`: back → back; Scan Teacher QR / Find My Class → F3·2
- **F3·2 Class found** `293:7778`: Scrim → F3·1; Join → F3·3; Not my class → F3·1
- **F3·3 Parent approval** `294:7734`: back → back; Button → F3·4
- **F3·4 Your class** `294:7786`: auto 1s → shows the Earthy tip once (conditional); back → back; Button → F3·6; School bus → F3·5; Invite → F3·9
- **F3·5 School bus** `294:7911`: back → back; Button → F3·6
- **F3·6 Your pass — with class** `296:8124`: back → back; QR → F3·7; Invite friends → F3·9
- **F3·7 Class check-in live** `296:8428`: auto 3s → F3·8c; back → back
- **F3·8c Class impact — v3** `580:11169`: back → F3·4
- **F3·4 Your class — Earthy tip** `956:14741`: F3·4's links, plus Scrim / Dismiss → sets tipSeen, back to F3·4; Action → sets tipSeen, F3·9
- **F3·9 Invite friends — sheet** `296:8566`: Scrim / Button → F3·6

## F4 · QR check-in, hours & certificate
_Volunteer shows pass → crew head scans (works offline) → roster · edge states_
- **F4·1 Check-in pass — show to crew leader** `3:212`: auto 3s → F4·4 · enter A; back → back
- **F4·2 Crew head — scan passes** `199:3499`: Close → back; Scan brackets → F4·2a; List / Search → F4·3
- **F4·3 Crew head — roster** `199:3481`: Scan → F4·2; back → back
- **F4·4 Volunteer — you’re checked in** `335:8308`: auto 0.15s → ?646:11340; back → back
- **F4·2a Scan — not on this roster** `626:11237`: Close → F4·2; Button → F4·2b; Button → F4·2
- **F4·2b Scan — already checked in** `626:11309`: Close → F4·2; Button → F4·2c
- **F4·2c Scan — parent approval missing** `626:11379`: Close / Button → F4·2
- **F4·4 · enter A / enter B** `737:11707` `737:11756` (motion states, not routes)

## F5 · Bag log
_Scan the bag sticker → hand it to your crew head → they weigh it → Smileys land_
- **F5·1 Bag log — this is bag #14** `632:11242`: Close → back; Button → F5·2
- **F5·2 Bag log — hand it to your crew head** `632:11328`: auto 3s → F5·4 · enter A; Button → F5·1
- **F5·3 Crew head — weigh bag #14** `632:11398`: Close / Button → back
- **F5·4 Bag log — Smileys earned** `632:11476`: auto 0.15s → ?646:11388; Done / Button → F5·1
- **F5·4 · enter A / enter B** `737:11935` `737:11967` (motion states, not routes)

## F7 · Smileys
_Earn → level up → spend at sponsor shops. Non-cash. Hours tracked for school + Golden Visa._
- **F7·1 Smileys — home** `3:548`: auto 1s → shows the Earthy tip once (conditional); Balance card / See all → F7·2; Fresh juice offer → F7·3
- **F7·2 Smileys — badges & levels** `639:11313`: back → back
- **F7·3 Smileys — sponsor reward** `640:11294`: back → back; Button → F7·4 · enter A
- **F7·4 Smileys — voucher ready** `640:11358`: back → back; Button → F7·1
- **F7·4 · enter A / enter B** `737:12297` `737:12491` (motion states, not routes)
- **F7·1 Smileys — home · Skeleton** `740:12092` (motion state, not a route): auto 1.2s → F7·1
- **F7·1 Smileys — Earthy tip** `956:14925`: F7·1's links, plus Scrim / Dismiss → sets tipSeen, back to F7·1; Action → sets tipSeen, R1

## F9 v2 — AI assistant, full feature set
_Mixed AI patterns: Gemini greeting + pill composer, ChatGPT-style orb, follow-up rows, Today glance, Earthy Lens. Every action ends on Confirm. EN/AR._
Every Earthy answer screen also has: Full screen → F9v2·2 Voice — listening; Ask Earthy → F9v2·4 Did you mean?; voice → F9v2·2; lens → F9v2·3. Only the other links are listed.
- **F9v2·1 Earthy home** `413:10674`: Close → back; cards → F9v2·5, ·14, ·7, ·6, ·8, ·B1, ·A1; auto 0.8s → ?167:1693
- **F9v2·2 Voice — listening** `413:10760`: auto 9.4s → F9v2·2b; Close / Type → F9v2·1; Book → F9v2·5
- **F9v2·3 Earthy Lens — ask with camera** `413:10806`: Close → back
- **F9v2·4 Did you mean?** `413:10845`: Close → back; options → F9v2·5, F9v2·12
- **F9v2·5 Answer — Next clean-up** `413:10917`: Close → back; → F9v2·6, F9v2·14
- **F9v2·6 Answer — What to bring** `413:10999`: Close → back; → F9v2·14
- **F9v2·7 Answer — Hours + Smileys** `413:11089`: Close → back
- **F9v2·8 Action — Join with class code** `413:11172`: Close → back; Primary → F9v2·9; Secondary → F9v2·1
- **F9v2·9 Action — Resend parent consent** `413:11243`: Close → back; Primary / Secondary → F9v2·1
- **F9v2·11 Safety — Heat** `413:11405`: Close → back
- **F9v2·14 Water break timer** `413:11618`: Close → back
- **F9v2·2a Voice — thinking** `649:11374`: auto 6.2s → F9v2·2b; Close / Type → F9v2·1; Book → F9v2·5
- **F9v2·2b Voice — speaking** `649:11435`: tap → F9v2·2 (listen again); Close / Type → F9v2·1; Book → F9v2·5
- **F9v2·0 Voice — quick sheet** `650:11453`: auto 2.97s → F9v2·2a; Scrim / Close → back; Mic → F9v2·2a; Type instead → F9v2·1; Full screen → F9v2·2
- **F9v2·A1–A4 Plan my Saturday** `660:11493` `660:11566` `660:11669` `660:11754`: A1 → A2 → A3 → (Primary) A4 → F9v2·1; Close → back
- **F9v2·B1–B4 On the day** `660:11841` `660:11930` `660:12019` `660:12103`: B1 → B2 → B3 → B4 → F9v2·1; Close → back

## AI upgrades and back-in-scope Earthy screens
_(In Figma these sit under the Story A label.)_
- **F9·S1 Earthy — source (sheet)** `968:14605`: Scrim / Close / Got it → F4·6 Earthy answer — pizza box
- **F9·S2 Earthy — ask the organiser (sheet)** `968:14712`: Scrim / Close → F4·6; Send → F9·S3 Question sent (sheet)
- **F9·S3 Question sent (sheet)** `968:14812`: Scrim / Done → F4·6
- **F9v2·10 Hands-free logging (gloves mode)** `413:11317`: Close → back (only X0 Demo branches leads here)
- **F9v2·12 Smart match + ride grouping** `413:11476`: Close → back; Primary → F9v2·5
- **F9v2·15 Caption writer (18+)** `413:11694`: Close → back
- **F9v2·16 Locked — under 13** `413:11771`: Close → back; Primary → F9v2·1 (only X0 Demo branches leads here)

## F11 · Event day
_(In Figma these sit under the F10 row label.) Before → Arrival → During → After_
- **F11·1 Before — pack your kit** `771:12365`: back → back; Remind 9 PM / All packed → F11·2
- **F11·2 Before — meet your buddy** `771:12442`: back → back; Skip / Say hi → F11·3
- **F11·3 Before — 60-second briefing** `771:12504`: back → back; Got it / Open Waze → F11·4
- **F11·4 Arrival — find your crew** `771:12612`: back → back; Call lead / I’m here → F11·5
- **F11·5 Arrival — your role** `771:13009`: back → back; Swap role / Got it → F11·6
- **F11·6 During — zone guide** `771:13087`: back → back; Stay here / Go to C → F11·8; Help → F11·7
- **F11·7 During — I need help** `772:12421`: back → back; Share my spot / Call the organiser / Find my team / Call 999 → back
- **F11·8 During — water break** `772:12504`: back → back; In 10 min / Start now → F11·9; Help → F11·7
- **F11·9 After — your recap** `772:12574`: back → back; Certificate / Share story → F11·10
- **F11·10 After — quick feedback** `772:12662`: back → back; Skip / Send → F11·11
- **F11·11 After — what’s next** `772:12727`: back → back; Not now → 01 Home · Motion 1; See all → R1 · Skeleton

## R — Resident cleanliness reports
_R1 Report a dirty spot: Scan button → “Spot” mode → Earthy suggests type & size → send. Signed-in, anonymous option. Smileys once verified._
- **R1·1a Report — Earthy framing coach** `604:11211`: auto 2s → R1·1; Close → back; Shutter → R1·2
- **R1·1 Report — Earthy detects litter** `595:11171`: Close → back; Shutter → R1·2; Ask → R1·1c
- **R1·1b Report — hazard spotted** `604:11283`: Control panel / Shutter → R1·2b; Close → back
- **R1·1c Report — voice note (hold Earthy)** `604:11357`: auto 2.5s → R1·2; Close → back
- **R1·2 Report — Earthy reviews** `596:11179`: Close → back; Button → R1·2p Check your photo
- **R1·2p Check your photo** `968:13670`: Back / Retake → back; Send report → R1·3 · enter A
- **R1·2b Report — review, hazard** `617:11243`: Close → back; Button → R1·3 · enter A
- **R1·2c Report — already reported** `617:11323`: Close → back; Button → R1·3c · enter A; Button → R1·2
- **R1·3 Report — sent** `596:11272`: auto 0.15s → ?646:11357; Done → R1·1a; Track report → R1·4 Your report — status
- **R1·3c Report — +1 added** `617:11422`: Done → R1·1a
- **R1·4 Your report — status** `968:13932`: Back / Done → back
- **R1·3 / R1·3c · enter A / enter B** `737:12040` `737:12084` `737:12170` `737:12217` (motion states, not routes)

## Prototype connections
_Entry points so every frame is reachable: Scan button → S0, Profile tab → P0, Home bell → N0. P0 → X0 for demo-only branches._
- **S0 Scanner — what are you scanning?** `747:11913`: Close → back; Check in → F4·1; Sort an item → F4·7; Log a bag → F5·1; Report litter → R1·1a; Scan passes → F4·2
- **P0 Profile** `747:12008`: Friends → P1; Add friends → P2; Class impact → F3·8c; Join your class → F3·1; Daily 5-minute mission → ?671:11544 (parked); Your impact story → F10·13; Language → 07 Home — AR; Wallet on Android → W6a; Demo branches → X0
- **N0 Notifications** `747:12186`: back → back; Earthy noticed 3 spots → F10·11; 5-minute mission → ?671:11544 (parked); Heat warning → W4h; Picked for you: Kite Beach → R3; Leave at 6:05 → T1; Class story → F3·8c; 40 Smileys to go → F7·1; It’s event day → 01 Home — event day; You’re at Kite Beach → W4; Meet point moved → W5; Your impact story → F10·13
- **X0 Demo branches** `747:12306`: Hazard spotted → R1·1b; Already reported nearby → R1·2c; Crew head weighs bag #14 → F5·3; Splash, first launch → 00 Splash — first launch; EEG asked for changes → F10·16b; Check the spot → F10·18; Gloves mode → F9v2·10; Earthy isn’t sure → F4·9u; Locked for under 13 → F9v2·16; Site changed → CAL6; First clean-up → I6; Class story ready → F10·5; back → back
- **P1 Friends** `890:12735`: Back → back; Add friends → P2
- **P2 Add friends** `890:12839`: Back → back

## Not a screen
- **Spec panel** `3:748`
