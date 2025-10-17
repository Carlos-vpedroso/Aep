require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
});

const { sequelize } = require("../../database/index");
const { Worker } = require("bullmq");
const redis = require("../../config/redis");
const { PagamentosViewModel } = require("../../view/managerView");
const adicionarAssociadoNaListaWorker = require("../../services/adicionarAssociadoNaListaWorker");
const { notificarFrontend } = require("../../utils/socket");

// Conecta ao banco
sequelize
  .authenticate()
  .then(() => console.log("✅ Banco conectado com sucesso (Worker)"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco (Worker):", err));

const worker = new Worker(
  "paymentQueue",
  async (job) => {
    const { pagamentoId, txid } = job.data;
    console.log("🚀 Processando job:", job.id, txid);

    // Busca o pagamento
    const pagamento = await PagamentosViewModel.findByPk(pagamentoId);
    if (!pagamento) return console.warn("⚠️ Pagamento não encontrado:", pagamentoId);

    let { idAssociado, metadata } = pagamento;

    // Converte metadata se necessário
    if (typeof metadata === "string") {
      try {
        metadata = JSON.parse(metadata);
      } catch (err) {
        console.error("❌ Erro ao converter metadata JSON:", err);
        metadata = {};
      }
    }

    const { cidade, turno, embarque, desembarque } = metadata || {};

    // Adiciona associado na lista
    try {
      const resultado = await adicionarAssociadoNaListaWorker({
        idAssociado,
        cidade,
        turno,
        embarque,
        desembarque,
      });

      // ✅ Notifica o frontend via servidor Socket.IO
      notificarFrontend(idAssociado, "pagamento_processado", {
        txid,
        valor: pagamento.valor,
        cidade,
        turno,
        embarque,
        desembarque,
        mensagem: "✅ Pagamento confirmado e associado adicionado à lista!",
        lista: resultado.lista,
        registro: resultado.registro,
      });
    } catch (error) {
      console.error("❌ Erro ao adicionar associado via worker:", error);
      throw error;
    }
  },
  { connection: redis }
);

// Eventos do worker
worker.on("completed", (job) => console.log("✅ Job concluído:", job.id));
worker.on("failed", (job, err) => console.error("❌ Job falhou:", job.id, err));
