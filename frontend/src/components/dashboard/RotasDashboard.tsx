import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Bus } from "lucide-react";

interface Props {
    cidadeTransporte: string | null;
    turno: string | null;
}

interface PontoIda {
    horario: string;
    ponto: string;
}

interface PontoVolta {
    centro: boolean;
    horário: string;
}

interface Linha {
    nome: string;
    pontos: {
        ida: PontoIda[];
        volta: PontoVolta[];
    };
}

const francaNoturnoLinha1 = {
    ida: [
        { horario: "17:20", ponto: "Sede A.E.P." },
        { horario: "17:22", ponto: "Supermercado Arco Íris" },
        { horario: "17:25", ponto: "Ouro Verde" },
        { horario: "17:28", ponto: "Praça João Flávio" },
        { horario: "17:30", ponto: "Boi Branco" },
        { horario: "17:32", ponto: "Supermercado Tavares" },
        { horario: "17:34", ponto: "IMPAR" },
        { horario: "17:36", ponto: "Martoni" },
        { horario: "17:40", ponto: "Ponto de ônibus em frente ao Colégio" },
        { horario: "17:42", ponto: "Pernambucanas" },
        { horario: "17:45", ponto: "Brutus Lanches" },
        { horario: "17:47", ponto: "UAI" },
        { horario: "17:50", ponto: "Supermercado Araújo" },
        { horario: "17:53", ponto: "Padaria Real" },
        { horario: "17:55", ponto: "Ponto de Encontro das Linhas para saída - Posto Iguatemi" },
    ],
    volta: [
        { centro: true, horário: "22:30" },
        { centro: false, horário: "22:15" },
    ]
};

const francaNoturnoLinha2 = {
    ida: [
        { horario: "17:20", ponto: "Sede A.E.P." },
        { horario: "17:23", ponto: "Supermercado Super Minas" },
        { horario: "17:25", ponto: "Complexo San Genaro (Santa Luzia)" },
        { horario: "17:28", ponto: "Padaria Santa Luzia" },
        { horario: "17:32", ponto: "TipTop (Monselhor Felipe)" },
        { horario: "17:35", ponto: "Posto Samambaia" },
        { horario: "17:40", ponto: "Pracinha do Cristo Rei" },
        { horario: "17:45", ponto: "Senai" },
        { horario: "17:48", ponto: "Mercado Messias" },
        { horario: "17:55", ponto: "Ponto de Encontro das Linhas para saída - Posto Iguatemi" },
    ],
    volta: [
        { centro: true, horário: "22:30" },
        { centro: false, horário: "22:15" },
    ]
};

const batataisNoturno = {
    ida: [
        { horario: "17:20", ponto: "Sede AEP" },
        { horario: "17:22", ponto: "Supermercado Arco Íris" },
        { horario: "17:25", ponto: "Igreja da Abadia" },
        { horario: "17:30", ponto: "Fumpar" },
        { horario: "17:35", ponto: "Padaria Santa Luzia" },
        { horario: "17:38", ponto: "TipTop" },
        { horario: "17:43", ponto: "Extinsul" },
        { horario: "17:45", ponto: "Pracinha do Cristo Rei" },
        { horario: "17:53", ponto: "Posto Iguatemi (Saída para Franca)" },
        { horario: "18:00", ponto: "Posto Jacaré" },
        { horario: "18:05", ponto: "Ponto de Encontro da Linha para saída - Casa da Cultura" },
    ],
    volta: [
        { centro: true, horário: "22:30" },
        { centro: false, horário: "22:15" },
    ]
};

const francaMatutino = {
    ida: [
        { horario: "06:00", ponto: "Sede AEP" },
        { horario: "06:02", ponto: "Complexo do San Genaro" },
        { horario: "06:03", ponto: "Padaria Santa Luzia" },
        { horario: "06:07", ponto: "Posto Samambaia" },
        { horario: "06:08", ponto: "Pracinha do Cristo Rei" },
        { horario: "06:13", ponto: "Arena Olímpica" },
        { horario: "06:16", ponto: "Bocão Lanches" },
        { horario: "06:19", ponto: "Pernambucanas" },
        { horario: "06:21", ponto: "Brutus Lanches" },
        { horario: "06:23", ponto: "UAI" },
        { horario: "06:25", ponto: "Espaço 88" },
        { horario: "06:27", ponto: "Supermercado Araújo" },
        { horario: "06:28", ponto: "Base da Polícia do São Judas" },
        { horario: "06:30", ponto: "Ponto de Encontro da Linha para saída – Posto Iguatemi" },
    ],
    volta: [
        { centro: true, horário: "11:30" },
        { centro: false, horário: "11:15" },
    ]
};

const passosMatutino = {
    ida: [
        { horario: "05:30", ponto: "Complexo San Genaro (Sta Luzia de frente a pista de Skate)" },
        { horario: "05:32", ponto: "Padaria Santa Luzia" },
        { horario: "05:35", ponto: "Boi Branco (Av. Wenceslau Brás)" },
        { horario: "05:38", ponto: "Chico Lanches (Abadia)" },
        { horario: "05:40", ponto: "Martoni (Ponto de ônibus)" },
        { horario: "05:42", ponto: "Pernambucanas" },
        { horario: "05:45", ponto: "Espaço 88" },
        { horario: "05:46", ponto: "Supermercado Araújo" },
        { horario: "05:50", ponto: "Posto Iguatemi (Saída para Franca)" },
        { horario: "05:55", ponto: "Pracinha do Cristo Rei" },
        { horario: "06:00", ponto: "Alpínia Veículos" },
    ],
    volta: [
        { centro: true, horário: "11:30" },
        { centro: false, horário: "11:15" },
    ]
};

const passosNoturnoLinha1 = {
    ida: [
        { horario: "17:20", ponto: "Sede AEP" },
        { horario: "17:22", ponto: "Supermercado Arco Íris" },
        { horario: "17:25", ponto: "Ouro Verde" },
        { horario: "17:27", ponto: "Wenceslau Brás esquina com Santa Luzia" },
        { horario: "17:30", ponto: "Praça João Flávio" },
        { horario: "17:32", ponto: "Boi Branco" },
        { horario: "17:35", ponto: "Supermercado São Gabriel" },
        { horario: "17:38", ponto: "Chico Lanches (Abadia)" },
        { horario: "17:40", ponto: "Ponto de ônibus em frente ao Colégio" },
        { horario: "17:42", ponto: "Pernambucanas" },
        { horario: "17:45", ponto: "Brutus Lanches" },
        { horario: "17:47", ponto: "UAI" },
        { horario: "17:50", ponto: "Ponto de ônibus de frente a quadra perto do Bombeiro" },
        { horario: "17:52", ponto: "Rotatória do Senai" },
        { horario: "17:55", ponto: "Ponto de Encontro das Linhas para saída - Alpínia" },
    ],
    volta: [
        { centro: true, horário: "22:30" },
        { centro: false, horário: "22:15" },
    ]
};

const passosNoturnoLinha2 = {
    ida: [
        { horario: "17:20", ponto: "Sede AEP" },
        { horario: "17:20", ponto: "Complexo San Genaro (Santa Luzia)" },
        { horario: "17:22", ponto: "Padaria Santa Luzia" },
        { horario: "17:25", ponto: "TipTop (Monselhor Felipe)" },
        { horario: "17:32", ponto: "Supermercado Araújo" },
        { horario: "17:40", ponto: "Posto Iguatemi (Saída para Franca)" },
        { horario: "17:43", ponto: "Base da Polícia do São Judas" },
        { horario: "17:48", ponto: "Pracinha do Cristo Rei" },
        { horario: "17:55", ponto: "Ponto de Encontro das Linhas para saída - Alpínia" },
        { horario: "17:58", ponto: "Ritmo (Saída para Passos)" },
    ],
    volta: [
        { centro: true, horário: "22:30" },
        { centro: false, horário: "22:15" },
    ]
};

// Mapeamento de rotas por cidade e turno
const rotas: Record<string, Record<string, Linha[]>> = {
    Franca: {
        Noturno: [
            { nome: "Linha Noturno 1", pontos: francaNoturnoLinha1 },
            { nome: "Linha Noturno 2", pontos: francaNoturnoLinha2 },
        ],
        Matutino: [
            { nome: "Linha Matutino", pontos: francaMatutino },
        ],
        Ambos: [
            { nome: "Linha Noturno 1", pontos: francaNoturnoLinha1 },
            { nome: "Linha Noturno 2", pontos: francaNoturnoLinha2 },
            { nome: "Linha Matutino", pontos: francaMatutino },
        ],
    },
    Batatais: {
        Noturno: [
            { nome: "Linha Noturno", pontos: batataisNoturno },
        ],
        Ambos: [
            { nome: "Linha Noturno", pontos: batataisNoturno },
        ],
    },
    Passos: {
        Matutino: [
            { nome: "Linha Matutino", pontos: passosMatutino },
        ],
        Noturno: [
            { nome: "Linha Noturno 1", pontos: passosNoturnoLinha1 },
            { nome: "Linha Noturno 2", pontos: passosNoturnoLinha2 },
        ],
        Ambos: [
            { nome: "Linha Matutino", pontos: passosMatutino },
            { nome: "Linha Noturno 1", pontos: passosNoturnoLinha1 },
            { nome: "Linha Noturno 2", pontos: passosNoturnoLinha2 },
        ],
    },
};


const RotasOnibus: NextPage<Props> = ({ cidadeTransporte, turno }) => {
    const renderLinha = (
        linha: { ida: { horario: string; ponto: string }[]; volta: { centro: boolean; horário: string }[] },
        titulo: string
    ) => (
        <Card className="border border-gray-200 shadow-sm p-2">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{titulo}</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-lg font-semibold mb-2">{cidadeTransporte}</h3>

                {/* Ida */}
                <div className="flex flex-col space-y-2">
                    {linha.ida.map((ponto, index) => (
                        <div key={index} className="flex items-start gap-2">
                            {/* Indicador de timeline */}
                            <div className="flex flex-col items-center mt-1">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                {index !== linha.ida.length - 1 && <div className="w-px h-6 bg-gray-300"></div>}
                            </div>

                            {/* Conteúdo do ponto */}
                            <div className="flex flex-col text-sm">
                                <span className="flex items-center gap-1 font-semibold text-blue-600">
                                    <Clock size={14} /> {ponto.horario}
                                </span>
                                <span className="flex items-center gap-1 text-gray-800">
                                    <Bus size={14} /> {ponto.ponto}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Volta */}
                <div className="mt-4 p-2 bg-blue-50 rounded-md border border-blue-200">
                    <h4 className="text-blue-800 font-semibold mb-2">Horário de Volta</h4>
                    <div className="flex flex-col gap-1">
                        {linha.volta.map((v, idx) => (
                            <span key={idx} className="text-blue-700 font-medium text-lg">
                                {v.centro ? "Retorno do Centro" : "Retorno normal"} - {v.horário}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 overflow-x-auto">
            {cidadeTransporte && turno && rotas[cidadeTransporte]?.[turno]?.map((linha, idx) => (
                <div key={`${linha.nome}-${idx}`}>
                    {renderLinha(linha.pontos, linha.nome)}
                </div>
            ))}
        </section>


    );
};

export default RotasOnibus;
