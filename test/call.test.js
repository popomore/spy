'use strict';

require('should');
const Call = require('../lib/call');

describe('/lib/call.js', function() {

  it('should check without arguments', function() {
    const call = new Call();
    call.returned().should.be.true;
    call.calledWith().should.be.true;
    call.calledOn().should.be.true;
    call.threw().should.be.false;
  });

  it('should check return', function() {
    let call = new Call({
      return: 1,
    });
    call.returned(1).should.be.true;

    call = new Call({
      return: 'a',
    });
    call.returned('a').should.be.true;

    call = new Call({
      return: { a: 1 },
    });
    call.returned({ a: 1 }).should.be.true;

    call = new Call({
      return: null,
    });
    call.returned(null).should.be.true;

    call = new Call();
    call.returned().should.be.true;
    call.returned(undefined).should.be.true;
  });

  it('should check throw', function() {
    let call = new Call({
      error: new Error('err'),
    });
    call.threw().should.be.true;
    call.threw('err').should.be.true;
    call.threw('other').should.be.false;

    call = new Call();
    call.threw().should.be.false;
  });

  it('should check context', function() {
    const ctx = {};
    const call = new Call({
      context: ctx,
    });
    call.calledOn(ctx).should.be.true;
    call.calledOn({}).should.be.false;
  });

  it('should check calledWithNew', function() {
    let call = new Call();
    call.calledWithNew().should.be.false;

    call = new Call({
      new: false,
    });
    call.calledWithNew().should.be.false;

    call = new Call({
      new: true,
    });
    call.calledWithNew().should.be.true;
  });

  it('should check calledWith', function() {
    let call = new Call();
    call.calledWith().should.be.true;

    call = new Call({
      arguments: [],
    });
    call.calledWith().should.be.true;
    call.calledWithExactly().should.be.true;

    call = new Call({
      arguments: [ 1, 'a', { a: 1 }, [ 'a' ]],
    });
    call.calledWith().should.be.true;
    call.calledWithExactly().should.be.false;
    call.calledWith(1).should.be.true;
    call.calledWith(1, 'a').should.be.true;
    call.calledWith(1, 'a', 'b').should.be.false;
    call.calledWithExactly(1, 'a').should.be.false;
    call.calledWith(1, 'a', { a: 1 }).should.be.true;
    call.calledWith(1, 'a', { a: 1 }, [ 'a' ]).should.be.true;
    call.calledWithExactly(1, 'a', { a: 1 }, [ 'a' ]).should.be.true;
  });
});
