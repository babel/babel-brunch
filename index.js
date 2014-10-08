'use strict';

var to5 = require('6to5');

function ES6to5Compiler(config) {
  if (config == null) { config = {}; }
  var options = config.plugins && config.plugins.ES6to5 || {};
  var _this = this;
  this.options = {};
  Object.keys(options).forEach(function (key) {
    if (key === 'sourceMap') { return; }
    _this.options[key] = options[key];
  });
  this.options.sourceMaps = !!config.sourceMaps;
}

ES6to5Compiler.prototype.brunchPlugin = true;
ES6to5Compiler.prototype.type = 'javascript';
ES6to5Compiler.prototype.extension = 'js';

ES6to5Compiler.prototype.compile = function (params, callback) {
  this.options.filename = params.path;
  var compiled;
  try {
    compiled = to5.transform(params.data, this.options);
  } catch (err) {
    return callback(err);
  }
  callback(null, {
    data: compiled.code || compiled,
    map: !!compiled.map && compiled.map.toJSON()
  });
};

module.exports = ES6to5Compiler;
