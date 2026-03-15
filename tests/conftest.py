"""
tests/conftest.py
================
Pytest fixtures and configuration for testing.
"""

import pytest
import os
import sys
from pathlib import Path

# Ensure the project root is on sys.path so tests can import application modules
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
from app import create_app
from config import TestingConfig

# Load test environment
load_dotenv()

@pytest.fixture
def app():
    """Create and configure a test app instance."""
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()