# CODEX V2 — Lot 01 : inventaire et stratégie d'archivage

État : **audit en cours** (22 octobre 2026). Branche : `audit/codex-v2-foundations`.

## Règles de sécurité

- Aucune suppression ni déplacement avant cartographie des références entrantes et vérification des chemins dynamiques (JavaScript, fetch, imports, menus).
- Les fichiers archivés doivent rester dans Git ; le déplacement peut casser les URLs et chemins relatifs : prévoir redirection ou remplacement avant migration.
- Ne pas confondre « absent des liens statiques examinés » et « inutilisé ».
- Préserver les contenus historiques et les médias ; ne pas déplacer les sources des lecteurs tant que les moteurs n'ont pas été testés.
- Contrôler les liens depuis Héliosphère et Galactique, sur desktop et mobile, avant fusion dans main.

## Premières observations confirmées par lecture de fichiers

| Chemin | Observation | Décision provisoire |
| --- | --- | --- |
| `index.html` | Entrée actuelle vers `experiences/heliosphere/` | **Actif : conserver** |
| `experiences/heliosphere/index.html` | Moteur 3D et lecteur intégré | **Actif : conserver** |
| `experiences/galactique/index.html` | Moteur 3D, liens vers pages V2 et lecteur partagé | **Actif : conserver** |
| `experiences/shared-reader/index.html` | Lecteur commun utilisé côté Galactique | **Actif : conserver** |
| `codex.html` | Page CODEX référencée par les deux moteurs | **Actif : conserver** |
| `atelier/atelier.html`, `lab/index.html`, `dashb/index.html`, `profil/index.html`, `contact.html` | Pages référencées par les deux moteurs | **Actif : conserver** |
| `blog/blog.html` | Page Blog existante, référencée par `home.html`, `menu.html` et dans du code de lecteur | **À auditer : ne pas renommer** |
| `home.html` | Ancien accueil avec liens vers Blog et autres rubriques ; `index.html` est l'entrée courante | **Candidat archive après audit** |
| `menu.html` | Menu autonome contenant les deux univers et le Blog ; `assets/js/main.js` contient une référence à `menu.html` | **Dépendance potentielle : conserver** |
| `profil.html` | Ancienne page de profil distincte de `profil/index.html` | **Candidat archive après audit** |
| `lune.html` | Page intitulée « Test Lune SVG » | **Candidat archive après audit** |
| `checklist.html` | Page « Checklist » avec lien vers `index.html` | **Candidat archive après audit** |
| `footer.html` | Fragment autonome | **Vérifier les inclusions dynamiques** |
| `assets/js/main.js` | Script existant avec référence à `menu.html` et `partials/` | **Actif sur pages classiques ; ne pas remplacer à l'aveugle** |

## Répertoires à explorer

`arc/`, `arcade/`, `assets/`, `atelier/`, `blog/`, `dashb/`, `experiences/`, `img/`, `journal/`, `lab/`, `mentions/`, `partials/`, `profil/`, `src/`, `test/`.

Priorité : `blog/` (distinguer Blog, Codex, archives de publications), `profil/` (préserver toutes les sous-pages), `partials/` et `src/` (dépendances), puis `test/`, `arcade/`, `journal/` (statut à confirmer).

## Avant toute archive

1. Obtenir la liste exhaustive des fichiers du dépôt.
2. Construire une carte des dépendances (HTML, CSS, JS, imports, URLs et chemins construits dynamiquement).
3. Identifier les fichiers sans entrée depuis les pages publiques, puis inspecter leur rôle et leurs médias.
4. Classer chaque fichier : **actif**, **source historique**, **à migrer**, **candidat archive**, **incertain**.
5. Préparer les déplacements sur branche dédiée, corriger les liens, puis tester les pages.
6. Archiver dans `ancien-codes/` uniquement les éléments validés ; ne jamais écraser les originaux.

## Lots suivants

02 Centrale CODEX ; 03 lecteur universel ; 04 navigation/thèmes ; 05 consoles ; 06 en-tête ; 07 responsive ; 08 contenus Portrait ; 09 autres rubriques ; 10 Héliosphère ; 11 Galactique ; 12 Contact et livraison.
