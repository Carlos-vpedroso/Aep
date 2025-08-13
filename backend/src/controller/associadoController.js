const { AssociadoViewModel } = require('../view/managerView');
const bcrypt = require('bcryptjs');

// GET: listar todos os associados
const getAllAssociados = async (req, res) => {
    try {
        const associados = await AssociadoViewModel.findAll();
        res.status(200).json(associados);
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

// POST: criar novo associado
const createAssociado = async (req, res) => {
    try {
        const data = req.body;

        // Hash da senha (opcional, mas recomendado)
        if (data.senha) {
            const salt = await bcrypt.genSalt(10);
            data.senha = await bcrypt.hash(data.senha, salt);
        }

        const newAssociado = await AssociadoViewModel.create(data);
        res.status(201).json(newAssociado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: atualizar um associado
const updateAssociado = async (req, res) => {
    const { id } = req.params;
    try {
        const associado = await AssociadoViewModel.findByPk(id);
        if (!associado) {
            return res.status(404).json({ message: 'Associado não encontrado' });
        }

        const data = req.body;

        // Se houver senha, hash novamente
        if (data.senha) {
            const salt = await bcrypt.genSalt(10);
            data.senha = await bcrypt.hash(data.senha, salt);
        }

        await associado.update(data);
        res.status(200).json(associado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: remover um associado
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
    createAssociado,
    updateAssociado,
    deleteAssociado,
};
