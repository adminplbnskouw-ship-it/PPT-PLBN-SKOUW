(() => {
'use strict';
const section=document.querySelector('#negara');
if(!section)return;
const reveals=[...section.querySelectorAll('.country-reveal')],bars=[...section.querySelectorAll('.country-bar')],labels=[...section.querySelectorAll('.country-label')];
const frame=document.querySelector('#country-chart-frame'),final=document.querySelector('#country-final'),visual=section.querySelector('.countries-visual');
const title=document.querySelector('#country-summary-title'),detail=document.querySelector('#country-summary-detail'),status=document.querySelector('#country-status');
const media=matchMedia('(prefers-reduced-motion: reduce)');
const countries=[["Malaysia",234,351],["China",81,134],["Philippines",55,86],["Myanmar",20,34],["United States Of America",9,16],["Australia",10,11],["India",10,8],["Brazil",2,3],["Canada",2,3],["Ecuador",2,3]];
let layout={top:0,travel:1},queued=false,last=-99;
const clamp=x=>Math.max(0,Math.min(1,x));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=x=>x*x*(3-2*x);
const still=()=>media.matches||document.body.classList.contains('paused')||document.body.classList.contains('reduced');
function measure(){const r=section.getBoundingClientRect();layout={top:r.top+scrollY,travel:Math.max(1,section.offsetHeight-innerHeight)};}
function render(){
queued=false;const p=still()?1:clamp((scrollY-layout.top)/layout.travel);
reveals.forEach(el=>{const t=ease(range(p,Number(el.dataset.a),Number(el.dataset.b)));el.style.opacity=String(t);el.setAttribute('transform','translate(0 '+((1-t)*22).toFixed(3)+')');});
frame.style.opacity=String(ease(range(p,.21,.30)));
bars.forEach(el=>{const c=Number(el.dataset.center),edge=Number(el.dataset.edge),t=ease(range(p,Number(el.dataset.a),Number(el.dataset.b))),w=Math.abs(edge-c)*t;el.setAttribute('x',String(edge<c?c-w:c));el.setAttribute('width',String(w));});
labels.forEach(el=>el.setAttribute('height',String(41.95*ease(range(p,Number(el.dataset.a),Number(el.dataset.b))))));
const end=ease(range(p,.92,.97));final.style.opacity=String(end);visual.style.opacity=String(1-end);visual.style.display=end===1?'none':'block';
const index=p<.28?-2:p>=.78?10:Math.min(9,Math.floor(range(p,.28,.75)*10));
if(last!==index){last=index;if(index===-2){title.textContent='425 berangkat · 649 datang';detail.textContent='Selain Papua New Guinea · Januari–Mei 2026. Rasio kedatangan terhadap keberangkatan 1,53 kali.';}else if(index===10){title.textContent='Malaysia berada di urutan pertama';detail.textContent='Diikuti China dan Philippines. Total kedatangan lebih tinggi daripada keberangkatan.';}else{const [name,out,inc]=countries[index];title.textContent=name;detail.textContent=out+' keberangkatan · '+inc+' kedatangan pada Januari–Mei 2026.';}}
status.textContent=p>=.97?'Perbandingan lengkap · lanjut scroll ↓':'Scroll untuk membandingkan pelintas tiap negara ↓';
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
document.querySelector('#country-replay').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top,behavior:'instant'});render();});
document.querySelector('#country-complete').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top+layout.travel*.985,behavior:'instant'});render();});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{measure();schedule();});addEventListener('pageshow',()=>{measure();render();});media.addEventListener('change',()=>{measure();render();});
new MutationObserver(()=>{measure();render();}).observe(document.body,{attributes:true,attributeFilter:['class']});
measure();render();
})();