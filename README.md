## babel-brunch

Brunch plugin using [Babel](https://github.com/babel/babel) to turn latest
ECMAScript standard code into vanilla ES5 with no runtime required.

All the `.js` files in your project will be run through the babel compiler,
except those it is configured to ignore, unless you use the `pattern` option.

Additionally, starting Brunch 2.7, `babel-brunch` will also compile NPM dependencies.

## Installation

```
npm install --save-dev babel-brunch
```

## Configuration

[babel-preset-env](https://github.com/babel/babel-preset-env) (a Babel preset that can automatically determine the plugins and polyfills you need based on your supported environments) **is used by default**.

The default behavior without options runs all transforms (behaves the same as [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/)).

Optionally, you can configure the preset for your needs:

```js
module.exports.plugins = {
  babel: {
    presets: [['env', {
      targets: {
        browsers: ['last 2 versions', 'safari >= 7']
      }
    }]]
  }
}
```

Read more about [`env`'s options](https://github.com/babel/babel-preset-env#options).

### Using React or any other plugin

Install a plugin:

```
npm install --save-dev babel-preset-react
```

Then, make sure Brunch sees it:

```js
module.exports.plugins = {
  // ...
  babel: {
    presets: ['env', 'react']
  }
}
```

### Ignoring node modules

```js
module.exports.plugins = {
  // ...
  babel: {
    ignore: [
      /^node_modules/,
      'app/legacyES5Code/**/*'
    ]
  }
}
```

### Changing which files would be compiled by Babel

```js
module.exports.plugins = {
  // ...
  babel: {
    pattern: /\.(js|vue)$/ // By default, JS|JSX|ES6 are used.
  }
}
```

Set [Babel options](https://babeljs.io/docs/usage/options) in your Brunch
config (such as `brunch-config.js`) except for `filename` and `sourceMap`
which are handled internally.

## Change Log

[See release notes page on GitHub](https://github.com/babel/babel-brunch/releases)

## License

[ISC](https://raw.github.com/babel/babel-brunch/master/LICENSE)
