"""
config.py
=========
Flask application configuration settings.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = False
    TESTING = False

    # Flask settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB for image uploads

    # Gemini API
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

    # App settings
    APP_NAME = 'StoryWeaver AI'

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SECRET_KEY = 'dev-secret-key'

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True
    SECRET_KEY = 'test-secret-key'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Get configuration class based on environment."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV') or 'development'
    return config.get(config_name, config['default'])