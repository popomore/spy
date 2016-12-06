'use strict';

module.exports = equal;

function equal(a, b) {
  if (a === b) return true;

  const typeA = type(a);
  if (typeA !== type(b)) return false;

  switch (typeA) {
    case 'number':
      // equal(1, new Number(1))
      if (isNaN(a) && isNaN(b)) return true;
      return Number(a) === Number(b);

    case 'string':
      // equal('a', new Number('a'))
      return String(a) === String(b);

    case 'date':
      return a.getTime() === b.getTime();

    case 'array':
      if (a.length !== b.length) return false;
      if (a.length === 0) return true;
      for (let i = 0, l = a.length; i < l; i++) {
        if (!equal(a[i], b[i])) {
          return false;
        }
      }
      return true;

    case 'object': {
      const keyA = keys(a);
      const keyB = keys(b);
      if (!equal(keyA, keyB)) return false;
      for (let j = 0, k = keyA.length; j < k; j++) {
        const key = keyA[j];
        if (!equal(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    default:
  }

  return false;
}

const toString = Object.prototype.toString;
function type(obj) {
  return toString.call(obj)
  .replace(/^\[object ([a-z]*)\]$/i, '$1')
  .toLowerCase();
}

function keys(o) {
  let result = [];

  /* istanbul ignore else: for legacy browser */
  if (Object.keys) {
    result = Object.keys(o);
  } else {
    for (const name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name);
      }
    }
  }
  return result.sort();
}
