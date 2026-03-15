"""
tests/conftest.py
================
Pytest fixtures and configuration for testing.
"""

import pytest
import os
from dotenv import load_dotenv
from run import create_app
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