var
  Vec2          = require('vec2'),
  Grid2Quadrant = require('../src/grid2quadrant'),
  Grid2         = require('../src/grid2'),
  should        = require('should'),
  rand          = function rand(num) { return Math.floor(Math.random() * num); };

describe('Grid2', function(){
  beforeEach(function() {
    this.grid = new Grid2(new Vec2(100, 100), new Vec2(10, 10));

    this.between = {
      beg : new Vec2(10, 10),
      end : new Vec2(30, 30)
    };

    this.objects  = [
      { pos_ : new Vec2(15, 15), halfSize_ : new Vec2(3, 2) },
      { pos_ : new Vec2(20, 20), halfSize_ : new Vec2(3, 2) }
    ];

    this.object = this.objects[0];
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
        Grid2.bind(null, new Vec2(1,2), new Vec2(1,1)).should.not.throw();
    });
  });

  describe('#addObject', function() {
    context('with an object without id', function() {
      it('should generate id_ for it', function() {
        var object = { pos_ : new Vec2(1, 2), halfSize_ : new Vec2(3, 4) };

        this.grid.addObject(object);
        object.id_.should.eql(1);
      });
    });

    context('with an object with id', function() {
      it('should not reset its id_', function() {
        var object = { id_ : 2, pos_ : new Vec2(1, 2), halfSize_ : new Vec2(3, 4) };

        this.grid.addObject(object);
        object.id_.should.eql(2);
      });
    });

    context('with an object', function() {
      beforeEach(function() {
        this.object.pos_      = new Vec2(13, 15);
        this.object.halfSize_ = new Vec2(3, 2);

        this.grid.addObject(this.object);
        this.grid.debug(true);
      });

      it('should register the object in data', function() {
        this.grid.data_.objects_[this.object.id_].should.be.ok;
      });

      it('should register quadrants in data', function() {
        this.grid.data_.quadrants_['10_10'].posBeg_.x.should.eql(10);
        this.grid.data_.quadrants_['10_10'].posEnd_.y.should.eql(20);
      });

      it('should register the object for the quadrant in data', function() {
        this.grid.data_.quadrants_['10_10'].objects_['1'].should.eql(this.object);
      });
    });

    context('with a big object', function() {
      beforeEach(function() {
        this.object.pos_      = new Vec2(41, 40);
        this.object.halfSize_ = new Vec2(10, 10);

        this.grid.addObject(this.object);
        this.grid.debug(true);
      });

      it('should register the object for the quadrants in data', function() {
        should(this.grid.data_.quadrants_['40_20']).be.not.ok;
        should(this.grid.data_.quadrants_['30_20']).be.not.ok;
        this.grid.data_.quadrants_['30_30'].objects_['1'].should.eql(this.object);
        this.grid.data_.quadrants_['40_30'].objects_['1'].should.eql(this.object);
        this.grid.data_.quadrants_['30_40'].objects_['1'].should.eql(this.object);
        this.grid.data_.quadrants_['40_40'].objects_['1'].should.eql(this.object);
        this.grid.data_.quadrants_['50_40'].objects_['1'].should.eql(this.object);
        this.grid.data_.quadrants_['40_50'].objects_['1'].should.eql(this.object);
      });
    });
  });

  describe('#updateObject', function() {
    beforeEach(function() {
      this.grid.addObject(this.object);
      this.grid.debug(true);
    });

    it('should update them quadrants', function() {
      this.object.pos_ = new Vec2(62, 48);
      this.grid.updateObject(this.object);

      should(this.grid.data_.quadrants_['10_10'].objects_['1']).be.not.ok;
      this.grid.data_.quadrants_['60_40'].objects_['1'].should.eql(this.object);
    });
  });

  describe('#getObjectsBetween', function() {
    context('without proper coordinates', function() {
      it('should throw', function() {
        this.grid.getObjectsBetween.should.throw(/^NaV/);
      });
    });

    context('without objects', function() {
      it('should return {}', function() {
        var result = this.grid.getObjectsBetween(this.between.beg, this.between.end);
        result.should.not.be.an.Array;
        result.should.be.an.Object;
      });
    });

    context('without objects inside the bounds', function() {
      it('should return {}', function() {
        this.grid.addObjects(this.objects);
        var result = this.grid.getObjectsBetween(new Vec2(80, 80), new Vec2(90, 90)).should.eql({});

        result.should.not.be.an.Array;
        result.should.be.an.Object;
      });
    });

    context('with objects inside the bounds', function() {
      it('should return the objects', function() {
        this.grid.addObjects(this.objects);

        this.grid.getObjectsBetween(this.between.beg, this.between.end).should.eql({
          1 : this.objects[0],
          2 : this.objects[1]
        });
      });
    });
  });
});
