# CleanScape

An app that makes it easy for UAE residents to join community clean-ups, with **Earthy**, an AI helper you can type to, talk to, or show an item to.

Built for **HackGlobal 2026** (Polaris School of Technology, powered by Vultr). Track: **Civic and real-world impact**.

- Live demo: https://139-84-154-80.sslip.io (the same server as http://139.84.154.80). On a phone it opens the app in the browser, with nothing to install. On a computer it shows a code to scan, plus a preview of the screens.
- Earthy's voice and the camera scan need a phone, and the https address.
- This branch (`browser-demo`) was made after the submission deadline. See "After the deadline" below. `main` is the code as submitted.
- Architecture: [docs/architecture.png](docs/architecture.png)

![Architecture](docs/architecture.png)

## The problem

People want to help keep their neighbourhood clean but drop out over small unknowns: where do I go, what do I bring, is it safe in the heat, which bin does this go in. Organisers answer the same questions by hand.

## What it does

- Find and join clean-ups, check in with a QR pass, log bags, earn verified hours and Smileys rewards.
- Report litter, learn how to sort waste, host a clean-up.
- **Ask Earthy**: type a question and get a short, honest answer about sorting waste, heat safety and your next clean-up.
- **Talk to Earthy**: tap the mic and ask out loud. Earthy hears you, answers in a natural voice, then listens for your next question.
- **Show Earthy an item**: take a photo of something in your hand. Earthy says what it is, which bin it goes in, and what to do first.

## How we use Vultr

| Vultr product | What it does here |
| --- | --- |
| **Serverless Inference: chat** | Earthy's answers. `glm-5.3-flash` for typed chat, `deepseek-v4.1-flash-1017` for spoken answers because it replied fastest in our speed check. |
| **Serverless Inference: speech to text** | `whisper-large-v3-turbo` turns the spoken question into text. |
| **Serverless Inference: text to speech** | `qwen3-tts-12hz-1.7b` (voice "aiden") reads the answer aloud. |
| **Serverless Inference: vision** | `qwen3.8-flash-next` looks at the photo of an item and returns the item, the bin and a tip. |
| **Cloud Compute** | One small instance (Bangalore) hosts the Earthy server (FastAPI in Docker) and the public Ask Earthy web page. |

The phone app and the web page call the same server:

| Endpoint | What it does |
| --- | --- |
| `POST /api/chat` | Answers a question |
| `POST /api/transcribe` | Spoken question to text |
| `POST /api/speak` | Answer to voice |
| `POST /api/look` | Photo of an item to "what it is, which bin, a tip" |

To keep it quick, the server answers and voices the app's built-in questions once at start-up, so tapping one plays straight away.

## What is real and what is sample data

Honest scope, so nobody is misled:

- **Live:** everything on Earthy's screens in the app: typed chat, voice in, voice out and the photo scan. Each one calls a real model on Vultr. The web page has the typed chat.
- **Sample data:** events, the volunteer's pass, hours, Smileys and friends are demo data inside the app. There is no user database yet.
- **Scripted:** the other scan screens (bags, QR check-in, the waste lessons) and Earthy's tips elsewhere in the app are designed flows, not live AI.
- Earthy's knowledge of "your" clean-up, friends and hours is the same demo data, given to the model as context.
- Photos and voice recordings are sent to the server for one answer and are not stored.
- **Not built yet:** Arabic. The app is designed to be bilingual (English and Arabic), but this version is English only.
- Earthy is told not to invent facts. If the server is unreachable it says so instead of guessing.

## What existed before the hackathon, and what was built during it

- **Before:** the product idea, user research, the Figma designs, the design system and an earlier app prototype built from those designs. The organisers confirmed by call that this is fine as long as the submission is a fresh repository.
- **During HackGlobal (14 to 15 Nov 2026):** this repository, a rebuild of the app screens against the updated designs, the Earthy server, the Vultr deployment, and the live Earthy screens in the app: chat, voice and photo scan.

## After the deadline: the browser version (branch `browser-demo`)

Said plainly, so nobody is misled: the work on this branch was done on 15 Nov after the 12:00 IST deadline. `main` holds the submission as it was at the deadline.

- **Why:** the app was submitted as an Expo Go project. Expo Go on iPhone only opens a project for the Expo account that owns it, so nobody else's iPhone could run the demo. Android was not affected.
- **What changed:** the same app is also built for the browser and served by the Earthy server under `/app`. No screen was redesigned and no feature was added. The changes are the parts a browser does differently: recording and playing sound (`app/src/services/earthy-audio.web.ts`), sending a recording or a photo (`app/src/services/earthy-api.ts`), asking for the camera once (`app/src/app/earthy-show.tsx`), the front page, and the build script (`deploy/build-browser-app.sh`).
- **Notes for fixing problems:** the browser version sends short technical notes to the server log (which browser, whether sound could start, how a recording was packed). They never carry sound, a photo or what was said.
- **Tested:** in Chrome's engine, end to end, against a stand-in for Vultr Serverless Inference. Not tested by us on every phone browser.

## Repository layout

```
app/      Expo (React Native) phone app
server/   Earthy API + Ask Earthy web page (FastAPI, Docker)
deploy/   Step-by-step Vultr deploy guide, and the script that builds the app for the browser
docs/     Architecture diagram, submission checklist
```

## Run it

**Server**

```bash
cd server
cp .env.example .env      # add your Vultr Serverless Inference key and model
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000. To put it online, follow [deploy/deploy-on-vultr.md](deploy/deploy-on-vultr.md).

**App**

```bash
cd app
npm install
cp .env.example .env      # set EXPO_PUBLIC_EARTHY_API_URL to your server address
npx expo start            # scan the QR code with Expo Go
```

Without the address set, the app still runs and Earthy uses its scripted demo.

## Tech stack

React Native, Expo, expo-router, expo-audio, expo-camera, TypeScript · Python, FastAPI, Docker · Vultr Cloud Compute, Vultr Serverless Inference (chat, vision, speech to text, text to speech)

## Team

- Nitin Bahukhandi (design and build)

## Credits

- Server and deploy guide adapted from the [HackGlobal starter kit](https://github.com/shubhamupadhyay-pixel/hackglobal-starter) (MIT).
- Built with help from AI coding tools (Claude).
- EEG (Emirates Environmental Group) is the intended community partner; this is a hackathon prototype, not an official EEG product.

## License

MIT. See [LICENSE](LICENSE).
