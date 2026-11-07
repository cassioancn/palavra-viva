const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ---------------------------------------------------------------------
// 1. GERAÇÃO DO BANNER OPEN GRAPH (1200 x 630)
// ---------------------------------------------------------------------
function generateOgImage() {
  const width = 1200;
  const height = 630;
  const png = new PNG({ width, height });

  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;

      // Fundo Gradiente Radial Escuro de Santuário
      const dx = (x - cx) / width;
      const dy = (y - cy) / height;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base: #060913 -> #0d1527 -> #04060c
      let r = 7 + (1 - dist * 1.5) * 12;
      let g = 10 + (1 - dist * 1.5) * 16;
      let b = 22 + (1 - dist * 1.5) * 28;

      // Aura Radiante Dourada Central
      const haloDist = Math.sqrt((x - cx) * (x - cx) + (y - (cy - 30)) * (y - (cy - 30)));
      if (haloDist < 350) {
        const factor = Math.pow(1 - haloDist / 350, 2);
        r += factor * 160;
        g += factor * 110;
        b += factor * 25;
      }

      // Moldura Externa (x: 40..1160, y: 35..595)
      const isOuterBorder =
        ((x >= 40 && x <= 44) || (x >= 1156 && x <= 1160)) && (y >= 35 && y <= 595) ||
        ((y >= 35 && y <= 39) || (y >= 591 && y <= 595)) && (x >= 40 && x <= 1160);

      // Moldura Interna Delicada
      const isInnerBorder =
        ((x === 52 || x === 1148) && y >= 47 && y <= 583) ||
        ((y === 47 || y === 583) && x >= 52 && x <= 1148);

      if (isOuterBorder) {
        r = 180; g = 83; b = 9; // Bronze dourado
      } else if (isInnerBorder) {
        r = 217; g = 119; b = 6;
      }

      // 4 Cantos / Rosetas (raio 7px nos 4 cantos da moldura)
      const corners = [
        [42, 37], [1158, 37],
        [42, 593], [1158, 593]
      ];
      for (const [corX, corY] of corners) {
        const cDist = Math.hypot(x - corX, y - corY);
        if (cDist <= 6) {
          r = 245; g = 158; b = 11;
        } else if (cDist <= 9 && cDist >= 7.5) {
          r = 217; g = 119; b = 6;
        }
      }

      // -----------------------------------------------------------------
      // Cruz Sagrada Central Estilizada
      // Centro da cruz em: (cx = 600, cyCross = 285)
      // -----------------------------------------------------------------
      const cyCross = 285;

      // Haste Vertical: largura 22px, altura 170px (de cyCross-85 a cyCross+85)
      const inVert = (x >= cx - 11 && x <= cx + 11) && (y >= cyCross - 85 && y <= cyCross + 85);
      // Haste Horizontal: largura 120px, altura 22px (de cyCross-38 a cyCross-16)
      const inHoriz = (x >= cx - 60 && x <= cx + 60) && (y >= cyCross - 38 && y <= cyCross - 16);

      if (inVert || inHoriz) {
        // Gradiente vertical de ouro brilhante
        const crossYFactor = (y - (cyCross - 85)) / 170;
        r = Math.min(255, 251 - crossYFactor * 50);
        g = Math.min(255, 200 - crossYFactor * 70);
        b = Math.min(255, 60 - crossYFactor * 40);
      }

      // Ponto de luz no coração da cruz (cx, cyCross - 27)
      const glintDist = Math.hypot(x - cx, y - (cyCross - 27));
      if (glintDist <= 5) {
        r = 255; g = 255; b = 255;
      } else if (glintDist <= 12) {
        const gFactor = (12 - glintDist) / 7;
        r = Math.min(255, r + gFactor * 100);
        g = Math.min(255, g + gFactor * 100);
        b = Math.min(255, b + gFactor * 100);
      }

      // 4 Raios de Alvorecer (diagonais discretas a 45 graus)
      const rx = Math.abs(x - cx);
      const ry = Math.abs(y - (cyCross - 27));
      const rayDiff = Math.abs(rx - ry);
      const rayDist = Math.hypot(rx, ry);
      if (rayDiff <= 2 && rayDist >= 26 && rayDist <= 58) {
        r = Math.min(255, r + 90);
        g = Math.min(255, g + 65);
        b = Math.min(255, b + 15);
      }

      png.data[idx] = Math.min(255, Math.max(0, Math.round(r)));
      png.data[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      png.data[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      png.data[idx + 3] = 255;
    }
  }

  const outPath = path.join(publicDir, 'og-image.png');
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log('✓ Gerado:', outPath);
}

// ---------------------------------------------------------------------
// 2. GERAÇÃO DO ÍCONE APPLE TOUCH (180 x 180)
// ---------------------------------------------------------------------
function generateAppleIcon() {
  const size = 180;
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Fundo escuro com cantos arredondados (squircle)
      // Distância do centro para cantos arredondados raio 40px
      const inSquircle = (x >= 8 && x <= size - 8 && y >= 8 && y <= size - 8);

      let r = 9;
      let g = 13;
      let b = 26;

      // Halo dourado central
      const dist = Math.hypot(x - cx, y - (cy - 6));
      if (dist <= 70) {
        const factor = (70 - dist) / 70;
        r += factor * 80;
        g += factor * 55;
        b += factor * 10;
      }

      // Cruz
      const cyCross = cy + 4;
      const inVert = (x >= cx - 6 && x <= cx + 6) && (y >= cyCross - 48 && y <= cyCross + 48);
      const inHoriz = (x >= cx - 34 && x <= cx + 34) && (y >= cyCross - 24 && y <= cyCross - 12);

      if (inVert || inHoriz) {
        const yF = (y - (cyCross - 48)) / 96;
        r = 251 - yF * 45;
        g = 191 - yF * 65;
        b = 36 - yF * 20;
      }

      // Ponto de luz no centro da cruz
      const gDist = Math.hypot(x - cx, y - (cyCross - 18));
      if (gDist <= 3) {
        r = 255; g = 255; b = 255;
      }

      png.data[idx] = Math.min(255, Math.max(0, Math.round(r)));
      png.data[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      png.data[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      png.data[idx + 3] = inSquircle ? 255 : 0;
    }
  }

  const outPath = path.join(publicDir, 'apple-icon.png');
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log('✓ Gerado:', outPath);
}

generateOgImage();
generateAppleIcon();
