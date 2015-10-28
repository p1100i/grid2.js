var
  Vec2     = require('vec2'),
  MyHelper = require('my-helper'),
  Grid2;

Grid2 = function Grid2(size, cellSize) {
  var
    // Container for private data.
    data = {
      ids_          : 1,
      objects_      : {},
      cells_        : {},
      objectCells_  : {},
      cache_        : { between : { dirty : 0, queries : {} } },
      dirty_        : 1,
      size_         : null,
      cellSize_     : null,
      cellHalfSize_ : null
    },

    unit    = new Vec2(1, 1),
    halfPI  = Math.PI / 2,

    // Inserted object keys.
    keys = {
      position  : 'position_',
      halfSize  : 'halfSize_',
      id        : 'id_'
    },

    Grid2Cell = function Grid2Cell(id, position) {
      this.id_          = id;
      this.begPosition_ = position.clone();
      this.center_      = this.begPosition_.add(data.cellHalfSize_, true);
      this.endPosition_ = this.begPosition_.add(data.cellSize_, true);
      this.objects_     = {};
      this.meta_        = {};
    },

    cache = function cache(type, key, objects) {
      data.cache_[type].dirty        = data.dirty_;
      data.cache_[type].queries[key] = objects;
    },

    getCached = function getCached(type, key) {
      if (data.cache_[type].dirty === data.dirty_ && data.cache_[type].queries[key]) {
        return data.cache_[type].queries[key];
      }
    },

    getCacheKey = function getCacheKey(begPosition, endPosition) {
      return begPosition.toString() + '_' + endPosition.toString();
    },

    checkObjectKeys = function checkObjectKeys(object, shouldBeAdded) {
      MyHelper.validateNumber(object[keys.id], keys.id);

      MyHelper.validateVec2(object[keys.position],  keys.position);
      MyHelper.validateVec2(object[keys.halfSize],  keys.halfSize);

      if (shouldBeAdded) {
        MyHelper.hasKey(data.objects_, object[keys.id], keys.id);
      } else {
        MyHelper.hasNoKey(data.objects_, object[keys.id], keys.id);
      }
    },

    dirty = function dirty(dirt) {
      if (dirt) { data.dirty_++; }
    },

    nextId = function nextId() {
      return data.ids_++;
    },

    getObjectCells = function getObjectCells(object) {
      if (!data.objectCells_[object[keys.id]]) {
        data.objectCells_[object[keys.id]] = {};
      }

      return data.objectCells_[object[keys.id]];
    },

    getOrCreateCellByCellPosition = function getOrCreateCellByCellPosition(position) {
      var key = position.toString();

      if (!data.cells_[key]) {
        data.cells_[key] = new Grid2Cell(key, position);
      }

      return data.cells_[key];
    },

    getOrCreateCellByPosition = function getOrCreateCellByPosition(position) {
      var key;

      position  = getCellBegPosition(position);
      key       = position.toString();

      if (!data.cells_[key]) {
        data.cells_[key] = new Grid2Cell(key, position);
      }

      return data.cells_[key];
    },

    getOrCreateCellsByObject = function getOrCreateCellsByObject(object) {
      var
        key,
        position,
        cells             = {},
        objectBegPosition = object[keys.position].subtract(object[keys.halfSize], true),
        objectEndPosition = object[keys.position].add(object[keys.halfSize], true).subtract(unit),
        cellBegPosition   = getCellBegPosition(objectBegPosition),
        cellEndPosition   = getCellBegPosition(objectEndPosition);

      // As the lower/right side of a cell is considered as the beginning of the neighbour cell
      // we need to subtract one unit from the end position of the object, otherwise it will be registered
      // twice, see how objectEndPosition is calculated.
      // +) Not sure if this is the right way, but in my game use case, it is.

      for (position = cellBegPosition.clone(); position.x <= cellEndPosition.x; position.x += data.cellSize_.x) {
        for (position.y = cellBegPosition.y; position.y <= cellEndPosition.y; position.y += data.cellSize_.y) {
          key = position.toString();
          if (!data.cells_[key]) {
            cells[key] = data.cells_[key] = new Grid2Cell(key, position);
          } else {
            cells[key] = data.cells_[key];
          }
        }
      }

      return cells;
    },

    getCellBegPosition = function getCellBegPosition(position) {
      return new Vec2(
        Math.floor(position.x / data.cellSize_.x) * data.cellSize_.x,
        Math.floor(position.y / data.cellSize_.y) * data.cellSize_.y
      );
    },

    propagateCallbackOnGrid = function propagateCallbackOnGrid(cell, diff, cb, cbMemory) {
      if (cbMemory[cell.id_]) { return; }

      cbMemory[cell.id_] = true;

      if (!cb.call(cbMemory.cbThis, cbMemory.cbConfig, cell.center_)) { return; }

      var nextCell,
          nextCellPosition  = cell.begPosition_.add(diff, true),
          rotatedDiff       = diff.rotate(halfPI, false, true);

      // Use the given direction differnce and recall the function.
      nextCell = getOrCreateCellByCellPosition(nextCellPosition);
      propagateCallbackOnGrid(nextCell, diff.clone(), cb, cbMemory);

      // Call to its neighbours too.
      nextCell = getOrCreateCellByCellPosition(nextCellPosition.add(rotatedDiff, true));
      propagateCallbackOnGrid(nextCell, diff.clone(), cb, cbMemory);

      nextCell = getOrCreateCellByCellPosition(nextCellPosition.subtract(rotatedDiff, true));
      propagateCallbackOnGrid(nextCell, diff.clone(), cb, cbMemory);
    },

    setSize = function setSize(size) {
      MyHelper.validateVec2(size);

      data.size_ = new Vec2(size.x, size.y);
    },

    setCellSize = function setCellSize(cellSize) {
      MyHelper.validateVec2(cellSize);

      data.cellSize_      = new Vec2(cellSize.x, cellSize.y);
      data.cellHalfSize_  = data.cellSize_.multiply(0.5, true);
    },

    setObjId = function setObjId(object) {
      if (!object[keys.id]) {
        object[keys.id] = nextId();
      }
    },

    updateObjectCells = function updateObjectCells(object) {
      var
        cell,
        cellId,
        dirt     = false,
        cells    = getObjectCells(object),
        newCells = getOrCreateCellsByObject(object);
      
      for (cellId in cells) {
        if (newCells[cellId]) {
          continue;
        }

        dirt  = true;
        cell  = cells[cellId];

        // Remove the object from the cell.
        delete cell.objects_[object[keys.id]];

        // Remove the cell from the objects-cell index.
        delete cells[cellId];
      }

      for (cellId in newCells) {
        if (cells[cellId]) {
          continue;
        }

        dirt                            = true;
        cell                            = newCells[cellId];
        cell.objects_[object[keys.id]]  = object;
        cells[cellId]                   = cell;
      }

      dirty(dirt);
    },

    /**
     * Public fns
     */

    addObject = function addObject(object) {
      setObjId(object);
      checkObjectKeys(object);
      updateObjectCells(object);
      data.objects_[object[keys.id]] = object;
    },

    addObjects = function addObjects(objects) {
      for (var i = 0; i < objects.length; i++) {
        addObject(objects[i]);
      }
    },

    debug = function debug(exposed, debugging) {
      if (exposed !== undefined) {
        data.exposed_   = !!exposed;
        data.debugging_ = !!debugging;

        // TODO
        // for (var fnName in priv) {
        //   this[fnName] = data.exposed_ ? priv[fnName] : undefined;
        // }

        this.data_ = data.exposed_ ? data : undefined;
      }

      return data.debugging_;
    },

    getMetaOn = function getMetaOn(position, key) {
      MyHelper.validateVec2(position);

      var cell;

      position = getCellBegPosition(position);
      cell = data.cells_[position.toString()];

      return cell && cell.meta_[key];
    },

    getObjects = function getObjects() {
      return data.objects_;
    },

    getObjectsBetween = function getObjectsBetween(begPosition, endPosition) {
      MyHelper.validateVec2(begPosition);
      MyHelper.validateVec2(endPosition);

      var
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

      for (position = betweenBegPosition.clone(); position.x <= betweenEndPosition.x; position.x += data.cellSize_.x) {
        for (position.y = betweenBegPosition.y; position.y <= betweenEndPosition.y; position.y += data.cellSize_.y) {
          cell = data.cells_[position.toString()];

          if (!cell) { continue; }

          for (var id in cell.objects_) {
            objects[id] = cell.objects_[id];
          }
        }
      }

      cache('between', cacheKey, objects);

      return objects;
    },

    getObjectsOn = function getObjectsOn(position) {
        MyHelper.validateVec2(position);

        var cell;

        position = getCellBegPosition(position);
        cell = data.cells_[position.toString()];

        return cell && cell.objects_;
    },

    getCellSize = function getCellSize() {
      return data.cellSize_.clone();
    },

    getSize = function getSize() {
      return data.size_.clone();
    },

    hasObjectsOn = function hasObjectsOn(position) {
      var objects = getObjectsOn(position);

      return !!(objects && Object.keys(objects).length);
    },

    propagateCallbackFromPoint = function propagateCallbackFromPoint(position, cb, cbThis, cbConfig) {
      MyHelper.validateVec2(position);

      var
        cell          = getOrCreateCellByPosition(position),
        cbMemory      = { cbConfig : cbConfig, cbThis : cbThis };

      propagateCallbackOnGrid(cell, new Vec2( data.cellSize_.x, 0), cb, cbMemory);
      delete cbMemory[cell.id_];

      propagateCallbackOnGrid(cell, new Vec2(-data.cellSize_.x, 0), cb, cbMemory);
      delete cbMemory[cell.id_];

      propagateCallbackOnGrid(cell, new Vec2(0,  data.cellSize_.y), cb, cbMemory);
      delete cbMemory[cell.id_];

      propagateCallbackOnGrid(cell, new Vec2(0, -data.cellSize_.y), cb, cbMemory);
    },

    updateObject = function updateObject(object) {
      checkObjectKeys(object, true);
      updateObjectCells(object);
    },

    updateObjects = function updateObjects(objects) {
      for (var i = 0; i < objects.length; i++) {
        updateObject(objects[i]);
      }
    },

    setMetaOn = function setMetaOn(position, key, val) {
      MyHelper.validateVec2(position);

      var cell = getOrCreateCellByPosition(position);

      cell.meta_[key] = val;
    };

  setSize(size);
  setCellSize(cellSize);

  this.addObject                  = addObject;
  this.addObjects                 = addObjects;
  this.debug                      = debug;
  this.getMetaOn                  = getMetaOn;
  this.getObjects                 = getObjects;
  this.getObjectsBetween          = getObjectsBetween;
  this.getObjectsOn               = getObjectsOn;
  this.getCellSize                = getCellSize;
  this.getSize                    = getSize;
  this.hasObjectsOn               = hasObjectsOn;
  this.propagateCallbackFromPoint = propagateCallbackFromPoint;
  this.updateObject               = updateObject;
  this.updateObjects              = updateObjects;
  this.setMetaOn                  = setMetaOn;
};

module.exports = Grid2;
