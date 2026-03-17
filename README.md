# 📖 StoryWeaver AI

A lightweight Flask app that turns an uploaded image into a short story (and helps you chat with the storyteller). The backend uses **Gemini** to generate story text, and the frontend renders the experience with dynamic themes, animated scenes, and chat.

---

## ✅ Run locally (recommended for judging / review)

### 1) Create a Python virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Configure AI API (optional but recommended)

The app uses **Gemini (Google GenAI)**.

1. Create a key in Google AI Studio: https://aistudio.google.com/app/apikey
2. In `.env`:

```
GEMINI_API_KEY=your_key_here
```

> If you skip this step, the app will run with placeholder text (no AI calls).

### 4) Start the app

```bash
python app.py
```

Open http://localhost:5001 in your browser.

---

## 🧪 Run the tests

```bash
pytest -q
```

This will run the full test suite, including Gemini wrapper tests (mocked).

---

## 🗂️ Project structure (simplified)

- `run.py` - Flask app entrypoint
- `core/ai.py` - Gemini wrapper (text + vision + chat)
- `core/config.py` - story prompts, genres, helpers
- `routes/` - Flask routes (`/generate-story`, `/chat`, `/quick-questions`)
- `templates/index.html` + `static/` - frontend UI
- `tests/` - pytest cases

---

## ⚙️ Notes for judges

- **No external setup required** beyond Python and pip.
- App works offline (no API key) with placeholder text, so it can be evaluated without an API key.
- The UI is fully client-side and does not require additional build steps.

---

## 📌 Quick commands

```bash
# Run the app
python app.py

# Run tests
pytest -q
```
