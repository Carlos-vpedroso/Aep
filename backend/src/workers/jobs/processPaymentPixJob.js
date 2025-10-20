const adicionarAssociadoNaListaWorker = require("../../utils/adicionarAssociadoNaListaWorker");
const { PagamentosViewModel } = require("../../view/managerView");
const IORedis = require("ioredis");

// Cria um publisher Redis
const publisher = new IORedis(process.env.REDIS_URL);

const processPaymentPixJob = async (job) => {
  const { pagamentoId, txid } = job.data;
  console.log("🚀 Processando job:", job.id, txid);

  const pagamento = await PagamentosViewModel.findByPk(pagamentoId);
  if (!pagamento)
    return console.warn("⚠️ Pagamento não encontrado:", pagamentoId);

  let { idAssociado, metadata } = pagamento;

  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata);
    } catch (err) {
      console.error("❌ Erro ao converter metadata JSON:", err);
      metadata = {};
    }
  }

  const { cidade, turno, embarque, desembarque } = metadata || {};

  try {
    const resultado = await adicionarAssociadoNaListaWorker({
      idAssociado,
      cidade,
      turno,
      embarque,
      desembarque,
    });

    // ✅ Publica evento no Redis (o servidor vai emitir para o frontend)
    const mensagem = {
      userId: idAssociado,
      evento: "pagamento_processado",
      payload: {
        txid,
        valor: pagamento.valor,
        cidade,
        turno,
        embarque,
        desembarque,
        mensagem: "✅ Pagamento confirmado e associado adicionado à lista!",
        lista: resultado.lista,
        registro: resultado.registro,
      },
    };

    await publisher.publish("frontend_notifications", JSON.stringify(mensagem));
    console.log(`📨 Publicado evento para user_${idAssociado}`);
  } catch (error) {
    console.error("❌ Erro ao adicionar associado via worker:", error);
    throw error;
  }
};

module.exports = processPaymentPixJob;
