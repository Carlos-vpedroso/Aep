'use client'
import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    Users,
    Calendar,
    MapPin,
    Clock,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react'
import { useAuth } from '@/context'
import Spinner from '../Spinner'
import { toast } from 'sonner'

interface Aluno {
    idAluno: string;
    nomeAluno: string;
    embarque: string;
    desembarque: string;
}

interface Filtros {
    turno: string
    cidade: string
    data: string
}

const ListasDiretoria: NextPage = () => {
    const { loading, setLoading } = useAuth()
    const [dados, setDados] = useState<Aluno[]>([])
    const [filteredDados, setFilteredDados] = useState<Aluno[]>([])
    const [filtros, setFiltros] = useState<Filtros>({
        turno: '',
        cidade: '',
        data: new Date().toISOString().split('T')[0] // Data de hoje
    })
    const [searchedTurno, setSearchedTurno] = useState("")

    // Opções para os selects
    const turnos = [
        { value: 'Matutino', label: 'Matutino' },
        { value: 'Noturno', label: 'Noturno' },
    ]

    const cidades = [
        { value: 'Franca', label: 'Franca' },
        { value: 'Passos', label: 'Passos' },
        { value: 'Batatais', label: 'Batatais' },
    ]

    // Função para buscar dados da API
    const fetchDados = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("token");
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lista/associados/${filtros.cidade}/${filtros.turno}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
                body: JSON.stringify({ data: filtros.data }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || 'Erro ao buscar dados');
                return;
            }

            const result = await response.json();
            setDados(result.data);
            setFilteredDados(result.data);
            setSearchedTurno(filtros.turno);
        } catch (error) {
            console.error('Erro ao buscar dados:', error)
            toast.error('Erro ao buscar dados');
        } finally {
            setLoading(false)
        }
    }


    // Função para aplicar filtros
    const consultarApi = () => {
        fetchDados()
    }

    // Função para limpar filtros
    const limparFiltros = () => {
        setFiltros({
            turno: '',
            cidade: '',
            data: new Date().toISOString().split('T')[0]
        })
    }

    // Função para exportar dados
    const exportarDados = () => {
        if (filteredDados.length === 0) return;

        // Monta o texto a ser copiado
        const texto = filteredDados
            .map((item, idx) => `${idx + 1}\t${item.nomeAluno}`)
            .join('\n');

        // Copia para o clipboard
        navigator.clipboard.writeText(texto)
            .then(() => {
                toast.success('Nº e Nome copiados com sucesso!');
            })
            .catch(() => {
                toast.error('Erro ao copiar os dados');
            });
    }

    // Função para obter cor do badge baseado na situação
    const getBadgeColor = (turno: string) => {
        switch (turno) {
            case 'Noturno':
                return 'bg-roxo/10 text-roxo border-roxo/20'
            case 'Matutino':
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20 rounded-md hidden md:table-cell'
        }
    }


    // Loading da autenticação
    if (loading) {
        return (
            <div className="rounded-md flex flex-1 min-h-screen justify-center items-center bg-white">
                <Spinner size="w-10 h-10" color="border-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1F1F1F]">Listas Diretoria</h1>
                        <p className="text-gray-600 mt-1">Consulte e gerencie as listas de transporte</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                        <Button
                            variant="outline"
                            onClick={exportarDados}
                            className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60]/10"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                        <Button
                            onClick={consultarApi}
                            disabled={loading || !filtros.cidade || !filtros.turno}
                            className="bg-[#0057D9] hover:bg-[#0057D9]/90 text-white"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4 mr-2" />
                            )}
                            {loading ? 'Carregando...' : 'Buscar'}
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
                            Utilize os filtros abaixo para sua consulta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Select Cidade */}
                            <div className="space-y-2">
                                <Label htmlFor="cidade" className="text-sm sm:text-base md:text-sm font-medium">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Cidade
                                </Label>
                                <Select
                                    value={filtros.cidade}
                                    onValueChange={(value) => setFiltros(prev => ({ ...prev, cidade: value }))}
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
                            {/* Select Turno */}
                            <div className="space-y-2">
                                <Label htmlFor="turno" className="text-sm sm:text-base md:text-sm font-medium">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Turno
                                </Label>
                                <Select
                                    value={filtros.turno}
                                    onValueChange={(value) => setFiltros(prev => ({ ...prev, turno: value }))}
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

                            {/* Input Data */}
                            <div className="space-y-2">
                                <Label htmlFor="data" className="text-sm sm:text-base md:text-sm font-medium">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Data
                                </Label>
                                <Input
                                    id="data"
                                    type="date"
                                    value={filtros.data}
                                    onChange={(e) => setFiltros(prev => ({ ...prev, data: e.target.value }))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                            <Button
                                onClick={consultarApi}
                                disabled={loading || !filtros.cidade || !filtros.turno}
                                className="bg-[#0057D9] hover:bg-[#0057D9]/90 text-white"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4 mr-2" />
                                )}
                                Consultar Lista
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
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nº</TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead className="hidden md:table-cell">Embarque</TableHead>
                                            <TableHead className="hidden md:table-cell">Desembarque</TableHead>
                                            <TableHead className="hidden md:table-cell">Turno</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDados.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-24 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                                        <Users className="w-8 h-8" />
                                                        <p>Nenhum registro encontrado</p>
                                                        <p className="text-sm">Tente ajustar os filtros de busca</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredDados.map((item, idx) => (
                                                <TableRow key={item.idAluno}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell className='font-medium'>{item.nomeAluno}</TableCell>
                                                    <TableCell className='select-none hidden md:table-cell'>{item.embarque}</TableCell>
                                                    <TableCell className='select-none hidden md:table-cell'>{item.desembarque}</TableCell>
                                                    <TableCell className="select-none hidden md:table-cell ">
                                                        <Badge className={getBadgeColor(searchedTurno)}>
                                                            {searchedTurno}
                                                        </Badge>
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
    )
}

export default ListasDiretoria