# Grid2.js
is a Node.js [npm-package][npm] / JavaScript implementation of two dimensional grid for collision detection. Exported for client side use with the help of [browserify][browserify].

[![Build Status][travis-img-src]][travis-a-href]

## About
If you got some objects with 2d coordinates you can use this data structure to speed up some calculations like: **field of view**, **collision detection**.

It is a fixed grid, which indexes the inserted objects and keeps them up-to-date.

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

## License
[MIT License][git-LICENSE]

  [minified]: https://github.com/p1100i/grid2.js/blob/master/grid2.min.js
  [git-LICENSE]: LICENSE
  [travis-img-src]: https://travis-ci.org/p1100i/grid2.js.png?branch=master
  [travis-a-href]: https://travis-ci.org/p1100i/grid2.js
  [npm]: https://www.npmjs.org/package/grid2
  [browserify]: http://browserify.org/
  [github-quadtree2]: https://github.com/p1100i/quadtree2.js
