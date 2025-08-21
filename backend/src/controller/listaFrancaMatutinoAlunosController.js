const { ListaFrancaMatutinoAlunosViewModel, ListaFrancaMatutinoViewModel } = require("../view/managerView");

const adicionarAlunoLista = async (req, res) => {
    try {
        const { idAluno } = req.params; // ID do aluno vindo pela rota
        const { nomeAluno, embarque, desembarque } = req.body; // dados opcionais do aluno

        // Data de hoje no formato YYYY-MM-DD
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 1); // adiciona 1 dia
        const dataAmanha = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

        // Buscar lista noturna de hoje
        const lista = await ListaFrancaMatutinoAlunosViewModel.findOne({
            where: { data: dataAmanha },
        });

        if (!lista) {
            return res.status(404).json({ message: "Nenhuma lista encontrada para hoje." });
        }

        // Criar o vínculo do aluno com a lista
        const novoAlunoLista = await ListaFrancaMatutinoAlunosViewModel.create({
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
