/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const curEl = document.getElementById('cur');
const ringEl = document.getElementById('cur-ring');
let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  curEl.style.left = mx+'px'; curEl.style.top = my+'px';
});
document.addEventListener('mouseover', e => {
  if (e.target.closest('button,a')) curEl.classList.add('big');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('button,a')) curEl.classList.remove('big');
});
(function loop(){
  rx += (mx-rx)*.12; ry += (my-ry)*.12;
  ringEl.style.left = rx+'px'; ringEl.style.top = ry+'px';
  requestAnimationFrame(loop);
})();

/* ══════════════════════════════════════
   CANVAS — STARRY NIGHT SKY
══════════════════════════════════════ */
const cv = document.getElementById('bg');
const cx = cv.getContext('2d');
let W, H;
function rsz(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
window.addEventListener('resize', rsz); rsz();

const tinyStars = Array.from({length:360}, () => ({
  x:Math.random()*W, y:Math.random()*H,
  r:.1+Math.random()*.3, a:.18+Math.random()*.48, da:(Math.random()-.5)*.004,
  vx:(Math.random()-.5)*.06, vy:(Math.random()-.5)*.04,
}));
const medStars = Array.from({length:120}, () => ({
  x:Math.random()*W, y:Math.random()*H,
  r:.4+Math.random()*.55, a:.45+Math.random()*.45, da:(Math.random()-.5)*.006,
  vx:(Math.random()-.5)*.04, vy:(Math.random()-.5)*.03,
}));
const brightStars = Array.from({length:28}, () => ({
  x:Math.random()*W, y:Math.random()*H,
  r:1.1+Math.random()*1.5, a:.65+Math.random()*.35, da:(Math.random()-.5)*.004,
  vx:(Math.random()-.5)*.03, vy:(Math.random()-.5)*.02,
}));

const nebulae = Array.from({length:4}, () => ({
  x:Math.random()*W, y:Math.random()*H,
  rx:120+Math.random()*180, ry:80+Math.random()*120,
  hue:Math.random()<.5?205:350,
  a:.0, ma:.028+Math.random()*.022,
  da:(Math.random()-.5)*.0003,
  vx:(Math.random()-.5)*.12, vy:(Math.random()-.5)*.08,
  ph:Math.random()*Math.PI*2,
}));

const shooters = [];
let elapsed = 0, nextShoot = 2000+Math.random()*3500;

const hearts = Array.from({length:14}, () => ({
  x:Math.random()*W, y:Math.random()*H+H, a:0,
  vy:-.15-Math.random()*.18, vx:(Math.random()-.5)*.16,
  ma:.05+Math.random()*.07, ph:Math.random()*Math.PI*2, s:7+Math.random()*8,
}));

let t = 0;
(function frame(){
  cx.clearRect(0,0,W,H); t+=.011; elapsed+=16;

  /* Milky Way soft band */
  cx.save(); cx.translate(W/2,H/2); cx.rotate(-Math.PI*.17);
  const mw = cx.createLinearGradient(0,-H,0,H);
  mw.addColorStop(0,'transparent');
  mw.addColorStop(.32,'rgba(130,145,210,.015)');
  mw.addColorStop(.47,'rgba(155,162,220,.034)');
  mw.addColorStop(.53,'rgba(155,162,220,.034)');
  mw.addColorStop(.68,'rgba(130,145,210,.015)');
  mw.addColorStop(1,'transparent');
  cx.fillStyle = mw; cx.fillRect(-W,-H,W*2,H*2); cx.restore();

  /* Warm amber horizon glow */
  const hz = cx.createLinearGradient(0,H*.72,0,H);
  hz.addColorStop(0,'transparent'); hz.addColorStop(1,'rgba(20,70,140,.06)');
  cx.fillStyle = hz; cx.fillRect(0,0,W,H);

  /* Drifting nebula clouds */
  nebulae.forEach(n => {
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<-n.rx*2) n.x=W+n.rx; if(n.x>W+n.rx*2) n.x=-n.rx;
    if(n.y<-n.ry*2) n.y=H+n.ry; if(n.y>H+n.ry*2) n.y=-n.ry;
    n.a+=n.da+Math.sin(t+n.ph)*.00015; if(n.a>n.ma)n.a=n.ma; if(n.a<.004)n.a=.004;
    cx.save(); cx.translate(n.x,n.y); cx.scale(1,n.ry/n.rx);
    const ng=cx.createRadialGradient(0,0,0,0,0,n.rx);
    ng.addColorStop(0,`hsla(${n.hue},60%,62%,${n.a})`);
    ng.addColorStop(.55,`hsla(${n.hue},50%,50%,${n.a*.4})`);
    ng.addColorStop(1,'transparent');
    cx.fillStyle=ng; cx.beginPath(); cx.arc(0,0,n.rx,0,Math.PI*2); cx.fill(); cx.restore();
  });

  /* Tiny stars */
  tinyStars.forEach(s => {
    s.a+=s.da; if(s.a>.68||s.a<.12)s.da*=-1;
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0;
    cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(210,222,255,${s.a})`; cx.fill();
  });

  /* Medium stars */
  medStars.forEach(s => {
    s.a+=s.da; if(s.a>.92||s.a<.38)s.da*=-1;
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0;
    cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(228,235,255,${s.a})`; cx.fill();
  });

  /* Bright stars with glow halo */
  brightStars.forEach(s => {
    s.a+=s.da; if(s.a>1||s.a<.58)s.da*=-1;
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0;
    const g = cx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*5);
    g.addColorStop(0,`rgba(205,218,255,${s.a*.2})`); g.addColorStop(1,'transparent');
    cx.fillStyle=g; cx.fillRect(s.x-s.r*5,s.y-s.r*5,s.r*10,s.r*10);
    cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(232,240,255,${s.a})`; cx.fill();
  });

  /* Shooting stars */
  if(elapsed>nextShoot){
    nextShoot=elapsed+2500+Math.random()*5000;
    shooters.push({
      x:Math.random()*W*.75, y:Math.random()*H*.42,
      len:85+Math.random()*120, spd:10+Math.random()*5,
      ang:Math.PI/5+(Math.random()-.5)*.22,
      life:1, dec:.022+Math.random()*.016,
    });
  }
  for(let i=shooters.length-1;i>=0;i--){
    const s=shooters[i]; s.life-=s.dec;
    if(s.life<=0){shooters.splice(i,1);continue;}
    const dx=Math.cos(s.ang)*s.len, dy=Math.sin(s.ang)*s.len;
    const sg=cx.createLinearGradient(s.x,s.y,s.x-dx,s.y-dy);
    sg.addColorStop(0,`rgba(255,255,255,${s.life*.8})`); sg.addColorStop(1,'transparent');
    cx.strokeStyle=sg; cx.lineWidth=1.5;
    cx.beginPath(); cx.moveTo(s.x,s.y); cx.lineTo(s.x-dx,s.y-dy); cx.stroke();
    s.x+=Math.cos(s.ang)*s.spd; s.y+=Math.sin(s.ang)*s.spd;
  }

  /* Floating hearts */
  hearts.forEach(p => {
    p.y+=p.vy; p.x+=p.vx+Math.sin(t+p.ph)*.2;
    p.a=Math.min(p.ma,p.a+.001);
    if(p.y<-30){p.y=H+30;p.x=Math.random()*W;p.a=0;}
    cx.globalAlpha=p.a; cx.font=p.s+'px serif';
    cx.fillStyle='#c84020'; cx.fillText('♥',p.x,p.y); cx.globalAlpha=1;
  });

  requestAnimationFrame(frame);
})();

/* ══════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════ */
const heroWrap = document.querySelector('.hero-wrap');
function updateParallax(){
  if(!heroWrap||window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const sy = scrollY;
  if(sy < innerHeight){
    heroWrap.style.transform = `translateY(${sy*.22}px)`;
    heroWrap.style.opacity = Math.max(0, 1-(sy/innerHeight)*1.3);
  }
}


/* ══════════════════════════════════════
   NAV DOTS
══════════════════════════════════════ */
function buildDots(){
  const nav = document.getElementById('dots'); nav.innerHTML='';
  document.querySelectorAll('section').forEach(s=>{
    const d = document.createElement('div');
    d.className='dot'; d.dataset.sid=s.id;
    d.setAttribute('aria-label', 'Ir a sección');
    d.addEventListener('click',()=>s.scrollIntoView({behavior:'smooth'}));
    nav.appendChild(d);
  });
  syncDots();
}
buildDots();

function syncDots(){
  const dots=[...document.querySelectorAll('.dot')];
  const secs=[...document.querySelectorAll('section')];
  let cur=0;
  secs.forEach((s,i)=>{ if(s.getBoundingClientRect().top<innerHeight*.6) cur=i; });
  dots.forEach((d,i)=>d.classList.toggle('on',i===cur));
}

/* ══════════════════════════════════════
   SCROLL — reveal + progress
══════════════════════════════════════ */
function onScroll(){
  const sy=scrollY, total=document.body.scrollHeight-innerHeight;
  document.getElementById('bar').style.width=(sy/total*100)+'%';
  syncDots();
  updateParallax();

  document.querySelectorAll('section').forEach(s=>{
    if(s.getBoundingClientRect().top<innerHeight*.78){
      s.classList.add('vis');
      s.querySelectorAll('.cl-pre,.cl-main,.cl-heart,.cl-sign').forEach(el=>el.classList.add('in'));
    }
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

/* ══════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════ */
if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{
      btn.style.transition='transform .1s ease,color .3s';
    });
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const dx=e.clientX-(r.left+r.width/2);
      const dy=e.clientY-(r.top+r.height/2);
      btn.style.transform=`translate(${dx*.28}px,${dy*.28}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave',()=>{
      btn.style.transition='transform .55s cubic-bezier(.16,1,.3,1),color .3s';
      btn.style.transform='';
      setTimeout(()=>{ btn.style.transition=''; },560);
    });
  });
}

/* ══════════════════════════════════════
   3D CARD TILT
══════════════════════════════════════ */
if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mouseenter',()=>{
      card.style.transition='transform .1s ease,box-shadow .3s ease,background .3s';
    });
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transition='transform .7s cubic-bezier(.16,1,.3,1),opacity .75s ease,box-shadow .3s ease,background .3s';
      card.style.transform='';
      setTimeout(()=>{ card.style.transition=''; },700);
    });
  });
}

/* ══════════════════════════════════════
   RSVP
══════════════════════════════════════ */
function rsvp(yes){
  document.getElementById('btnGroup').style.display='none';
  const r=document.getElementById('rsvpResp'); r.classList.add('show');
  if(yes){
    document.getElementById('respIcon').textContent='✦';
    document.getElementById('respTx').textContent='¡Nos vamos juntos!';
    document.getElementById('respSb').textContent='13 al 15 de Junio — solo tú y yo.';
    document.getElementById('packBtn').style.display='inline-flex';
    document.getElementById('resetBtn').style.display='none';
    showToast('¡Escapada confirmada!');
    burst();
    setTimeout(openModal,1300);
  } else {
    document.getElementById('respIcon').textContent='→';
    document.getElementById('respTx').textContent='Tómate el tiempo que necesites.';
    document.getElementById('respSb').textContent='El plan te espera cuando estés listo.';
    document.getElementById('packBtn').style.display='none';
    document.getElementById('resetBtn').style.display='inline-block';
    showToast('Cuando quieras, aquí estaré');
  }
}

function rsvpReset(){
  document.getElementById('rsvpResp').classList.remove('show');
  document.getElementById('btnGroup').style.display='flex';
  document.getElementById('resetBtn').style.display='none';
  document.getElementById('packBtn').style.display='none';
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
function openModal(){ document.getElementById('modal').classList.add('open'); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg; el.className='on';
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('on'),3600);
}

/* ══════════════════════════════════════
   CLUE NOTIFICATIONS
══════════════════════════════════════ */
(function(){
  const TRIP = new Date('2026-06-13T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const MS = 86400000;
  const daysUntil = Math.ceil((TRIP - today) / MS);

  const clues = [
    { days:9, icon:'🗺️', msg:'La cuenta regresiva comenzó. Hay un lugar que lleva tiempo esperándote.' },
    { days:7, icon:'🌤️', msg:'El sol calienta fuerte. La noche refresca. Empaca las dos versiones de ti.' },
    { days:5, icon:'♨️',  msg:'Habrá agua — pero más caliente de lo que imaginas. Y solo para nosotros dos.' },
    { days:3, icon:'🎨', msg:'Un pueblo pintado de colores que no olvidarás. Ya casi descubres cuál.' },
    { days:1, icon:'✦',  msg:'Mañana. Solo empaca. De todo lo demás me encargo yo.' },
  ];

  const feed = document.getElementById('notifFeed');
  if(!feed) return;

  clues.forEach(c => {
    const unlocked = daysUntil <= c.days;
    const unlockDate = new Date(TRIP.getTime() - c.days * MS);
    let timeLabel;
    if(unlocked){
      const daysAgo = Math.floor((today - unlockDate) / MS);
      timeLabel = daysAgo <= 0 ? 'hoy' : daysAgo === 1 ? 'ayer' : `hace ${daysAgo} días`;
    } else {
      const d = Math.ceil((unlockDate - today) / MS);
      timeLabel = `en ${d} día${d !== 1 ? 's' : ''}`;
    }
    const card = document.createElement('div');
    card.className = 'notif-card' + (unlocked ? '' : ' locked');
    card.innerHTML = `
      <div class="notif-app-icon">${unlocked ? c.icon : '🔒'}</div>
      <div class="notif-body">
        <div class="notif-header">
          <span class="notif-app">Escapada · Pista secreta</span>
          <span class="notif-time">${timeLabel}</span>
        </div>
        <p class="notif-msg">${c.msg}</p>
      </div>`;
    feed.appendChild(card);
  });

  document.querySelectorAll('.modal-item[data-unlock]').forEach(item => {
    if(daysUntil > parseInt(item.dataset.unlock))
      item.querySelector('.modal-item-clue').classList.add('clue-locked');
  });
})();

/* ══════════════════════════════════════
   CONFETTI BURST
══════════════════════════════════════ */
function burst(){
  const palette=['#f05a3a','#f57a5a','#f0c060','#f5d888','#edf2f8','#c84020'];
  for(let i=0;i<75;i++){
    const el=document.createElement('div');
    const sz=3+Math.random()*6;
    const rect=Math.random()>.45;
    Object.assign(el.style,{
      position:'fixed',left:'50%',top:'50%',
      width:rect?sz+'px':sz*.6+'px',
      height:rect?sz*.4+'px':sz*.6+'px',
      borderRadius:rect?'0':'50%',
      background:palette[i%palette.length],
      pointerEvents:'none',zIndex:9000,
    });
    document.body.appendChild(el);
    const a=Math.random()*Math.PI*2, d=90+Math.random()*260;
    const rot=Math.random()*720;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      Object.assign(el.style,{
        transition:`transform ${.6+Math.random()*.95}s cubic-bezier(.2,.8,.3,1),opacity ${.7+Math.random()*.5}s ease ${Math.random()*.3}s`,
        transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) rotate(${rot}deg) scale(${.4+Math.random()})`,
        opacity:'0',
      });
      setTimeout(()=>el.remove(),1700);
    }));
  }
}
