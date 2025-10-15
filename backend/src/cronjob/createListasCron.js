const cron = require("node-cron");
const { criarListasViagem } = require("../controller/listaViagemController");

// Executar todo dia à meia-noite
cron.schedule("00 15 * * *", () => {
  console.log("Rodando criação automática de listas...");
  criarListasViagem();
});
