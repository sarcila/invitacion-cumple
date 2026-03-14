/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const curEl=document.getElementById('cur'),ringEl=document.getElementById('cur-ring');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;curEl.style.left=mx+'px';curEl.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ringEl.style.left=rx+'px';ringEl.style.top=ry+'px';requestAnimationFrame(loop)})();

/* ══════════════════════════════════════
   CANVAS — stars + floating glyphs
══════════════════════════════════════ */
const cv=document.getElementById('bg'),cx=cv.getContext('2d');
let W,H;
function rsz(){W=cv.width=innerWidth;H=cv.height=innerHeight}
window.addEventListener('resize',rsz);rsz();

const stars=Array.from({length:200},()=>({
  x:Math.random()*W,y:Math.random()*H,r:.2+Math.random()*1.1,
  a:Math.random(),da:(Math.random()-.5)*.007,
  vx:(Math.random()-.5)*.07,vy:(Math.random()-.5)*.07
}));
const GLYPHS=['♥','✦','·','❧'];
const parts=Array.from({length:30},()=>({
  x:Math.random()*W,y:Math.random()*H+H,
  g:GLYPHS[Math.floor(Math.random()*4)],
  s:9+Math.random()*14,a:0,
  vy:-.22-Math.random()*.3,vx:(Math.random()-.5)*.25,
  ma:.1+Math.random()*.18,ph:Math.random()*Math.PI*2
}));
let t=0;
(function frame(){
  cx.clearRect(0,0,W,H);t+=.011;
  [[W*.18,H*.28,'rgba(130,20,55,.09)'],[W*.82,H*.72,'rgba(100,70,15,.07)']].forEach(([x,y,col])=>{
    const g=cx.createRadialGradient(x,y,0,x,y,W*.4);
    g.addColorStop(0,col);g.addColorStop(1,'transparent');
    cx.fillStyle=g;cx.fillRect(0,0,W,H);
  });
  stars.forEach(s=>{
    s.a+=s.da;if(s.a>1||s.a<0)s.da*=-1;
    s.x+=s.vx;s.y+=s.vy;
    if(s.x<0)s.x=W;if(s.x>W)s.x=0;if(s.y<0)s.y=H;if(s.y>H)s.y=0;
    cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(248,240,220,${s.a*.55})`;cx.fill();
  });
  parts.forEach(p=>{
    p.y+=p.vy;p.x+=p.vx+Math.sin(t+p.ph)*.28;p.a=Math.min(p.ma,p.a+.0012);
    if(p.y<-40){p.y=H+40;p.x=Math.random()*W;p.a=0}
    cx.globalAlpha=p.a;cx.font=p.s+'px serif';cx.fillStyle='#c0516a';cx.fillText(p.g,p.x,p.y);cx.globalAlpha=1;
  });
  requestAnimationFrame(frame);
})();

/* ══════════════════════════════════════
   NAV DOTS
══════════════════════════════════════ */
function buildDots(){
  const nav=document.getElementById('dots');
  nav.innerHTML='';
  document.querySelectorAll('section').forEach(s=>{
    const d=document.createElement('div');
    d.className='dot';d.dataset.sid=s.id;
    d.addEventListener('click',()=>s.scrollIntoView({behavior:'smooth'}));
    nav.appendChild(d);
  });
  syncDots();
}
buildDots();

function syncDots(){
  const navDots=[...document.querySelectorAll('.dot')];
  const secs=visibleSections();
  let cur=0;
  secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.6)cur=i});
  navDots.forEach((d,i)=>d.classList.toggle('on',i===cur));
}

function visibleSections(){
  return [...document.querySelectorAll('section')];
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function onScroll(){
  const sy=scrollY,total=document.body.scrollHeight-innerHeight;
  document.getElementById('bar').style.width=(sy/total*100)+'%';
  syncDots();

  document.querySelectorAll('section').forEach(s=>{
    if(s.getBoundingClientRect().top<innerHeight*.75){
      s.classList.add('vis');
      s.querySelectorAll('.msg-tag,.ml,.orn,.di,.rsvp-col,.info-pill').forEach(el=>el.classList.add('vis'));

      s.querySelectorAll('.cl-pre,.cl-main,.cl-heart,.cl-sign').forEach(el=>el.classList.add('in'));
    }
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

/* ══════════════════════════════════════
   RSVP
══════════════════════════════════════ */
function rsvp(which,yes){
  document.getElementById('btnG1').style.display='none';
  const r=document.getElementById('resp1');r.classList.add('show');

  if(yes){
    document.getElementById('resp1-icon').textContent='♥';
    document.getElementById('resp1-tx').textContent='¡Nos vamos juntos!';
    document.getElementById('resp1-sb').textContent='21 al 23 de Marzo — solo tú y yo.';
    showToast('¡Escapada confirmada! 🌿');
    burst();
    setTimeout(openModal,1200);
  } else {
    document.getElementById('resp1-icon').textContent='🥀';
    document.getElementById('resp1-tx').textContent='Tómate el tiempo que necesites.';
    document.getElementById('resp1-sb').textContent='El plan te espera cuando estés lista.';
    showToast('Cuando quieras, aquí estaré 💌');
  }
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
function openModal(){
  document.getElementById('modal').classList.add('open');
}
function closeModal(){
  document.getElementById('modal').classList.remove('open');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.className='on';
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3600);
}

/* ══════════════════════════════════════
   BURST
══════════════════════════════════════ */
function burst(){
  const palette=['#b83a52','#c8a96e','#f2d7dc','#f8f2e9','#d4607a'];
  for(let i=0;i<65;i++){
    const el=document.createElement('div');
    Object.assign(el.style,{position:'fixed',left:'50%',top:'50%',width:'5px',height:'5px',borderRadius:'50%',background:palette[i%palette.length],pointerEvents:'none',zIndex:9000});
    document.body.appendChild(el);
    const a=Math.random()*Math.PI*2,d=70+Math.random()*230;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      Object.assign(el.style,{
        transition:`transform ${.55+Math.random()*.8}s cubic-bezier(.2,.8,.3,1),opacity ${.7+Math.random()*.5}s ease ${Math.random()*.25}s`,
        transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(${.4+Math.random()})`,
        opacity:'0'
      });
      setTimeout(()=>el.remove(),1500);
    }));
  }
}
