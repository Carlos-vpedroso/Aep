const QRCode = require("qrcode");

/**
 * Gera QR Code em base64 a partir do brcode
 * @param {string} brcode - Código Pix EMV
 * @returns {Promise<string>} - Retorna o QR Code em Data URL (base64)
 */
async function gerarQrCodePix(brcode) {
  try {
    if (!brcode) throw new Error("BRCode não informado");

    // Gera a imagem QR Code em base64
    const qrCodeBase64 = await QRCode.toDataURL(brcode);

    return qrCodeBase64;
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err.message);
    throw err;
  }
}

module.exports = gerarQrCodePix;