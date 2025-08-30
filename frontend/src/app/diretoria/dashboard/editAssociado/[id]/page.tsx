'use client'
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { useAuth } from "@/context";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { UserInfo } from "@/types";
import { toast } from "sonner";

const faculdades = [
  { sigla: 'UNIFRAN', nome: "Universidade de Franca", cidade: 'Franca' },
  { sigla: 'FDF', nome: "Faculdade de Direito de Franca", cidade: 'Franca' },
  { sigla: 'UEMG', nome: "Universidade Estadual de Minas Gerais", cidade: 'Passos' },
  { sigla: 'IFSul', nome: "Instituto Federal de Educação, Ciência e Tecnologia do Sul de Minas", cidade: 'Passos' },
  { sigla: 'Claretiano', nome: "Centro Universitário Claretiano", cidade: 'Batatais' }
];

const EditAssociado: NextPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { loading, setLoading } = useAuth();
  const [formData, setFormData] = useState<UserInfo>({
    email: "",
    cpf: "",
    rg: "",
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    cep: "",
    faculdade: "",
    curso: "",
    turno: "",
    cidadeTransporte: "",
    modalidadeTransporte: "",
    situacao: "",
    firstTime: false
  });
  const [saving, setSaving] = useState(false);

  // Buscar associado
  useEffect(() => {
    const fetchAssociado = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar associado");

        const data = await res.json();
        setFormData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`Erro: ${error.message}`);
        } else {
          toast.error("Erro desconhecido ao carregar os dados do associado.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssociado();
  }, [id, setLoading]);

  const handleChange = (name: string, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);

    try {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar associado");

      toast.success("✅ Associado atualizado com sucesso!");
      setTimeout(() => router.push("/diretoria/dashboard"), 2000);
    } catch {
      toast.error("❌ Ocorreu um erro ao salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--color-cinza)]">
        <Spinner size="w-12 h-12" color="border-[var(--color-azul)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cinza)] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-[var(--color-preto)] mb-6">Editar Associado</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DADOS PESSOAIS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--color-azul)]">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input name="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input name="cpf" value={formData.cpf || ""} onChange={(e) => handleChange("cpf", e.target.value)} />
              </div>
              <div>
                <Label>RG</Label>
                <Input name="rg" value={formData.rg || ""} onChange={(e) => handleChange("rg", e.target.value)} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input name="telefone" value={formData.telefone || ""} onChange={(e) => handleChange("telefone", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* ENDEREÇO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--color-azul)]">Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Rua</Label>
                <Input name="rua" value={formData.rua || ""} onChange={(e) => handleChange("rua", e.target.value)} />
              </div>
              <div>
                <Label>Número</Label>
                <Input name="numero" value={formData.numero || ""} onChange={(e) => handleChange("numero", e.target.value)} />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input name="bairro" value={formData.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input name="cidade" value={formData.cidade || ""} onChange={(e) => handleChange("cidade", e.target.value)} />
              </div>
              <div>
                <Label>CEP</Label>
                <Input name="cep" value={formData.cep || ""} onChange={(e) => handleChange("cep", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* FACULDADE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--color-azul)]">Faculdade</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Faculdade</Label>
                <Select
                  value={formData.faculdade || ""}
                  onValueChange={(sigla) => {
                    const faculdadeSelecionada = faculdades.find(f => f.sigla === sigla);
                    setFormData(prev => {
                      if (!prev) return prev; // garante que prev existe
                      return {
                        ...prev,
                        faculdade: sigla,
                        cidadeTransporte: faculdadeSelecionada ? faculdadeSelecionada.cidade : prev.cidadeTransporte,
                      };
                    });
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione sua faculdade" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculdades.map((faculdade) => (
                      <SelectItem key={faculdade.sigla} value={faculdade.sigla}>
                        {`${faculdade.sigla} - (${faculdade.nome})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Curso</Label>
                <Input name="curso" value={formData.curso || ""} onChange={(e) => handleChange("curso", e.target.value)} />
              </div>
              <div>
                <Label>Turno</Label>
                <Select value={formData.turno || ""} onValueChange={(val) => handleChange("turno", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Noturno">Noturno</SelectItem>
                    <SelectItem value="Matutino">Matutino</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* TRANSPORTE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--color-azul)]">Transporte</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Cidade Transporte</Label>
                <Input
                  name="cidadeTransporte"
                  disabled
                  value={formData.cidadeTransporte || ""}
                  onChange={(e) => handleChange("cidadeTransporte", e.target.value)}
                  className="bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>Modalidade</Label>
                <Select value={formData.modalidadeTransporte || ""} onValueChange={(val) => handleChange("modalidadeTransporte", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Diaria">Diária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* SITUAÇÃO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--color-azul)]">Situação</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={formData.situacao} onValueChange={(val) => handleChange("situacao", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="w-full md:w-1/2 bg-[var(--color-azul)] text-white hover:bg-blue-900"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Link href="/diretoria/dashboard" className="w-full md:w-1/2">
              <Button variant="outline" className="w-full text-red-500 border-red-500">
                Voltar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssociado;
