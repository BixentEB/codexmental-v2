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


## Décisions du propriétaire — tri du 22 octobre 2026

Les choix ci-dessous sont validés par le propriétaire, mais **ne valent pas confirmation technique que les références sont absentes**.

| Élément | Choix | Prérequis |
| --- | --- | --- |
| `home.html` | Archiver (ancien accueil solaire) | Rechercher les références et réparer les liens |
| `footer.html` | Archiver (ancien pied de page) | `assets/js/main.js` l'injecte encore : retirer proprement l'appel |
| `lune.html` | Archiver (essai Lune) | Conserver intégralement |
| `profil.html` | Archiver (ancien CV) | Vérifier références |
| `checklist.html` | Archiver (ancienne liste) | Conserver pour référence |
| `menu.html` | À décider après déconnexion | Les moteurs 3D ont leur navigation intégrée ; `assets/js/main.js` injecte encore `menu.html` |
| `partials/article-tools.html` | Déplacé par le propriétaire vers `assets/partials/` | Vérifier les références au nouvel emplacement |
| `partials/mp3/` | Supprimer (ancien lecteur) | Vérifier les imports et liens ; préserver par Git si possible |
| `test/` | Archiver (essais lunaires) | Vérifier liens |
| `journal/` | Déjà téléchargé et supprimé par le propriétaire | Ne pas recréer |
| `arcade/` | Déjà téléchargé et supprimé par le propriétaire | Ne pas recréer |
| `blog/` | Conserver pendant la cartographie des articles | Ne pas confondre ancien lecteur et source des articles |
| `codex.html` | Conserver (présentation) | Aucun lien direct vers `blog/blog.html` observé dans ce fichier |

### Architecture constatée

- `codex.html` : présentation statique, pas d'appel direct à `blog/blog.html` dans le fichier lu.
- `blog/blog.html` : ancienne interface de lecture ; utilise `assets/js/viewer.js` pour charger des fragments.
- `experiences/heliosphere/index.html` : lecteur embarqué avec routes `codex` et `blog`, appels `fetch()` et routes vers `../../blog/blog.html`.
- `experiences/galactique/index.html` : moteur distinct, avec navigation intégrée.
- `assets/js/main.js` : appelle `menu.html` et `footer.html` sur les pages classiques.
- La classe CSS `codex-lucioles` est réellement présente dans les moteurs 3D.

### Point de vigilance : captures du navigateur mobile

Les captures montrent une interface de lecture mobile très étroite, des contenus qui débordent horizontalement, et un rendu sans CSS pour une page/fragment ancien. À traiter dans le lot responsive après identification précise des URL chargées.

### État de la branche

Ce rapport est rédigé sur la branche d'audit, sans déplacer ni supprimer de fichiers. Le propriétaire a déjà modifié la branche `main` indépendamment : **re-synchroniser l'audit avec `main` avant toute opération de nettoyage**.
