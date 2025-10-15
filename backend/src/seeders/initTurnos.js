const { v4: uuidv4 } = require("uuid");
const { TurnoViewModel } = require("../view/managerView"); 

async function initTurnos() {
  try {
    const turnosPadrao = ["Matutino", "Noturno"];

    for (const nome of turnosPadrao) {
      const existe = await TurnoViewModel.findOne({ where: { nome } });

      if (!existe) {
        await TurnoViewModel.create({
          id: uuidv4(),
          nome,
        });
        console.log(`✅ Turno "${nome}" criado com sucesso.`);
      } else {
        console.log(`ℹ️ Turno "${nome}" já existe.`);
      }
    }

    console.log("✅ Seed de turnos finalizado.");
  } catch (error) {
    console.error("❌ Erro ao inicializar turnos:", error.message);
  }
}

module.exports = initTurnos;
