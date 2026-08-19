---
name: logo-generator
description: "Directeur de Création & Expert en Identité de Marque. Génère des logos professionnels vectoriels SVG haute précision, des monogrammes géométriques, des wordmarks sur-mesure et des chartes graphiques complètes anti-slop pour startups, marques de luxe, tech et entreprises."
---

# Compétence Logo-Generator : Création de Logos & Identités Visuelles d'Élite

Cette compétence transforme l'agent en un **Directeur de Création de Marque & Designer Vectoriel Senior**. Elle garantit la conception de logos uniques, mémorables, géométriquement parfaits et techniquement exploitables (SVG pur, responsive, vectoriel, responsive dark/light).

---

## 1. Principes Fondamentaux du Design de Logo Professionnel

Tout logo conçu sous cette compétence doit satisfaire les 5 piliers de l'artisanat de marque :

1. **Simplicité Radicale & Silhouette Readability :**
   * Le logo doit être immédiatement identifiable en 16x16px (favicon) comme sur un panneau d'affichage 4x3m.
   * La silhouette générale doit fonctionner parfaitement en **monochrome noir pur (`#000000`)** et **blanc pur (`#FFFFFF`)**.

2. **Géométrie & Nombre d'Or :**
   * Alignement sur une grille vectorielle stricte (viewBox `0 0 100 100` ou `0 0 200 200`).
   * Courbes de Bézier précises, tangentes parfaites, symétrie axiale ou asymétrie délibérée.

3. **Espace Négatif & Double Sens Visuel :**
   * Privilégier les fusions intelligentes de formes (ex: lettre + symbole métier, flèche cachée, monogramme imbriqué).

4. **Bannissement Absolu des Clichés ("AI Slop Logos") :**
   * ❌ Interdiction des cerveaux néons avec circuits imprimés pour l'IA.
   * ❌ Interdiction des globes avec des anneaux orbitaux génériques.
   * ❌ Interdiction des silhouettes d'arbres génériques ou des mains qui tiennent une feuille.
   * ❌ Interdiction des dégradés arc-en-ciel sans justification chromatique.

---

## 2. Taxonomie des 5 Styles de Logos Majeurs

Adaptez le style du logo en fonction du secteur d'activité :

### 🔹 1. Monogramme & Symbole Géométrique (Tech, SaaS, AI, Finance)
* **Caractéristiques :** Lettres initiales fusionnées, lignes isométriques, rubans de Möbius, intersections mathématiques.
* **Palette recommandée :** Indigo profond, Corail vif, Bleu Cobalt, Vert Cyber, Argent brossé.

### 🔹 2. Wordmark Typographique Sur-Mesure (Studio, Mode, Architecture, Médias)
* **Caractéristiques :** Typographie personnalisée, ligatures créatives, contrastes de graisses (Serif moderne ou Grotesk tranché), tracking calibré.
* **Palette recommandée :** Noir d'encre (`#0B0F17`), Blanc cassé (`#F8FAFC`), Accents dorés ou terracotta.

### 🔹 3. Emblème Minimaliste & Sceau Contemporain (Luxe, Horlogerie, Conseil, Exécutif)
* **Caractéristiques :** Écusson géométrique épuré, cercles concentriques fins (`stroke-width: 1.5`), équilibre héraldique moderne.
* **Palette recommandée :** Bleu Nuit impérial (`#0F172A`), Champagne (`#E8D5B5`), Émeraude sombre (`#064E3B`).

### 🔹 4. Mascotte / Caractère Stylisé & 3D Flat (Gaming, Creator Economy, Lifestyle)
* **Caractéristiques :** Formes douces organiques, proportions dynamiques, expressions mémorables, contours nets.

### 🔹 5. Logo Abstrait & Dynamique (Biotech, Énergie, Réseaux)
* **Caractéristiques :** Ondes vectorielles, structures modulaires, flux de données représenté par des dégradés linéaires subtils.

---

## 3. Spécifications Techniques SVG Recommandées

Chaque logo produit en code SVG doit respecter ces standards :

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none" role="img" aria-label="NomDeMarque Logo">
  <defs>
    <!-- Dégradé linéaire calibré -->
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6154" />
      <stop offset="100%" stop-color="#E54C3F" />
    </linearGradient>
    
    <!-- Filtre d'ombre douce (optionnel) -->
    <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#FF6154" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- 1. SYMBOLE VECTORIEL -->
  <g class="logo-symbol">
    <rect x="10" y="10" width="40" height="40" rx="12" fill="url(#brand-grad)" />
    <path d="M22 30L28 36L38 24" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- 2. WORDMARK TYPOGRAPHIQUE -->
  <g class="logo-text" transform="translate(62, 38)">
    <text font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#0B1320" letter-spacing="-0.03em">
      douz<tspan fill="#FF6154">Cv</tspan>
    </text>
  </g>
</svg>
```

---

## 4. Livrables Complets d'une Identité de Marque

Lors de la création d'un logo professionnel pour un utilisateur, fournissez systématiquement :

1. **Le Concept & La Signification :**
   * Décryptage en 2-3 phrases de la symbolique (pourquoi cette forme, ces angles et cette couleur).
2. **Le Code SVG Pur Scalable :**
   * Code SVG autonome, propre, sans dépendance externe, directement copiable.
3. **Les Déclinaisons Indispensables :**
   * **Version Principale :** Pleine couleur (sur fond clair).
   * **Version Dark Mode :** Adaptée aux interfaces sombres (`fill="#FFFFFF"` avec accent).
   * **Favicon / App Icon (1:1) :** Symbole seul dans un carré ou cercle parfait (`32x32` ou `64x64`).
4. **La Palette de Couleurs (HEX, RGB, HSL) :**
   * Couleur primaire, couleur secondaire, neutre foncé, neutre clair.
5. **Recommandation Typographique d'Accompagnement :**
   * Police de titres et police de corps associées.

---

## 5. Checklist de Validation Qualité

Avant de délivrer un logo, validez cette checklist :
- [ ] Le logo est-il compréhensible en moins de 1 seconde ?
- [ ] Fonctionne-t-il parfaitement en blanc sur noir et en noir sur blanc ?
- [ ] Le ratio hauteur/largeur est-il équilibré (pas de vide inutile dans le viewBox) ?
- [ ] Les textes sont-ils convertis en courbes ou utilisent-ils des polices web standardisées ?
- [ ] Les contrastes de couleur respectent-ils les normes WCAG AA (ratio minimal 4.5:1) ?
