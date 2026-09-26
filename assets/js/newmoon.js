// newmoon.js — FIX: mask userSpaceOnUse + orientation observateur (parallacticAngle)

function loadSunCalc(callback) {
  if (window.SunCalc) callback();
  else {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js";
    s.onload = callback;
    document.head.appendChild(s);
  }
}

// Fallback position (Rome) — remplace si tu veux une orientation parfaite
let OBS = { lat: 41.9, lon: 12.5 };

function initObserverPosition() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    pos => {
      OBS.lat = pos.coords.latitude;
      OBS.lon = pos.coords.longitude;
      updateMoon(); // recalcul immédiat avec la bonne position
    },
    () => {},
    { enableHighAccuracy: false, timeout: 2500 }
  );
}

function arcDeg(x) { return x * 180 / Math.PI; }

function safeClamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

/**
 * Met à jour la lune SVG avec la vraie forme des phases
 */
function updateMoon() {
  if (!window.SunCalc) return;

  const now = new Date();
  const { fraction, phase, angle } = SunCalc.getMoonIllumination(now);
  const path = document.getElementById("shadow-path");
  if (!path) return;

  // Géométrie du disque
  const cx = 50, cy = 50, r = 50;

  // Garde-fous numérique pour éviter NaN à 0% / 100%
  const f = safeClamp(fraction, 0.0001, 0.9999); // 0< f <1
  const k = 2 * f - 1;                           // -1..+1
  const ellA = Math.max(0.001, Math.sqrt(1 - k * k) * r); // demi-axe horizontal de l'ellipse
  const waxing = phase < 0.5; // phase 0→0.5 croissante, 0.5→1 décroissante

  // Cas limites
  if (fraction <= 0.001) {
    // Nouvelle lune -> tout sombre (on « cache » toute la texture éclairée)
    // Masque = blanc (visible) - noir (ombre) ; on peint l’ombre en noir partout
    path.setAttribute("d", "M 0,0 L 100,0 L 100,100 L 0,100 Z");
  } else if (fraction >= 0.999) {
    // Pleine lune -> rien à masquer (chemin vide)
    path.setAttribute("d", "M 0,0 L 0,0");
  } else {
    // Phases intermédiaires : on dessine la ZONE D’OMBRE (noir) via un chemin evenodd
    // Stratégie : un grand disque plein (ombre) « troué » par l’ellipse éclairée
    // Pour garder ta logique, on construit l’ellipse centrée en ex,cy
    const ex = waxing ? cx - ellA : cx + ellA; // l’ellipse éclairée est du côté du Soleil

    const d = `
      M ${cx},${cy - r}
      A ${r},${r} 0 1 1 ${cx},${cy + r}
      A ${r},${r} 0 1 1 ${cx},${cy - r}
      Z
      M ${ex},${cy - r}
      A ${ellA},${r} 0 0 ${waxing ? 1 : 0} ${ex},${cy + r}
      A ${ellA},${r} 0 0 ${waxing ? 0 : 1} ${ex},${cy - r}
      Z
    `.trim();

    path.setAttribute("d", d);
  }

  // Orientation réaliste : angle d’illumination + angle parallactique de l’observateur
  const pos = SunCalc.getMoonPosition(now, OBS.lat, OBS.lon);
  const rotDeg = arcDeg(angle + pos.parallacticAngle);
  path.setAttribute("transform", `rotate(${rotDeg}, ${cx}, ${cy})`);

  // Debug console
  let phaseName = "";
  if (phase < 0.125) phaseName = "🌑 Nouvelle lune";
  else if (phase < 0.25) phaseName = "🌒 Croissant croissant";
  else if (phase < 0.375) phaseName = "🌓 Premier quartier";
  else if (phase < 0.5) phaseName = "🌔 Gibbeuse croissante";
  else if (phase < 0.625) phaseName = "🌕 Pleine lune";
  else if (phase < 0.75) phaseName = "🌖 Gibbeuse décroissante";
  else if (phase < 0.875) phaseName = "🌗 Dernier quartier";
  else phaseName = "🌘 Croissant décroissant";

  console.log(
    `${phaseName} | Illum=${(fraction*100).toFixed(1)}% | ` +
    `phase=${phase.toFixed(3)} | angle=${arcDeg(angle).toFixed(1)}° | ` +
    `parallax=${arcDeg(pos.parallacticAngle).toFixed(1)}° | rot=${rotDeg.toFixed(1)}° | waxing=${waxing}`
  );
}

/**
 * Crée le widget lune et l'injecte dans la page
 */
export function updateNewMoonWidget() {
  // Supprimer l'existant si besoin
  const old = document.getElementById("svg-lune-widget");
  if (old) old.remove();

  // Texture résolue depuis le module lui-même.
  const moonTexture = new URL("../../img/lune/lune-pleine.png", import.meta.url).href;
  console.log("🌙 Texture lunaire :", moonTexture);

  // Conteneur
  const container = document.createElement("div");
  container.id = "svg-lune-widget";

  // SVG + masque en userSpaceOnUse (CRUCIAL)
  container.innerHTML = `
    <svg id="svg-lune" viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <clipPath id="moon-clip">
          <circle cx="50" cy="50" r="50"/>
        </clipPath>

        <!-- FIX ICI: repère du masque = userSpaceOnUse + bbox explicite -->
        <mask id="moon-mask"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="0" y="0" width="100" height="100">
          <!-- Blanc = visible (texture éclairée) -->
          <rect x="0" y="0" width="100" height="100" fill="white"/>
          <!-- Noir = ombre (on dessine l’ombre, ou un disque plein troué par la zone éclairée) -->
          <path id="shadow-path" fill="black" fill-rule="evenodd"/>
        </mask>
      </defs>

      <!-- Disque fantôme (lune sombre) -->
      <image href="${moonTexture}" width="100%" height="100%"
             clip-path="url(#moon-clip)"
             style="filter:brightness(0.4);opacity:0.15"/>

      <!-- Texture éclairée, découpée par le masque -->
      <image id="moon-lit" href="${moonTexture}" width="100%" height="100%"
             mask="url(#moon-mask)" clip-path="url(#moon-clip)"/>
    </svg>
  `;

  document.body.appendChild(container);

  // Taille cliquable (comme avant)
  const sizes = [
    { w: "150px", h: "150px", class: "" },
    { w: "250px", h: "250px", class: "" },
    { w: "500px", h: "500px", class: "super-lune" }
  ];
  let sizeIndex = 1;
  const applySize = () => {
    container.style.width = sizes[sizeIndex].w;
    container.style.height = sizes[sizeIndex].h;
    container.className = sizes[sizeIndex].class;
  };
  applySize();
  container.addEventListener("click", e => {
    e.preventDefault();
    sizeIndex = (sizeIndex + 1) % sizes.length;
    applySize();
  });

  loadSunCalc(() => {
    initObserverPosition();
    updateMoon();
    setInterval(updateMoon, 3600000); // maj horaire
  });
}
