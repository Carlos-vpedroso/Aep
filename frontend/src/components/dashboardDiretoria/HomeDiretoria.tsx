import { NextPage } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  User,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Faturamento,
  QuantidadeAssociadosModalidade,
  QuantidadeAssociadosSituacao,
} from "@/types";
import { useAuth } from "@/context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Spinner from "../Spinner";
import FaturamentoMensalChart from "../FaturamentoMensalChart";

interface Props {
  quantidadesModalidade: QuantidadeAssociadosModalidade;
  quantidadesSituacao: QuantidadeAssociadosSituacao;
  faturamento: Faturamento[];
}

const HomeDiretoria: NextPage<Props> = ({
  quantidadesModalidade,
  quantidadesSituacao,
  faturamento,
}: Props) => {
  const { loading } = useAuth();
  const totalAssociadosCadastrados =
    quantidadesSituacao.Ativo +
    quantidadesSituacao.Inativo +
    quantidadesSituacao.Pendente;
  const valorMensalidade = 450;
  const valorTotalArrecadado = quantidadesModalidade.Mensal * valorMensalidade;
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorTotalArrecadado);
  const dadosFaturamento = faturamento.map((item) => ({
    mes: item.mes.toUpperCase(), // opcional: deixar mais bonito (JAN, FEV…)
    valor: item.valor,
  }));

  const kpiData = [
    {
      title: "Receita Total - Mensalistas",
      value: valorFormatado,
      icon: DollarSign,
      color: "text-[#27AE60]",
    },
    {
      title: "Mensalistas",
      value: quantidadesModalidade.Mensal,
      icon: Users,
      color: "text-[#0057D9]",
    },
    {
      title: "Diaristas",
      value: quantidadesModalidade.Diaria,
      icon: User,
      color: "text-[#FFB400]",
    },
    {
      title: "Informações Do Cadastro",
      icon: Activity,
      color: "text-[#7C3AED]",
      carouselItems: [
        {
          title: "Associados Pendentes",
          value: quantidadesSituacao.Pendente,
        },
        {
          title: "Associados Ativos",
          value: quantidadesSituacao.Ativo,
        },
        {
          title: "Associados Inativos",
          value: quantidadesSituacao.Inativo,
        },
        {
          title: "Total de Usuários Cadastrados",
          value: totalAssociadosCadastrados,
        },
      ],
    },
  ];

  const recentActivities = [
    {
      action: "Novo usuário cadastrado",
      time: "2 min atrás",
      status: "success",
    },
    { action: "Pagamento processado", time: "5 min atrás", status: "success" },
    { action: "Sistema atualizado", time: "1h atrás", status: "info" },
    { action: "Backup realizado", time: "2h atrás", status: "success" },
    {
      action: "Erro no servidor corrigido",
      time: "4h atrás",
      status: "warning",
    },
  ];

  // 🔹 Se loading estiver true, renderiza apenas o Spinner centralizado
  if (loading) {
    return (
      <div className="rounded-md flex flex-1 min-h-screen justify-center items-center bg-white">
        <Spinner size="w-10 h-10" color="border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F]">
              Dashboard Diretoria
            </h1>
            <p className="text-gray-600 mt-1">Panorama geral da aplicação</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-[#27AE60] border-[#27AE60]"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Sistema Online
            </Badge>
            <Button className="bg-[#0057D9] hover:bg-[#0057D9]/90 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => {
            const isLast = index === kpiData.length - 1;

            if (isLast && kpi.carouselItems) {
              return (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-lg transition-shadow p-4 select-none"
                >
                  <CardContent className="p-0 flex items-center gap-4">
                    {/* Ícone à esquerda */}
                    <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    {/* Carousel à direita */}
                    <div className="flex-1 overflow-hidden">
                      <Carousel
                        className="w-full"
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        plugins={[
                          Autoplay({
                            delay: 5000,
                          }),
                        ]}
                      >
                        <CarouselContent>
                          {kpi.carouselItems.map((item, idx) => (
                            <CarouselItem
                              key={idx}
                              className="flex flex-col items-start justify-center h-32 p-4 bg-white rounded-md"
                            >
                              <p className="text-sm text-gray-600">
                                {item.title}
                              </p>
                              <p className="text-2xl font-bold text-[#1F1F1F]">
                                {item.value}
                              </p>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card
                key={index}
                className="border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{kpi.title}</p>
                        <p className="text-2xl font-bold text-[#1F1F1F]">
                          {kpi.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico Principal */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1F1F1F]">
                    Performance Mensal
                  </CardTitle>
                  <CardDescription>
                    Análise comparativa dos últimos 6 meses
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0057D9] text-[#0057D9] hover:bg-[#0057D9]/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardContent>
                <div className="h-64 rounded-lg border border-gray-100 p-2">
                  <FaturamentoMensalChart data={dadosFaturamento} />
                </div>
              </CardContent>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#1F1F1F] flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-[#27AE60]"
                          : activity.status === "warning"
                          ? "bg-[#FFB400]"
                          : "bg-[#0057D9]"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-[#1F1F1F] font-medium">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer com Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-[#0057D9] to-[#0057D9]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Transações</p>
                  <p className="text-2xl font-bold">4.321</p>
                  <p className="text-xs text-blue-200 mt-1">Últimos 30 dias</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-[#27AE60] to-[#27AE60]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Metas Atingidas</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-green-200 mt-1">Este mês</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Uptime do Sistema</p>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-xs text-purple-200 mt-1">Últimos 7 dias</p>
                </div>
                <Activity className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeDiretoria;
