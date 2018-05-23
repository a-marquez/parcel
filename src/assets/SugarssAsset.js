const Asset = require('../Asset');
const localRequire = require('../utils/localRequire');
const Resolver = require('../Resolver');
const syncPromise = require('../utils/syncPromise');

class SugarssAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  async parse(code) {
    // sugarss should be installed locally in the module that's being required
    let sugarss = await localRequire('sugarss', this.name);
    // let opts = await this.getConfig(['.stylusrc', '.stylusrc.js'], {
    //   packageKey: 'stylus'
    // });
    let root = sugarss.parse(code);

    return style;
  }

  generate() {
    return [
      {
        type: 'css',
        value: this.ast ? this.ast.render() : this.contents,
        hasDependencies: false
      }
    ];
  }

  generateErrorMessage(err) {
    let index = err.message.indexOf('\n');
    err.codeFrame = err.message.slice(index + 1);
    err.message = err.message.slice(0, index);
    return err;
  }
}

module.exports = SugarssAsset;
