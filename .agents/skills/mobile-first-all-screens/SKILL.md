---
name: mobile-first-all-screens
description: Conçoit, adapte et valide des interfaces responsive mobile-first pour tous les types d'ecrans et d'applications. S'utilise pour les pages, dashboards, formulaires, editeurs, galeries, modales, tableaux, listes, outils tactiles et experiences desktop.
---

# Mobile First - Tous les ecrans

## Objectif

Construire une interface qui fonctionne d'abord sur petit ecran, puis s'etend proprement vers les tablettes, ordinateurs portables, grands ecrans et fenetres redimensionnees. Le responsive doit concerner les parcours et les etats interactifs, pas seulement la largeur de la page.

## Regle de travail

Avant toute modification :

1. Identifier la page, le parcours principal et les composants responsables de la mise en page.
2. Lister les contenus prioritaires, les actions critiques et les elements qui peuvent etre masques, reordonnes ou regroupes.
3. Reperer les contraintes existantes : framework, systeme de design, composants, breakpoints, images, tableaux et styles d'impression.
4. Choisir une largeur minimale realiste pour le produit et tester les comportements entre les breakpoints, pas uniquement sur des tailles fixes.

## Ordre d'implementation

1. Implementer la structure et les styles pour une largeur mobile.
2. Ajouter les espacements, zones tactiles et etats de focus necessaires.
3. Ajouter progressivement les ameliorations pour tablette, desktop et grand ecran.
4. Utiliser des layouts fluides (`grid`, `flex`, `minmax`, `clamp`, conteneurs) plutot que des offsets ou largeurs arbitraires.
5. Conserver une seule source de verite pour les donnees et les composants ; adapter la presentation, pas le comportement metier.

## Responsabilites par famille d'ecran

### Navigation et en-tetes
- Garder la navigation principale accessible au pouce.
- Remplacer les barres trop longues par un menu, une barre inferieure ou des onglets defilables.
- Preserver le titre, le retour et l'action principale dans une zone stable.
- Eviter les menus qui debordent horizontalement.

### Formulaires et editeurs
- Organiser les champs en une colonne sur mobile.
- Regrouper les champs secondaires dans des sections repliables sans cacher les erreurs.
- Utiliser des controles assez grands pour le tactile et conserver des labels explicites.
- Eviter que le clavier virtuel masque le champ actif ou l'action de validation.
- Placer les actions persistantes dans une barre fixe uniquement si elle ne masque pas le contenu et respecte les safe areas.

### Dashboards, cartes et listes
- Passer d'une grille multi-colonnes a une pile lisible.
- Conserver en premier les indicateurs et actions les plus importants.
- Transformer les cartes tres larges en listes compactes quand la comparaison horizontale n'est plus possible.
- Prevoir des etats de chargement, vide, erreur et contenu long sur chaque largeur.

### Tableaux et donnees denses
- Ne jamais reduire le texte jusqu'a le rendre illisible.
- Prioriser les colonnes, masquer les colonnes secondaires avec un detail accessible ou autoriser un defilement horizontal clairement maitrise.
- Garder l'en-tete, les actions et les valeurs associees compréhensibles sur petit ecran.

### Modales, panneaux et menus
- Sur mobile, preferer une feuille plein ecran ou quasi plein ecran avec fermeture accessible.
- Sur desktop, limiter la largeur et conserver un contexte visuel autour du panneau.
- Gerer le focus, la fermeture au clavier, le defilement interne et le retour au declencheur.
- Verifier que les boutons d'action restent visibles quand le contenu depasse la hauteur de l'ecran.

### Galeries, apercus et medias
- Utiliser des proportions stables et des images adaptatives.
- Eviter les apercus qui forcent un zoom ou un recadrage destructeur.
- Respecter les performances mobiles : chargement differe, tailles d'image adequates et controles tactiles.

## Contraintes visuelles et tactiles

- Utiliser des zones tactiles d'au moins 44 x 44 CSS px quand c'est possible.
- Maintenir un contraste suffisant, des focus visibles et une hierarchie de titres coherente.
- Ne pas dependre du survol : toute information ou action importante doit fonctionner au tactile et au clavier.
- Eviter le defilement horizontal de la page, sauf pour les contenus qui le necessitent vraiment.
- Ne pas fixer de hauteur qui coupe le contenu ; utiliser `min-height` et des contraintes adaptatives.
- Tenir compte de `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)` et des claviers mobiles pour les elements fixes.
- Respecter `prefers-reduced-motion` et limiter les animations qui deplacent fortement le contenu.

## Breakpoints et contenu

Ne pas appliquer automatiquement une liste de breakpoints rigide. Ajouter un breakpoint quand le contenu ne tient plus correctement ou quand un changement de composition améliore vraiment l'usage. Tester au minimum :

- petit mobile en portrait ;
- grand mobile en portrait et paysage ;
- tablette en portrait et paysage ;
- ordinateur portable ;
- grand ecran et fenetre redimensionnee.

Les textes longs, traductions, erreurs, boutons cote a cote et valeurs extremes doivent rester utilisables a toutes ces tailles.

## Validation obligatoire

Pour chaque ecran modifie :

1. Tester le parcours principal sur mobile en portrait.
2. Tester le meme parcours sur tablette et desktop.
3. Redimensionner progressivement la fenetre pour detecter les ruptures entre breakpoints.
4. Tester le clavier, le focus, le scroll, les modales, le clavier virtuel et les zones tactiles.
5. Verifier les etats chargement, vide, erreur et contenu long.
6. Verifier qu'aucun texte, bouton, image ou panneau ne se chevauche ou ne sort de la viewport.
7. Executer le lint, le build et les tests disponibles.

## Definition de fini

Une interface est mobile-first lorsque :

- le parcours principal est complet sur petit ecran sans zoom ni defilement horizontal involontaire ;
- chaque action importante reste trouvable et utilisable au tactile et au clavier ;
- le contenu s'adapte sans coupure aux tailles intermediaires ;
- les versions desktop ajoutent de l'espace et de la densite sans changer les priorites ;
- les etats limites et les erreurs sont aussi responsive que l'etat nominal ;
- la validation executable et visuelle a ete realisee sur les familles d'ecrans pertinentes.
