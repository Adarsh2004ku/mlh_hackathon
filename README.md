# 📖 StoryWeaver AI

AI-powered image-to-story app · OpenAI GPT-4o Mini

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Get your OpenAI API key
#    → https://platform.openai.com/api-keys

# 3. Set the key
cp .env.example .env          # then paste your key inside
# OR just:
export OPENAI_API_KEY=sk-...

# 4. Deploy to Vercel
#    → https://vercel.com
#    Connect your GitHub repo and deploy
#    Set OPENAI_API_KEY in Vercel environment variables
```

---

## 📁 Project Structure

```
storyweaver/
│
├── run.py                  ← Entry point — creates Flask app, registers blueprints
│
├── config.py               ← Flask configuration settings
│
├── core/                   ← Business logic (no Flask here)
│   ├── __init__.py
│   ├── config.py           ← Story configs, personas, quick questions, helpers
│   └── ai.py               ← All OpenAI calls (vision, text, chat)
│
├── routes/                 ← Flask route handlers (blueprints)
│   ├── __init__.py
│   ├── misc.py             ← GET /  and  GET /quick-questions
│   ├── story.py            ← POST /generate-story
│   └── chat.py             ← POST /chat
│
├── templates/
│   └── index.html          ← Single-page HTML (loads CSS + JS from static/)
│
├── static/
│   ├── css/
│   │   └── style.css       ← All styles + 5 dynamic themes (CSS variables)
│   └── js/
│       ├── themes.js       ← Canvas background animations per genre
│       ├── canvas-art.js   ← 20 animated scene illustrations (4 per genre)
│       ├── app.js          ← Main app controller (profile, upload, story, narration)
│       └── chat.js         ← Interactive story Q&A chat
│
├── tests/
│   ├── __init__.py
│   └── conftest.py         ← Pytest fixtures
│
├── requirements.txt
├── .env.example
├── .gitignore
└── vercel.json             ← Vercel deployment config
```

---

## 🎨 Features

| Feature | Details |
|---------|---------|
| 👤 User Profile | Name · Age · Gender · Mood · Favourite thing |
| 🖼️ Image Upload | Drag & drop or browse — PNG/JPG/WEBP/GIF up to 16MB |
| 🎭 5 Story Genres | Kids 🌟 · Funny 😂 · Fantasy ✨ · Horror 🕷️ · Sci-Fi 🚀 |
| 🌈 Dynamic Themes | Full UI transforms per genre (colors, fonts, background particles) |
| ⌨️ Typewriter | Letter-by-letter story reveal with punctuation pacing |
| 🎬 Animated Scenes | 4 canvas-drawn animated illustrations per story |
| 💬 Interactive Chat | Ask the narrator anything · Multi-turn · Genre-matched persona |
| 🎙️ Voice Narration | Web Speech API · English & Hindi · Speed control |
| 🇮🇳 Hindi Support | Full story + chat in Hindi |

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/` | Main UI |
| `POST` | `/generate-story` | Generate story from image + profile |
| `POST` | `/chat` | Interactive story Q&A with narrator |
| `GET`  | `/quick-questions?genre=<g>` | Suggested chat questions |

---

## 💰 Cost

Pay-per-use with OpenAI:
- **GPT-4o Mini** — ~$0.15 per 1K tokens · Vision calls cost more
- **Web Speech API** — built into the browser, zero cost
- **Canvas animations** — pure JavaScript, no external services
