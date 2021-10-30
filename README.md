# sirlisko.com

[![dependency Status](https://david-dm.org/sirlisko/sirlisko.com/status.svg)](https://david-dm.org/sirlisko/sirlisko.com#info=dependencies) [![devDependency Status](https://david-dm.org/sirlisko/sirlisko.com/dev-status.svg)](https://david-dm.org/sirlisko/sirlisko.com#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/sirLisko/sirlisko.com/badge.svg?branch=master)](https://coveralls.io/github/sirLisko/sirlisko.com?branch=master)

> [https://sirlisko.com](https://sirlisko.com) - personal (and experimental) website.

I tried to keep this website as a proof of concept of the technologies I am currently working with or to just trying out new stuff :)

---

The Website is built using [Gatsby](https://gatsbyjs.org).

In order to have the Website up and running NodeJs is mandatory, it can be installed using [n](https://github.com/tj/n), a handy NodeJs binary manager, or using the official installer present in the NodeJs website ([https://nodejs.org/download/](https://nodejs.org/download/)).

## Install the dependencies

Once NodeJs is installed, its package manager NPM will be available, all you need to do is run in the main directory of the project the following command.

```bash
npm install --production
```

This will install all the software needed in order to build and run the Website.

## Build the Front-End

```bash
npm run build
```

## Work with the Front-End (Develop)

The easier way to build the Front-End in Develop mode is with:

```bash
npm start
```

In addition to the build, this command is also **watching the file system** looking for files change. Once one of the resources changes the relative assets are immediately recompiled.

## Running the tests

In order to running the tests and linters the **dev dependencies** need to be installed.

```bash
npm install
```

Once the dependencies are installed:

```bash
npm test
```

The test command is running the unit test relative to the javascript and the linting of the JS code.

## Generate the resume in pdf format

```bash
npm start
npx electron-pdf http://127.0.0.1:8000/resume/ resume.pdf
```
