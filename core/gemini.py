"""
core/gemini.py
==============
Thin wrapper around the Google Generative AI SDK.
All direct Gemini API calls live here — routes never touch the SDK directly.
"""

import os
import json
import google.genai as genai

VISION_MODEL = "gemini-1.5-flash"   # supports image + text, free tier
TEXT_MODEL   = "gemini-1.5-flash"   # fast text generation


def _get_client():
    """Get Gemini client with API key."""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set. Get one at https://aistudio.google.com/app/apikey")
    return genai.Client(api_key=api_key)


# ── Core call helpers ─────────────────────────────────────────────────────────

def vision_generate(image_bytes: bytes, mime_type: str, prompt: str, system: str) -> str:
    """
    Send an image + text prompt to Gemini Vision.
    Returns the generated text response.
    """
    client = _get_client()
    response = client.models.generate_content(
        model=VISION_MODEL,
        contents=[
            {"parts": [
                {"text": system + "\n\n" + prompt},
                {"inline_data": {"mime_type": mime_type, "data": image_bytes}}
            ]}
        ]
    )
    return response.text


def text_generate(prompt: str, system: str = "You are a helpful assistant.") -> str:
    """
    Send a text-only prompt to Gemini.
    Returns the generated text response.
    """
    client = _get_client()
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=system + "\n\n" + prompt
    )
    return response.text


def chat_respond(
    system: str,
    history: list[dict],   # [{"role": "user"|"assistant", "content": str}]
    user_message: str,
) -> str:
    """
    Continue a multi-turn chat session with Gemini.
    history entries use "user" / "assistant" roles (converted to Gemini's "user"/"model").
    Returns the assistant's reply text.
    """
    client = _get_client()
    # Convert history to Gemini format
    contents = []
    for h in history[-10:]:  # cap context window
        role = "user" if h["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": h["content"]}]})

    # Add system and current message
    contents.insert(0, {"role": "user", "parts": [{"text": system}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=contents
    )
    return response.text


# ── Higher-level task helpers ─────────────────────────────────────────────────

def generate_scene_descriptions(story_text: str, story_type: str) -> list[str]:
    """
    Ask Gemini to produce 4 short scene descriptions for canvas animations.
    Returns a list of 4 strings (falls back to defaults on parse error).
    """
    prompt = (
        f"For this {story_type} story, create exactly 4 short scene descriptions "
        f"(8-12 words each) for animated illustrations. "
        f"Return ONLY a valid JSON array of 4 strings — no markdown, no extra text.\n"
        f"Story: {story_text[:600]}"
    )
    raw = text_generate(prompt)
    clean = raw.strip().replace("```json", "").replace("```", "").strip()
    try:
        scenes = json.loads(clean)
        return scenes[:4]
    except Exception:
        return [
            "The story begins in a vivid setting",
            "Characters face an unexpected challenge",
            "A dramatic turning point changes everything",
            "The story reaches its powerful conclusion",
        ]
