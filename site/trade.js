(() => {
'use strict';
const section=document.querySelector('#perdagangan');
if(!section)return;
const pieces=[...section.querySelectorAll('.trade-reveal')];
const bars=[...section.querySelectorAll('.trade-bar-mask')];
const frames=document.querySelector('#trade-chart-frames'),edge=document.querySelector('#trade-edge');
const final=document.querySelector('#trade-final'),visual=section.querySelector('.trade-visual');
const title=document.querySelector('#trade-summary-title'),detail=document.querySelector('#trade-summary-detail'),status=document.querySelector('#trade-status');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let layout={top:0,travel:1},queued=false,last=-1;
const clamp=x=>Math.max(0,Math.min(1,x));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=x=>x*x*(3-2*x);
const still=()=>media.matches||document.body.classList.contains('paused')||document.body.classList.contains('reduced');
function measure(){const r=section.getBoundingClientRect();layout={top:r.top+scrollY,travel:Math.max(1,section.offsetHeight-innerHeight)};}
function render(){
queued=false;const p=still()?1:clamp((scrollY-layout.top)/layout.travel);
pieces.forEach(el=>{const t=ease(range(p,Number(el.dataset.a),Number(el.dataset.b)));el.style.opacity=String(t);el.setAttribute('transform','translate(0 '+((1-t)*Number(el.dataset.dy)).toFixed(3)+')');});
frames.style.opacity=String(ease(range(p,.23,.32)));
bars.forEach(el=>{const center=Number(el.dataset.center),edge=Number(el.dataset.edge),t=ease(range(p,Number(el.dataset.a),Number(el.dataset.b)));const width=Math.abs(edge-center)*t;el.setAttribute('x',String(edge<center?center-width:center));el.setAttribute('width',String(width));});
edge.style.opacity=String(ease(range(p,.80,.91)));
const end=ease(range(p,.91,.96));final.style.opacity=String(end);visual.style.opacity=String(1-end);visual.style.display=end===1?'none':'block';
const phase=p<.15?0:p<.3?1:p<.55?2:p<.72?3:p<.86?4:5;
if(last!==phase){last=phase;const info=[
['Pelintas dan Perdagangan','Ringkasan Januari 2025 – September 2026.'],
['250.543 datang · 251.674 berangkat','Total ekspor Rp143,68 miliar dan impor Rp4,07 miliar.'],
['Pergerakan pelintas bulanan','Kedatangan ditampilkan ke kiri, keberangkatan ke kanan.'],
['Perdagangan lintas batas','Ekspor dan impor bulanan disajikan dalam Rp miliar.'],
['Sorotan utama','Puncak pelintas: Desember 2025. Ekspor tertinggi: Agustus 2025. Impor tertinggi: September 2026.'],
['Komoditas dominan','Ekspor: kebutuhan rumah tangga, sparepart, bahan konstruksi, dan makanan. Impor: vanili, kulit kayu masohi, minuman dan makanan ringan.']
][phase];title.textContent=info[0];detail.textContent=info[1];}
status.textContent=p>=.96?'Ringkasan lengkap · lanjut scroll ↓':'Scroll untuk membuka data pelintas dan perdagangan ↓';
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
document.querySelector('#trade-replay').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top,behavior:'instant'});render();});
document.querySelector('#trade-complete').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top+layout.travel*.98,behavior:'instant'});render();});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule();});
addEventListener('pageshow',()=>{measure();render();});
media.addEventListener('change',()=>{measure();render();});
new MutationObserver(()=>{measure();render();}).observe(document.body,{attributes:true,attributeFilter:['class']});
measure();render();
})();