const {
    ListaBatataisViewModel,
    ListaFrancaMatutinoViewModel,
    ListaFrancaNoturnoViewModel,
    ListaPassosMatutinoViewModel,
    ListaPassosNoturnoViewModel
} = require("../view/managerView");

const criarListaMatutino = async () => {
    try {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 1); // adiciona 1 dia

        // Se for sábado (6) ou domingo (0), não cria lista
        if (hoje.getDay() === 6 || hoje.getDay() === 0) {
            console.log("Final de semana, lista matutina não será criada.");
            return;
        }
        const dataAmanha = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

        // Verifica se já existe lista em Franca
        const listaFrancaExistente = await ListaFrancaMatutinoViewModel.findOne({
            where: { data: dataAmanha },
        });

        if (!listaFrancaExistente) {
            await ListaFrancaMatutinoViewModel.create({ data: dataAmanha });
            console.log(`Lista matutina de Franca criada para ${dataAmanha}`);
        } else {
            console.log(`Lista matutina de Franca já existe para ${dataAmanha}`);
        }

        // Verifica se já existe lista em Passos
        const listaPassosExistente = await ListaPassosMatutinoViewModel.findOne({
            where: { data: dataAmanha },
        });

        if (!listaPassosExistente) {
            await ListaPassosMatutinoViewModel.create({ data: dataAmanha });
            console.log(`Lista matutina de Passos criada para ${dataAmanha}`);
        } else {
            console.log(`Lista matutina de Passos já existe para ${dataAmanha}`);
        }

    } catch (error) {
        console.error("Erro ao criar lista matutina:", error);
    }
};



const criarListaNoturno = async () => {
    try {
        const hoje = new Date();

        // Se for sábado (6) ou domingo (0), não cria lista
        if (hoje.getDay() === 6 || hoje.getDay() === 0) {
            console.log("Final de semana, lista matutina não será criada.");
            return;
        }

        const dataHoje = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

        // Lista noturna Franca
        const listaFrancaExistente = await ListaFrancaNoturnoViewModel.findOne({ where: { data: dataHoje } });
        if (!listaFrancaExistente) {
            await ListaFrancaNoturnoViewModel.create({ data: dataHoje });
            console.log(`Lista noturna de Franca criada para ${dataHoje}`);
        } else {
            console.log(`Lista noturna de Franca já existe para ${dataHoje}`);
        }

        // Lista noturna Passos
        const listaPassosExistente = await ListaPassosNoturnoViewModel.findOne({ where: { data: dataHoje } });
        if (!listaPassosExistente) {
            await ListaPassosNoturnoViewModel.create({ data: dataHoje });
            console.log(`Lista noturna de Passos criada para ${dataHoje}`);
        } else {
            console.log(`Lista noturna de Passos já existe para ${dataHoje}`);
        }

        // Lista noturna Batatais
        const listaBatataisExistente = await ListaBatataisViewModel.findOne({ where: { data: dataHoje } });
        if (!listaBatataisExistente) {
            await ListaBatataisViewModel.create({ data: dataHoje });
            console.log(`Lista noturna de Batatais criada para ${dataHoje}`);
        } else {
            console.log(`Lista noturna de Batatais já existe para ${dataHoje}`);
        }

    } catch (error) {
        console.error("Erro ao criar listas noturnas:", error);
    }
};

module.exports = {
    criarListaMatutino,
    criarListaNoturno
};