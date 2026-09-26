// Racine portable de Codex Mental.
// Ce fichier vit toujours dans assets/js/ : deux niveaux au-dessus = racine du site.
(() => {
  const script = document.currentScript;
  if (!script) return;
  const root = new URL('../../', script.src);
  let base = document.querySelector('base[data-codex-root]');
  if (!base) {
    base = document.createElement('base');
    base.dataset.codexRoot = '';
    document.head.prepend(base);
  }
  base.href = root.href;
  window.CODEX_ROOT = root;
})();
