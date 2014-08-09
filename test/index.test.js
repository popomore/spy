'use strict';

require('should');
var spyjs = require('..');

describe.only('/index.js', function() {

  it('should spy()', function() {
    var spy = spyjs();
    spy.wrapMethod(1);
    spy.called.should.be.true;
    spy.callCount.should.eql(1);
    spy.calledWith(1).should.be.true;

    spy.wrapMethod(1);
    spy.callCount.should.eql(2);
  });

  it('should spy(func)', function() {

  });

  it('should spy(obj, method)', function() {

  });

});
