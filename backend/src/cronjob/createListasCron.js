const cron = require('node-cron');
const { criarListaMatutino, criarListaNoturno } = require("../controller/listasController"); 

// Cron job para listas matutinas: roda todo dia às 23:59 para criar a lista do dia seguinte
cron.schedule("10 15 * * *", () => {
    console.log("Executando cron job: criando listas matutinas (para o dia seguinte)...");
    criarListaMatutino();
});

// Cron job para listas noturnas: roda todo dia às 00:01 para criar a lista do dia atual
cron.schedule("10 15 * * *", () => {
    console.log("Executando cron job: criando listas noturnas (para o dia atual)...");
    criarListaNoturno();
});

console.log("Cron jobs para listas matutinas e noturnas iniciados.");
