"""Prints peak, loudness and length for every sound. Exits with an error if any breaks the targets."""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

from loudness import active_loudness, peak_dbfs

BUILD = Path(__file__).parent / '.build'
CONFIG = json.loads((Path(__file__).parent / 'sounds.json').read_text())
TOLERANCE_LU = 1.0
# Staying under the peak limit by scaling can leave a bright bell a little quieter than its target.
TOO_QUIET_LU = 4.0
MAX_MS = 1200
MAX_ENCODED_PEAK = -1.0
MAX_FLAT_TOP = 0.5
EDGE_LIMIT = 0.02  # First and last samples must be near silence, so there's no click.


def clipped_share(audio):
    """How much of the sound sits flat against its own peak. Clean audio only touches it briefly."""
    return np.mean(np.abs(audio) > np.abs(audio).max() * 0.98) * 100


def check(folder, name, target):
    path = folder / f'{name}.wav'
    audio, rate = sf.read(path)
    ms = len(audio) / rate * 1000
    peak, loud = peak_dbfs(audio), active_loudness(audio, rate)
    decoded = peak_dbfs(sf.read(path.with_suffix('.ogg'))[0])
    problems = []
    if rate != 48000 or sf.info(path).subtype != 'PCM_24':
        problems.append('not 48 kHz / 24-bit')
    if peak > CONFIG['peak_limit_dbfs']:
        problems.append('peak too high')
    if decoded > MAX_ENCODED_PEAK:
        problems.append('encoded file too close to clipping')
    if clipped_share(audio) > MAX_FLAT_TOP:
        problems.append('flattened peaks: distortion')
    if loud > target + TOLERANCE_LU or loud < target - TOO_QUIET_LU:
        problems.append('off target')
    if ms > MAX_MS:
        problems.append('too long')
    if abs(audio[0]) > EDGE_LIMIT or abs(audio[-1]) > EDGE_LIMIT:
        problems.append('clicks at the edge')
    if not path.with_suffix('.m4a').exists():
        problems.append('missing .m4a')
    print(f"{name:18} {ms:5.0f} {peak:7.2f} {decoded:7.2f} {loud:7.2f} {target:7.1f} {clipped_share(audio):6.2f}  {', '.join(problems) or 'ok'}")
    return bool(problems)


def main():
    print(f"{'sound':18} {'ms':>5} {'peak':>7} {'ogg':>7} {'loud':>7} {'target':>7} {'flat%':>6}  result")
    failures = sum(check(BUILD / 'kit', name, spec['target_lufs']) for name, spec in CONFIG['sounds'].items())
    for key in CONFIG['takes']['done']:
        failures += check(BUILD / 'takes', f'cs-done-{key}', CONFIG['sounds']['cs-done']['target_lufs'])
    print(f'\n{failures} failing')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    np.seterr(divide='ignore')
    main()
