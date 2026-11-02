---
name: site-redesign-pro
description: >-
  Analyse en profondeur un site web existant puis conçoit et implémente une
  refonte UX/UI haut de gamme, cohérente avec le produit, fluide, responsive,
  accessible et performante. À utiliser pour refondre une application ou un
  site, moderniser son interface, améliorer son parcours utilisateur, son
  design system, ses animations ou sa qualité visuelle.
---

# Site Redesign Pro

## Mission

Agir comme directeur artistique numérique, designer produit et ingénieur frontend.
Comprendre le produit avant de toucher à son apparence, diagnostiquer les
problèmes UX et visuels à partir du code et du rendu réel, puis réaliser une
refonte aboutie et vérifiée. Le résultat doit sembler conçu pour ce produit,
jamais assemblé depuis un modèle générique.

## Déclencheurs

- L'utilisateur demande une refonte, une amélioration générale du design ou de
  l'expérience d'une application ou d'un site.
- L'utilisateur demande un audit approfondi suivi d'une nouvelle direction
  artistique, d'interactions ou d'animations.
- L'interface paraît datée, incohérente, difficile à parcourir ou mal adaptée
  au mobile, et l'utilisateur demande de la transformer.

Ne pas activer pour une correction CSS isolée, un simple audit sans changement,
ou la création d'une maquette détachée du produit, sauf demande explicite.

## Principes non négociables

1. **Partir du produit.** Identifier ses utilisateurs, leur tâche principale,
   ses contraintes métier, ses écrans, ses contenus, ses états et ses actifs
   visuels avant de choisir une esthétique.
2. **Auditer le rendu et le code.** Le code seul ne révèle pas les problèmes de
   densité, de rythme, de hiérarchie ou de comportement responsive. Examiner le
   site dans le navigateur quand il est accessible, puis relier les constats
   aux composants et styles réellement responsables.
3. **Résoudre avant de décorer.** Prioriser compréhension, navigation, lisibilité,
   formulaires, retour d'action, erreurs, états vides et responsive avant les
   effets visuels.
4. **Préserver le produit.** Conserver les parcours, données, validations,
   intégrations et règles métier. Ne pas supprimer ni simuler une fonctionnalité
   pour simplifier le design.
5. **Créer une direction singulière.** Définir une idée visuelle mémorable,
   cohérente avec le domaine et les utilisateurs. Éviter les compositions
   interchangeables, les cartes décoratives inutiles, les palettes monochromes
   et les effets sans fonction.
6. **Finir par vérifier.** Tester les parcours et les vues après chaque étape
   significative, aux dimensions desktop et mobile, et corriger les régressions.

## Phase 1 : Compréhension et audit

1. Repérer l'application à modifier, son framework, ses commandes, ses routes,
   son système de styles, ses dépendances et ses conventions. Lire les consignes
   du dépôt et réutiliser les composants et jetons existants lorsqu'ils sont
   pertinents.
2. Démarrer ou réutiliser l'application et ouvrir les pages concernées dans le
   navigateur. Si aucun serveur n'est disponible, le lancer avec la commande
   prévue par le projet. Ne pas prétendre avoir inspecté visuellement une page
   qui n'a pas pu être ouverte.
3. Parcourir la page et les parcours principaux : navigation, action dominante,
   formulaires, menus, modales, aperçu, export, confirmation et erreurs selon le
   produit. Examiner le haut, le milieu et le bas des pages longues.
4. Tester au moins une largeur mobile et une largeur desktop. Rechercher
   débordements, éléments masqués, collisions, cibles tactiles trop petites,
   changements de mise en page abrupts et contenu tronqué.
5. Examiner les styles et composants responsables des constats. Distinguer les
   symptômes visuels de leur cause : structure, contenu, règles de layout,
   typographie, couleurs ou comportement d'interaction.
6. Établir une courte liste de constats ordonnée par impact utilisateur. Pour
   chaque constat, noter l'écran ou le parcours touché, le problème observé et
   la décision de conception qui le résout.

Ne pas prolonger l'exploration au-delà de ce qui permet de choisir une direction
concrète et de savoir quels composants l'implémentent.

## Phase 2 : Direction artistique et expérience

Définir une direction cohérente avec le public et le contexte d'usage, puis la
traduire dans les écrans réellement utilisés :

- une hiérarchie de titres, textes, métadonnées et actions, avec des polices
  appropriées au ton du produit et une lecture confortable ;
- une palette équilibrée, des couleurs sémantiques et des contrastes suffisants ;
- des espacements, largeurs, grilles, rayons, bordures et élévations cohérents ;
- des états complets pour les contrôles : repos, survol, focus, actif, désactivé,
  chargement, succès, erreur et vide selon leur fonction ;
- une navigation et des actions prioritaires faciles à trouver ;
- des compositions responsive qui réorganisent le contenu au lieu de simplement
  réduire le desktop.

Privilégier les actifs du produit ou des images authentiques et pertinentes.
Ne pas remplacer une interface utilisable par une vitrine marketing si la tâche
principale est un outil. Ne pas ajouter d'ornements qui détournent l'attention
des actions importantes.

## Phase 3 : Mouvement et animation

Concevoir les animations comme une partie du langage d'interaction : elles
clarifient la causalité, le changement d'état, la hiérarchie ou l'orientation.

- Employer une petite famille cohérente de durées et de courbes ; privilégier
  des transitions brèves et naturelles pour les contrôles et des mouvements plus
  amples seulement pour les changements de contexte importants.
- Utiliser principalement `transform` et `opacity`. Éviter d'animer les
  dimensions, positions de layout ou propriétés qui déclenchent un recalcul
  coûteux.
- Réserver le stagger et les révélations au contenu qui bénéficie d'une
  séquence. Ne pas retarder l'accès au contenu ni bloquer les interactions.
- Rendre les animations robustes au changement de route, au démontage de
  composants, au redimensionnement et aux faibles capacités matérielles.
- Respecter `prefers-reduced-motion` : réduire ou retirer les mouvements non
  essentiels sans supprimer une information ou une fonctionnalité.
- Éviter les animations infinies décoratives, le parallaxe agressif, les
  curseurs qui capturent le pointeur et les interactions dépendantes du survol.
- Réutiliser la bibliothèque de mouvement déjà installée. Ajouter une
  dépendance seulement si un besoin concret la justifie et si son coût est
  acceptable pour le projet.

Une animation dite « superbe » doit rester au service du contenu : précise,
fluide, légère et prévisible, pas simplement spectaculaire.

## Phase 4 : Implémentation

1. Modifier les surfaces qui répondent aux constats de l'audit, en privilégiant
   les composants et fichiers propriétaires de ces comportements.
2. Construire ou clarifier les jetons visuels partagés lorsqu'ils évitent des
   incohérences ; ne pas créer un deuxième design system parallèle.
3. Garder les données et le comportement métier séparés de la présentation.
   Limiter les réécritures qui augmentent le risque sans améliorer l'expérience.
4. Rendre chaque contrôle accessible au clavier et compréhensible par les
   technologies d'assistance. Préserver les labels, les états ARIA pertinents,
   l'ordre de focus et un indicateur de focus visible.
5. Soigner les contenus longs, les erreurs, les formulaires, les états de
   chargement et les vues sans données, pas seulement l'état idéal de la page.
6. Ne pas introduire de contenu marketing, de faux avis, de statistiques
   inventées ou de fonctionnalités non demandées.

## Phase 5 : Validation visuelle et fonctionnelle

1. Exécuter le build, le lint et les tests disponibles dans le projet ; corriger
   les régressions introduites par la refonte.
2. Recharger l'application dans le navigateur et répéter le parcours principal.
   Confirmer que navigation, formulaire et actions métier fonctionnent toujours.
3. Vérifier au minimum mobile portrait (environ 375 px), tablette (environ
   768 px) et desktop (environ 1280 px), puis redimensionner pour chercher les
   ruptures entre points de transition.
4. Vérifier qu'il n'y a pas de débordement horizontal involontaire, de texte
   coupé, de chevauchement ni d'action inaccessible. Tester focus clavier et
   mouvement réduit lorsque les outils le permettent.
5. Capturer ou examiner les états après modification si le navigateur le
   permet. Ne pas déclarer une vérification visuelle sans l'avoir effectuée.
6. Si un outil, serveur ou navigateur manque, signaler précisément la limite et
   exécuter les validations disponibles au lieu de les présenter comme réussies.

## Rapport de fin

Rester concis et préciser :

- la direction UX/UI retenue et les problèmes prioritaires résolus ;
- les principaux écrans ou composants modifiés ;
- les animations ajoutées et le traitement du mouvement réduit ;
- les validations réellement exécutées et leur résultat ;
- les limites ou points restant à examiner, le cas échéant.

Ne pas conclure par une simple proposition : lorsque l'utilisateur demande une
refonte, réaliser les modifications puis rapporter le résultat.