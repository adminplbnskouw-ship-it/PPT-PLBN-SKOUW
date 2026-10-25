(() => {
  'use strict';
  document.querySelectorAll('.staff-canvas,.map-canvas').forEach(figure=>{
    const image=figure.querySelector('.staff-final,.map-final');
    if(!image)return;
    const source=image.getAttribute('src'),path=new URL(source,document.baseURI).pathname;
    const panel=document.createElement('div');panel.className='slide-media-status';panel.setAttribute('role','status');
    const message=document.createElement('p'),retry=document.createElement('button');retry.type='button';retry.textContent='Coba muat lagi';retry.hidden=true;panel.append(message,retry);figure.append(panel);
    let automaticRetry=false,timer;
    function pending(){figure.dataset.imageState='loading';figure.setAttribute('aria-busy','true');panel.hidden=false;message.textContent='Memuat gambar slide…';retry.hidden=true;}
    function ready(){if(!image.naturalWidth)return;clearTimeout(timer);figure.dataset.imageState='ready';figure.setAttribute('aria-busy','false');panel.hidden=true;}
    function reload(){clearTimeout(timer);pending();const next=new URL(source,document.baseURI);next.searchParams.set('reload',String(Date.now()));figure.querySelectorAll('img,image').forEach(el=>{const attribute=el.tagName.toLowerCase()==='image'?'href':'src';const value=el.getAttribute(attribute);if(value&&new URL(value,document.baseURI).pathname===path)el.setAttribute(attribute,next.href);});}
    function failed(){figure.dataset.imageState='error';figure.setAttribute('aria-busy','false');panel.hidden=false;message.textContent='Gambar belum berhasil dimuat. Periksa koneksi lalu coba lagi.';retry.hidden=false;if(!automaticRetry){automaticRetry=true;timer=setTimeout(reload,1500);}}
    retry.addEventListener('click',reload);image.addEventListener('load',ready);image.addEventListener('error',failed);pending();if(image.complete){if(image.naturalWidth)ready();else failed();}
  });
})();
