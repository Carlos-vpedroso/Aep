"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, GraduationCap, School } from "lucide-react"
import { UserInfo } from "@/types"

interface Props {
  usuario: UserInfo
}

export default function ProfileDashboard({ usuario }: Props) {

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
      case 'aprovado':
        return 'bg-[#27AE60]/20 text-[#27AE60]'
      case 'pendente':
      case 'aguardando':
        return 'bg-[#FFB400]/20 text-[#FFB400]'
      case 'suspenso':
      case 'bloqueado':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Carteirinha do Associado */}
        <Card className="border-none shadow-xl overflow-hidden relative">
          {/* Fundo colorido da carteirinha */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0057D9] to-[#27AE60] rounded-xl -z-10"></div>
          <CardContent className="p-6 text-preto flex flex-col md:flex-row items-center gap-6">
            
            {/* Foto ou avatar */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#0057D9] font-bold text-xl">
              {usuario.nome.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Dados do associado */}
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">{usuario.nome}</h2>
              <p className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" /> {usuario.cpf || 'Não informado'}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" /> {usuario.email || 'Não informado'}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" /> {usuario.telefone || 'Não informado'}
              </p>
              <p className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {usuario.rua ? `${usuario.rua}, ${usuario.numero} - ${usuario.bairro}, ${usuario.cidade}` : 'Endereço não informado'}
              </p>

              <Badge className={getStatusColor(usuario.situacao)}>{usuario.situacao}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações Acadêmicas */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#1F1F1F] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#0057D9]" /> Informações Acadêmicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <School className="w-4 h-4" /> {usuario.faculdade || 'Faculdade não informada'}
            </p>
            <p className="text-sm text-gray-500">Curso: {usuario.curso || 'Curso não informado'}</p>
            <p className="text-sm text-gray-500">Turno: {usuario.turno || 'Não informado'}</p>
          </CardContent>
        </Card>

        {/* Observações ou Avisos */}
        <Card className="border-none shadow-md border-l-4 border-l-[#FFB400]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1F1F1F] mb-2">Avisos</h3>
            <p className="text-gray-600 text-sm">
              Certifique-se de manter seus dados atualizados. Atualizações podem ser feitas na seção Perfil.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
