"""Loudness measures shared by the synth and the check script.

Standard integrated LUFS (ITU-R BS.1770) needs at least 400 ms of audio, and most of these
sounds are shorter. So "active loudness" uses the same K-weighting and scale, but averages
over the part of the sound that is actually audible: 100 ms windows within 20 dB of the
loudest one. That is what the spec means by "LUFS-equivalent".
"""
import numpy as np
from scipy.signal import lfilter


def k_weight(signal):
    """The BS.1770 K-weighting filters, with the published 48 kHz coefficients."""
    shelf = lfilter(
        [1.53512485958697, -2.69169618940638, 1.19839281085285],
        [1.0, -1.69065929318241, 0.73248077421585],
        signal,
    )
    return lfilter([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621], shelf)


def active_loudness(signal, rate=48000):
    # Padded with silence, so the filters ring out and even a 55 ms tap fills a window.
    padded = np.concatenate([signal, np.zeros(int(0.1 * rate))])
    power = k_weight(padded) ** 2
    window = int(0.1 * rate)
    blocks = np.convolve(power, np.ones(window) / window, mode='valid')
    audible = blocks[blocks >= blocks.max() * 0.01]
    return -0.691 + 10 * np.log10(audible.mean())


def peak_dbfs(signal):
    return 20 * np.log10(np.max(np.abs(signal)))
