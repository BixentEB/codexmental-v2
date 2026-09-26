import { getLunarData } from '../../lunar-engine.js';

export async function getData(){
  const d = getLunarData();
  return { now:d.now, illum:Math.round(d.fraction*100), f:d.phase, name:d.name };
}

export function renderData(d){
  return `
    <div class="aw-head"><div>Phase lunaire</div><div>${d.now.toLocaleTimeString()}</div></div>
    <div class="aw-title">Lunaire · Phase</div>
    <ul class="aw-list">
      <li class="aw-item">Nom : <strong>${d.name}</strong></li>
      <li class="aw-item">Illumination : <strong>${d.illum}%</strong></li>
    </ul>`;
}

export function renderViz(d){
  const w=360,h=140,cx=110,cy=76,R=32;
  const k=d.illum/100, offset=(1-Math.abs(2*k-1))*R, waxing=d.f<0.5;
  const maskX=cx+(waxing?-offset:+offset);
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Phase lunaire">
  <defs><mask id="moonMask"><rect width="${w}" height="${h}" fill="#000"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff"/><circle cx="${maskX}" cy="${cy}" r="${R}" fill="#000"/></mask></defs>
  <circle class="aw-moon-disk" cx="${cx}" cy="${cy}" r="${R}" mask="url(#moonMask)"/>
</svg>`;
}
