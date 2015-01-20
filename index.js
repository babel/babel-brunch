'use strict';

var to5 = require('6to5');
var anymatch = require('anymatch');

function ES6to5Compiler(config) {
  if (!config) config = {};
  var options = config.plugins && config.plugins.ES6to5 || {};
  this.options = {};
  Object.keys(options).forEach(function(key) {
    if (key === 'sourceMap' || key === 'ignore') return;
    this.options[key] = options[key];
  }, this);
  this.options.sourceMap = !!config.sourceMaps;
  this.isIgnored = anymatch(options.ignore || /^(bower_components|vendor)/);
}

ES6to5Compiler.prototype.brunchPlugin = true;
ES6to5Compiler.prototype.type = 'javascript';
ES6to5Compiler.prototype.extension = 'js';

ES6to5Compiler.prototype.compile = function (params, callback) {
  if (this.isIgnored(params.path)) return callback(null, params);
  this.options.filename = params.path;
  var compiled;
  try {
    compiled = to5.transform(params.data, this.options);
  } catch (err) {
    return callback(err);
  }
  var result = {data: compiled.code || compiled};

  // Concatenation is broken by trailing comments in files, which occur
  // frequently when comment nodes are lost in the AST from 6to5.
  result.data += '\n';

  if (compiled.map) result.map = JSON.stringify(compiled.map);
  callback(null, result);
};

module.exports = ES6to5Compiler;
