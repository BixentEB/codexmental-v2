// planet-sections.js – Fonctions de rendu pour les blocs dynamiques du dashboard
import { MOON_DATA } from './moon-database.js';
import { COLONIZATION_STATUS } from './colonization-status.js';

//
// 📋 INFORMATIONS
//
export function renderBasicInfo(data) {
  return `
    <p>Nom : ${data.name || '—'}</p>
    <p>Distance : ${data.distance || '—'}</p>
    <p>Diamètre : ${data.radius || '—'}</p>
    <p>Température : ${data.temp || '—'}</p>
  `;
}

export function renderComposition(data) {
  return data.composition
    ? `<p><strong>Composition :</strong><br>${data.composition}</p>`
    : `<p>—</p>`;
}

export function renderClimate(data) {
  return data.climate
    ? `<p><strong>Climat :</strong><br>${data.climate}</p>`
    : `<p>Température moyenne : ${data.temp || '—'}</p>`;
}

//
// 🌙 LUNES
//
export function renderMoonSummary({ planetKey }) {
  const moons = MOON_DATA[planetKey];
  if (!moons || moons.length === 0) return "<p>Aucune lune détectée</p>";

  const html = moons.map(m => {
    const line = [`<strong>${m.name}</strong>`];
    if (m.diameter) line.push(m.diameter);
    if (m.composition) line.push(m.composition);
    return `<p>${line.join(" — ")}</p>`;
  }).join('');

  return html;
}

export function renderMoonDetails({ planetKey }) {
  const moons = MOON_DATA[planetKey];
  if (!moons || moons.length === 0) return "<p>Aucune lune détectée</p>";

  return moons.map(m => {
    return `
      <div class="moon-block">
        <p><strong>${m.name}</strong></p>
        ${m.image ? `<img src="dashb/modules/dashboard/img/moons/${m.image}" alt="${m.name}" style="max-width: 80px; border-radius: 8px;" />` : ''}
        <p>Diamètre : ${m.diameter || '—'}</p>
        <p>Orbite : ${m.orbit || '—'}</p>
        ${m.period ? `<p>Période orbitale : ${m.period}</p>` : ''}
        ${m.composition ? `<p>Composition : ${m.composition}</p>` : ''}
        ${m.description ? `<p>${m.description}</p>` : ''}
      </div>
      <hr style="opacity: 0.1;">
    `;
  }).join('');
}

//
// 🏙️ COLONISATION
//
export function renderColonizationSummary(data) {
  const statusKey = data.colonization?.status;
  const status = COLONIZATION_STATUS[statusKey];
  const bases = data.colonization?.bases?.join(', ') || '—';

  return `
    <p>État : ${status?.label || '—'}</p>
    <p>Bases : ${bases}</p>
  `;
}

export function renderColonizationExplanation(data) {
  const statusKey = data.colonization?.status;
  const status = COLONIZATION_STATUS[statusKey];
  return `<p><strong>Pourquoi ?</strong><br>${status?.reason || '—'}</p>`;
}

//
// 🚀 MISSIONS
//
export function renderMissionSummary(data) {
  if (!Array.isArray(data.missions) || data.missions.length === 0) {
    return `<p>Aucune mission connue</p>`;
  }
  return `<p>Missions : ${data.missions.join(', ')}</p>`;
}
