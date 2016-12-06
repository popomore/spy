# spy

[![NPM version](https://img.shields.io/npm/v/spy.svg?style=flat)](https://npmjs.org/package/spy)
[![Spm version](http://spmjs.io/badge/spy)](http://spmjs.io/package/spy)
[![Build Status](https://img.shields.io/travis/popomore/spy.svg?style=flat)](https://travis-ci.org/popomore/spy)
[![Build Status](https://img.shields.io/coveralls/popomore/spy.svg?style=flat)](https://coveralls.io/r/popomore/spy)
[![NPM downloads](http://img.shields.io/npm/dm/spy.svg?style=flat)](https://npmjs.org/package/spy)

spy and mock for simple testcase

---

## Why Spy?

Sinon is the best spy, stub, mock lib, I use it in my every repo.

But Sinon is too big, I just use spy and simple mock, and I think it can be separated to different repo.

So I write Spy

- written in commonjs, support package mananger for browser such as spm, component, bower.
- support spy and simple mock, see API below

## Install

```
$ npm install spy -g
```

Install for browser

[spm](http://spmjs.io/)

```
spm install spy
```

[component](http://component.io/)

```
component install popomore/spy
```

[bower](http://bower.io/)

```
bower install spy
```

## Usage

```
var spy = require('spy');
var s = spy();
s(1);
s.called // return true
s.callCount // return 1
s.calledWith(1) // return true
```

mock spy function

```
var spy = require('spy');
var s = spy();
s.mock(1);
s(); // return 1
```

mock module

```
// a.js
module.exports = function() {}

// b.js
var a = require('spy').require('./a.js');
a();
a.callCount // return 1
```

## API

### spy()

Create a anonymous `Spy` function

### spy(func)

Create a `Spy` function wrapped `func`

### spy(obj, 'func')

Create a `Spy` function wrapped `obj.func`

### Spy

`Spy` function can be used as a normal function, and it will record what the function do.

By default, Spy will pass arguments to original function, get result from the function, and use the same context;

Otherwise, using `spy.mock` will call the mock function instead of calling the original function, 

#### spy.obj

The object that contain the refer to the function

```
spy(obj, 'a'); // obj === spy.obj
``` 

#### spy.method

The original method

```
spy(obj, 'a'); // obj.a === spy.method
spy(func); // func === spy.method
spy(); // spy.method is an anonymous function
```

#### spy.methodName

The method name of the given function

```
spy(obj, 'a'); // 'a' === spy.method
``` 

#### spy.called

Return true if the spy function has been called.

#### spy.callCount

Return the count that the spy function has been called.

#### spy.calls

Contain the call list in order, each call is the `Call` instance.

```
spy(); // spy.call[0]
spy(); // spy.call[1]
```

#### spy.mock()

Mock the return value of the spy

```
spy.mock(1);
spy(); // return 1
```

You can do it just like a normal function

```
spy.mock(function(arg1, arg2, arg3) {
	// 1. return arg1
	// 2. return this
	// 3. throw new Error();
});
```

Support generator!!!

```
spy.mock(function* () {
  var pkg = yield read('package.json');
  return pkg.name;
});
```

#### spy.reset()

Reset the call record and the mock method

#### spy.restore()

Restore the refer to the function

#### spy.calledBefore / spy.calledAfter

In the call sequence, determine whether one spy is called before/after the other.

```
spy1();
spy2();
spy1.calledBefore(spy2); // true
spy2.calledAfter(spy1); // true
```

#### spy.calledWith / spy.alwaysCalledWith / spy.neverCalledWith

Same as call.calledWith, but will match spy.calls in diffent ways.

- `spy.calledWith`, whether one of the calls called with arguments, just like

  ```
  calls.some(function(call){
    return call.calledWith()
  });
  ```

- `spy.alwaysCalledWith`, whether all calls called with arguments, just like

  ```
  calls.every(function(call){
    return call.calledWith()
  });
  ```

- `spy.neverCalledWith`, whether all calls didn't call with arguments, just like

  ```
  calls.every(function(call){
    return !call.calledWith()
  });
  ```


#### spy.calledWithNew / spy.alwaysCalledWithNew / spy.neverCalledWithNew

Same as spy.calledWithNew, but will match spy.calls in diffent ways.

The different between always and never see spy.calledWith

#### spy.calledWithExactly / spy.alwaysCalledWithExactly / spy.neverCalledWithExactly

Same as spy.calledWithExactly, but will match spy.calls in diffent ways.

The different between always and never see spy.calledWith

#### spy.calledOn / spy.alwaysCalledOn / spy.neverCalledOn

Same as spy.calledOn, but will match spy.calls in diffent ways.

The different between always and never see spy.calledWith

#### spy.returned / spy.alwaysReturned / spy.neverReturned

Same as spy.returned, but will match spy.calls in diffent ways.

The different between always and never see spy.calledWith

#### spy.threw / spy.alwaysThrew / spy.neverThrew

Same as spy.threw, but will match spy.calls in diffent ways.

The different between always and never see spy.calledWith

### Call

`Call` object will record every function call.

#### call.calledWith

Return true if match the call arguments

```
spy(1, 2, 3)
spy.calls[0].calldWith(1) // true
spy.calls[0].calldWith(1, 2) // true
spy.calls[0].calldWith(1, 2, 3) // true
```

#### call.calledWithExactly

Same as calledWith, but assert the arguments length

```
spy(1, 2, 3)
spy.calls[0].calledWith(1) // false
spy.calls[0].calledWith(1, 2) // false
spy.calls[0].calledWith(1, 2, 3) // true
```

#### call.calledWithNew

Return true if it instantiation

```
new spy()
spy.calls[0].calledWithNew() // true
```

#### call.calledOn

Return true if it called with the context

```
spy.call(ctx)
spy.calls[0].calledOn(ctx) // true
```

#### call.returned

Return true if get the matched return

```
function spiedFunc() { return 1; }
var spy = require('spy')(spiedFunc);
spy()
spy.calls[0].returned(1) // true
```

#### call.threw

Return true if the function had threw

```
function spiedFunc() { throw new Error(); }
var spy = require('spy')(spiedFunc);
spy()
spy.calls[0].threw() // true
```

## LICENSE

Copyright (c) 2014 popomore. Licensed under the MIT license.
