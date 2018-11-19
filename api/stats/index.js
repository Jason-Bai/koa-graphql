
/**
 * This file illustrates how you may map
 * single routes using config.json instead
 * of resource-based routing.
 */

var stats = {
  requests: 100000,
  average_duration: 52,
  uptime: 123123132
};

/**
 * GET all stats.
 */

exports.all = function (ctx){
  ctx.body = stats;
};

/**
 * GET a single stat.
 */

exports.get = function (ctx){
  ctx.body = stats[ctx.params.name];
};
