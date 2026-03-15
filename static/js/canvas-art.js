/* canvas-art.js — Animated scene illustrations per story genre */

const SceneArt = {

  drawScene(canvasId, genre, sceneIndex, caption) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let frame = 0;
    let animId = canvas._animId;
    if (animId) cancelAnimationFrame(animId);

    const drawFns = {
      kids: [
        (f) => SceneArt.kidsScene1(ctx, w, h, f),
        (f) => SceneArt.kidsScene2(ctx, w, h, f),
        (f) => SceneArt.kidsScene3(ctx, w, h, f),
        (f) => SceneArt.kidsScene4(ctx, w, h, f),
      ],
      funny: [
        (f) => SceneArt.funnyScene1(ctx, w, h, f),
        (f) => SceneArt.funnyScene2(ctx, w, h, f),
        (f) => SceneArt.funnyScene3(ctx, w, h, f),
        (f) => SceneArt.funnyScene4(ctx, w, h, f),
      ],
      fantasy: [
        (f) => SceneArt.fantasyScene1(ctx, w, h, f),
        (f) => SceneArt.fantasyScene2(ctx, w, h, f),
        (f) => SceneArt.fantasyScene3(ctx, w, h, f),
        (f) => SceneArt.fantasyScene4(ctx, w, h, f),
      ],
      horror: [
        (f) => SceneArt.horrorScene1(ctx, w, h, f),
        (f) => SceneArt.horrorScene2(ctx, w, h, f),
        (f) => SceneArt.horrorScene3(ctx, w, h, f),
        (f) => SceneArt.horrorScene4(ctx, w, h, f),
      ],
      scifi: [
        (f) => SceneArt.scifiScene1(ctx, w, h, f),
        (f) => SceneArt.scifiScene2(ctx, w, h, f),
        (f) => SceneArt.scifiScene3(ctx, w, h, f),
        (f) => SceneArt.scifiScene4(ctx, w, h, f),
      ]
    };

    const fn = (drawFns[genre] || drawFns.kids)[sceneIndex % 4];

    function loop() {
      fn(frame++);
      canvas._animId = requestAnimationFrame(loop);
    }
    loop();
  },

  // ====== KIDS SCENES ======
  kidsScene1(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#87CEEB'); sky.addColorStop(1, '#FFF9E6');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    // Sun
    const sunY = h * 0.2 + Math.sin(f * 0.03) * 5;
    ctx.beginPath(); ctx.arc(w * 0.75, sunY, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 20;
    ctx.fill(); ctx.shadowBlur = 0;
    // Rays
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + f * 0.01;
      ctx.beginPath();
      ctx.moveTo(w*0.75 + Math.cos(a)*30, sunY + Math.sin(a)*30);
      ctx.lineTo(w*0.75 + Math.cos(a)*44, sunY + Math.sin(a)*44);
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();
    }
    // Clouds
    this.drawCloud(ctx, w*0.2 + Math.sin(f*0.005)*8, h*0.15, 50, '#fff');
    this.drawCloud(ctx, w*0.5 + Math.sin(f*0.007)*6, h*0.1, 40, '#fff');
    // Ground
    ctx.fillStyle = '#7DC95E'; ctx.fillRect(0, h*0.7, w, h*0.3);
    // Bouncing star
    const starY = h*0.55 + Math.abs(Math.sin(f*0.05)) * (-30);
    ctx.font = '28px serif'; ctx.fillText('⭐', w*0.45, starY);
  },

  kidsScene2(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#FFE4F0'); bg.addColorStop(1,'#FFF0E0');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Rainbow
    const colors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#8B00FF'];
    colors.forEach((c,i) => {
      ctx.beginPath();
      ctx.arc(w/2, h*0.95, (i+1)*22 + 40, Math.PI, 0);
      ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.globalAlpha = 0.5 + 0.08*Math.sin(f*0.04+i);
      ctx.stroke(); ctx.globalAlpha = 1;
    });
    // Butterflies
    for (let i = 0; i < 3; i++) {
      const bx = w*(0.2+i*0.3) + Math.sin(f*0.04+i)*20;
      const by = h*(0.3+i*0.1) + Math.cos(f*0.03+i)*15;
      ctx.font = '22px serif'; ctx.fillText('🦋', bx, by);
    }
  },

  kidsScene3(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#B0E0FF'); bg.addColorStop(1,'#90EE90');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Tree
    ctx.fillStyle = '#5D4037'; ctx.fillRect(w*0.45, h*0.5, 18, h*0.35);
    ctx.beginPath(); ctx.arc(w*0.45+9, h*0.48, 44, 0, Math.PI*2);
    ctx.fillStyle = '#2E7D32'; ctx.fill();
    ctx.beginPath(); ctx.arc(w*0.45+9, h*0.38, 34, 0, Math.PI*2);
    ctx.fillStyle = '#388E3C'; ctx.fill();
    // Stars floating
    ['⭐','🌟','✨'].forEach((s,i) => {
      const sx = w*(0.2+i*0.25) + Math.sin(f*0.03+i*2)*15;
      const sy = h*(0.2+i*0.08) + Math.cos(f*0.04+i)*10;
      ctx.font = '20px serif'; ctx.fillText(s, sx, sy);
    });
  },

  kidsScene4(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#FFD700'); bg.addColorStop(1,'#FF6B35');
    ctx.fillStyle = bg; ctx.globalAlpha = 0.6; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 1;
    // Celebration burst
    for (let i = 0; i < 12; i++) {
      const a = (i/12)*Math.PI*2 + f*0.02;
      const r = 50 + Math.sin(f*0.05+i)*15;
      const px = w/2 + Math.cos(a)*r, py = h/2 + Math.sin(a)*r;
      const emojis = ['🌟','⭐','🎉','✨','🌈'];
      ctx.font = '18px serif'; ctx.fillText(emojis[i%5], px, py);
    }
    ctx.font = '36px serif'; ctx.fillText('🎉', w/2-18, h/2+12);
  },

  drawCloud(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    [0,r*0.5,r,-r*0.3].forEach((ox,i) => {
      ctx.beginPath(); ctx.arc(x+ox, y+[0,-r*0.3,0,0][i], r*(0.5+i*0.1), 0, Math.PI*2); ctx.fill();
    });
  },

  // ====== FUNNY SCENES ======
  funnyScene1(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a0a00'; ctx.fillRect(0,0,w,h);
    // Bouncing emoji chaos
    const emojis = ['😂','🤣','💥','🎉','🤪','😝'];
    emojis.forEach((e,i) => {
      const x = w*(0.1+i*0.15) + Math.sin(f*0.07+i*1.3)*30;
      const y = h*(0.3+i*0.08) + Math.abs(Math.sin(f*0.09+i))*(-40);
      ctx.font = `${24+i*4}px serif`; ctx.fillText(e, x, y+40);
    });
    // Zigzag lines
    ctx.strokeStyle = '#FF6B00'; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let x = 0; x < w; x += 20) {
      ctx.lineTo(x, h*0.8 + Math.sin((x+f*2)*0.2)*20);
    }
    ctx.stroke(); ctx.globalAlpha = 1;
  },

  funnyScene2(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#240d00'; ctx.fillRect(0,0,w,h);
    // Spinning pie chart of chaos
    const slice = (Math.PI*2/6);
    const colors = ['#FF6B00','#ffdd00','#ff2200','#ff9900','#ff00aa','#00ff88'];
    colors.forEach((c,i) => {
      ctx.beginPath(); ctx.moveTo(w/2, h/2);
      ctx.arc(w/2, h/2, 60, i*slice+f*0.02, (i+1)*slice+f*0.02);
      ctx.fillStyle = c; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1;
    });
    ctx.font = '32px serif'; ctx.fillText('🤣', w/2-16, h/2+12);
  },

  funnyScene3(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#321000'; ctx.fillRect(0,0,w,h);
    // Banana peel slip animation
    ctx.font = '40px serif';
    const slip = Math.sin(f*0.05)*15;
    ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(slip*0.1);
    ctx.fillText('🍌', -20, 0); ctx.restore();
    ctx.font = '32px serif';
    ctx.fillText('🤪', w*0.3+Math.sin(f*0.08)*20, h*0.4);
    ctx.fillText('💥', w*0.6+Math.cos(f*0.06)*15, h*0.6);
  },

  funnyScene4(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a0a00'; ctx.fillRect(0,0,w,h);
    // Confetti explosion
    for (let i = 0; i < 30; i++) {
      const px = (w/2 + Math.cos(i*0.7+f*0.04)*80+f*Math.cos(i)) % w;
      const py = (h/2 + Math.sin(i*0.5+f*0.03)*60+f*0.5) % h;
      ctx.fillStyle = ['#FF6B00','#ffdd00','#ff2200','#ffffff'][i%4];
      ctx.fillRect(px, py, 6, 6);
    }
    ctx.font='36px serif'; ctx.fillText('🎉',w/2-18,h/2+14);
  },

  // ====== FANTASY SCENES ======
  fantasyScene1(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#0a0018'); bg.addColorStop(1,'#1a0040');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Stars
    for (let i = 0; i < 60; i++) {
      const sx = (i*137.5)%w, sy = (i*73.1)%h;
      const a = 0.4 + 0.6*Math.sin(f*0.02+i);
      ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200,180,255,${a})`; ctx.fill();
    }
    // Magic circle
    ctx.strokeStyle = '#c77dff'; ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5 + 0.3*Math.sin(f*0.04);
    ctx.beginPath(); ctx.arc(w/2, h/2, 50+Math.sin(f*0.03)*5, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(w/2, h/2, 35, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font='30px serif'; ctx.fillText('⚔️', w/2-15, h/2+12);
  },

  fantasyScene2(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#160038'); bg.addColorStop(1,'#0a0018');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Castle silhouette
    ctx.fillStyle = '#0d001a';
    ctx.fillRect(w*0.3, h*0.4, w*0.4, h*0.45);
    [[0.3,0.3,20,40],[0.7,0.3,20,40],[0.5,0.2,25,50]].forEach(([xr,yr,wr,hr]) => {
      ctx.fillRect(w*xr-wr/2, h*yr, wr, hr);
    });
    // Moon
    ctx.beginPath(); ctx.arc(w*0.7, h*0.15, 28, 0, Math.PI*2);
    ctx.fillStyle = '#e0aaff'; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    // Magic motes
    for(let i=0;i<8;i++){
      const mx=w*0.5+Math.sin(f*0.04+i*0.8)*70;
      const my=h*0.5+Math.cos(f*0.03+i*0.6)*50;
      ctx.beginPath(); ctx.arc(mx,my,2,0,Math.PI*2);
      ctx.fillStyle='#c77dff'; ctx.globalAlpha=0.5+0.4*Math.sin(f*0.05+i); ctx.fill(); ctx.globalAlpha=1;
    }
  },

  fantasyScene3(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#200040'); bg.addColorStop(1,'#050010');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Dragon silhouette (simple)
    ctx.save(); ctx.translate(w*0.5+Math.sin(f*0.02)*10, h*0.45+Math.cos(f*0.025)*8);
    ctx.font='60px serif'; ctx.fillText('🐉',-30,20); ctx.restore();
    // Spell particles
    for(let i=0;i<12;i++){
      const a=(i/12)*Math.PI*2+f*0.03;
      ctx.beginPath(); ctx.arc(w/2+Math.cos(a)*55, h*0.45+Math.sin(a)*30, 3, 0, Math.PI*2);
      ctx.fillStyle='#ffd700'; ctx.globalAlpha=0.6+0.4*Math.sin(f*0.06+i); ctx.fill(); ctx.globalAlpha=1;
    }
  },

  fantasyScene4(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'#100028'); bg.addColorStop(1,'#0a001a');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Victory light burst
    const rays = 16;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2+f*0.01;
      const len=60+Math.sin(f*0.05+i)*20;
      ctx.beginPath(); ctx.moveTo(w/2,h/2);
      ctx.lineTo(w/2+Math.cos(a)*len, h/2+Math.sin(a)*len);
      ctx.strokeStyle='#c77dff'; ctx.lineWidth=1.5;
      ctx.globalAlpha=0.3+0.2*Math.sin(f*0.04+i); ctx.stroke(); ctx.globalAlpha=1;
    }
    ctx.font='36px serif'; ctx.fillText('✨',w/2-18,h/2+14);
  },

  // ====== HORROR SCENES ======
  horrorScene1(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050508'; ctx.fillRect(0,0,w,h);
    // Dripping effect
    for(let i=0;i<5;i++){
      const dx = w*(0.15+i*0.18);
      const dLen = h*0.15 + Math.sin(f*0.02+i)*h*0.1;
      const grad = ctx.createLinearGradient(dx,0,dx,dLen);
      grad.addColorStop(0,'rgba(150,0,0,0.8)'); grad.addColorStop(1,'rgba(150,0,0,0)');
      ctx.fillStyle=grad; ctx.fillRect(dx-3,0,6,dLen);
      ctx.beginPath(); ctx.arc(dx, dLen, 4+Math.sin(f*0.04+i)*2, 0, Math.PI*2);
      ctx.fillStyle='rgba(180,0,0,0.9)'; ctx.fill();
    }
    // Eye in the dark
    const eyeA = 0.5+0.5*Math.sin(f*0.05);
    ctx.beginPath(); ctx.ellipse(w/2, h/2, 20, 12*eyeA, 0, 0, Math.PI*2);
    ctx.fillStyle='#cc0000'; ctx.globalAlpha=0.7; ctx.fill(); ctx.globalAlpha=1;
    ctx.beginPath(); ctx.arc(w/2, h/2, 6, 0, Math.PI*2);
    ctx.fillStyle='#000'; ctx.fill();
  },

  horrorScene2(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#0a0a0f'; ctx.fillRect(0,0,w,h);
    // Fog wisps
    for(let i=0;i<4;i++){
      const fogX=(w*(0.1+i*0.25)+f*0.3)%(w+200)-100;
      const grad=ctx.createRadialGradient(fogX,h*0.7,0,fogX,h*0.7,100);
      grad.addColorStop(0,'rgba(60,0,0,0.12)'); grad.addColorStop(1,'transparent');
      ctx.fillStyle=grad; ctx.fillRect(fogX-100,h*0.5,200,h*0.5);
    }
    // Shadows
    ctx.font='18px serif'; ctx.globalAlpha=0.4;
    ctx.fillText('🕷️',w*0.2+Math.sin(f*0.03)*5, h*0.3+Math.cos(f*0.04)*8);
    ctx.fillText('🕷️',w*0.7+Math.sin(f*0.025)*7, h*0.25+Math.cos(f*0.035)*6);
    ctx.globalAlpha=1;
    // Door crack of light
    ctx.fillStyle='rgba(200,150,50,0.15)';
    ctx.fillRect(w*0.45, h*0.2, 8, h*0.55);
  },

  horrorScene3(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#050508'; ctx.fillRect(0,0,w,h);
    // Flicker effect
    const flicker = Math.random() > 0.97 ? 0 : 1;
    ctx.globalAlpha = flicker * 0.6;
    ctx.fillStyle='#111122'; ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=1;
    // Shadowy figure
    ctx.fillStyle='rgba(0,0,0,0.85)';
    const sw=30+Math.sin(f*0.02)*5;
    ctx.fillRect(w/2-sw/2, h*0.15, sw, h*0.6);
    ctx.beginPath(); ctx.arc(w/2, h*0.18, 20+Math.sin(f*0.03)*2, 0, Math.PI*2);
    ctx.fill();
    // Red eyes
    ctx.beginPath(); ctx.arc(w/2-8, h*0.18, 4, 0, Math.PI*2);
    ctx.beginPath(); ctx.arc(w/2+8, h*0.18, 4, 0, Math.PI*2);
    ctx.fillStyle='#cc0000'; ctx.globalAlpha=0.8+0.2*Math.sin(f*0.08); ctx.fill(); ctx.globalAlpha=1;
  },

  horrorScene4(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#030305'; ctx.fillRect(0,0,w,h);
    // Question mark — the unknown
    ctx.font='bold 80px serif';
    ctx.fillStyle=`rgba(80,0,0,${0.3+0.2*Math.sin(f*0.03)})`;
    ctx.fillText('?', w/2-25, h/2+28);
    // Creeping cracks
    for(let i=0;i<6;i++){
      const a=(i/6)*Math.PI*2+0.3;
      ctx.beginPath(); ctx.moveTo(w/2, h/2);
      const crackLen=40+i*15;
      ctx.lineTo(w/2+Math.cos(a)*crackLen, h/2+Math.sin(a)*crackLen);
      ctx.strokeStyle='rgba(100,0,0,0.4)'; ctx.lineWidth=1; ctx.stroke();
    }
  },

  // ====== SCI-FI SCENES ======
  scifiScene1(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#00050f'; ctx.fillRect(0,0,w,h);
    // Planet
    const grad=ctx.createRadialGradient(w*0.65,h*0.35,0,w*0.65,h*0.35,50);
    grad.addColorStop(0,'#0044aa'); grad.addColorStop(0.6,'#003388'); grad.addColorStop(1,'#001144');
    ctx.beginPath(); ctx.arc(w*0.65, h*0.35, 50, 0, Math.PI*2);
    ctx.fillStyle=grad; ctx.fill();
    // Planet rings
    ctx.beginPath(); ctx.ellipse(w*0.65, h*0.35, 70, 18, 0.3, 0, Math.PI*2);
    ctx.strokeStyle='rgba(0,180,255,0.4)'; ctx.lineWidth=4; ctx.stroke();
    // Stars
    for(let i=0;i<40;i++){
      const sx=(i*173)%w, sy=(i*97)%h;
      ctx.beginPath(); ctx.arc(sx,sy,1,0,Math.PI*2);
      ctx.fillStyle=`rgba(180,220,255,${0.3+0.4*Math.sin(f*0.03+i)})`; ctx.fill();
    }
    // Ship
    ctx.font='24px serif';
    ctx.fillText('🚀', w*0.25+Math.sin(f*0.03)*10, h*0.5+Math.cos(f*0.025)*8);
  },

  scifiScene2(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#000d1a'; ctx.fillRect(0,0,w,h);
    // Grid floor
    ctx.strokeStyle='rgba(0,150,255,0.15)'; ctx.lineWidth=1;
    for(let x=0;x<w;x+=20){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for(let y=0;y<h;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    // Hologram projection
    const hA = 0.4+0.3*Math.sin(f*0.04);
    ctx.strokeStyle=`rgba(0,255,200,${hA})`; ctx.lineWidth=1.5;
    for(let i=0;i<5;i++){
      ctx.beginPath(); ctx.arc(w/2, h/2, 20+i*12, f*0.01, f*0.01+Math.PI*1.5);
      ctx.stroke();
    }
    ctx.font='28px serif'; ctx.fillText('🤖',w/2-14,h/2+14);
  },

  scifiScene3(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#00050f'; ctx.fillRect(0,0,w,h);
    // Data stream
    const chars='01AXIOM7λΔ∞π';
    ctx.font='11px monospace'; ctx.fillStyle='rgba(0,204,255,0.4)';
    for(let i=0;i<8;i++){
      const cx=w*(0.05+i*0.13);
      for(let j=0;j<8;j++){
        const cy=((j*22 + f*2 + i*30) % (h+22)) - 11;
        ctx.fillText(chars[(f+i*3+j*7)%chars.length], cx, cy);
      }
    }
    // Portal
    for(let i=4;i>0;i--){
      ctx.beginPath(); ctx.arc(w/2, h/2, i*14+Math.sin(f*0.05)*4, 0, Math.PI*2);
      ctx.strokeStyle=`rgba(0,200,255,${i*0.15})`; ctx.lineWidth=2; ctx.stroke();
    }
  },

  scifiScene4(ctx, w, h, f) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle='#000814'; ctx.fillRect(0,0,w,h);
    // Warp speed stars
    for(let i=0;i<60;i++){
      const seed = i*137.5;
      const a = (seed * 0.618) % (Math.PI*2);
      const r = (seed%80)+20;
      const speed = (r/100)*3;
      const len = speed * 5;
      const cr = (r + f*speed*0.3) % (w/2);
      const sx=w/2+Math.cos(a)*cr, sy=h/2+Math.sin(a)*cr;
      const ex=w/2+Math.cos(a)*(cr+len), ey=h/2+Math.sin(a)*(cr+len);
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey);
      ctx.strokeStyle=`rgba(180,220,255,${0.4+cr/100*0.4})`; ctx.lineWidth=1; ctx.stroke();
    }
    ctx.font='32px serif'; ctx.fillText('🌌',w/2-16,h/2+16);
  }
};
