import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { UserInfo } from "@/types";

interface Props {
  usuario: UserInfo;
}

export default function HomeDashboard({usuario}:Props) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Olá, {usuario.nome}</h1>

      {/* Dados pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <User size={16} /> {usuario.nome}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} /> {usuario.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} /> {usuario.telefone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {usuario.rua}, {usuario.numero} - {usuario.bairro}, {usuario.cidade} / CEP {usuario.cep}
          </div>
        </CardContent>
      </Card>

      {/* Acadêmico */}
      <Card>
        <CardHeader>
          <CardTitle>Acadêmico</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{usuario.faculdade} - {usuario.curso}</p>
          <p>Turno: {usuario.turno}</p>
        </CardContent>
      </Card>

      {/* Transporte */}
      <Card>
        <CardHeader>
          <CardTitle>Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cidade: {usuario.cidadeTransporte}</p>
          <p>Plano: {usuario.modalidadeTransporte}</p>
          <p>Status: {usuario.situacao}</p>
        </CardContent>
      </Card>
    </div>
  );
}
