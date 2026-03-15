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
from core.gemini import vision_generate, generate_scene_descriptions

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

    # ── Call Gemini ───────────────────────────────────────────────────────────
    try:
        image_bytes = file.read()
        mime_type   = get_mime(file.filename)

        # Build prompt with optional personalisation
        base_prompt = cfg["hi_prompt"] if language == "hindi" else cfg["en_prompt"]
        user_ctx    = build_user_context(profile)
        full_prompt = f"{user_ctx}\n\n{base_prompt}" if user_ctx else base_prompt

        # Generate story via Gemini Vision
        story_text = vision_generate(
            image_bytes=image_bytes,
            mime_type=mime_type,
            prompt=full_prompt,
            system=cfg["system"],
        )

        # Generate 4 animated scene descriptions
        scenes = generate_scene_descriptions(story_text, story_type)

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
        if "API_KEY" in err or "api key" in err.lower():
            return jsonify({"error": "Invalid/missing GEMINI_API_KEY. Get one free at aistudio.google.com"}), 401
        if "quota" in err.lower() or "rate" in err.lower():
            return jsonify({"error": "Rate limit hit. Wait a moment and try again."}), 429
        return jsonify({"error": f"Story generation failed: {err}"}), 500
