/* app.js — StoryWeaver AI v2 */

// ---- GLOBALS ----
window.userProfile = null;
window.currentStoryData = null;

let state = {
  file: null, genre: null, language: 'english',
  story: null, narrating: false, utterance: null,
  typewriterTimer: null
};

const GENRE_META = {
  kids:    { emoji:'🌟', headerEmoji:'📖', narrator:'Sunny ☀️',         avatarEmoji:'☀️', loadingTexts:['Sprinkling magic dust…','Finding happy characters…','Building a rainbow world…'] },
  funny:   { emoji:'😂', headerEmoji:'🤣', narrator:'Chuckles 🤡',       avatarEmoji:'🤡', loadingTexts:['Loading chaos engine…','Calibrating absurdity…','Priming the punchline…'] },
  fantasy: { emoji:'✨', headerEmoji:'⚔️', narrator:'Eldarion ⚔️',      avatarEmoji:'🧙', loadingTexts:['Consulting ancient scrolls…','Summoning the bard…','Weaving the legend…'] },
  horror:  { emoji:'🕷️', headerEmoji:'💀', narrator:'The Whisperer 👁️', avatarEmoji:'👁️', loadingTexts:['Something is watching…','The darkness stirs…','A voice in the silence…'] },
  scifi:   { emoji:'🚀', headerEmoji:'🤖', narrator:'AXIOM-7 🤖',        avatarEmoji:'🤖', loadingTexts:['Initializing neural core…','Scanning timeline delta…','Compiling narrative matrix…'] }
};
window.GENRE_META = GENRE_META;

// Profile selections storage
const pfSelections = { gender: null, mood: null };

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initProfile();
  initDropzone();
});

// ---- PROFILE ----
function initProfile() {
  const nameInput = document.getElementById('pfName');
  nameInput.addEventListener('input', updateSaveBtn);
}

function togglePf(btn, field) {
  btn.closest('.pf-toggle-row').querySelectorAll('.pf-toggle').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  pfSelections[field] = btn.dataset.val;
}

function updateSaveBtn() {
  const name = document.getElementById('pfName').value.trim();
  const btn = document.getElementById('btnSaveProfile');
  if (name.length > 0) {
    btn.classList.add('enabled');
    btn.disabled = false;
  } else {
    btn.classList.remove('enabled');
    btn.disabled = true;
  }
}

function saveProfile() {
  const name = document.getElementById('pfName').value.trim();
  if (!name) return;

  window.userProfile = {
    name,
    age:      document.getElementById('pfAge').value || null,
    gender:   pfSelections.gender,
    mood:     pfSelections.mood,
    fav_thing: document.getElementById('pfFavThing').value.trim() || null
  };

  applyUserToUI();
  show('sectionUpload');
  hide('sectionProfile');
  document.getElementById('sectionUpload').scrollIntoView({ behavior: 'smooth' });

  // Personalise upload subtitle
  const sub = document.getElementById('uploadSubText');
  sub.textContent = `Ready, ${name}! Drop an image and let's make your story.`;
}

function skipProfile() {
  window.userProfile = null;
  show('sectionUpload');
  hide('sectionProfile');
}

function applyUserToUI() {
  if (!window.userProfile) return;
  const pill = document.getElementById('userPill');
  pill.style.display = 'flex';
  document.getElementById('upName').textContent = window.userProfile.name;
  const avatarMap = { male:'👦', female:'👧', other:'🧑' };
  document.getElementById('upAvatar').textContent = avatarMap[window.userProfile.gender] || '👤';
}

// ---- DROPZONE ----
function initDropzone() {
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('fileInput');

  dz.addEventListener('click', () => fi.click());
  dz.querySelector('.dz-browse-btn').addEventListener('click', e => { e.stopPropagation(); fi.click(); });
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) loadFile(f);
    else showToast('⚠ Please drop an image file');
  });
  fi.addEventListener('change', () => { if (fi.files[0]) loadFile(fi.files[0]); });
  document.getElementById('changeImgBtn').addEventListener('click', resetUpload);
  document.getElementById('proceedBtn').addEventListener('click', showGenreSection);
}

function loadFile(file) {
  state.file = file;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('dropzone').style.display = 'none';
    document.getElementById('previewWrap').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  state.file = null;
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('dropzone').style.display = 'block';
  document.getElementById('fileInput').value = '';
}

// ---- GENRE ----
function showGenreSection() {
  if (!state.file) return;
  show('sectionGenre');
  document.getElementById('sectionGenre').scrollIntoView({ behavior: 'smooth' });
}

function selectGenre(genre, btn) {
  state.genre = genre;
  document.querySelectorAll('.genre-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  applyTheme(genre);

  const meta = GENRE_META[genre];
  document.getElementById('headerEmoji').textContent = meta.headerEmoji;
  document.getElementById('narratorLabel').textContent = meta.narrator;
  document.getElementById('narratorChip').style.opacity = '1';
  document.getElementById('genBtnIcon').textContent = meta.emoji;

  setTimeout(() => {
    show('sectionLang');
    document.getElementById('sectionLang').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 350);
}

// ---- LANGUAGE ----
function selectLang(lang, btn) {
  state.language = lang;
  document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// ---- GENERATE ----
async function generateStory() {
  if (!state.file || !state.genre) {
    showToast('⚠ Upload an image and choose a story type first');
    return;
  }

  show('sectionStory');
  document.getElementById('storyLoading').style.display = 'flex';
  document.getElementById('storyContent').style.display = 'none';
  document.getElementById('sectionStory').scrollIntoView({ behavior: 'smooth' });

  startLoadingAnimation();

  const formData = new FormData();
  formData.append('image', state.file);
  formData.append('story_type', state.genre);
  formData.append('language', state.language);
  if (window.userProfile) {
    formData.append('profile', JSON.stringify(window.userProfile));
  }

  try {
    const res = await fetch('/generate-story', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      window.currentStoryData = data;
      state.story = data;
      displayStory(data);
    } else {
      stopLoadingAnimation();
      document.getElementById('storyLoading').innerHTML = `
        <div style="font-size:40px;text-align:center">⚠️</div>
        <p style="color:var(--text-muted);font-size:15px;text-align:center">${data.error}</p>
        <button class="action-btn" onclick="generateStory()" style="margin-top:12px">Try Again</button>`;
    }
  } catch (err) {
    stopLoadingAnimation();
    document.getElementById('storyLoading').innerHTML = `
      <div style="font-size:40px;text-align:center">🔌</div>
      <p style="color:var(--text-muted);font-size:15px;text-align:center">Network error — make sure Flask is running on port 5000.</p>
      <button class="action-btn" onclick="generateStory()" style="margin-top:12px">Retry</button>`;
  }
}

// ---- LOADING ANIMATION ----
let loadingAnimId = null, loadingTextTimer = null;

function startLoadingAnimation() {
  const canvas = document.getElementById('loadingCanvas');
  const ctx = canvas.getContext('2d');
  const meta = GENRE_META[state.genre || 'kids'];
  let f = 0;

  document.getElementById('loadingText').textContent = meta.loadingTexts[0];
  let tIdx = 0;
  loadingTextTimer = setInterval(() => {
    tIdx = (tIdx + 1) % meta.loadingTexts.length;
    document.getElementById('loadingText').textContent = meta.loadingTexts[tIdx];
  }, 1800);

  function draw() {
    ctx.clearRect(0, 0, 300, 300);
    const cx = 150, cy = 150;
    const g = state.genre;

    if (g === 'kids') {
      for (let i = 0; i < 8; i++) {
        const a = (i/8)*Math.PI*2 + f*0.04;
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*70, cy+Math.sin(a)*70, 10+Math.sin(f*0.06+i)*4, 0, Math.PI*2);
        ctx.fillStyle = ['#FFD700','#FF6B35','#ff4499','#66dd00','#00ccff','#aa66ff','#ff6600','#33ccff'][i];
        ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
      }
      ctx.font = '40px serif'; ctx.fillText('🌟', cx-20, cy+14);
    } else if (g === 'funny') {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(f*0.05);
      ['😂','🤣','💥','😝','🤪','🎉'].forEach((e,i) => {
        const a = (i/6)*Math.PI*2;
        ctx.font = `${20+i*3}px serif`;
        ctx.fillText(e, Math.cos(a)*70-12, Math.sin(a)*70+8);
      });
      ctx.restore();
    } else if (g === 'fantasy') {
      for (let i = 0; i < 12; i++) {
        const a = (i/12)*Math.PI*2+f*0.02;
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*75, cy+Math.sin(a)*75, 4, 0, Math.PI*2);
        ctx.fillStyle = `rgba(199,125,255,${0.5+0.5*Math.sin(f*0.05+i)})`; ctx.fill();
      }
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, 30+i*20, f*0.01+i, f*0.01+i+Math.PI*1.5);
        ctx.strokeStyle = `rgba(199,125,255,${0.4-i*0.1})`; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.font = '36px serif'; ctx.fillText('⚔️', cx-18, cy+14);
    } else if (g === 'horror') {
      const flicker = Math.random() > 0.97 ? 0.2 : 0.8;
      ctx.beginPath(); ctx.ellipse(cx, cy, 60, 35*(0.5+0.5*Math.abs(Math.sin(f*0.03))), 0, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(180,0,0,${flicker})`; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI*2);
      ctx.fillStyle = `rgba(150,0,0,${flicker})`; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2);
      ctx.fillStyle = '#000'; ctx.fill();
    } else if (g === 'scifi') {
      for (let i = 0; i < 36; i++) {
        const a = (i/36)*Math.PI*2+f*0.03;
        const r = 60+((i+f)%3===0?12:0);
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,204,255,${0.3+0.6*(i%3===0?1:0)})`; ctx.fill();
      }
      ctx.font = '36px serif'; ctx.fillText('🤖', cx-18, cy+14);
    }
    f++;
    loadingAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function stopLoadingAnimation() {
  if (loadingAnimId) { cancelAnimationFrame(loadingAnimId); loadingAnimId = null; }
  if (loadingTextTimer) { clearInterval(loadingTextTimer); loadingTextTimer = null; }
}

// ---- DISPLAY STORY ----
function displayStory(data) {
  stopLoadingAnimation();
  document.getElementById('storyLoading').style.display = 'none';
  document.getElementById('storyContent').style.display = 'block';

  const meta = GENRE_META[data.story_type];

  // Narrator bar
  document.getElementById('narratorAvatar').textContent = meta.avatarEmoji;
  document.getElementById('nbName').textContent = meta.narrator;
  document.getElementById('nbStatus').textContent = `${data.language === 'hindi' ? 'हिंदी' : 'English'} · Ready`;

  // Scenes
  (data.scenes || []).forEach((caption, i) => {
    document.getElementById(`sceneCaption${i}`).textContent = caption;
    SceneArt.drawScene(`sceneCanvas${i}`, data.story_type, i, caption);
  });
  setActiveScene(0);

  // Chapter
  const chapters = { kids:'The Adventure Begins', funny:'The Chaos Unfolds', fantasy:'The Legend is Born', horror:'The Darkness Descends', scifi:'Transmission Received' };
  document.getElementById('bookChapter').textContent = chapters[data.story_type] || 'Chapter I';

  // Tokens
  document.getElementById('tokenInfo').textContent = `${data.tokens_used} tokens`;

  // Typewriter
  startTypewriter(data.story, data.story_type);
}

function startTypewriter(text, genre) {
  const el = document.getElementById('bookText');
  const cursor = document.getElementById('bookCursor');
  const progress = document.getElementById('bpFill');
  el.textContent = '';
  cursor.style.display = 'inline';

  const paceMap = { kids:28, funny:22, fantasy:35, horror:45, scifi:30 };
  const pace = paceMap[genre] || 30;
  let i = 0;
  const total = text.length;
  const triggers = [0, Math.floor(total*0.25), Math.floor(total*0.55), Math.floor(total*0.8)];
  let sceneIdx = 0;

  function type() {
    if (i < total) {
      el.textContent += text[i];
      i++;
      progress.style.width = `${(i/total)*100}%`;
      if (sceneIdx < 4 && i >= triggers[sceneIdx]) { setActiveScene(sceneIdx); sceneIdx++; }
      let delay = pace;
      const ch = text[i-1];
      if (ch === '.') delay = pace*5;
      else if (ch === ',') delay = pace*2;
      else if (ch === '!' || ch === '?') delay = pace*4;
      else if (ch === '\n') delay = pace*6;
      state.typewriterTimer = setTimeout(type, delay);
    } else {
      cursor.style.display = 'none';
      document.getElementById('postActions').style.display = 'flex';
      // Init chat after story finishes
      setTimeout(() => {
        Chat.init(window.currentStoryData.story_type, window.currentStoryData.language, window.currentStoryData);
      }, 400);
      document.getElementById('postActions').scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
  }
  type();
}

function setActiveScene(idx) {
  document.querySelectorAll('.scene-card').forEach((c,i) => c.classList.toggle('active', i===idx));
}

// ---- NARRATION ----
function toggleNarration() {
  if (!state.story) return;
  if (state.narrating) {
    speechSynthesis.pause();
    state.narrating = false;
    document.getElementById('playBtn').textContent = '▶';
    document.getElementById('nbStatus').textContent = 'Paused';
    return;
  }
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    state.narrating = true;
    document.getElementById('playBtn').textContent = '⏸';
    document.getElementById('nbStatus').textContent = 'Narrating…';
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(state.story.story);
  state.utterance = utterance;
  utterance.lang = state.story.language === 'hindi' ? 'hi-IN' : 'en-US';
  utterance.rate = parseFloat(document.getElementById('speedSlider').value);
  utterance.pitch = { kids:1.3, funny:1.2, fantasy:0.85, horror:0.7, scifi:0.9 }[state.genre] || 1;

  const voices = speechSynthesis.getVoices();
  if (state.story.language === 'hindi') {
    const hv = voices.find(v => v.lang.startsWith('hi'));
    if (hv) utterance.voice = hv;
  }
  utterance.onstart = () => { state.narrating = true; document.getElementById('playBtn').textContent = '⏸'; document.getElementById('nbStatus').textContent = 'Narrating…'; };
  utterance.onend = () => { state.narrating = false; document.getElementById('playBtn').textContent = '▶'; document.getElementById('nbStatus').textContent = 'Done ✓'; };
  speechSynthesis.speak(utterance);
}

function stopNarration() {
  speechSynthesis.cancel();
  state.narrating = false;
  document.getElementById('playBtn').textContent = '▶';
  document.getElementById('nbStatus').textContent = 'Stopped';
}

function updateSpeed(val) {
  document.getElementById('speedVal').textContent = parseFloat(val).toFixed(1) + '×';
  if (state.narrating) { stopNarration(); setTimeout(toggleNarration, 100); }
}

// ---- ACTIONS ----
function copyStory() {
  if (!state.story) return;
  navigator.clipboard.writeText(state.story.story).then(() => showToast('✓ Story copied!'));
}

function resetAll() {
  stopNarration();
  if (state.typewriterTimer) clearTimeout(state.typewriterTimer);

  state = { file:null, genre:null, language:'english', story:null, narrating:false, utterance:null, typewriterTimer:null };
  window.currentStoryData = null;

  applyTheme('default');
  document.getElementById('headerEmoji').textContent = '📖';
  document.getElementById('narratorChip').style.opacity = '0';
  document.getElementById('fileInput').value = '';
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('dropzone').style.display = 'block';
  document.querySelectorAll('.genre-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.lang-card').forEach((c,i) => c.classList.toggle('active', i===0));
  document.getElementById('bookText').textContent = '';
  document.getElementById('bpFill').style.width = '0%';
  document.getElementById('postActions').style.display = 'none';
  document.getElementById('storyContent').style.display = 'none';
  document.getElementById('chatPanel').style.display = 'none';

  ['sectionGenre','sectionLang','sectionStory'].forEach(hide);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- HELPERS ----
function show(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'block'; el.style.animation = 'sectionIn 0.6s ease both'; }
}
function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

window.speechSynthesis.onvoiceschanged = () => {};
