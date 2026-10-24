# CODEX Mental — séparation des responsabilités

## Principe
Héliosphère et Galactique sont des **thèmes immersifs** (scènes 3D, caméra, couleurs, ambiance, effets). Les pages (Codex, Atelier, Laboratoire, Observatoire, Portrait) possèdent chacune **une structure fonctionnelle unique** qui ne change pas selon le thème.

## Contrat
- **Données** : catalogues d'articles et de projets partagés, sans copie par thème.
- **Pages** : un composant/lecteur commun pour chaque rubrique ; mêmes menus, dimensions, interactions et comportements responsive.
- **Thèmes** : couleurs et fonds définis par variables CSS, sans modifier la hiérarchie du DOM ni la grille des pages.
- **Moteurs 3D** : uniquement la scène et l'accès aux rubriques ; ils ouvrent le lecteur commun.
- **État** : navigation et préférences de lecture conservées lors du changement de thème, sauf décision explicite contraire.
- **Exceptions** : une page peut posséder sa propre structure (par exemple la vitrine du Lab) ; cette exception s'applique **dans les deux thèmes**.

## Diagnostic (octobre 2026)
Les fichiers `experiences/heliosphere/index.html` et `experiences/shared-reader/index.html` contiennent des styles et de la logique de lecteur largement dupliqués. Les grilles de colonnes ont des règles concurrentes, notamment 185–250 px et 225–310 px. La vitrine du Lab est déjà mutualisée via `assets/js/lab-showcase.js`, mais son intégration dans les lecteurs est dupliquée.

## Migration progressive
1. Centraliser la géométrie commune (premier fichier : `assets/css/reader-layout.css`), sans toucher aux couleurs et moteurs 3D.
2. Déplacer les styles de lecteur dupliqués vers un CSS commun, en supprimant les règles anciennes concurrentes après vérification.
3. Extraire le contrôleur de lecteur et les comportements de navigation en un module JS commun ; les deux moteurs ne fournissent que la rubrique à ouvrir.
4. Tester sur les deux thèmes : Codex, Atelier, Laboratoire, Portrait, Observatoire ; bureau et mobile ; changements de thème en cours de lecture.
5. Fusionner seulement après validation visuelle et fonctionnelle.

Cette branche est un premier jalon de géométrie partagée, **pas** encore une mutualisation complète du moteur de lecture.
