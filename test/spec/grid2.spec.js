/*jshint expr: true*/
var
  Grid2         = require('../../src/grid2'),
  Vec2          = require('vec2'),
  should        = require('should'),
  key           = function key(x, y) { return new Vec2(x,y).toString(); };

describe('Grid2', function(){
  beforeEach(function() {
    this.grid = new Grid2({
      'size'      : new Vec2(100, 100),
      'cellSize'  : new Vec2(10, 10)
    });

    this.between = {
      beg : new Vec2(10, 10),
      end : new Vec2(40, 35),
      objects : [
        { 'pos' : new Vec2(15, 15), 'rad' : 3 },
        { 'pos' : new Vec2(20, 20), 'rad' : 3 },
        { 'pos' : new Vec2(32, 32), 'rad' : 1 }
      ]
    };

    this.object = this.between.objects[0];
  });

  describe('#ctor', function() {
    it ('should not throw', function() {
        Grid2.bind(null, {
          'size'      : new Vec2(1,2),
          'cellSize'  : new Vec2(1,1)
        }).should.not.throw();
    });
  });

  describe('.addObject()', function() {
    context('with an object without id', function() {
      it('should generate id for it', function() {
        var object = { 'pos' : new Vec2(1, 2), 'rad' : 4 };

        this.grid.addObject(object);
        object.id.should.eql(1);
      });
    });

    context('with an object with id', function() {
      it('should not reset its id', function() {
        var object = { 'id' : 2, 'pos' : new Vec2(1, 2), 'rad' : 4 };

        this.grid.addObject(object);
        object.id.should.eql(2);
      });
    });

    context('with an object', function() {
      beforeEach(function() {
        this.object.pos = new Vec2(13, 15);
        this.object.rad = 3;

        this.grid.addObject(this.object);

        var inspect = this.grid.inspect();

        this.objects  = inspect.objects;
        this.cells    = inspect.cells;

      });

      it('should register the object in data', function() {
        this.objects[this.object.id].should.be.ok;
      });

      it('should register cells in data', function() {
        this.cells[key(10, 10)].begPosition.x.should.eql(10);
      });

      it('should register the object for the cell in data', function() {
        this.cells[key(10, 10)].objects['1'].should.eql(this.object);
      });

    });

    context('with an object positioned on borders', function() {
      beforeEach(function() {
        this.object.pos = new Vec2(16, 14);
        this.object.rad = 4;
        this.grid.addObject(this.object);

        var inspect = this.grid.inspect();

        this.objects  = inspect.objects;
        this.cells    = inspect.cells;
      });

      it('should register the object for the proper cells', function() {
        Object.keys(this.cells).length.should.eql(1);
        this.cells[key(10, 10)].objects['1'].should.eql(this.object);
        should(this.cells[key(20, 10)]).be.not.ok;
        should(this.cells[key(10, 20)]).be.not.ok;
      });
    });

    context('with a big object', function() {
      beforeEach(function() {
        this.object.pos = new Vec2(41, 40);
        this.object.rad = 10;

        this.grid.addObject(this.object);

        var inspect = this.grid.inspect();

        this.objects  = inspect.objects;
        this.cells    = inspect.cells;
      });

      it('should register the object for the cells in data', function() {
        should(this.cells[key(40, 20)]).be.not.ok;
        should(this.cells[key(30, 20)]).be.not.ok;
        should(this.cells[key(40, 50)]).be.not.ok;
        this.cells[key(30, 30)].objects['1'].should.eql(this.object);
        this.cells[key(40, 30)].objects['1'].should.eql(this.object);
        this.cells[key(30, 40)].objects['1'].should.eql(this.object);
        this.cells[key(40, 40)].objects['1'].should.eql(this.object);
        this.cells[key(50, 40)].objects['1'].should.eql(this.object);
      });
    });
  });

  describe('.updateObject()', function() {
    beforeEach(function() {
      this.grid.addObject(this.object);

      var inspect = this.grid.inspect();

      this.objects  = inspect.objects;
      this.cells    = inspect.cells;
    });

    it('should update them cells', function() {
      this.object.pos = new Vec2(62, 48);
      this.grid.updateObject(this.object);

      should(this.cells[key(10, 10)].objects['1']).be.not.ok;
      this.cells[key(60, 40)].objects['1'].should.eql(this.object);
    });
  });

  describe('.updateObjects()', function() {
  });

  describe('.getObjectsOn()', function() {
    it('should be tested');
  });


  describe('.getObjectsBetween()', function() {
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
        this.outerObject = { 'pos' : new Vec2(88, 44), 'rad' : 3 };
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

  describe('.hasObjectsOn()', function() {
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

  describe('.setMetaOn()', function() {
    it('should be tested');
  });

  describe('.getMetaOn()', function() {
    it('should be tested');
  });
});
