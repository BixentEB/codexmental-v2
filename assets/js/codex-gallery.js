/* CODEX Mental — optional editorial artifact gallery shared by both readers. */
(function(){
 'use strict';
 var activeLightbox=null;
 function closeLightbox(){if(activeLightbox){activeLightbox.remove();activeLightbox=null;document.removeEventListener('keydown',onKey);}}
 function onKey(e){if(e.key==='Escape')closeLightbox();}
 function showImage(src,alt){
  closeLightbox();
  var overlay=document.createElement('div');overlay.className='codex-gallery-lightbox';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Illustration agrandie');
  var img=document.createElement('img');img.src=src;img.alt=alt||'Illustration';
  var close=document.createElement('button');close.type='button';close.className='codex-gallery-close';close.setAttribute('aria-label','Fermer l’image');close.textContent='×';close.addEventListener('click',closeLightbox);
  overlay.appendChild(img);overlay.appendChild(close);overlay.addEventListener('click',function(e){if(e.target===overlay)closeLightbox();});
  document.body.appendChild(overlay);activeLightbox=overlay;document.addEventListener('keydown',onKey);close.focus();
 }
 function decorate(wrapper){
  if(!wrapper||wrapper.dataset.galleryReady)return wrapper;
  wrapper.dataset.galleryReady='true';
  // The wrapper can contain both chapter-local images and intro media outside <article>.
  var images=Array.from(wrapper.querySelectorAll('img')).filter(function(img){
   return img.getAttribute('src')&&!img.closest('.codex-dossier-tools,.codex-gallery') &&
     !img.closest('button') && !img.closest('svg');
  });
  if(!images.length)return wrapper;
  var gallery=document.createElement('aside');gallery.className='codex-gallery';gallery.setAttribute('aria-label','Galerie des illustrations de cet article');
  var grid=document.createElement('div');grid.className='codex-gallery-grid';
  images.forEach(function(img){
   var src=img.currentSrc||img.src;
   var button=document.createElement('button');button.type='button';button.className='codex-gallery-thumb';button.setAttribute('aria-label','Agrandir : '+(img.alt||'illustration'));
   var preview=document.createElement('img');preview.src=src;preview.alt=img.alt||'Illustration';preview.loading='lazy';
   preview.addEventListener('load',function(){if(preview.naturalWidth>preview.naturalHeight*1.25)button.classList.add('is-landscape');});
   button.appendChild(preview);button.addEventListener('click',function(){showImage(src,img.alt);});
   grid.appendChild(button);
   // Do not hide content twice; source images in the dedicated gallery source
   // are already hidden. For inline article images, replace only the image.
   if(!img.closest('.codex-gallery-source')){
    var figure=img.closest('figure');
    if(figure&&figure.querySelectorAll('img').length===1)figure.hidden=true;
    else img.hidden=true;
   }
  });
  gallery.appendChild(grid);
  wrapper.classList.add('codex-has-gallery');
  wrapper.appendChild(gallery);
  return wrapper;
 }
 window.CodexGallery={decorate:decorate};
})();
