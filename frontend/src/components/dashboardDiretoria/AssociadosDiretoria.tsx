import { NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Users,
  MapPin,
  Clock,
  Edit,
  Trash2,
  CreditCard,
  User,
  Pencil,
  School,
} from "lucide-react";
import { useAuth } from "@/context";
import Spinner from "../Spinner";
import {
  QuantidadeAssociadosCidade,
  QuantidadeAssociadosModalidade,
  QuantidadeAssociadosSituacao,
} from "@/types";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

export interface Associado {
  id: string;
  email: string;
  cpf: string;
  rg: string;
  nome: string;
  foto: string | null;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  faculdade: string;
  curso: string;
  turno: string[]; // array de strings
  situacao: string;
  cidadeTransporte: string;
  modalidadeTransporte: string;
  confirmationToken: string | null;
  validado: boolean;
  firstTime: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FiltrosAssociado {
  turno?: string;
  cidade?: string;
  data?: string; // ou Date
  situacao?: string;
  faculdade?: string;
  curso?: string;
  nome?: string;
  cpf?: string;
  modalidadeTransporte?: string;
  cidadeTransporte?: string;
  validado?: boolean;
  firstTime?: boolean;
}

interface Props {
  quantidadesCidade: QuantidadeAssociadosCidade;
  quantidadesModalidade: QuantidadeAssociadosModalidade;
  quantidadesSituacao: QuantidadeAssociadosSituacao;
}

const AssociadosDiretoria: NextPage<Props> = ({
  quantidadesCidade,
  quantidadesModalidade,
  quantidadesSituacao,
}: Props) => {
  const totalAssociadosCadastrados =
    quantidadesSituacao.Ativo +
    quantidadesSituacao.Inativo +
    quantidadesSituacao.Pendente;
  const kpiData = [
    {
      title: "Associados",
      icon: Users,
      color: ["text-azul", "text-verde", "text-yellow-500", "text-gray-500"],
      bg: ["bg-azul/10", "bg-verde/10", "bg-yellow-900/10", "bg-gray-900/10"],
      carouselItems: [
        { title: "Total Cadastrado", value: totalAssociadosCadastrados },
        { title: "Ativos", value: quantidadesSituacao.Ativo },
        { title: "Pendentes", value: quantidadesSituacao.Pendente },
        { title: "Inativos", value: quantidadesSituacao.Inativo },
      ],
    },
    {
      title: "Cidades",
      icon: MapPin,
      color: ["text-azul", "text-verde", "text-yellow-500"],
      bg: ["bg-azul/10", "bg-verde/10", "bg-yellow-900/10"],
      carouselItems: [
        { title: "Franca", value: quantidadesCidade.Franca },
        { title: "Passos", value: quantidadesCidade.Passos },
        { title: "Batatais", value: quantidadesCidade.Batatais },
      ],
    },
    {
      title: "Modalidade",
      icon: CreditCard,
      color: ["text-azul", "text-verde"],
      bg: ["bg-azul/10", "bg-verde/10"],
      carouselItems: [
        { title: "Mensalistas", value: quantidadesModalidade.Mensal },
        { title: "Diáristas", value: quantidadesModalidade.Diaria },
      ],
    },
  ];

  const { loading, setLoading } = useAuth();
  const [dados, setDados] = useState<Associado[]>([]);
  const [filteredDados, setFilteredDados] = useState<Associado[]>([]);
  const [filtros, setFiltros] = useState<FiltrosAssociado>({
    turno: "",
    cidade: "",
    data: new Date().toISOString().split("T")[0], // Data de hoje
    situacao: "",
    faculdade: "",
    curso: "",
    nome: "",
    cpf: "",
    modalidadeTransporte: "",
    cidadeTransporte: "",
    validado: undefined,
    firstTime: undefined,
  });

  // Opções para os selects
  const turnos = [
    { value: "Matutino", label: "Matutino" },
    { value: "Noturno", label: "Noturno" },
    { value: "Ambos", label: "Ambos" },
  ];

  const cidades = [
    { value: "Franca", label: "Franca" },
    { value: "Passos", label: "Passos" },
    { value: "Batatais", label: "Batatais" },
  ];

  const situacao = [
    { value: "Ativo", label: "Ativo" },
    { value: "Pendente", label: "Pendente" },
    { value: "Inativo", label: "Inativo" },
  ];

  const modalidadeTransporte = [
    { value: "Mensalista", label: "Mensal" },
    { value: "Diarista", label: "Diária" },
  ];

  const faculdades = [
    { value: "UNIFRAN", label: "UNIFRAN" },
    { value: "FDF", label: "FDF" },
    { value: "UEMG", label: "UEMG" },
    { value: "IFSul", label: "IFSul" },
    { value: "Claretiano", label: "Claretiano" },
  ];

  // Função para buscar dados da API
  const fetchDados = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) return;
      // Simular chamada da API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/associados`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      setDados(data);
      setFilteredDados(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    let dadosFiltrados = [...dados];

    // Filtro por nome
    if (filtros.nome && filtros.nome.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.nome.toLowerCase().includes(filtros.nome!.toLowerCase())
      );
    }

    // Filtro por CPF
    if (filtros.cpf && filtros.cpf.trim() !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        item.cpf.includes(filtros.cpf!)
      );
    }

    // Filtro por situação
    if (filtros.situacao && filtros.situacao !== "") {
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.situacao === filtros.situacao
      );
    }

    // Filtro por faculdade
    if (filtros.faculdade && filtros.faculdade !== "") {
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.faculdade === filtros.faculdade
      );
    }

    // Filtro por turno
    if (filtros.turno && filtros.turno !== "") {
      dadosFiltrados = dadosFiltrados.filter((item) => {
        if (filtros.turno === "Ambos") {
          // Verifica se o item possui exatamente ["Matutino", "Noturno"] (ou vice-versa)
          const turnosItem = item.turno.sort(); // garante a ordem
          const ambos = ["Matutino", "Noturno"].sort();
          return JSON.stringify(turnosItem) === JSON.stringify(ambos);
        } else {
          // Se não for "Ambos", verifica se o array contém o turno selecionado
          return item.turno.includes(filtros.turno!);
        }
      });
    }

    // Filtro por cidade
    if (filtros.cidade && filtros.cidade !== "") {
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.cidadeTransporte === filtros.cidade
      );
    }

    // Filtro por modalidade de transporte
    if (filtros.modalidadeTransporte && filtros.modalidadeTransporte !== "") {
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.modalidadeTransporte === filtros.modalidadeTransporte
      );
    }

    // Filtro por cidadeTransporte (caso queira diferenciar da cidade da faculdade)
    if (filtros.cidadeTransporte && filtros.cidadeTransporte !== "") {
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.cidadeTransporte === filtros.cidadeTransporte
      );
    }

    setFilteredDados(dadosFiltrados);
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      turno: "",
      cidade: "",
      data: new Date().toISOString().split("T")[0], // Data de hoje
      situacao: "",
      faculdade: "",
      curso: "",
      nome: "",
      cpf: "",
      modalidadeTransporte: "",
      cidadeTransporte: "",
      validado: undefined,
      firstTime: undefined,
    });
  };

  // Função para exportar dados
  const exportarDados = () => {
    // Implementar lógica de exportação
    console.log("Exportando dados...", filteredDados);
  };

  // Função para obter cor do badge baseado na situação
  const getBadgeColor = (situacao: string) => {
    switch (situacao) {
      case "Ativo":
        return "bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20";
      case "Inativo":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Pendente":
        return "bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // Loading da autenticação
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
              Associados A.E.P.
            </h1>
            <p className="text-gray-600 mt-1">
              Consulte e gerencie os associados cadastrados
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={exportarDados}
              className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={aplicarFiltros}
              disabled={loading}
              className="bg-[#0057D9] hover:bg-[#0057D9]/90 text-white"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {loading ? "Carregando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#1F1F1F] flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>
              Utilize os filtros abaixo para refinar sua consulta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Input Nome */}
              <div className="space-y-2">
                <Label
                  htmlFor="nome"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <User className="inline w-4 h-4 text-preto" />
                  Nome
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite o nome"
                  value={filtros.nome}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, nome: e.target.value }))
                  }
                />
              </div>

              {/* Select Situação */}
              <div className="space-y-2">
                <Label
                  htmlFor="situacao"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <Pencil className="inline w-4 h-4 text-preto" />
                  Situação
                </Label>
                <Select
                  value={filtros.situacao}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, situacao: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {situacao.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Faculdade */}
              <div className="space-y-2">
                <Label
                  htmlFor="faculdade"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <School className="inline w-4 h-4 text-preto" />
                  Faculdade
                </Label>
                <Select
                  value={filtros.faculdade}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, faculdade: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a faculdade" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculdades.map((fac) => (
                      <SelectItem key={fac.value} value={fac.value}>
                        {fac.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Turno */}
              <div className="space-y-2">
                <Label
                  htmlFor="turno"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Turno
                </Label>
                <Select
                  value={filtros.turno}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, turno: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {turnos.map((turno) => (
                      <SelectItem key={turno.value} value={turno.value}>
                        {turno.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Cidade */}
              <div className="space-y-2">
                <Label
                  htmlFor="cidade"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Cidade
                </Label>
                <Select
                  value={filtros.cidade}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, cidade: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade.value} value={cidade.value}>
                        {cidade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Select Modalidade */}
              <div className="space-y-2">
                <Label
                  htmlFor="situacao"
                  className="text-sm font-medium text-[#1F1F1F]"
                >
                  <CreditCard className="inline w-4 h-4 text-preto" />
                  Situação
                </Label>
                <Select
                  value={filtros.modalidadeTransporte}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({
                      ...prev,
                      modalidadeTransporte: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalidadeTransporte.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <Button
                onClick={aplicarFiltros}
                disabled={loading}
                className="bg-[#0057D9] hover:bg-[#0057D9]/90 text-white"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Aplicar Filtros
              </Button>
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardHeader className="text-lg font-semibold">
                {kpi.title}
              </CardHeader>
              <CardContent className="px-4 flex items-center gap-4">
                <div className="flex-1 overflow-hidden">
                  <Carousel
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 10000,
                      }),
                    ]}
                  >
                    <CarouselContent>
                      {kpi.carouselItems.map((item, i) => (
                        <CarouselItem
                          key={i}
                          className="flex items-center gap-3"
                        >
                          {/* Ícone */}
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${kpi.bg[i]}`}
                          >
                            <kpi.icon className={`w-6 h-6 ${kpi.color[i]}`} />
                          </div>

                          {/* Texto */}
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {item.title}
                            </p>
                            <p className="text-xl font-bold text-preto">
                              {item.value}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabela de Dados */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#1F1F1F]">
              Resultados da Consulta
            </CardTitle>
            <CardDescription>
              {filteredDados.length} registro(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="w-8 h-8" color="border-blue-500" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Users className="w-8 h-8" />
                            <p>Nenhum registro encontrado</p>
                            <p className="text-sm">
                              Tente ajustar os filtros de busca
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDados.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.nome}
                          </TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.telefone}</TableCell>
                          <TableCell>{item.cidadeTransporte}</TableCell>
                          <TableCell>
                            {item.turno.length === 2
                              ? "Ambos"
                              : item.turno?.[0] || ""}
                          </TableCell>
                          <TableCell>{item.modalidadeTransporte}</TableCell>
                          <TableCell>
                            <Badge className={getBadgeColor(item.situacao)}>
                              {item.situacao}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/diretoria/dashboard/editAssociado/${item.id}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-[#FFB400]/10 hover:text-[#FFB400] cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssociadosDiretoria;
