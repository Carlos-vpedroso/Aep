require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { sequelize } = require("../database/index");
const { Worker } = require("bullmq");
const redis = require("../redis/redis");
const processPaymentPixJob = require("./jobs/processPaymentPixJob");

// Conecta ao banco
sequelize
  .authenticate()
  .then(() => console.log("✅ Banco conectado com sucesso (Worker)"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco (Worker):", err));

const worker = new Worker(
  "paymentQueue",
  async (job) => {
    processPaymentPixJob(job);
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => console.log("✅ Job concluído:", job.id));
worker.on("failed", (job, err) => console.error("❌ Job falhou:", job.id, err));
