/* eslint-env mocha */
'use strict';

const assert = require('assert');
const Plugin = require('./');

describe('Plugin', function() {
  let plugin;
  this.timeout(10000);

  beforeEach(() => {
    plugin = new Plugin({paths: {root: '.'}});
  });

  it('should be an object', () => assert(plugin));

  it('should have #compile method', () => {
    assert.equal(typeof plugin.compile, 'function');
  });

  it('should do nothing for no preset', () => {
    const content = 'var c = {};\nvar { a, b } = c;';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {presets: []},
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(content)))
      .catch(assert.ifError);
  });

  it('should compile and produce valid result', () => {
    const content = 'var c = {};\nvar {a, b} = c;';
    const expected = 'var a = c.a,\n    b = c.b;';

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(expected)))
      .catch(assert.ifError);
  });

  it('should load indicated presets', () => {
    const content = 'x => x';
    const expected = 'function';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {presets: ['latest']},
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(expected)))
      .catch(assert.ifError);
  });

  it('should load indicated presets with options', () => {
    const content = 'export default 0';
    const expected = 'System.register';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          presets: [
            ['latest', {
              es2015: {modules: 'systemjs'},
            }],
          ],
        },
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(expected)))
      .catch(assert.ifError);
  });

  it('should load indicated plugins', () => {
    const content = 'var c = () => process.env.NODE_ENV;';
    const expected = 'var c = () => undefined;\n';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          plugins: ['transform-node-env-inline'],
        },
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(expected)))
      .catch(assert.ifError);
  });

  it('should load indicated plugins with options', () => {
    const content = '`var x = 1; test ${x}`';
    const expected = 'String(x)';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          plugins: [['transform-es2015-template-literals', {spec: true}]],
        },
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert(result.data.includes(expected)))
      .catch(assert.ifError);
  });

  describe('custom file extensions & patterns', () => {
    const content = 'let a = 1';
    const path = 'file.es6';

    const basicPlugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          pattern: /\.(babel|es6|jsx)$/,
        },
      },
    });

    const sourceMapPlugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          pattern: /\.(babel|es6|jsx)$/,
          sourceMaps: true,
        },
      },
    });

    it('should handle custom file extensions', () =>
      basicPlugin.compile({data: content, path}).catch(assert.ifError)
    );

    it('should properly link to source file in source maps', () =>
      sourceMapPlugin.compile({data: content, path})
        .then(result => {
          assert.doesNotThrow(() => JSON.parse(result.map));
          assert(JSON.parse(result.map).sources.indexOf(path) !== -1);
        })
        .catch(assert.ifError)
    );
  });


  it('should produce source maps', () => {
    const content = 'let a = 1';

    plugin = new Plugin({
      paths: {root: '.'},
      sourceMaps: true,
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => assert.doesNotThrow(() => JSON.parse(result.map)))
      .catch(assert.ifError);
  });

  it('should pass through content of ignored paths', () => {
    const content = 'asdf';

    return plugin.compile({data: content, path: 'vendor/file.js'})
      .then(result => assert.equal(content, result.data))
      .catch(assert.ifError);
  });
});
