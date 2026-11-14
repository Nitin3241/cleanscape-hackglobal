"""Synthesises the CleanScape sound kit from sounds.json. Re-runnable, no samples.

Everything is a variation of one original bell sound, `done`. Audio is only ever
scaled, never limited or saturated, so nothing can distort. A WAV in tools/synth/recordings/
named after a sound replaces the synthesised version, and gets the same level and fades.

Writes to tools/synth/.build/. build.sh makes the .m4a files and copies the kit to assets/sounds/.
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, resample_poly, sosfilt

from loudness import active_loudness, peak_dbfs

RATE = 48000
FADE = int(0.005 * RATE)
HERE = Path(__file__).parent
CONFIG = json.loads((HERE / 'sounds.json').read_text())
OUT = HERE / '.build'
RECORDINGS = HERE / 'recordings'
PEAK_LIMIT = 10 ** ((CONFIG['peak_limit_dbfs'] - 0.2) / 20)

SEMITONES = {'D': 2, 'E': 4, 'F#': 6, 'A': 9, 'B': 11}
BELL_PARTIALS = ((1, 1.0, 1.0), (2.76, 0.32, 0.5), (5.4, 0.1, 0.25))


def note_hz(name):
    """Refuses anything outside D major pentatonic."""
    pitch, octave = name[:-1], int(name[-1])
    if pitch not in SEMITONES:
        raise ValueError(f'{name} is not in D major pentatonic')
    return 440.0 * 2 ** ((SEMITONES[pitch] + 12 * (octave - 4) - 9) / 12)


def times(ms):
    return np.arange(int(ms / 1000 * RATE)) / RATE


def lowpass(signal, hz):
    return sosfilt(butter(2, hz, 'low', fs=RATE, output='sos'), signal)


def strike(notes, gain, decay_ms, length):
    """One soft bell strike: partials at 1, 2.76 and 5.4, with a fast attack."""
    t = np.arange(length) / RATE
    decay = decay_ms / 1000
    out = np.zeros(length)
    for note in notes:
        hz = note_hz(note)
        for ratio, level, fade in BELL_PARTIALS:
            if hz * ratio < RATE / 2:
                out += level * np.sin(2 * np.pi * hz * ratio * t) * np.exp(-t / (decay * fade))
    return out * np.clip(t / 0.002, 0, 1) * gain / len(notes)


def bell(spec, take):
    """A series of strikes. Gaps come from the take, so every variant keeps the same rhythm."""
    length = int(spec['length_ms'] / 1000 * RATE)
    mix = np.zeros(length)
    for index, hit in enumerate(spec['strikes']):
        start = int(index * take['gap_ms'] / 1000 * RATE)
        mix[start:] += strike(hit['notes'], 10 ** (hit.get('db', 0) / 20), take['decay_ms'], length - start)
    return lowpass(mix, spec.get('lowpass_hz', take['lowpass_hz']))


def load_recording(path):
    """Mono, 48 kHz, with silence trimmed from both ends."""
    audio, rate = sf.read(path, always_2d=True)
    audio = audio.mean(axis=1)
    if rate != RATE:
        audio = resample_poly(audio, RATE, rate)
    audible = np.flatnonzero(np.abs(audio) > np.abs(audio).max() * 0.01)
    return audio[audible[0]: audible[-1] + 1]


def finish(signal, target):
    """Sets the level by scaling alone. If the peak limit gets in the way, it stays quieter."""
    fade = np.ones(signal.size)
    fade[:FADE] = np.linspace(0, 1, FADE)
    fade[-FADE:] = np.linspace(1, 0, FADE)
    signal = signal * fade
    signal = signal * 10 ** ((target - active_loudness(signal, RATE)) / 20)
    return signal * min(1, PEAK_LIMIT / np.max(np.abs(signal)))


def export(audio, folder, name):
    folder.mkdir(parents=True, exist_ok=True)
    sf.write(folder / f'{name}.wav', audio, RATE, subtype='PCM_24')
    sf.write(folder / f'{name}.ogg', audio, RATE, format='OGG', subtype='VORBIS')


def main():
    active = CONFIG['takes']['done'][CONFIG['active_takes']['done']]
    for name, spec in CONFIG['sounds'].items():
        recording = RECORDINGS / f'{name}.wav'
        source = load_recording(recording) if recording.exists() else bell(spec, active)
        audio = finish(source, spec['target_lufs'])
        export(audio, OUT / 'kit', name)
        note = '  (your recording)' if recording.exists() else ''
        print(f'{name:18} {len(audio) / RATE * 1000:5.0f} ms  peak {peak_dbfs(audio):6.2f}  loudness {active_loudness(audio, RATE):6.2f}{note}')

    # Alternative takes of the signature sound, for the preview page only.
    for key, take in CONFIG['takes']['done'].items():
        audio = finish(bell(CONFIG['sounds']['cs-done'], take), CONFIG['sounds']['cs-done']['target_lufs'])
        export(audio, OUT / 'takes', f'cs-done-{key}')


if __name__ == '__main__':
    main()
