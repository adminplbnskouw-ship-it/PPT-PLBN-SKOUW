(() => {
'use strict';
const section=document.querySelector('#pegawai');
if(!section)return;
const reveals=[...section.querySelectorAll('.staff-reveal')];
const ring=document.querySelector('#staff-ring-progress');
const center=document.querySelector('#staff-center-image');
const connectors=document.querySelector('#staff-connectors-layer');
const final=document.querySelector('#staff-final');
const visual=section.querySelector('.staff-visual');
const status=document.querySelector('#staff-status');
const title=document.querySelector('#staff-summary-title');
const detail=document.querySelector('#staff-summary-detail');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let layout={top:0,travel:1},queued=false,last=-1;
const clamp=x=>Math.max(0,Math.min(1,x));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=x=>x*x*(3-2*x);
const still=()=>media.matches||document.body.classList.contains('paused')||document.body.classList.contains('reduced');
function measure(){const r=section.getBoundingClientRect();layout={top:r.top+scrollY,travel:Math.max(1,section.offsetHeight-innerHeight)};}
function render(){
queued=false;
const p=still()?1:clamp((scrollY-layout.top)/layout.travel);
reveals.forEach(el=>{const t=ease(range(p,Number(el.dataset.a),Number(el.dataset.b)));el.style.opacity=String(t);el.setAttribute('transform','translate('+((1-t)*Number(el.dataset.dx)).toFixed(3)+' '+((1-t)*Number(el.dataset.dy)).toFixed(3)+')');});
ring.style.strokeDashoffset=String(1-ease(range(p,.18,.54)));
center.style.opacity=String(ease(range(p,.28,.46)));
connectors.style.opacity=String(ease(range(p,.13,.35)));
const end=ease(range(p,.88,.94));
final.style.opacity=String(end);visual.style.opacity=String(1-end);
const phase=p<.12?0:p<.28?1:p<.54?2:p<.76?3:p<.88?4:5;
if(last!==phase){last=phase;const text=[
['Komposisi Pegawai','PNS aktif, PPPK, dan P3K Paruh Waktu.'],
['17 PNS aktif','56,7% dari total pegawai aktif PLBN Skouw.'],
['30 pegawai aktif','17 PNS dan 13 Non-PNS. Non-PNS mencakup 43,3% dari total.'],
['Rincian 13 Non-PNS','6 PPPK dan 7 P3K Paruh Waktu (P3KPW).'],
['17 + 6 + 7 = 30 orang','Komposisi PNS, PPPK, dan P3K Paruh Waktu.'],
['Total 30 pegawai aktif','17 PNS, 6 PPPK, dan 7 P3K Paruh Waktu.']
][phase];title.textContent=text[0];detail.textContent=text[1];}
status.textContent=p>=.94?'Komposisi lengkap · lanjut scroll ↓':'Scroll untuk menampilkan komposisi pegawai ↓';
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
document.querySelector('#staff-replay').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top,behavior:'instant'});render();});
document.querySelector('#staff-complete').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top+layout.travel*.97,behavior:'instant'});render();});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule();});
addEventListener('pageshow',()=>{measure();render();});
media.addEventListener('change',()=>{measure();render();});
new MutationObserver(()=>{measure();render();}).observe(document.body,{attributes:true,attributeFilter:['class']});
measure();render();
})();