'use strict';

var Call = require('./call');

module.exports = Spy;

function Spy(obj, methodName) {
 if (!(this instanceof Spy)) {
    return new Spy(obj, methodName);
  }

  if (!obj[methodName]) {
    throw new Error('obj has no ' + methodName);
  }

  // will not wrap more than once
  if (obj[methodName].name === 'wrapMethod') {
    return methodName;
  }

  this.obj = obj;
  this.methodName = methodName;
  this.method = obj[methodName];
  this.wrapMethod = wrapMethod;
  this.reset();

  var that = this;
  obj[methodName] = wrapMethod;

  function wrapMethod() {
    var ret, err, args = [].slice.call(arguments), ctx = this;
    try {
      if (that.mockMethod) {
        ret = that.mockMethod.apply(ctx, args);
      } else {
        ret = that.method.apply(ctx, args);
      }
    } catch(e) {
      err = e;
    }
    that.watch({
      'arguments': args,
      'context': ctx,
      'return': ret,
      'error': err,
      'new': ctx instanceof wrapMethod
    });
    if (err) throw err;
    return ret;
  };
}

Spy.prototype.watch = function(obj) {
  this.callCount++;
  this.calls.push(new Call(obj));
  this.called = true;
};


Spy.prototype.mock = function(fn) {
  if (typeof fn === 'function' || isGeneratorFn(fn)) {
    this.mockMethod = fn;
  }
};

Spy.prototype.reset = function() {
  this.callCount = 0;
  this.calls = [];
  this.called = false;
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
        Spy.prototype[m] = function() {
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
