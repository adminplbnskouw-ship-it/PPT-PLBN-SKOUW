(() => {
'use strict';
const section=document.querySelector('#pegawai');
if(!section)return;
const reveals=[...section.querySelectorAll('.staff-reveal')];
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
const end=ease(range(p,.95,.98));
final.style.opacity=String(end);visual.style.opacity=String(1-end);visual.style.display=end===1?'none':'block';
const phase=p<.14?0:p<.38?1:p<.54?2:p<.73?3:p<.95?4:5;
if(last!==phase){last=phase;const text=[
['Komposisi Pegawai dan Petugas Pengelola','Pegawai internal, tenaga pendukung operasional, dan petugas CIQ di PLBN Skouw.'],
['30 pegawai internal','17 PNS aktif, 6 PPPK, dan 7 P3K Paruh Waktu.'],
['82 tenaga pendukung operasional','Tenaga Pendukung Operasional (TPO) mendukung operasional PLBN Skouw.'],
['Kebersihan, teknisi, dan keamanan','46 petugas kebersihan, 8 teknisi, dan 28 petugas keamanan.'],
['Petugas CIQ di PLBN Skouw','Bea dan Cukai 8 orang; Imigrasi 21 orang; Karantina Kesehatan 8 orang; Karantina Hewan, Ikan dan Tumbuhan 6 orang.'],
['Komposisi pegawai dan petugas lengkap','30 pegawai internal dan 82 TPO, serta rincian petugas CIQ di PLBN Skouw.']
][phase];title.textContent=text[0];detail.textContent=text[1];}
status.textContent=p>=.98?'Komposisi lengkap · lanjut scroll ↓':'Scroll untuk menampilkan komposisi pegawai dan petugas ↓';
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
document.querySelector('#staff-replay').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top,behavior:'instant'});render();});
document.querySelector('#staff-complete').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top+layout.travel*.99,behavior:'instant'});render();});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule();});
addEventListener('pageshow',()=>{measure();render();});
media.addEventListener('change',()=>{measure();render();});
new MutationObserver(()=>{measure();render();}).observe(document.body,{attributes:true,attributeFilter:['class']});
measure();render();
})();