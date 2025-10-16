const https = require("https");
const fs = require("fs");
const { VALOR_DIARIA, CHAVE_PIX } = require("../config/constants");
const { PagamentosViewModel } = require("../view/managerView");
const gerarQrCodePix = require("../utils/gerarQrCodePix");
const paymentQueue = require("../queues/paymentQueue");

// Caminho e senha do certificado (do .env)
const CERT_PATH = process.env.SICOOB_CERT_PATH;
const CERT_PASSWORD = process.env.SICOOB_CERT_PASSWORD;

// Cria o agente HTTPS com o certificado
// const httpsAgent = new https.Agent({
//   pfx: fs.readFileSync(CERT_PATH),
//   passphrase: CERT_PASSWORD,
//   rejectUnauthorized: false, // use true em produção!
// });

// Função para pegar o token do Sicoob
async function getToken() {
  //const url = "https://sandbox.sicoob.com.br/auth/realms/cooperado/protocol/openid-connect/token";
  const url = "http://localhost:5556/api/get-token-simulacao";
  // Monta o corpo no formato x-www-form-urlencoded
  //   const body = new URLSearchParams({
  //     grant_type: "client_credentials",
  //     client_id: process.env.SICOOB_CLIENT_ID,
  //     client_secret: process.env.SICOOB_CLIENT_SECRET,
  //   });

  try {
    const response = await fetch(url, {
      //   method: "POST",
      method: "GET",
      //   body,
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   agent: httpsAgent, // importante: inclui o certificado
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro na autenticação: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Token obtido com sucesso!", data.access_token);
    return data.access_token;
  } catch (err) {
    console.error("❌ Erro ao obter token Sicoob:", err.message);
    throw err;
  }
}

async function tokenSimulacao(req, res) {
  const newToken = "1301865f-c6bc-38f3-9f49-666dbcfc59c3"; //essa string é o accessToken do Sandbox apenas para teste.
  const data = { accessToken: newToken };
  return res.status(200).json(data);
}

// 🔹 Função para criar cobrança PIX diária
async function criarCobrancaPixDiaria(req, res) {
  try {
    const token = await getToken(); // obtém token (fake no sandbox)
    const hoje = new Date();
    const hojeFormatado = hoje.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }); // Ex: "16/10/2025 09:30:00"

    const { idAssociado } = req.params;
    const { nome, cpf, cidade, turno, embarque, desembarque } = req.body;

    // Endpoint sandbox oficial seria este:
    const url = "https://sandbox.sicoob.com.br/sicoob/sandbox/pix/api/v2/cob";

    const body = {
      calendario: { expiracao: 3600 },
      devedor: { nome, cpf },
      valor: { original: VALOR_DIARIA, modalidadeAlteracao: 0 },
      chave: CHAVE_PIX,
      solicitacaoPagador: `Diária Transporte - ${hojeFormatado}`,
      infoAdicionais: [
        {
          nome: "Trajeto",
          valor: `São Sebastião do Paraíso → ${cidade} - ${turno}`,
        },
        {
          nome: "Data",
          valor: hojeFormatado,
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        client_id: process.env.SICOOB_CLIENT_ID,
      },
      body: JSON.stringify(body),
      // agent: httpsAgent, // ativa apenas no ambiente real
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao criar cobrança PIX: ${error}`);
    }

    const data = await response.json();

    // gera a imagem QR base64
    const qrCodeBase64 = await gerarQrCodePix(data.brcode);

    // salva a cobrança no banco
    const pagamento = await PagamentosViewModel.create({
      idAssociado,
      tipo: "Pix",
      referencia: `Diária-${hojeFormatado}`,
      valor: data.valor.original,
      status: "Pendente",
      txid: data.txid,
      qr_code: data.brcode,
      metadata: {
        cidade,
        turno,
        embarque,
        desembarque,
      },
    });

    console.log("✅ Cobrança PIX criada e salva no banco com sucesso!");

    return res.status(201).json({
      pagamento,
      qr_code_base64: qrCodeBase64,
    });
  } catch (err) {
    console.error("❌ Erro ao criar cobrança PIX:", err.message);
    return res.status(500).json({ erro: err.message });
  }
}

async function receberWebhookPix(req, res) {
  try {
    const { pix } = req.body;

    if (!pix || pix.length === 0) {
      return res.status(400).json({ erro: "Nenhum pagamento recebido" });
    }

    for (const pagamentoPix of pix) {
      const { txid, valor, horario } = pagamentoPix;

      // Atualiza status do pagamento
      const [updated] = await PagamentosViewModel.update(
        { status: "Pago", dataPagamento: new Date(horario) },
        { where: { txid }, returning: true }
      );

      if (updated === 0) {
        console.warn(`Pagamento txid=${txid} não encontrado no banco`);
        continue; // pula para o próximo pagamento
      }

      console.log(`Pagamento txid=${txid} atualizado para Pago`);

      // ✅ Adiciona job na fila para processar a emissão da passagem
      const pagamento = await PagamentosViewModel.findOne({ where: { txid } });
      const job = await paymentQueue.add("processarPagamento", {
        pagamentoId: pagamento.id,
        txid,
        valor,
      });
      console.log("Job adicionado na fila:", job.id);
    }

    return res
      .status(200)
      .json({ mensagem: "Webhook processado e jobs adicionados na fila" });
  } catch (err) {
    console.error("Erro ao processar webhook PIX:", err);
    return res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  getToken,
  tokenSimulacao,
  criarCobrancaPixDiaria,
  receberWebhookPix,
};
