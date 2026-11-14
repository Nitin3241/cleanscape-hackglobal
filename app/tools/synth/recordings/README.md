# Your own recordings

Put a WAV here named after the sound it replaces, then run `tools/synth/build.sh`.

For example, `cs-done.wav` replaces the confirmation sound everywhere it plays. The names are in `sounds.json`: `cs-done`, `cs-done-single`, `cs-done-reward`, `cs-gentle`.

The build trims silence, sets the level by scaling alone and adds 5 ms fades, then the loudness check runs on it. Record quietly enough not to clip: distortion in the recording can't be removed.

Only use audio you made yourself. Don't record Apple's tones or any other app's sounds, because they can't ship.
