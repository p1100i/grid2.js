var
  Vec2          = require('vec2'),
  MyHelper      = require('my-helper'),
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
      cellSize_     : null
    },

    unit = new Vec2(1, 1),

    // Inserted object keys.
    keys = {
      position  : 'position_',
      halfSize  : 'halfSize_',
      id        : 'id_'
    },

    Grid2Cell = function Grid2Cell(id, position) {
      this.id_          = id;
      this.begPosition_ = position.clone();
      this.endPosition_ = this.begPosition_.add(data.cellSize_, true);
      this.objects_     = {};
      this.meta_        = {};
    },

    // Private function definitions.
    privateFns = {
      cache : function cache(type, key, objects) {
        data.cache_[type].dirty        = data.dirty_;
        data.cache_[type].queries[key] = objects;
      },

      cached : function cached(type, key) {
        if (data.cache_[type].dirty === data.dirty_ && data.cache_[type].queries[key]) {
          return data.cache_[type].queries[key];
        }
      },

      cacheKey : function cacheKey(begPosition, endPosition) {
        return begPosition.toString() + '_' + endPosition.toString();
      },

      checkObjectKeys : function checkObjectKeys(object, shouldBeAdded) {
        MyHelper.validateNumber(object[keys.id], keys.id);

        MyHelper.validateVec2(object[keys.position],  keys.position);
        MyHelper.validateVec2(object[keys.halfSize],  keys.halfSize);

        if (shouldBeAdded) {
          MyHelper.hasKey(data.objects_, object[keys.id], keys.id);
        } else {
          MyHelper.hasNoKey(data.objects_, object[keys.id], keys.id);
        }
      },

      dirty : function dirty(dirt) {
        if (dirt) { data.dirty_++; }
      },

      nextId : function nextId() {
        return data.ids_++;
      },

      getObjectCells : function getObjectCells(object) {
        if (!data.objectCells_[object[keys.id]]) {
          data.objectCells_[object[keys.id]] = {};
        }

        return data.objectCells_[object[keys.id]];
      },

      getOrCreateCell : function getOrCreateCell(position) {
        var key;

        position  = privateFns.getCellBegPosition(position);
        key       = position.toString();

        if (!data.cells_[key]) {
          data.cells_[key] = new Grid2Cell(key, position);
        }

        return data.cells_[key];
      },

      getOrCreateCells : function getOrCreateCells(object) {
        var
          key,
          position,
          cells             = {},
          objectBegPosition = object[keys.position].subtract(object[keys.halfSize], true),
          objectEndPosition = object[keys.position].add(object[keys.halfSize], true).subtract(unit),
          cellBegPosition   = privateFns.getCellBegPosition(objectBegPosition),
          cellEndPosition   = privateFns.getCellBegPosition(objectEndPosition);

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

      getCellBegPosition : function getCellBegPosition(position) {
        return new Vec2(
          Math.floor(position.x / data.cellSize_.x) * data.cellSize_.x,
          Math.floor(position.y / data.cellSize_.y) * data.cellSize_.y
        );
      },

      setSize : function setSize(size) {
        MyHelper.validateVec2(size);
        data.size_ = new Vec2(size.x, size.y);
      },

      setCellSize : function setCellSize(cellSize) {
        MyHelper.validateVec2(cellSize);
        data.cellSize_ = new Vec2(cellSize.x, cellSize.y);
      },

      setObjId : function setObjId(object) {
        if (!object[keys.id]) {
          object[keys.id] = privateFns.nextId();
        }
      },

      updateObjectCells : function updateObjectCells(object) {
        var
          cell,
          cellId,
          dirt     = false,
          cells    = privateFns.getObjectCells(object),
          newCells = privateFns.getOrCreateCells(object);
        
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

        privateFns.dirty(dirt);
      }
    },

    // Public function definitions
    publicFns = {
      addObject : function addObject(object) {
        privateFns.setObjId(object);
        privateFns.checkObjectKeys(object);
        privateFns.updateObjectCells(object);
        data.objects_[object[keys.id]] = object;
      },

      addObjects : function addObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
          publicFns.addObject(objects[i]);
        }
      },

      debug : function debug(exposed, debugging) {
        if (exposed !== undefined) {
          data.exposed_   = !!exposed;
          data.debugging_ = !!debugging;

          for (var fnName in privateFns) {
            this[fnName] = data.exposed_ ? privateFns[fnName] : undefined;
          }

          this.data_ = data.exposed_ ? data : undefined;
        }

        return data.debugging_;
      },

      getMetaOn : function getMetaOn(position, key) {
          MyHelper.validateVec2(position);

          var cell;

          position = privateFns.getCellBegPosition(position);
          cell = data.cells_[position.toString()];

          return cell && cell.meta_[key];
      },

      getObjectsBetween : function getObjectsBetween(begPosition, endPosition) {
        MyHelper.validateVec2(begPosition);
        MyHelper.validateVec2(endPosition);

        var
          cell,
          position,
          objects             = {},
          betweenBegPosition  = privateFns.getCellBegPosition(begPosition),
          betweenEndPosition  = privateFns.getCellBegPosition(endPosition),
          cacheKey            = privateFns.cacheKey(betweenBegPosition, betweenEndPosition),
          cached              = privateFns.cached('between', cacheKey);

        if (cached) {
          return cached;
        }

        for (position = betweenBegPosition.clone(); position.x <= betweenBegPosition.x; position.x += data.cellSize_.x) {
          for (position.y = betweenBegPosition.y; position.y <= betweenEndPosition.y; position.y += data.cellSize_.y) {
            cell = data.cells_[position.toString()];

            if (!cell) { continue; }

            for (var id in cell.objects_) {
              objects[id] = cell.objects_[id];
            }
          }
        }

        privateFns.cache('between', cacheKey, objects);

        return objects;
      },

      getObjectsOn : function getObjectsOn(position) {
          MyHelper.validateVec2(position);

          var cell;

          position = privateFns.getCellBegPosition(position);
          cell = data.cells_[position.toString()];

          return cell && cell.objects_;
      },

      getCellSize: function getCellSize() {
        return data.cellSize_.clone();
      },

      getSize: function getSize() {
        return data.size_.clone();
      },

      hasObjectsOn : function hasObjectsOn(position) {
        var objects = publicFns.getObjectsOn(position);

        return !!(objects && Object.keys(objects).length);
      },

      updateObject : function updateObject(object) {
        privateFns.checkObjectKeys(object, true);
        privateFns.updateObjectCells(object);
      },

      updateObjects : function updateObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
          publicFns.updateObject(objects[i]);
        }
      },

      setMetaOn : function setMetaOn(position, key, val) {
        MyHelper.validateVec2(position);

        var cell = privateFns.getOrCreateCell(position);

        cell.meta_[key] = val;
      }
    };

  // Generate public functions.
  for (var id in publicFns) { this[id] = publicFns[id]; }

  privateFns.setSize(size);
  privateFns.setCellSize(cellSize);
};

module.exports = Grid2;
