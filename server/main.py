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
import tempfile
import threading

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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
- Friends going: Maya and Omar. Omar has a carpool with 2 seats leaving JLT at 6:30 AM.
- So far: 14 volunteering hours across 6 clean-ups, 1,240 Smileys.
- Smileys are reward points earned by joining clean-ups, logging bags and sorting waste correctly.
""".strip()

SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", EARTHY_CONTEXT)

# Speech to text runs on this server (Vultr Cloud Compute) with the open-source Whisper model.
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
        "speech_model": WHISPER_MODEL,
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
    return {"text": text, "language": language}


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
