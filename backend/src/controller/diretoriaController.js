const {
  DiretoriaViewModel,
  AssociadoViewModel,
} = require("../view/managerView");
const { MENSALIDADE } = require("../config/constants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getLast6Months = require("../utils/ultimos6Meses");
const { Op } = require("sequelize");

const loginDiretoria = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verificar se recebeu email e senha
    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    // 2. Buscar associado pelo email
    const diretoria = await DiretoriaViewModel.findOne({ where: { email } });
    if (!diretoria) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 4. Comparar a senha informada com a senha armazenada
    const senhaCorreta = await bcrypt.compare(senha, diretoria.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // 5. Gerar token JWT
    const token = jwt.sign(
      { id: diretoria.id, email: diretoria.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // expira em 1 hora
    );

    // 6. Retornar dados do usuário e token
    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      id: diretoria.id,
      email: diretoria.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDiretoria = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    // verifica se já existe login igual
    const diretorExistente = await DiretoriaViewModel.findOne({
      where: { email },
    });
    if (diretorExistente) {
      return res.status(400).json({ message: "Login já está em uso!" });
    }

    // criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // cria novo registro
    const novoDiretor = await DiretoriaViewModel.create({
      nome,
      email,
      senha: senhaHash,
    });

    return res.status(201).json({
      message: "Diretor criado com sucesso!",
      data: {
        id: novoDiretor.id,
        nome: novoDiretor.nome,
        email: novoDiretor.email,
      },
    });
  } catch (error) {
    console.error("Erro ao criar diretor:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const faturamentoDashboard = async (req, res) => {
  try {
    const meses = getLast6Months();
    const resultado = [];

    for (const mes of meses) {
      // Conta associados ativos, mensalistas e criados ATÉ o fim daquele mês
      const quantidade = await AssociadoViewModel.count({
        where: {
          situacao: "Ativo",
          modalidadeTransporte: "Mensalista",
          createdAt: {
            [Op.lte]: mes.fim, // criado antes ou no fim do mês
          },
        },
      });

      const total = quantidade * Number(MENSALIDADE);

      resultado.push({
        mes: mes.label,
        ano: mes.ano,
        quantidadeAssinantes: quantidade,
        valor: total,
      });
    }

    return res.json(resultado);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao gerar faturamento" });
  }
};

module.exports = {
  loginDiretoria,
  createDiretoria,
  faturamentoDashboard,
};
