// ========================================================
// main.js – Point d'entrée central de Codex Mental
// ========================================================

// === 📦 Modules à effets de bord ===
import './canvas.js';
import './theme-cards.js';
import './anti-copy.js';
import './viewer.js';
import './cookie.js';
import './onglets.js';
import './table.js';
import './new-badge.js';
import './openmenu.js';

// === 🔧 Modules à fonctions exportées ===
import { setTheme } from './theme-engine.js';
import { injectPartial } from './partials.js';
import { setupScrollButton } from './scroll.js';
import { activerBadgeAstro } from './badge-astro.js';
import { initEtoileFilante } from './etoile-filante.js';
import { initThemeObserver } from './theme-observer.js';

// === 🧭 Alias de thème
import { resolveInitialTheme, resolveAlias } from './theme-alias.js';

// === 🌠 Initialiser le thème visuel dès le chargement
(function initTheme() {
  // 🧪 Cas spécial : dashboard ne doit pas être altéré
  if (location.pathname.includes('/dashb/')) return;

  const params = new URLSearchParams(window.location.search);
  const forceTheme = params.get('forceTheme'); // "main" si on vient de l'intro

  // 1) Choix visiteur (localStorage) sinon 'theme-main', sauf si ?forceTheme=main
  const initial = (forceTheme === 'main')
    ? 'theme-main'
    : resolveInitialTheme();

  // On pose la classe (utile pour preload CSS)
  document.body.className = initial;

  // 2) Résolution d'alias (si 'theme-main' -> thème favori admin)
  const effective = resolveAlias(initial);

  // 3) Application via theme-engine (canvas/particles/soleil…)
  setTheme(effective);

  // 4) Mémoriser le thème effectif (pour d'autres modules)
  document.body.dataset.effectiveTheme = effective;
})();

// === DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  const currentEffective =
    document.body.dataset.effectiveTheme || resolveAlias(document.body.className);

  injectPartial('menu-placeholder', new URL('../../menu.html', import.meta.url).href);
  injectPartial('footer-placeholder', new URL('../../footer.html', import.meta.url).href);

  // 🃏 Cartes de thèmes (partial)
  const cardsTarget = document.getElementById('theme-cards-placeholder');
  if (cardsTarget) {
    injectPartial('theme-cards-placeholder', new URL('../partials/theme-cards.html', import.meta.url).href);
  }

  activerBadgeAstro();
  setupScrollButton();

  if (currentEffective === "theme-stellaire") {
    initEtoileFilante(); // paramètres gérés dans etoile-filante.js
  }
  if (currentEffective === "theme-lunaire") {
    import('./newmoon.js')
      .then(m => m.updateNewMoonWidget())
      .catch(err => console.error("❌ Failed to load newmoon.js:", err));
  }

  initThemeObserver();
});

// === 🍔 Log bouton burger
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  console.log("Burger clicked");
});

// === 🌐 Changement de thème manuel
window.setTheme = (theme) => {
  localStorage.setItem('codexTheme', theme);      // 1) mémorise choix visiteur
  document.body.className = theme;                // 2) classe immédiate
  const effective = resolveAlias(theme);          // 3) alias
  setTheme(effective);                            // 4) effets
  document.body.dataset.effectiveTheme = effective;

  if (effective === "theme-stellaire") {
    initEtoileFilante(); // idem ici
  }
  if (effective === "theme-lunaire") {
    import('./newmoon.js')
      .then(m => m.updateNewMoonWidget())
      .catch(err => console.error("❌ Failed to load newmoon.js:", err));
  }
};
