"""
routes/chat.py
==============
POST /chat
  Accepts: application/json
    {
      story       : str          (the generated story text)
      story_type  : str          (genre key)
      language    : str          (english | hindi)
      profile     : dict         (user profile, optional)
      history     : list[dict]   ([{"role":"user"|"assistant","content":str}])
      message     : str          (current user message)
    }

  Returns: JSON
    {
      success : bool,
      reply   : str
    }
"""

from flask import Blueprint, request, jsonify
from core.config import CHAT_PERSONAS, build_user_context
from core.ai import chat_respond

chat_bp = Blueprint("chat", __name__)


def _build_chat_system(story_type: str, language: str, story: str, profile: dict) -> str:
    """Assemble the full system prompt for the narrator chat session."""
    persona    = CHAT_PERSONAS.get(story_type, CHAT_PERSONAS["kids"])
    user_ctx   = build_user_context(profile)
    lang_note  = "Always respond in Hindi (Devanagari script)." if language == "hindi" else ""

    return f"""{persona}

{lang_note}

You have just told the following story. Answer questions, explore what-ifs,
describe characters in more detail, or continue the story if asked.
Stay completely in character as your narrator persona at all times.

{user_ctx}

THE STORY:
{story}

Rules:
- Stay in character always
- Keep responses concise (2-5 sentences) unless the user asks for more
- If asked to continue the story, write 1-2 more paragraphs in your narrator style
- Make it feel like a live interactive storytelling session"""


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}

    story       = data.get("story", "")
    story_type  = data.get("story_type", "kids")
    language    = data.get("language", "english")
    profile     = data.get("profile", {})
    history     = data.get("history", [])
    user_msg    = data.get("message", "").strip()

    if not user_msg:
        return jsonify({"error": "No message provided"}), 400
    if not story:
        return jsonify({"error": "No story context — generate a story first"}), 400

    try:
        system = _build_chat_system(story_type, language, story, profile)
        reply  = chat_respond(system=system, history=history, user_message=user_msg)
        return jsonify({"success": True, "reply": reply})

    except Exception as e:
        err = str(e)
        if "quota" in err.lower() or "rate" in err.lower():
            return jsonify({"error": "Rate limit hit. Wait a moment."}), 429
        return jsonify({"error": f"Chat failed: {err}"}), 500
