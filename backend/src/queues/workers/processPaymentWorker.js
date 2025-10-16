const { Worker } = require("bullmq");
const redis = require("../../config/redis");
const { getIo } = require("../../utils/socket");
const { PagamentosViewModel } = require("../../view/managerView");
const adicionarAssociadoNaListaWorker = require("../../services/adicionarAssociadoNaListaWorker");

const worker = new Worker(
  "paymentQueue",
  async (job) => {
    const { pagamentoId, txid, valor } = job.data;

    console.log("🚀 Processando job:", job.id, txid);

    const pagamento = await PagamentosViewModel.findByPk(pagamentoId);
    if (!pagamento) {
      console.warn("⚠️ Pagamento não encontrado:", pagamentoId);
      return;
    }

    // Dados salvos anteriormente no pagamento
    const { idAssociado, metadata } = pagamento;
    const { cidade, turno, embarque, desembarque } = metadata || {};

    // Gera a passagem (de forma isolada)
    try {
      await adicionarAssociadoNaListaWorker({
        idAssociado,
        cidade,
        turno,
        embarque,
        desembarque,
      });
    } catch (error) {
      console.error("❌ Erro ao adicionar associado via worker:", error);
      throw error; // marca o job como failed
    }

    // Atualiza status, se desejar
    // await pagamento.update({ status: "Emitida" });

    // Envia evento via WebSocket para o front
    try {
      const io = getIo();
      io.to(`user_${idAssociado}`).emit("passagem_emitida", {
        txid,
        valor,
        cidade,
        turno,
        mensagem: "✅ Pagamento confirmado e passagem emitida!",
      });
    } catch (e) {
      console.warn("⚠️ Não foi possível emitir o socket:", e);
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => console.log("✅ Job concluído:", job.id));
worker.on("failed", (job, err) => console.error("❌ Job falhou:", job.id, err));
