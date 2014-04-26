var
  Vec2    = require('vec2'),
  Grid2   = require('../src/grid2'),
  should  = require('should'),
  rand    = function rand(num) { return Math.floor(Math.random() * num); };

describe('Grid2', function(){
  beforeEach(function() {
    this.grid = new Grid2(new Vec2(100, 100));
  });

  describe('#ctor', function() {
    context('without proper size params', function() {
      it ('should throw', function() {
        Grid2.bind(null).should.throw(/^NaV/);
      });

      it ('should throw', function() {
        Grid2.bind(null, { x : 1 }).should.throw(/^NaV/);
      });
    });

    it ('should not throw', function() {
        Grid2.bind(null, new Vec2(1,2)).should.not.throw();
    });
  });

  describe('#addObject', function() {
    context('with an object without id', function() {
      it('should generate id_ for it', function() {
        var object = {};

        this.grid.addObject(object);
        object.id_.should.eql(1);
      });
    });

    context('with an object with id', function() {
      it('should not reset its id_', function() {
        var object = { id_ : 2 };

        this.grid.addObject(object);
        object.id_.should.eql(2);
      });
    });
  });

  describe('#getObjectsBetween', function() {
  });
});
