"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, CreditCard } from "lucide-react"


interface Boleto {
    id: string
    descricao: string
    valor: number
    vencimento: string
    status: "Pago" | "Pendente" | "Atrasado"
}

export default function PaymentDashboard() {
    const [boletos, setBoletos] = useState<Boleto[]>([])
    const [loading, setLoading] = useState(true)

    // Simula requisição API
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const mockData: Boleto[] = [
                { id: "1", descricao: "Mensalidade Agosto 2025", valor: 450, vencimento: "2025-08-28", status: "Pago" },
                { id: "2", descricao: "Mensalidade Julho 2025", valor: 450, vencimento: "2025-07-28", status: "Pendente" },
                { id: "3", descricao: "Mensalidade Junho 2025", valor: 450, vencimento: "2025-06-28", status: "Atrasado" },
            ]
            setBoletos(mockData)
            setLoading(false)
        }, 1000)
    }, [])

    const getStatusColor = (status: Boleto["status"]) => {
        switch (status) {
            case "Pago":
                return "bg-green-100 text-green-700"
            case "Pendente":
                return "bg-yellow-100 text-yellow-700"
            case "Atrasado":
                return "bg-red-100 text-red-700"
            default:
                return ""
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-[#27AE60]" />
                        <div>
                            <h1 className="text-3xl font-bold text-[#1F1F1F]">Pagamentos</h1>
                            <p className="text-gray-600 mt-1">Boletos emitidos em seu nome</p>
                        </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Download className="w-4 h-4" /> Exportar Todos
                    </Button>
                </div>

                {/* Lista de Boletos */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-500 col-span-full text-center">Carregando boletos...</p>
                    ) : boletos.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center">Nenhum boleto encontrado</p>
                    ) : (
                        boletos.map((boleto) => (
                            <Card key={boleto.id} className="border-none shadow-md hover:shadow-lg transition-all">
                                <CardHeader className="pb-2 flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-[#1F1F1F]">{boleto.descricao}</CardTitle>
                                    <Badge className={getStatusColor(boleto.status)}>{boleto.status}</Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-gray-500 text-sm">Vencimento: {new Date(boleto.vencimento).toLocaleDateString()}</p>
                                    <p className="font-medium text-[#1F1F1F]">Valor: R$ {boleto.valor.toFixed(2)}</p>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> Visualizar
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Download className="w-4 h-4" /> Baixar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}
