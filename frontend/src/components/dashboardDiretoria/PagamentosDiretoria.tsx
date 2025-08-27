"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Dados mockados de usuários e boletos
interface Boleto {
  id: string
  usuario: string
  email: string
  valor: number
  vencimento: string
  status: "Pago" | "Pendente" | "Atrasado"
}

interface Usuario {
  id: string
  nome: string
  email: string
  selecionado?: boolean
}

const boletosMock: Boleto[] = [
  { id: "1", usuario: "Ana Carolina", email: "ana@email.com", valor: 150.0, vencimento: "2025-08-30", status: "Pendente" },
  { id: "2", usuario: "Carlos Pedroso", email: "carlos@email.com", valor: 200.0, vencimento: "2025-08-25", status: "Pago" },
]

const usuariosMock: Usuario[] = [
  { id: "1", nome: "Ana Carolina", email: "ana@email.com" },
  { id: "2", nome: "Carlos Pedroso", email: "carlos@email.com" },
  { id: "3", nome: "Juliana Souza", email: "juliana@email.com" },
  { id: "4", nome: "Lucas Lima", email: "lucas@email.com" },
]

export default function PagamentosDiretoria() {
  const [boletos, setBoletos] = useState<Boleto[]>(boletosMock)
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock)
  const [valorBoleto, setValorBoleto] = useState<number>(150)

  const getBadgeColor = (status: Boleto["status"]) => {
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

  const toggleUsuarioSelecionado = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, selecionado: !u.selecionado } : u))
    )
  }

  const emitirBoletos = () => {
    const selecionados = usuarios.filter((u) => u.selecionado)
    if (selecionados.length === 0) {
      toast.error("Selecione pelo menos um associado para emitir boletos.")
      return
    }

    const novosBoletos = selecionados.map((u, index) => ({
      id: (boletos.length + index + 1).toString(),
      usuario: u.nome,
      email: u.email,
      valor: valorBoleto,
      vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias de prazo
      status: "Pendente" as const,
    }))

    setBoletos((prev) => [...novosBoletos, ...prev])
    // Limpar seleção
    setUsuarios((prev) => prev.map((u) => ({ ...u, selecionado: false })))
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
            <p className="text-gray-600 mt-1">Visualize e emita boletos para seus associados</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
            <Download className="w-4 h-4" />
            Exportar Todos
          </Button>
        </div>

        {/* Geração de Boletos */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Emitir Boletos</CardTitle>
            <CardDescription>Selecione os associados que deseja emitir boletos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Valor do boleto (R$)</label>
              <input
                type="number"
                value={valorBoleto}
                onChange={(e) => setValorBoleto(Number(e.target.value))}
                className="border rounded-md p-2 w-32"
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Selecionar</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <Checkbox
                          checked={usuario.selecionado || false}
                          onCheckedChange={() => toggleUsuarioSelecionado(usuario.id)}
                        />
                      </TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              className="mt-4 flex items-center gap-2"
              onClick={emitirBoletos}
            >
              <Plus className="w-4 h-4" />
              Emitir Boletos Selecionados
            </Button>
          </CardContent>
        </Card>

        {/* Tabela de Boletos */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Boletos Emitidos</CardTitle>
            <CardDescription>{boletos.length} registro(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletos.map((boleto) => (
                    <TableRow key={boleto.id}>
                      <TableCell className="font-medium">{boleto.usuario}</TableCell>
                      <TableCell>{boleto.email}</TableCell>
                      <TableCell>R$ {boleto.valor.toFixed(2)}</TableCell>
                      <TableCell>{new Date(boleto.vencimento).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(boleto.status)}>{boleto.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
