const listaBatataisAlunosController = require('./listaBatataisAlunosController')
const listaFrancaMatutinoAlunosController = require('./listaFrancaMatutinoAlunosController')
const listaFrancaNoturnoAlunosController = require('./listaFrancaNoturnoAlunosController')
const listaPassosMatutinoAlunosController = require('./listaPassosMatutinoAlunosController')
const listaPassosNoturnoAlunosController = require('./listaPassosNoturnoAlunosController')

async function adicionarAlunoLista(req, res) {
    const { cidade, turno } = req.params;

    try {
        let controller;

        if (cidade === "Batatais") controller = listaBatataisAlunosController;
        else if (cidade === "Franca" && turno === "Matutino") controller = listaFrancaMatutinoAlunosController;
        else if (cidade === "Franca" && turno === "Noturno") controller = listaFrancaNoturnoAlunosController;
        else if (cidade === "Passos" && turno === "Matutino") controller = listaPassosMatutinoAlunosController;
        else if (cidade === "Passos" && turno === "Noturno") controller = listaPassosNoturnoAlunosController;
        else return res.status(400).json({ message: "Cidade ou turno inválido." });

        // chama a função do controller correto
        await controller.adicionarAlunoLista(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao adicionar aluno na lista." });
    }
}

async function removerAlunoLista(req, res) {
    const { cidade, turno } = req.params;

    try {
        let controller;

        if (cidade === "Batatais") controller = listaBatataisAlunosController;
        else if (cidade === "Franca" && turno === "Matutino") controller = listaFrancaMatutinoAlunosController;
        else if (cidade === "Franca" && turno === "Noturno") controller = listaFrancaNoturnoAlunosController;
        else if (cidade === "Passos" && turno === "Matutino") controller = listaPassosMatutinoAlunosController;
        else if (cidade === "Passos" && turno === "Noturno") controller = listaPassosNoturnoAlunosController;
        else return res.status(400).json({ message: "Cidade ou turno inválido." });

        await controller.removerAlunoLista(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao remover aluno da lista." });
    }
}

async function verificarAlunoNaLista(req, res) {
    const { cidade, turno } = req.params;
    const { id: idAluno } = req.params;

    try {
        let resultados = [];

        // Função auxiliar que chama o controller correto
        const verificarEmController = async (controller, cidadeNome, turnoNome) => {
            if (controller && typeof controller.verificarAlunoNaLista === 'function') {
                const resultado = await controller.verificarAlunoNaLista(req, res, true); // passa true para não enviar res diretamente
                if (resultado) resultados.push({ cidadeTransporte: cidadeNome, turno: turnoNome, ...resultado });
            }
        };

        // Batatais
        if (cidade === "Batatais") {
            await verificarEmController(listaBatataisAlunosController, "Batatais", "Noturno");
        }

        // Franca
        if (cidade === "Franca") {
            if (turno === "Matutino") {
                await verificarEmController(listaFrancaMatutinoAlunosController, "Franca", "Matutino");
            } else if (turno === "Noturno") {
                await verificarEmController(listaFrancaNoturnoAlunosController, "Franca", "Noturno");
            } else if (turno === "Ambos") {
                await verificarEmController(listaFrancaMatutinoAlunosController, "Franca", "Matutino");
                await verificarEmController(listaFrancaNoturnoAlunosController, "Franca", "Noturno");
            }
        }

        // Passos
        if (cidade === "Passos") {
            if (turno === "Matutino") {
                await verificarEmController(listaPassosMatutinoAlunosController, "Passos", "Matutino");
            } else if (turno === "Noturno") {
                await verificarEmController(listaPassosNoturnoAlunosController, "Passos", "Noturno");
            } else if (turno === "Ambos") {
                await verificarEmController(listaPassosMatutinoAlunosController, "Passos", "Matutino");
                await verificarEmController(listaPassosNoturnoAlunosController, "Passos", "Noturno");
            }
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Aluno não encontrado na lista." });
        }

        return res.status(200).json(resultados);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}


module.exports = { adicionarAlunoLista, removerAlunoLista, verificarAlunoNaLista };