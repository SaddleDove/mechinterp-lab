# DESIGN.md — Mechanistic Interpretability Lab

> This document describes the visual language of a **front-end concept piece**. No model is loaded and every value rendered on screen is simulated; see the disclaimer at the top of `README.md`.

## Brand & Identity
- **Product**: MechInterp Lab — a browser-based mechanistic interpretability console (concept UI)
- **Audience**: Graduate students, PhD researchers, AI safety researchers
- **Tone**: Academic precision meets cutting-edge tech. Think Anthropic research papers, CircuitsVis, TransformerLens

## Visual Strategy
- Dark-first design inspired by scientific visualization tools
- Data-dense layouts with clear visual hierarchy
- Interactive visualizations as first-class citizens
- Subtle depth through layered dark surfaces

## Color Palette
- **Background**: Deep obsidian (#09090b) → charcoal (#18181b) gradient
- **Surface**: Layered dark panels (#1c1c21, #27272a)
- **Primary accent**: Electric indigo (#6366f1) — for interactive elements, selections
- **Secondary accent**: Warm amber (#f59e0b) — for highlights, warnings, important data
- **Tertiary**: Emerald (#10b981) — for positive signals, activations
- **Data palette**: Viridis-inspired sequential scale for heatmaps
- **Text**: Zinc-100 (#f4f4f5) primary, Zinc-400 (#a1a1aa) secondary, Zinc-600 (#52525b) muted

## Typography
- **Display**: Inter (variable weight) — clean, modern, highly legible
- **Monospace**: JetBrains Mono — for data, code, token labels
- **Scale**: Tight tracking on headings (-0.02em), relaxed on body (0.01em)

## Layout & Spacing
- Sidebar navigation (240px) + main content area
- Generous padding (p-6 to p-8) for breathing room
- Card-based panels with subtle borders (border-zinc-800)
- Grid-based layouts for visualization matrices

## Motion & Interaction
- Subtle fade-in on page transitions
- Smooth hover states with 150ms ease transitions
- Data-driven animations in visualizations (CSS transitions on SVG attributes)
- No bouncy/playful animations — everything precise and scientific

## Design Constraints
- No gradients on text (keep it clean)
- No rounded corners > 8px (maintain precision feel)
- No saturated backgrounds (data should pop, not chrome)
- No decorative illustrations (use data visualizations as visual interest)
