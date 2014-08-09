'use strict';

require('should');
var Spy = require('../lib/spy');

describe('/lib/spy.js', function() {

  it('should not wrap more than once', function() {
    var obj = {
      a: function() {}
    };
    new Spy(obj, 'a');
    var a1 = obj.a;
    new Spy(obj, 'a');
    obj.a.should.equal(a1);
  });

  describe('Spy', function() {

    it('should calledWith', function() {
      var obj = {
        a: function() {}
      };
      var spy = new Spy(obj, 'a');
      obj.a(1);
      spy.called.should.be.true;
      spy.callCount.should.eql(1);
      spy.calledWith(1).should.be.true;
      spy.alwaysCalledWith(1).should.be.true;
      spy.neverCalledWith(1).should.be.false;
    });

    it('should calledWith many times', function() {
      var obj = {
        a: function() {}
      };
      var spy = Spy(obj, 'a');
      obj.a(1);
      obj.a(1, 2);
      obj.a(1);
      obj.a(1, 'a');
      spy.called.should.be.true;
      spy.callCount.should.eql(4);
      spy.calledWith(1).should.be.true;
      spy.calledWith(2).should.be.false;
      spy.calledWith(1, 2).should.be.true;
      spy.calledWith(1, 'a').should.be.true;
      spy.alwaysCalledWith(1).should.be.true;
      spy.alwaysCalledWith(1, 2).should.be.false;
      spy.neverCalledWith(1, 2).should.be.false;
      spy.neverCalledWith(2).should.be.true;
    });

    it('should calledWithExactly', function() {
      var obj = {
        a: function() {}
      };
      var spy = new Spy(obj, 'a');
      obj.a(1, 2);
      obj.a(1, 2);
      spy.called.should.be.true;
      spy.callCount.should.eql(2);
      spy.calledWithExactly(1).should.be.false;
      spy.calledWithExactly(1, 2).should.be.true;
      spy.alwaysCalledWithExactly(1, 2).should.be.true;
    });

    it('should returned', function() {
      var ret;
      var obj = {
        a: function() {
          return ret;
        }
      };
      var spy = new Spy(obj, 'a');
      ret = ['a'];
      obj.a();
      ret = ['a'];
      obj.a();
      ret = 'a';
      obj.a();
      spy.returned(['a']).should.be.true;
      spy.returned('a').should.be.true;
      spy.alwaysReturned('a').should.be.false;
      spy.alwaysReturned(['a']).should.be.false;
      spy.neverReturned(['a']).should.be.false;
      spy.neverReturned(['b']).should.be.true;
    });

    it('should calledOn', function() {
      var obj = {
        a: function() {}
      };
      var spy = new Spy(obj, 'a');
      var ctx = {};
      obj.a.call(ctx);
      obj.a.call({});
      spy.calledOn(ctx).should.be.true;
      spy.calledOn({}).should.be.false;
      spy.alwaysCalledOn(ctx).should.be.false;
      spy.alwaysCalledOn({}).should.be.false;
      spy.neverCalledOn({}).should.be.true;
    });

    it('should threw', function() {
      var obj = {
        a: function(args) {
          throw new Error(args === 1 ? 'err1' : 'err');
        }
      };
      var spy = new Spy(obj, 'a');
      try {obj.a();} catch(e) {}
      try {obj.a(1);} catch(e) {}
      spy.threw().should.be.true;
      spy.threw('err').should.be.true;
      spy.threw('err1').should.be.true;
      spy.alwaysThrew().should.be.true;
      spy.alwaysThrew('err').should.be.false;
      spy.neverThrew().should.be.false;
    });


    it('should calledOn', function() {
      var obj = {
        a: function() {}
      };
      var spy = new Spy(obj, 'a');
      new obj.a();
      obj.a();
      spy.calledWithNew().should.be.true;
      spy.alwaysCalledWithNew().should.be.false;
    });
  });

  describe('Mock', function() {

  });
});
