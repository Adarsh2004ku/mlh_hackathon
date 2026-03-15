"""
core/ai.py
==========
Thin wrapper around the OpenAI API.
All direct OpenAI API calls live here — routes never touch the SDK directly.
"""

import os
import json
import base64

# Try importing the OpenAI client. If it's not available, we still keep the app working
# by using fallback stub responses (no external dependency required).
try:
    from openai import OpenAI  # type: ignore
    _OPENAI_AVAILABLE = True
except ImportError:  # pragma: no cover
    OpenAI = None  # type: ignore
    _OPENAI_AVAILABLE = False

VISION_MODEL = "gpt-4o-mini"   # supports image + text, cost-effective
TEXT_MODEL   = "gpt-4o-mini"   # fast text generation


def _get_client():
    """Return an OpenAI client if configured, otherwise None."""
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key or not _OPENAI_AVAILABLE:
        return None
    return OpenAI(api_key=api_key)


# ── Core call helpers ─────────────────────────────────────────────────────────

def vision_generate(image_bytes: bytes, mime_type: str, prompt: str, system: str) -> str:
    """Send an image + text prompt to OpenAI Vision (with fallback)."""
    client = _get_client()

    if client is None:
        # Fallback when OpenAI isn't configured: return a safe placeholder.
        return (
            "[OpenAI not configured] This would normally be a story generated from the image. "
            "Set OPENAI_API_KEY to get real results."
        )

    # Convert image to base64
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
    image_url = f"data:{mime_type};base64,{image_b64}"

    response = client.chat.completions.create(
        model=VISION_MODEL,
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        max_tokens=1000,
    )
    return response.choices[0].message.content


def text_generate(prompt: str, system: str = "You are a helpful assistant.") -> str:
    """Send a text-only prompt to OpenAI (with fallback)."""
    client = _get_client()
    if client is None:
        return "[OpenAI not configured] This is a placeholder response."

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
    )
    return response.choices[0].message.content


def chat_respond(
    system: str,
    history: list[dict],   # [{"role": "user"|"assistant", "content": str}]
    user_message: str,
) -> str:
    """
    Continue a multi-turn chat session with OpenAI.
    Returns the assistant's reply text.
    """
    client = _get_client()

    if client is None:
        return "[OpenAI not configured] (chat responses are unavailable without an API key.)"

    messages = [{"role": "system", "content": system}]

    # Add history
    for h in history[-10:]:  # cap context window
        role = "assistant" if h["role"] == "assistant" else "user"
        messages.append({"role": role, "content": h["content"]})

    # Add current message
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=messages,
        max_tokens=1000,
    )
    return response.choices[0].message.content


# ── Higher-level task helpers ─────────────────────────────────────────────────

def generate_scene_descriptions(story_text: str, story_type: str) -> list[str]:
    """
    Ask OpenAI to produce 4 short scene descriptions for canvas animations.
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
