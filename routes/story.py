"""
routes/story.py
===============
POST /generate-story
  Accepts: multipart/form-data
    - image        : image file (required)
    - story_type   : kids | funny | fantasy | horror | scifi
    - language     : english | hindi
    - profile      : JSON string of user profile (optional)

  Returns: JSON
    {
      success      : bool,
      story        : str,
      story_type   : str,
      language     : str,
      narrator     : str,
      emoji        : str,
      scenes       : list[str]   (4 scene descriptions)
    }
"""

import json
from flask import Blueprint, request, jsonify
from core.config import (
    STORY_CONFIGS,
    allowed_file,
    get_mime,
    build_user_context,
)
# ✅ Now imports generate_story_and_scenes (1 call) instead of
#    vision_generate + generate_scene_descriptions (2 calls)
from core.ai import generate_story_and_scenes

story_bp = Blueprint("story", __name__)


@story_bp.route("/generate-story", methods=["POST"])
def generate_story():
    # ── Validate input ────────────────────────────────────────────────────────
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file        = request.files["image"]
    story_type  = request.form.get("story_type", "kids")
    language    = request.form.get("language", "english")
    profile_raw = request.form.get("profile", "{}")

    try:
        profile = json.loads(profile_raw)
    except Exception:
        profile = {}

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Use PNG, JPG, WEBP, or GIF."}), 400

    cfg = STORY_CONFIGS.get(story_type, STORY_CONFIGS["kids"])

    # ── Single API call — story + scenes together ─────────────────────────────
    try:
        image_bytes = file.read()
        mime_type   = get_mime(file.filename)

        base_prompt = cfg["hi_prompt"] if language == "hindi" else cfg["en_prompt"]
        user_ctx    = build_user_context(profile)
        full_prompt = f"{user_ctx}\n\n{base_prompt}" if user_ctx else base_prompt

        # ✅ ONE call instead of TWO
        story_text, scenes = generate_story_and_scenes(
            image_bytes=image_bytes,
            mime_type=mime_type,
            story_prompt=full_prompt,
            system=cfg["system"],
        )

        return jsonify({
            "success":    True,
            "story":      story_text,
            "story_type": story_type,
            "language":   language,
            "narrator":   cfg["narrator"],
            "emoji":      cfg["emoji"],
            "scenes":     scenes,
        })

    except Exception as e:
        err = str(e)
        if any(x in err.lower() for x in ["api_key", "api key", "invalid", "unauthorized", "401"]):
            return jsonify({"error": "Invalid/missing API key. Check your .env file."}), 401
        if any(x in err.lower() for x in ["429", "quota", "rate_limit", "rate limit", "too many"]):
            return jsonify({"error": "Rate limit hit. The app will auto-retry — please wait 20s and try again."}), 429
        return jsonify({"error": f"Story generation failed: {err}"}), 500