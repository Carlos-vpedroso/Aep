import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Bus,
  MapPin,
  ArrowRight,
  Route,
  Calendar,
  Timer,
  Navigation,
  Users,
  Info,
} from "lucide-react";

interface Props {
  cidadeTransporte: string | null;
  turno: string[] | null;
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
    {
      horario: "17:55",
      ponto: "Ponto de Encontro das Linhas para saída - Posto Iguatemi",
    },
  ],
  volta: [
    { centro: true, horário: "22:30" },
    { centro: false, horário: "22:15" },
  ],
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
    {
      horario: "17:55",
      ponto: "Ponto de Encontro das Linhas para saída - Posto Iguatemi",
    },
  ],
  volta: [
    { centro: true, horário: "22:30" },
    { centro: false, horário: "22:15" },
  ],
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
    {
      horario: "18:05",
      ponto: "Ponto de Encontro da Linha para saída - Casa da Cultura",
    },
  ],
  volta: [
    { centro: true, horário: "22:30" },
    { centro: false, horário: "22:15" },
  ],
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
    {
      horario: "06:30",
      ponto: "Ponto de Encontro da Linha para saída – Posto Iguatemi",
    },
  ],
  volta: [
    { centro: true, horário: "11:30" },
    { centro: false, horário: "11:15" },
  ],
};

const passosMatutino = {
  ida: [
    {
      horario: "05:30",
      ponto: "Complexo San Genaro (Sta Luzia de frente a pista de Skate)",
    },
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
  ],
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
    {
      horario: "17:50",
      ponto: "Ponto de ônibus de frente a quadra perto do Bombeiro",
    },
    { horario: "17:52", ponto: "Rotatória do Senai" },
    {
      horario: "17:55",
      ponto: "Ponto de Encontro das Linhas para saída - Alpínia",
    },
  ],
  volta: [
    { centro: true, horário: "22:30" },
    { centro: false, horário: "22:15" },
  ],
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
    {
      horario: "17:55",
      ponto: "Ponto de Encontro das Linhas para saída - Alpínia",
    },
    { horario: "17:58", ponto: "Ritmo (Saída para Passos)" },
  ],
  volta: [
    { centro: true, horário: "22:30" },
    { centro: false, horário: "22:15" },
  ],
};

// Mapeamento de rotas por cidade e turno
const rotas: Record<string, Record<string, Linha[]>> = {
  Franca: {
    Noturno: [
      { nome: "Linha Noturno 1", pontos: francaNoturnoLinha1 },
      { nome: "Linha Noturno 2", pontos: francaNoturnoLinha2 },
    ],
    Matutino: [{ nome: "Linha Matutino", pontos: francaMatutino }],
    Ambos: [
      { nome: "Linha Noturno 1", pontos: francaNoturnoLinha1 },
      { nome: "Linha Noturno 2", pontos: francaNoturnoLinha2 },
      { nome: "Linha Matutino", pontos: francaMatutino },
    ],
  },
  Batatais: {
    Noturno: [{ nome: "Linha Noturno", pontos: batataisNoturno }],
    Ambos: [{ nome: "Linha Noturno", pontos: batataisNoturno }],
  },
  Passos: {
    Matutino: [{ nome: "Linha Matutino", pontos: passosMatutino }],
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
  const getLinhaColor = (nomeLinhaIndex: number) => {
    const cores = ["#0057D9", "#27AE60", "#7C3AED", "#FFB400"];
    return cores[nomeLinhaIndex % cores.length];
  };

  const getTurnoInfo = (nome: string) => {
    if (nome.includes("Matutino")) {
      return {
        badge: "Matutino",
        color: "bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]",
        icon: "🌅",
      };
    }
    return {
      badge: "Noturno",
      color: "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]",
      icon: "🌙",
    };
  };

  const calcularTempoViagem = (pontos: PontoIda[]) => {
    if (pontos.length < 2) return "0 min";
    const inicio = pontos[0].horario;
    const fim = pontos[pontos.length - 1].horario;

    const [horaInicio, minInicio] = inicio.split(":").map(Number);
    const [horaFim, minFim] = fim.split(":").map(Number);

    const totalMin = horaFim * 60 + minFim - (horaInicio * 60 + minInicio);
    return `${totalMin} min`;
  };

  const renderLinha = (
    linha: {
      ida: { horario: string; ponto: string }[];
      volta: { centro: boolean; horário: string }[];
    },
    titulo: string,
    index: number
  ) => {
    const corLinha = getLinhaColor(index);
    const turnoInfo = getTurnoInfo(titulo);
    const tempoViagem = calcularTempoViagem(linha.ida);

    return (
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Header da linha */}
        <div className="h-2" style={{ backgroundColor: corLinha }} />

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: corLinha }}
              >
                <Route className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-[#1F1F1F] text-lg">
                  {titulo}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">
                    {cidadeTransporte}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={turnoInfo.color}>
              {turnoInfo.icon} {turnoInfo.badge}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações da rota */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="w-5 h-5 text-[#0057D9] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Paradas</p>
              <p className="font-semibold text-[#1F1F1F]">{linha.ida.length}</p>
            </div>
            <div className="text-center">
              <Timer className="w-5 h-5 text-[#27AE60] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Duração</p>
              <p className="font-semibold text-[#1F1F1F]">{tempoViagem}</p>
            </div>
            <div className="text-center">
              <Navigation className="w-5 h-5 text-[#FFB400] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Saída</p>
              <p className="font-semibold text-[#1F1F1F]">
                {linha.ida[0]?.horario}
              </p>
            </div>
          </div>

          {/* Timeline da ida */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-[#27AE60]" />
              <h4 className="font-semibold text-[#1F1F1F]">Rota de Ida</h4>
            </div>

            <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
              {linha.ida.map((ponto, index) => (
                <div key={index} className="flex items-start gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                        index === 0
                          ? "bg-[#27AE60]"
                          : index === linha.ida.length - 1
                          ? "bg-[#FFB400]"
                          : "bg-[#0057D9]"
                      }`}
                    />
                    {index !== linha.ida.length - 1 && (
                      <div className="w-px h-8 bg-gray-300 mt-1" />
                    )}
                  </div>

                  {/* Conteúdo do ponto */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1F1F1F] text-sm">
                          {ponto.ponto}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock
                            className="w-3 h-3"
                            style={{ color: corLinha }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: corLinha }}
                          >
                            {ponto.horario}
                          </span>
                        </div>
                      </div>
                      {(index === 0 || index === linha.ida.length - 1) && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            index === 0
                              ? "bg-[#27AE60]/10 text-[#27AE60]"
                              : "bg-[#FFB400]/10 text-[#FFB400]"
                          }`}
                        >
                          {index === 0 ? "Início" : "Destino"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horários de retorno */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-5 h-5 text-[#7C3AED] rotate-180" />
              <h4 className="font-semibold text-[#1F1F1F]">
                Horários de Retorno
              </h4>
            </div>

            <div className="space-y-2">
              {linha.volta.map((volta, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-[#7C3AED]/5 to-[#7C3AED]/10 rounded-lg border border-[#7C3AED]/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#7C3AED] rounded-full" />
                    <span className="font-medium text-[#1F1F1F]">
                      {volta.centro ? "Retorno do Centro" : "Retorno Normal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7C3AED]" />
                    <span className="font-bold text-[#7C3AED]">
                      {volta.horário}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const linhasDisponiveis =
    cidadeTransporte && turno?.length
      ? turno.flatMap((t) => rotas[cidadeTransporte]?.[t] || [])
      : [];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F] flex items-center gap-3">
              <Bus className="w-8 h-8 text-[#0057D9]" />
              Rotas de Transporte
            </h1>
            <p className="text-gray-600 mt-1">
              Horários e paradas para {cidadeTransporte} - {turno?.join(" e ")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-[#0057D9]/10 text-[#0057D9] border-[#0057D9]">
              <Calendar className="w-3 h-3 mr-1" />
              {linhasDisponiveis.length}{" "}
              {linhasDisponiveis.length === 1 ? "linha" : "linhas"}
            </Badge>
            <Button
              variant="outline"
              className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60]/10"
            >
              <Info className="w-4 h-4 mr-2" />
              Informações
            </Button>
          </div>
        </div>

        {/* Grid de rotas */}
        {linhasDisponiveis.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {linhasDisponiveis.map((linha, idx) => (
              <div key={`${linha.nome}-${idx}`}>
                {renderLinha(linha.pontos, linha.nome, idx)}
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-md">
            <CardContent className="p-12 text-center">
              <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F1F1F] mb-2">
                Nenhuma rota encontrada
              </h3>
              <p className="text-gray-600">
                Não há rotas disponíveis para {cidadeTransporte} no turno{" "}
                {turno?.join(" e ")}.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card de informações importantes */}
        <Card className="border-none shadow-md border-l-4 border-l-[#FFB400]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-[#FFB400] mt-1" />
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-2">
                  Informações Importantes
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    • Os horários podem sofrer alterações conforme as condições
                    de trânsito
                  </p>
                  <p>• É necessário ter a passagem gerada para embarcar</p>
                  <p>
                    • Chegue ao ponto com pelo menos 5 minutos de antecedência
                  </p>
                  <p>• Em caso de dúvidas, entre em contato conosco</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RotasOnibus;
