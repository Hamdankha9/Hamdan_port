
// â”€â”€ CUSTOM CURSOR â”€â”€
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.transform=`translate(${mx-6}px,${my-6}px)`;
});
function animRing(){
  rx+=(mx-rx-18)*.12; ry+=(my-ry-18)*.12;
  ring.style.transform=`translate(${rx}px,${ry}px)`;
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.proj-item,.sb-card,.ach-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform+=' scale(2)';ring.style.opacity='.8';});
  el.addEventListener('mouseleave',()=>{cursor.style.transform=cursor.style.transform.replace(' scale(2)','');ring.style.opacity='.5';});
});

// â”€â”€ THEME TOGGLE â”€â”€
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click',()=>{
  const d = document.documentElement;
  const dark = d.getAttribute('data-theme')==='dark';
  d.setAttribute('data-theme', dark?'light':'dark');
  themeBtn.textContent = dark ? 'â˜€' : 'ðŸŒ™';
});

// â”€â”€ HAMBURGER â”€â”€
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{ ham.classList.toggle('open'); mob.classList.toggle('open'); });
function closeMobile(){ ham.classList.remove('open'); mob.classList.remove('open'); }

// â”€â”€ SCROLL PROGRESS â”€â”€
const pb = document.getElementById('progressBar');
const bt = document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  const pct = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  pb.style.width = pct+'%';
  bt.classList.toggle('show', window.scrollY>400);
  // active nav pill
  ['about','skills','projects','achievements','contact'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    const rect = el.getBoundingClientRect();
    const pill = document.querySelector(`.nav-pill[href="#${id}"]`);
    if(pill) pill.classList.toggle('active', rect.top<=80 && rect.bottom>80);
  });
});

// â”€â”€ SCROLL REVEAL â”€â”€
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// â”€â”€ SKILL BAR ANIMATION â”€â”€
const barObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sb-bar-fill').forEach(b=>{
        setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },100);
      });
    }
  });
},{threshold:.2});
document.querySelectorAll('.skills-bento').forEach(el=>barObs.observe(el));

// â”€â”€ SKILL FILTER â”€â”€
function filterSkills(cat, btn){
  document.querySelectorAll('.sf-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.sb-card').forEach(card=>{
    const cats = card.dataset.cat || '';
    const show = cat==='all' || cats.includes(cat);
    card.style.display = show ? '' : 'none';
  });
}

// â”€â”€ PROJECT ACCORDION â”€â”€
let openProj = null;
function toggleProj(i){
  const detail = document.getElementById('pd-'+i);
  const item = detail.previousElementSibling;
  if(openProj===i){
    detail.classList.remove('open');
    item.classList.remove('expanded');
    openProj = null;
  } else {
    if(openProj!==null){
      document.getElementById('pd-'+openProj).classList.remove('open');
      document.getElementById('pd-'+openProj).previousElementSibling.classList.remove('expanded');
    }
    detail.classList.add('open');
    item.classList.add('expanded');
    openProj = i;
  }
}

// â”€â”€ COPY EMAIL â”€â”€
function copyEmail(){
  navigator.clipboard.writeText('khanhamdan8808@gmail.com').then(()=>{
    const btn = document.getElementById('copyBtn');
    const lbl = document.getElementById('copyLabel');
    btn.classList.add('copied');
    lbl.textContent = 'âœ“ Copied!';
    setTimeout(()=>{ btn.classList.remove('copied'); lbl.textContent='Copy Email'; },2500);
  });
}

// â”€â”€ CONTACT FORM â”€â”€
function sendMsg(){
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();
  if(!name||!email||!msg){ alert('Please fill in all fields.'); return; }
  const mailto = `mailto:khanhamdan8808@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg+'\n\nFrom: '+name+'\nEmail: '+email)}`;
  document.getElementById('cfSuccess').style.display='block';
  setTimeout(()=>{ window.location.href=mailto; },600);
}

// Auto-open first project
toggleProj(0);

// ── SOUND EFFECTS (Web Audio API) ──
const SFX = (() => {
  let ctx;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }
  function play(freq, type, dur, vol) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + dur);
    } catch(e) {}
  }
  return {
    click:  () => play(800, 'sine', 0.08, 0.15),
    hover:  () => play(1200, 'sine', 0.05, 0.06),
    toggle: () => play(600, 'triangle', 0.12, 0.1),
    copy:   () => { play(900, 'sine', 0.06, 0.12); setTimeout(() => play(1200, 'sine', 0.08, 0.12), 70); },
    submit: () => { play(500, 'sine', 0.1, 0.1); setTimeout(() => play(700, 'sine', 0.1, 0.1), 80); setTimeout(() => play(1000, 'sine', 0.15, 0.12), 160); },
    matrix: () => { play(200, 'sawtooth', 0.3, 0.08); setTimeout(() => play(150, 'sawtooth', 0.5, 0.06), 150); }
  };
})();

// Attach click sounds to all interactive elements
document.querySelectorAll('a, button, .proj-item, .cert-card').forEach(el => {
  el.addEventListener('click', () => SFX.click());
});
// Attach hover sounds to nav pills and cards
document.querySelectorAll('.nav-pill, .sb-card, .ach-card, .btn-main, .btn-outline, .btn-hire, .pbtn').forEach(el => {
  el.addEventListener('mouseenter', () => SFX.hover());
});
// Override copy with sound
const origCopy = window.copyEmail;
window.copyEmail = function() { SFX.copy(); origCopy(); };
document.getElementById('copyBtn').onclick = window.copyEmail;

// Override theme toggle with sound
const origThemeClick = themeBtn.onclick;
themeBtn.addEventListener('click', () => SFX.toggle(), true);

// Override send message with sound
const origSend = window.sendMsg;
window.sendMsg = function() { SFX.submit(); origSend(); };

// ── KONAMI CODE EASTER EGG (Matrix Rain) ──
(() => {
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  let matrixActive = false;

  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        if (!matrixActive) startMatrix();
      }
    } else {
      konamiIdx = key === konamiSeq[0] ? 1 : 0;
    }
  });

  function startMatrix() {
    matrixActive = true;
    SFX.matrix();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'matrixOverlay';
    overlay.innerHTML = `
      <canvas id="matrixCanvas"></canvas>
      <div class="matrix-msg">
        <div class="matrix-title">You found the easter egg!</div>
        <div class="matrix-hint">Press ESC or click anywhere to exit</div>
        <div class="matrix-code">↑ ↑ ↓ ↓ ← → ← → B A</div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    const canvas = document.getElementById('matrixCanvas');
    const ctx2d = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ハムダンカーンHAMDANKHAN01アイウエオカキクケコサシスセソ<>{}[]|/\\+=_-^~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    // Randomize initial positions for more organic look
    for (let i = 0; i < drops.length; i++) {
      drops[i] = Math.random() * -50;
    }

    function drawMatrix() {
      if (!matrixActive) return;
      ctx2d.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient green colors
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx2d.fillStyle = '#fff';
          ctx2d.shadowColor = '#0f0';
          ctx2d.shadowBlur = 10;
        } else if (brightness > 0.8) {
          ctx2d.fillStyle = '#0f0';
          ctx2d.shadowBlur = 0;
        } else {
          ctx2d.fillStyle = `rgba(0, ${Math.floor(150 + Math.random() * 105)}, 0, ${0.6 + Math.random() * 0.4})`;
          ctx2d.shadowBlur = 0;
        }

        ctx2d.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx2d.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // Exit handlers
    function exitMatrix() {
      matrixActive = false;
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
        window.removeEventListener('resize', resize);
      }, 500);
    }
    overlay.addEventListener('click', exitMatrix);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        exitMatrix();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }
})();

