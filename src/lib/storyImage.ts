export interface StoryCardOptions {
  reference: string;
  version: string;
  text: string;
  themeTitle?: string;
}

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

  // 1. Fundo Gradiente Sagrado Profundo
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#060913");
  bgGrad.addColorStop(0.45, "#0d1527");
  bgGrad.addColorStop(0.75, "#090d1a");
  bgGrad.addColorStop(1, "#04060c");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Aura Dourada Radiante Central
  const radial = ctx.createRadialGradient(
    width / 2,
    height / 2 - 60,
    50,
    width / 2,
    height / 2 - 60,
    580
  );
  radial.addColorStop(0, "rgba(217, 163, 62, 0.22)");
  radial.addColorStop(0.4, "rgba(217, 163, 62, 0.08)");
  radial.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // 3. Moldura Dupla Dourada
  ctx.strokeStyle = "rgba(217, 163, 62, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 75, width - 110, height - 150);

  ctx.strokeStyle = "rgba(217, 163, 62, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(70, 90, width - 140, height - 180);

  // Pontos de canto decorativos
  const corners = [
    [55, 75],
    [width - 55, 75],
    [55, height - 75],
    [width - 55, height - 75],
  ];
  ctx.fillStyle = "#e5b869";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Cabeçalho Superior: Pomba da Paz + Logotipo
  ctx.font = "64px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🕊️", width / 2, 220);

  ctx.font = "bold 38px 'Cinzel', serif, Georgia";
  ctx.fillStyle = "#e5b869";
  ctx.fillText("PALAVRA VIVA", width / 2, 285);

  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(203, 213, 225, 0.75)";
  ctx.fillText(`BÍBLIA SAGRADA • VERSÃO ${version.toUpperCase()}`, width / 2, 325);

  // Linha divisória do topo com ornamento
  ctx.strokeStyle = "rgba(217, 163, 62, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 360);
  ctx.lineTo(width / 2 + 140, 360);
  ctx.stroke();

  // 5. Aspas decorativas clássicas
  ctx.font = "bold 180px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(217, 163, 62, 0.16)";
  ctx.fillText("“", width / 2, 540);

  // 6. Texto do Versículo com quebra de linha inteligente
  const cleanText = text.replace(/\[\d+\]/g, "").trim();
  const maxTextWidth = 840;

  // Ajuste dinâmico do tamanho da fonte de acordo com o tamanho do texto
  let fontSize = 52;
  if (cleanText.length > 200) fontSize = 44;
  if (cleanText.length > 350) fontSize = 38;
  if (cleanText.length > 550) fontSize = 32;

  ctx.font = `italic 400 ${fontSize}px 'Merriweather', Georgia, serif`;
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";

  const lineHeight = fontSize * 1.6;
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
  let startY = height / 2 - totalTextHeight / 2 + 20;
  if (startY < 580) startY = 580;

  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  // 7. Rodapé do Versículo: Linha divisória, Referência e Tema
  const afterTextY = startY + lines.length * lineHeight + 50;

  ctx.strokeStyle = "rgba(217, 163, 62, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 180, afterTextY);
  ctx.lineTo(width / 2 + 180, afterTextY);
  ctx.stroke();

  ctx.font = "bold 46px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#fcd34d";
  ctx.fillText(`— ${reference} —`, width / 2, afterTextY + 75);

  if (themeTitle) {
    ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Tema: ${themeTitle}`, width / 2, afterTextY + 125);
  }

  // 8. Rodapé Fixo (Link do Site & Chamada para Ação)
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(226, 232, 240, 0.75)";
  ctx.fillText("Encontre consolo e direção na Palavra de Deus", width / 2, height - 165);

  ctx.font = "bold 26px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#e5b869";
  ctx.fillText("palavra-viva.novo-dia.workers.dev", width / 2, height - 125);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Erro ao converter canvas em imagem"));
    }, "image/png");
  });
}

