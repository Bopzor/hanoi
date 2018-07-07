const TOWER_COLOR = new Values('#666');
const LAYERS_COLORS = buildColorPalette(TOWER_NB_LAYERS);
const SELECTED_LAYER_COLOR = getRandomColor();

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

  let darker = 0;

  for (let i = 1; i < n; i++) {
    darker += 100 / n;

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
