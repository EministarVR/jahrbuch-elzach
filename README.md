# Jahrbuch Elzach

Interne Plattform zur Sammlung & Kuratierung von Inhalten für das Schuljahrbuch (Schulzentrum Oberes Elztal). Gebaut mit Next.js App Router, einfache MySQL Anbindung und Session Handling.

## UI / Frontend Upgrade (Oktober 2025)

Highlights:

- Neue Libraries: `framer-motion` (Elegante, performante Animationen) & `lucide-react` (Icons).
- Überarbeitete globale Styles (`app/globals.css`): Gradients, Glas-Layer, weiche Noise-Textur, Utility Klassen (`text-gradient`, `backdrop-soft`, `animate-in`, `gradient-border`, `bg-shimmer`).
- Neue Display-Font (DM Serif Display) kombiniert mit Geist Sans & Mono.
- Neue Komponenten: `MotionFade`, `FancyHeading`.
- Verbessert: `GlowButton` (Varianten, Icons, Loading), `GlassCard` (Hover-Layer, Fade-In, Delay), `ParallaxHero`, `Header` (Icons + Glas). 
- Startseite komplett redesigned (Hero Eyebrow, Feature Grid, Phasen mit Icons, News-Karten, animierter Footer).
- Login-Screen mit Icons, farbigem Gradient-Button & Motion.

## Komponenten Kurzreferenz

### GlowButton
Props: `variant` (primary | secondary | ghost | gradient), `loading`, `iconLeft`, `iconRight`, `as="a"` für Link.

### GlassCard
Props: `hover` (default true), `fade` (default true), `delay`, optionale `header` / `footer`.

### MotionFade
Intersection Fade-In. Props: `delay`, `y` (Start Offset).

### FancyHeading
Props: `subtitle`, `icon` (bool), `center`.

## Development

Install & Start:

```bash
npm install
npm run dev
```

Läuft unter: http://localhost:3000

## Nächste mögliche Verbesserungen

1. Dark Mode Toggle – Klasse `.dark` auf `<html>` setzen (Styles vorbereitet).
2. Farb-Theming via CSS Vars (`--accent`, `--accent-rgb`).
3. Prefers-Reduced-Motion respektieren (MotionFade optional deaktivieren).
4. Toast / Notification System (Submission Erfolge, Fehler).
5. Einheitliche Form Controls + Validierungsfeedback.
6. SEO / OG-Bild Generierung (z. B. @vercel/og).
7. Skeleton Loading States (`.bg-shimmer`).
8. Upload-Unterstützung (Bilder) mit Progress.
9. Rate Limiting / Spam Schutz.
10. Admin Dashboard Visualisierungen (Charts für Anzahl Einreichungen je Tag).

## Qualität & Performance

- Animationen sind GPU-freundlich (Opacity + Translate / nur Transform).
- Framer Motion wird tree-shaken -> kleine Bundle-Kosten.
- Glas-/Blur-Einsatz moderat, sollte aber auf Mobile geprüft werden.

## Lizenz
Interne schulische Nutzung. Keine externe Verteilung ohne Freigabe.
