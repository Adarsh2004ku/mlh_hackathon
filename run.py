"""
╔══════════════════════════════════════════════════╗
║         StoryWeaver AI — Modular Edition         ║
║         100% FREE · Google Gemini 1.5 Flash      ║
╠══════════════════════════════════════════════════╣
║  Setup:                                          ║
║    pip install flask google-generativeai         ║
║    export GEMINI_API_KEY=your_key                ║
║    python run.py                                 ║
║    → http://localhost:5000                       ║
╚══════════════════════════════════════════════════╝

Project Structure:
  run.py                  ← Entry point (YOU ARE HERE)
  core/
    config.py             ← Story configs, personas, genre meta
    gemini.py             ← Gemini AI wrapper functions
  routes/
    story.py              ← /generate-story  route
    chat.py               ← /chat route
    misc.py               ← / and /quick-questions routes
  templates/
    index.html            ← Main HTML page
  static/
    css/
      style.css           ← All CSS + 5 dynamic themes
    js/
      themes.js           ← Canvas background animations
      canvas-art.js       ← Scene illustrations (20 total)
      app.js              ← Main app controller
      chat.js             ← Interactive story chat
"""

from flask import Flask
from routes.story import story_bp
from routes.chat import chat_bp
from routes.misc import misc_bp
import os
import logging
from dotenv import load_dotenv
from config import get_config

# Load environment variables from .env file
load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__)
    config_class = get_config(config_name)
    app.config.from_object(config_class)

    # Configure logging
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        app.logger.setLevel(logging.INFO)
    else:
        logging.basicConfig(level=logging.DEBUG)
        app.logger.setLevel(logging.DEBUG)

    # Register blueprints (modular routes)
    app.register_blueprint(misc_bp)
    app.register_blueprint(story_bp)
    app.register_blueprint(chat_bp)

    return app


if __name__ == '__main__':
    print("\n" + "=" * 52)
    print("  StoryWeaver AI — Modular Edition")
    print("=" * 52)
    print("  🔑 FREE key: aistudio.google.com/app/apikey")
    print("  🌐 Open:     http://localhost:5001")
    print("=" * 52 + "\n")

    if not os.environ.get("GEMINI_API_KEY"):
        print("  ⚠  WARNING: GEMINI_API_KEY not set!")
        print("     export GEMINI_API_KEY=AIza...\n")

    app = create_app()
    app.run(debug=True, port=5001)
else:
    # For Vercel deployment
    app = create_app()
