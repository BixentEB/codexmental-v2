/* ==========================================================================
   theme-switch.js : sélecteur de thèmes partagé

   Les thèmes sont déclarés dans assets/data/themes.json. Ce script :
   - remplit chaque élément [data-theme-list] avec la liste des thèmes ;
   - mémorise le choix du lecteur (localStorage, clé "codex.theme") ;
   - conserve ?query et #hash en changeant de thème.

   Le HTML d'origine du conteneur sert de modèle et de secours : si le registre
   ne se charge pas, la liste écrite à la main reste affichée.
   Mode "li" : data-theme-list="li" sur un <ul> dont les <li data-theme-item>
   servent de modèle.

   Aperçu des thèmes désactivés : ajouter ?preview à l'adresse.
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'codex.theme';
  var me = document.currentScript || document.querySelector('script[src*="theme-switch.js"]');
  var ROOT = new URL('../../', me.src);              // assets/js/ -> racine du site
  var registry = null;

  function store(op, v) {
    try { return op === 'get' ? localStorage.getItem(KEY) : localStorage.setItem(KEY, v); } catch (e) { return null; }
  }
  function preview() {
    try { if (/[?&]preview(=|&|$)/.test(location.search)) return true; } catch (e) {}
    return false;
  }
  function current() {
    var m = location.pathname.match(/\/experiences\/([a-z0-9-]+)\//);
    return m ? m[1] : null;
  }
  function urlFor(t) { return new URL('experiences/' + t.id + '/', ROOT).href; }

  function load() {
    if (!registry) {
      registry = fetch(new URL('assets/data/themes.json', ROOT).href, { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }
    return registry.then(function (j) {
      var pv = preview();
      return j.themes.filter(function (t) { return t.enabled !== false || pv; }).map(function (t) {
        return Object.assign({}, t, { label: t.enabled === false ? t.label + ' (aperçu)' : t.label });
      });
    });
  }

  function go(t) {
    store('set', t.id);
    location.href = urlFor(t) + location.search + location.hash;
  }

  function fill(el) {
    var li = el.getAttribute('data-theme-list') === 'li';
    var items = [].slice.call(li ? el.querySelectorAll('[data-theme-item]') : el.querySelectorAll('a'));
    if (!items.length) return;
    var tpl = items[0], parent = tpl.parentNode, ref = items[items.length - 1].nextSibling, cur = current();
    load().then(function (list) {
      var nodes = list.map(function (t) {
        var node = tpl.cloneNode(true), a = li ? node.querySelector('a') : node;
        a.href = urlFor(t);
        a.textContent = t.label;
        if (t.description) a.title = t.description;
        a.removeAttribute('aria-current');
        if (t.id === cur) a.setAttribute('aria-current', 'page');
        a.addEventListener('click', function (e) {
          if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          go(t);
        });
        return node;
      });
      items.forEach(function (n) { n.parentNode.removeChild(n); });
      nodes.forEach(function (n) { parent.insertBefore(n, ref); });
    }).catch(function () { /* on garde la liste d'origine */ });
  }

  function scan(root) {
    [].forEach.call((root || document).querySelectorAll('[data-theme-list]'), fill);
  }

  /* Le dernier thème visité devient le thème par défaut du lecteur. */
  var cur = current();
  if (cur) load().then(function (list) {
    if (list.some(function (t) { return t.id === cur && !/\(aperçu\)$/.test(t.label); })) store('set', cur);
  }).catch(function () {});

  window.CodexThemes = { load: load, go: go, fill: fill, scan: scan, current: current, saved: function () { return store('get'); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); });
  else scan();
})();
