(() => {
'use strict';
const $ = s => document.querySelector(s);
const journey = $('#journey'), intro = $('.intro-layer'), main = $('.main-layer'), curtain = $('.transition-curtain');
const chapters = [...document.querySelectorAll('.chapter')];
const count = $('#chapterCount'), hint = $('#scrollHint'), toggle = $('#motion');
const captions = ['Gerbang PLBN Skouw','Kota Jayapura · Papua','Diresmikan 9 Mei 2017','Area pelayanan dan pemeriksaan','Akses ke Papua Nugini'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let heldProgress = 0, heldMapProgress = null, heldSectionId = null;
let paused = false, queued = false, layout = {top:0, travel:1}, currentChapter = -1;
const clamp = x => Math.max(0, Math.min(1,x));
const smooth = x => { x=clamp(x); return x*x*(3-2*x); };
const segment = (p,a,b) => clamp((p-a)/(b-a));
const disabled = () => paused || reduced.matches;
function scrub(video) {
  let target=0, ready=false;
  function commit() {
    if (!ready || video.seeking || disabled()) return;
    if (Math.abs(video.currentTime-target)>.035) video.currentTime=target;
  }
  const metadata = () => { ready=Number.isFinite(video.duration)&&video.duration>0; render(); commit(); };
  video.addEventListener('loadedmetadata',metadata);
  video.addEventListener('seeked',commit);
  ['loadeddata','canplay','progress'].forEach(event=>video.addEventListener(event,commit));
  // Buffer the original file once on hosted pages so seeking does not depend on range delivery.
  if(typeof location!=='undefined' && /^https?:$/.test(location.protocol)) {
    const url=video.getAttribute('src');
    fetch(url).then(response=>{if(!response.ok)throw Error('video');return response.blob();})
      .then(blob=>{video.src=URL.createObjectURL(blob);video.load();})
      .catch(()=>{/* Direct video source remains available, including offline/file previews. */});
  }
  video.addEventListener('error',()=>{ $('#loadError').hidden=false; });
  if(video.readyState>=1) metadata();
  return {set(progress){if(Number.isFinite(video.duration)){target=clamp(progress)*Math.max(0,video.duration-.04);commit();}},video};
}
// Create controllers after the render function is defined; metadata callbacks run asynchronously.
let opening, building;
function measure() {
  const rect=journey.getBoundingClientRect();
  layout={top:rect.top+scrollY,travel:Math.max(1,journey.offsetHeight-innerHeight)};
}
function progress(){return clamp((scrollY-layout.top)/layout.travel);}
function render() {
  queued=false;
  if(disabled() || !opening || !building) return;
  const p=progress(), handoff=segment(p,.18,.28), scene=segment(p,.245,1);
  opening.set(segment(p,0,.195));
  building.set(scene);
  intro.style.opacity=String(1-smooth(segment(handoff,.1,.9)));
  intro.style.transform='scale('+(1-.035*handoff)+')';
  main.style.clipPath='inset(0 '+((1-smooth(handoff))*100).toFixed(3)+'% 0 0)';
  // A pale angled panel bridges the two videos without exposing a blank frame.
  curtain.style.transform='translateX('+(-115+230*smooth(handoff))+'%) skewX(-10deg)';
  curtain.style.opacity=(handoff>0&&handoff<1)?'1':'0';
  const isPhone=innerWidth<=760;
  let active=-1;
  chapters.forEach((el,i)=>{
    const start=Number(el.dataset.start),end=Number(el.dataset.end);
    const into=i===0?1:segment(scene,start-.04,start);
    const out=i===chapters.length-1?0:segment(scene,end-.035,end);
    const visibility=smooth(into)*(1-smooth(out))*smooth(segment(p,.245,.285));
    const shift=(1-smooth(into))*34-smooth(out)*22;
    el.style.opacity=String(visibility);
    el.style.transform='translate3d('+((1-smooth(into))*-18).toFixed(2)+'px,'+(isPhone?shift.toFixed(2)+'px':'calc(-50% + '+shift.toFixed(2)+'px)')+',0)';
    el.classList.toggle('is-current',visibility>.5);
    if(scene>=start&&scene<=end)active=i;
  });
  if(p<.245)active=-1;
  if(active!==currentChapter) {
    currentChapter=active;
    count.textContent=active<0?'Pembuka':(active+1)+' dari '+chapters.length;
    if(active>=0)$('#scene-caption').textContent=captions[active];
  }
  hint.textContent=p>.985?'Lanjut untuk membaca informasi ↓':p<.18?'Scroll untuk memulai ↓':p<.28?'Menuju Skouw ↓':'Scroll untuk menjelajah ↓';
}
function schedule(){if(!queued&&!disabled()){queued=true;requestAnimationFrame(render);}}
function mode() {
  document.body.classList.toggle('paused',paused);
  document.body.classList.toggle('reduced',reduced.matches);
  toggle.disabled=reduced.matches;
  toggle.textContent=reduced.matches?'Mode tanpa animasi':paused?'Aktifkan animasi':'Jeda animasi';
  toggle.setAttribute('aria-pressed',String(disabled()));
  if(disabled()) {
    [opening?.video,building?.video].forEach(v=>{if(v){v.pause();v.controls=true;}});
    chapters.forEach(el=>el.classList.add('is-current'));
  } else {
    [opening?.video,building?.video].forEach(v=>{if(v){v.pause();v.controls=false;}});
  }
  measure();render();
}
opening=scrub($('#openingVideo'));building=scrub($('#mainVideo'));
toggle.addEventListener('click',()=>{
  if(reduced.matches){paused=true;toggle.textContent='Membaca tanpa animasi';return;}
  const map=paused?document.querySelector(heldSectionId||'#zonasi'):['#zonasi','#pegawai','#perdagangan','#dalam-angka','#negara','#pelayanan','#keimigrasian','#permasalahan','#air-bersih','#terminal-barang','#pengembangan-ekonomi','#konektivitas','#sistem-pembayaran','#edukasi-perbatasan','#penutup'].map(id=>document.querySelector(id)).find(el=>{if(!el)return false;const r=el.getBoundingClientRect();return r.top<=0&&r.bottom>=innerHeight;});
  if(!paused){
    heldProgress=progress();heldMapProgress=null;heldSectionId=map?'#'+map.id:null;
    if(map){const r=map.getBoundingClientRect();if(r.top<=0&&r.bottom>=innerHeight)heldMapProgress=clamp(-r.top/Math.max(1,map.offsetHeight-innerHeight));}
  }
  paused=!paused;mode();
  if(map&&heldMapProgress!==null){const r=map.getBoundingClientRect();window.scrollTo({top:r.top+scrollY+(paused?0:heldMapProgress*Math.max(1,map.offsetHeight-innerHeight)),behavior:'instant'});}
  else if(!paused){window.scrollTo({top:layout.top+heldProgress*layout.travel,behavior:'instant'});render();}
});
$('#start').addEventListener('click',e=>{
  e.preventDefault();
  if(!disabled())window.scrollTo({top:layout.top+layout.travel*.30,behavior:'instant'});
  render();
});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule();});
addEventListener('pageshow',()=>{measure();render();});
reduced.addEventListener('change',mode);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
mode();
})();