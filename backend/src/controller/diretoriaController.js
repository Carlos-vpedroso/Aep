const { DiretoriaViewModel } = require('../view/managerView')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loginDiretoria = async (req, res) => {
    try {
        const { login, senha } = req.body;

        // 1. Verificar se recebeu email e senha
        if (!login || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // 2. Buscar associado pelo email
        const diretoria = await DiretoriaViewModel.findOne({ where: { login } });
        if (!diretoria) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // 4. Comparar a senha informada com a senha armazenada
        const senhaCorreta = await bcrypt.compare(senha, diretoria.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // 5. Gerar token JWT
        const token = jwt.sign(
            { id: diretoria.id, login: diretoria.login },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // expira em 1 hora
        );

        // 6. Retornar dados do usuário e token
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            id: diretoria.id,
            login: diretoria.login
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createDiretoria = async (req, res) => {
    try {
        const { nome, login, senha } = req.body;

        // validações básicas
        if (!nome || !login || !senha) {
            return res.status(400).json({ message: "Preencha todos os campos!" });
        }

        // verifica se já existe login igual
        const diretorExistente = await Diretoria.findOne({ where: { login } });
        if (diretorExistente) {
            return res.status(400).json({ message: "Login já está em uso!" });
        }

        // criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // cria novo registro
        const novoDiretor = await Diretoria.create({
            nome,
            login,
            senha: senhaHash,
        });

        return res.status(201).json({
            message: "Diretor criado com sucesso!",
            data: {
                id: novoDiretor.id,
                nome: novoDiretor.nome,
                login: novoDiretor.login,
            }
        });
    } catch (error) {
        console.error("Erro ao criar diretor:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};

module.exports = {
    loginDiretoria,
    createDiretoria
}