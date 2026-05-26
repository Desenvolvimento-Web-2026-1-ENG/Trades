---
name: Neon Syndicate
colors:
  surface: '#0c1420'
  surface-dim: '#0c1420'
  surface-bright: '#323947'
  surface-container-lowest: '#070e1a'
  surface-container-low: '#141c28'
  surface-container: '#18202c'
  surface-container-high: '#232a37'
  surface-container-highest: '#2d3542'
  on-surface: '#dbe3f4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dbe3f4'
  inverse-on-surface: '#29313e'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#aec6ff'
  on-secondary: '#002e6a'
  secondary-container: '#4f8eff'
  on-secondary-container: '#00275e'
  tertiary: '#fcf5ff'
  on-tertiary: '#3c0090'
  tertiary-container: '#e3d4ff'
  on-tertiary-container: '#7318ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#aec6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004396'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#0c1420'
  on-background: '#dbe3f4'
  surface-variant: '#2d3542'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.1'
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system establishes a high-octane, futuristic environment tailored for the modern collector. It bridges the gap between a high-stakes gaming marketplace and a professional financial dashboard. The brand personality is technical, elite, and high-fidelity, evoking the feeling of a digital vault where rare assets are exchanged.

The visual direction utilizes a blend of **Glassmorphism** and **High-Contrast Neon** aesthetics. It relies on deep spatial depth, glowing terminators, and precise geometric precision to signal security and "pro-grade" trading capabilities. The UI should feel reactive and "powered on," using light as a primary indicator of interactivity and value.

## Colors

The palette is rooted in a "Deep Space" navy to provide maximum contrast for neon accents. 

- **Primary (Cyan):** Used for critical actions, active states, and "hot" market data. It represents energy and connectivity.
- **Secondary (Electric Blue):** Used for secondary interactions, structural accents, and branding elements.
- **Tertiary (Vivid Purple):** Reserved for "Epic" or "Rare" status indicators and high-value item highlights.
- **Surface System:** Backgrounds use a gradient scale of deep navies (`#0a121e` to `#162231`) to create depth without relying on pure black, maintaining a premium "LCD" feel.
- **Status Colors:** Success is rendered in emerald neon, alerts in high-visibility orange, and errors in a piercing surgical red.

## Typography

The typography system mixes geometric modernism with technical precision. 

- **Headlines:** Sora provides a wide, futuristic stance with ultra-modern curves. Use uppercase for "Display" level text to mimic HUD (Heads-Up Display) interfaces.
- **Body:** Inter ensures maximum readability for complex trading data and item descriptions.
- **Data & Labels:** JetBrains Mono is used for prices, serial numbers, and timestamps to evoke a "system-level" or "encoded" aesthetic. 

Tracking should be slightly increased for labels and decreased for large headlines to maintain the technical, cinematic feel.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with fixed maximum constraints for dashboard views.

- **Grid:** A 12-column system for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px base unit drives the spacing, but a 4px "micro-unit" is used for tight technical components like data tables and HUD overlays.
- **Density:** High density in dashboard views to allow for maximum information display (prices, charts, listings), with more generous padding in landing and item-detail pages to emphasize the "Gallery" aspect of the collectibles.
- **Breakpoints:** Mobile (<600px), Tablet (600px-1024px), Desktop (>1024px).

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Luminescent Borders** rather than traditional shadows.

- **Level 0 (Floor):** The base background, typically a deep navy gradient.
- **Level 1 (Card/Container):** A semi-transparent surface (10-15% opacity) with a 20px backdrop blur. Borders are 1px wide, using a low-opacity white or blue.
- **Level 2 (Hover/Active):** Increased opacity and a "Inner Glow" effect. The border color shifts to the Primary Cyan color with a subtle `drop-shadow` glow (blur: 8px, spread: 0px).
- **Level 3 (Modal/Overlays):** 40% surface opacity, 40px backdrop blur, and a strong external "Glow" to separate the element from the trading floor below.

## Shapes

The shape language is **Sharp and Geometric**. 

- **Corners:** Stick to 0px (Sharp) for a hard-tech, military-grade interface feel. 
- **Chamfers:** Where possible, use 45-degree clipped corners (chamfers) for primary buttons and card headers to reinforce the futuristic hardware aesthetic.
- **Indicators:** Use hexagons or diamonds for status pips and rarity tier icons.
- **Lines:** Use thin, 1px rules for dividers, often terminated with a small square "node" to mimic circuit board traces.

## Components

- **Buttons:** Primary buttons use a solid Cyan-to-Blue gradient with black text for high contrast. Secondary buttons use a transparent background with a glowing cyan border. All buttons should have a `scale(0.98)` active state.
- **Status Indicators:** Use glowing pips. A "Mint Condition" tag should have a breathing animation (subtle opacity pulse) in Primary Cyan.
- **Trading Cards:** The centerpiece of the UI. Cards feature a "holographic" overlay effect that reacts to mouse movement (using a light-sweep gradient).
- **Input Fields:** Dark, recessed backgrounds with a 1px bottom-border that lights up when focused. Use Mono fonts for numerical inputs.
- **HUD Chips:** Small, sharp-edged tags for categories (e.g., [POKEMON], [VINTAGE]). Use uppercase JetBrains Mono.
- **Data Visualizations:** Line charts should use a Primary Cyan stroke with a gradient area fill that fades into the background. Grid lines in charts should be very faint navies.