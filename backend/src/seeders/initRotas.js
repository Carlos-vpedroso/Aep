const { v4: uuidv4 } = require("uuid");
const { RotasViewModel } = require("../view/managerView"); 

async function initRotas() {
  try {
    const rotasPadrao = [
      { cidade: "Franca", turno: "Matutino" },
      { cidade: "Franca", turno: "Noturno" },
      { cidade: "Passos", turno: "Matutino" },
      { cidade: "Passos", turno: "Noturno" },
      { cidade: "Batatais", turno: "Noturno" },
    ];

    for (const rota of rotasPadrao) {
      const existe = await RotasViewModel.findOne({
        where: { cidade: rota.cidade, turno: rota.turno },
      });

      if (!existe) {
        await RotasViewModel.create({
          id: uuidv4(),
          cidade: rota.cidade,
          turno: rota.turno,
          ativo: true,
        });
        console.log(`✅ Rota "${rota.cidade} - ${rota.turno}" criada com sucesso.`);
      } else {
        console.log(`ℹ️ Rota "${rota.cidade} - ${rota.turno}" já existe.`);
      }
    }

    console.log("✅ Seed de rotas finalizado.");
  } catch (error) {
    console.error("❌ Erro ao inicializar rotas:", error.message);
  }
}

module.exports = initRotas;
