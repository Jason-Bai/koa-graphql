const parse = require('co-body');

/**
 * This file illustrates using resourceful
 * routing using the koa-router module.
 */

const users = {
  tobi: {
    name: 'tobi',
    age: 3,
    species: 'ferret'
  },

  loki: {
    name: 'loki',
    age: 2,
    species: 'ferret'
  },

  jane: {
    name: 'jane',
    age: 7,
    species: 'ferret'
  }
};

/**
 * GET all users.
 */
exports.all = [
  function(ctx) {
    ctx.body = Object.keys(users);
  }
];

/**
 * GET user by :name.
 */
exports.show = function(ctx) {
  ctx.body = Object.keys(users[ctx.params.id]);
};

/**
 * POST a new user.
 */

exports.create = async function(ctx) {
  const body = await parse(ctx);
  if (!body.name) this.throw(400, '.name required');
  users[body.name] = body;
  ctx.status = 201;
  ctx.body = 'added!';
};
