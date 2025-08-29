const { AssociadoViewModel } = require('../view/managerView.js');
const bcrypt = require('bcryptjs');
const sendVerificationEmail  = require('../services/emailService.js');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');

// GET: listar todos os associados
const getAllAssociados = async (req, res) => {
    try {
        const associados = await AssociadoViewModel.findAll({ raw: true });

        // Remove a senha de cada associado
        const associadosSemSenha = associados.map(({ senha, ...dados }) => dados);

        res.status(200).json(associadosSemSenha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: quantidade de associados em todas as cidades
const getAssociadosQuantidade = async (req, res) => {
    try {
        const [franca, passos, batatais] = await Promise.all([
            AssociadoViewModel.count({ where: { cidadeTransporte: "Franca" } }),
            AssociadoViewModel.count({ where: { cidadeTransporte: "Passos" } }),
            AssociadoViewModel.count({ where: { cidadeTransporte: "Batatais" } })
        ]);
        const total = franca + passos + batatais;

        res.status(200).json({
            Franca: franca,
            Passos: passos,
            Batatais: batatais,
            Total: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: quantidade de associados por modalidade
const getAssociadosPorModalidade = async (req, res) => {
    try {
        const [mensal, diaria] = await Promise.all([
            AssociadoViewModel.count({ where: { modalidadeTransporte: "Mensal" } }),
            AssociadoViewModel.count({ where: { modalidadeTransporte: "Diaria" } })
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
            AssociadoViewModel.count({ where: { situacao: "Inativo" } })
        ]);

        res.status(200).json({
            Pendente: pendente,
            Ativo: ativo,
            Inativo: inativo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET: buscar um associado por ID
const getAssociadoById = async (req, res) => {
    const { id } = req.params;
    try {
        const associado = await AssociadoViewModel.findByPk(id);
        if (!associado) {
            return res.status(404).json({ message: 'Associado não encontrado' });
        }
        res.status(200).json(associado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDadosAssociadoID = async (req, res) => {
    const { id } = req.params;
    try {
        const associado = await AssociadoViewModel.findByPk(id);
        if (!associado) {
            return res.status(404).json({ message: 'Associado não encontrado' });
        }
        res.status(200).json({
            email: associado.email,
            cpf: associado.cpf,
            rg: associado.rg,
            nome: associado.nome,
            telefone: associado.telefone,
            rua: associado.rua,
            numero: associado.numero,
            bairro: associado.bairro,
            cidade: associado.cidade,
            cep: associado.cep,
            faculdade: associado.faculdade,
            curso: associado.curso,
            turno: associado.turno,
            cidadeTransporte: associado.cidadeTransporte,
            modalidadeTransporte: associado.modalidadeTransporte,
            situacao: associado.situacao,
            firstTime: associado.firstTime
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: criar novo associado
const createAssociado = async (req, res) => {
    try {
        const data = req.body;

        // Hash da senha
        if (!data.senha) {
            return res.status(400).json({ error: 'Senha é obrigatória' });
        }
        const salt = await bcrypt.genSalt(10);
        data.senha = await bcrypt.hash(data.senha, salt);

        // Gerar token de verificação
        const verificationToken = v4();
        data.confirmationToken = verificationToken;

        const newAssociado = await AssociadoViewModel.create(data);

        // Enviar e-mail de confirmação
        await sendVerificationEmail(data.email, verificationToken);

        res.status(201).json({
            message: 'Cadastro criado. Verifique seu e-mail para confirmar.',
            associado: newAssociado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: confirmar e-mail
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const associado = await AssociadoViewModel.findOne({
            where: { confirmationToken: token }
        });

        if (!associado)
            return res.status(400).json({ error: 'Token inválido ou expirado.' });

        associado.validado = true;
        associado.confirmationToken = null;
        await associado.save();

        res.send('Cadastro confirmado com sucesso!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const loginAssociado = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Verificar se recebeu email e senha
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // 2. Buscar associado pelo email
        const associado = await AssociadoViewModel.findOne({ where: { email } });
        if (!associado) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // 3. Verificar se o e-mail foi validado
        if (!associado.validado) {
            return res.status(403).json({
                message: 'Conta não validada. Verifique seu e-mail para confirmar o cadastro.'
            });
        }

        // 4. Comparar a senha informada com a senha armazenada
        const senhaCorreta = await bcrypt.compare(senha, associado.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // 5. Gerar token JWT
        const token = jwt.sign(
            { id: associado.id, email: associado.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // expira em 1 hora
        );

        // 6. Retornar dados do usuário e token
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            id: associado.id,
            email: associado.email
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: atualizar associado
const updateAssociado = async (req, res) => {
    const { id } = req.params;
    try {
        const associado = await AssociadoViewModel.findByPk(id);
        if (!associado) {
            return res.status(404).json({ message: 'Associado não encontrado' });
        }

        const data = req.body;

        await associado.update(data);

        const { senha, ...associadoSemSenha } = associado.get({ plain: true });

        res.status(200).json(associadoSemSenha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: remover associado
const deleteAssociado = async (req, res) => {
    const { id } = req.params;
    try {
        const associado = await AssociadoViewModel.findByPk(id);
        if (!associado) {
            return res.status(404).json({ message: 'Associado não encontrado' });
        }

        await associado.destroy();
        res.status(200).json({ message: 'Associado removido com sucesso' });
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
    updateAssociado,
    deleteAssociado,
    getAssociadosQuantidade,
    getAssociadosPorModalidade,
    getAssociadosPorSituacao,
};