'use strict';

require('should');
var spyit = require('../lib/spy');

describe('/lib/spy.js', function() {

  it('spy()', function() {
    var spy = spyit();
    spy();
    spy(1);
    spy();
    spy.called.should.be.true;
    spy.callCount.should.eql(3);
    spy.calledWith(1).should.be.true;
  });

  it('spy(func)', function() {
    function func() {}
    var spy = spyit(func);
    spy.should.not.equal(func);
    spy.method.should.equal(func);
    spy();
    spy(1);
    spy();
    spy.called.should.be.true;
    spy.callCount.should.eql(3);
    spy.calledWith(1).should.be.true;
  });

  it('spy(obj, func)', function() {
    var obj = {
      a: function() {}
    };
    var spy = spyit(obj, 'a');
    spy.should.equal(obj.a);
  });

  it('should not wrap more than once', function() {
    var obj = {
      a: function() {}
    };
    spyit(obj, 'a');
    var a1 = obj.a;
    spyit(obj, 'a');
    obj.a.should.equal(a1);
  });

  describe('Spy', function() {

    it('should calledWith', function() {
      var obj = {
        a: function() {}
      };
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
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
      var spy = spyit(obj, 'a');
      new obj.a();
      obj.a();
      spy.calledWithNew().should.be.true;
      spy.alwaysCalledWithNew().should.be.false;
    });

    it('should calledBefore/calledAfter', function() {
      var spy1 = spyit();
      var spy2 = spyit();
      spy1();
      spy2();
      spy1();
      spy1.calledBefore(spy2).should.be.true;
      spy2.calledAfter(spy1).should.be.true;

      var spy3 = spyit();
      var spy4 = spyit();
      spy3();
      spy3.calledBefore(spy4).should.be.true;
      spy4.calledAfter(spy3).should.be.true;

      var spy5 = spyit();
      var spy6 = spyit();
      spy6();
      spy6.calledBefore(spy5).should.be.true;
      spy5.calledAfter(spy6).should.be.true;

      var spy7 = spyit();
      var spy8 = spyit();
      spy7.calledBefore(spy8).should.be.false;
      spy7.calledAfter(spy8).should.be.false;
      spy8.calledBefore(spy7).should.be.false;
      spy8.calledAfter(spy7).should.be.false;
    });

    it('should restore', function() {
      var orig = function() {};
      var obj = {
        a: orig
      };
      var spy = spyit(obj, 'a');
      obj.a.should.not.equal(orig);
      spy.restore();
      obj.a.should.equal(orig);
    });
  });

  describe('Mock', function() {

    it('should mock fn', function() {
      var spy = spyit();
      spy.mock(function(arg) {
        return arg * 10;
      });
      spy(1).should.eql(10);
      spy(2).should.eql(20);

      spy = spyit();
      spy.mock(function() {
        return this;
      });
      var ctx = {};
      spy.call(ctx).should.equal(ctx);

      spy = spyit();
      spy.mock(function() {
        throw new Error('err');
      });
      (function() {
        spy();
      }).should.throw('err');
    });

    it('should mock number', function() {
      var obj = {
        a: function() {}
      };
      var spy = spyit(obj, 'a');
      spy.mock(1);
      spy().should.eql(1);
    });

    it('should mock string', function() {
      var obj = {
        a: function() {}
      };
      var spy = spyit(obj, 'a');
      spy.mock('a');
      spy().should.eql('a');
    });

    it('should mock obj', function() {
      var obj = {
        a: function() {}
      };
      var spy = spyit(obj, 'a');
      spy.mock({a: 1});
      spy().should.eql({a: 1});
    });

    it('should reset when mock more than once', function() {
      var spy = spyit();
      spy();
      spy.called.should.be.true;
      spy.callCount.should.eql(1);
      spy.mock(1);
      spy.called.should.be.false;
      spy.callCount.should.eql(0);
      spy();
      spy.mock(2);
      spy.called.should.be.false;
      spy.callCount.should.eql(0);
    });

    it('should pass through the call when reset mock', function() {
      var spy = spyit();
      spy.mock(1);
      spy().should.eql(1);
      spy.reset();
      (spy() === undefined).should.be.true;
    });
  });
});
