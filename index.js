'use strict';

var Spy = require('./lib/spy');

/*
  spy()
  spy(func)
  spy(obj, method)
*/

module.exports = function spy(obj, method) {
  // spy()
  if (!arguments.length) {
    method = 'a';
    obj = {a: function() {}};
  }

  // spy(func)
  if (typeof obj === 'function' && !method) {
    method = 'a';
    obj = {a: obj};
  }

  // spy(obj, method)
  return new Spy(obj, method);
};

module.exports.Spy = Spy;
