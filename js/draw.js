const TOWER_COLOR = new Values('#666');
const LAYERS_COLORS = buildColorPalette(TOWER_NB_LAYERS);
const SELECTED_LAYER_COLOR = getRandomColor();

function getRandomColor() {
  var r = parseInt(Math.random() * 256);
  var g = parseInt(Math.random() * 256);
  var b = parseInt(Math.random() * 256);

  const color = new Values(`rgb(${r}, ${g}, ${b})`);

  return color;
}

function buildColorPalette(n) {
  const palette = [];
  const primaryColor = getRandomColor();

  palette.push(primaryColor);

  let darker = 0;

  for (let i = 1; i < n; i++) {
    darker += 100 / (n + 1);

    palette.push(primaryColor.shade(darker));
  }

  return palette;
}

function drawRect(ctx, rect, fill) {
  ctx.strokeStyle = '#00000099';
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

  ctx.fillStyle = `#${fill.hex}`;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height); 
}


function drawLayer(ctx, layer, i) {
  const rect = compute.layerRect(layer, i);
  let fill = null; 
  
  if (layer.selected) {
    fill = SELECTED_LAYER_COLOR;
  } else {
    fill = LAYERS_COLORS[layer.size - 1];
  }

  drawRect(ctx, rect, fill);
}

function drawTower(ctx, tower) {
  const baseTowerRect = compute.baseRect(tower);
  const poleTowerRect = compute.poleRect(tower);

  drawRect(ctx, baseTowerRect, TOWER_COLOR);
  drawRect(ctx, poleTowerRect, TOWER_COLOR);


  if (tower.layers.length > 0) {
    if (tower.layers[0].size < tower.layers[tower.layers.length - 1].size) {
      tower.layers.reverse();
    }

    for (let i = 0; i < tower.layers.length; i++) {
      drawLayer(ctx, tower.layers[i], i);
    }
  }
}

function drawAnnimatedLayer(ctx, layer, animation) {
  const rectAnimated = compute.animatedLayerRect(layer, animation);

  ctx.beginPath();
  ctx.lineWidth = '2';
  ctx.strokeStyle = '#00000099';
  ctx.fillStyle = `#${SELECTED_LAYER_COLOR.hex}`;
  ctx.rect(rectAnimated.x, rectAnimated.y, rectAnimated.width, rectAnimated.height);
  ctx.stroke();
  ctx.fill();
}
