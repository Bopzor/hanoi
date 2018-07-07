const TOWER_COLOR = new Values('#666');
const LAYERS_COLORS = buildColorPalette(TOWER_NB_LAYERS);
const SELECTED_LAYER_COLOR = getRandomColor();

function createCanvas(root, width, height) {

  return root.innerHTML = `<canvas id="canvas" width=${width} height=${height}></canvas>`;

}

function getRandomColor() {
  const colorConstructor = [];

  let r = parseInt(Math.random() * 256);
  let g = parseInt(Math.random() * 256);
  let b = parseInt(Math.random() * 256);

  colorConstructor.push(r, g, b);

  for (let i = 0; i < colorConstructor.length; i++) {
    if (colorConstructor[i] < 16) {
      colorConstructor[i] = `0${colorConstructor[i].toString(16)}`;
    } else {
      colorConstructor[i] = colorConstructor[i].toString(16);
    }
  }

  const color = new Values(`#${colorConstructor[0]}${colorConstructor[1]}${colorConstructor[2]}`)

  return color;

}

function buildColorPalette(n) {
  const palette = [];
  const primaryColor = getRandomColor();

  palette.push(primaryColor);

  let darker = 100 / n;

  for (let i = 1; i < n; i++) {
    darker += 100 / n;

    palette.push(primaryColor.shade(darker));

  }

  return palette.reverse();
}

function drawRect(rect, fill) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = '#00000099';
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

  ctx.fillStyle = `#${fill.hex}`;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height); 
}


function drawLayer(layer, i) {
  const rect = compute.layerRect(layer, i);
  const fill = LAYERS_COLORS[i];

  drawRect(rect, fill);
}

function drawTower(tower) {
  const baseTowerRect = compute.baseRect(tower);
  const poleTowerRect = compute.poleRect(tower);

  drawRect(baseTowerRect, TOWER_COLOR);
  drawRect(poleTowerRect, TOWER_COLOR);


  if (tower.layers.length > 0) {
    if (tower.layers[0].size != TOWER_NB_LAYERS) {
      tower.layers.reverse();
    }

    for (let i = 0; i < tower.layers.length - 1; i++) {
      drawLayer(tower.layers[i], i);
    }    
  }
}

function drawAnnimatedLayer(layer, animation) {
  layer.tower = animation.toTower;

  function frame() {
    const rectAnimated = compute.animatedLayerRect(layer, animation);

    
    animation.step += 0.01;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTower(tower1);
    drawTower(tower);
    drawTower(tower2);

    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = '#00000099';
    ctx.fillStyle = `#${LAYERS_COLORS[TOWER_NB_LAYERS - layer.size].hex}`;
    ctx.rect(rectAnimated.x, rectAnimated.y, rectAnimated.width, rectAnimated.height);
    ctx.stroke();
    ctx.fill();

    if (animation.step < 1)
      requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

createCanvas(document.getElementById('game'), 620, 280);

setDimensions(canvas.width, canvas.height);


const tower = {
  position: 2,
  layers: [],
};

const tower1 = {
  position: 1,
  layers: [],
};

const tower2 = {
  position: 0,
  layers: [],
};

for (let i = 0; i < TOWER_NB_LAYERS; ++i)
  tower1.layers.push({ size: i + 1, selected: false, tower: tower1 });


var animation = {
  fromTower: tower1,
  toTower: tower2,
  step: 0,
};


drawTower(tower1);
drawTower(tower);
drawTower(tower2);


drawAnnimatedLayer(tower1.layers[TOWER_NB_LAYERS - 1], animation);

console.log(tower1);
