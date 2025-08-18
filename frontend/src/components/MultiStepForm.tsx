"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ProgressBar from "./ProgressBar"
import { UserInfo } from "@/types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { maskCPF, maskPhone, maskRG } from "@/lib/masks"
import { toast } from "sonner"

interface Props {
    userInfo: UserInfo
}

const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" },
];

const faculdades = [
    { sigla: 'UNIFRAN', nome: "Universidade de Franca", cidade: 'Franca - SP' },
    { sigla: 'FDF', nome: "Faculdade de Direito de Franca", cidade: 'Franca - SP' },
    { sigla: 'UEMG', nome: "Universidade Estadual de Minas Gerais", cidade: 'Passos - MG' },
    { sigla: 'IFSul', nome: "Instituto Federal de Educação, Ciência e Tecnologia do Sul de Minas", cidade: 'Passos - MG' },
    { sigla: 'Claretiano', nome: "Centro Universitário Claretiano", cidade: 'Batatais - SP' }
];

export default function MultiStepForm({ userInfo }: Props) {
    const steps = ["Dados Pessoais", "Endereço", "Faculdade"]
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState<UserInfo>(userInfo)
    const [rg, setRg] = useState<string>("")
    const [ufEmissao, setUfEmissao] = useState<string>("")

    useEffect(() => {
        if (rg && ufEmissao) {
            handleChange("rg", `${ufEmissao}-${rg}`);
        } else {
            handleChange("rg", rg);
        }
    }, [rg, ufEmissao]);

    const handleChange = (field: keyof UserInfo, value: string) => {
        setFormData({ ...formData, [field]: value })
    }

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1)
    }

    const prevStep = () => {
        if (step > 0) setStep(step - 1)
    }

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

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const novoCep = e.target.value.replace(/\D/g, ""); // remove não dígitos

        // Atualiza o input
        setFormData((prev) => ({ ...prev, cep: novoCep }));

        // Busca o endereço apenas quando o CEP estiver completo
        if (novoCep.length === 8) {
            buscarEndereco(novoCep);
        }
    };


    return (
        <div className="max-w-lg m-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Bem-vindo, {formData.nome}</h1>
            <p className="text-gray-500">Etapa {step + 1} de {steps.length}: {steps[step]}</p>

            {/* Barra de progresso */}
            <ProgressBar user={formData} />

            {/* Etapa Dados Pessoais */}
            {steps[step] === "Dados Pessoais" && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Nome</Label>
                        <Input type="text" disabled value={formData.nome} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Email</Label>
                        <Input type="text" disabled value={formData.email} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-1 block">RG</Label>
                            <Input
                                type="text"
                                placeholder="12.345.789"
                                value={rg}
                                onChange={(e) => setRg(maskRG(e.target.value))}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-1 block">UF de Emissão</Label>
                            <Select value={ufEmissao} onValueChange={setUfEmissao} required>
                                <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {estados.map((estado) => (
                                        <SelectItem key={estado.uf} value={estado.uf}>
                                            {`${estado.nome} (${estado.uf})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">CPF</Label>
                        <Input
                            type="text"
                            placeholder="123.456.789-00"
                            value={formData.cpf || ""}
                            onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Telefone</Label>
                        <Input
                            type="tel"
                            placeholder="(11) 91234-5678"
                            value={formData.telefone || ""}
                            onChange={(e) => handleChange("telefone", maskPhone(e.target.value))}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={15}
                        />
                    </div>
                </div>
            )}

            {/* Etapa Endereço */}
            {steps[step] === "Endereço" && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">CEP</Label>
                        <Input
                            type="text"
                            placeholder="Digite seu CEP"
                            value={formData.cep || ""}
                            onChange={handleCepChange}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={8}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-1 block">Rua</Label>
                            <Input value={formData.rua || ""} onChange={(e) => handleChange("rua", e.target.value)} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-1 block">Número</Label>
                            <Input value={formData.numero || ""} onChange={(e) => handleChange("numero", e.target.value)} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Bairro</Label>
                        <Input value={formData.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Cidade</Label>
                        <Input value={formData.cidade || ""} onChange={(e) => handleChange("cidade", e.target.value)} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            )}

            {/* Etapa Faculdade */}
            {steps[step] === "Faculdade" && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Faculdade</Label>
                        <Select
                            value={formData.faculdade || ""}
                            onValueChange={(sigla) => {
                                const faculdadeSelecionada = faculdades.find(f => f.sigla === sigla);
                                setFormData((prev) => ({
                                    ...prev,
                                    faculdade: sigla,
                                    cidadeTransporte: faculdadeSelecionada ? faculdadeSelecionada.cidade : "",
                                }));
                            }}
                            required
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
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
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Cidade</Label>
                        <Input disabled value={formData.cidadeTransporte || ""} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Curso</Label>
                        <Input value={formData.curso || ""} onChange={(e) => handleChange("curso", e.target.value)} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Turno</Label>
                        <Select
                            value={formData.turno || ""}
                            onValueChange={(valor) => handleChange("turno", valor)}
                            required
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Selecione seu turno" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MATUTINO">Matutino</SelectItem>
                                <SelectItem value="NOTURNO">Noturno</SelectItem>
                                <SelectItem value="AMBOS">Ambos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Tipo Utilização</Label>
                        <Select
                            value={formData.modalidadeTransporte || ""}
                            onValueChange={(valor) => handleChange("modalidadeTransporte", valor)}
                            required
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Selecione seu turno" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MENSAL">Mensal</SelectItem>
                                <SelectItem value="DIARIA">Diária</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" disabled={step === 0} className="hover:bg-gray-100 transition-colors" onClick={prevStep}>
                    Voltar
                </Button>
                {step < steps.length - 1 ? (
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors" onClick={nextStep}>
                        Próxima
                    </Button>
                ) : (
                    <Button className="bg-green-500 hover:bg-green-600 text-white transition-colors" onClick={() => console.log(formData)}>
                        Concluir
                    </Button>
                )}
            </div>
        </div>
    )
}
