const Asset = require('../Asset');
const localRequire = require('../utils/localRequire');
const path = require('path');
const promisify = require('../utils/promisify');

class GLSLAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  async parse() {
    const glslifyDeps = await localRequire('glslify-deps', this.name);

    // Parse and collect dependencies with glslify-deps
    let cwd = path.dirname(this.name);
    let depper = glslifyDeps({
      cwd,
      resolve: async (target, opts, next) => {
        try {
          let res = await this.resolver.resolve(
            target,
            path.join(opts.basedir, 'index')
          );
          next(null, res.path);
        } catch (err) {
          next(err);
        }
      }
    });

    return await promisify(depper.inline.bind(depper))(this.contents, cwd);
  }

  collectDependencies() {
    for (let dep of this.ast) {
      if (!dep.entry) {
        this.addDependency(dep.file, {includedInParent: true});
      }
    }
  }

  async generate() {
    // Generate the bundled glsl file
    const glslifyBundle = await localRequire('glslify-bundle', this.name);
    let glsl = glslifyBundle(this.ast);

    return {
      js: `module.exports=${JSON.stringify(glsl)};`
    };
  }
}

module.exports = GLSLAsset;
