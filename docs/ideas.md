# Ideas

Follow-ups from the October 2026 audit of sirlisko.com and the blog. Each one is
meant to be its own PR; delete an entry once it ships.

## Both sites

- **Link checker.** Run [lychee](https://github.com/lycheeverse/lychee-action)
  on a schedule in both repos. The data tests only check that external URLs are
  well formed, which is how the pixelicons 404 slipped through.
- **One nav for both sites.** The blog's header (`src/components/Header.astro`
  there) copies the links in `data/me.ts` here. Publish them as `/nav.json` and
  have the blog read it at build time, so adding a page can't drift.

## sirlisko.com

- **Type-check `.astro` files.** `astro check` doesn't support TypeScript 7.
  Once TypeScript 7.1 is out, set up `@astrojs/ts-content-mapper` so `tsc`
  covers `.astro` files too.
- **Automatic "last updated".** /now and /uses carry hand-typed dates
  (`NOW_LAST_UPDATED`, `USES_LAST_UPDATED`). Take them from the data file's last
  commit and render them in a `<time datetime>`.
- **Project screenshots through `astro:assets`.** Move them from `public/` to
  `src/` so Astro makes AVIF and real srcsets, then drop the `@2x` naming and
  the test that guards it.
- **The blog in /credits.** Add it as a level (Game Boy, `/blog`) and credit
  AstroPaper.

## Blog

- **Game Boy maps.** Skin Leaflet: a palette filter on the tiles, a pixel
  border, LED-red tracks and pixel zoom buttons. It should also remove the seam
  between tile rows on /100km.

## From the audit, not picked up yet

- **Nothing checks blog commits.** The blog's `CLAUDE.md` says Husky runs
  Prettier on commit, but Husky isn't installed and `core.hooksPath` points at
  leftover stubs. CI only runs on pull requests, while posts go straight to
  main.
- **Post-page listeners pile up.** The rerun script in
  `src/pages/[...slug]/index.astro` adds a `scroll` and an `astro:after-swap`
  listener on every post visit.
