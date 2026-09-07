# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Start dev server (http://localhost:4321)
pnpm build          # Build for production
pnpm preview        # Preview production build

pnpm lint           # Run Biome linter (with auto-fix)
pnpm format         # Format files with Biome
pnpm typecheck      # TypeScript type check (tsc --noEmit)
pnpm test           # Run all tests with Vitest
pnpm test -- --run  # Run tests once (no watch mode)
```

To generate a PDF resume:
```bash
pnpm start
pnpx electron-pdf http://localhost:4321/resume resume.pdf
```

## Architecture

This is an **Astro** personal website with **React** islands for interactive components.

### Data Layer (`data/`)

Site content is stored as TypeScript data files — not a CMS or API:
- `data/me.ts` — home page content (keywords, descriptions, links)
- `data/projects.ts` — projects page content
- `data/resume.ts` — resume page content (skills, experiences, projects)

All data types are defined in `src/types.ts`.

### Pages & Routing (`src/pages/`)

- `/` — Home page (index.astro)
- `/projects` — Projects listing
- `/resume` — Resume/CV page (supports `?alt` query param for light theme)

### Components

- `src/layouts/Layout.astro` — Single layout with SEO meta tags, `Press Start 2P` font, and Astro's `ClientRouter` for view transitions
- `src/components/Ghost.tsx` — Interactive React component: a ghost that follows the cursor with 3 lives (rendered client-side only via `client:only="react"`)
- `src/components/Greeting.tsx` — React typewriter effect cycling through descriptions from `data/me.ts` (rendered with `client:load`)
- `src/components/resume/` — Astro components for each resume section

### Styling

- Scoped styles written directly in `.astro` files using `<style>` blocks
- CSS Modules (`.module.scss`) used for React components (e.g., `Ghost.module.scss`)
- Global resume styles in `src/styles/resume.scss`
- Font: `Press Start 2P` (8-bit pixel font) applied globally

### Code Quality

Biome handles both linting and formatting (replaces ESLint + Prettier). Config in `biome.json`:
- Indentation: tabs
- Quotes: double (`"`)
- Linting rules are relaxed for `.astro`, `.svelte`, and `.vue` files

Tests use **Vitest** + **@testing-library/react** with jsdom environment. Test files use `.spec.tsx` suffix co-located with components.
