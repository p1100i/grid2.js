var Grid2;

Grid2 = function Grid2() {
  var
    // Container for private data.
    data = {
    },

    // Private function definitions.
    privateFns = {
    },

    // Public function definitions
    publicFns = {
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
};

module.exports = Grid2;
