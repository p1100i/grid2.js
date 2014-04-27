window.onload = function () {
  var app = {
    w_          : 500,
    h_          : 500,
    cellSize_   : 10,
    objects_    : {},
    gameOfLife_ : new window.Grid2(),
    $graphics_  : document.getElementById('app-graphics_'),

    colors_ : {
      selected  : 0xee2211,
      object    : 0xffffff
    }
  };

  app.update = function update() {
    app.renderer_.render(app.stage_);
  };

  app.redraw = function redraw() {
    app.graphics_.clear();
  };

  app.renderer_  = window.PIXI.autoDetectRenderer(app.w_, app.h_);
  app.stage_     = new window.PIXI.Stage();
  app.graphics_  = new window.PIXI.Graphics();

  app.start = function start() {
    app.$graphics_.appendChild(app.renderer_.view);
    app.renderer_.view.style.display = 'block';
    app.stage_.addChild(app.graphics_);
    setInterval(function(){ app.update(); }, 60);
  };

  app.start();
  app.redraw();
};
