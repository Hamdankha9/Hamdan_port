// ── PAGE LOADER ──
window.addEventListener('load', function() {
  var loader = document.getElementById('pageLoader');
  setTimeout(function() {
    loader.classList.add('hidden');
    setTimeout(function() { loader.remove(); }, 600);
  }, 1800);
});

// ── PARTICLE SYSTEM (Hero) ──
(function() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h;
  var mouse = { x: null, y: null };

  function resize() {
    var hero = document.getElementById('hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.getElementById('hero').addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.getElementById('hero').addEventListener('mouseleave', function() {
    mouse.x = null; mouse.y = null;
  });

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
  };
  Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (mouse.x !== null) {
      var dx = mouse.x - this.x, dy = mouse.y - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= dx * 0.008;
        this.y -= dy * 0.008;
      }
    }
    if (this.x < 0 || this.x > w) this.speedX *= -1;
    if (this.y < 0 || this.y > h) this.speedY *= -1;
  };
  Particle.prototype.draw = function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? 'rgba(232, 70, 10, ' + this.opacity + ')'
      : 'rgba(26, 24, 20, ' + this.opacity + ')';
    ctx.fill();
  };

  var count = Math.min(Math.floor(w * h / 8000), 80);
  for (var i = 0; i < count; i++) particles.push(new Particle());

  function connectParticles() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          var op = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? 'rgba(232, 70, 10, ' + op + ')'
            : 'rgba(26, 24, 20, ' + op + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(function(p) { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── TYPING EFFECT ──
(function() {
  var el = document.getElementById('typedText');
  if (!el) return;
  var roles = ['Frontend Developer', 'DSA Enthusiast', 'Problem Solver', 'Clean Code Advocate', 'UI/UX Thinker'];
  var roleIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    var current = roles[roleIdx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80 + Math.random() * 40);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 2500);
})();

// ── CUSTOM CURSOR ──
var cursor = document.getElementById('cursor');
var ring = document.getElementById('cursorRing');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', function(e) {
  mx=e.clientX; my=e.clientY;
  cursor.style.transform='translate('+(mx-6)+'px,'+(my-6)+'px)';
});
function animRing(){
  rx+=(mx-rx-18)*.12; ry+=(my-ry-18)*.12;
  ring.style.transform='translate('+rx+'px,'+ry+'px)';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.proj-item,.sb-card,.ach-card').forEach(function(el) {
  el.addEventListener('mouseenter',function(){cursor.style.transform+=' scale(2)';ring.style.opacity='.8';});
  el.addEventListener('mouseleave',function(){cursor.style.transform=cursor.style.transform.replace(' scale(2)','');ring.style.opacity='.5';});
});

// ── THEME TOGGLE ──
var themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click',function(){
  var d = document.documentElement;
  var dark = d.getAttribute('data-theme')==='dark';
  d.setAttribute('data-theme', dark?'light':'dark');
  themeBtn.textContent = dark ? '\u2600' : '\uD83C\uDF19';
});

// ── HAMBURGER ──
var ham = document.getElementById('hamburger');
var mob = document.getElementById('mobileMenu');
ham.addEventListener('click',function(){ ham.classList.toggle('open'); mob.classList.toggle('open'); });
function closeMobile(){ ham.classList.remove('open'); mob.classList.remove('open'); }

// ── SCROLL PROGRESS ──
var pb = document.getElementById('progressBar');
var bt = document.getElementById('backTop');
window.addEventListener('scroll',function(){
  var pct = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  pb.style.width = pct+'%';
  bt.classList.toggle('show', window.scrollY>400);
  // active nav pill
  ['about','skills','projects','achievements','contact'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    var rect = el.getBoundingClientRect();
    var pill = document.querySelector('.nav-pill[href="#'+id+'"]');
    if(pill) pill.classList.toggle('active', rect.top<=80 && rect.bottom>80);
  });
});

// ── SCROLL REVEAL ──
var obs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

// ── SKILL BAR ANIMATION ──
var barObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.querySelectorAll('.sb-bar-fill').forEach(function(b){
        setTimeout(function(){ b.style.width=b.dataset.w+'%'; },100);
      });
    }
  });
},{threshold:.2});
document.querySelectorAll('.skills-bento').forEach(function(el){barObs.observe(el);});

// ── SKILL FILTER ──
function filterSkills(cat, btn){
  document.querySelectorAll('.sf-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('.sb-card').forEach(function(card){
    var cats = card.dataset.cat || '';
    var show = cat==='all' || cats.includes(cat);
    card.style.display = show ? '' : 'none';
  });
}

// ── PROJECT ACCORDION ──
var openProj = null;
function toggleProj(i){
  var detail = document.getElementById('pd-'+i);
  var item = detail.previousElementSibling;
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

// ── COPY EMAIL ──
function copyEmail(){
  navigator.clipboard.writeText('khanhamdan8808@gmail.com').then(function(){
    var btn = document.getElementById('copyBtn');
    var lbl = document.getElementById('copyLabel');
    btn.classList.add('copied');
    lbl.textContent = '\u2713 Copied!';
    setTimeout(function(){ btn.classList.remove('copied'); lbl.textContent='Copy Email'; },2500);
  });
}

// ── CONTACT FORM ──
function sendMsg(){
  var name = document.getElementById('cf-name').value.trim();
  var email = document.getElementById('cf-email').value.trim();
  var msg = document.getElementById('cf-msg').value.trim();
  if(!name||!email||!msg){ alert('Please fill in all fields.'); return; }
  var mailto = 'mailto:khanhamdan8808@gmail.com?subject=Portfolio Contact from '+encodeURIComponent(name)+'&body='+encodeURIComponent(msg+'\n\nFrom: '+name+'\nEmail: '+email);
  document.getElementById('cfSuccess').style.display='block';
  setTimeout(function(){ window.location.href=mailto; },600);
}

// Auto-open first project
toggleProj(0);

// ── SOUND EFFECTS (Web Audio API) ──
var SFX = (function() {
  var ctx;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }
  function play(freq, type, dur, vol) {
    try {
      var c = getCtx();
      var osc = c.createOscillator();
      var gain = c.createGain();
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
    click:  function() { play(800, 'sine', 0.08, 0.15); },
    hover:  function() { play(1200, 'sine', 0.05, 0.06); },
    toggle: function() { play(600, 'triangle', 0.12, 0.1); },
    copy:   function() { play(900, 'sine', 0.06, 0.12); setTimeout(function(){ play(1200, 'sine', 0.08, 0.12); }, 70); },
    submit: function() { play(500, 'sine', 0.1, 0.1); setTimeout(function(){ play(700, 'sine', 0.1, 0.1); }, 80); setTimeout(function(){ play(1000, 'sine', 0.15, 0.12); }, 160); },
    matrix: function() { play(200, 'sawtooth', 0.3, 0.08); setTimeout(function(){ play(150, 'sawtooth', 0.5, 0.06); }, 150); }
  };
})();

// Attach click sounds
document.querySelectorAll('a, button, .proj-item, .cert-card').forEach(function(el) {
  el.addEventListener('click', function() { SFX.click(); });
});
// Attach hover sounds
document.querySelectorAll('.nav-pill, .sb-card, .ach-card, .btn-main, .btn-outline, .btn-hire, .pbtn').forEach(function(el) {
  el.addEventListener('mouseenter', function() { SFX.hover(); });
});
// Theme toggle sound
themeBtn.addEventListener('click', function() { SFX.toggle(); }, true);

// ── KONAMI CODE EASTER EGG (Matrix Rain) ──
(function() {
  var konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var konamiIdx = 0;
  var matrixActive = false;

  document.addEventListener('keydown', function(e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
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

    var overlay = document.createElement('div');
    overlay.id = 'matrixOverlay';
    overlay.innerHTML = '<canvas id="matrixCanvas"></canvas><div class="matrix-msg"><div class="matrix-title">You found the easter egg!</div><div class="matrix-hint">Press ESC or click anywhere to exit</div><div class="matrix-code">\u2191 \u2191 \u2193 \u2193 \u2190 \u2192 \u2190 \u2192 B A</div></div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function() { overlay.classList.add('active'); });

    var canvas = document.getElementById('matrixCanvas');
    var ctx2d = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = 'HAMDANKHAN01<>{}[]|/\\+=_-^~';
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }

    function drawMatrix() {
      if (!matrixActive) return;
      ctx2d.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < drops.length; i++) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        var brightness = Math.random();
        if (brightness > 0.95) {
          ctx2d.fillStyle = '#fff';
          ctx2d.shadowColor = '#0f0';
          ctx2d.shadowBlur = 10;
        } else if (brightness > 0.8) {
          ctx2d.fillStyle = '#0f0';
          ctx2d.shadowBlur = 0;
        } else {
          ctx2d.fillStyle = 'rgba(0, ' + Math.floor(150 + Math.random() * 105) + ', 0, ' + (0.6 + Math.random() * 0.4) + ')';
          ctx2d.shadowBlur = 0;
        }

        ctx2d.font = fontSize + "px 'JetBrains Mono', monospace";
        ctx2d.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    function exitMatrix() {
      matrixActive = false;
      overlay.classList.remove('active');
      setTimeout(function() {
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
