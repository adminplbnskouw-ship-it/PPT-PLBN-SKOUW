(() => {
  const gallery=window.skouwGallery;
  if(!gallery)return;
  const card=document.createElement('aside');card.className='place-preview';card.hidden=true;card.setAttribute('aria-label','Pratinjau foto tempat');
  card.innerHTML='<strong></strong><img alt="" hidden><p role="status"></p><button type="button">Buka galeri</button>';
  document.body.append(card);
  const title=card.querySelector('strong'),image=card.querySelector('img'),status=card.querySelector('p');
  let active=null,version=0,timer;
  function hide(){clearTimeout(timer);card.hidden=true;active=null;version++;}
  function later(){timer=setTimeout(hide,180);}
  function position(button){const r=button.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight;let x=r.right+12;if(x+w>innerWidth-12)x=r.left-w-12;if(x<12)x=Math.max(12,Math.min(innerWidth-w-12,r.left));card.style.left=x+'px';card.style.top=Math.max(12,Math.min(innerHeight-h-12,r.top))+'px';}
  async function show(button){if(button.disabled)return;clearTimeout(timer);active=button;const id=button.dataset.place,check=++version;title.textContent=button.getAttribute('aria-label').replace(/^Foto /,'');image.hidden=true;image.removeAttribute('src');status.textContent='Memuat foto…';card.hidden=false;position(button);
    try{const data=await gallery.getPhotos(id);if(check!==version)return;const photo=data.photos?.[0];if(photo){image.alt=photo.name||title.textContent;image.src=photo.url;image.hidden=false;status.textContent=data.photos.length+' foto · klik untuk memperbesar';}else status.textContent='Belum ada foto untuk tempat ini. Tambahkan lewat galeri.';position(button);}catch{if(check===version){status.textContent='Foto belum dapat dimuat. Buka galeri untuk mencoba lagi.';position(button);}}
  }
  image.addEventListener('load',()=>{if(active)position(active);});image.addEventListener('error',()=>{image.hidden=true;status.textContent='Foto gagal dimuat. Silakan buka galeri.';if(active)position(active);});
  document.querySelectorAll('.place-hotspot').forEach(button=>{button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')show(button);});button.addEventListener('pointerleave',later);button.addEventListener('focus',()=>show(button));button.addEventListener('blur',later);button.addEventListener('click',hide);});
  card.addEventListener('pointerenter',()=>clearTimeout(timer));card.addEventListener('pointerleave',later);card.addEventListener('focusin',()=>clearTimeout(timer));card.addEventListener('focusout',later);card.querySelector('button').addEventListener('click',()=>{const id=active?.dataset.place;hide();if(id)gallery.open(id);});
  addEventListener('scroll',hide,{passive:true});addEventListener('resize',hide);addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
})();
