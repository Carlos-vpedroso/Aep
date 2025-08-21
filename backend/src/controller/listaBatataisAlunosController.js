const { ListaBatataisAlunosViewModel, ListaBatataisViewModel } = require("../view/managerView");

const adicionarAlunoLista = async (req, res) => {
    try {
        const { idAluno } = req.params; // ID do aluno vindo pela rota
        const { nomeAluno, embarque, desembarque } = req.body; // dados opcionais do aluno

        // Data de hoje no formato YYYY-MM-DD
        const hoje = new Date().toISOString().split("T")[0];

        // Buscar lista noturna de hoje
        const lista = await ListaBatataisViewModel.findOne({
            where: { data: hoje },
        });

        if (!lista) {
            return res.status(404).json({ message: "Nenhuma lista encontrada para hoje." });
        }

        // Criar o vínculo do aluno com a lista
        const novoAlunoLista = await ListaBatataisAlunosViewModel.create({
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

module.exports = { adicionarAlunoLista };
