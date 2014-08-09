'use strict';

var equal = require('./equal');

module.exports = Call;

function Call(obj) {
  obj || (obj = {});
  this['arguments'] = obj['arguments'] || [];
  this['return'] = obj['return'];
  this['context'] = obj['context'];
  this['error'] = obj['error'];
  this['new'] = !!obj['new'];
}

Call.prototype.calledWith = function() {
  var args = [].slice.apply(arguments);
  if (!args.length) return true;
  for (var i = 0, l = args.length; i < l; i++) {
    if (!equal(this['arguments'][i], args[i])) {
      return false;
    }
  }
  return true;
};

Call.prototype.calledWithNew = function() {
  return this['new'];
};

Call.prototype.calledWithExactly = function() {
  var args = [].slice.apply(arguments);
  if (this['arguments'].length !== args.length) return false;
  return this.calledWith.apply(this, args);
};

Call.prototype.calledOn = function(args) {
  return this['context'] === args;
};

Call.prototype.returned = function(args) {
  return equal(this['return'], args);
};

Call.prototype.threw = function(str) {
  if (!this['error']) return false;
  if (!str) return true;
  return this['error'].message === str;
};
