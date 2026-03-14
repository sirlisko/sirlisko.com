# sirlisko.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/fd6aac84-e915-4db6-aaf1-eb996620da79/deploy-status)](https://app.netlify.com/sites/sirlisko/deploys)

> [https://sirlisko.com](https://sirlisko.com) - personal (and experimental) website.

I tried to keep this website as a proof of concept of the technologies I am currently working with or to just trying out new stuff :)

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

## Build the Website

```bash
pnpm build
```

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

- `pnpm lint`: Run Biome to check for issues.
- `pnpm format`: Format all files using Biome.
- `pnpm typecheck`: Run Typescript type check.
- `pnpm test`: Run unit tests using Vitest.

### GitHub Actions

A GitHub Actions workflow runs on every push and pull request to ensure that:

- The code passes Biome checks.
- The code is formatted according to Biome rules.
- The code passes types checks.
- The code passes the unit tests.

## The stack

- **Runtime**: Node.js (v. 24) for building the website.
- **Language**: TypeScript for type safety and better developer experience.
- **Framework**: Astro.js for building the pages
- **Linting and Formatting**: Biome for consistent code quality and style.
- **Testing**: Unit tests with Vitest.
- **UI Library**: some of the UI interactions are powered by React.
- **CI/CD**: GitHub Actions for automating linting, formatting, and testing.

## Generate the resume in pdf format

```bash
pnpm start
pnpx electron-pdf http://localhost:4321/resume resume.pdf
```
