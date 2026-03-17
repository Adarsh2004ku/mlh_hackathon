"""
core/ai.py — FINAL CORRECT VERSION (NO 404, NO CRASH)

✔ Correct model (v1beta compatible)
✔ Retry fixed
✔ Multi-key rotation
✔ Stable production behavior
"""

import os
import json
import time
import itertools
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai
    from google.genai import types
    _GEMINI_AVAILABLE = True
except ImportError:
    genai = None
    types = None
    _GEMINI_AVAILABLE = False


# ✅ FINAL WORKING MODEL (DO NOT CHANGE)
VISION_MODEL = "gemini-2.5-flash"
TEXT_MODEL   = "gemini-2.5-flash"


_DEFAULT_SCENES = [
    "The story begins in a vivid setting",
    "Characters face an unexpected challenge",
    "A dramatic turning point changes everything",
    "The story reaches its powerful conclusion",
]


# ── LOAD KEYS ─────────────────────────

def _load_keys():
    keys = []

    for i in range(1, 11):
        key = os.environ.get(f"GEMINI_API_KEY_{i}", "").strip()
        if key:
            keys.append(key)

    plain = os.environ.get("GEMINI_API_KEY", "").strip()
    if plain and plain not in keys:
        keys.append(plain)

    return keys


_keys = _load_keys()
_key_cycle = itertools.cycle(_keys) if _keys else None

print(f"🔑 Keys Loaded: {len(_keys)}")
print(f"🤖 Using Model: {VISION_MODEL}")


# ── CLIENT ───────────────────────────

def _get_client():
    global _keys, _key_cycle

    if not _GEMINI_AVAILABLE:
        print("❌ Gemini SDK not installed")
        return None

    if not _key_cycle:
        print("❌ No API keys found in .env")
        return None

    return genai.Client(api_key=next(_key_cycle))


# ── RETRY (SAFE) ─────────────────────

def _call_with_retry(fn, retries=2):
    for attempt in range(retries):
        try:
            return fn()

        except Exception as e:
            err = str(e).lower()

            if "429" in err or "quota" in err:
                wait = 20 * (attempt + 1)
                print(f"🚫 Rate limit → wait {wait}s")
                time.sleep(wait)

            elif "404" in err:
                print("❌ MODEL ERROR — WRONG MODEL NAME")
                return "[Model error]"

            else:
                print("❌ Error:", e)
                return "[Error occurred]"

    return "[Rate limit exceeded]"


# ── MAIN FUNCTION ────────────────────

def generate_story_and_scenes(image_bytes, mime_type, story_prompt, system):
    client = _get_client()

    if client is None:
        return (
            "[API NOT CONFIGURED]",
            _DEFAULT_SCENES[:]
        )

    # reduce image size
    image_bytes = image_bytes[:500000]

    combined_prompt = f"""{story_prompt}

After the story output EXACTLY:
SCENES_JSON: ["scene1","scene2","scene3","scene4"]
"""

    def _call():
        c = _get_client()

        response = c.models.generate_content(
            model=VISION_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text=f"{system}\n\n{combined_prompt}"
                        ),
                        types.Part.from_bytes(
                            data=image_bytes,
                            mime_type=mime_type
                        ),
                    ],
                )
            ],
        )

        return response.text or ""

    raw = _call_with_retry(_call)

    if raw.startswith("["):
        return raw, _DEFAULT_SCENES[:]

    story = raw.strip()
    scenes = _DEFAULT_SCENES[:]

    if "SCENES_JSON:" in raw:
        try:
            story_part, json_part = raw.split("SCENES_JSON:", 1)
            story = story_part.strip()
            parsed = json.loads(json_part.strip().split("\n")[0])

            if isinstance(parsed, list):
                scenes = (parsed + _DEFAULT_SCENES)[:4]

        except:
            pass

    return story, scenes


# ── CHAT ────────────────────────────

def chat_respond(system, history, user_message):
    client = _get_client()

    if client is None:
        return "❌ API not configured"

    transcript = [f"SYSTEM:\n{system}", ""]

    for h in (history or [])[-10:]:
        role = "ASSISTANT" if h["role"] == "assistant" else "USER"
        transcript.append(f"{role}: {h['content']}")

    transcript.append(f"USER: {user_message}")

    def _call():
        c = _get_client()

        response = c.models.generate_content(
            model=TEXT_MODEL,
            contents="\n".join(transcript),
        )

        return response.text or ""

    return _call_with_retry(_call)