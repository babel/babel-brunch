var assert = require('assert');
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    assert(plugin);
  });

  it('should have #compile method', function() {
    assert.equal(typeof plugin.compile, 'function');
  });

  it('should compile and produce valid result', function(done) {
    var content = 'let a = 1';
    var expected = '(function () {\n  var a = 1;\n}());\n';

    plugin.compile({data: content, path: 'file.js'}, function(error, result) {
      assert(!error);
      assert.equal(result.data, expected);
      done();
    });
  });

  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = 'let a = 1';
    var expected = '(function () {\n  var a = 1;\n}());\n';

    plugin.compile({data: content, path: 'file.js'}, function(error, result) {
      assert(!error);
      assert.equal(result.data, expected);
      assert.doesNotThrow(function(){JSON.parse(result.map)});
      done();
    });
  });
});
