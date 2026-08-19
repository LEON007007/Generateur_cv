---
name: Pro-Afrique CV
colors:
  surface: '#FFFFFF'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ef'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#43474c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#73777d'
  outline-variant: '#c3c7cc'
  surface-tint: '#4c6173'
  primary: '#041b2b'
  on-primary: '#ffffff'
  primary-container: '#1b3041'
  on-primary-container: '#8398ac'
  inverse-primary: '#b3c9df'
  secondary: '#b22a24'
  on-secondary: '#ffffff'
  secondary-container: '#ff6154'
  on-secondary-container: '#650004'
  tertiary: '#291502'
  on-tertiary: '#ffffff'
  tertiary-container: '#412911'
  on-tertiary-container: '#b38f6f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5fb'
  primary-fixed-dim: '#b3c9df'
  on-primary-fixed: '#061d2e'
  on-primary-fixed-variant: '#34495b'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#900d0f'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#e7bf9d'
  on-tertiary-fixed: '#2b1702'
  on-tertiary-fixed-variant: '#5d4127'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
  text-muted: '#6B7280'
  navy-light: '#2C4A63'
typography:
  display:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is built to serve the emerging professional market in French-speaking Africa, balancing high-end recruitment standards with local cultural accessibility. The personality is **Professional, Modern, and Trust-inspiring**, aimed at job seekers who need a competitive edge in international and local markets.

The aesthetic follows a **Modern Corporate** style with a focus on high-clarity information architecture. It leverages generous whitespace and a sophisticated palette to ensure the CV content remains the focal point. While the foundation is clean and structured, subtle tactile elements like soft shadows and rounded surfaces prevent the UI from feeling overly rigid or institutional.

## Colors
The palette is dominated by **Deep Navy Blue (#1B3041)** to establish authority and reliability. The **Off-white (#EFEEEA)** background reduces eye strain and provides a softer, more premium feel than pure white, which is reserved exclusively for **Content Surfaces (#FFFFFF)** like CV pages and form cards.

**Coral (#FF6154)** is our high-energy accent. It must be used sparingly and strategically for primary Call-to-Action (CTA) buttons and critical status indicators to maintain its visual impact without overwhelming the professional tone.

## Typography
The system uses **DM Sans** for headlines to provide a modern, geometric character that feels both approachable and contemporary. **Inter** is utilized for all body text and UI labels due to its exceptional legibility at small sizes and high x-height, which is critical for information-dense CV forms.

Hierarchy is established through significant weight shifts rather than just size. Use `Deep Navy Blue` for all headlines and `Text-muted` for secondary body descriptions to create clear visual pathways for the user's eye.

## Layout & Spacing
This design system employs a **Fixed Grid** model for desktop to ensure CV previews maintain their intended aspect ratios. On mobile, it shifts to a **Fluid Grid** with a single-column layout for easy data entry.

The spacing scale is based on an **8px linear rhythm**. 
- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Form Layouts:** Use a 2-column split for large screens (Form on left, Live Preview on right).
- **Whitespace:** Use "oversized" padding (32px+) between major sections to emphasize the clean, high-end recruitment feel.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** combined with **Ambient Shadows**. 
1. **Level 0 (Base):** Off-white (#EFEEEA) background.
2. **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a subtle 1px border (#E5E7EB) or a very soft, diffused shadow (0px 4px 20px rgba(27, 48, 65, 0.05)).
3. **Level 2 (Interactive):** When a card or input is focused, the shadow deepens (0px 10px 30px rgba(27, 48, 65, 0.10)) to provide tactile feedback.

Avoid heavy black shadows; always tint shadows with the `Deep Navy Blue` primary color at very low opacities to maintain a cohesive professional look.

## Shapes
The shape language is defined by **Rounded (12px - 16px)** corners. This softens the "industrial" feel of traditional recruitment software and makes the tool feel more like a modern creative suite.

- **Standard Components:** 12px radius (Buttons, Input Fields).
- **Containers/Cards:** 16px radius (CV Preview, Form Sections).
- **Selection States:** Use a pill-shape (full radius) for small tags or "Add Section" buttons to distinguish them from primary inputs.

## Components
- **Buttons:** Primary buttons use `Coral` with white text and no shadow unless hovered. Secondary buttons use a `Deep Navy` outline with a 1px weight.
- **Input Fields:** Large 12px rounded corners with a subtle grey border. On focus, the border transitions to `Deep Navy` (not Coral) to keep the focus on the task, not the brand.
- **CV Preview Card:** Should feature the 16px radius and the Level 2 ambient shadow to appear as if it is "floating" above the workspace.
- **Progress Steppers:** Use `Deep Navy` for completed steps and `Coral` only for the current active step.
- **Chips/Badges:** Used for skills or languages; these should have a light grey background (#F3F4F6) and 8px rounded corners to look distinct from primary action buttons.
- **Empty States:** Use simplified illustrations in `Deep Navy` with 40% opacity to maintain the professional aesthetic without distracting the user.