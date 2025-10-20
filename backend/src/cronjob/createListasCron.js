const cron = require("node-cron");
const { criarListasViagem } = require("../controller/listaViagemController");

// Executar todo dia à meia-noite
cron.schedule("29 09 * * *", () => {
  console.log("Rodando criação automática de listas...");
  criarListasViagem();
});
