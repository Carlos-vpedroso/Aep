const cron = require("node-cron");
const {
  criarListasViagemMatutino,
  criarListasViagemNoturno,
} = require("../controller/listaViagemController");

// Executar todo dia à meia-noite de Domingo a Quinta-Feira
cron.schedule("0 0 * * 0-4", () => {
  console.log("Rodando criação automática de listas MATUTINO...");
  criarListasViagemMatutino();
});

// Executar todo dia à meia-noite de Segunda a Sexta-Feira
cron.schedule("0 0 * * 1-5", () => {
  console.log("Rodando criação automática de listas NOTURNO...");
  criarListasViagemNoturno();
});
