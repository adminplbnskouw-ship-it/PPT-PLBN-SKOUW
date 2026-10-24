(() => {
'use strict';
const section=document.querySelector('#zonasi'),canvas=section?.querySelector('.map-canvas');
if(!canvas)return;
const places=[
 ['sppg','Gedung SPPG',580,60,198,70,.25],['masjid','Masjid Al-Hijrah PLBN Skouw',870,158,205,82,.27],
 ['pasar','Pasar Skouw (Blok D)',590,288,212,83,.28],['rumah-dinas','Rumah Dinas',1180,242,170,65,.41],
 ['mess','Mess Pegawai',1190,356,220,75,.43],['gereja','Gereja PLBN Skouw',995,409,205,71,.45],
 ['polsubsektor','Polsubsektor Skouw Perbatasan RI–PNG',200,335,247,73,.84],
 ['terminal','Terminal Barang Internasional RI–PNG',300,682,320,80,.855],['gudang','Gudang',705,738,180,79,.87],
 ['zona-inti','Zona Inti',1740,324,280,123,.59],['barak-tni','Barak TNI',1370,780,255,106,.755]
];
const layer=document.createElement('div');layer.className='place-hotspots';
const hotspots=[...places,['zona-inti','Zona Inti',875,978,323,124,.65],['barak-tni','Barak TNI',1208,977,346,125,.80]];
for(const [id,name,x,y,w,h,at] of hotspots){const b=document.createElement('button');b.type='button';b.className='place-hotspot';b.dataset.place=id;b.dataset.at=at;b.disabled=true;b.setAttribute('aria-label','Foto '+name);b.title='Lihat atau tambah foto '+name;b.style.cssText=`left:${x/2048*100}%;top:${y/1153*100}%;width:${w/2048*100}%;height:${h/1153*100}%`;const icon=document.createElement('span');icon.textContent='+';icon.setAttribute('aria-hidden','true');b.append(icon);b.addEventListener('click',()=>open(id));layer.append(b);}
canvas.append(layer);
const browse=document.createElement('button');browse.type='button';browse.className='place-browse';browse.textContent='Foto tempat';browse.addEventListener('click',()=>open('sppg'));section.querySelector('.map-controls>div').prepend(browse);
const dialog=document.createElement('dialog');dialog.className='place-dialog';dialog.setAttribute('aria-labelledby','place-dialog-title');
dialog.innerHTML='<div class="place-dialog-head"><div><p class="place-eyebrow">GALERI KAWASAN</p><h2 id="place-dialog-title">Foto tempat</h2></div><button type="button" class="place-close" aria-label="Tutup galeri">×</button></div><label class="place-selector-label">Pilih tempat<select class="place-selector"></select></label><div class="place-gallery-actions"><label class="place-upload">Tambah foto<input type="file" accept="image/jpeg,image/png,image/webp" multiple></label><p>JPG, PNG, WebP · maksimal 8 MB per foto.<br>Tersimpan di website dan tersedia dari perangkat lain.</p></div><p class="place-status" role="status" aria-live="polite"></p><div class="place-grid"></div><button type="button" class="place-more" hidden>Muat foto lainnya</button>';
document.body.append(dialog);
const select=dialog.querySelector('select'),input=dialog.querySelector('input'),status=dialog.querySelector('.place-status'),grid=dialog.querySelector('.place-grid'),more=dialog.querySelector('.place-more');
places.forEach(([id,name])=>select.add(new Option(name,id)));
let active='',cursor=null,loading=null,previousOverflow='',trigger=null,busy=false;
section.addEventListener('mapprogress',e=>{for(const button of layer.children)button.disabled=e.detail<Number(button.dataset.at);});
async function responseJSON(response){const data=await response.json().catch(()=>({error:'Server belum dapat memproses foto.'}));if(!response.ok)throw new Error(data.error||'Foto belum dapat dimuat.');return data;}
function appendPhotos(photos){for(const photo of photos){const a=document.createElement('a');a.className='place-photo';a.href=photo.url;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','Buka '+photo.name);const image=document.createElement('img');image.src=photo.url;image.alt=photo.name;image.loading='lazy';image.addEventListener('error',()=>{image.alt='Foto gagal dimuat. Klik untuk mencoba membuka foto.';});a.append(image);grid.append(a);}}
async function load(append=false){loading?.abort();loading=new AbortController();const id=active;if(!append){grid.replaceChildren();cursor=null;}more.hidden=true;status.textContent='Memuat foto…';
try{const suffix=append&&cursor?'?cursor='+encodeURIComponent(cursor):'';const data=await responseJSON(await fetch('/api/places/'+id+suffix,{signal:loading.signal,cache:'no-store'}));if(active!==id)return;appendPhotos(data.photos);cursor=data.cursor;more.hidden=!cursor;status.textContent=grid.children.length?grid.children.length+' foto · klik foto untuk membuka ukuran penuh.':'Belum ada foto untuk '+select.selectedOptions[0].textContent+'. Klik Tambah foto untuk mengisinya.';}catch(error){if(error.name!=='AbortError')status.textContent=error.message;}}
function open(id){window.open("https://orbit-scroll-journey-241026.lushlyric64.chatgpt.site/?gallery="+encodeURIComponent(id)+"#zonasi","_blank","noopener");return;active=id;select.value=id;dialog.querySelector('h2').textContent=places.find(p=>p[0]===id)[1];if(!dialog.open){trigger=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();}load();}
dialog.querySelector('.place-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{loading?.abort();document.body.style.overflow=previousOverflow;trigger?.focus({preventScroll:true});});
select.addEventListener('change',()=>open(select.value));more.addEventListener('click',()=>load(true));
input.addEventListener('change',async()=>{if(busy)return;const files=[...input.files];input.value='';if(!files.length)return;if(files.length>10){status.textContent='Pilih maksimal 10 foto sekaligus.';return;}if(files.some(f=>f.size>8*1024*1024)){status.textContent='Ukuran setiap foto maksimal 8 MB. Pilih ulang foto yang lebih kecil.';return;}if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type))){status.textContent='Gunakan foto JPG, PNG, atau WebP.';return;}
busy=true;input.disabled=true;select.disabled=true;const id=active;let saved=0;
try{for(const file of files){status.textContent='Menyimpan foto '+(saved+1)+' dari '+files.length+'…';await responseJSON(await fetch('/api/places/'+id+'/photos',{method:'POST',headers:{'Content-Type':file.type,'X-Photo-Name':encodeURIComponent(file.name)},body:file}));saved++;}if(active===id){await load();status.textContent=saved+' foto berhasil disimpan di website.';}}
catch(error){status.textContent=(saved?saved+' foto sudah tersimpan. ':'')+error.message;}
finally{busy=false;input.disabled=false;select.disabled=false;}
});
})();
