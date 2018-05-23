const assert = require('assert');
const fs = require('fs');
const {bundle, run, assertBundleTree} = require('./utils');

describe('sugarss', function() {
  it('should support requiring sugarss files', async function() {
    let b = await bundle(__dirname + '/integration/sugarss/index.js');

    assertBundleTree(b, {
      name: 'index.js',
      assets: ['index.js', 'index.sss'],
      childBundles: [
        {
          type: 'map'
        },
        {
          name: 'index.css',
          assets: ['index.sss'],
          childBundles: []
        }
      ]
    })

    let output = run(b)
    assert.equal(typeof output, 'function');
    assert.equal(output(), 2);

    let css = fs.readFileSync(__dirname + '/dist/index.css', 'utf8');
    assert(css.includes('.index'));
  })

  // should support minifying in production mode
})
