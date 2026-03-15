# 📖 StoryWeaver AI

A lightweight Flask app that turns an uploaded image into a short story (and helps you chat with the storyteller). The backend uses OpenAI to generate story text, and the frontend renders the experience with dynamic themes, animated scenes, and chat.

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

### 3) Configure OpenAI (optional but recommended)

Create `.env` from the example and paste your key:

```bash
cp .env.example .env
```

Then edit `.env` and set `OPENAI_API_KEY=sk-...`.

> If you don't set a key, the app will still start, but story/chat responses will be placeholder text.

### 4) Start the app

```bash
python run.py
```

Open http://localhost:5001 in your browser.

---

## 🧪 Run the tests

```bash
pytest -q
```

This will run the full test suite, including OpenAI wrapper tests (mocked).

---

## 🗂️ Project structure (simplified)

- `run.py` - Flask app entrypoint
- `core/ai.py` - OpenAI wrapper (text + vision + chat)
- `core/config.py` - story prompts, genres, helpers
- `routes/` - Flask routes (`/generate-story`, `/chat`, `/quick-questions`)
- `templates/index.html` + `static/` - frontend UI
- `tests/` - pytest cases

---

## ⚙️ Notes for judges

- **No external setup required** beyond Python and pip.
- App works offline (no API key) with placeholder text, so it can be evaluated without a paid OpenAI key.
- The UI is fully client-side and does not require additional build steps.

---

## 📌 Quick commands

```bash
# Run the app
python run.py

# Run tests
pytest -q
```
