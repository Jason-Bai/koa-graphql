
/**
 * Module dependencies.
 */

var responseTime = require('koa-response-time');
var ratelimit = require('koa-ratelimit');
var compress = require('koa-compress');
var logger = require('koa-logger');
var load = require('./lib/load');
var redis = require('redis');
var Koa = require('koa');

/**
 * Environment.
 */

var env = process.env.NODE_ENV || 'development';

/**
 * Expose `api()`.
 */

module.exports = api;

/**
 * Initialize an app with the given `opts`.
 *
 * @param {Object} opts
 * @return {Application}
 * @api public
 */

function api(opts) {
  opts = opts || {};
  var app = new Koa();

  // logging

  if ('test' != env) app.use(logger());

  // x-response-time

  app.use(responseTime());

  // compression

  app.use(compress());

  // rate limiting

  
  app.use(ratelimit({
    max: opts.ratelimit,
    duration: opts.duration,
    db: redis.createClient()
  }));

  // boot

  var router = load(__dirname + '/api');

  // routing
  app
  .use(router.routes())
  .use(router.allowedMethods());

  return app;
}
