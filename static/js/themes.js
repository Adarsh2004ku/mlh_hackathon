/* themes.js — Dynamic canvas backgrounds per story mode */

const THEMES = {
  default: {
    bg: '#0d0d0f',
    draw: (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);
    }
  },

  kids: {
    bg: '#fff9e6',
    particles: [],
    init(w, h) {
      this.particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        size: 4 + Math.random() * 8,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -0.3 - Math.random() * 0.6,
        color: ['#FFD700','#FF6B35','#ff4499','#66dd00','#00ccff'][Math.floor(Math.random()*5)],
        shape: ['⭐','🌸','💛','🌈','✨'][Math.floor(Math.random()*5)],
        opacity: 0.4 + Math.random() * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      }));
    },
    draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      this.particles.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.4;
        p.y += p.speedY;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.5;
        ctx.font = `${p.size * 2}px serif`;
        ctx.fillText(p.shape, p.x, p.y);
        ctx.restore();
      });
    }
  },

  funny: {
    bg: '#1a0a00',
    particles: [],
    init(w, h) {
      this.particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        r: 3 + Math.random() * 8,
        color: ['#FF6B00','#ffdd00','#ff2200','#ff9900','#ffffff'][Math.floor(Math.random()*5)],
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.1,
        emoji: ['😂','🤣','💥','🎉','😝'][Math.floor(Math.random()*5)]
      }));
    },
    draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      // Scanlines for comedic effect
      for (let y = 0; y < h; y += 8) {
        ctx.fillStyle = 'rgba(255,107,0,0.015)';
        ctx.fillRect(0, y, w, 2);
      }
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.spin += p.spinSpeed;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.font = `${p.r * 3}px serif`;
        ctx.fillText(p.emoji, -p.r, p.r);
        ctx.restore();
      });
    }
  },

  fantasy: {
    bg: '#0a0018',
    stars: [],
    motes: [],
    init(w, h) {
      this.stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.03
      }));
      this.motes = Array.from({ length: 40 }, () => ({
        x: Math.random() * w, y: h + Math.random() * 100,
        size: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.5,
        opacity: 0.3 + Math.random() * 0.7,
        color: ['#c77dff','#e0aaff','#9b5de5','#ffd700'][Math.floor(Math.random()*4)]
      }));
    },
    draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      // Stars
      this.stars.forEach(s => {
        s.twinkle += s.speed;
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${alpha})`;
        ctx.fill();
      });
      // Aurora bands
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(91,45,150,0.04)');
      grad.addColorStop(0.5, 'rgba(155,93,229,0.06)');
      grad.addColorStop(1, 'rgba(224,170,255,0.04)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Magic motes
      this.motes.forEach(m => {
        m.y -= m.speed; m.x += m.drift;
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = m.opacity * 0.25;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
  },

  horror: {
    bg: '#050508',
    fog: [],
    init(w, h) {
      this.fog = Array.from({ length: 8 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        width: 200 + Math.random() * 400,
        height: 80 + Math.random() * 160,
        speed: 0.1 + Math.random() * 0.2,
        opacity: 0.02 + Math.random() * 0.04
      }));
    },
    draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      // Slow fog rolls
      this.fog.forEach(f => {
        f.x -= f.speed;
        if (f.x + f.width < 0) f.x = w + f.width;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.width / 2);
        g.addColorStop(0, `rgba(100,0,0,${f.opacity})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(f.x - f.width/2, f.y - f.height/2, f.width, f.height);
      });
      // Red flicker at top
      const flicker = 0.005 + 0.005 * Math.sin(t * 0.003 + Math.sin(t * 0.007));
      const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.3);
      topGrad.addColorStop(0, `rgba(80,0,0,${flicker})`);
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, h);
      // Corner vignette
      const vig = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.8);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }
  },

  scifi: {
    bg: '#00050f',
    grid: { offset: 0 },
    nodes: [],
    init(w, h) {
      this.grid.offset = 0;
      this.nodes = Array.from({ length: 25 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2
      }));
    },
    draw(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const g = this.grid;
      g.offset = (g.offset + 0.3) % 40;
      // Scrolling grid
      ctx.strokeStyle = 'rgba(0,100,180,0.07)';
      ctx.lineWidth = 1;
      for (let x = (g.offset % 40) - 40; x < w + 40; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = (g.offset % 40) - 40; y < h + 40; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      // Network nodes
      this.nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      // Draw connections
      ctx.strokeStyle = 'rgba(0,204,255,0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 180) {
            ctx.globalAlpha = 1 - dist/180;
            ctx.beginPath();
            ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
            ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      // Draw nodes
      this.nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,204,255,0.4)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,204,255,0.07)';
        ctx.fill();
      });
      // Scan line sweep
      const scanY = (t * 0.2) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(0,204,255,0.04)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 60, w, 120);
    }
  }
};

// ---- Theme applier ----
let currentTheme = 'default';
let bgAnimFrame = null;
let bgTime = 0;

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (THEMES[theme] && THEMES[theme].init) {
      THEMES[theme].init(canvas.width, canvas.height);
    }
  }

  window.removeEventListener('resize', resize);
  window.addEventListener('resize', resize);
  resize();

  if (bgAnimFrame) cancelAnimationFrame(bgAnimFrame);

  function loop(timestamp) {
    bgTime = timestamp;
    const t = THEMES[theme];
    if (t && t.draw) t.draw(ctx, canvas.width, canvas.height, timestamp);
    bgAnimFrame = requestAnimationFrame(loop);
  }
  bgAnimFrame = requestAnimationFrame(loop);
}

// Init default
window.addEventListener('DOMContentLoaded', () => applyTheme('default'));
