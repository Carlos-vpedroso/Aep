import { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context";

const AguardarAprovacao: NextPage = () => {
  const { Logout } = useAuth();

  const etapasProcesso = [
    {
      titulo: "Cadastro Realizado",
      descricao: "Suas informações foram enviadas com sucesso",
      status: "concluido",
      icone: CheckCircle2,
    },
    {
      titulo: "Análise em Andamento",
      descricao: "Nossa equipe está verificando seus dados",
      status: "atual",
      icone: RefreshCw,
    },
    {
      titulo: "Contato da Associação",
      descricao: "Entraremos em contato para finalizar o processo",
      status: "pendente",
      icone: Phone,
    },
    {
      titulo: "Acesso Liberado",
      descricao: "Você poderá acessar todas as funcionalidades",
      status: "pendente",
      icone: UserCheck,
    },
  ];

  const informacoesContato = [
    {
      tipo: "WhatsApp",
      valor: "(35) 99122-0988",
      icone: Phone,
      cor: "text-[#27AE60]",
    },
    {
      tipo: "E-mail",
      valor: "contato@aepssp.com",
      icone: Mail,
      cor: "text-[#0057D9]",
    },
  ];

  return (
    <div className="min-h-screen mx-auto bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header Principal */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#FFB400] rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">
              Cadastro em Análise
            </h1>
            <p className="text-gray-600 text-lg">
              Seu cadastro foi realizado com sucesso! Agora é só aguardar nossa
              análise.
            </p>
          </div>

          <Badge className="bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400] text-sm px-4 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Aguardando Aprovação
          </Badge>
        </div>

        {/* Status do Processo */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1F1F1F] text-xl">
              Acompanhe o Status do Seu Cadastro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {etapasProcesso.map((etapa, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Indicador de Status */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        etapa.status === "concluido"
                          ? "bg-[#27AE60] text-white"
                          : etapa.status === "atual"
                          ? "bg-[#FFB400] text-white animate-pulse"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <etapa.icone
                        className={`w-6 h-6 ${
                          etapa.status === "atual" ? "animate-spin" : ""
                        }`}
                      />
                    </div>
                    {index !== etapasProcesso.length - 1 && (
                      <div
                        className={`w-px h-8 mt-2 ${
                          etapa.status === "concluido"
                            ? "bg-[#27AE60]"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  {/* Conteúdo da Etapa */}
                  <div className="flex-1 pb-4">
                    <h3
                      className={`text-lg font-semibold ${
                        etapa.status === "concluido"
                          ? "text-[#27AE60]"
                          : etapa.status === "atual"
                          ? "text-[#FFB400]"
                          : "text-gray-500"
                      }`}
                    >
                      {etapa.titulo}
                    </h3>
                    <p className="text-gray-600 mt-1">{etapa.descricao}</p>
                    {etapa.status === "atual" && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-[#FFB400] border-[#FFB400]"
                      >
                        Em andamento
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Tempo Estimado */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#0057D9] to-[#0057D9]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-blue-200" />
                <div>
                  <h3 className="text-lg font-semibold">Tempo Estimado</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    A análise geralmente leva de 1 a 3 dias úteis
                  </p>
                  <p className="text-xl font-bold mt-2">24-72 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-purple-200" />
                <div>
                  <h3 className="text-lg font-semibold">Próximos Passos</h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Entraremos em contato via WhatsApp ou e-mail
                  </p>
                  <p className="text-sm font-medium mt-2">
                    Fique atento às notificações!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Contato */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#1F1F1F] text-xl flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#27AE60]" />
              Precisa de Ajuda?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Se tiver alguma dúvida ou precisar de mais informações, entre em
              contato conosco:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {informacoesContato.map((contato, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <contato.icone className={`w-5 h-5 ${contato.cor}`} />
                  <div>
                    <p className="font-medium text-[#1F1F1F]">{contato.tipo}</p>
                    <p className="text-sm text-gray-600">{contato.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Horário de Atendimento:</strong> Segunda à Sexta, das 8h
                às 18h
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-center gap-4">
          {/* <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-[#0057D9] text-[#0057D9] hover:bg-[#0057D9]/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Status
          </Button> */}

          <Button
            variant="outline"
            onClick={Logout}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Obrigado por escolher a Associação de Estudantes! Em breve você terá
            acesso completo ao sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AguardarAprovacao;
