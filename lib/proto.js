'use strict';

var Call = require('./call');

var proto = module.exports = {};

proto.invork = function invork(args, ctx, isNew) {
  var ret, err;
  try {
    if (this.mockMethod) {
      ret = this.mockMethod.apply(ctx, args);
    } else {
      ret = this.method.apply(ctx, args);
    }
  } catch(e) {
    err = e;
  }
  this.watch({
    'arguments': args,
    'context': ctx,
    'return': ret,
    'error': err,
    'new': isNew
  });
  if (err) throw err;
  return ret;
};

proto.watch = function watch(obj) {
  this.callCount++;
  this.calls.push(new Call(obj));
  this.called = true;
};


proto.mock = function mock(fn) {
  if (typeof fn === 'function' || isGeneratorFn(fn)) {
    this.mockMethod = fn;
  }
};

proto.reset = function reset() {
  this.callCount = 0;
  this.calls = [];
  this.called = false;
};

proto.calledBefore = function(spy) {
  if (this.called) {
    return spy.called ? this.calls[0].callid < spy.calls[0].callid : true;
  }
  return false;
};

proto.calledAfter = function(spy) {
  if (spy.called) {
    return this.called ? this.calls[0].callid > spy.calls[0].callid : true;
  }
  return false;
};

var methods = [
  'calledWith',
  'calledWithNew',
  'calledWithExactly',
  'calledOn',
  'returned',
  'threw'
];

var status = {
  some: some,
  always: always,
  never: never
};

for (var i = 0, l = methods.length; i < l; i++) {
  (function(method) {
    for (var j in status) {
      var m = j === 'some' ? method : j + upper(method);
      (function(j) {
        proto[m] = function() {
          var args = [].slice.call(arguments);
          return status[j](this.calls, function(call) {
            return call[method].apply(call, args);
          });
        };
      })(j);
    }
  })(methods[i]);
}

function some(calls, func) {
  for(var i = 0, l = calls.length; i < l; i++) {
    if (func(calls[i])) {
      return true;
    }
  }
  return false;
}

function always(calls, func) {
  for(var i = 0, l = calls.length; i < l; i++) {
    if (!func(calls[i])) {
      return false;
    }
  }
  return true;
}

function never(calls, func) {
  for(var i = 0, l = calls.length; i < l; i++) {
    if (func(calls[i])) {
      return false;
    }
  }
  return true;
}

function upper(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function isGeneratorFn(fn) {
  return typeof fn === 'function' &&
    fn.constructor.name === 'GeneratorFunction';
}
