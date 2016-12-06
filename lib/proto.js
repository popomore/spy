'use strict';

const Call = require('./call');

const proto = module.exports = {};

proto.invork = function invork(args, ctx, isNew) {
  let ret;
  let err;

  try {
    if (this.mockMethod) {
      ret = this.mockMethod.apply(ctx, args);
    } else {
      ret = this.method.apply(ctx, args);
    }
  } catch (e) {
    err = e;
  }
  this.watch({
    arguments: args,
    context: ctx,
    return: ret,
    error: err,
    new: isNew,
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
  this.reset();
  if (typeof fn === 'function' || isGeneratorFn(fn)) {
    this.mockMethod = fn;
  } else {
    this.mockMethod = function() {
      return fn;
    };
  }
};

proto.reset = function reset() {
  this.mockMethod = null;
  this.callCount = 0;
  this.calls = [];
  this.called = false;
};

proto.restore = function restore() {
  this.obj[this.methodName] = this.method;
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

const methods = [
  'calledWith',
  'calledWithNew',
  'calledWithExactly',
  'calledOn',
  'returned',
  'threw',
];

for (let i = 0, l = methods.length; i < l; i++) {
  (function(method) {
    proto[method] = function() {
      const args = [].slice.call(arguments);
      return some(this.calls, function(call) {
        return call[method].apply(call, args);
      });
    };

    // always
    proto['always' + upper(method)] = function() {
      const args = [].slice.call(arguments);
      return every(this.calls, function(call) {
        return call[method].apply(call, args);
      });
    };

    // never
    proto['never' + upper(method)] = function() {
      const args = [].slice.call(arguments);
      return every(this.calls, function(call) {
        return !call[method].apply(call, args);
      });
    };
  })(methods[i]);
}

function some(calls, func) {
  for (let i = 0, l = calls.length; i < l; i++) {
    if (func(calls[i])) {
      return true;
    }
  }
  return false;
}

function every(calls, func) {
  for (let i = 0, l = calls.length; i < l; i++) {
    if (!func(calls[i])) {
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
    /* istanbul ignore next */
    fn.constructor.name === 'GeneratorFunction';
}
