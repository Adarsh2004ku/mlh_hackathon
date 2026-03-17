"""tests/test_openai_integration.py
=========================

Tests that the Gemini wrapper in `core/ai.py` calls the GenAI SDK correctly.
"""

from unittest.mock import MagicMock, patch

from core import ai


def test_text_generate_uses_gemini_client(monkeypatch):
    """Ensure text_generate calls genai.Client().models.generate_content and returns text."""

    # Arrange: set a fake API key and patch genai.Client to return a mock client.
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")

    mock_response = MagicMock()
    mock_response.text = "hello"

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    # Make tests pass even if google-genai isn't installed in the test environment.
    fake_genai = MagicMock()
    fake_genai.Client.return_value = mock_client

    with patch.object(ai, "_GEMINI_AVAILABLE", True), patch.object(ai, "genai", fake_genai):
        # Act
        result = ai.text_generate("Hi there", system="You are a helpful assistant.")

        # Assert
        assert result == "hello"
        fake_genai.Client.assert_called_with(api_key="test-key")
        assert fake_genai.Client.call_count >= 1


def test_get_client_returns_none_without_api_key(monkeypatch):
    """_get_client should return None if GEMINI_API_KEY is missing."""
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    assert ai._get_client() is None


def test_text_generate_fallback_without_api_key(monkeypatch):
    """text_generate should return a placeholder when Gemini is not configured."""
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    assert "[API not configured]" in ai.text_generate("Hello")
