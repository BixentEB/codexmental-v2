/* CODEX Mental — vitrine du Laboratoire, partagée par les deux univers. */
(function(){
'use strict';
const projects=[
 {id:'noxdl',name:'NoxDL',mark:'↓',platform:'Windows',status:'Développement',visibility:'Diffusion publique envisagée',license:'Gratuit envisagé',accent:'#94c8ff',summary:'Télécharger, classer et automatiser ses médias depuis une interface unique.',detail:'Trois modes complémentaires : Standard pour un téléchargement à la demande, Chasseur pour les listes de liens et Radar pour la détection automatisée. Le projet s’appuie sur Python, yt-dlp et FFmpeg.'},
 {id:'perimgo',name:'Périm-Go',mark:'◷',platform:'Android',status:'Prototype fonctionnel',visibility:'Tests privés',license:'Licences envisagées',accent:'#92e5b5',summary:'Suivi des stocks et des dates de péremption, directement depuis un smartphone.',detail:'Scan des codes-barres, inventaire local et gestion des entrées et sorties. Les déclinaisons personnelles et professionnelles sont étudiées séparément. Aucune version publique n’est proposée à ce stade.'},
 {id:'dexlibera',name:'DexLibera',mark:'✧',platform:'Projet numérique',status:'À documenter',visibility:'Non publié',license:'À définir',accent:'#d8b6ff',summary:'Un projet à retrouver prochainement dans le Laboratoire.',detail:'La présentation détaillée, les fonctionnalités et les conditions de diffusion seront ajoutées lorsqu’elles seront prêtes.'},
 {id:'codex',name:'CODEX Mental',mark:'✦',platform:'Web',status:'En évolution',visibility:'Public',license:'Consultation libre',accent:'#f4c68b',summary:'Un univers interactif pour relier écriture, réflexion et expérimentation.',detail:'Deux univers de navigation, Galactique et Héliosphère, pour explorer les publications, créations et expériences de CODEX Mental.'},
 {id:'futur',name:'À venir',mark:'◇',platform:'Expérimentations',status:'Exploration',visibility:'À définir',license:'À définir',accent:'#9fdfe6',summary:'Prototypes, idées et expériences en cours de conception.',detail:'Cet espace accueillera les futures applications, expériences et créations, sans annoncer de téléchargement avant leur disponibilité.'}
];
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function mount(target,menu){
 if(!target)return;
 if(menu){menu.style.display='';menu.classList.add('lab-wheel-host');}
 target.classList.add('lab-showcase-host');
 target.replaceChildren();
 if(!document.getElementById('codex-lab-showcase-css')){
  const style=node('style');style.id='codex-lab-showcase-css';style.textContent=`
  .codex-reader .codex-reader-layout:has(.lab-showcase-host){display:grid!important;grid-template-columns:minmax(145px,205px) minmax(0,1fr)!important;gap:14px!important;height:auto!important;max-height:calc(76dvh - 60px)!important;min-height:0!important;overflow:visible!important}
  .codex-reader .lab-showcase-host{width:100%!important;height:auto!important;max-width:none!important;padding:14px!important;overflow-y:auto!important;background:rgba(8,14,30,.47)!important;border:1px solid rgba(209,219,255,.15)!important;box-shadow:0 8px 32px rgba(0,0,0,.12)!important}
  .lab-showcase{font-family:inherit;color:#f0f3ff;display:flex;flex-direction:column;gap:16px;padding:0;max-width:none;height:auto;min-height:0;margin:0}
  .lab-showcase *{box-sizing:border-box}
  .lab-showcase .lab-intro{border:1px solid rgba(173,194,245,.28);border-radius:16px;background:linear-gradient(110deg,rgba(30,43,73,.88),rgba(16,22,43,.94));padding:12px 18px;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}
  .lab-showcase .lab-intro h3{font-size:1.1rem;margin:0 0 8px;color:#fff}
  .lab-showcase .lab-intro p{font-size:.92rem;line-height:1.6;margin:0;color:#d2d9ed;max-width:690px}
  .lab-showcase .lab-intro a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:#f9e0ad;background:rgba(171,132,66,.14);border:1px solid rgba(237,190,109,.52);border-radius:10px;padding:12px 16px;font-weight:700;white-space:nowrap}
  .lab-showcase .lab-intro a:hover,.lab-showcase .lab-intro a:focus-visible{background:rgba(171,132,66,.3)}
  .lab-showcase .lab-main{display:block;min-height:0;height:auto}
  .codex-reader .lab-wheel-host{padding:8px!important;overflow-y:auto!important;max-height:calc(76dvh - 60px)!important}\n  .lab-showcase .lab-wheel{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:8px;border:1px solid rgba(173,194,245,.2);border-radius:18px;padding:8px;background:rgba(9,15,32,.7);overflow:hidden}
  .lab-showcase .lab-wheel button{font:inherit;color:#c4cee7;cursor:pointer}
  .lab-showcase .lab-wheel .lab-arrow{align-self:center;background:transparent;border:0;font-size:20px;line-height:1;padding:7px 24px}
  .lab-showcase .lab-wheel .lab-choice{border:1px solid transparent;background:rgba(100,116,156,.07);border-radius:13px;padding:7px 6px;display:flex;align-items:center;gap:9px;text-align:left;opacity:.65;transform:scale(.93);transition:transform .2s,opacity .2s,background .2s}
  .lab-showcase .lab-wheel .lab-choice[aria-pressed="true"]{border-color:rgba(224,192,136,.65);background:rgba(170,139,84,.19);opacity:1;transform:scale(1.04);color:#fff}
  .lab-showcase .lab-mark{display:grid;place-items:center;flex:none;width:36px;height:36px;border:1px solid currentColor;border-radius:50%;font-size:21px;font-weight:700;color:var(--lab-accent)}
  .lab-showcase .lab-choice span:last-child{font-size:.86rem;font-weight:600}
  .lab-showcase .lab-detail{border:0;border-radius:0;padding:clamp(10px,2vw,22px);background:transparent;display:flex;flex-direction:column;justify-content:flex-start;gap:18px;min-width:0;min-height:0;overflow:visible}
  .lab-showcase .lab-heading{display:flex;gap:18px;align-items:center}
  .lab-showcase .lab-heading .lab-mark{width:56px;height:56px;font-size:30px}
  .lab-showcase .lab-heading h3{font-size:clamp(1.5rem,2.7vw,2.2rem);margin:0 0 5px;color:#fff}
  .lab-showcase .lab-platform{color:#aebddf;font-size:.85rem}
  .lab-showcase .lab-summary{font-size:1.07rem;font-weight:600;line-height:1.5;margin:0;color:#f2f4ff}
  .lab-showcase .lab-description{line-height:1.7;font-size:.95rem;color:#d6dded;margin:0}
  .lab-showcase .lab-metadata{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:auto}
  .lab-showcase .lab-meta{border:1px solid rgba(167,186,230,.2);border-radius:10px;background:rgba(37,49,76,.38);padding:13px}
  .lab-showcase .lab-meta small{display:block;color:#9aaaca;margin-bottom:7px;font-size:.73rem}
  .lab-showcase .lab-meta strong{font-size:.84rem;color:#f5f2eb}
  @media(max-height:740px) and (min-width:701px){.lab-showcase .lab-intro{padding:8px 14px}.lab-showcase .lab-intro p{font-size:.8rem}.lab-showcase .lab-detail{gap:8px}.lab-showcase .lab-choice{padding:4px 6px!important}.lab-showcase .lab-description{font-size:.86rem;line-height:1.45}.lab-showcase .lab-meta{padding:7px}.lab-showcase .lab-mark{width:29px;height:29px;font-size:17px}.lab-showcase .lab-heading .lab-mark{width:46px;height:46px;font-size:25px}}\n  @media(max-width:700px){.codex-reader .codex-reader-layout:has(.lab-showcase-host){display:flex!important;flex-direction:column!important;max-height:none!important;overflow:visible!important}.codex-reader .lab-wheel-host{max-height:none!important;overflow-x:auto!important;overflow-y:hidden!important}.codex-reader .lab-showcase-host{height:auto!important;overflow-y:auto!important}.lab-showcase{height:auto;min-height:0}.lab-showcase{padding:8px;gap:12px}.lab-showcase .lab-intro{padding:15px}.lab-showcase .lab-intro a{white-space:normal}.lab-showcase .lab-main{display:flex;flex-direction:column;gap:12px}.lab-showcase .lab-wheel{flex-direction:row;justify-content:flex-start;overflow-x:auto;padding:9px}.lab-showcase .lab-wheel .lab-arrow{display:none}.lab-showcase .lab-wheel .lab-choice{flex:0 0 auto;transform:none!important;padding:8px 11px}.lab-showcase .lab-detail{padding:18px;gap:16px}.lab-showcase .lab-heading .lab-mark{width:55px;height:55px;font-size:28px}.lab-showcase .lab-metadata{grid-template-columns:1fr;gap:7px}.lab-showcase .lab-meta{padding:9px 12px}}
  `;
  document.head.appendChild(style);
 }
 const root=node('section','lab-showcase');
 const intro=node('div','lab-intro');
 const introText=node('div');introText.append(node('h3','', 'Le Laboratoire officiel'),node('p','', 'Versions, téléchargements, tutoriels, historique des mises à jour et informations de licence seront regroupés dans un espace indépendant.'));
 const official=node('a','', 'Explorer le dépôt du Lab ↗');official.href='https://github.com/BixentEB/codexmental-lab';official.target='_blank';official.rel='noopener noreferrer';official.title='Le sous-domaine sera ajouté après sa configuration';
 intro.append(introText,official);
 const main=node('div','lab-main'),wheel=node('nav','lab-wheel');wheel.setAttribute('aria-label','Sélection des applications');
 const detail=node('section','lab-detail');detail.setAttribute('aria-live','polite');
 let selected=0;
 const choices=[];
 function choose(i){selected=(i+projects.length)%projects.length;const item=projects[selected];choices.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===selected)));detail.replaceChildren();
 const heading=node('div','lab-heading'),mark=node('span','lab-mark',item.mark);mark.style.setProperty('--lab-accent',item.accent);
 const headingText=node('div');headingText.append(node('h3','',item.name),node('div','lab-platform',item.platform));heading.append(mark,headingText);
 detail.append(heading,node('p','lab-summary',item.summary),node('p','lab-description',item.detail));
 const metadata=node('div','lab-metadata');[['État',item.status],['Diffusion',item.visibility],['Licence',item.license]].forEach(([label,value])=>{const m=node('div','lab-meta');m.append(node('small','',label),node('strong','',value));metadata.append(m);});detail.append(metadata);
 /* No scrollIntoView: it can scroll the entire reader and hide the showcase header. */
 }
 const prev=node('button','lab-arrow','⌃');prev.type='button';prev.setAttribute('aria-label','Application précédente');prev.addEventListener('click',()=>choose(selected-1));wheel.append(prev);
 projects.forEach((item,i)=>{const b=node('button','lab-choice');b.type='button';b.setAttribute('aria-pressed','false');const m=node('span','lab-mark',item.mark);m.style.setProperty('--lab-accent',item.accent);b.append(m,node('span','',item.name));b.addEventListener('click',()=>choose(i));wheel.append(b);choices.push(b);});
 const next=node('button','lab-arrow','⌄');next.type='button';next.setAttribute('aria-label','Application suivante');next.addEventListener('click',()=>choose(selected+1));wheel.append(next);
 wheel.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();choose(selected+(e.deltaY>0?1:-1));}},{passive:false});
 main.append(detail);root.append(intro,main);target.append(root);if(menu){menu.replaceChildren(wheel);}else{main.prepend(wheel);}choose(0);
}
window.CODEXLabShowcase={mount};
})();
