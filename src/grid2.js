var
  Vec2 = require('vec2'),
  Grid2;

Grid2 = function Grid2(config) {
  var
    size,
    cellSize,
    cellHalfSize,
    ids           = 1,
    objects       = {},
    cells         = {},
    objectCells   = {},
    dirty         = 1,
    idKey         = 'id',
    positionKey   = 'pos',
    radiusKey     = 'rad',
    UNIT          = new Vec2(1, 1),

    cache = {
      'between' : {
        'dirty'   : 0,
        'queries' : {}
      }
    },

    Grid2Cell = function Grid2Cell(id, position) {
      this.id          = id;
      this.begPosition = position.clone();
      this.center      = this.begPosition.add(cellHalfSize, true);
      this.objects     = {};
      this.meta        = {};
    },

    cacheObjects = function cacheObjects(type, key, objects) {
      cache[type].dirty        = dirty;
      cache[type].queries[key] = objects;
    },

    getCached = function getCached(type, key) {
      if (cache[type].dirty === dirty && cache[type].queries[key]) {
        return cache[type].queries[key];
      }
    },

    getCacheKey = function getCacheKey(begPosition, endPosition) {
      return begPosition.toString() + '_' + endPosition.toString();
    },

    setDirty = function setDirty(dirt) {
      if (dirt) { dirty++; }
    },

    nextId = function nextId() {
      return ids++;
    },

    getObjectCells = function getObjectCells(object) {
      if (!objectCells[object[idKey]]) {
        objectCells[object[idKey]] = {};
      }

      return objectCells[object[idKey]];
    },

    getCellBegPosition = function getCellBegPosition(position) {
      return new Vec2(
        Math.floor(position.x / cellSize.x) * cellSize.x,
        Math.floor(position.y / cellSize.y) * cellSize.y
      );
    },

    getOrCreateCellByPosition = function getOrCreateCellByPosition(position) {
      var key;

      position  = getCellBegPosition(position);
      key       = position.toString();

      if (!cells[key]) {
        cells[key] = new Grid2Cell(key, position);
      }

      return cells[key];
    },

    getOrCreateCellsByObject = function getOrCreateCellsByObject(object) {
      var
        key,
        position,
        objectCells       = {},
        objectRadius      = object[radiusKey],
        objectPosition    = object[positionKey],
        objectBegPosition = objectPosition.subtract(objectRadius, objectRadius, true),
        objectEndPosition = objectPosition.add(objectRadius, objectRadius, true).subtract(UNIT),
        cellBegPosition   = getCellBegPosition(objectBegPosition),
        cellEndPosition   = getCellBegPosition(objectEndPosition);

      // As the lower/right side of a cell is considered as the beginning of the neighbour cell
      // we need to subtract one UNIT from the end position of the object, otherwise it will be registered
      // twice, see how objectEndPosition is calculated.
      // +) Not sure if this is the right way, but in my game use case, it is.

      for (position = cellBegPosition.clone(); position.x <= cellEndPosition.x; position.x += cellSize.x) {
        for (position.y = cellBegPosition.y; position.y <= cellEndPosition.y; position.y += cellSize.y) {
          key               = position.toString();
          objectCells[key]  = cells[key];

          if (!objectCells[key]) {
            objectCells[key] = cells[key] = new Grid2Cell(key, position);
          }
        }
      }

      return objectCells;
    },

    setObjId = function setObjId(object) {
      if (!object[idKey]) {
        object[idKey] = nextId();
      }
    },

    updateObjectCells = function updateObjectCells(object) {
      var
        cell,
        cellId,
        dirt     = false,
        oldCells = getObjectCells(object),
        newCells = getOrCreateCellsByObject(object);

      for (cellId in oldCells) {
        if (newCells[cellId]) {
          continue;
        }

        dirt  = true;
        cell  = oldCells[cellId];

        // Remove the object from the cell.
        delete cell.objects[object[idKey]];

        // Remove the cell from the objects-cell index.
        delete oldCells[cellId];
      }

      for (cellId in newCells) {
        if (oldCells[cellId]) {
          continue;
        }

        dirt                            = true;
        cell                            = newCells[cellId];
        cell.objects[object[idKey]]   = object;
        oldCells[cellId]                = cell;
      }

      setDirty(dirt);
    },

    /**
     * Public fns
     */

    addObject = function addObject(object) {
      setObjId(object);
      updateObjectCells(object);
      objects[object[idKey]] = object;
    },

    addObjects = function addObjects(objects) {
      var
        i;

      for (i = 0; i < objects.length; i++) {
        addObject(objects[i]);
      }
    },

    getObjectsOn = function getObjectsOn(position) {
        var
          id,
          cell,
          cellObjects,
          objects = {};

        position    = getCellBegPosition(position);
        cell        = cells[position.toString()];
        cellObjects = cell && cell.objects;

        for (id in cellObjects) {
          objects[id] = cellObjects[id];
        }

        return objects;
    },

    getObjectsBetween = function getObjectsBetween(begPosition, endPosition) {
      var
        id,
        cell,
        position,
        objects             = {},
        betweenBegPosition  = getCellBegPosition(begPosition),
        betweenEndPosition  = getCellBegPosition(endPosition),
        cacheKey            = getCacheKey(betweenBegPosition, betweenEndPosition),
        cached              = getCached('between', cacheKey);

      if (cached) {
        return cached;
      }

      for (position = betweenBegPosition.clone(); position.x <= betweenEndPosition.x; position.x += cellSize.x) {
        for (position.y = betweenBegPosition.y; position.y <= betweenEndPosition.y; position.y += cellSize.y) {
          cell = cells[position.toString()];

          if (!cell) { continue; }

          for (id in cell.objects) {
            objects[id] = cell.objects[id];
          }
        }
      }

      cacheObjects('between', cacheKey, objects);

      return objects;
    },

    hasObjectsOn = function hasObjectsOn(position) {
      var objects = getObjectsOn(position);

      return !!(objects && Object.keys(objects).length);
    },

    updateObject = function updateObject(object) {
      updateObjectCells(object);
    },

    updateObjects = function updateObjects(objects) {
      var
        i;

      for (i = 0; i < objects.length; i++) {
        updateObject(objects[i]);
      }
    },

    setMetaOn = function setMetaOn(position, key, value) {
      var cell = getOrCreateCellByPosition(position);

      cell.meta[key] = value;
    },

    getMetaOn = function getMetaOn(position, key) {
      var cell;

      position  = getCellBegPosition(position);
      cell      = cells[position.toString()];

      return cell && cell.meta[key];
    },


    inspect = function inspect() {
      return {
        'objects' : objects,
        'cells'   : cells
      };
    },

    init = function init(config) {
      size          = config.size.clone();
      cellSize      = config.cellSize.clone();
      cellHalfSize  = cellSize.multiply(0.5, true);
    };

  init(config);

  this.addObject                  = addObject;
  this.addObjects                 = addObjects;
  this.getObjectsOn               = getObjectsOn;
  this.getObjectsBetween          = getObjectsBetween;
  this.hasObjectsOn               = hasObjectsOn;
  this.updateObject               = updateObject;
  this.updateObjects              = updateObjects;
  this.setMetaOn                  = setMetaOn;
  this.getMetaOn                  = getMetaOn;
  this.inspect                    = inspect;

  return this;
};

module.exports = Grid2;
