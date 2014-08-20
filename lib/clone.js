'use strict';

module.exports = function clone(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (isArray(obj)) {
    return obj.map(function(item) {
      return clone(item);
    });
  }

  if (typeof obj === 'object') {
    var ret = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        ret[key] = clone(obj[key]);
      }
    }
    return ret;
  }

  return obj;
};

function isArray(arr) {
  return ({}).toString.call(arr) === '[object Array]';
}
