/* Attribution douce des extraits du lecteur CODEX Mental.
   N'empêche ni la sélection, ni les outils d'accessibilité. */
(function(){
  'use strict';
  function install(){
    var root=document.getElementById('codex-reader-content');
    if(!root||root.dataset.codexAttributionInstalled)return;
    root.dataset.codexAttributionInstalled='true';
    root.addEventListener('copy',function(event){
      var selection=window.getSelection();
      if(!selection||selection.isCollapsed)return;
      var text=selection.toString().trim();
      if(!text||!root.contains(selection.anchorNode)||!root.contains(selection.focusNode))return;
      var article=root.querySelector('.codex-dossier-view article, .codex-imported-content article, .codex-imported-content');
      var heading=article&&article.querySelector('h1,h2');
      var title=heading?heading.textContent.trim():'CODEX Mental';
      var selectedChapter=root.querySelector('.codex-dossier-view article h2[data-reader-chapter]');
      var path=selectedChapter?selectedChapter.getAttribute('data-reader-chapter'):'';
      var source=root.dataset.articleSource||location.href;
      var link=new URL(source,location.href).href;
      if(path)link=link.split('#')[0]+'#'+encodeURIComponent(path);
      var credit='\n\n— '+title+' · © CODEX Mental\nSource : '+link;
      if(event.clipboardData){
        event.clipboardData.setData('text/plain',text+credit);
        event.preventDefault();
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
})();
