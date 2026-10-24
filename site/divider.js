(() => {
'use strict';
const section=document.querySelector('#permasalahan');
if(!section)return;
const title=section.querySelector('h2'),lines=[...section.querySelectorAll('.divider-line>span')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>x*x*(3-2*x);
function render(){
queued=false;
const still=reduced.matches||document.body.classList.contains('paused')||document.body.classList.contains('reduced');
if(still){title.style.transform='none';lines.forEach(el=>{el.style.opacity='1';el.style.transform='none';});return;}
const rect=section.getBoundingClientRect();
const hold=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
const entrance=clamp((innerHeight-rect.top)/(innerHeight*.72));
title.style.transform='scale('+(0.97+0.03*ease(clamp(hold/.6))).toFixed(4)+')';
lines.forEach((el,i)=>{
const t=ease(clamp((entrance-i*.12)/(1-i*.12)));
el.style.opacity=String(.4+.6*t);
el.style.transform='translate3d('+((i?1:-1)*(1-t)*24).toFixed(2)+'px,'+((1-t)*(i?38:26)).toFixed(2)+'px,0)';
});
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);reduced.addEventListener('change',schedule);
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
render();
})();