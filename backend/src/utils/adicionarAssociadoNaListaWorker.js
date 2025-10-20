const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  AssociadoViewModel,
  ListaViagemAlunosViewModel,
  ListaViagemViewModel,
  RotasViewModel,
} = require("../view/managerView");

// Função interna reutilizável
const adicionarAssociadoNaListaWorker = async ({
  idAssociado,
  cidade,
  turno,
  embarque,
  desembarque,
}) => {
  if (!idAssociado || !cidade || !turno || !embarque || !desembarque) {
    throw new Error(
      "Campos obrigatórios: idAssociado, cidade, turno, embarque e desembarque."
    );
  }

  // 1. Verificar se o associado existe
  const associado = await AssociadoViewModel.findByPk(idAssociado);
  if (!associado) {
    throw new Error("Associado não encontrado.");
  }

  // 2. Buscar rota correspondente
  const rota = await RotasViewModel.findOne({
    where: { cidade, turno, ativo: true },
  });

  if (!rota) {
    throw new Error(`Nenhuma rota ativa encontrada para ${cidade} (${turno}).`);
  }

  // 3. Definir a data da lista (hoje para Noturno, amanhã para Matutino)
  const hoje = new Date();
  const dataLista = new Date();

  if (turno === "Matutino") {
    dataLista.setDate(hoje.getDate() + 1);
  }

  const dataFormatada = dataLista.toISOString().split("T")[0];

  // 4. Buscar lista de viagem aberta para a rota e data
  const lista = await ListaViagemViewModel.findOne({
    where: {
      idRota: rota.id,
      data: { [Op.eq]: dataFormatada },
      status: "Aberta",
    },
  });

  if (!lista) {
    throw new Error(
      `Nenhuma lista aberta encontrada para ${cidade} (${turno}) em ${dataFormatada}.`
    );
  }

  // 5. Verificar se o associado já está na lista
  const jaCadastrado = await ListaViagemAlunosViewModel.findOne({
    where: {
      idLista: lista.id,
      idAssociado,
    },
  });

  if (jaCadastrado) {
    throw new Error("Associado já está cadastrado nesta lista.");
  }

  // 6. Criar vínculo na lista
  const novoRegistro = await ListaViagemAlunosViewModel.create({
    id: uuidv4(),
    idLista: lista.id,
    idAssociado,
    embarque,
    desembarque,
    presenca: false,
  });

  return {
    message: "Associado adicionado à lista com sucesso!",
    lista: {
      id: lista.id,
      cidade: rota.cidade,
      turno: rota.turno,
      data: lista.data,
    },
    registro: novoRegistro,
  };
};

module.exports = adicionarAssociadoNaListaWorker;
