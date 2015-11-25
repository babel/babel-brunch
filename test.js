/* jshint mocha:true */
'use strict';

var assert = require('assert');
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;
  this.timeout(10000);

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    assert(plugin);
  });

  it('should have #compile method', function() {
    assert.equal(typeof plugin.compile, 'function');
  });

  it('should do nothing for no preset', function (done) {
    var content = 'var c = {};\nvar { a, b } = c;';

    plugin = new Plugin({ plugins: { babel: { presets: [] }}});
    plugin.compile({data: content, path: 'file.js'}, function (error, result) {
      assert(!error);
      assert(result.data.indexOf(content) !== -1);
      done();
    });
  });

  it('should compile and produce valid result', function(done) {
    this.timeout(10000);

    var content = 'var c = {};\nvar {a, b} = c;';
    var expected = 'var a = c.a;\nvar b = c.b;';

    plugin.compile({data: content, path: 'file.js'}, function(error, result) {
      assert(!error);
      assert(result.data.indexOf(expected) !== -1);
      done();
    });
  });

  it('should load indicated plugins', function(done) {
    var content = 'var c = () => process.env.NODE_ENV;';
    var expected = '"use strict";\n\nvar c = function c() {\n  return undefined;\n};';

    plugin = new Plugin({ plugins: { babel: { plugins: ['transform-node-env-inline'] }}});
    plugin.compile({data: content, path: 'file.js'}, function(error, result) {
      assert(!error);
      assert(result.data.indexOf(expected) !== -1);
      done();
    });
  });

  describe('custom file extensions & patterns', function() {
    var basicPlugin = new Plugin({
      plugins: {
        babel: {
          pattern: /\.(babel|es6|jsx)$/
        }
      }
    });
    var sourceMapPlugin = new Plugin({
      plugins: {
        babel: {
          pattern: /\.(babel|es6|jsx)$/,
          sourceMaps: true
        }
      }
    });
    var content = 'let a = 1';
    var path = 'file.es6'

    it('should handle custom file extensions', function(done) {
      basicPlugin.compile({data: content, path: path}, function(error, result) {
        assert(!error);
        done();
      });
    });

    it('should properly link to source file in source maps', function(done) {
      sourceMapPlugin.compile({data: content, path: path}, function(error, result) {
        assert(!error);
        assert.doesNotThrow(function(){JSON.parse(result.map);});
        assert.equal(JSON.parse(result.map).sources.indexOf(path) !== -1, true);
        done();
      })
    })

  });


  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = 'let a = 1';

    plugin.compile({data: content, path: 'file.js'}, function(error, result) {
      assert(!error);
      assert.doesNotThrow(function(){JSON.parse(result.map);});
      done();
    });
  });

  it('should pass through content of ignored paths', function(done) {
    var content = 'asdf';

     plugin.compile({data: content, path: 'vendor/file.js'}, function(error, result) {
      assert(!error);
      assert.equal(content, result.data);
      done();
    });
  });
});
