# Grid2.js
is a Node.js [npm-package][npm-grid2] / JavaScript implementation of two dimensional grid for collision detection. Exported for client side use with the help of [browserify][browserify].

[![Build Status][travis-img-src]][travis-a-href]

## About
If you got some objects with 2d coordinates you can use this data structure to speed up some calculations like: **field of view**, **collision detection**.

It is a fixed grid, which indexes the inserted objects and keeps them up-to-date on demand.

## Install
- browser
  - include the [grid2.min.js][minified] in your page with a script-tag
- Node.js
  - `var Vec2   = require('vec2');`
  - `var Grid2  = require('grid2');`

## Example
```javascript
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
```

## API
### Preconditions/assumptions
- Grid2 is not validating inputs, so make sure you are using it with right parameters
- objects inserted into the structure need to have *position* (a [Vec2][npm-vec2] object) and *radius* (will be considered as the half length of the outer bounding box)

#### .addObject(object)
Adds an object to the grid.
- @param {Object} object | to be inserted, must have .pos and a .rad properties.

#### .addObjects(objects)
Add objects to the grid, see above.
- @param {Array} objects | to be inserted.

#### .getObjectsOn(position)
Returns all objects indexed by the cell having the position.
- @param {Vec2} position.
- @return {Object<id,object>} | objects mapped by their ids.

#### .getObjectsBetween(begPosition, endPosition)
Returns all objects indexed by the cells between the two given positions.
- @param {Vec2} begPosition | of the searching bounding box.
- @param {Vec2} endPosition | of the searching bounding box.
- @return {Object<id,object>} | objects mapped by their ids.

#### .hasObjectsOn(position)
Returns if there is any objects indexed by the cell having the position.
- @param {Vec2} position.
- @return {boolean}

#### .updateObject(object)
Updates the cell indexes of an object. Use this after you've changed the position of an object placed in the grid.
- @param {Object} object | to be updated.

#### .updateObjects(objects)
Updates the cell indexes of objects, see above.
- @param {Array} objects | to be updated.

#### .setMetaOn(position, key, value)
Set metadata on cell by the indexed position. This is useful, if there is data, that must be shared between objects indexed by the same cells.
- @param {Vec2} position | of the cell.
- @param {string} key | of the metadata.
- @param {string} value | of the metadata.

#### .getMetaOn(position, key)
Returns metadata set of a cell on the position. For setting metadata, see above.
- @param {Vec2} position | of the cell.
- @param {string} key | of the metadata.
- @return {\*} | whatever you've stored there before, see above.

#### .inspect()
Returns some inner variables of the grid. Useful for debugging/testing.
- @return {Object} containing the cells and objects of the grid.

## Releases
For more info see the [CHANGELOG.md][changelog].
- 0.5.0 (2015-10-29)
- 0.4.1 (2014-06-09)
- 0.4.0 (2014-06-08)
- 0.3.0 (2014-06-08)
- 0.2.0 (2014-04-27)
- 0.1.0 (2014-04-27)
- 0.0.1 (2014-04-26)


## License
[MIT License][git-LICENSE]

  [changelog]: https://github.com/p1100i/grid2.js/blob/master/CHANGELOG.md
  [minified]: https://github.com/p1100i/grid2.js/blob/master/grid2.min.js
  [git-LICENSE]: LICENSE
  [travis-img-src]: https://travis-ci.org/p1100i/grid2.js.png?branch=master
  [travis-a-href]: https://travis-ci.org/p1100i/grid2.js
  [npm-vec2]: https://www.npmjs.org/package/grid2
  [npm-grid2]: https://www.npmjs.org/package/grid2
  [browserify]: http://browserify.org/
  [github-quadtree2]: https://github.com/p1100i/quadtree2.js
