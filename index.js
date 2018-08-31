'use strict';
const babel = require('@babel/core');
const anymatch = require('anymatch');
const logger = require('loggy');

const prettySyntaxError = err => {
  if (!(err._babel && err instanceof SyntaxError)) return err;
  const msg = err.message
    .replace(/\(\d+:\d+\)$/, '')
    .replace(/^([./\w]+:\s)/, '');
  const error = new Error(`L${err.loc.line}:${err.loc.column} ${msg}\n${err.codeFrame}`);
  error.name = '';
  error.stack = err.stack;
  return error;
};

const isUglifyTarget = () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const isUglify = !!require('uglify-js-brunch');
    if (isProduction && isUglify) return true;
    return false;
  } catch (e) {
    return false;
  }
};

class BabelCompiler {
  constructor(config) {
    const pl = config.plugins;
    const options = pl && (pl.babel || pl.ES6to5) || {};

    if (pl && !pl.babel && pl.ES6to5) {
      logger.warn('Please use `babel` instead of `ES6to5` option in your config file.');
    }

    const opts = Object.keys(options).reduce((obj, key) => {
      if (key !== 'sourceMaps' && key !== 'ignore') {
        obj[key] = options[key];
      }
      return obj;
    }, {});

    opts.sourceMaps = !!config.sourceMaps;

    if (opts.pattern) {
      this.pattern = opts.pattern;
      delete opts.pattern;
    }

    this.isIgnored = anymatch(options.ignore || /^(bower_components|vendor)/);
    this.options = opts;
  }

  compile(file) {
    if (this.isIgnored(file.path)) return Promise.resolve(file);
    this.options.filename = file.path;
    this.options.sourceFileName = file.path;

    if (!this.options.presets) {
      const babelConfig = new babel.OptionManager().init(this.options);
      const hasConfig =
        babelConfig.presets && babelConfig.presets.length ||
        babelConfig.plugins && babelConfig.plugins.length;

      if (!hasConfig) {
        this.options.presets = [['@babel/env', {
          targets: isUglifyTarget() ? {uglify: true} : {},
        }]];
      }
    }

    return new Promise((resolve, reject) => {
      let compiled;

      try {
        compiled = babel.transform(file.data, this.options);
      } catch (error) {
        reject(prettySyntaxError(error));
        return;
      }

      const result = {data: compiled.code || compiled};

      // Concatenation is broken by trailing comments in files, which occur
      // frequently when comment nodes are lost in the AST from babel.
      result.data += '\n';

      if (compiled.map) result.map = JSON.stringify(compiled.map);
      resolve(result);
    });
  }
}

BabelCompiler.prototype.brunchPlugin = true;
BabelCompiler.prototype.type = 'javascript';
BabelCompiler.prototype.pattern = /\.(es6|jsx?)$/i;

module.exports = BabelCompiler;
