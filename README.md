# sirlisko.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/fd6aac84-e915-4db6-aaf1-eb996620da79/deploy-status)](https://app.netlify.com/sites/sirlisko/deploys)

> [https://sirlisko.com](https://sirlisko.com) - personal (and experimental) website.

I tried to keep this website as a proof of concept of the technologies I am currently working with or to just trying out new stuff :)

---

The Website is built using [Astro](https://astro.build/).

In order to have the Website up and running NodeJs is mandatory, it can be installed using [nvm](https://github.com/nvm-sh/nvm), a handy NodeJs binary manager, or using the official installer present in the NodeJs website ([https://nodejs.org/download/](https://nodejs.org/download/)).

## Install the dependencies

> this project is using [`pnpm`](https://pnpm.io/) as package manager but it should work with `npm` as well

Once NodeJs is installed, its package manager NPM will be available, and you will be able to [install `pnpm`](https://pnpm.io/installation).

```bash
npm install -g pnpm
```

Then all you need to do is run in the main directory of the project the following command.

```bash
pnpm install --production
```

This will install all the software needed in order to build and run the Website.

## Build the Website

```bash
pnpm run build
```

## Work with the Website (Develop)

The easier way to build the Website in Develop mode is with:

```bash
pnpm start
```

In addition to the build, this command is also **watching the file system** looking for files change. Once one of the resources changes the relative assets are immediately recompiled.

## Generate the resume in pdf format

```bash
pnpm start
pnpx electron-pdf http://localhost:4321/resume resume.pdf
```
