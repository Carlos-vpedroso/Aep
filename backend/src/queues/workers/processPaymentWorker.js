require("dotenv").config({
  path: require("path").resolve(__dirname, "../../../.env"),
});

const { sequelize } = require("../../database/index");
const { Worker } = require("bullmq");
const redis = require("../../config/redis");
const { PagamentosViewModel } = require("../../view/managerView");
const adicionarAssociadoNaListaWorker = require("../../services/adicionarAssociadoNaListaWorker");
const IORedis = require("ioredis");

// Cria um publisher Redis
const publisher = new IORedis(process.env.REDIS_URL);

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

      await publisher.publish(
        "frontend_notifications",
        JSON.stringify(mensagem)
      );
      console.log(`📨 Publicado evento para user_${idAssociado}`);
    } catch (error) {
      console.error("❌ Erro ao adicionar associado via worker:", error);
      throw error;
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => console.log("✅ Job concluído:", job.id));
worker.on("failed", (job, err) => console.error("❌ Job falhou:", job.id, err));
