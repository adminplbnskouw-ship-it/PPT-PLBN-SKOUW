(() => {
'use strict';
const section=document.querySelector('#zonasi');
if(!section)return;
const final=document.querySelector('#map-final');
const pieces=[...section.querySelectorAll('.map-piece')];
const strokes=[...section.querySelectorAll('.map-lines polygon')];
const annotations=section.querySelector('.map-annotations');
const phase=document.querySelector('#map-phase');
const name=document.querySelector('#map-zone-name');
const detail=document.querySelector('#map-zone-detail');
const instruction=document.querySelector('#map-instruction');
const media=matchMedia('(prefers-reduced-motion: reduce)');
const zones=[{"id":"pendukung","name":"Zona Pendukung","area":"2,3 hektar","body":"Masjid, Pasar Blok D, Gedung SPPG, dan Gedung Pengelola.","color":"#009bee","start":0.1,"end":0.29,"points":"380,528 395,216 490,216 490,114 573,114 578,220 657,220 659,174 832,174 836,132 1088,138 1084,311 1074,330 959,365 946,518"},{"id":"subinti","name":"Zona Sub Inti","area":"2,7 hektar","body":"Mess Pegawai, Rumah Dinas, dan Gereja PLBN Skouw.","color":"#00c83c","start":0.29,"end":0.47,"points":"964,490 966,366 1083,331 1096,222 1317,224 1343,241 1360,336 1414,337 1419,452 1119,488"},{"id":"inti","name":"Zona Inti","area":"3,3 hektar","body":"Kawasan inti pelayanan lintas batas negara.","color":"#f0202b","start":0.47,"end":0.64,"points":"1119,499 1324,463 1590,444 1840,448 1994,470 1996,653 1178,712 1143,701 1119,672"},{"id":"tni","name":"Barak TNI","area":"1,9 hektar","body":"Kawasan barak TNI di dalam kompleks PLBN Skouw.","color":"#9800f2","start":0.64,"end":0.79,"points":"959,497 1108,499 1110,670 1133,705 1176,720 1241,715 1310,945 1079,960 1051,948 1038,775 969,720 957,695"}];
let layout={top:0,travel:1},queued=false,last=-2;
const clamp=x=>Math.max(0,Math.min(1,x));
const range=(p,a,b)=>clamp((p-a)/(b-a));
const ease=x=>x*x*(3-2*x);
function staticMode(){return media.matches||document.body.classList.contains('paused')||document.body.classList.contains('reduced');}
function measure(){const box=section.getBoundingClientRect();layout={top:box.top+scrollY,travel:Math.max(1,section.offsetHeight-innerHeight)};}
function render(){
queued=false;
const p=staticMode()?1:clamp((scrollY-layout.top)/layout.travel);
const finished=ease(range(p,.91,.95));
final.style.opacity=String(finished);
annotations.style.opacity=String(1-finished);
pieces.forEach(el=>{
const amount=ease(range(p,Number(el.dataset.a),Number(el.dataset.b)));
const image=el.querySelector('img');
image.style.clipPath='inset(0 '+((1-amount)*100).toFixed(3)+'% 0 0)';
image.style.opacity=String(clamp(amount*4));
});
strokes.forEach(el=>el.style.strokeDashoffset=String(1-ease(range(p,Number(el.dataset.a),Number(el.dataset.b)))));
const idx=p<.10?-1:p<.29?0:p<.47?1:p<.64?2:p<.79?3:p<.91?4:5;
if(idx!==last){
last=idx;
const zone=zones[idx];
phase.textContent=zone?zone.name+' · '+zone.area:idx===-1?'Foto udara kawasan':idx===4?'Fasilitas dan diagram luasan':'Peta zonasi lengkap';
name.textContent=zone?zone.name+' · '+zone.area:idx===-1?'Kawasan PLBN Skouw':idx===4?'Fasilitas penunjang':'Total luasan 10,7 hektar';
detail.textContent=zone?zone.body:idx===-1?'Scroll untuk mengenali pembagian zona dan fasilitasnya.':idx===4?'Polsubsektor Skouw Perbatasan RI–PNG, Terminal Barang Internasional RI–PNG, dan Gudang.':'Seluruh batas, masking warna, label fasilitas, dan diagram telah tampil sesuai gambar referensi.';
}
instruction.textContent=p>=.95?'Klik tag tempat untuk melihat atau menambahkan foto':'Scroll untuk membuka zonasi · klik tag yang sudah muncul';
section.dispatchEvent(new CustomEvent('mapprogress',{detail:p}));
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
document.querySelector('#map-replay').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top,behavior:'instant'});render();});
document.querySelector('#map-complete').addEventListener('click',e=>{e.preventDefault();measure();window.scrollTo({top:layout.top+layout.travel*.97,behavior:'instant'});render();});
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule();});
addEventListener('pageshow',()=>{measure();render();});
media.addEventListener('change',()=>{measure();render();});
new MutationObserver(()=>{measure();render();}).observe(document.body,{attributes:true,attributeFilter:['class']});
final.addEventListener('load',()=>{measure();schedule();});
measure();render();
})();