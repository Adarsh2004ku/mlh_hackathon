"""tests/test_openai_integration.py
=========================

Tests that the OpenAI wrapper in `core/ai.py` calls the OpenAI SDK correctly.
"""

from unittest.mock import MagicMock, patch

import pytest

from core import ai


def test_text_generate_uses_openai_client(monkeypatch):
    """Ensure text_generate calls OpenAI.chat.completions.create and returns content."""

    # Arrange: set a fake API key and patch OpenAI to return a mock client.
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="hello"))]

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = mock_response

    with patch("core.ai.OpenAI", return_value=mock_client) as mock_openai:
        # Act
        result = ai.text_generate("Hi there", system="You are a helpful assistant.")

        # Assert
        assert result == "hello"
        mock_openai.assert_called_once_with(api_key="sk-test")
        mock_client.chat.completions.create.assert_called_once()


def test_get_client_returns_none_without_api_key(monkeypatch):
    """_get_client should return None if OPENAI_API_KEY is missing."""
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    assert ai._get_client() is None


def test_text_generate_fallback_without_api_key(monkeypatch):
    """text_generate should return a placeholder when OpenAI is not configured."""
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    assert "[OpenAI not configured]" in ai.text_generate("Hello")
