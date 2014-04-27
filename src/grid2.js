var
  Vec2          = require('vec2'),
  MyHelper      = require('my-helper'),
  Grid2Quadrant = require('./grid2quadrant'),
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

      cacheKey : function cacheKey(posBeg, posEnd) {
        return posBeg.x + '_' + posBeg.y + '_' + posEnd.x + '_' + posEnd.y;
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
          quadrants = {},
          posBeg    = privateFns.getQuadrantBegPosition(object[keys.position].subtract(object[keys.halfSize], true)),
          posEnd    = privateFns.getQuadrantEndPosition(object[keys.position].add(object[keys.halfSize], true));
            
        for (var x = posBeg.x; x < posEnd.x; x += data.quadrantSize_.x) {
          for (var y = posBeg.y; y < posEnd.y; y += data.quadrantSize_.y) {
            key = x + '_' + y;
            if (!data.quadrants_[key]) {
              quadrants[key] = data.quadrants_[key] = new Grid2Quadrant(key, new Vec2(x, y), data.quadrantSize_);
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

      getQuadrantEndPosition : function getQuadrantEndPosition(position) {
        return privateFns.getQuadrantBegPosition(position).add(data.quadrantSize_);
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
          delete quadrant.objects_[object[keys.id]];
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

      getObjectsBetween : function getObjectsBetween(posBeg, posEnd) {
        MyHelper.validateVec2(posBeg);
        MyHelper.validateVec2(posEnd);

        var
          objects = {},
          quadrant,
          quadrantPosBeg = privateFns.getQuadrantBegPosition(posBeg),
          quadrantPosEnd = privateFns.getQuadrantEndPosition(posEnd),
          cacheKey       = privateFns.cacheKey(quadrantPosBeg, quadrantPosEnd),
          cached         = privateFns.cached('between', cacheKey);

        if (cached) {
          return cached;
        }

        for (var x = quadrantPosBeg.x; x < quadrantPosEnd.x; x += data.quadrantSize_.x) {
          for (var y = quadrantPosBeg.y; y < quadrantPosEnd.y; y += data.quadrantSize_.y) {
            quadrant = data.quadrants_[x + '_' + y];

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
