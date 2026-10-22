# Contrôle des articles CODEX — 22 octobre 2026

Branche contrôlée : `feature/unified-article-catalog`. Catalogue : `assets/data/codex-articles.json`.

## Résultats

- 29 références de fichiers HTML vérifiées individuellement par lecture GitHub.
- 22 fichiers présents, 7 fichiers absents.
- Parmi les 22 présents, 2 fichiers sont vides (un saut de ligne), 3 contiennent une page HTML complète plutôt qu'un fragment.
- Les 3 pages complètes comprennent des modèles ou textes de test : ne pas les publier comme articles finalisés sans revue éditoriale.
- Il reste 17 fichiers présents, non vides, sans structure de document HTML complète détectée. Leur qualité rédactionnelle et leur rendu navigateur ne sont pas certifiés.

### Fichiers introuvables (7)

- `blog/articles/hp/arborescence.html`
- `blog/articles/reves/reves.html`
- `blog/articles/reves/cauchemars.html`
- `blog/articles/reves/paralysis.html`
- `blog/articles/reves/experiences.html`
- `blog/articles/symbol/tarot/intro.html`
- `blog/articles/symbol/synchronicite-numerique.html`

### Fichiers vides (2)

- `blog/articles/reves/intro.html`
- `blog/articles/symbol/symbolisme.html`

### Pages complètes à convertir / examiner (3)

- `blog/articles/ai/aivie.html` : véritable court texte, mais emballé dans DOCTYPE/html/head/body.
- `blog/articles/psy/article2.html` : page test « Bienvenue / Ceci est un test ».
- `blog/articles/altstates/revelucide.html` : gabarit d'article avec texte d'exemple, styles et script.

## Conséquences pour la migration

Ne pas archiver `blog/blog.html` ni fusionner vers `main` avant validation du nouveau lecteur en navigateur. Le nouveau catalogue JSON reflète volontairement les 29 entrées historiques, y compris les entrées manquantes ; il ne faut pas interpréter leur présence comme une publication valide.

Pistes : ajouter un état `draft` / `published` au catalogue ; masquer les brouillons dans le visionneur ; convertir les vraies pages complètes en fragments sans effacer de contenu ; réparer les liens seulement après identification des sources. Tester les deux univers et le mobile.

## Décision éditoriale — 22 octobre 2026

Le propriétaire du site confirme que les neuf références ci-dessous correspondent à des articles **jamais rédigés** (et non à des pertes de fichiers). Elles sont retirées du catalogue actif et du menu historique ; les deux fichiers HTML vides ont été supprimés. Cette liste reste une simple réserve d'idées, sans obligation de publication :

- `hp/arborescence` — Pensée arborescente et adaptation
- `reves/intro` — Introduction sur les rêves
- `reves/reves` — Rêves
- `reves/cauchemars` — Cauchemars
- `reves/paralysis` — Paralysies du sommeil
- `reves/experiences` — Expériences atypiques
- `symbol/tarot/intro` — Tarot, introduction
- `symbol/symbolisme` — Sorcières et Lumières
- `symbol/synchronicite-numerique` — Synchronicités numériques

**Catalogue actif après nettoyage : 20 références.** Les autres pages d'exemple (`psy/article2.html`, `altstates/revelucide.html`) restent à examiner séparément ; aucune modification de leur contenu n'a été effectuée.

## Suite du nettoyage — 22 octobre 2026

Deux entrées de démonstration sont conservées comme fichiers mais masquées dans les deux lecteurs CODEX par le statut `draft` du catalogue : `psy/article2` et `altstates/revelucide`. Leurs liens ont également été retirés du menu historique `blog/blog.html`. Bilan : 20 références au catalogue, dont 18 publiables et 2 brouillons. Le rendu en navigateur, la résolution des médias et l'intégration Galactique restent à valider avant fusion.
