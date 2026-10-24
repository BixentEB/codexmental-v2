/* CODEX Mental — shared single-file dossier reader (Codex / Héliosphère / Galactique). */
(function(){
  'use strict';
  function openDossier(opts){
    var source=opts.content.querySelector('[data-reader-dossier]');
    if(!source)return false;
    var headings=Array.from(source.querySelectorAll('h2[data-reader-chapter]'));
    if(!headings.length)return false;
    var parent=source;
    if(headings.some(function(h){return h.parentElement!==parent;}))return false;
    var pieces=[],current=null;
    Array.from(parent.children).forEach(function(node){
      if(node.matches('h2[data-reader-chapter]')){
        current={title:node.textContent.trim(),id:node.getAttribute('data-reader-chapter'),nodes:[]};
        pieces.push(current);
      }
      if(current)current.nodes.push(node.cloneNode(true));
    });
    var first=headings[0];
    var intro=[];
    for(var n=parent.firstElementChild;n&&n!==first;n=n.nextElementSibling)intro.push(n.cloneNode(true));
    // Images outside the article belong to its introduction by default.
    // An explicit data-gallery-chapter attribute can target any chapter.
    var mediaByChapter={introduction:[]};
    pieces.forEach(function(piece){mediaByChapter[piece.id]=[];});
    var mediaRoot=opts.content;
    Array.from(mediaRoot.querySelectorAll('img')).forEach(function(img){
      if(source.contains(img))return; // Images inside a chapter are already copied with its nodes.
      if(img.closest('.codex-article-footer,.codex-dossier-tools'))return;
      var requested=img.getAttribute('data-gallery-chapter')||'introduction';
      var target=Object.prototype.hasOwnProperty.call(mediaByChapter,requested)?requested:'introduction';
      mediaByChapter[target].push(img.cloneNode(true));
    });
    var previous=opts.articleList.querySelector('.codex-dossier-chapters');
    if(previous)previous.remove();
    var menu=document.createElement('div');menu.className='codex-dossier-chapters';
    menu.hidden=false;
    var footer=opts.content.querySelector('.codex-article-footer');
    function display(nodes,selected){
      var wrapper=document.createElement('div');wrapper.className='codex-imported-content codex-dossier-view';
      var article=document.createElement('article');article.className=source.className;
      article.setAttribute('data-article','');
      nodes.forEach(function(n){article.appendChild(n.cloneNode(true));});
      wrapper.appendChild(article);
      var galleryKey=selected?selected.dataset.chapterId:'introduction';
      var assigned=mediaByChapter[galleryKey]||[];
      if(assigned.length){
        var media=document.createElement('div');
        media.className='codex-gallery-source';
        media.hidden=true;
        assigned.forEach(function(img){media.appendChild(img.cloneNode(true));});
        wrapper.appendChild(media);
      }
      if(footer){
        var copy=footer.cloneNode(true);
        var share=copy.querySelector('.codex-article-share');
        if(share){
          share.textContent='';
          share.title='Partager cette section';
          share.setAttribute('aria-label','Partager cette section');
          share.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 13.5 6.6 4m0-11-6.6 4"/></svg>';
          share.addEventListener('click',async function(){
          var url=new URL(opts.articleUrl||location.href);
          if(selected)url.hash=selected.dataset.chapterId||'';
          try{
            if(navigator.share)await navigator.share({title:opts.button.textContent,url:url.href});
            else if(navigator.clipboard){await navigator.clipboard.writeText(url.href);share.textContent='✓ Lien copié';}
            else window.prompt('Copier le lien',url.href);
          }catch(e){if(e.name!=='AbortError')window.prompt('Copier le lien',url.href);}
          });
        }
        var bar=document.createElement('div');bar.className='codex-dossier-tools';
        bar.appendChild(copy);wrapper.prepend(bar);
      }
      menu.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b===selected);});
      opts.render(wrapper);
    }
    pieces.forEach(function(piece){
      var b=document.createElement('button');b.type='button';
      b.className='codex-reader-menu-item';
      b.textContent=piece.title;
      b.dataset.chapterId=piece.id;

      b.addEventListener('click',function(){
        opts.articleList.querySelectorAll('.codex-reader-menu-item').forEach(function(x){x.classList.remove('active');});
        opts.button.classList.add('active');
        display(piece.nodes,b);
      });
      menu.appendChild(b);
    });
    opts.button.insertAdjacentElement('afterend',menu);
    opts.button.classList.add('active');
    opts.button.dataset.readerDossier='true';
    opts.button._codexShowIntro=function(){display(intro,null);};
    opts.button.setAttribute('aria-expanded','true');
    opts.button.setAttribute('aria-controls','codex-dossier-'+(source.getAttribute('data-reader-dossier')||'article'));
    menu.id='codex-dossier-'+(source.getAttribute('data-reader-dossier')||'article');
    display(intro,null);
    return true;
  }
  // Use the same editorial chrome for standalone articles and multi-file series.
  // Single-file chapter dossiers already use this layout in display().
  function decorateArticle(content){
    var footer=content.querySelector('.codex-article-footer');
    if(!footer)return content;
    footer.remove();
    var share=footer.querySelector('.codex-article-share');
    if(share){
      share.textContent='';
      share.title='Partager cet article';
      share.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 13.5 6.6 4m0-11-6.6 4"/></svg>';
    }
    var wrapper=document.createElement('div');
    wrapper.className='codex-imported-content codex-dossier-view';
    var tools=document.createElement('div');
    tools.className='codex-dossier-tools';
    tools.appendChild(footer);
    wrapper.appendChild(tools);
    wrapper.appendChild(content);
    return wrapper;
  }
  window.CodexDossiers={open:openDossier,decorate:decorateArticle};
})();
