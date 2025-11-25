require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connect, sequelize } = require("./src/database");
const initTurnos = require("./src/seeders/initTurnos");
const initRotas = require("./src/seeders/initRotas");
const { initIo } = require("./src/utils/socket");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connect();

    // Inicializa os turnos
    await initTurnos();
    await initRotas();

    // Cria o servidor HTTP e inicializa o Socket.IO
    const server = http.createServer(app);
    initIo(server);

    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();
