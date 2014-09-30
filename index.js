var to5 = require('6to5');

function ES6to5Compiler(config) {
  if (config == null) config = {};
  var options = config.plugins && config.plugins.ES6to5 || {};
  var _this = this;
  this.options = {};
  Object.keys(options).forEach(function (key) {
    _this.options[key] = options[key];
  });
  this.options.sourceMap = !!config.sourceMaps;
}

ES6to5Compiler.prototype.brunchPlugin = true;
ES6to5Compiler.prototype.type = 'javascript';
ES6to5Compiler.prototype.extension = 'js';

ES6to5Compiler.prototype.compile = function (params, callback) {
  this.options.filename = params.path;
  var compiled, lines, mapComment, map;
  try {
    compiled = to5.transform(params.data, this.options);
  } catch (err) {
    return callback(err);
  }
  if (this.options.sourceMap) {
    lines = compiled.split('\n');
    mapComment = lines.splice(-2, 1)[0];
    if (mapComment.slice(0, 26) === '//# sourceMappingURL=data:') {
      compiled = lines.join('\n');
      map = (new Buffer(mapComment.slice(50), 'base64').toString());
    }
  }
  return callback(null, {data: compiled, map: map});
};

module.exports = ES6to5Compiler;
