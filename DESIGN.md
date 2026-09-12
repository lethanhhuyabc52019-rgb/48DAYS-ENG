---
name: SMO-BIM Apple Minimalist Pro Design System
version: 2.0.0
colors:
  primary-bg: "#000000"         # Deep Space Black (Apple Keynote / Pro Display aesthetic)
  surface-glass: "rgba(255, 255, 255, 0.04)"
  surface-glass-hover: "rgba(255, 255, 255, 0.08)"
  surface-card: "#0d0d11"       # Obsidian Titanium
  surface-card-subtle: "#13131a"
  border-glass: "rgba(255, 255, 255, 0.10)"
  border-glass-active: "rgba(0, 229, 255, 0.40)"
  text-headline: "#F5F5F7"      # Apple crisp white
  text-body: "#A1A1A6"          # Apple technical silver
  text-muted: "#6E6E73"         # Apple dark secondary
  accent-cyan: "#2997FF"        # Apple Pro Electric Blue
  accent-emerald: "#30D158"     # Apple System Green
  accent-orange: "#FF9F0A"      # Apple Dynamic Amber / Coral CTA
  accent-orange-hover: "#FFB340"
typography:
  headline-hero:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.035em
  headline-section:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.025em
  body-large:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-default:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label-mono:
    fontFamily: JetBrains Mono, SF Mono, monospace
    fontSize: 12px
    fontWeight: 600
    letterSpacing: 0.06em
rounded:
  sm: 8px
  md: 14px
  lg: 22px
  xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
components:
  button-pill-primary:
    backgroundColor: "{colors.text-headline}"
    textColor: "#000000"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-pill-accent:
    backgroundColor: "{colors.accent-orange}"
    textColor: "#000000"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-pill-secondary:
    backgroundColor: "{colors.surface-glass}"
    textColor: "{colors.text-headline}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  card-glass-bento:
    backgroundColor: "{colors.surface-card}"
    border: "1px solid {colors.border-glass}"
    rounded: "{rounded.xl}"
    padding: "32px"
---

# SMO-BIM Apple Minimalist Pro Design System

## Overview
An Apple-inspired, ultra-minimalist, precision-engineered visual system tailored for AEC, BIM, and Revit Automation leaders. The interface embodies **clarity, breathing space, optical precision, effortless readability**, and **flawless fluid responsiveness across all devices (Mobile, Tablet, Desktop, Ultra-Wide)**.

## Core Apple-Style Principles
1. **True Depth & Obsidian Black**: Pure `#000000` base with obsidian titanium layers (`#0d0d11`, `#13131a`), eliminating visual noise and letting project visuals and typography pop with cinematic elegance.
2. **Liquid Frosted Glass & Refraction**: Refined `backdrop-blur-2xl` with ultra-fine `border-white/10` and soft top specular highlights (`shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]`).
3. **Typographic Hierarchy & Breathing Space**: Generous whitespace (`py-24 lg:py-36`), large tight-tracked display typography, silky smooth paragraph measures (max 60ch), and clear semantic scale.
4. **Bento Grid Architecture**: Asymmetric, balanced tiles with mixed aspect ratios, rounded corners (`rounded-3xl`), and rich visual contrasts.
5. **Universal Touch & Device Ergonomics**:
   - Minimum 48px touch targets for mobile.
   - Zero horizontal overflow on any device width (from 320px iPhone SE to 4K displays).
   - Single-line CTA buttons on desktop and full-width thumb-friendly buttons on mobile.
   - Smooth swipe gestures and intuitive touch-enabled modal transitions.
6. **Zero Stock Art & Real Deliverables**: 100% real portfolio imagery from the `Documents/` folder, authentic logo, and real background hero video.
7. **Strict No-LOD Policy**: Absolute adherence to zero mentions of LOD.
