'use strict';

require('should');
const equal = require('../lib/equal');

describe('/lib/equal.js', function() {

  it('undefined / null', function() {
    equal(undefined, undefined).should.be.true;
    equal(undefined, null).should.be.false;
    equal(undefined, '').should.be.false;
    equal(undefined, 0).should.be.false;
    equal(null, null).should.be.true;
    equal(null, '').should.be.false;
    equal(null, 0).should.be.false;
  });

  it('number', function() {
    equal(0, 0).should.be.true;
    equal(1, 1).should.be.true;
    equal(0, Number(0)).should.be.true;
    equal(1, Number(1)).should.be.true;
    equal(0, '0').should.be.false;
    equal(1, '1').should.be.false;
    equal(NaN, NaN).should.be.true;
    equal(Infinity, Infinity).should.be.true;
  });

  it('string', function() {
    equal('a', 'a').should.be.true;
    equal('a', String('a')).should.be.true;
  });

  it('array', function() {
    equal([], []).should.be.true;
    equal([], [ 1 ]).should.be.false;
    equal([ 1, 'a' ], [ 1, 'b' ]).should.be.false;
    equal([ 1, [ 'a', 'b' ]], [ 1, [ 'a', 'b' ]]).should.be.true;
  });

  it('object', function() {
    equal({}, {}).should.be.true;
    equal({ a: 1, b: 1 }, { b: 1, a: 1 }).should.be.true;
    equal({ a: [ '1' ] }, { a: [ '1' ] }).should.be.true;
    equal({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }).should.be.true;
    equal({ a: { b: { c: 1 } } }, { a: { b: { d: 1 } } }).should.be.false;
    equal({ a: 1 }, { b: 1, a: 1 }).should.be.false;
  });

  it('date', function() {
    const d = new Date();
    equal(d, d).should.be.true;
    equal(new Date('2014-01-01'), new Date('2014-01-01')).should.be.true;
  });

  it('boolean', function() {
    equal(true, true).should.be.true;
    equal(false, false).should.be.true;
    equal(true, false).should.be.false;
  });
});
