var Grid2Quadrant = function Grid2Quadrant(id, position, size) {
  this.id_      = id;
  this.posBeg_  = position;
  this.posEnd_  = position.add(size, true);
  this.objects_ = {};
};

module.exports = Grid2Quadrant;
