export interface StoryCardOptions {
  reference: string;
  version: string;
  text: string;
  themeTitle?: string;
}

/**
 * Desenha um retângulo com cantos arredondados com total compatibilidade.
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Gera um card em alta definição (1080x1920 - 9:16) para Instagram Stories.
 * Design leve, luminoso, alegre, acolhedor e cheio de esperança (alvorecer e paz celestial).
 */
export async function generateVerseStoryImage({
  reference,
  version,
  text,
  themeTitle,
}: StoryCardOptions): Promise<Blob> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context não disponível");

  // 1. Fundo Claro, Alegre e Luminoso (Alvorecer Celestial / Pergaminho de Luz)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#FFFDF9");    // Marfim puro celestial
  bgGrad.addColorStop(0.25, "#FAF3E3"); // Alvorecer dourado suave
  bgGrad.addColorStop(0.55, "#F7EEDC"); // Pergaminho aconchegante
  bgGrad.addColorStop(0.85, "#F3E5CE"); // Ouro suave alaranjado
  bgGrad.addColorStop(1, "#EDE0C8");    // Areia nobre e calorosa
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Aura Radiante de Esperança no Topo/Centro (Luz Matinal Divina)
  const radialSunburst = ctx.createRadialGradient(
    width / 2,
    360,
    30,
    width / 2,
    360,
    720
  );
  radialSunburst.addColorStop(0, "rgba(245, 158, 11, 0.22)");  // Dourado sol nascente
  radialSunburst.addColorStop(0.35, "rgba(251, 191, 36, 0.12)");
  radialSunburst.addColorStop(0.7, "rgba(254, 243, 199, 0.05)");
  radialSunburst.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = radialSunburst;
  ctx.fillRect(0, 0, width, height);

  // 3. Moldura Dupla Nobre em Ouro Quente
  ctx.strokeStyle = "rgba(180, 83, 9, 0.40)"; // Bronze dourado nobre
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 75, width - 110, height - 150);

  ctx.strokeStyle = "rgba(217, 119, 6, 0.22)"; // Filete interno delicado
  ctx.lineWidth = 1.5;
  ctx.strokeRect(70, 90, width - 140, height - 180);

  // Ornamentos nos 4 Cantos (Rosetas douradas)
  const corners = [
    [55, 75],
    [width - 55, 75],
    [55, height - 75],
    [width - 55, height - 75],
  ];
  ctx.fillStyle = "#b45309";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pequeno anel concêntrico para acabamento nobre
    ctx.strokeStyle = "rgba(217, 119, 6, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 4. Cabeçalho Superior: Logotipo da Cruz Sagrada Luminosa
  const crossCenterX = width / 2;
  const crossCenterY = 205;

  // Aura suave atrás da Cruz
  const crossGlow = ctx.createRadialGradient(
    crossCenterX,
    crossCenterY,
    5,
    crossCenterX,
    crossCenterY,
    85
  );
  crossGlow.addColorStop(0, "rgba(245, 158, 11, 0.35)");
  crossGlow.addColorStop(0.5, "rgba(251, 191, 36, 0.15)");
  crossGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = crossGlow;
  ctx.beginPath();
  ctx.arc(crossCenterX, crossCenterY, 85, 0, Math.PI * 2);
  ctx.fill();

  // Raios diagonais de alvorecer e esperança
  ctx.strokeStyle = "rgba(180, 83, 9, 0.35)";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";

  const rayDistanceInner = 28;
  const rayDistanceOuter = 46;
  const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  angles.forEach((angle) => {
    const x1 = crossCenterX + Math.cos(angle) * rayDistanceInner;
    const y1 = crossCenterY + Math.sin(angle) * rayDistanceInner;
    const x2 = crossCenterX + Math.cos(angle) * rayDistanceOuter;
    const y2 = crossCenterY + Math.sin(angle) * rayDistanceOuter;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Cruz Estilizada com Gradiente Dourado Nobre
  const crossGrad = ctx.createLinearGradient(0, crossCenterY - 55, 0, crossCenterY + 60);
  crossGrad.addColorStop(0, "#d97706");
  crossGrad.addColorStop(0.4, "#f59e0b");
  crossGrad.addColorStop(1, "#b45309");
  ctx.fillStyle = crossGrad;

  // Haste Vertical da Cruz
  drawRoundRect(ctx, crossCenterX - 6, crossCenterY - 50, 12, 105, 6);
  // Haste Horizontal da Cruz
  drawRoundRect(ctx, crossCenterX - 42, crossCenterY - 22, 84, 12, 6);

  // Ponto de luz no centro da Cruz
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(crossCenterX, crossCenterY - 16, 3, 0, Math.PI * 2);
  ctx.fill();

  // Nome do Projeto
  ctx.font = "bold 38px 'Cinzel', serif, Georgia";
  ctx.fillStyle = "#78350f"; // Tom mogno/bronze rico com contraste perfeito
  ctx.textAlign = "center";
  ctx.fillText("PALAVRA VIVA", width / 2, 310);

  // Subtítulo
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#475569"; // Ardósia refinada
  ctx.fillText(`BÍBLIA SAGRADA • VERSÃO ${version.toUpperCase()}`, width / 2, 348);

  // Linha divisória superior com ornamento losango
  ctx.strokeStyle = "rgba(180, 83, 9, 0.35)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 150, 385);
  ctx.lineTo(width / 2 + 150, 385);
  ctx.stroke();

  // Losango no centro da linha divisória
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.moveTo(width / 2, 385 - 5);
  ctx.lineTo(width / 2 + 5, 385);
  ctx.lineTo(width / 2, 385 + 5);
  ctx.lineTo(width / 2 - 5, 385);
  ctx.closePath();
  ctx.fill();

  // 5. Aspas decorativas clássicas de inspiração poética
  ctx.font = "bold 180px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(217, 119, 6, 0.16)";
  ctx.fillText("“", width / 2, 535);

  // 6. Texto do Versículo com quebra de linha inteligente e altíssimo contraste
  const cleanText = text.replace(/\[\d+\]/g, "").trim();
  const maxTextWidth = 840;

  // Ajuste proporcional e elegante da fonte
  let fontSize = 52;
  if (cleanText.length > 180) fontSize = 46;
  if (cleanText.length > 320) fontSize = 40;
  if (cleanText.length > 500) fontSize = 34;
  if (cleanText.length > 700) fontSize = 30;

  ctx.font = `italic 400 ${fontSize}px 'Merriweather', Georgia, serif`;
  ctx.fillStyle = "#1c1917"; // Preto café/carvão aconchegante (legibilidade máxima AAA)
  ctx.textAlign = "center";

  const lineHeight = fontSize * 1.62;
  const words = cleanText.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const totalTextHeight = lines.length * lineHeight;
  let startY = height / 2 - totalTextHeight / 2 + 30;
  if (startY < 575) startY = 575;

  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  // 7. Rodapé do Versículo: Linha divisória, Referência e Tema
  const afterTextY = startY + lines.length * lineHeight + 50;

  ctx.strokeStyle = "rgba(180, 83, 9, 0.35)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 190, afterTextY);
  ctx.lineTo(width / 2 + 190, afterTextY);
  ctx.stroke();

  // Losango inferior
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.moveTo(width / 2, afterTextY - 5);
  ctx.lineTo(width / 2 + 5, afterTextY);
  ctx.lineTo(width / 2, afterTextY + 5);
  ctx.lineTo(width / 2 - 5, afterTextY);
  ctx.closePath();
  ctx.fill();

  ctx.font = "bold 46px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#92400e"; // Ouro bronze profundo
  ctx.fillText(`— ${reference} —`, width / 2, afterTextY + 75);

  if (themeTitle) {
    ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(`Tema: ${themeTitle}`, width / 2, afterTextY + 125);
  }

  // 8. Rodapé Fixo (Link do Site & Chamada para Ação)
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Encontre consolo e direção na Palavra de Deus", width / 2, height - 165);

  ctx.font = "bold 26px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#92400e";
  ctx.fillText("PALAVRA VIVA • BÍBLIA SAGRADA", width / 2, height - 125);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Erro ao converter canvas em imagem"));
    }, "image/png");
  });
}
