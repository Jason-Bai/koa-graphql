
/**
 * Module dependencies.
 */

var Resource = require('koa-resource-router');
var debug = require('debug')('api');
var path = require('path');
var fs = require('fs');
var join = path.resolve;
var readdir = fs.readdirSync;
var Router = require('koa-router');

// global router
var router = new Router();

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

module.exports = function(root){
  readdir(root).forEach(function(file){
    var dir = join(root, file);
    var stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
      var conf = require(dir + '/config.json');
      conf.name = file;
      conf.directory = dir;
      if (conf.routes) route(conf);
      else resource(conf);
    }
  });

  return router;
};

/**
 * Define routes in `conf`.
 */

function route(conf) {
  debug('routes: %s', conf.name);

  var mod = require(conf.directory);

  for (var key in conf.routes) {
    var prop = conf.routes[key];
    var method = key.split(' ')[0];
    var path = key.split(' ')[1];
    debug('%s %s -> .%s', method, path, prop);

    var fn = mod[prop];
    if (!fn) throw new Error(conf.name + ': exports.' + prop + ' is not defined');

    var fns = fn;

    if (typeof fn === 'function' && !Array.isArray(fn)) {
      fns = [fn];
    }

    var args = [path].concat(fns);

    router[method.toLowerCase()].apply(router, args);
  }
}

/**
 * Define resource in `conf`.
 */

function resource(conf) {
  if (!conf.name) throw new Error('.name in ' + conf.directory + '/config.json is required');
  debug('resource: %s', conf.name);

  var mod = require(conf.directory);
  
  router.use(Resource(conf.name, mod).middleware());
}