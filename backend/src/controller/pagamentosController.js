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

function formatCPF(cpf) {
  // Remove qualquer caractere que não seja número
  return cpf.replace(/\D/g, "");
}

// Função auxiliar para extrair metadata corretamente
function parseMetadata(metadata) {
  if (typeof metadata === "string") {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }
  return metadata || {};
}

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
    console.log("✅ Token obtido com sucesso!", data.accessToken);
    return data.accessToken;
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
    const token = await getToken();
    const hoje = new Date();
    const hojeFormatado = hoje.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    const { idAssociado } = req.params;
    const { nome, cpf, cidade, turno, embarque, desembarque } = req.body;
    const newCpf = formatCPF(cpf);

    // Primeiro, verifica se já existe uma cobrança válida para o mesmo turno
    // Busca todos os pagamentos pendentes do associado
    const pagamentosPendentes = await PagamentosViewModel.findAll({
      where: {
        idAssociado,
        tipo: "Pix",
        status: "Pendente",
      },
    });

    // Função para tratar metadata
    function parseMetadata(metadata) {
      if (typeof metadata === "string") {
        try {
          return JSON.parse(metadata);
        } catch {
          return {};
        }
      }
      return metadata || {};
    }

    // Verifica se existe algum pagamento pendente com o mesmo turno
    const pagamentoMesmoTurno = pagamentosPendentes.find((p) => {
      const meta = parseMetadata(p.metadata);
      return meta.turno === turno;
    });

    if (pagamentoMesmoTurno) {
      const validade = new Date(
        pagamentoMesmoTurno.createdAt.getTime() + 3600 * 1000
      );
      if (new Date() < validade) {
        return res.status(200).json({
          pagamento: pagamentoMesmoTurno,
          qr_code_base64: await gerarQrCodePix(pagamentoMesmoTurno.qr_code),
          mensagem: "Você já possui uma cobrança PIX válida para este turno",
        });
      }
    }

    // Endpoint sandbox oficial
    const url = "https://sandbox.sicoob.com.br/sicoob/sandbox/pix/api/v2/cob";

    const body = {
      calendario: { expiracao: 3600 },
      devedor: { nome, cpf: newCpf },
      valor: { original: VALOR_DIARIA, modalidadeAlteracao: 0 },
      chave: CHAVE_PIX,
      solicitacaoPagador: `Diária Transporte - ${hojeFormatado}`,
      infoAdicionais: [
        {
          nome: "Trajeto",
          valor: `São Sebastião do Paraíso → ${cidade} - ${turno}`,
        },
        { nome: "Data", valor: hojeFormatado },
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
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao criar cobrança PIX: ${error}`);
    }

    const data = await response.json();
    const qrCodeBase64 = await gerarQrCodePix(data.brcode);

    // Cria a nova cobrança
    const pagamento = await PagamentosViewModel.create({
      idAssociado,
      tipo: "Pix",
      referencia: `Diária-${hojeFormatado}`,
      valor: data.valor.original,
      status: "Pendente",
      txid: data.txid,
      qr_code: data.brcode,
      metadata: { cidade, turno, embarque, desembarque },
    });

    console.log("✅ Cobrança PIX criada e salva no banco com sucesso!");

    return res.status(201).json({ pagamento, qr_code_base64: qrCodeBase64 });
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
      const { txid, horario } = pagamentoPix;

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
