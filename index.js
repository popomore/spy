'use strict';

const Module = require('module');
const spy = require('./lib/spy');

module.exports = spy;

const cache = {};
module.exports.require = function mockRequire(moduleid) {
  const path = Module._resolveFilename(moduleid, module.parent);
  if (path in cache) {
    return cache[path];
  }
  if (path in require.cache) {
    console.warn('should require mock before ' + moduleid, 'delete cache');
    delete require.cache[path];
  }
  module.parent.require(moduleid);
  const pkg = require.cache[path];
  const mock = spy(pkg, 'exports');
  cache[path] = mock;
  return mock;
};
