var
  Vec2          = require('vec2'),
  Grid2         = require('../src/grid2'),
  should        = require('should'),
  rand          = function rand(num) { return Math.floor(Math.random() * num); },
  key           = function key(x, y) { return new Vec2(x,y).toString(); };

describe('Grid2', function(){
  beforeEach(function() {
    this.grid = new Grid2(new Vec2(100, 100), new Vec2(10, 10));

    this.between = {
      beg : new Vec2(10, 10),
      end : new Vec2(40, 35),
      objects : [
        { position_ : new Vec2(15, 15), halfSize_ : new Vec2(3, 2) },
        { position_ : new Vec2(20, 20), halfSize_ : new Vec2(3, 2) },
        { position_ : new Vec2(32, 32), halfSize_ : new Vec2(1, 1) }
      ]
    };

    this.object = this.between.objects[0];
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
        var object = { position_ : new Vec2(1, 2), halfSize_ : new Vec2(3, 4) };

        this.grid.addObject(object);
        object.id_.should.eql(1);
      });
    });

    context('with an object with id', function() {
      it('should not reset its id_', function() {
        var object = { id_ : 2, position_ : new Vec2(1, 2), halfSize_ : new Vec2(3, 4) };

        this.grid.addObject(object);
        object.id_.should.eql(2);
      });
    });

    context('with an object', function() {
      beforeEach(function() {
        this.object.position_ = new Vec2(13, 15);
        this.object.halfSize_ = new Vec2(3, 2);

        this.grid.addObject(this.object);
        this.grid.debug(true);
      });

      it('should register the object in data', function() {
        this.grid.data_.objects_[this.object.id_].should.be.ok;
      });

      it('should register cells in data', function() {
        this.grid.data_.cells_[key(10, 10)].begPosition_.x.should.eql(10);
        this.grid.data_.cells_[key(10, 10)].endPosition_.y.should.eql(20);
      });

      it('should register the object for the cell in data', function() {
        this.grid.data_.cells_[key(10, 10)].objects_['1'].should.eql(this.object);
      });

    });

    context('with an object positioned on borders', function() {
      beforeEach(function() {
        this.object.position_ = new Vec2(16, 14);
        this.object.halfSize_ = new Vec2(4, 4);
        this.grid.addObject(this.object);
        this.grid.debug(true);
      });

      it('should register the object for the proper cells', function() {
        console.log(this.grid.data_.cells_);
        Object.keys(this.grid.data_.cells_).length.should.eql(1);
        this.grid.data_.cells_[key(10, 10)].objects_['1'].should.eql(this.object);
        should(this.grid.data_.cells_[key(20, 10)]).be.not.ok;
        should(this.grid.data_.cells_[key(10, 20)]).be.not.ok;
      });
    });

    context('with a big object', function() {
      beforeEach(function() {
        this.object.position_ = new Vec2(41, 40);
        this.object.halfSize_ = new Vec2(10, 10);

        this.grid.addObject(this.object);
        this.grid.debug(true);
      });

      it('should register the object for the cells in data', function() {
        should(this.grid.data_.cells_[key(40, 20)]).be.not.ok;
        should(this.grid.data_.cells_[key(30, 20)]).be.not.ok;
        should(this.grid.data_.cells_[key(40, 50)]).be.not.ok;
        this.grid.data_.cells_[key(30, 30)].objects_['1'].should.eql(this.object);
        this.grid.data_.cells_[key(40, 30)].objects_['1'].should.eql(this.object);
        this.grid.data_.cells_[key(30, 40)].objects_['1'].should.eql(this.object);
        this.grid.data_.cells_[key(40, 40)].objects_['1'].should.eql(this.object);
        this.grid.data_.cells_[key(50, 40)].objects_['1'].should.eql(this.object);
      });
    });
  });

  describe('#updateObject', function() {
    beforeEach(function() {
      this.grid.addObject(this.object);
      this.grid.debug(true);
    });

    it('should update them cells', function() {
      this.object.position_ = new Vec2(62, 48);
      this.grid.updateObject(this.object);

      should(this.grid.data_.cells_[key(10, 10)].objects_['1']).be.not.ok;
      this.grid.data_.cells_[key(60, 40)].objects_['1'].should.eql(this.object);
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

    context('with objects', function() {
      beforeEach(function() {
        this.grid.addObjects(this.between.objects);
        this.outerObject = { position_ : new Vec2(88, 44), halfSize_ : new Vec2(3, 2) };
        this.grid.addObject(this.outerObject);
      });

      context('outside the bounds', function() {
        it('should return {}', function() {
          var result = this.grid.getObjectsBetween(new Vec2(80, 80), new Vec2(90, 90)).should.eql({});

          result.should.not.be.an.Array;
          result.should.be.an.Object;
        });
      });

      context('inside the bounds', function() {
        it('should return the objects', function() {
          this.grid.getObjectsBetween(this.between.beg, this.between.end).should.eql({
            1 : this.between.objects[0],
            2 : this.between.objects[1],
            3 : this.between.objects[2]
          });
        });
      });

      context('inside bigger bounds', function() {
        it('should return the objects', function() {
          this.grid.getObjectsBetween(new Vec2(-100, -100), new Vec2(200, 200)).should.eql({
            1 : this.between.objects[0],
            2 : this.between.objects[1],
            3 : this.between.objects[2],
            4 : this.outerObject
          });
        });
      });
    });
  });

  describe('#hasObjectsOn', function() {
    context('without proper coordinates', function() {
      it('should throw', function() {
        this.grid.hasObjectsOn.should.throw(/^NaV/);
      });
    });

    context('with objects', function() {
      beforeEach(function() {
        this.grid.addObjects(this.between.objects);
      });

      context('not on coordinate', function() {
        it('should return true', function() {
          this.grid.hasObjectsOn(new Vec2(40, 40)).should.eql(false);
        });
      });

      context('on coordinate', function() {
        it('should return true', function() {
          this.grid.hasObjectsOn(new Vec2(30, 30)).should.eql(true);
        });
      });
    });
  });

  describe('#getOrCreateCell', function() {
    it('should be tested')
  });

  describe('#getMetaOn', function() {
    it('should be tested')
  });

  describe('#setMetaOn', function() {
    it('should be tested')
  });

  describe('#propagateCallbackFromPoint ', function() {
    it('should be tested')
  });
});
