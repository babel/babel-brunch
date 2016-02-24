'use strict';

const babel = require('babel-core');
const anymatch = require('anymatch');

class BabelCompiler {
  constructor(config) {
    if (!config) config = {};
    var options = config.plugins &&
      (config.plugins.babel || config.plugins.ES6to5) || {};
    this.options = {};
    Object.keys(options).forEach(key => {
      if (key === 'sourceMap' || key === 'ignore') return;
      this.options[key] = options[key];
    });
    this.options.sourceMap = !!config.sourceMaps;
    this.isIgnored = anymatch(options.ignore || /^(bower_components|node_modules\/[.-\w]-brunch|vendor)/);
    if (this.options.pattern) {
      this.pattern = this.options.pattern;
      delete this.options.pattern;
    }
    this.options.presets = this.options.presets || ['es2015'];
    if (this.options.presets.length === 0) {
      delete this.options.presets;
    }
  }

  compile(params) {
    if (this.isIgnored(params.path)) return Promise.resolve(params);
    this.options.filename = params.path;

    return new Promise((resolve, reject) => {
      let compiled;
      try {
        compiled = babel.transform(params.data, this.options);
      } catch (err) {
        return reject(err);
      }
      var result = {data: compiled.code || compiled};

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
BabelCompiler.prototype.extension = 'js';

module.exports = BabelCompiler;
