#!/bin/sh
# Rebuilds every sound and generated file from sounds.json. The .m4a step needs macOS.
# First run: python3 -m venv tools/synth/.venv && tools/synth/.venv/bin/pip install -r tools/synth/requirements.txt
set -e
cd "$(dirname "$0")/../.."
PY=tools/synth/.venv/bin/python
rm -rf tools/synth/.build
$PY tools/synth/synth.py
for wav in tools/synth/.build/*/*.wav; do
  afconvert -f m4af -d aac -b 96000 "$wav" "${wav%.wav}.m4a"
done
$PY tools/synth/check_loudness.py
rm -f assets/sounds/*.wav assets/sounds/*.m4a assets/sounds/*.ogg assets/haptics/*
cp tools/synth/.build/kit/* assets/sounds/
$PY tools/synth/generate.py
