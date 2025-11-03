const { v4: uuidv4 } = require("uuid");
const { RotasViewModel, ListaViagemViewModel } = require("../view/managerView"); // ajuste conforme seu projeto

async function criarListasViagemNoturno() {
  try {
    // 🔹 1. Buscar todas as rotas ativas
    const rotas = await RotasViewModel.findAll({
      where: { ativo: true, turno: "Noturno" },
    });

    if (!rotas.length) {
      console.log("Nenhuma rota ativa encontrada.");
      return;
    }

    const hoje = new Date();

    for (const rota of rotas) {
      const dataViagem = hoje;
      // 🔹 2. Verifica se já existe uma lista para a mesma rota e data
      const listaExistente = await ListaViagemViewModel.findOne({
        where: {
          idRota: rota.id,
          data: dataViagem.toISOString().split("T")[0], // formato YYYY-MM-DD
        },
      });

      if (listaExistente) {
        console.log(
          `Lista já existente para ${rota.cidade} - ${rota.turno} em ${
            dataViagem.toISOString().split("T")[0]
          }`
        );
        continue;
      }

      // 🔹 3. Cria a lista
      await ListaViagemViewModel.create({
        id: uuidv4(),
        data: dataViagem.toISOString().split("T")[0],
        idRota: rota.id,
        status: "Aberta",
        criadaAutomaticamente: true,
      });

      console.log(
        `✅ Lista criada para ${rota.cidade} - ${rota.turno} em ${
          dataViagem.toISOString().split("T")[0]
        }`
      );
    }

    console.log("✅ Rotinas de criação de listas NOTURNO finalizadas.");
  } catch (error) {
    console.error("❌ Erro ao criar listas de viagem:", error.message);
  }
}

async function criarListasViagemMatutino() {
  try {
    // 🔹 1. Buscar todas as rotas ativas
    const rotas = await RotasViewModel.findAll({
      where: { ativo: true, turno: "Matutino" },
    });

    if (!rotas.length) {
      console.log("Nenhuma rota ativa encontrada.");
      return;
    }

    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    for (const rota of rotas) {
      let dataViagem = amanha;

      // 🔹 2. Verifica se já existe uma lista para a mesma rota e data
      const listaExistente = await ListaViagemViewModel.findOne({
        where: {
          idRota: rota.id,
          data: dataViagem.toISOString().split("T")[0], // formato YYYY-MM-DD
        },
      });

      if (listaExistente) {
        console.log(
          `Lista já existente para ${rota.cidade} - ${rota.turno} em ${
            dataViagem.toISOString().split("T")[0]
          }`
        );
        continue;
      }

      // 🔹 3. Cria a lista
      await ListaViagemViewModel.create({
        id: uuidv4(),
        data: dataViagem.toISOString().split("T")[0],
        idRota: rota.id,
        status: "Aberta",
        criadaAutomaticamente: true,
      });

      console.log(
        `✅ Lista criada para ${rota.cidade} - ${rota.turno} em ${
          dataViagem.toISOString().split("T")[0]
        }`
      );
    }

    console.log("✅ Rotinas de criação de listas MATUTINO finalizadas.");
  } catch (error) {
    console.error("❌ Erro ao criar listas de viagem:", error.message);
  }
}

module.exports = { criarListasViagemMatutino, criarListasViagemNoturno };
