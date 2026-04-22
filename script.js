
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

