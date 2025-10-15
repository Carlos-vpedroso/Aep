const { v4: uuidv4 } = require("uuid");
const {
  RotasViewModel,
  ListaViagemViewModel,
  ListaViagemAlunosViewModel,
  AssociadoViewModel,
} = require("../view/managerView");
const { Op } = require("sequelize");

// GET: Buscar todos os alunos de uma lista específica (por cidade, turno e data)
const getListaViagemAlunosPorRotaData = async (req, res) => {
  try {
    const { cidade, turno, data } = req.params;

    if (!cidade || !turno || !data) {
      return res.status(400).json({
        message: "Cidade, turno e data são obrigatórios.",
      });
    }

    // 🔹 1. Buscar rota correspondente
    const rota = await RotasViewModel.findOne({
      where: { cidade, turno },
    });

    if (!rota) {
      return res.status(404).json({
        message: `Nenhuma rota encontrada para ${cidade} (${turno}).`,
      });
    }

    // 🔹 2. Buscar lista de viagem correspondente à rota e data
    const listaViagem = await ListaViagemViewModel.findOne({
      where: {
        idRota: rota.id,
        data: {
          [Op.eq]: data, // formato YYYY-MM-DD
        },
      },
    });

    if (!listaViagem) {
      return res.status(404).json({
        message: `Nenhuma lista encontrada para ${cidade} (${turno}) em ${data}.`,
      });
    }

    // 🔹 3. Buscar todos os alunos vinculados à lista
    const alunos = await ListaViagemAlunosViewModel.findAll({
      where: { idLista: listaViagem.id },
      include: [
        {
          model: AssociadoViewModel,
          as: "associado", // precisa ser o mesmo alias da associação definida no Sequelize
          attributes: [
            "id",
            "nome",
            "email",
            "telefone",
            "faculdade",
            "curso",
            "cidadeTransporte",
            "modalidadeTransporte",
          ],
        },
      ],
    });

    if (!alunos.length) {
      return res.status(200).json({
        message: "Nenhum aluno encontrado nesta lista.",
        lista: listaViagem,
        alunos: [],
      });
    }

    // 🔹 4. Montar resposta limpa
    const listaComAlunos = {
      id: listaViagem.id,
      cidade: rota.cidade,
      turno: rota.turno,
      data: listaViagem.data,
      status: listaViagem.status,
      alunos: alunos.map((item) => ({
        id: item.associado.id,
        nome: item.associado.nome,
        faculdade: item.associado.faculdade,
        curso: item.associado.curso,
        turno: item.associado.turno,
        embarque: item.embarque,
        desembarque: item.desembarque,
        presenca: item.presenca,
      })),
    };

    res.status(200).json(listaComAlunos);
  } catch (error) {
    console.error("Erro ao buscar alunos da lista:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST: Adicionar um associado à lista de viagem
const adicionarAssociadoNaLista = async (req, res) => {
  try {
    const { idAssociado } = req.params;
    const { cidade, turno, embarque, desembarque } = req.body;

    if (!idAssociado || !cidade || !turno || !embarque || !desembarque) {
      return res.status(400).json({
        message:
          "Campos obrigatórios: idAssociado, cidade, turno, embarque e desembarque.",
      });
    }

    // 🔹 1. Verificar se o associado existe
    const associado = await AssociadoViewModel.findByPk(idAssociado);
    if (!associado) {
      return res.status(404).json({ message: "Associado não encontrado." });
    }

    // 🔹 2. Buscar rota correspondente
    const rota = await RotasViewModel.findOne({
      where: { cidade, turno, ativo: true },
    });

    if (!rota) {
      return res.status(404).json({
        message: `Nenhuma rota ativa encontrada para ${cidade} (${turno}).`,
      });
    }

    // 🔹 3. Definir a data da lista (hoje para Noturno, amanhã para Matutino)
    const hoje = new Date();
    const dataLista = new Date();

    if (turno === "Matutino") {
      dataLista.setDate(hoje.getDate() + 1);
    }

    const dataFormatada = dataLista.toISOString().split("T")[0];

    // 🔹 4. Buscar lista de viagem aberta para a rota e data
    const lista = await ListaViagemViewModel.findOne({
      where: {
        idRota: rota.id,
        data: { [Op.eq]: dataFormatada },
        status: "Aberta",
      },
    });

    if (!lista) {
      return res.status(404).json({
        message: `Nenhuma lista aberta encontrada para ${cidade} (${turno}) em ${dataFormatada}.`,
      });
    }

    // 🔹 5. Verificar se o associado já está na lista
    const jaCadastrado = await ListaViagemAlunosViewModel.findOne({
      where: {
        idLista: lista.id,
        idAssociado,
      },
    });

    if (jaCadastrado) {
      return res.status(400).json({
        message: "Associado já está cadastrado nesta lista.",
      });
    }

    // 🔹 6. Criar vínculo na lista
    const novoRegistro = await ListaViagemAlunosViewModel.create({
      id: uuidv4(),
      idLista: lista.id,
      idAssociado,
      embarque,
      desembarque,
      presenca: false,
    });

    return res.status(201).json({
      message: "Associado adicionado à lista com sucesso!",
      lista: {
        id: lista.id,
        cidade: rota.cidade,
        turno: rota.turno,
        data: lista.data,
      },
      registro: novoRegistro,
    });
  } catch (error) {
    console.error("❌ Erro ao adicionar associado na lista:", error);
    res.status(500).json({ error: error.message });
  }
};

const visualizarPassagemAssociado = async (req, res) => {
  try {
    const { idAssociado } = req.params;
    const { turnos } = req.body;

    if (!idAssociado || !turnos || !Array.isArray(turnos) || !turnos.length) {
      return res.status(400).json({
        message:
          "É necessário informar o id do associado e ao menos um turno válido.",
      });
    }

    // 🔹 1. Verificar se o associado existe
    const associado = await AssociadoViewModel.findByPk(idAssociado);
    if (!associado) {
      return res.status(404).json({ message: "Associado não encontrado." });
    }

    // 🔹 2. Preparar datas
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    const passagens = [];

    // 🔹 3. Iterar sobre os turnos enviados
    for (const turno of turnos) {
      const data =
        turno === "Noturno"
          ? hoje.toISOString().split("T")[0]
          : amanha.toISOString().split("T")[0];

      // Buscar todas as rotas do turno
      const rotas = await RotasViewModel.findAll({
        where: { turno, ativo: true },
      });

      for (const rota of rotas) {
        // Verifica se existe lista de viagem para o turno e data correspondente
        const lista = await ListaViagemViewModel.findOne({
          where: {
            idRota: rota.id,
            data,
            status: { [Op.in]: ["Aberta", "Encerrada"] },
          },
        });

        if (!lista) continue;

        // Verifica se o associado está na lista
        const registro = await ListaViagemAlunosViewModel.findOne({
          where: {
            idLista: lista.id,
            idAssociado,
          },
        });

        if (registro) {
          passagens.push({
            idPassagem: registro.id,
            idLista: lista.id,
            cidade: rota.cidade,
            turno: rota.turno,
            data: lista.data,
            embarque: registro.embarque,
            desembarque: registro.desembarque,
            presenca: registro.presenca,
            statusLista: lista.status,
          });
        }
      }
    }

    if (!passagens.length) {
      return res.status(200).json({
        message:
          "Nenhuma passagem encontrada para o associado nos turnos informados.",
        passagens: [],
      });
    }

    res.status(200).json({
      message: "Passagens encontradas.",
      associado: {
        id: associado.id,
        nome: associado.nome,
        faculdade: associado.faculdade,
        curso: associado.curso,
      },
      passagens,
    });
  } catch (error) {
    console.error("❌ Erro ao visualizar passagem do associado:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE: Cancelar (excluir) passagem de um associado
const deletePassagem = async (req, res) => {
  try {
    const { idPassagem } = req.params;

    // Verificação básica
    if (!idPassagem) {
      return res.status(400).json({
        message: "O id da passagem é obrigatório.",
      });
    }

    // 🔹 1. Buscar o registro na tabela lista_viagem_alunos
    const passagem = await ListaViagemAlunosViewModel.findByPk(idPassagem);

    if (!passagem) {
      return res.status(404).json({
        message: "Passagem não encontrada.",
      });
    }

    // 🔹 2. (Opcional) Verificar se a lista ainda está aberta
    const lista = await ListaViagemViewModel.findByPk(passagem.idLista);

    if (!lista) {
      return res.status(404).json({
        message: "Lista de viagem vinculada não encontrada.",
      });
    }

    if (lista.status !== "Aberta") {
      return res.status(400).json({
        message: "Não é possível cancelar uma passagem de uma lista encerrada.",
      });
    }

    // 🔹 3. Excluir o registro da passagem
    await passagem.destroy();

    return res.status(200).json({
      message: "Passagem cancelada com sucesso.",
      idPassagem,
      lista: {
        id: lista.id,
        cidade: lista.cidade,
        turno: lista.turno,
        data: lista.data,
        status: lista.status,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao cancelar passagem:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getListaViagemAlunosPorRotaData,
  adicionarAssociadoNaLista,
  visualizarPassagemAssociado,
  deletePassagem,
};
