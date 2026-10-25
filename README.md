# CODEX Mental

Site personnel autour de la science, de la philosophie et de la création, présenté dans un univers immersif (thèmes Héliosphère et Galactique).

## Principe

Les **thèmes** (scènes 3D, couleurs, ambiance) sont séparés des **pages** (Codex, Atelier, Laboratoire, Observatoire, Portrait) et des **données** (catalogues d'articles). Le détail est dans [`docs/ARCHITECTURE-THEMES-ET-PAGES.md`](docs/ARCHITECTURE-THEMES-ET-PAGES.md).

## Structure du dépôt

| Dossier ou fichier | Contenu |
| --- | --- |
| `index.html`, `codex.html`, `contact.html`, `menu.html` | Pages principales du site |
| `experiences/` | Thèmes immersifs : `heliosphere`, `galactique`, `champ-stellaire` (prototype) et `shared-reader` (lecteur en cours de mutualisation) |
| `blog/articles/` | Articles, un fragment HTML par article, rangés par thème |
| `assets/data/codex-articles.json` | Catalogue des articles du Codex |
| `blog/blog.json` | Ancien catalogue du blog |
| `assets/` | CSS, JavaScript, partiels HTML et images partagés |
| `atelier/`, `lab/`, `profil/`, `mentions/` | Pages des rubriques |
| `dashb/` | Tableau de bord astronomique (modules, textures de planètes) |
| `arc/` | Données et documents encore utilisés (par exemple `events-astro-2025.json`, lu par `assets/js/badge-astro.js`) et anciennes pages |
| `docs/` | Architecture et audits des articles |

## Tester en local

Le site charge des fichiers JSON avec `fetch`, il faut donc le servir plutôt que d'ouvrir les fichiers directement :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Articles

Les règles de rédaction des fragments sont dans [`docs/AUDIT-ARTICLES-2026-10-24.md`](docs/AUDIT-ARTICLES-2026-10-24.md).
