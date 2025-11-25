// src/utils/socket.js
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const IORedis = require("ioredis");

let io;

function initIo(server) {
  const pubClient = new IORedis(process.env.REDIS_URL);
  const subClient = pubClient.duplicate();

  io = new Server(server, {
    cors: { origin: "*" }, // ajuste conforme seu frontend
  });

  io.adapter(createAdapter(pubClient, subClient));

  // 🔹 Escuta canal Redis para receber mensagens do worker
  const subscriber = new IORedis(process.env.REDIS_URL);
  subscriber.subscribe("frontend_notifications");
  subscriber.on("message", (channel, message) => {
    try {
      const { userId, evento, payload } = JSON.parse(message);
      io.to(`user_${userId}`).emit(evento, payload);
      // console.log(`📢 Evento emitido para user_${userId}: ${evento}`);
    } catch (err) {
      console.error("❌ Erro ao processar mensagem Redis:", err);
    }
  });

  io.on("connection", (socket) => {
    // console.log("⚡ Cliente conectado:", socket.id);

    socket.on("join", (room) => {
      socket.join(room);
      // console.log(`⚡ Socket ${socket.id} entrou na sala ${room}`);
    });

    // socket.on("disconnect", () => {
    //   console.log("⚡ Cliente desconectado:", socket.id);
    // });
  });

  return io;
}

module.exports = { initIo };
