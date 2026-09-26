import SunCalc from 'https://esm.sh/suncalc';

const FALLBACK = { lat: 45.75, lon: 4.85 };
let observer = { ...FALLBACK };

export function setLunarObserver(lat, lon) {
  if (Number.isFinite(lat) && Number.isFinite(lon)) observer = { lat, lon };
}
export function getLunarObserver(){ return { ...observer }; }

export function requestLunarObserver() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(getLunarObserver());
    navigator.geolocation.getCurrentPosition(
      p => { setLunarObserver(p.coords.latitude, p.coords.longitude); resolve(getLunarObserver()); },
      () => resolve(getLunarObserver()),
      { enableHighAccuracy:false, timeout:2500, maximumAge:3600000 }
    );
  });
}

export function phaseName(phase) {
  if (phase < .03 || phase >= .97) return 'Nouvelle lune';
  if (phase < .22) return 'Premier croissant';
  if (phase < .28) return 'Premier quartier';
  if (phase < .47) return 'Gibbeuse croissante';
  if (phase < .53) return 'Pleine lune';
  if (phase < .72) return 'Gibbeuse décroissante';
  if (phase < .78) return 'Dernier quartier';
  return 'Dernier croissant';
}
export function phaseEmoji(phase) {
  if (phase < .03 || phase >= .97) return '🌑';
  if (phase < .22) return '🌒';
  if (phase < .28) return '🌓';
  if (phase < .47) return '🌔';
  if (phase < .53) return '🌕';
  if (phase < .72) return '🌖';
  if (phase < .78) return '🌗';
  return '🌘';
}

function nextMoonEvents(date, lat, lon) {
  const events=[];
  for(let i=0;i<3;i++){
    const d=new Date(date); d.setDate(d.getDate()+i);
    const t=SunCalc.getMoonTimes(d,lat,lon);
    if(t.rise) events.push({type:'Lever',time:new Date(t.rise)});
    if(t.set) events.push({type:'Coucher',time:new Date(t.set)});
  }
  return events.filter(e=>e.time>date).sort((a,b)=>a.time-b.time);
}
function fmt(d){ return d ? d.toLocaleString('fr-FR',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'; }

export function getLunarData(date=new Date(), loc=getLunarObserver()) {
  const illumination=SunCalc.getMoonIllumination(date);
  const position=SunCalc.getMoonPosition(date,loc.lat,loc.lon);
  const events=nextMoonEvents(date,loc.lat,loc.lon);
  return {
    now:date, lat:loc.lat, lon:loc.lon,
    fraction:illumination.fraction, phase:illumination.phase, angle:illumination.angle,
    waxing:illumination.phase < .5,
    name:phaseName(illumination.phase), emoji:phaseEmoji(illumination.phase),
    altitude:position.altitude, parallacticAngle:position.parallacticAngle,
    nextRise:events.find(e=>e.type==='Lever')?.time || null,
    nextSet:events.find(e=>e.type==='Coucher')?.time || null
  };
}
export function lunarSummary(data=getLunarData()) {
  return `${data.emoji} ${data.name} · ${(data.fraction*100).toFixed(1)}% illuminée
${data.altitude>0?'Visible au-dessus':'Sous'} de l’horizon
🌙 Prochain lever : ${fmt(data.nextRise)}
🌙 Prochain coucher : ${fmt(data.nextSet)}`;
}
