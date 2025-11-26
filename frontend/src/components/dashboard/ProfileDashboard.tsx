"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  School,
  Pencil,
} from "lucide-react";
import { UserInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { maskPhone, maskCEP } from "@/lib/masks";
import Cookies from "js-cookie";
import { useAuth } from "@/context";

interface Props {
  usuario: UserInfo;
}

export default function ProfileDashboard({ usuario }: Props) {
  const { setUserInfo } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
      case "aprovado":
        return "bg-[#27AE60]/20 text-[#27AE60]";
      case "pendente":
      case "aguardando":
        return "bg-[#FFB400]/20 text-[#FFB400]";
      case "suspenso":
      case "bloqueado":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const [loading, setLoading] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);
  const [formData, setFormData] = useState({
    telefone: usuario.telefone,
    cep: usuario.cep,
    rua: usuario.rua,
    numero: usuario.numero,
    bairro: usuario.bairro,
    cidade: usuario.cidade,
  });

  const buscarEndereco = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP inválido");
      } else {
        setFormData((prev) => ({
          ...prev,
          cep: data.cep,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        }));
      }
    } catch {
      toast.error("Erro ao buscar endereço");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Você não está autenticado.");
        return;
      }
      const payload = {
        telefone: formData.telefone,
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          bairro: formData.bairro,
          cidade: formData.cidade,
          numero: formData.numero,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/associados/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao atualizar perfil.");
        return;
      }
      // 🔥 Desestrutura o endereço corretamente
      const { endereco, ...resto } = data;

      const usuarioFormatado = {
        ...resto,
        cep: endereco?.cep ?? "",
        rua: endereco?.rua ?? "",
        bairro: endereco?.bairro ?? "",
        cidade: endereco?.cidade ?? "",
        numero: endereco?.numero ?? "",
      };

      // Atualiza contexto do usuário
      setUserInfo(usuarioFormatado);
      toast.success("Perfil atualizado com sucesso!");
      setModalPerfil(false);
    } catch (error) {
      toast.error("Erro ao enviar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Topo com o botão de editar */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1F1F1F]">Meu Perfil</h1>
        </div>

        {/* Carteirinha */}
        <Card className="border-none shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0057D9] to-[#27AE60] opacity-90 rounded-xl -z-10" />

          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-white text-[#0057D9] flex items-center justify-center font-bold text-3xl shadow-md">
              {usuario.nome
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            {/* Informações */}
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">{usuario.nome}</h2>

              <p className="text-sm flex items-center gap-2 opacity-90">
                <User className="w-4 h-4" /> {usuario.cpf || "Não informado"}
              </p>

              <p className="text-sm flex items-center gap-2 opacity-90">
                <Mail className="w-4 h-4" /> {usuario.email || "Não informado"}
              </p>

              <p className="text-sm flex items-center gap-2 opacity-90">
                <Phone className="w-4 h-4" />{" "}
                {usuario.telefone || "Não informado"}
              </p>

              <p className="text-sm flex items-center gap-2 opacity-90">
                <MapPin className="w-4 h-4" />
                {usuario.rua
                  ? `${usuario.rua}, ${usuario.numero} - ${usuario.bairro}, ${usuario.cidade}`
                  : "Endereço não informado"}
              </p>

              <Badge className={`${getStatusColor(usuario.situacao)} mt-2`}>
                {usuario.situacao}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              className="bg-[#0057D9] hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
              onClick={() => setModalPerfil(true)}
            >
              <Pencil size={18} /> Editar Perfil
            </Button>
          </CardFooter>
        </Card>

        {/* Informações Acadêmicas */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-[#1F1F1F] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#0057D9]" />
              Informações Acadêmicas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <School className="w-4 h-4 text-[#0057D9]" />
              {usuario.faculdade || "Faculdade não informada"}
            </p>

            <p>Curso: {usuario.curso || "Curso não informado"}</p>
            <p className="flex items-center gap-2">
              Turno:
              {usuario.turno?.length > 0
                ? usuario.turno.map((t, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm ${
                        t === "Matutino" ? "bg-yellow-100" : "bg-purple-100"
                      }`}
                    >
                      {t}
                    </span>
                  ))
                : "Não informado"}
            </p>
          </CardContent>
          {/*  Caso queremos alterar a faculdade do usuário */}
          {/* <CardFooter className="justify-end">
            <Button
              className="bg-[#0057D9] hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
              onClick={() => setModalFaculdade(true)}
            >
              <Pencil size={18} /> Editar Faculdade
            </Button>
          </CardFooter> */}
        </Card>

        {/* Avisos */}
        <Card className="shadow-md border-l-4 border-l-[#FFB400]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1F1F1F] mb-2">Avisos</h3>
            <p className="text-gray-600 text-sm">
              Mantenha seus dados atualizados para evitar problemas.
            </p>
          </CardContent>
        </Card>
      </div>
      <Dialog open={modalPerfil} onOpenChange={setModalPerfil}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Telefone */}
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input
                value={formData.telefone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    telefone: maskPhone(e.target.value),
                  }))
                }
                placeholder="Digite o telefone"
              />
            </div>

            {/* CEP */}
            <div className="space-y-1">
              <Label>CEP</Label>
              <Input
                value={formData.cep || ""}
                onChange={(e) => {
                  const rawCEP = e.target.value; // valor digitado
                  const maskedCEP = maskCEP(rawCEP); // aplica a máscara

                  setFormData((prev) => ({
                    ...prev,
                    cep: maskedCEP, // atualiza o campo corretamente
                  }));

                  const onlyNumbers = rawCEP.replace(/\D/g, "");

                  if (onlyNumbers.length === 8) {
                    buscarEndereco(onlyNumbers); // chama API
                  }
                }}
                placeholder="CEP"
              />
            </div>

            {/* Rua */}
            <div className="space-y-1">
              <Label>Rua</Label>
              <Input
                value={formData.rua || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rua: e.target.value }))
                }
                placeholder="Rua"
              />
            </div>

            {/* Número */}
            <div className="space-y-1">
              <Label>Número</Label>
              <Input
                value={formData.numero || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, numero: e.target.value }))
                }
                placeholder="Número"
              />
            </div>

            {/* Bairro */}
            <div className="space-y-1">
              <Label>Bairro</Label>
              <Input
                value={formData.bairro || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bairro: e.target.value }))
                }
                placeholder="Bairro"
              />
            </div>

            {/* Cidade */}
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Input
                value={formData.cidade || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cidade: e.target.value }))
                }
                placeholder="Cidade"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalPerfil(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#0057D9] text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
