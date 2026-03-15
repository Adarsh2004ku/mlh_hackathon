"""
tests/test_app.py
================
Basic tests for the Flask application.
"""

def test_home_page(client):
    """Test the home page loads."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'StoryWeaver' in response.data

def test_quick_questions(client):
    """Test quick questions endpoint."""
    response = client.get('/quick-questions?genre=kids')
    assert response.status_code == 200
    assert response.is_json

def test_generate_story_without_image(client):
    """Test generate story endpoint without image."""
    response = client.post('/generate-story')
    assert response.status_code == 400

def test_chat_without_data(client):
    """Test chat endpoint without data."""
    response = client.post('/chat', json={})
    assert response.status_code == 400