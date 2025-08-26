const { ListaFrancaNoturnoAlunosViewModel, ListaFrancaNoturnoViewModel } = require("../view/managerView");

const adicionarAlunoLista = async (req, res) => {
    try {
        const { id: idAluno } = req.params;
        const { nomeAluno, embarque, desembarque } = req.body; // dados opcionais do aluno

        // Data de hoje no formato YYYY-MM-DD
        const hoje = new Date().toISOString().split("T")[0];

        // Buscar lista noturna de hoje
        const lista = await ListaFrancaNoturnoViewModel.findOne({
            where: { data: hoje },
        });

        if (!lista) {
            return res.status(404).json({ message: "Nenhuma lista encontrada para hoje." });
        }

        // Verificar se o aluno já está na lista
        const alunoExistente = await ListaFrancaNoturnoAlunosViewModel.findOne({
            where: { idLista: lista.id, idAluno }
        });

        if (alunoExistente) {
            return res.status(400).json({ message: "O aluno já está na lista de hoje." });
        }

        // Criar o vínculo do aluno com a lista
        const novoAlunoLista = await ListaFrancaNoturnoAlunosViewModel.create({
            idLista: lista.id,
            idAluno,
            nomeAluno,
            embarque,
            desembarque,
        });

        return res.status(201).json({
            message: "Aluno adicionado à lista com sucesso.",
            data: novoAlunoLista,
        });
    } catch (error) {
        console.error("Erro ao adicionar aluno à lista:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const removerAlunoLista = async (req, res) => {
    try {
        const { id: idAluno } = req.params;

        // Data de hoje no formato YYYY-MM-DD
        const hoje = new Date().toISOString().split("T")[0];

        // Buscar lista noturna de hoje
        const lista = await ListaFrancaNoturnoViewModel.findOne({
            where: { data: hoje },
        });

        if (!lista) {
            return res.status(404).json({ message: "Nenhuma lista encontrada para hoje." });
        }

        // Verificar se o aluno está na lista
        const alunoNaLista = await ListaFrancaNoturnoAlunosViewModel.findOne({
            where: { idLista: lista.id, idAluno },
        });

        if (!alunoNaLista) {
            return res.status(404).json({ message: "Aluno não encontrado na lista." });
        }

        // Remover o vínculo do aluno
        await ListaFrancaNoturnoAlunosViewModel.destroy({
            where: { idLista: lista.id, idAluno },
        });

        return res.status(200).json({ message: "Aluno removido da lista com sucesso." });
    } catch (error) {
        console.error("Erro ao remover aluno da lista:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

const verificarAlunoNaLista = async (req, res, returnData = false) => {
    try {
        const { id: idAluno } = req.params;
        const hoje = new Date().toISOString().split("T")[0];

        const lista = await ListaFrancaNoturnoViewModel.findOne({ where: { data: hoje } });
        if (!lista) return returnData ? null : res.status(404).json({ message: "Nenhuma lista encontrada para hoje." });

        const alunoNaLista = await ListaFrancaNoturnoAlunosViewModel.findOne({
            where: { idLista: lista.id, idAluno },
        });
        if (!alunoNaLista) return returnData ? null : res.status(404).json({ message: "Aluno não encontrado na lista." });

        const dadosAluno = {
            nomeAluno: alunoNaLista.nomeAluno,
            embarque: alunoNaLista.embarque,
            desembarque: alunoNaLista.desembarque
        };

        return returnData ? dadosAluno : res.status(200).json(dadosAluno);

    } catch (error) {
        console.error("Erro ao verificar aluno na lista:", error);
        if (!returnData) res.status(500).json({ message: "Erro interno do servidor." });
        return null;
    }
};

const getAllAlunos = async (req, res) => {
    try {
        const { data } = req.body; // Data passada pelo cliente

        if (!data) {
            return res.status(400).json({ message: "A data é obrigatória." });
        }

        // Buscar lista pela data informada
        const lista = await ListaFrancaNoturnoViewModel.findOne({
            where: { data },
        });

        if (!lista) {
            return res.status(404).json({ message: "Nenhuma lista encontrada para a data informada.", data: [] });
        }

        // Buscar todos os alunos vinculados à lista
        const alunos = await ListaFrancaNoturnoAlunosViewModel.findAll({
            where: { idLista: lista.id },
            attributes: ["idAluno", "nomeAluno", "embarque", "desembarque"], // apenas os campos relevantes
        });

        if (!alunos || alunos.length === 0) {
            return res.status(200).json({ message: "Nenhum aluno encontrado na lista.", data: [] });
        }

        return res.status(200).json({
            message: "Alunos encontrados com sucesso.",
            data: alunos,
        });

    } catch (error) {
        console.error("Erro ao buscar alunos da lista:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

module.exports = { adicionarAlunoLista, removerAlunoLista, verificarAlunoNaLista, getAllAlunos };
