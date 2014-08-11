'use strict';

var Module = require('module');
var spy = require('./lib/spy');

module.exports = spy;

var cache = {};
module.exports.require = function mockRequire(moduleid) {
  var path = Module._resolveFilename(moduleid, module.parent);
  if (path in cache) {
    return cache[path];
  }
  if (path in require.cache) {
    console.warn('should require mock before ' + moduleid, 'delete cache');
    delete require.cache[path];
  }
  module.parent.require(moduleid);
  var pkg = require.cache[path];
  var mock = spy(pkg, 'exports');
  return cache[path] = mock;
};
