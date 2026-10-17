# Plan d'implémentation — Amélioration de la page d'accueil

**Date :** 2026-10-17  
**Conception de référence :** direction approuvée dans la conversation du 2026-10-17 : titre concis, deux actions CV/lettre, parcours en trois étapes, scrollytelling conservé et explication IA réunie avec l'appel à l'action final.  
**Périmètre :** page HTML statique servie depuis `douzcv-react/public/page_accueil/`.

## Objectif

Rendre la page d'accueil plus directe et plus facile à parcourir, en reliant clairement la création du CV à la préparation d'une lettre. Conserver le logo douzCv, la palette existante, les routes de l'application et les séquences d'images synchronisées au défilement.

## Hors périmètre

- Ne pas modifier les routes React, les pages de création de CV ou de lettre, ni les services Gemini.
- Ne pas restaurer les liens de navigation « La méthode » et « L'IA, utile » retirés à la demande de l'utilisateur.
- Ne pas modifier les copies de la page dans `douzcv-react/page_accueil/` ou à la racine `page_accueil/`.
- Ne pas modifier `douzcv-react/public/page_accueil/script.js` : conserver son moteur existant et ses contrats DOM.
- Ne pas ajouter de dépendance, de témoignage, de métrique ou de promesse de résultat non vérifiée.

## Hypothèses et dépendances

- La route de l'accueil utilise `/page_accueil/index.html`; Vite sert les fichiers correspondants dans `douzcv-react/public/page_accueil/`.
- Les images des deux récits restent servies depuis `/images/` et `/images2/`.
- Le moteur de scroll attend les identifiants `hero-track`, `anim-img`, `letter-track` et `letter-img`; ils doivent rester inchangés.
- La copie proposée pour le titre est : « Un CV à votre image. Une lettre pour le bon poste. » Le texte d'appui proposé est : « Créez votre CV, puis adaptez votre lettre à l'offre avec l'aide de l'IA. »
- Le dépôt contient déjà plusieurs fichiers modifiés sans rapport avec cette page. Les tâches ci-dessous ne touchent qu'aux deux fichiers canoniques indiqués.

## Stratégie de vérification

- `npm --prefix douzcv-react run build`
- `npm --prefix douzcv-react run lint`
- Contrôle navigateur manuel à 375 × 812, 610 × 308 et 1280 × 800 : structure du hero, logo, contraste, absence de débordement, navigation mobile, CTA et progression des deux séquences d'images.
- Contrôler également `prefers-reduced-motion`, le chargement direct de `/page_accueil/index.html` et les destinations `/modeles`, `/lettre-motivation` et `/connexion`.
- Aucun script de test automatisé dédié à cette page statique n'est actuellement défini dans `package.json`.

## Tâches

### 1. Simplifier le contenu et le parcours HTML

**Fichier :** `douzcv-react/public/page_accueil/index.html`  
**Dépendances :** aucune

- Réécrire le H1 et le paragraphe d'appui selon les formulations proposées dans les hypothèses, sans la phrase d'accroche supprimée précédemment.
- Garder les deux actions principales, avec leurs destinations existantes : création du CV vers `/modeles` et lettre vers `/lettre-motivation`.
- Retirer le message de réassurance redondant du hero s'il répète le paragraphe d'appui.
- Réorganiser la section méthode en trois étapes lisibles : choisir un modèle, améliorer le CV avec l'IA, adapter la lettre à une offre. Garder les étapes textuelles, sans ajouter de contenu produit non existant.
- Réunir l'explication de l'IA et le CTA final dans une seule section terminale, avec une action principale CV et un lien secondaire vers la lettre. Supprimer la section de clôture devenue redondante.
- Garder le logo officiel, les actions de connexion et de création, ainsi que les identifiants DOM utilisés par `script.js` pour les deux scènes animées.

**Vérification :** ouvrir le HTML et confirmer l'ordre hero → trois étapes → scène lettre → section finale combinée ; vérifier que chaque CTA conserve sa destination et qu'aucun identifiant d'animation n'a changé.

### 2. Recomposer les styles du hero et des sections

**Fichier :** `douzcv-react/public/page_accueil/style.css`  
**Dépendances :** tâche 1

- Donner au hero une hiérarchie plus compacte : largeur de lecture maîtrisée, titre limité à deux lignes sur desktop lorsque l'espace le permet, boutons immédiatement visibles et contraste maintenu sur toutes les frames.
- Conserver la fusion progressive de l'en-tête avec la scène, le logo officiel et les couleurs ivoire, bleu nuit et corail.
- Présenter les trois étapes comme un parcours numéroté sans cartes imbriquées ; empiler les étapes sur petit écran.
- Transformer la section IA et le CTA final en un bloc de conclusion cohérent, sans répéter les bénéfices déjà expliqués dans les étapes.
- Ajuster les hauteurs des pistes et la mise en page responsive sans retirer le comportement sticky des scènes ni modifier leurs identifiants.
- Préserver les états focus clavier et le traitement existant de `prefers-reduced-motion`.

**Vérification :** inspecter les trois tailles de viewport prévues ; confirmer que le titre, les boutons et la barre restent visibles, que le contenu ne déborde pas et que le changement de frame suit le scroll dans les deux scènes.

### 3. Vérifier l'intégration et les parcours

**Fichiers :** `douzcv-react/public/page_accueil/index.html`, `douzcv-react/public/page_accueil/style.css`  
**Dépendances :** tâches 1 et 2

- Exécuter le build et le lint avec les commandes existantes.
- Ouvrir `/page_accueil/index.html` dans le navigateur et tester la navigation clavier, le menu mobile, les CTA, les animations au scroll et la préférence de mouvement réduit.
- Vérifier les liens vers `/modeles`, `/lettre-motivation` et `/connexion` sans modifier les pages cibles.
- Comparer les résultats avec le `git status` initial afin de confirmer qu'aucun fichier hors périmètre n'a été modifié par la refonte.

**Vérification :** build et lint terminés ; contrôle visuel desktop/mobile et destinations des liens confirmés. Signaler les avertissements préexistants sans les corriger dans le cadre de ce travail.

**Dépendances :** tâches 1 et 2.