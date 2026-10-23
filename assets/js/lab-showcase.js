/* CODEX Mental — vitrine du Laboratoire, partagée par les deux univers. */
(function(){
'use strict';
const projects=[
 {id:'noxdl',name:'NoxDL',mark:'↓',platform:'Windows',status:'Développement',visibility:'Diffusion publique envisagée',license:'Gratuit envisagé',accent:'#94c8ff',summary:'Télécharger, classer et automatiser ses médias depuis une interface unique.',detail:'Trois modes complémentaires : Standard pour un téléchargement à la demande, Chasseur pour les listes de liens et Radar pour la détection automatisée. Le projet s’appuie sur Python, yt-dlp et FFmpeg.'},
 {id:'perimgo-home',name:'Périm-Go Home',tags:['Gestion','Quotidien'],features:['Scan des codes-barres','Inventaire local','Suivi des entrées et sorties'],mark:'◷',platform:'Android',status:'Prototype fonctionnel',visibility:'Tests privés',license:'Licences envisagées',accent:'#92e5b5',summary:'Suivi des stocks et des dates de péremption, directement depuis un smartphone.',detail:'Scan des codes-barres, inventaire local et gestion des entrées et sorties. Cette édition est destinée à un usage personnel. Aucune version publique n’est proposée à ce stade.'},
 {id:'perimgo-business',name:'Périm-Go Business',tags:['Gestion','Commerce'],features:['Inventaire professionnel','Scan des produits','Suivi des mouvements'],mark:'◷',platform:'Android',status:'Prototype en développement',visibility:'Diffusion privée',license:'À définir',accent:'#71d9bc',summary:'Gestion des stocks et des péremptions pour les professionnels.',detail:'Déclinaison professionnelle de Périm-Go, distincte de l’édition personnelle. Les modalités de distribution et de licence restent à préciser.'},
 {id:'dexlibera',name:'DexLibera',mark:'✧',platform:'Projet numérique',status:'À documenter',visibility:'Non publié',license:'À définir',accent:'#d8b6ff',summary:'Un projet à retrouver prochainement dans le Laboratoire.',detail:'La présentation détaillée, les fonctionnalités et les conditions de diffusion seront ajoutées lorsqu’elles seront prêtes.'},
 {id:'codex',name:'CODEX Mental',mark:'✦',platform:'Web',status:'En évolution',visibility:'Public',license:'Consultation libre',accent:'#f4c68b',summary:'Un univers interactif pour relier écriture, réflexion et expérimentation.',detail:'Deux univers de navigation, Galactique et Héliosphère, pour explorer les publications, créations et expériences de CODEX Mental.'},
 {id:'futur',name:'À venir',mark:'◇',platform:'Expérimentations',status:'Exploration',visibility:'À définir',license:'À définir',accent:'#9fdfe6',summary:'Prototypes, idées et expériences en cours de conception.',detail:'Cet espace accueillera les futures applications, expériences et créations, sans annoncer de téléchargement avant leur disponibilité.'}
];
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function mount(target,menu){
 if(!target)return;
 if(menu){menu.style.display='';menu.classList.add('lab-wheel-host');}
 target.classList.add('lab-showcase-host');
 const layout=target.closest('.codex-reader-layout');
 if(layout){layout.parentElement?.querySelectorAll(':scope > .lab-intro-top').forEach(el=>el.remove());layout.querySelectorAll(':scope > .lab-tags-rail, :scope > .lab-status-rail').forEach(el=>el.remove());}
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
  /* La roue est maintenant dans le menu du lecteur, hors de .lab-showcase. */
  .codex-reader #codex-reader-menu.lab-wheel-host{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:center!important;gap:6px!important;background:rgba(9,15,32,.86)!important}
  .codex-reader .lab-wheel-host .lab-wheel{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:8px!important;width:100%!important;padding:0!important;background:transparent!important;border:0!important;overflow:visible!important}
  .codex-reader .lab-wheel-host .lab-wheel button{appearance:none!important;-webkit-appearance:none!important;font:inherit!important;color:#c4cee7!important;cursor:pointer!important;white-space:normal!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-arrow{align-self:center!important;border:0!important;background:transparent!important;padding:6px 24px!important;color:#c4cee7!important;font-size:21px!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice{display:flex!important;align-items:center!important;gap:9px!important;width:100%!important;text-align:left!important;border:1px solid transparent!important;border-radius:12px!important;padding:9px 8px!important;background:transparent!important;opacity:.62!important;transform:scale(.95);transition:opacity .25s,transform .25s,background .25s!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice[aria-pressed="true"]{border-color:rgba(224,192,136,.55)!important;background:rgba(170,139,84,.2)!important;opacity:1!important;transform:scale(1.02);color:#fff!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-mark{display:grid!important;place-items:center!important;flex:none!important;width:36px!important;height:36px!important;border:1px solid currentColor!important;border-radius:50%!important;font-size:20px!important;color:var(--lab-accent)!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice span:last-child{font-size:12px!important;font-weight:600!important}
  .lab-showcase .lab-intro{border:0!important;border-bottom:1px solid rgba(205,211,230,.18)!important;border-radius:0!important;background:transparent!important;padding:4px 0 15px!important;box-shadow:none!important}
  .lab-showcase .lab-intro h3{font-size:1.2rem!important;text-shadow:0 2px 10px #000d!important}
  .lab-showcase .lab-intro p{color:#e3e7f2!important;text-shadow:0 1px 6px #000c!important}
  .lab-showcase .lab-intro a{background:transparent!important;border:0!important;border-radius:0!important;padding:7px 0!important;text-shadow:0 2px 8px #000e!important;text-decoration:underline!important;text-underline-offset:4px!important}
  .lab-showcase .lab-metadata{border-top:1px solid rgba(205,211,230,.17)!important;padding-top:12px!important}
  .lab-showcase .lab-meta{border:0!important;border-right:1px solid rgba(205,211,230,.18)!important;border-radius:0!important;background:transparent!important;padding:5px 12px!important}
  .lab-showcase .lab-meta:last-child{border-right:0!important}
  .lab-showcase .lab-heading h3,.lab-showcase .lab-summary{text-shadow:0 2px 10px #000d!important}
  @media(max-width:700px){.codex-reader .lab-wheel-host .lab-wheel{flex-direction:row!important;overflow-x:auto!important}.codex-reader .lab-wheel-host .lab-wheel .lab-choice{width:auto!important;flex:0 0 auto!important;transform:none!important}.codex-reader .lab-wheel-host .lab-wheel .lab-arrow{display:none!important}.lab-showcase .lab-meta{border-right:0!important;border-bottom:1px solid rgba(205,211,230,.12)!important}}
  /* Ambiance plus lumineuse et moins de masses grises, sans sacrifier le contraste. */
  .codex-reader .codex-reader-layout:has(.lab-showcase-host){gap:18px!important}
  .codex-reader .lab-showcase-host{
    background:linear-gradient(135deg,rgba(24,44,70,.69),rgba(14,31,56,.74))!important;
    border:1px solid rgba(159,207,243,.22)!important;
    border-radius:16px!important;
    box-shadow:0 12px 35px rgba(0,0,0,.12)!important;
    -webkit-backdrop-filter:blur(17px) saturate(1.15)!important;
    backdrop-filter:blur(17px) saturate(1.15)!important;
    padding:clamp(18px,2.5vw,32px)!important;
  }
  .codex-reader #codex-reader-menu.lab-wheel-host{
    background:linear-gradient(165deg,rgba(22,40,64,.74),rgba(12,27,48,.82))!important;
    border:1px solid rgba(159,207,243,.2)!important;
    border-radius:16px!important;
    -webkit-backdrop-filter:blur(15px)!important;
    backdrop-filter:blur(15px)!important;
  }
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice[aria-pressed="true"]{
    background:linear-gradient(100deg,rgba(159,207,243,.15),rgba(159,207,243,.04))!important;
    border-color:rgba(190,220,244,.4)!important;
  }
  .lab-showcase .lab-intro{padding-bottom:19px!important;border-bottom-color:rgba(192,220,245,.28)!important}
  .lab-showcase .lab-intro h3{color:#f5faff!important;font-weight:700!important}
  .lab-showcase .lab-intro a{color:#ffe0a5!important}
  .lab-showcase .lab-meta{border-right-color:rgba(192,220,245,.22)!important}
  .lab-showcase .lab-meta strong{color:#f7faff!important}
  @media(max-width:700px){.codex-reader .lab-showcase-host{padding:16px!important}}
  /* Trois zones distinctes : introduction pleine largeur, roue, application. */
  .codex-reader .lab-intro-top{
    display:flex;align-items:center;justify-content:space-between;gap:22px;
    padding:10px 2px 18px;margin:0 0 12px;
    border-bottom:1px solid rgba(193,217,240,.25);
    color:#f1f6ff;background:transparent;
  }
  .codex-reader .lab-intro-top h3{font-size:1.14rem;margin:0 0 6px;color:#fff;text-shadow:0 2px 9px #000b}
  .codex-reader .lab-intro-top p{margin:0;max-width:780px;font-size:.91rem;line-height:1.55;color:#dce7f6;text-shadow:0 1px 7px #000b}
  .codex-reader .lab-intro-top a{color:#ffe0a5;font-weight:700;text-decoration:underline;text-underline-offset:4px;white-space:nowrap;text-shadow:0 2px 8px #000c}
  .codex-reader .lab-showcase-host .lab-showcase{height:100%;justify-content:center}
  .codex-reader .lab-showcase-host .lab-detail{padding:clamp(8px,2vw,22px)}
  @media(max-width:700px){.codex-reader .lab-intro-top{align-items:flex-start;flex-direction:column;gap:10px;padding:12px 2px}}
  .codex-reader .lab-intro-top{padding:2px 0 10px!important;margin-bottom:8px!important;gap:12px!important}
  .codex-reader .lab-intro-top h3{display:none!important}
  .codex-reader .lab-intro-top p{font-size:.82rem!important;max-width:760px!important}
  .codex-reader .lab-intro-top a{font-size:.83rem!important}
  .codex-reader .lab-showcase-host{padding:clamp(14px,1.7vw,24px)!important}
  .lab-showcase .lab-detail{gap:11px!important}
  .lab-showcase .lab-heading h3{font-size:clamp(1.3rem,2vw,1.7rem)!important}
  .lab-showcase .lab-heading .lab-mark{width:43px!important;height:43px!important;font-size:23px!important}
  .lab-showcase .lab-tags{display:flex;flex-wrap:wrap;gap:7px}
  .lab-showcase .lab-tag{font-size:.72rem;letter-spacing:.025em;color:#b7d8ee;border-bottom:1px solid rgba(160,207,236,.5);padding:2px 1px}
  .lab-showcase .lab-features{font-size:.85rem;color:#dce7f6}
  .lab-showcase .lab-features strong{font-weight:650}
  .lab-showcase .lab-features ul{display:flex;flex-wrap:wrap;gap:5px 24px;padding-left:18px;margin:6px 0 0}
  .lab-showcase .lab-metadata{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important}
  .lab-showcase .lab-meta{padding:5px 9px!important}
  @media(max-width:700px){.lab-showcase .lab-metadata{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
  /* Composition en zones indépendantes : roue | étiquettes / fiche / statuts */
  .codex-reader .codex-reader-layout:has(.lab-showcase-host){
    display:grid!important;grid-template-columns:132px minmax(0,1fr)!important;
    grid-template-rows:auto minmax(0,1fr) auto!important;
    column-gap:14px!important;row-gap:9px!important;
    max-height:calc(76dvh - 12px)!important;
  }
  .codex-reader #codex-reader-menu.lab-wheel-host{
    grid-column:1!important;grid-row:1 / 4!important;
    max-height:none!important;min-height:0!important;
    padding:8px 5px!important;overflow-y:auto!important;
  }
  .codex-reader .lab-tags-rail{grid-column:2;grid-row:1;display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-height:24px;padding:0 8px}
  .codex-reader .lab-tags-rail .lab-tag{font-size:.77rem;font-weight:650;letter-spacing:.02em;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--tag-color) 15%,transparent);border:1px solid color-mix(in srgb,var(--tag-color) 43%,transparent);color:var(--tag-color);text-shadow:0 1px 5px #0008}
  .codex-reader .lab-showcase-host{grid-column:2!important;grid-row:2!important;min-height:0!important;height:100%!important;overflow-y:auto!important;padding:clamp(14px,1.8vw,24px)!important}
  .codex-reader .lab-showcase-host .lab-showcase{justify-content:flex-start!important}
  .codex-reader .lab-showcase-host .lab-detail{padding:4px 8px!important;gap:11px!important}
  .codex-reader .lab-status-rail{grid-column:2;grid-row:3;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;padding:9px 10px;background:linear-gradient(110deg,rgba(24,44,70,.7),rgba(14,31,56,.76));border:1px solid rgba(159,207,243,.22);border-radius:12px;backdrop-filter:blur(12px)}
  .codex-reader .lab-status-rail .lab-meta{min-width:0;padding:3px 12px;border-right:1px solid rgba(192,220,245,.2)}
  .codex-reader .lab-status-rail .lab-meta:last-child{border-right:0}
  .codex-reader .lab-status-rail .lab-meta small{display:block;font-size:.72rem;color:#a8bdd5;margin-bottom:4px}
  .codex-reader .lab-status-rail .lab-meta strong{font-size:.81rem;color:#f3f7ff;overflow-wrap:anywhere}
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice{flex-direction:column!important;justify-content:center!important;text-align:center!important;gap:5px!important;padding:7px 3px!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-choice span:last-child{font-size:10px!important;line-height:1.25!important}
  .codex-reader .lab-wheel-host .lab-wheel .lab-mark{width:34px!important;height:34px!important}
  @media(max-width:700px){
    .codex-reader .codex-reader-layout:has(.lab-showcase-host){display:flex!important;flex-direction:column!important;max-height:none!important}
    .codex-reader #codex-reader-menu.lab-wheel-host{width:100%!important;max-height:none!important;overflow-x:auto!important}
    .codex-reader .lab-wheel-host .lab-wheel .lab-choice{min-width:78px!important}
    .codex-reader .lab-tags-rail{padding:2px 0}
    .codex-reader .lab-showcase-host{height:auto!important;min-height:230px!important}
    .codex-reader .lab-status-rail{width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .codex-reader .lab-status-rail .lab-meta:nth-child(2){border-right:0}
  }
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
 const intro=node('div','lab-intro-top');
 const introText=node('div');introText.append(node('h3','', 'Le Laboratoire officiel'),node('p','', 'Versions, téléchargements, tutoriels, historique des mises à jour et informations de licence seront regroupés dans un espace indépendant.'));
 const official=node('a','', 'Explorer le dépôt du Lab ↗');official.href='https://github.com/BixentEB/codexmental-lab';official.target='_blank';official.rel='noopener noreferrer';official.title='Le sous-domaine sera ajouté après sa configuration';
 intro.append(introText,official);
 const main=node('div','lab-main'),wheel=node('nav','lab-wheel');wheel.setAttribute('aria-label','Sélection des applications');
 const detail=node('section','lab-detail');detail.setAttribute('aria-live','polite');
 const tagRail=node('div','lab-tags-rail'),statusRail=node('div','lab-status-rail');
 let selected=0;
 const choices=[];
 function choose(i){selected=(i+projects.length)%projects.length;const item=projects[selected];choices.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===selected)));detail.replaceChildren();
 tagRail.replaceChildren();const palette={'Multimédia':'#8cc7ff','Automatisation':'#e5b5ff','Gestion':'#8ee0b7','Quotidien':'#f4ce91','Commerce':'#f4b68d','Création':'#d3b3ff','Web':'#a6d9f5','Expérimentation':'#b3d9dc'};(item.tags||({noxdl:['Multimédia','Automatisation'],dexlibera:['Création'],codex:['Web','Création'],futur:['Expérimentation']}[item.id]||[])).forEach(t=>{const badge=node('span','lab-tag',t);badge.style.setProperty('--tag-color',palette[t]||'#c9d9ee');tagRail.append(badge);});
 const heading=node('div','lab-heading'),mark=node('span','lab-mark',item.mark);mark.style.setProperty('--lab-accent',item.accent);
 const headingText=node('div');headingText.append(node('h3','',item.name),node('div','lab-platform',item.platform));heading.append(mark,headingText);
 detail.append(heading,node('p','lab-summary',item.summary),node('p','lab-description',item.detail));
 if(item.features?.length){const features=node('div','lab-features');features.append(node('strong','', 'Fonctions principales'));const ul=node('ul');item.features.forEach(t=>ul.append(node('li','',t)));features.append(ul);detail.append(features);}
 statusRail.replaceChildren();[['État',item.status],['Diffusion',item.visibility],['Licence',item.license],['Lien vers','Bientôt sur le Lab']].forEach(([label,value])=>{const m=node('div','lab-meta');m.append(node('small','',label),node('strong','',value));statusRail.append(m);});
 /* No scrollIntoView: it can scroll the entire reader and hide the showcase header. */
 }
 const prev=node('button','lab-arrow','⌃');prev.type='button';prev.setAttribute('aria-label','Application précédente');prev.addEventListener('click',()=>choose(selected-1));wheel.append(prev);
 projects.forEach((item,i)=>{const b=node('button','lab-choice');b.type='button';b.setAttribute('aria-pressed','false');const m=node('span','lab-mark',item.mark);m.style.setProperty('--lab-accent',item.accent);b.append(m,node('span','',item.name));b.addEventListener('click',()=>choose(i));wheel.append(b);choices.push(b);});
 const next=node('button','lab-arrow','⌄');next.type='button';next.setAttribute('aria-label','Application suivante');next.addEventListener('click',()=>choose(selected+1));wheel.append(next);
 wheel.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();choose(selected+(e.deltaY>0?1:-1));}},{passive:false});
 main.append(detail);root.append(main);target.append(root);if(layout){layout.before(intro);}else{root.prepend(intro);intro.classList.add('lab-intro');}if(menu){menu.replaceChildren(wheel);}else{main.prepend(wheel);}if(layout){layout.append(tagRail,statusRail);}else{root.prepend(tagRail);root.append(statusRail);}choose(0);
}
window.CODEXLabShowcase={mount};
})();
