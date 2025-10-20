const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const redis = new IORedis("redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

(async () => {
  const queue = new Queue("paymentQueue", { connection: redis });

  console.log("🧹 Limpando fila...");
  await queue.drain(true); // remove todos os jobs ativos e pendentes
  await queue.clean(0, 1000, "completed"); // limpa completados
  await queue.clean(0, 1000, "failed"); // limpa falhados
  console.log("✅ Fila limpa com sucesso!");

  await redis.quit();
})();
