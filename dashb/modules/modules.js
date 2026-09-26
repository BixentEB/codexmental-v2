// /dashb/modules/modules.js — point d’entrée unique du dashboard

(() => {
  const root = document.documentElement;
  const body = document.body;

  // DashB garde son identité visuelle propre, indépendante des thèmes globaux.
  [...body.classList].filter(c => c.startsWith('theme-')).forEach(c => body.classList.remove(c));
  body.classList.add('lab', 'dashboard');
  delete root.dataset.theme;

  // Aucun sélecteur de thème dans le dashboard.
  document.querySelectorAll('.theme-switcher,[data-theme-menu],.theme-panel,.theme-list,.theme-fab-container,.theme-overlay,.backdrop-blur')
    .forEach(n => n.remove());

  window.__lab = window.__lab || { booted:false, bus:new EventTarget() };
})();

document.addEventListener('DOMContentLoaded', async () => {
  console.time('[DASH] bootstrap');

  // Garder le header au-dessus
  const header = document.getElementById('menu-placeholder') || document.getElementById('site-header');
  if (header) { header.style.position = 'relative'; header.style.zIndex = '5000'; }

  // 1) UI / compat (#info-*) + miroir + pont d’événements + close-all
  try {
    await import('./dashboard/ui/init.js');
  } catch (e) {
    console.warn('⚠️ UI init failed:', e);
  }

  // 2) Viewer 3D (planète + lune)
  try {
    await import('./dashboard/ui/viewer-orb.js');
  } catch (e) {
    console.warn('⚠️ Viewer 3D indisponible:', e);
  }

  // 3) Radar (charge aussi tes modules métiers via ses imports)
  try {
    await import('./dashboard/simul-system.js');
  } catch (e) {
    console.warn('⚠️ Radar 2D indisponible:', e);
  }

  console.timeEnd('[DASH] bootstrap');
  (window.__lab?.bus || document).dispatchEvent(new CustomEvent('dashboard:ready'));
});
