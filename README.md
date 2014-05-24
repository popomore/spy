# spy [![Build Status](https://travis-ci.org/popomore/spy.png?branch=master)](https://travis-ci.org/popomore/spy) [![Coverage Status](https://coveralls.io/repos/popomore/spy/badge.png?branch=master)](https://coveralls.io/r/popomore/spy?branch=master) 

Spy implement for test

---

## Install

```
$ npm install spy -g
```

## Usage

```
var spy = require('spy');
```

## API

spy() 创建匿名函数
spy(func) 监听函数
spy(obj) 监听对象的所有函数

spy(obj, 'name') 监听对象的指定函数

spy 应该是 passthrough 的

func.called
func.throwed
func.callCount
func.calledWith()
func.calledWith().callCount
func.calledOn()
func.calledOn().callCount
func.return()
func.return().callCount

func.restore()

## LISENCE

Copyright (c) 2014 popomore. Licensed under the MIT license.
