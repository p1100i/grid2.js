var
  Vec2     = require('vec2'),
  MyHelper = require('my-helper'),
  Grid2;

Grid2 = function Grid2(size) {
  var
    // Container for private data.
    data = {
      objects_  : {},
      ids_      : 1
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
      nextId : function nextId() {
        return data.ids_++;
      },

      setSize : function setSize(size) {
        MyHelper.isVec2(size);
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
      addObject : function addObject(object) {
        privateFns.setObjId(object);
        data.objects_[object[keys.id]] = object;
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
