# Icon Finder

A design tool for searching, comparing, customizing, and exporting icons from properly licensed open-source icon libraries — Lucide, Heroicons, Material Symbols, and Font Awesome Free.

Built as a frontend-only React + TypeScript + Vite app, with no backend or database.

## Features

- Search by name, tag, or keyword across all libraries
- Filter by library and by icon style (Outline / Filled), where a library genuinely provides both
- An inspector panel with live size, color, stroke width, and rotation controls
- Copy as SVG, HTML, or a ready-to-paste React/TSX component
- Download as a standalone SVG file
- Favorites, saved locally in the browser
- Light and dark themes, responsive down to mobile (the inspector becomes a bottom sheet)

## Icon data

All icon SVG data is extracted once, at build time, directly from each library's own official npm package — never hand-typed or approximated. License and source information for each library lives in [`src/data/libraries.ts`](src/data/libraries.ts).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, deployable anywhere that serves static files (this project is configured for Netlify via `netlify.toml`).
