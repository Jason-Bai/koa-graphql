const Resource = require('koa-resource-router');
const debug = require('debug')('api');
const Router = require('koa-router');
const U = require('../utils');

const join = U.path.resolve;
const readdir = U.fs.readdirSync;

/* eslint security/detect-non-literal-fs-filename: 0 */
/* eslint security/detect-non-literal-require: 0 */

// global router
const router = new Router();

/**
 * Load resources in `root` directory.
 *
 * TODO: move api.json (change name?)
 * bootstrapping into an npm module.
 *
 * TODO: adding .resources to config is lame,
 * but assuming no routes is also lame, change
 * me
 *
 * @param {Application} app
 * @param {String} root
 * @api private
 */

module.exports = function(root) {
  readdir(root).forEach(file => {
    const dir = join(root, file);
    const stats = U.fs.lstatSync(dir);
    if (stats.isDirectory()) {
      const conf = require(`${dir}/config.json`);

      conf.name = file;
      conf.directory = dir;
      if (conf.routes) route(conf);
      else resource(conf);
    }
  });

  return router;
};

/* eslint security/detect-object-injection: 0 */

/**
 * Define routes in `conf`.
 */

function route(conf) {
  debug('routes: %s', conf.name);

  const mod = require(conf.directory);

  for (let key in conf.routes) {
    const prop = conf.routes[key];
    const method = key.split(' ')[0];
    const path = key.split(' ')[1];
    debug('%s %s -> .%s', method, path, prop);

    const fn = mod[prop];
    if (!fn) throw new Error(`${conf.name}: exports. ${prop} is not defined`);

    let fns = fn;

    if (typeof fn === 'function' && !Array.isArray(fn)) {
      fns = [fn];
    }

    const args = [path].concat(fns);

    router[method.toLowerCase()].apply(router, args);
  }
}

/**
 * Define resource in `conf`.
 */

function resource(conf) {
  if (!conf.name) throw new Error(`.name in ${conf.directory}/config.json is required`);
  debug('resource: %s', conf.name);

  const mod = require(conf.directory);

  router.use(Resource(conf.name, mod).middleware());
}
