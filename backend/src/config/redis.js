const IORedis = require("ioredis");

const redis = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null, // 👈 obrigatório para o BullMQ
  enableReadyCheck: false,    // 👈 recomendável em ambientes Docker/Render
});

redis.on("connect", () => console.log("✅ Conectado ao Redis com sucesso!"));
redis.on("error", (err) => console.error("❌ Erro no Redis:", err));

module.exports = redis;
