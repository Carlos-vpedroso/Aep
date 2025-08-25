import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Bus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  CreditCard,
  Settings,
  School,
  Home as HomeIcon
} from "lucide-react";
import { UserInfo } from "@/types";

interface Props {
  usuario: UserInfo;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function HomeDashboard({ usuario, setTab }: Props) {

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
      case 'aprovado':
        return 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]';
      case 'pendente':
      case 'aguardando':
        return 'bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]';
      case 'suspenso':
      case 'bloqueado':
        return 'bg-red-500/10 text-red-500 border-red-500';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const quickActions = [
    {
      title: "Gerar Passagem",
      description: "Nova viagem",
      icon: Bus,
      color: "bg-[#0057D9]",
      action: () => setTab("Travel")
    },
    {
      title: "Ver Rotas",
      description: "Horários",
      icon: Clock,
      color: "bg-[#7C3AED]",
      action: () => setTab("Rotas")
    },
    {
      title: "Pagamentos",
      description: "Histórico",
      icon: CreditCard,
      color: "bg-[#27AE60]",
      action: () => setTab("Pagamentos")
    },
    {
      title: "Editar Perfil",
      description: "Atualizar dados",
      icon: Settings,
      color: "bg-[#FFB400]",
      action: () => setTab("Perfil")
    }
  ];

  const recentActivities = [
    { action: "Passagem gerada", date: "Hoje, 14:30", status: "success" },
    { action: "Pagamento realizado", date: "Ontem, 09:15", status: "success" },
    { action: "Perfil atualizado", date: "2 dias atrás", status: "info" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header com Boas-vindas */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F]">
              Olá, {usuario.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo de volta ao seu dashboard da AEP
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className={getStatusColor(usuario.situacao)}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {usuario.situacao}
            </Badge>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-all cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F1F1F] text-sm">{action.title}</h3>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Informações Pessoais */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#1F1F1F] flex items-center gap-2">
                <User className="w-5 h-5 text-[#0057D9]" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Dados Básicos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#27AE60] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-[#1F1F1F]">{usuario.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#FFB400] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium text-[#1F1F1F]">{usuario.telefone || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">CPF</p>
                      <p className="font-medium text-[#1F1F1F]">{usuario.cpf || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#0057D9] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">RG</p>
                      <p className="font-medium text-[#1F1F1F]">{usuario.rg || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium text-[#1F1F1F]">
                      {usuario.rua && usuario.numero ?
                        `${usuario.rua}, ${usuario.numero} - ${usuario.bairro}, ${usuario.cidade} / CEP ${usuario.cep}` :
                        'Endereço não informado'
                      }
                    </p>
                  </div>
                </div>
              </div>
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
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-[#27AE60]' :
                        activity.status === 'warning' ? 'bg-[#FFB400]' : 'bg-[#0057D9]'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm text-[#1F1F1F] font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Informação */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Informações Acadêmicas */}
          <Card className="border-none shadow-md bg-gradient-to-br from-[#0057D9] to-[#0057D9]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-200" />
                    <h3 className="text-lg font-semibold">Acadêmico</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-blue-100 text-sm flex items-center gap-2">
                      <School className="w-4 h-4" />
                      {usuario.faculdade || 'Faculdade não informada'}
                    </p>
                    <p className="text-white font-medium">{usuario.curso || 'Curso não informado'}</p>
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-100 border-blue-400/30">
                      Turno: {usuario.turno || 'Não informado'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Calendar className="w-8 h-8 text-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Transporte */}
          <Card className="border-none shadow-md bg-gradient-to-br from-[#27AE60] to-[#27AE60]/80 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bus className="w-6 h-6 text-green-200" />
                    <h3 className="text-lg font-semibold">Transporte</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-green-100 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {usuario.cidadeTransporte || 'Cidade não informada'}
                    </p>
                    <p className="text-white font-medium">{usuario.modalidadeTransporte || 'Plano não informado'}</p>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(usuario.situacao)} bg-opacity-20`}
                    >
                      {usuario.situacao}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <HomeIcon className="w-8 h-8 text-green-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas e Avisos */}
        <Card className="border-none shadow-md border-l-4 border-l-[#FFB400]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-[#FFB400] mt-1" />
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-2">Lembrete Importante</h3>
                <p className="text-gray-600 text-sm">
                  Lembre-se de gerar sua passagem diária até às 16:00h para garantir seu lugar no transporte.
                  Em caso de dúvidas, entre em contato conosco através do WhatsApp ou e-mail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}