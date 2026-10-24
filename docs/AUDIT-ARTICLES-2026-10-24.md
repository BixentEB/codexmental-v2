# Audit des articles publiés — 24 octobre 2026

Périmètre : 18 entrées publiées du catalogue `assets/data/codex-articles.json` (brouillons exclus). Audit statique des fragments HTML, pas une validation visuelle dans le navigateur.

## Constat
- 13/18 fichiers utilisent un élément `<article>`, 5 utilisent `<section>` à la racine.
- `ai/aivie.html` contient une page HTML complète (`DOCTYPE`, `html`, `head`, `body`) plutôt qu'un fragment importable.
- `aiautor/manifeste.html` ferme son titre `h1` avec `</h2></h1>`.
- `ai/miroir0.html` contient des paragraphes en texte brut sans `<p>`.
- Plusieurs pages imposent `text-align:center` en ligne sur leur `h1`, contrairement à la présentation commune.
- `ai/miroir1.html` contient 34 attributs `style` : audit visuel dédié nécessaire.
- `ai/democratisation.html` embarque une feuille `<style>` locale : isoler les styles avant toute migration.
- `philo/intangible.html`, `philo/identite.html` et `introspection/seulsilence.html` ont des sommaires/notes internes de type `details`; ne pas les retirer sans vérifier leur fonction éditoriale.
- `hp/cameleon.html` possède 9 sections `data-reader-chapter`, 3 images hors article : format dossier à préserver.
- `symbol/tarot/13.html` place son média dans une section `data-part="media"` : vérifier son routage vers la galerie.

## Contrat HTML proposé pour les nouveaux articles
1. Fragment HTML uniquement, avec `<article data-article>` et un seul `<h1>`.
2. `<h2>` pour les sections, `<h3>` pour les sous-sections, paragraphes en `<p>`.
3. Aucune règle typographique en attribut `style`; la mise en forme relève de `assets/css/reader-layout.css`.
4. `data-reader-chapter` uniquement pour les véritables dossiers découpés; ne pas convertir automatiquement tous les `h2` en chapitres.
5. Images dans la section correspondante; images hors article rattachées à l'introduction, sauf `data-gallery-chapter`.
6. Hashtags, partage et galerie générés par le lecteur commun, pas reproduits dans chaque article.
7. Conserver les collections multi-fichiers (Miroir) indépendantes des dossiers mono-fichier (Caméléon).

## Suite recommandée
Normaliser les wrappers des autres fragments `section.article`, examiner les styles embarqués et les sommaires, puis tester chaque page dans les deux thèmes avant fusion. Ne pas modifier les textes ou les titres éditoriaux sans accord.
