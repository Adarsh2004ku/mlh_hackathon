"""
routes/misc.py
==============
Miscellaneous routes:
  GET  /                  → serve the main HTML page
  GET  /quick-questions   → return genre-specific suggested chat questions
"""

from flask import Blueprint, render_template, request, jsonify
from core.config import QUICK_QUESTIONS

misc_bp = Blueprint("misc", __name__)


@misc_bp.route("/")
def index():
    return render_template("index.html")


@misc_bp.route("/quick-questions")
def quick_questions():
    genre = request.args.get("genre", "kids")
    return jsonify(QUICK_QUESTIONS.get(genre, QUICK_QUESTIONS["kids"]))
