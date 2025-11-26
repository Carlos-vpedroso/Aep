const {
  AssociadoViewModel,
  AssociadoTurnoViewModel,
  TurnoViewModel,
} = require("../view/managerView.js");
const { sequelize } = require("../database/index.js");
const bcrypt = require("bcryptjs");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../services/emailService.js");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

//#region Tudo certo !
// POST: criar novo associado
const createAssociado = async (req, res) => {
  try {
    const data = req.body;

    // Validação básica
    if (!data.senha) {
      return res.status(400).json({ error: "Senha é obrigatória" });
    }
    if (!data.email) {
      return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    data.senha = await bcrypt.hash(data.senha, salt);

    // Gerar token de verificação
    const verificationToken = v4();
    data.confirmationToken = verificationToken;

    // Criar o associado no banco
    const newAssociado = await AssociadoViewModel.create(data);

    // Retorna a resposta **imediatamente**
    res.status(201).json({
      message: "Cadastro criado. Verifique seu e-mail para confirmar.",
      associado: newAssociado,
    });

    // Envia o e-mail em background (não bloqueia a resposta)
    sendVerificationEmail(data.email, verificationToken).catch(console.error);
  } catch (error) {
    console.error("Erro createAssociado:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar associado. Tente novamente." });
  }
};

// GET: confirmar e-mail
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const associado = await AssociadoViewModel.findOne({
      where: { confirmationToken: token },
    });

    if (!associado)
      return res.status(400).json({ error: "Token inválido ou expirado." });

    associado.validado = true;
    associado.confirmationToken = null;
    await associado.save();

    // Retorna mensagem de sucesso em JSON
    res.status(200).json({ message: "Cadastro confirmado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginAssociado = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verificar se recebeu email e senha
    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    // 2. Buscar associado pelo email
    const associado = await AssociadoViewModel.findOne({ where: { email } });
    if (!associado) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 3. Verificar se o e-mail foi validado
    if (!associado.validado) {
      return res.status(403).json({
        message:
          "Conta não validada. Verifique seu e-mail para confirmar o cadastro.",
      });
    }

    // 4. Comparar a senha informada com a senha armazenada
    const senhaCorreta = await bcrypt.compare(senha, associado.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 5. Gerar token JWT
    const token = jwt.sign(
      { id: associado.id, email: associado.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // expira em 1 hora
    );

    // 6. Retornar dados do usuário e token
    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      id: associado.id,
      email: associado.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//POST: Esqueceu a senha?
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validar email
    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório" });
    }

    // 2. Verificar se email existe
    const associado = await AssociadoViewModel.findOne({ where: { email } });
    if (!associado) {
      // Segurança: não revelar se existe ou não
      return res.status(200).json({
        message:
          "Se o email existir, enviaremos instruções para resetar a senha.",
      });
    }

    // 3. Gerar token JWT com expiração de 1h
    const resetToken = jwt.sign({ id: associado.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Salvar token + expiração no banco
    associado.forgotToken = resetToken;
    associado.forgotTokenExpires = Date.now() + 3600000; // 1h
    await associado.save();

    // 5. Enviar email
    sendResetPasswordEmail(email, resetToken).catch(console.error);

    return res.status(200).json({
      message:
        "Se o email existir, enviaremos instruções para redefinir sua senha.",
    });
  } catch (error) {
    console.error("Erro forgotPassword:", error);
    res.status(500).json({ error: "Erro ao solicitar redefinição de senha" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;

    if (!novaSenha) {
      return res.status(400).json({ message: "A nova senha é obrigatória" });
    }

    // 1. Procurar o token no banco
    const associado = await AssociadoViewModel.findOne({
      where: {
        forgotToken: token,
        forgotTokenExpires: { [Op.gt]: Date.now() }, // ainda válido
      },
    });

    if (!associado) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // 2. Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    associado.senha = senhaHash;
    associado.forgotToken = null;
    associado.forgotTokenExpires = null;

    await associado.save();

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro resetPassword:", error);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};

// PUT: atualizar associado
const updateFirstTimeAssociado = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const data = req.body;

    // 🔹 1. Verifica se o associado existe
    const associado = await AssociadoViewModel.findByPk(id);
    if (!associado) {
      await transaction.rollback();
      return res.status(404).json({ message: "Associado não encontrado" });
    }

    // 🔹 2. Atualiza os dados principais
    await associado.update(
      {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        rg: data.rg,
        telefone: data.telefone,
        endereco: data.endereco,
        faculdade: data.faculdade,
        curso: data.curso,
        cidadeTransporte: data.cidadeTransporte,
        modalidadeTransporte: data.modalidadeTransporte,
        firstTime: false,
      },
      { transaction }
    );

    // 🔹 3. Atualiza os turnos (agora é um array)
    if (Array.isArray(data.turno) && data.turno.length > 0) {
      const turnosSelecionados = await TurnoViewModel.findAll({
        where: { nome: data.turno },
        transaction,
      });

      if (turnosSelecionados.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Nenhum turno válido encontrado" });
      }

      // Remove vínculos antigos
      await AssociadoTurnoViewModel.destroy({
        where: { idAssociado: id },
        transaction,
      });

      // Cria novos vínculos
      for (const turno of turnosSelecionados) {
        await AssociadoTurnoViewModel.create(
          {
            id: v4(),
            idAssociado: id,
            idTurno: turno.id,
          },
          { transaction }
        );
      }
    }

    // 🔹 4. Buscar associado atualizado junto com os turnos
    const associadoAtualizado = await AssociadoViewModel.findByPk(id, {
      include: [
        {
          model: TurnoViewModel,
          as: "turnos", // certifique-se que o alias da associação seja 'turnos'
          attributes: ["nome"],
          through: { attributes: [] }, // para remover dados da tabela de junção
        },
      ],
      transaction,
    });

    await transaction.commit();

    const { senha, ...associadoSemSenha } = associadoAtualizado.get({
      plain: true,
    });

    // Transformar turnos em array de strings
    associadoSemSenha.turno = associadoSemSenha.turnos.map((t) => t.nome);
    delete associadoSemSenha.turnos;

    res.status(200).json(associadoSemSenha);
  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao atualizar associado:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDadosAssociadoID = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o associado e inclui os turnos relacionados
    const associado = await AssociadoViewModel.findByPk(id, {
      include: [
        {
          model: TurnoViewModel,
          as: "turnos",
          attributes: ["id", "nome"],
          through: { attributes: [] }, // evita trazer a tabela intermediária AssociadoTurno
        },
      ],
    });

    if (!associado) {
      return res.status(404).json({ message: "Associado não encontrado" });
    }

    // Extrai endereço (se existir)
    let endereco = associado.endereco;

    if (typeof endereco === "string") {
      try {
        endereco = JSON.parse(endereco);
      } catch {
        endereco = {};
      }
    }

    const { rua, numero, bairro, cidade, cep } = endereco || {};

    // Extrai nomes dos turnos
    const turnos = associado.turnos?.map((t) => t.nome) || [];

    // Monta resposta limpa
    const associadoResponse = {
      id: associado.id,
      email: associado.email,
      cpf: associado.cpf,
      rg: associado.rg,
      nome: associado.nome,
      telefone: associado.telefone,
      rua,
      numero,
      bairro,
      cidade,
      cep,
      faculdade: associado.faculdade,
      curso: associado.curso,
      turno: turnos, // retorna lista, ex: ["Matutino", "Noturno"]
      cidadeTransporte: associado.cidadeTransporte,
      modalidadeTransporte: associado.modalidadeTransporte,
      situacao: associado.situacao,
      firstTime: associado.firstTime,
    };

    res.status(200).json(associadoResponse);
  } catch (error) {
    console.error("Erro ao buscar associado:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET: quantidade de associados em todas as cidades
const getAssociadosQuantidade = async (req, res) => {
  try {
    const [franca, passos, batatais] = await Promise.all([
      AssociadoViewModel.count({ where: { cidadeTransporte: "Franca" } }),
      AssociadoViewModel.count({ where: { cidadeTransporte: "Passos" } }),
      AssociadoViewModel.count({ where: { cidadeTransporte: "Batatais" } }),
    ]);
    const total = franca + passos + batatais;

    res.status(200).json({
      Franca: franca,
      Passos: passos,
      Batatais: batatais,
      Total: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: quantidade de associados por modalidade
const getAssociadosPorModalidade = async (req, res) => {
  try {
    const [mensal, diaria] = await Promise.all([
      AssociadoViewModel.count({
        where: { modalidadeTransporte: "Mensalista" },
      }),
      AssociadoViewModel.count({ where: { modalidadeTransporte: "Diarista" } }),
    ]);

    res.status(200).json({
      Mensal: mensal,
      Diaria: diaria,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: quantidade de associados por situação
const getAssociadosPorSituacao = async (req, res) => {
  try {
    const [pendente, ativo, inativo] = await Promise.all([
      AssociadoViewModel.count({ where: { situacao: "Pendente" } }),
      AssociadoViewModel.count({ where: { situacao: "Ativo" } }),
      AssociadoViewModel.count({ where: { situacao: "Inativo" } }),
    ]);

    res.status(200).json({
      Pendente: pendente,
      Ativo: ativo,
      Inativo: inativo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET: listar todos os associados
const getAllAssociados = async (req, res) => {
  try {
    // Busca todos os associados com os turnos
    const associados = await AssociadoViewModel.findAll({
      include: [
        {
          model: TurnoViewModel,
          as: "turnos", // o alias definido na associação belongsToMany
          attributes: ["nome"],
        },
      ],
    });

    const associadosTratados = associados.map((assoc) => {
      const { senha, endereco, turnos, ...rest } = assoc.get({ plain: true });

      // Transformar endereço em objeto
      let enderecoObj = {};
      try {
        enderecoObj =
          typeof endereco === "string" ? JSON.parse(endereco) : endereco;
      } catch (e) {
        enderecoObj = {};
      }

      // Extrair nomes dos turnos
      const turnosArray = turnos?.map((t) => t.nome) || [];

      return {
        ...rest,
        ...enderecoObj,
        turno: turnosArray,
      };
    });

    res.status(200).json(associadosTratados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
//#endregion

//#region Testar outras Funções

// GET: buscar um associado por ID
const getAssociadoById = async (req, res) => {
  const { id } = req.params;
  try {
    const associado = await AssociadoViewModel.findByPk(id);
    if (!associado) {
      return res.status(404).json({ message: "Associado não encontrado" });
    }
    res.status(200).json(associado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: atualizar associado
const updateAssociado = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const data = req.body;

    // 1️⃣ Verifica se o associado existe
    const associado = await AssociadoViewModel.findByPk(id, { transaction });
    if (!associado) {
      await transaction.rollback();
      return res.status(404).json({ message: "Associado não encontrado" });
    }

    // 2️⃣ Atualiza dados principais do associado (excluindo turno)
    const { turno, ...dadosPrincipais } = data;
    await associado.update(dadosPrincipais, { transaction });

    // 3️⃣ Atualiza os turnos, se enviados
    if (Array.isArray(turno) && turno.length > 0) {
      const turnosSelecionados = await TurnoViewModel.findAll({
        where: { nome: turno },
        transaction,
      });

      if (turnosSelecionados.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Nenhum turno válido encontrado" });
      }

      // Remove vínculos antigos
      await AssociadoTurnoViewModel.destroy({
        where: { idAssociado: id },
        transaction,
      });

      // Cria novos vínculos
      for (const t of turnosSelecionados) {
        await AssociadoTurnoViewModel.create(
          {
            id: v4(),
            idAssociado: id,
            idTurno: t.id,
          },
          { transaction }
        );
      }
    }

    // 4️⃣ Buscar associado atualizado junto com os turnos
    const associadoAtualizado = await AssociadoViewModel.findByPk(id, {
      include: [
        {
          model: TurnoViewModel,
          as: "turnos",
          attributes: ["nome"],
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    await transaction.commit();

    const { senha, ...associadoSemSenha } = associadoAtualizado.get({
      plain: true,
    });

    // Transformar turnos em array de strings
    associadoSemSenha.turno = associadoSemSenha.turnos.map((t) => t.nome);
    delete associadoSemSenha.turnos;

    res.status(200).json(associadoSemSenha);
  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao atualizar associado:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE: remover associado
const deleteAssociado = async (req, res) => {
  const { id } = req.params;
  try {
    const associado = await AssociadoViewModel.findByPk(id);
    if (!associado) {
      return res.status(404).json({ message: "Associado não encontrado" });
    }

    await associado.destroy();
    res.status(200).json({ message: "Associado removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAssociados,
  getAssociadoById,
  getDadosAssociadoID,
  createAssociado,
  verifyEmail,
  loginAssociado,
  forgotPassword,
  resetPassword,
  updateFirstTimeAssociado,
  updateAssociado,
  deleteAssociado,
  getAssociadosQuantidade,
  getAssociadosPorModalidade,
  getAssociadosPorSituacao,
};
