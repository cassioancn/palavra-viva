import QRCode from "qrcode";

/**
 * Calcula o checksum CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF).
 * Padrão oficial EMV / Banco Central do Brasil para BR Code.
 */
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatTag(id: string, value: string): string {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

/**
 * Gera a string oficial do Pix Estático no padrão BR Code do Banco Central.
 * Compatível com leitura de QR Code e função "Pix Copia e Cola" em qualquer app bancário.
 */
export function generatePixPayload(
  pixKey: string,
  merchantName: string = "Palavra Viva",
  merchantCity: string = "BRASIL"
): string {
  const cleanKey = pixKey.trim();
  // Remove acentos e limita aos tamanhos máximos permitidos pelo Bacen
  const cleanName = merchantName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 25);
  const cleanCity = merchantCity
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 15);

  const gui = formatTag("00", "br.gov.bcb.pix");
  const keyTag = formatTag("01", cleanKey);
  const merchantAccount = formatTag("26", gui + keyTag);

  const payload = [
    formatTag("00", "01"),
    merchantAccount,
    formatTag("52", "0000"), // Merchant Category Code
    formatTag("53", "986"),  // Moeda Real (BRL)
    formatTag("58", "BR"),   // País
    formatTag("59", cleanName),
    formatTag("60", cleanCity),
    formatTag("62", formatTag("05", "***")), // TxID aberto para doação livre
    "6304", // Tag do CRC
  ].join("");

  const checksum = crc16(payload);
  return payload + checksum;
}

/**
 * Converte o payload Pix em uma imagem QR Code DataURL para exibição imediata no modal.
 */
export async function generatePixQrCode(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: 320,
    margin: 1,
    color: {
      dark: "#0b0f19",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
}
