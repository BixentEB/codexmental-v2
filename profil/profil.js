// 🌿 Sélecteurs communs
const sousMenu = document.querySelector('.sous-menu');
const visualizer = document.querySelector('.profil-visualizer');
const iconButtons = document.querySelectorAll('.menu-icons-svg .icon-btn');
const burgerBtn = document.querySelector('.burger-btn');
const nav = document.querySelector('.profil-nav');


// Titre permanent de la rubrique active, indépendant du bouton Intro.
const profileSectionNames = {
  bio: 'Mon parcours', passions: 'Passions', influences: 'Influences',
  references: 'Références', gaming: 'Gaming', voyages: 'Voyages',
  aspirations: 'Aspirations'
};
function renderProfileSubmenu(section, html) {
  const heading = document.createElement('button');
  heading.type = 'button';
  heading.className = 'profil-section-heading';
  heading.dataset.subsection = 'index';
  heading.textContent = profileSectionNames[section] || section;
  heading.setAttribute('aria-label', 'Revenir à l’introduction : ' + heading.textContent);
  sousMenu.innerHTML = html;
  sousMenu.querySelector('.profil-submenu-intro')?.remove();
  sousMenu.prepend(heading);
  sousMenu.dataset.section = section;
}

// 🌟 Toggle du menu burger
if (burgerBtn && nav) {
  burgerBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}


// Afficher automatiquement l'introduction du chapitre sélectionné.
function openSectionIntro(section) {
  const intro = sousMenu.querySelector('.profil-section-heading[data-subsection="index"]');
  if (!intro) return;
  sousMenu.querySelectorAll('button').forEach(button => button.classList.remove('active'));
  intro.classList.add('active');
  fetch(`sections/${section}/index.html`)
    .then(res => {
      if (!res.ok) throw new Error("Introduction introuvable");
      return res.text();
    })
    .then(html => {
      if (sousMenu.dataset.section === section && intro.classList.contains('active')) {
        visualizer.innerHTML = html;
      }
    })
    .catch(err => {
      if (sousMenu.dataset.section === section) {
        visualizer.textContent = `Erreur introduction : ${err.message}`;
      }
    });
}

// 🌟 Boutons du menu SVG
iconButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.path;
    const color = getComputedStyle(btn).color;

    // 🎨 Définir la couleur héritée dynamique
    visualizer.style.setProperty('--accent-color', color);
    sousMenu.style.setProperty('--accent-color', color);

    // Réinitialiser visualiseur
    visualizer.innerHTML = '';

    // Charger le sous-menu
    fetch(`sections/${section}/sousmenu.html`)
      .then(res => {
        if (!res.ok) throw new Error("Fichier introuvable");
        return res.text();
      })
      .then(html => {
        renderProfileSubmenu(section, html); // stocke la section active
        openSectionIntro(section);
      })
      .catch(err => {
        sousMenu.innerHTML = `<p style="color:red;">Erreur sous-menu : ${err.message}</p>`;
      });

    // Mettre à jour actif
    iconButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 🌟 Survol plus clair
iconButtons.forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    btn.querySelector("svg").style.opacity = "0.8";
  });
  btn.addEventListener("mouseleave", () => {
    btn.querySelector("svg").style.opacity = "1";
  });
});

// 🌟 Sous-menus dynamiques avec delegation
document.addEventListener('click', (event) => {
  const btn = event.target.closest('.sous-menu button[data-subsection]');
  if (btn) {
    const sub = btn.dataset.subsection;
    const section = sousMenu.dataset.section; // récupère la section active

    if (section && sub) {
      fetch(`sections/${section}/${sub}.html`)
        .then(res => {
          if (!res.ok) throw new Error("Fichier introuvable");
          return res.text();
        })
        .then(html => {
          visualizer.innerHTML = html;
        })
        .catch(err => {
          visualizer.innerHTML = `<p style="color:red;">Erreur contenu : ${err.message}</p>`;
        });

      // Mettre à jour actif
      btn.closest('.sous-menu').querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
});

// 🌟 Duplication dynamique du menu icônes pour mobile uniquement
if (window.innerWidth <= 768) {
  const menu = document.querySelector('.menu-icons-svg ul');
  const mobileContainer = document.getElementById('mobile-icons-container');
  if (menu && mobileContainer) {
    // Clone du <ul>
    const clone = menu.cloneNode(true);
    clone.classList.add('mobile-icons-menu');
    mobileContainer.appendChild(clone);
  }
}

// 🌟 Activer les boutons du menu mobile
const mobileIconButtons = document.querySelectorAll('.mobile-icons-menu .icon-btn');
mobileIconButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.path;
    const color = getComputedStyle(btn).color;

    visualizer.style.setProperty('--accent-color', color);
    sousMenu.style.setProperty('--accent-color', color);

    visualizer.innerHTML = '';

    fetch(`sections/${section}/sousmenu.html`)
      .then(res => {
        if (!res.ok) throw new Error("Fichier introuvable");
        return res.text();
      })
      .then(html => {
        renderProfileSubmenu(section, html);
        openSectionIntro(section);
      })
      .catch(err => {
        sousMenu.innerHTML = `<p style="color:red;">Erreur sous-menu : ${err.message}</p>`;
      });

    mobileIconButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


// Alice : ouverture des illustrations, même dans les pages chargées via innerHTML.
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.alice-page [data-alice-full]');
  if (trigger) {
    const root = trigger.closest('.alice-page');
    const viewer = root?.querySelector('.alice-viewer');
    const largeImage = viewer?.querySelector('img');
    const thumbnail = trigger.querySelector('img');
    if (!viewer || !largeImage || !thumbnail || !thumbnail.naturalWidth) return;
    largeImage.src = trigger.dataset.aliceFull;
    largeImage.alt = thumbnail.alt;
    viewer.hidden = false;
    viewer.dataset.open = 'true';
    viewer.querySelector('.alice-close')?.focus();
    return;
  }
  const close = event.target.closest('.alice-page .alice-close');
  const backdrop = event.target.matches('.alice-page .alice-viewer') ? event.target : null;
  if (close || backdrop) {
    const viewer = (close || backdrop).closest('.alice-viewer');
    viewer.hidden = true;
    viewer.removeAttribute('data-open');
    viewer.querySelector('img')?.removeAttribute('src');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const viewer = document.querySelector('.alice-page .alice-viewer[data-open]');
  if (viewer) {
    viewer.hidden = true;
    viewer.removeAttribute('data-open');
    viewer.querySelector('img')?.removeAttribute('src');
  }
});
