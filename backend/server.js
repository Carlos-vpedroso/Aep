
require("dotenv").config();
const app = require("./app");
const { connect, sequelize } = require("./src/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connect();
    await sequelize.sync({ alter: true });
    console.log("Tabelas sincronizadas com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

startServer();
