/* chat.js — Interactive story chat */

const Chat = {
  history: [],
  isTyping: false,

  init(genre, language, storyData) {
    this.history = [];
    this.isTyping = false;

    const meta = window.GENRE_META?.[genre] || { avatarEmoji: '📖', narrator: 'Narrator', emoji: '📖' };

    // Set chat header
    document.getElementById('chAvatar').textContent = meta.avatarEmoji;
    document.getElementById('chNarratorName').textContent = meta.narrator;

    // Welcome message
    const welcomeMessages = {
      kids:    `Hi ${window.userProfile?.name || 'friend'}! 🌟 I just finished telling your story! Ask me anything — what happened next, who the characters are, or anything else you're curious about!`,
      funny:   `OKAY so that story was ABSOLUTELY BANANAS 😂 and I know you have questions. Bring them on, ${window.userProfile?.name || 'pal'}. I dare you.`,
      fantasy: `The tale has been told, ${window.userProfile?.name || 'brave soul'}. ✨ Yet many mysteries remain. What wouldst thou know? Ask, and the bard shall answer.`,
      horror:  `The story… is over. ${window.userProfile?.name || 'You'} may think it's safe to ask questions now. 🕷️ Go ahead. Ask.`,
      scifi:   `Story transmission complete. 🚀 AXIOM-7 is available for debriefing, ${window.userProfile?.name || 'operator'}. Query the database.`
    };

    const welcome = document.getElementById('chatWelcome');
    document.getElementById('cwEmoji').textContent = meta.avatarEmoji;
    document.getElementById('cwText').textContent = welcomeMessages[genre] || welcomeMessages.kids;
    welcome.style.display = 'flex';

    // Load quick question chips
    this.loadQuickChips(genre);

    // Show chat panel
    document.getElementById('chatPanel').style.display = 'block';
    document.getElementById('chatInput').focus();
  },

  async loadQuickChips(genre) {
    try {
      const res = await fetch(`/quick-questions?genre=${genre}`);
      const questions = await res.json();
      const container = document.getElementById('quickChips');
      container.innerHTML = '';
      questions.forEach(q => {
        const chip = document.createElement('button');
        chip.className = 'qchip';
        chip.textContent = q;
        chip.onclick = () => {
          document.getElementById('chatInput').value = q;
          this.send();
        };
        container.appendChild(chip);
      });
    } catch (e) {
      console.warn('Could not load quick questions', e);
    }
  },

  async send() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message || this.isTyping) return;

    input.value = '';
    autoResize(input);

    // Hide welcome
    document.getElementById('chatWelcome').style.display = 'none';

    // Add user message
    this.addMessage('user', message);

    // Show typing indicator
    this.isTyping = true;
    document.getElementById('chatSendBtn').disabled = true;
    const typingId = this.addTypingIndicator();

    // Add to history
    this.history.push({ role: 'user', content: message });

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: window.currentStoryData?.story || '',
          story_type: window.currentStoryData?.story_type || 'kids',
          language: window.currentStoryData?.language || 'english',
          profile: window.userProfile || {},
          history: this.history.slice(0, -1), // exclude last user msg (already sent)
          message: message
        })
      });

      const data = await res.json();

      // Remove typing indicator
      this.removeTypingIndicator(typingId);
      this.isTyping = false;
      document.getElementById('chatSendBtn').disabled = false;

      if (data.success) {
        this.addMessage('assistant', data.reply);
        this.history.push({ role: 'assistant', content: data.reply });
      } else {
        this.addMessage('assistant', `⚠️ ${data.error || 'Something went wrong. Try again.'}`);
      }

    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.isTyping = false;
      document.getElementById('chatSendBtn').disabled = false;
      this.addMessage('assistant', '🔌 Network error — make sure Flask is running.');
    }

    this.scrollToBottom();
  },

  addMessage(role, text) {
    const meta = window.GENRE_META?.[window.currentStoryData?.story_type || 'kids'];
    const container = document.getElementById('chatMessages');

    const msgEl = document.createElement('div');
    msgEl.className = `msg ${role}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'msg-avatar';
    avatarEl.textContent = role === 'user'
      ? (window.userProfile?.gender === 'female' ? '👧' : window.userProfile?.gender === 'male' ? '👦' : '👤')
      : (meta?.avatarEmoji || '📖');

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'msg-bubble';

    if (role === 'assistant') {
      // Typewriter effect for assistant messages
      bubbleEl.textContent = '';
      msgEl.appendChild(avatarEl);
      msgEl.appendChild(bubbleEl);
      container.appendChild(msgEl);
      this.scrollToBottom();
      this.typewriterBubble(bubbleEl, text);
    } else {
      bubbleEl.textContent = text;
      msgEl.appendChild(avatarEl);
      msgEl.appendChild(bubbleEl);
      container.appendChild(msgEl);
      this.scrollToBottom();
    }

    return msgEl;
  },

  typewriterBubble(el, text) {
    let i = 0;
    const pace = 15;
    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, pace);
      }
    }
    type();
  },

  addTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const id = 'typing-' + Date.now();
    const meta = window.GENRE_META?.[window.currentStoryData?.story_type || 'kids'];

    const msgEl = document.createElement('div');
    msgEl.className = 'msg assistant typing-indicator';
    msgEl.id = id;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'msg-avatar';
    avatarEl.textContent = meta?.avatarEmoji || '📖';

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'msg-bubble';
    bubbleEl.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    msgEl.appendChild(avatarEl);
    msgEl.appendChild(bubbleEl);
    container.appendChild(msgEl);
    this.scrollToBottom();
    return id;
  },

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
  },

  clear() {
    this.history = [];
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    const welcome = document.getElementById('chatWelcome');
    welcome.style.display = 'flex';
  }
};

// Global helpers called from HTML
function sendChatMessage() { Chat.send(); }

function clearChat() { Chat.clear(); }

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    Chat.send();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
