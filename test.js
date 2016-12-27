/* jshint mocha:true */
'use strict';

var assert = require('assert');
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;
  this.timeout(10000);

  beforeEach(function() {
    plugin = new Plugin({ paths: { root: '.' }});
  });

  it('should be an object', function() {
    assert(plugin);
  });

  it('should have #compile method', function() {
    assert.equal(typeof plugin.compile, 'function');
  });

  it('should do nothing for no preset', function (done) {
    var content = 'var c = {};\nvar { a, b } = c;';

    plugin = new Plugin({ paths: { root: '.' }, plugins: { babel: { presets: [] }}});
    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(content) !== -1);
      done();
    }, error => assert(!error));
  });

  it('should compile and produce valid result', function(done) {
    var content = 'var c = {};\nvar {a, b} = c;';
    var expected = 'var a = c.a,\n    b = c.b;';

    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(expected) !== -1);
      done();
    }, error => assert(!error));
  });

  it('should load indicated presets', function(done) {
    var content = 'x => x'
    var expected = 'function'

    plugin = new Plugin({ paths: { root: '.' }, plugins: { babel: { presets: ['es2015'] }}});
    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(expected) !== -1);
      done();
    }, error => assert(!error));
  });

  it('should load indicated presets with options', function(done) {
    var content = "export default 0";
    var expected = 'System.register';

    plugin = new Plugin({ paths: { root: '.' }, plugins: { babel: { presets: [['es2015', { modules: 'systemjs' }]] }}});
    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(expected) !== -1);
      done();
    }, error => assert(!error));
  });

  it('should load indicated plugins', function(done) {
    var content = 'var c = () => process.env.NODE_ENV;';
    var expected = '"use strict";\n\nvar c = function c() {\n  return undefined;\n};';

    plugin = new Plugin({ paths: { root: '.' }, plugins: { babel: { plugins: ['transform-node-env-inline'] }}});
    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(expected) !== -1);
      done();
    }, error => assert(!error));
  });

  it('should load indicated plugins with options', function(done) {
    var content = '`var x = 1; test ${x}`'
    var expected = 'String(x)'

    plugin = new Plugin({ paths: { root: '.' }, plugins: { babel: { plugins: [['transform-es2015-template-literals', { spec: true }]] }}});
    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert(result.data.indexOf(expected) !== -1);
      done();
    }, error => assert(!error));
  });

  describe('custom file extensions & patterns', function() {
    var basicPlugin = new Plugin({
      paths: { root: '.' },
      plugins: {
        babel: {
          pattern: /\.(babel|es6|jsx)$/
        }
      }
    });
    var sourceMapPlugin = new Plugin({
      paths: { root: '.' },
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
      basicPlugin.compile({data: content, path: path}).then(result => done(), error => assert(!error));
    });

    it('should properly link to source file in source maps', function(done) {
      sourceMapPlugin.compile({data: content, path: path}).then(result => {
        assert.doesNotThrow(function(){JSON.parse(result.map);});
        assert.equal(JSON.parse(result.map).sources.indexOf(path) !== -1, true);
        done();
      }, error => assert(!error));
    })

  });


  it('should produce source maps', function(done) {
    plugin = new Plugin({paths: { root: '.' }, sourceMaps: true});

    var content = 'let a = 1';

    plugin.compile({data: content, path: 'file.js'}).then(result => {
      assert.doesNotThrow(function(){JSON.parse(result.map);});
      done();
    }, error => assert(!error));
  });

  it('should pass through content of ignored paths', function(done) {
    var content = 'asdf';

     plugin.compile({data: content, path: 'vendor/file.js'}).then(result => {
      assert.equal(content, result.data);
      done();
    }, error => assert(!error));
  });
});
