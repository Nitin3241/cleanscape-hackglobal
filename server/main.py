"""Earthy: the AI assistant behind CleanScape (FastAPI backend + a small web page).

Built during HackGlobal 2026 on top of the HackGlobal starter kit's chat-app template.
The CleanScape mobile app calls POST /api/chat; the web page at / is the live demo.

Run locally:
    pip install -r requirements.txt
    cp .env.example .env   # then add your key
    uvicorn main:app --reload
Open http://localhost:8000
"""
import os
import re
import tempfile
import threading
import uuid
from collections import OrderedDict

import httpx

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv()

# Works with any OpenAI-compatible provider. In production this points at Vultr Serverless Inference.
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.vultrinference.com/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "")

# What Earthy knows. This is demo data: the same sample user and event the app shows.
EARTHY_CONTEXT = """
You are Earthy, the assistant inside CleanScape, an app for community clean-ups in the UAE,
run with the Emirates Environmental Group (EEG).

How you answer
- Short and plain: 1 to 3 sentences, no markdown, no emojis, no lists unless asked.
- Reply in the language the person writes in (English or Arabic).
- Only help with clean-ups, sorting waste, getting to an event, safety on the day, Smileys rewards
  and volunteering hours. For anything else, say it is outside what you can help with.
- Never invent event details, rules or numbers. If you are not sure, say so and suggest asking the
  organiser. Do not guess.
- Safety first. In UAE heat: drink water often, rest in shade, stop if dizzy and tell the team lead.
  For an emergency say to call 999. You are not a doctor and do not give medical advice.
- Hazards (broken glass, needles, chemicals, oil containers): do not touch, tell the crew lead.

Sorting rules for Dubai (general guidance)
- Clean and dry recyclables (plastic bottles, cans, paper, cardboard) go in the green bin.
  Empty and rinse bottles; caps can stay on.
- Food waste and food-soiled items (for example the greasy base of a pizza box) go in the black bin.
  A clean pizza box lid can go in the green bin.
- Glass, e-waste, batteries and textiles go to a drop-off point, not the home bins.
- Reverse vending machines take plastic bottles and drink cans, one by one, not squashed.

Demo data for the signed-in user (sample data, not a real person)
- Name: Sara Al Mansoori. Lives in Al Karama, Dubai. Class: Grade 9B, Al Barsha School.
- Next clean-up: Kite Beach clean-up, Saturday 5 December, 7 to 10 AM, Umm Suqeim.
  Arrive by 6:45 AM for a 10-minute safety briefing. Her school bus leaves Al Barsha School at 6:15 AM.
- What to bring: a 1 litre water bottle, hat and sunscreen, closed shoes. Gloves and bags are provided.
- Forecast for that Saturday morning: sunny, up to 38°C.
- Friends going: Maya and Omar. Omar has a carpool with 2 seats leaving JLT at 6:30 AM.
- So far: 14 volunteering hours across 6 clean-ups, 1,240 Smileys.
- Smileys are reward points earned by joining clean-ups, logging bags and sorting waste correctly.
""".strip()

SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", EARTHY_CONTEXT)

# Voice, both ways, on Vultr Serverless Inference (the audio routes follow the OpenAI shapes):
# speech to text with Whisper Large V3 Turbo, and text to speech for Earthy's own voice.
STT_MODEL = os.getenv("STT_MODEL", "whisper-large-v3-turbo")
# Earthy's voice is "aiden" on Qwen3 TTS (chosen by Nitin, 14 Nov). That model has no Arabic, so an Arabic
# answer is read by Chatterbox's default voice instead.
TTS_MODEL = os.getenv("TTS_MODEL", "qwen3-tts-12hz-1.7b")
TTS_VOICE = os.getenv("TTS_VOICE", "aiden")  # empty: pick the first voice Vultr lists for the model
ARABIC_TTS_MODEL = os.getenv("ARABIC_TTS_MODEL", "chatterbox")
ARABIC_TTS_VOICE = os.getenv("ARABIC_TTS_VOICE", "default")
ARABIC = re.compile("[\u0600-\u06FF]")
_audio: "OrderedDict[str, tuple[bytes, str]]" = OrderedDict()  # spoken answers waiting to be played
_audio_lock = threading.Lock()
_voice: str | None = None

# Fallback speech to text on this server itself (Vultr Cloud Compute) with a small open-source Whisper,
# used only if the hosted model can't be reached.
# "base" fits a 1 GB server. On a bigger server set WHISPER_MODEL=small for better Arabic.
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
VOICE_LANGUAGES = ("en", "ar")  # the app's two languages
MAX_AUDIO_BYTES = 8 * 1024 * 1024  # about a minute of phone audio is well under this
_whisper = None
_whisper_lock = threading.Lock()


def get_whisper():
    """Loads the speech model once, on first use, and keeps it in memory."""
    global _whisper
    with _whisper_lock:
        if _whisper is None:
            from faster_whisper import WhisperModel

            _whisper = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        return _whisper

app = FastAPI(title="Earthy for CleanScape")

# The mobile app (Expo) calls this API from another origin, so allow cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    messages: list[Message]


@app.get("/")
def home():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "index.html"))


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": LLM_MODEL,
        "configured": bool(LLM_API_KEY and LLM_MODEL),
        "hearing_model": STT_MODEL,
        "voice_model": TTS_MODEL,
    }


@app.post("/api/transcribe")
def transcribe(audio: UploadFile = File(...)):
    """Turns a short voice recording into text. Returns {"text": "...", "language": "en" | "ar"}."""
    data = audio.file.read(MAX_AUDIO_BYTES + 1)
    if not data:
        raise HTTPException(400, "The recording is empty.")
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(413, "The recording is too long.")
    suffix = os.path.splitext(audio.filename or "")[1] or ".m4a"
    # First choice: the hosted Whisper model on Vultr Serverless Inference.
    if LLM_API_KEY:
        try:
            client = OpenAI(base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=40)
            heard = client.audio.transcriptions.create(
                model=STT_MODEL, file=(f"question{suffix}", data, audio.content_type or "audio/m4a")
            )
            text = (getattr(heard, "text", "") or "").strip()
            # One line per voice question in `docker logs earthy`, to see what was heard (sizes only, no audio kept).
            print(f"Heard {len(data)} bytes ({suffix}) with {STT_MODEL}: {text!r}", flush=True)
            return {"text": text, "language": "ar" if ARABIC.search(text) else "en", "engine": STT_MODEL}
        except Exception as e:
            print(f"Hosted speech to text failed, using the local model: {e}", flush=True)
    with tempfile.NamedTemporaryFile(suffix=suffix) as clip:
        clip.write(data)
        clip.flush()
        try:
            model = get_whisper()
            segments, info = model.transcribe(clip.name, vad_filter=True, beam_size=5)
            language = info.language
            if language not in VOICE_LANGUAGES:
                # A short clip can be mistaken for another language. Keep to the app's two.
                scores = dict(info.all_language_probs or [])
                language = max(VOICE_LANGUAGES, key=lambda code: scores.get(code, 0.0))
                segments, info = model.transcribe(clip.name, vad_filter=True, beam_size=5, language=language)
            text = " ".join(segment.text.strip() for segment in segments).strip()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(502, f"Could not read the recording: {e}")
    print(f"Heard {len(data)} bytes ({suffix}) with local Whisper: {text!r}", flush=True)
    return {"text": text, "language": language, "engine": f"local-whisper-{WHISPER_MODEL}"}


def _auth() -> dict:
    return {"Authorization": f"Bearer {LLM_API_KEY}"}


def _voices_raw(model: str):
    """Vultr's list of voices for one speech model. The error text is kept, so a wrong request is easy to see."""
    response = httpx.get(f"{LLM_BASE_URL}/audio/voices", headers=_auth(), params={"model": model}, timeout=20)
    if response.status_code != 200:
        raise RuntimeError(f"{response.status_code}: {response.text[:300]}")
    return response.json()


def _find_voices(node, found: list) -> None:
    """Collects voice ids from whatever shape the voices list comes back in."""
    if isinstance(node, dict):
        voice = node.get("voice_id") or node.get("id") or node.get("name")
        if isinstance(voice, str) and not any(isinstance(v, (dict, list)) for v in node.values()):
            found.append((voice, str(node)))
        for value in node.values():
            _find_voices(value, found)
    elif isinstance(node, list):
        for item in node:
            if isinstance(item, str):
                found.append((item, item))
            else:
                _find_voices(item, found)


def pick_voice() -> str:
    """TTS_VOICE if set, otherwise the first voice listed for the speech model. Empty if none is listed."""
    global _voice
    if TTS_VOICE:
        return TTS_VOICE
    if _voice is None:
        found: list = []
        try:
            _find_voices(_voices_raw(TTS_MODEL), found)
        except Exception as e:
            print(f"Could not list voices: {e}", flush=True)
        _voice = ([voice for voice, _ in found if voice.lower() not in NOT_SPEAKERS] or [""])[0]
    return _voice


NOT_SPEAKERS = {
    "clone", "design", "arabic", "danish", "german", "greek", "english", "spanish", "finnish", "french", "hebrew",
    "hindi", "italian", "japanese", "korean", "malay", "dutch", "norwegian", "polish", "portuguese", "russian",
    "swedish", "swahili", "turkish", "chinese",
}
TTS_MODELS = ("chatterbox", "qwen3-tts-12hz-1.7b")  # the paid speech models on Vultr Serverless Inference


class SpeakRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1200)
    # Only the voice-picker page sends these two, to try a voice before it is chosen.
    voice: str | None = Field(default=None, max_length=120)
    model: str | None = Field(default=None, max_length=120)


@app.get("/voices")
def voices_page():
    """A page for listening to each voice and choosing Earthy's."""
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "voices.html"))


@app.get("/api/voice-list")
def voice_list():
    """Every (model, voice) pair on offer, in one flat list for the voice-picker page."""
    if not LLM_API_KEY:
        raise HTTPException(500, "LLM_API_KEY is not set.")
    pairs, notes = [], []
    for model in TTS_MODELS:
        found: list = []
        try:
            _find_voices(_voices_raw(model), found)
        except Exception as e:
            notes.append(f"{model}: {e}")
        seen = set()
        for voice, _ in found:
            # Vultr's list mixes speakers with language names and with "clone" and "design", which need a
            # recording or a description to work. Only real, ready-made speakers are offered.
            if voice.lower() in NOT_SPEAKERS:
                continue
            if voice not in seen:
                seen.add(voice)
                pairs.append({"model": model, "voice": voice})
        if not seen:
            # The list couldn't be read: the model can still be tried with its own default voice.
            pairs.append({"model": model, "voice": ""})
    return {"in_use": {"model": TTS_MODEL, "voice": pick_voice()}, "voices": pairs, "notes": notes}


@app.get("/api/voices")
def voices():
    """For setup: shows the speech model, the voice in use and every voice Vultr offers."""
    if not LLM_API_KEY:
        raise HTTPException(500, "LLM_API_KEY is not set.")
    offered = {}
    for model in TTS_MODELS:
        try:
            offered[model] = _voices_raw(model)
        except Exception as e:
            offered[model] = f"Could not list voices: {e}"
    return {"speech_model": TTS_MODEL, "voice_in_use": pick_voice(), "offered": offered}


@app.post("/api/speak")
def speak(req: SpeakRequest):
    """Turns Earthy's answer into speech on Vultr and returns where to play it: {"url": "/api/audio/<id>"}."""
    if not LLM_API_KEY:
        raise HTTPException(500, "LLM_API_KEY is not set.")
    if req.model or req.voice:  # the voice-picker page trying a voice
        model, voice = req.model or TTS_MODEL, req.voice or pick_voice()
    elif ARABIC.search(req.text):
        model, voice = ARABIC_TTS_MODEL, ARABIC_TTS_VOICE
    else:
        model, voice = TTS_MODEL, pick_voice()
    body = {"model": model, "input": req.text.strip(), "response_format": "mp3"}
    if voice:
        body["voice"] = voice
    try:
        response = httpx.post(f"{LLM_BASE_URL}/audio/speech", headers=_auth(), json=body, timeout=60)
    except Exception as e:
        raise HTTPException(502, f"Speech request failed: {e}")
    kind = response.headers.get("content-type", "")
    if response.status_code != 200 or not response.content or kind.startswith("application/json"):
        raise HTTPException(502, f"Speech request failed ({response.status_code}): {response.text[:300]}")
    clip = uuid.uuid4().hex
    with _audio_lock:
        _audio[clip] = (response.content, kind if kind.startswith("audio/") else "audio/mpeg")
        while len(_audio) > 40:  # keep only the most recent answers in memory
            _audio.popitem(last=False)
    return {"url": f"/api/audio/{clip}", "voice": voice, "model": model}


@app.get("/api/audio/{clip}")
def audio_clip(clip: str):
    with _audio_lock:
        found = _audio.get(clip)
    if not found:
        raise HTTPException(404, "That answer is no longer available.")
    return Response(content=found[0], media_type=found[1])


@app.post("/api/chat")
def chat(req: ChatRequest):
    if not LLM_API_KEY or not LLM_MODEL:
        raise HTTPException(500, "LLM_API_KEY or LLM_MODEL is not set. Add them to your .env file.")
    turns = [m for m in req.messages if m.role in ("user", "assistant") and m.content.strip()]
    if not turns or turns[-1].role != "user":
        raise HTTPException(400, "Send at least one user message, last.")
    client = OpenAI(base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=30)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [m.model_dump() for m in turns[-12:]]  # keep the last 12 turns
    try:
        result = client.chat.completions.create(
            model=LLM_MODEL, messages=messages, temperature=0.3, max_tokens=900
        )
    except Exception as e:  # show the provider's error so it's easy to debug
        raise HTTPException(502, f"LLM request failed: {e}")
    reply = (result.choices[0].message.content or "").strip()
    if not reply:
        raise HTTPException(502, "The model returned an empty answer.")
    return {"reply": reply}
