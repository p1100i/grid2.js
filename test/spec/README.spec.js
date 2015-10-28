/*jshint expr: true*/
/*exported should*/
var
  Grid2         = require('../../src/grid2'),
  Vec2          = require('vec2'),
  should        = require('should');

describe('Grid2 - e2e - README', function() {
  context('with the example', function() {
    it('should work correctly', function() {
      // BEG README
      var
        // Some helper variables to save info to.
        objectsOnAlicesPosition,
        objectsOnBobsPosition,
        objectsOnBobsPositionLater,
        objectsOnMap,

        // This will initialize a grid2 with a 100x100 resolution,
        // with cells of the size 10, 10.
        grid = new Grid2({
          'size'     : new Vec2(100, 100),
          'cellSize' : new Vec2(10, 10)
        }),

        // Alice will be staying fierce in the top left ...
        alice = {
          'pos' : new Vec2(20, 20),
          'rad' : 3
        },

        // ... with his rocket luncher, gonna try to shoot bob ...
        rocket = {
          'pos' : new Vec2(20, 20),
          'rad' : 5
        },

        // ... however there is a bunker on the field ...
        bunker = {
          'pos' : new Vec2(50, 50),
          'rad' : 10
        },

        // ... will it save bob?
        bob = {
          'pos' : new Vec2(80, 80),
          'rad' : 3
        };


      // Add all of our beloved character to the grid.
      grid.addObjects([alice, rocket, bunker, bob]);

      // On the start Alice is near to her own rocket.
      objectsOnAlicesPosition = grid.getObjectsOn(alice.pos);

      // Object.keys(objectsOnAlicesPosition).length);
      // >> 2;

      // Bob is just sitting and waiting.
      objectsOnBobsPosition = grid.getObjectsOn(bob.pos);

      // Object.keys(objectsOnBobsPosition).length;
      // >> 1;

      // The rocket flys over to bob
      rocket.pos.x = 78;
      rocket.pos.y = 78;

      // Update our data structure
      grid.updateObject(rocket);

      // Lets get some objects after the update.
      objectsOnBobsPositionLater = grid.getObjectsOn(bob.pos);

      // Object.keys(objectsOnBobsPositionLater).length;
      // >> 1;

      // Lets get every object for fun.
      objectsOnMap = grid.getObjectsBetween(new Vec2(0, 0), new Vec2(100, 100));

      // Object.keys(objectsOnMap).length;
      // >> 4;

      // END README

      // Test it!
      objectsOnAlicesPosition.should.eql({
        '1' : alice,
        '2' : rocket
      });

      objectsOnBobsPosition.should.eql({
        '4' : bob
      });

      objectsOnBobsPositionLater.should.eql({
        '2' : rocket,
        '4' : bob
      });

      objectsOnMap.should.eql({
        '1' : alice,
        '2' : rocket,
        '3' : bunker,
        '4' : bob
      });
    });
  });
});
