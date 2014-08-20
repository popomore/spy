'use strict';

require('should');
var clone = require('../lib/clone');

describe('/lib/clone.js', function() {

  it('should clone', function() {
    (clone() === null).should.be.true;
    (clone(null) === null).should.be.true;
    clone(0).should.equal(0);
    clone(1).should.equal(1);

    var a = {a: 1};
    clone(a).should.not.equal(a);
    clone(a).should.eql(a);

    var b = {
      a: {
        b: 1
      },
      c: [
        'd',
        {e: 2}
      ]
    };
    clone(b).should.not.equal(b);
    clone(b).should.eql(b);

    var c = new Class();
    c.a = [1, 2];
    clone(c).should.not.equal(c);
    clone(c).should.eql({
      a: [1, 2]
    });
  });
});

function Class() {}
Class.prototype.a = 1;
Class.prototype.b = 'b';
Class.prototype.c = {c: 2};
