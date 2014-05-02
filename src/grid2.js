var
  Vec2          = require('vec2'),
  MyHelper      = require('my-helper'),
  Grid2;

Grid2 = function Grid2(size, quadrantSize) {
  var
    // Container for private data.
    data = {
      ids_              : 1,
      objects_          : {},
      quadrants_        : {},
      objectQuadrants_  : {},
      cache_            : { between : { dirty : 0, queries : {} } },
      dirty_            : 1,
      size_             : null,
      quadrantSize_     : null
    },

    // Inserted object keys.
    keys = {
      position  : 'position_',
      halfSize  : 'halfSize_',
      id        : 'id_'
    },

    Grid2Quadrant = function Grid2Quadrant(id, position) {
      this.id_          = id;
      this.begPosition_ = position.clone();
      this.endPosition_ = this.begPosition_.add(data.quadrantSize_, true);
      this.objects_ = {};
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

      checkObjectKeys : function checkObjectKeys(object) {
        MyHelper.validateNumber(object[keys.id], keys.id);

        MyHelper.validateVec2(object[keys.position],  keys.position);
        MyHelper.validateVec2(object[keys.halfSize],  keys.halfSize);

        MyHelper.hasNoKey(data.objects_, object[keys.id], keys.id);
      },

      dirty : function dirty(dirt) {
        if (dirt) { data.dirty_++; }
      },

      nextId : function nextId() {
        return data.ids_++;
      },

      getObjectQuadrants : function getObjectQuadrants(object) {
        if (!data.objectQuadrants_[object[keys.id]]) {
          data.objectQuadrants_[object[keys.id]] = {};
        }

        return data.objectQuadrants_[object[keys.id]];
      },

      getOrCreateQuadrants : function getOrCreateQuadrants(object) {
        var
          key,
          position,
          quadrants   = {},
          begPosition = privateFns.getQuadrantBegPosition(object[keys.position].subtract(object[keys.halfSize], true)),
          endPosition = privateFns.getQuadrantBegPosition(object[keys.position].add(object[keys.halfSize], true));

        for (position = begPosition.clone(); position.x <= endPosition.x; position.x += data.quadrantSize_.x) {
          for (position.y = begPosition.y; position.y <= endPosition.y; position.y += data.quadrantSize_.y) {
            key = position.toString();
            if (!data.quadrants_[key]) {
              quadrants[key] = data.quadrants_[key] = new Grid2Quadrant(key, position);
            } else {
              quadrants[key] = data.quadrants_[key];
            }
          }
        }

        return quadrants;
      },

      getQuadrantBegPosition : function getQuadrantBegPosition(position) {
        return new Vec2(
          Math.floor(position.x / data.quadrantSize_.x) * data.quadrantSize_.x,
          Math.floor(position.y / data.quadrantSize_.y) * data.quadrantSize_.y
        );
      },

      setSize : function setSize(size) {
        MyHelper.validateVec2(size);
        data.size_ = new Vec2(size.x, size.y);
      },

      setQuadrantSize : function setQuadrantSize(quadrantSize) {
        MyHelper.validateVec2(quadrantSize);
        data.quadrantSize_ = new Vec2(quadrantSize.x, quadrantSize.y);
      },

      setObjId : function setObjId(object) {
        if (!object[keys.id]) {
          object[keys.id] = privateFns.nextId();
        }
      },

      updateObjectQuadrants : function updateObjectQuadrants(object) {
        var
          quadrant,
          quadrantId,
          dirt         = false,
          quadrants    = privateFns.getObjectQuadrants(object),
          newQuadrants = privateFns.getOrCreateQuadrants(object);
        
        for (quadrantId in quadrants) {
          if (newQuadrants[quadrantId]) {
            continue;
          }

          dirt      = true;
          quadrant  = quadrants[quadrantId];

          // Remove the object from the quadrant.
          delete quadrant.objects_[object[keys.id]];

          // Remove the quadrant from the objects-quadrant index.
          delete quadrants[quadrantId];
        }

        for (quadrantId in newQuadrants) {
          if (quadrants[quadrantId]) {
            continue;
          }

          dirt      = true;
          quadrant  = newQuadrants[quadrantId];
          quadrant.objects_[object[keys.id]] = object;
          quadrants[quadrantId]              = quadrant;
        }

        privateFns.dirty(dirt);
      }
    },

    // Public function definitions
    publicFns = {
      addObject : function addObject(object) {
        privateFns.setObjId(object);
        privateFns.checkObjectKeys(object);
        privateFns.updateObjectQuadrants(object);
        data.objects_[object[keys.id]] = object;
      },

      addObjects : function addObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
          publicFns.addObject(objects[i]);
        }
      },

      updateObject : function updateObject(object) {
        privateFns.updateObjectQuadrants(object);
      },

      updateObjects : function updateObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
          publicFns.updateObject(objects[i]);
        }
      },

      hasObjectsOn : function hasObjectsOn(position) {
          MyHelper.validateVec2(position);

          var quadrant;

          position = privateFns.getQuadrantBegPosition(position);
          quadrant = data.quadrants_[position.toString()];

          return !!(quadrant && Object.keys(quadrant.objects_).length);
      },

      getObjectsBetween : function getObjectsBetween(begPosition, endPosition) {
        MyHelper.validateVec2(begPosition);
        MyHelper.validateVec2(endPosition);

        var
          quadrant,
          position,
          objects             = {},
          betweenBegPosition  = privateFns.getQuadrantBegPosition(begPosition),
          betweenEndPosition  = privateFns.getQuadrantBegPosition(endPosition),
          cacheKey            = privateFns.cacheKey(betweenBegPosition, betweenEndPosition),
          cached              = privateFns.cached('between', cacheKey);

        if (cached) {
          return cached;
        }

        for (position = betweenBegPosition.clone(); position.x <= betweenBegPosition.x; position.x += data.quadrantSize_.x) {
          for (position.y = betweenBegPosition.y; position.y <= betweenEndPosition.y; position.y += data.quadrantSize_.y) {
            quadrant = data.quadrants_[position.toString()];

            if (!quadrant) { continue; }

            for (var id in quadrant.objects_) {
              objects[id] = quadrant.objects_[id];
            }
          }
        }

        privateFns.cache('between', cacheKey, objects);

        return objects;
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
      }
    };

  // Generate public functions.
  for (var id in publicFns) { this[id] = publicFns[id]; }

  privateFns.setSize(size);
  privateFns.setQuadrantSize(quadrantSize);
};

module.exports = Grid2;
