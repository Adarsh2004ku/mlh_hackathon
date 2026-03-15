"""
╔══════════════════════════════════════════════════╗
║         StoryWeaver AI — Modular Edition         ║
║         OpenAI GPT-4o Mini                      ║
╠══════════════════════════════════════════════════╣
║  Setup:                                          ║
║    pip install -r requirements.txt               ║
║    export OPENAI_API_KEY=your_key                ║
║    python run.py                                 ║
║    → http://localhost:5000                       ║
╚══════════════════════════════════════════════════╝

Project Structure:
  run.py                  ← Entry point (YOU ARE HERE)
  core/
    config.py             ← Story configs, personas, genre meta
    ai.py                 ← OpenAI wrapper functions
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

    if not os.environ.get("OPENAI_API_KEY"):
        print("  ⚠  WARNING: OPENAI_API_KEY not set!")
        print("     export OPENAI_API_KEY=sk-...\n")

    app = create_app()
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
else:
    # For Vercel deployment
    app = create_app()
