var
  Vec2     = require('vec2'),
  MyHelper = require('../../my-helper.js'),
  Grid2;

Grid2 = function Grid2(size) {
  var
    // Container for private data.
    data = {
      ids_              : 1,
      objects_          : {},
      quadrants_        : {},
      objectQuadrants_  : {}
    },

    // Inserted object keys.
    keys = {
      pos   : 'pos_',
      posX  : 'x',
      posY  : 'y',
      size  : 'size_',
      sizeX : 'x',
      sizeY : 'y',
      id    : 'id_'
    },

    // Private function definitions.
    privateFns = {
      gridKey : function gridKey(object) {
      },

      addObjectToGrid : function addObjectToGrid(object) {
      },

      checkObjectKeys : function checkObjectKeys(object) {
        MyHelper.validateNumber(object[keys.id], keys.id);
        MyHelper.validateVec2(object[keys.pos],  keys.pos);
        MyHelper.validateVec2(object[keys.size], keys.size);
        MyHelper.hasNoKey(data.objects_, object[keys.id], keys.id);
        //.byCallbackObject(object, constraints.k.necessary, keys);
      },

      nextId : function nextId() {
        return data.ids_++;
      },

      setSize : function setSize(size) {
        MyHelper.validateVec2(size);
        data.size_ = new Vec2(size.x, size.y);
      },

      setObjId : function setObjId(object) {
        if (!object[keys.id]) {
          object[keys.id] = privateFns.nextId();
        }
      }
    },

    // Public function definitions
    publicFns = {
      addObjects : function addObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
          publicFns.addObject(objects[i]);
        }
      },

      addObject : function addObject(object) {
        privateFns.setObjId(object);
        privateFns.checkObjectKeys(object);

        data.objects_[object[keys.id]] = object;
      },

      getObjectsBetween : function getObjectsBetween(beg, end) {
        MyHelper.validateVec2(beg);
        MyHelper.validateVec2(end);

        var object,
            result = {};

        for (var id in data.objects_) {
          object = data.objects_[id];

          if (MyHelper.isBoxIntersectingBox(beg, end, object[keys.pos], object[keys.pos].add(object[keys.size], true))) {
            result[id] = object;
          }
        }

        return result;
      },

      debug : function debug(val) {
        if (val !== undefined) {
          data.debug_ = !!val;

          for (var fnName in privateFns) {
            this[fnName] = data.debug_ ? privateFns[fnName] : undefined;
          }

          this.data_ = data.debug_ ? data : undefined;
        }

        return data.debug_;
      }
    };

  // Generate public functions.
  for (var id in publicFns) { this[id] = publicFns[id]; }

  privateFns.setSize(size);
};

module.exports = Grid2;
