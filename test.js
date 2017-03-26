/* eslint-env mocha */
'use strict';

require('chai').should();
const Plugin = require('./');

describe('Plugin', function() {
  let plugin;
  this.timeout(10000);

  beforeEach(() => {
    plugin = new Plugin({paths: {root: '.'}});
  });

  it('should have #compile method', () => {
    plugin.should.respondTo('compile');
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
      .then(result => result.data.should.contain(content));
  });

  it('should compile and produce valid result', () => {
    const content = 'var c = {};\nvar {a, b} = c;';
    const expected = 'var a = c.a,\n    b = c.b;';

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => result.data.should.contain(expected));
  });

  it('should load indicated presets', () => {
    const content = 'x => x';
    const expected = 'function';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {presets: ['env']},
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => result.data.should.contain(expected));
  });

  it('should load indicated presets with options', () => {
    const content = 'export default 0';
    const expected = 'System.register';

    plugin = new Plugin({
      paths: {root: '.'},
      plugins: {
        babel: {
          presets: [
            ['env', {
              modules: 'systemjs',
            }],
          ],
        },
      },
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => result.data.should.contain(expected));
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
      .then(result => result.data.should.contain(expected));
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
      .then(result => result.data.should.contain(expected));
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
      basicPlugin.compile({data: content, path})
    );

    it('should properly link to source file in source maps', () =>
      sourceMapPlugin.compile({data: content, path})
        .then(result => JSON.parse(result.map).sources.should.contain(path))
    );
  });

  it('should produce source maps', () => {
    const content = 'let a = 1';

    plugin = new Plugin({
      paths: {root: '.'},
      sourceMaps: true,
    });

    return plugin.compile({data: content, path: 'file.js'})
      .then(result => JSON.parse(result.map));
  });

  it('should pass through content of ignored paths', () => {
    const content = 'asdf';

    return plugin.compile({data: content, path: 'vendor/file.js'})
      .then(result => result.data.should.be.equal(content));
  });
});
