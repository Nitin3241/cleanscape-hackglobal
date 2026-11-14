# CleanScape sound and haptics

Quiet, warm and purposeful. Sound only marks moments that matter, and most taps are silent. One original bell sound carries the meaning, and everything else is a variation of it. Haptics carry the meaning on their own, so every important event reads correctly with sound off.

**All audio is original and synthesised in `tools/synth/`.** No Apple or other third-party audio is sampled, recorded or embedded. The direction was inspired by the character of an iOS tone, but no notes or audio are copied.

## The signature sound
**`cs.done`, the confirmation sound:** two soft bell strikes 150 ms apart, D6 and F#6 together and then A6, 3 dB quieter. Partials at 1, 2.76 and 5.4, low-passed at 4.5 kHz. This is Take B, chosen on 30 Oct 2026.

The glide sounds and `cs.logo` from the brief were removed on 30 Oct 2026. The splash and "You're good to go" now play `cs.done`, and moments that used a glide are silent with a haptic.

Everything stays in D major pentatonic (D E F# A B). `synth.py` refuses any other note.

| Variation | Recipe |
|---|---|
| `cs.done.single` | Only the A6 strike, 200 ms |
| `cs.done.reward` | `cs.done` plus a very soft D7 strike |
| `cs.gentle` | One dull, soft D5 strike, never a falling interval |

## Loudness and cleanliness
| Sound | Target |
|---|---|
| `cs.done*` | −20 LUFS-equivalent |
| `cs.gentle` | −26, which is 6 dB under `cs.done` |

The peak limit is −6 dBFS, with 5 ms fades on every file.

**Nothing is limited or saturated.** An earlier kit used a limiter to reach louder targets, which audibly distorted the sounds. Levels are now set by scaling alone. `check_loudness.py` fails on flattened peaks and on encoded files close to clipping.

"LUFS-equivalent" uses the K-weighting and scale of standard LUFS, averaged over the audible part of the sound, because most of these files are too short for the standard measure.

## Events
<!-- events:start -->
<!-- events:end -->

## Rules the module enforces
| Rule | Behaviour |
|---|---|
| Sounds | On by default for `cs.done` and `cs.done.reward`. Everything else needs `allSounds`. |
| Plain taps | Tabs, buttons and chips are silent, with haptics only. |
| Haptics setting | On by default. |
| Quiet hours | No sounds from 10 PM to 7 AM local time, or in the user's own windows. Haptics continue. Check-in is exempt, because cleanups meet before 7 AM. |
| Kid mode | All sounds at 70% volume. `cs.gentle` is designed never to sound like failure. |
| Speech | `feedback.setSpeaking(true)` silences all sounds while Earthy talks. They are dropped, not queued. |
| Typing | `feedback.setTyping(true)` removes the banner's haptic. |
| Rate limits | Haptics no faster than every 80 ms. Smileys no more than one play per 2 s. |
| Reduce Motion | Signature patterns become one plain success haptic. |
| Silent switch | iOS: respected through the audio mode. Android: see "Known limits". |

## Known limits
- **Expo Go can't play `.ahap` files or amplitude waveforms.** Both need a native module in a custom build, and the files in `assets/haptics/` are ready for that. Until then, the module approximates them with timed `expo-haptics` taps, at least 80 ms apart.
- **Android ringer mode:** Expo can't read it, so Android sounds follow media volume rather than silent mode. This also needs a native module.
- **Web:** plays the `.m4a` builds rather than `.ogg`, because Safari can't always decode Ogg.

## Changing a sound
Edit `tools/synth/sounds.json`, then run `tools/synth/build.sh`. To pick a different take, change `active_takes`. To use your own recording, see `tools/synth/recordings/README.md`.
