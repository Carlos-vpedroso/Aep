"use client";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import {
  BusFront,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  User,
  Route,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Navigation,
  Ticket,
} from "lucide-react";
import { Button } from "../ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context";
import Spinner from "../Spinner";
import { toast } from "sonner";
import { Passagem } from "@/types";

interface Props {
  nome: string | null;
  cidadeTransporte: string | null;
  turno: string[]; // agora é um array
  id: string | null;
}

interface SubmitType {
  cidade: string | null;
  turno: string;
  embarque: string;
  desembarque: string;
}

interface FormData {
  turno: string;
  pontoIda: string;
  pontoVolta?: string;
}

// ======== LISTAS DE PONTOS ==========
const pontosFrancaNoturno = [
  "Boi Branco",
  "Brutus Lanches",
  "IMPAR",
  "Martoni",
  "Padaria Real",
  "Padaria Santa Luzia",
  "Pernambucanas",
  "Posto Samambaia",
  "Pracinha do Cristo Rei",
  "Ponto de Encontro das Linhas para saída - Posto Iguatemi",
  "Ponto de ônibus em frente ao Colégio",
  "Senai",
  "Supermercado Araújo",
  "Supermercado Super Minas",
  "Supermercado Tavares",
  "UAI",
  "Mercado Messias",
  "Ouro Verde",
  "Praça João Flávio",
  "TipTop (Monselhor Felipe)",
];

const pontosFrancaMatutino = [
  "Arena Olímpica",
  "Base da Polícia do São Judas",
  "Bocão Lanches",
  "Brutus Lanches",
  "Espaço 88",
  "Padaria Santa Luzia",
  "Pernambucanas",
  "Posto Samambaia",
  "Pracinha do Cristo Rei",
  "Sede AEP",
  "Supermercado Araújo",
  "UAI",
  "Complexo do San Genaro",
  "Ponto de Encontro da Linha para saída – Posto Iguatemi",
];

const pontosPassosNoturno = [
  "Alpínia Veículos",
  "Base da Polícia do São Judas",
  "Boi Branco",
  "Brutus Lanches",
  "Chico Lanches (Abadia)",
  "Complexo San Genaro (Santa Luzia)",
  "Posto Iguatemi (Saída para Franca)",
  "Martoni (Ponto de ônibus)",
  "Pernambucanas",
  "Posto de ônibus de frente a quadra perto do Bombeiro",
  "Ponto de Encontro das Linhas para saída - Alpínia",
  "Ponto de ônibus em frente ao Colégio",
  "Praça João Flávio",
  "Pracinha do Cristo Rei",
  "Ritmo (Saída para Passos)",
  "Supermercado Arco Íris",
  "Supermercado Araújo",
  "Supermercado São Gabriel",
  "UAI",
  "Wenceslau Brás esquina com Santa Luzia",
  "Ouro Verde",
];

const pontosPassosMatutino = [
  "Alpínia Veículos",
  "Boi Branco (Av. Wenceslau Brás)",
  "Chico Lanches (Abadia)",
  "Complexo San Genaro (Sta Luzia de frente a pista de Skate)",
  "Espaço 88",
  "Martoni (Ponto de ônibus)",
  "Padaria Santa Luzia",
  "Pernambucanas",
  "Posto Iguatemi (Saída para Franca)",
  "Pracinha do Cristo Rei",
  "Supermercado Araújo",
];

const pontosBatatais = [
  "Extinsul",
  "Fumpar",
  "Igreja da Abadia",
  "Padaria Santa Luzia",
  "Posto Iguatemi (Saída para Franca)",
  "Posto Jacaré",
  "Pracinha do Cristo Rei",
  "Sede AEP",
  "Supermercado Arco Íris",
  "TipTop",
];

// ======== FUNÇÃO QUE ESCOLHE A LISTA ==========
const getPontos = (cidade: string | null, turno: string | null) => {
  if (!cidade || !turno) return [];
  if (cidade === "Franca")
    return turno === "Matutino" ? pontosFrancaMatutino : pontosFrancaNoturno;
  if (cidade === "Passos")
    return turno === "Matutino" ? pontosPassosMatutino : pontosPassosNoturno;
  if (cidade === "Batatais") return pontosBatatais;
  return [];
};

// ======== ZOD SCHEMA ==========
const passagemSchema = z.object({
  turno: z.string().nonempty("O turno é obrigatório"),
  pontoIda: z.string().nonempty("O ponto é obrigatório"),
  pontoVolta: z.string().optional(),
});

// ======== COMPONENTE RenderSelect ==========
interface RenderSelectProps {
  lista: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const RenderSelect = ({
  lista,
  value,
  onChange,
  placeholder,
}: RenderSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0057D9]">
      <SelectValue placeholder={placeholder || "Selecione"} />
    </SelectTrigger>
    <SelectContent>
      {lista.map((ponto, index) => (
        <SelectItem key={index} value={ponto}>
          {ponto}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// ======== COMPONENTE PRINCIPAL ==========
const TravelDashboard: NextPage<Props> = ({
  nome,
  cidadeTransporte,
  turno,
  id,
}) => {
  const [newTurno, setNewTurno] = useState("");
  const [samePoint, setSamePoint] = useState(true);
  const [pontos, setPontos] = useState<string[]>([]);
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passagemSchema),
    defaultValues: {
      turno: newTurno,
      pontoIda: "",
      pontoVolta: "",
    },
  });

  // Validação do pontoVolta
  const pontoVoltaValue = watch("pontoVolta");

  useEffect(() => {
    if (pontoVoltaValue) {
      clearErrors("pontoVolta");
    }
  }, [pontoVoltaValue, clearErrors]);

  // Busca passagens já existentes
  useEffect(() => {
    const fetchPassagens = async () => {
      if (!cidadeTransporte || !id) return;

      const token = Cookies.get("token");
      if (!token) return;

      try {
        setLocalLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listas/visualizar-passagem/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ turnos: turno }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const nomeAssociado = data.associado?.nome || nome; // usa o nome vindo da API ou o prop

          // Adiciona o nome do associado em cada passagem
          const passagensComNome = data.passagens.map((p: any) => ({
            ...p,
            nomeAluno: nomeAssociado,
            cidadeTransporte: p.cidade, // também mantém a cidade, caso precise
          }));

          setPassagens(passagensComNome);
        }
      } catch (error: unknown) {
        console.error("Erro ao buscar passagens", error);
        toast.error("Erro ao buscar passagens");
      } finally {
        setLocalLoading(false);
      }
    };

    fetchPassagens();
  }, [cidadeTransporte, turno, id]);

  useEffect(() => {
    if (Array.isArray(turno)) {
      if (turno.length === 1) {
        setNewTurno(turno[0]);
      }
    } else if (typeof turno === "string") {
      setNewTurno(turno);
    }

    const lista = getPontos(cidadeTransporte, newTurno);
    setPontos(lista);
    setValue("pontoIda", "");
    setValue("pontoVolta", "");
  }, [cidadeTransporte, newTurno, setValue, turno]);

  const onSubmit = async (formData: FormData) => {
    if (!samePoint && !formData.pontoVolta) {
      setError("pontoVolta", {
        type: "manual",
        message: "O ponto de volta é obrigatório",
      });
      return;
    }

    const payload: SubmitType = {
      cidade: cidadeTransporte,
      turno: newTurno,
      embarque: formData.pontoIda,
      desembarque: samePoint
        ? formData.pontoIda
        : formData.pontoVolta || formData.pontoIda,
    };

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Você precisa estar logado para gerar a passagem.");
      return;
    }

    try {
      setLocalLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listas/adicionar-associado/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || "Erro ao gerar passagem.");
        return;
      }
      const data = await response.json();

      const novaPassagem: Passagem = {
        idPassagem: data.registro.id,
        idLista: data.lista.id,
        nomeAluno: nome, // você já tem do props/context
        cidadeTransporte: data.lista.cidade,
        turno: data.lista.turno,
        embarque: data.registro.embarque,
        desembarque: data.registro.desembarque,
        presenca: data.registro.presenca,
        statusLista: "Aberta", // ou usar outro campo se houver
        data: data.lista.data,
      };

      setPassagens((prev) => [...prev, novaPassagem]);
      toast.success("Passagem gerada com sucesso!");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setLocalLoading(false);
    }
  };

  const cancelarPassagem = async (idPassagem: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      setLocalLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listas/cancelar-passagem/${idPassagem}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        toast.error("Erro ao cancelar");
        return;
      }
      toast.success("Passagem cancelada");
      setPassagens((prev) => prev.filter((p) => p.idPassagem !== idPassagem));
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão");
    } finally {
      setLocalLoading(false);
    }
  };

  const getAmanha = () => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const dia = String(amanha.getDate()).padStart(2, "0");
    const mes = String(amanha.getMonth() + 1).padStart(2, "0");
    const ano = amanha.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const getHoje = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const getBadgeColor = (turno: string) => {
    return turno === "Matutino"
      ? "bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]"
      : "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]";
  };

  // Lógica para turno Ambos
  const turnosDisponiveis = turno || [];
  const turnosUsados = passagens.map((p) => p.turno);
  const turnosFaltando = turnosDisponiveis.filter(
    (t) => !turnosUsados.includes(t)
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F] flex items-center gap-3">
              <Ticket className="w-8 h-8 text-[#0057D9]" />
              Gerar Passagem
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas passagens para o transporte universitário
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {passagens.length} passagem(ns) ativa(s)
            </Badge>
          </div>
        </div>

        {/* Passagens Existentes */}
        {passagens.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#1F1F1F] flex items-center gap-2">
              <BusFront className="w-6 h-6 text-[#0057D9]" />
              Minhas Passagens Ativas
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {passagens.map((p, index) => (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-lg transition-all"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#0057D9] rounded-lg flex items-center justify-center">
                          <BusFront className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-[#1F1F1F]">
                            Passagem {p.turno}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {p.turno === "Matutino" ? getAmanha() : getHoje()}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getBadgeColor(p.turno)}
                      >
                        {p.turno === "Matutino" ? "🌅" : "🌙"} {p.turno}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Informações da passagem */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#0057D9]" />
                        <div>
                          <p className="text-sm text-gray-600">Passageiro</p>
                          <p className="font-semibold text-[#1F1F1F]">
                            {p.nomeAluno}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#27AE60]" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Cidade de Destino
                          </p>
                          <p className="font-semibold text-[#1F1F1F]">
                            {p.cidadeTransporte}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rota */}
                    <div className="bg-gradient-to-r from-[#0057D9]/5 to-[#27AE60]/5 p-4 rounded-lg border border-[#0057D9]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Route className="w-5 h-5 text-[#0057D9]" />
                          <span className="font-medium text-[#1F1F1F]">
                            {p.embarque}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <Navigation className="w-5 h-5 text-[#27AE60]" />
                          <span className="font-medium text-[#1F1F1F]">
                            {p.desembarque}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => cancelarPassagem(p.idPassagem)}
                      className="w-full"
                      disabled={localLoading}
                    >
                      {localLoading ? (
                        <>
                          <Spinner size="w-4 h-4" color="border-white" />
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancelar Passagem
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de Nova Passagem */}
        {turnosFaltando.length > 0 && (
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#27AE60] rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-[#1F1F1F]">
                    Nova Passagem
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados para gerar sua passagem
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informações do usuário */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1F1F1F]">
                    Passageiro
                  </Label>
                  <Input
                    type="text"
                    value={nome || ""}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1F1F1F]">
                    Cidade de Destino
                  </Label>
                  <Input
                    type="text"
                    value={cidadeTransporte || ""}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Seleção de turno */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#1F1F1F]">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Turno
                </Label>
                <Controller
                  control={control}
                  name="turno"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setNewTurno(val);
                      }}
                    >
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-[#0057D9]">
                        <SelectValue placeholder="Selecione seu turno" />
                      </SelectTrigger>
                      <SelectContent>
                        {turnosFaltando.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t === "Matutino" ? "🌅" : "🌙"} {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.turno && (
                  <p className="text-red-500 text-sm">{errors.turno.message}</p>
                )}
              </div>

              {/* Configuração de pontos */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="samePoint"
                    checked={samePoint}
                    onCheckedChange={() => setSamePoint(!samePoint)}
                  />
                  <Label
                    htmlFor="samePoint"
                    className="text-sm font-medium text-[#1F1F1F]"
                  >
                    Mesmo ponto para embarque e desembarque
                  </Label>
                </div>

                {samePoint ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#1F1F1F]">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Ponto de Embarque/Desembarque
                    </Label>
                    <Controller
                      control={control}
                      name="pontoIda"
                      render={({ field }) => (
                        <RenderSelect
                          lista={pontos}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione seu ponto"
                        />
                      )}
                    />
                    {errors.pontoIda && (
                      <p className="text-red-500 text-sm">
                        {errors.pontoIda.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#1F1F1F]">
                        <Navigation className="w-4 h-4 inline mr-1" />
                        Ponto de Embarque
                      </Label>
                      <Controller
                        control={control}
                        name="pontoIda"
                        render={({ field }) => (
                          <RenderSelect
                            lista={pontos}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Ponto de Ida"
                          />
                        )}
                      />
                      {errors.pontoIda && (
                        <p className="text-red-500 text-sm">
                          {errors.pontoIda.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#1F1F1F]">
                        <Route className="w-4 h-4 inline mr-1" />
                        Ponto de Desembarque
                      </Label>
                      <Controller
                        control={control}
                        name="pontoVolta"
                        render={({ field }) => (
                          <RenderSelect
                            lista={pontos}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Ponto de Volta"
                          />
                        )}
                      />
                      {errors.pontoVolta && (
                        <p className="text-red-500 text-sm">
                          {errors.pontoVolta.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                disabled={localLoading}
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-[#0057D9] hover:bg-[#0057D9]/90 text-white h-12"
              >
                {localLoading ? (
                  <>
                    <Spinner size="w-4 h-4" color="border-white" />
                    Gerando Passagem...
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Gerar Passagem
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Card de Informações */}
        <Card className="border-none shadow-md border-l-4 border-l-[#FFB400]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-[#FFB400] mt-1" />
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-2">
                  Informações Importantes
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    • Gere sua passagem até às 16:00h para garantir seu lugar no
                    transporte
                  </p>
                  <p>
                    • Para o turno matutino, a passagem é válida para o dia
                    seguinte
                  </p>
                  <p>
                    • Para o turno noturno, a passagem é válida para o mesmo dia
                  </p>
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

export default TravelDashboard;
