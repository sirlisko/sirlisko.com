# sirlisko.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/fd6aac84-e915-4db6-aaf1-eb996620da79/deploy-status)](https://app.netlify.com/sites/sirlisko/deploys)

> [https://sirlisko.com](https://sirlisko.com) - personal website.

---

The Website is built using [Astro](https://astro.build/).

In order to have the Website up and running NodeJs is mandatory, it can be installed using [nvm](https://github.com/nvm-sh/nvm), a handy NodeJs binary manager, or using the official installer present in the NodeJs website ([https://nodejs.org/download/](https://nodejs.org/download/)).

## Install the dependencies

> this project uses [`pnpm`](https://pnpm.io/) as package manager

Once NodeJs is installed, its package manager NPM will be available, and you will be able to [install `pnpm`](https://pnpm.io/installation).

```bash
npm install -g pnpm
```

Then all you need to do is run in the main directory of the project the following command.

```bash
pnpm install
```

This will install all the software needed in order to build and run the Website.

## Blog posts

The posts live in `src/content/posts`, one Markdown file each, with their images in `images/<slug>/`. GPX tracks sit in `public/blog/gpx`.

The posts folder is two-way synced with the `Blog` folder of an Obsidian vault, so files can change outside git. Files starting with `_` are drafts: never published, and ignored by git.

Raw images and tracks go in the gitignored `assets/` folder; only the optimised copies are committed:

```bash
pnpm images   # assets/<post-slug>/ → src/content/posts/images/<post-slug>/
pnpm gpx      # assets/gpx/ → public/blog/gpx/, simplified to the shape the map needs
```

Each post's Game Boy share card is drawn with Satori at build time (`src/lib/blog/ogCard.ts`), so there's nothing to generate by hand.

## Build the Website

```bash
pnpm build
```

The build also runs [Pagefind](https://pagefind.app/) over `dist/` to index the blog, so search only works in a build or `pnpm preview`, not in the dev server.

## Work with the Website (Develop)

Start the local dev server with hot module replacement at `http://localhost:4321`:

```bash
pnpm start
```

To preview the production build locally:

```bash
pnpm preview
```

## Linting, Formatting, Typechecking and Testing

This project uses **Biome** and **Vitest** to ensure code quality, consistency, and correctness. The following commands are available:

- `pnpm check`: Run Biome to lint and format all files.
- `pnpm typecheck`: Generate Astro's types, then run the TypeScript type check (`tsc --noEmit`).
- `pnpm test`: Run unit tests using Vitest.

### GitHub Actions

A GitHub Actions workflow runs on every push and pull request to ensure that:

- The code passes Biome checks.
- The code is formatted according to Biome rules.
- The code passes types checks.
- The code passes the unit tests.
- The site builds.

## The stack

- **Runtime**: Node.js (v. 24) for building the website.
- **Language**: TypeScript for type safety and better developer experience.
- **Framework**: Astro.js for building the pages
- **Linting and Formatting**: Biome for consistent code quality and style.
- **Testing**: Unit tests with Vitest.
- **UI**: no framework — the interactive bits are plain TypeScript modules in `src/lib/`, driven by `<script>` blocks in Astro components.
- **Blog**: Markdown content collection, Pagefind for search, Leaflet for the GPX maps, Satori for the share cards.
- **CI/CD**: GitHub Actions for automating linting, formatting, and testing.

## Generate the share images

```bash
pnpm generate:og
```

Draws a 1200×630 card for the home page, `/now`, `/projects`, `/uses`, `/resume`, `/credits` and the 404 into `public/images/og/`. Rerun it after changing a card's text in `data/og.json` or its look in `scripts/generate-og.mjs`. A page without a card falls back to `me_banner.jpg`. Blog cards aren't drawn here: see [Blog posts](#blog-posts).

## Capture the project screenshots

```bash
pnpm capture:screenshots
```

Screenshots the live side projects into `src/images/projects/` for `/projects`.

## Audit the live site

```bash
pnpm lighthouse [--desktop] [--real] [url ...]
pnpm gsc [url ...]
```

- `lighthouse` prints scores, Core Web Vitals and the biggest savings for a handful of pages (or the URLs passed). `--real` throttles for real like PageSpeed, which judges the GPX maps more fairly.
- `gsc` asks Search Console for the index status of every URL in the sitemap. It needs `GSC_CREDENTIALS` in `.env`, the path to a service account key (see `.env.example`).

## Generate the resume in pdf format

```bash
pnpm generate:cv
```

This builds the site, spins up a preview server, and prints `/resume` twice:

- `public/cv/luca-lischetti-resume.pdf` — public
- `private/luca-lischetti-resume-full.pdf` — with the phone number from `.env`. Built in a temporary directory and written outside `public/`, so neither the page nor the PDF can reach `dist/`; `private/` is gitignored. Send it on request.

PDFs are automatically compressed using Ghostscript if available. To install it:

```bash
brew install ghostscript
```

## License

The code is [MIT](LICENSE). The blog posts, their images and GPX tracks are [CC BY 4.0](src/content/posts/LICENSE); code snippets in the posts are MIT like the rest.
