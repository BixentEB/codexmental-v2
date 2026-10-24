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
    var previous=opts.articleList.querySelector('.codex-dossier-chapters');
    if(previous)previous.remove();
    var menu=document.createElement('div');menu.className='codex-dossier-chapters';
    menu.style.cssText='padding:4px 8px 12px 18px;display:grid;gap:3px';
    var footer=opts.content.querySelector('.codex-article-footer');
    function display(nodes,selected){
      var wrapper=document.createElement('div');wrapper.className='codex-imported-content';
      var article=document.createElement('article');article.className=source.className;
      article.setAttribute('data-article','');
      nodes.forEach(function(n){article.appendChild(n.cloneNode(true));});
      wrapper.appendChild(article);
      if(footer){
        var copy=footer.cloneNode(true);
        var share=copy.querySelector('.codex-article-share');
        if(share)share.addEventListener('click',async function(){
          var url=new URL(opts.articleUrl||location.href);
          if(selected)url.hash=selected.dataset.chapterId||'';
          try{
            if(navigator.share)await navigator.share({title:opts.button.textContent,url:url.href});
            else if(navigator.clipboard){await navigator.clipboard.writeText(url.href);share.textContent='✓ Lien copié';}
            else window.prompt('Copier le lien',url.href);
          }catch(e){if(e.name!=='AbortError')window.prompt('Copier le lien',url.href);}
        });
        wrapper.appendChild(copy);
      }
      menu.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b===selected);});
      opts.render(wrapper);
    }
    pieces.forEach(function(piece){
      var b=document.createElement('button');b.type='button';
      b.className='codex-reader-menu-item';
      b.textContent=piece.title;
      b.dataset.chapterId=piece.id;
      b.style.cssText='text-align:left;font-size:12px;white-space:normal';
      b.addEventListener('click',function(){
        opts.articleList.querySelectorAll('.codex-reader-menu-item').forEach(function(x){x.classList.remove('active');});
        opts.button.classList.add('active');
        display(piece.nodes,b);
      });
      menu.appendChild(b);
    });
    opts.button.insertAdjacentElement('afterend',menu);
    opts.button.classList.add('active');
    display(intro,null);
    return true;
  }
  window.CodexDossiers={open:openDossier};
})();
