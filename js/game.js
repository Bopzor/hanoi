function Game(root) {
  this.canvas = document.getElementById('canvas');
  this.ctx = this.canvas.getContext("2d");

  this.towers = [];

  this.layerSelected = null;

  this.animation = {
    animated: false,
    fromTower: null,
    toTower: null,
    step: 0,
  };

  Game.prototype.initialize = function() {
    setDimensions(this.canvas.width, this.canvas.height);

    this.canvas.addEventListener('click', this.onClick.bind(this))

    this.ctx.strokeStyle = '#00000099';

    var tower1 = new Tower(0);
    var tower2 = new Tower(1);
    var tower3 = new Tower(2);

    this.towers.push(tower1, tower2, tower3);

    var startTower = parseInt(Math.random() * this.towers.length);
    this.towers[startTower].fill(TOWER_NB_LAYERS);

    this.redraw();
  }

  Game.prototype.redraw = function() { 
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.animation.animated && this.layerSelected !== null) {
      drawAnnimatedLayer(this.ctx, this.layerSelected, this.animation);
    }

    for (let i = 0; i < this.towers.length; i++) {
      drawTower(this.ctx, this.towers[i]);
    }
  }

  Game.prototype.onClick = function(e) {
    const tower = this.getTowerAt(e.offsetX, e.offsetY);
    const layer = this.getLayerAt(e.offsetX, e.offsetY);

    if (this.canSelectLayer(layer)) {
      layer.selected = true;
      this.layerSelected = layer;

    } else if (layer === this.layerSelected && this.layerSelected !== null) {
      this.layerSelected.selected = false;
      this.layerSelected = null;

    } else {
      
      if (this.canSelectTower(tower)){
        this.layerSelected.tower.popLayer();

        this.animate(this.layerSelected.tower, tower);

      }
    }
      this.redraw();
  }

  Game.prototype.getLayerAt = function(x, y) {
    var layer = null
    const p = {x: x, y: y};

    for (let i = 0; i < this.towers.length; i++) {
      if (this.towers[i].layers.length > 0) {

        for (let j = 0; j < this.towers[i].layers.length; j++) {
          const currentLayer = this.towers[i].layers[j];
          const rect = compute.layerRect(currentLayer, j)
          
          if (compute.inBounds(p, rect)) {
            layer = this.towers[i].layers[j];
          }
        }
      }
    }

    return layer;
  }

  Game.prototype.canSelectLayer = function(layer) {
    if (this.layerSelected === null && layer !== null ) {
      if (layer === layer.tower.layers[layer.tower.layers.length - 1]) {
        return true;
      }    
    }

    return false;
  }

  Game.prototype.canSelectTower = function(tower) {
    if (this.layerSelected === null) {
      return false

    } else if (tower !== null && (tower.layers.length === 0 || (tower.layers[tower.layers.length - 1].size > this.layerSelected.size))) {
      return true;
      
    } else {
      return false;
    }
  }

  Game.prototype.getTowerAt = function(x, y) {
    var tower = null;
    const p = {x: x, y: y};

    for (let i = 0; i < this.towers.length; i++) {
      const currentTower = compute.towerRect(this.towers[i]);

      if (compute.inBounds(p, currentTower)) {
        tower = this.towers[i];
      } 
    }

    return tower;
  }

  Game.prototype.endAnimate = function() {
    this.animation.toTower.addLayer(this.layerSelected);

    this.layerSelected.selected = false;
    this.layerSelected = null;

    this.animation.animated = false;
    this.animation.fromTower = null;
    this.animation.toTower = null;
    this.animation.step = 0;

    this.redraw();
  }

  Game.prototype.animate = function(fromTower, toTower) {
    this.animation.animated = true;
    this.animation.fromTower = fromTower;
    this.animation.toTower = toTower;
    this.animation.step = 0;

    function frame() {
      this.redraw();
      this.animation.step += ANIMATION_SPEED / 100;

      if (this.animation.step < 1) {
        requestAnimationFrame(frame.bind(this));

      } else {
        this.endAnimate();
      }
    }

    requestAnimationFrame(frame.bind(this));
  }

  this.initialize();
}

function Layer(tower, size) {
  this.tower = tower;
  this.size = size;
  this.selected = false;
}

function Tower(position) {
  this.position = position;
  this.layers = [];

  Tower.prototype.addLayer = function(layer) {
    layer.tower = this;
    this.layers.push(layer);
  }

  Tower.prototype.popLayer = function(layer) {
    if (this.layers.length === 0) {
      return null;
    } else {
      this.layers.pop();
    }
  }

  Tower.prototype.fill = function(n) {
    for (let i = 0; i < TOWER_NB_LAYERS; ++i) {
      const layer = {
        size: i + 1,
        selected: false,
        tower: this,
      };

      this.addLayer(layer);
    }
  }
}
