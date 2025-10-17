// src/utils/socket.js
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const IORedis = require("ioredis");

let io;

function initIo(server) {
  const pubClient = new IORedis(process.env.REDIS_URL);
  const subClient = pubClient.duplicate();

  io = new Server(server, {
    cors: { origin: "*" }, // ajuste para o seu frontend
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("⚡ Cliente conectado:", socket.id);

    // Para o frontend entrar em salas específicas
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`⚡ Socket ${socket.id} entrou na sala ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("⚡ Cliente desconectado:", socket.id);
    });
  });

  return io;
}

function getIo() {
  if (!io)
    throw new Error(
      "Socket.io não inicializado. Chame initIo(server) primeiro."
    );
  return io;
}

function notificarFrontend(userId, evento, payload) {
  try {
    const ioInstance = getIo();
    ioInstance.to(`user_${userId}`).emit(evento, payload);
  } catch (err) {
    console.error("❌ Erro ao notificar frontend:", err);
  }
}

module.exports = { initIo, getIo, notificarFrontend };
