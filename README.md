sirlisko.com
============

 [![Build Status](https://travis-ci.org/sirLisko/sirlisko.com.svg)](https://travis-ci.org/sirLisko/sirlisko.com) [![dependency Status](https://david-dm.org/sirlisko/sirlisko.com/status.svg)](https://david-dm.org/sirlisko/sirlisko.com#info=dependencies) [![devDependency Status](https://david-dm.org/sirlisko/sirlisko.com/dev-status.svg)](https://david-dm.org/sirlisko/sirlisko.com#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/sirLisko/sirlisko.com/badge.svg?branch=master)](https://coveralls.io/github/sirLisko/sirlisko.com?branch=master)

> [https://sirlisko.com](https://sirlisko.com) - personal (and experimental) website.

I tried to keep this website as a proof of concept of the technologies I am currently working with or to just trying out new stuff :)

---

The Website is built using [NodeJs](https://nodejs.org/).

In order to have the Website up and running NodeJs is mandatory, it can be installed using [n](https://github.com/tj/n), a handy NodeJs binary manager, or using the official installer present in the NodeJs website ([https://nodejs.org/download/](https://nodejs.org/download/)).

### Build steps

Now the build consists of 2 steps:

- Install all the FE dependencies for the build (i.e. gulp, webpack, etc.)
- Build the assets (javascript, templates, etc.)

### Install the dependencies

Once NodeJs is installed, its package manager NPM will be available, all you need to do is run in the main directory of the project the following command.

```bash
$ npm install --production
```

This will install all the software needed in order to build and run the Website.

In addition of that NPM allows us to run base commands that could be plugged to gulp functions or utilities.

### Build the Front-End

```bash
$ npm run build
```

It runs the following tasks:

- check the syntax of the JS, according to [StandardJS](http://standardjs.com/) (via [ESLint](http://eslint.org/))
- check the syntax of the CSS, using [stylelint](https://stylelint.io/)
- compile the CSS files using [PostCss](http://postcss.org/) and [cssnext](http://cssnext.io/)
- compile the JS files using [webpack 2.x](https://webpack.github.io/)
- compress javascript (via [Uglify](https://github.com/mishoo/UglifyJS)) and CSS (via [CSSNano](http://cssnano.co/))
- concatenating and compressing the HTML
- optimisation of the images
- test the JS using [jest](https://facebook.github.io/jest/), [Sinon.JS](http://sinonjs.org/) for timers, and [simulant](https://github.com/Rich-Harris/simulant) for DOM events simultaion
- [optional] validating the HTML according to the W3C
- [optional] generating a sitemep

### Work with the Front-End (Develop)

Gulp gives us the ability to run several tasks contained in the main gulp file `gulpfile.babel.js`.

The easier way to build the Front-End in Develop mode is with:

```bash
$ npm run watch
```

In addition to the build, this command is also **watching the file system** looking for files change. Once one of the resources changes the relative assets are immediately recompiled.

### Running the tests

In order to running the tests and linters the **dev dependencies** need to be installed.

```bash
$ npm install
```

Once the dependencies are installed:

```bash
$ npm test
```

The test command is running the unit test relative to the javascript and the linting of the code (JS/CSS).

### Generate the resume in pdf format

```bash
$ npm start
$ npx electron-pdf http://127.0.0.1:8080/resume/ resume.pdf
```
