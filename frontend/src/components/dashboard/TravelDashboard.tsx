'use client'
import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Cookies from 'js-cookie';
import { BusFront, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context';
import Spinner from '../Spinner';
import { toast } from 'sonner';

interface Props {
    nome: string | null;
    cidadeTransporte: string | null;
    turno: string | null;
    id: string | null;
}

// ======== LISTAS DE PONTOS ==========
const pontosFrancaNoturno = [
    "Boi Branco", "Brutus Lanches", "IMPAR", "Martoni", "Padaria Real", "Padaria Santa Luzia",
    "Pernambucanas", "Posto Samambaia", "Pracinha do Cristo Rei", "Ponto de Encontro das Linhas para saída - Posto Iguatemi",
    "Ponto de ônibus em frente ao Colégio", "Senai", "Supermercado Araújo", "Supermercado Super Minas",
    "Supermercado Tavares", "UAI", "Mercado Messias", "Ouro Verde", "Praça João Flávio", "TipTop (Monselhor Felipe)"
];

const pontosFrancaMatutino = [
    "Arena Olímpica", "Base da Polícia do São Judas", "Bocão Lanches", "Brutus Lanches", "Espaço 88",
    "Padaria Santa Luzia", "Pernambucanas", "Posto Samambaia", "Pracinha do Cristo Rei", "Sede AEP",
    "Supermercado Araújo", "UAI", "Complexo do San Genaro", "Ponto de Encontro da Linha para saída – Posto Iguatemi"
];

const pontosPassosNoturno = [
    "Alpínia Veículos", "Base da Polícia do São Judas", "Boi Branco", "Brutus Lanches", "Chico Lanches (Abadia)",
    "Complexo San Genaro (Santa Luzia)", "Posto Iguatemi (Saída para Franca)", "Martoni (Ponto de ônibus)", "Pernambucanas",
    "Posto de ônibus de frente a quadra perto do Bombeiro", "Ponto de Encontro das Linhas para saída - Alpínia",
    "Ponto de ônibus em frente ao Colégio", "Praça João Flávio", "Pracinha do Cristo Rei", "Ritmo (Saída para Passos)",
    "Supermercado Arco Íris", "Supermercado Araújo", "Supermercado São Gabriel", "UAI", "Wenceslau Brás esquina com Santa Luzia",
    "Ouro Verde"
];

const pontosPassosMatutino = [
    "Alpínia Veículos", "Boi Branco (Av. Wenceslau Brás)", "Chico Lanches (Abadia)", "Complexo San Genaro (Sta Luzia de frente a pista de Skate)",
    "Espaço 88", "Martoni (Ponto de ônibus)", "Padaria Santa Luzia", "Pernambucanas", "Posto Iguatemi (Saída para Franca)",
    "Pracinha do Cristo Rei", "Supermercado Araújo"
];

const pontosBatatais = [
    "Extinsul", "Fumpar", "Igreja da Abadia", "Padaria Santa Luzia", "Posto Iguatemi (Saída para Franca)",
    "Posto Jacaré", "Pracinha do Cristo Rei", "Sede AEP", "Supermercado Arco Íris", "TipTop"
];

// ======== FUNÇÃO QUE ESCOLHE A LISTA ==========
const getPontos = (cidade: string | null, turno: string | null) => {
    if (!cidade || !turno) return [];
    if (cidade === "Franca") return turno === "Matutino" ? pontosFrancaMatutino : pontosFrancaNoturno;
    if (cidade === "Passos") return turno === "Matutino" ? pontosPassosMatutino : pontosPassosNoturno;
    if (cidade === "Batatais") return pontosBatatais;
    return [];
};

// ======== ZOD SCHEMA ==========
const passagemSchema = z.object({
    turno: z.string().nonempty("O turno é obrigatório"),
    pontoIda: z.string().nonempty("O ponto é obrigatório"),
    pontoVolta: z.string().optional()
})


// ======== COMPONENTE RenderSelect ==========
interface RenderSelectProps {
    lista: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const RenderSelect = ({ lista, value, onChange, placeholder }: RenderSelectProps) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder={placeholder || "Selecione"} />
        </SelectTrigger>
        <SelectContent>
            {lista.map((ponto, index) => (
                <SelectItem key={index} value={ponto}>{ponto}</SelectItem>
            ))}
        </SelectContent>
    </Select>
);

// ======== COMPONENTE PRINCIPAL ==========
const TravelDashboard: NextPage<Props> = ({ nome, cidadeTransporte, turno, id }) => {
    const [newTurno, setNewTurno] = useState("");
    const [samePoint, setSamePoint] = useState(true);
    const [pontos, setPontos] = useState<string[]>([]);
    const [passagens, setPassagens] = useState<any[]>([]);
    const { loading, setLoading } = useAuth();

    const { handleSubmit, control, watch, setValue, setError, clearErrors, formState: { errors } } = useForm({
        resolver: zodResolver(passagemSchema),
        defaultValues: {
            turno: newTurno,
            pontoIda: "",
            pontoVolta: ""
        }
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
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/associados/${cidadeTransporte}/${turno}/${id}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setPassagens(Array.isArray(data) ? data : [data]); // garante que vira array
                }
            } catch (error) {
                console.error("Erro ao buscar passagens", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPassagens();
    }, [cidadeTransporte, turno, id, setLoading]);


    useEffect(() => {
        if (turno && turno !== 'Ambos') {
            setNewTurno(turno);
        }
        const lista = getPontos(cidadeTransporte, newTurno);
        setPontos(lista);
        setValue("pontoIda", "");
        setValue("pontoVolta", "");
    }, [cidadeTransporte, newTurno, setValue, turno]);

    const onSubmit = async (formData: any) => {
        // monta os dados finais
        const payload = {
            nomeAluno: nome,
            embarque: formData.pontoIda,
            desembarque: samePoint ? formData.pontoIda : formData.pontoVolta
        };

        // validação extra quando "mesmo ponto" não está marcado
        if (!samePoint && !formData.pontoVolta) {
            setError("pontoVolta", {
                type: "manual",
                message: "O ponto de volta é obrigatório"
            });
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            toast.error("Você precisa estar logado para gerar a passagem.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/associados/${cidadeTransporte}/${newTurno}/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                toast.error(errorData?.message || "Erro ao gerar passagem.");
                return;
            }

            setPassagens(prev => [...prev, { ...payload, turno: newTurno, cidadeTransporte }]);
            toast.success("Passagem gerada com sucesso!");
            console.log("Passagem gerada:", payload);

        } catch (error) {
            console.error(error);
            toast.error("Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    const cancelarPassagem = async (passagemTurno: string) => {
        const token = Cookies.get("token");
        if (!token) return;

        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/associados/${cidadeTransporte}/${passagemTurno}/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) { toast.error("Erro ao cancelar"); return; }
            toast.success("Passagem cancelada");
            setPassagens(prev => prev.filter(p => p.turno !== passagemTurno));
        } catch (err) { console.error(err); toast.error("Erro de conexão"); }
        finally { setLoading(false); }
    };

    const getAmanha = () => {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1); // adiciona 1 dia

        // Formata como DD/MM/YYYY
        const dia = String(amanha.getDate()).padStart(2, '0');
        const mes = String(amanha.getMonth() + 1).padStart(2, '0'); // meses começam do 0
        const ano = amanha.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }
    const getHoje = () => {
        const hoje = new Date();
        // Formata como DD/MM/YYYY
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // meses começam do 0
        const ano = hoje.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    // ======== Lógica para turno Ambos ==========
    const turnosDisponiveis = turno === "Ambos" ? ["Matutino", "Noturno"] : [turno!];
    const turnosUsados = passagens.map(p => p.turno);
    const turnosFaltando = turnosDisponiveis.filter(t => !turnosUsados.includes(t));

    return (
        <section className="space-y-4">
            <h1>Nessa página você conseguirá gerar sua passagem para o embarque e utilização do transporte</h1>

            {/* Passagens existentes */}
            {passagens.length > 0 && (
                <div className='grid grid-cols-1 gap-4'>
                    {passagens.map((p, index) => (
                        <Card key={index} className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className='flex items-center gap-4'>
                                    <BusFront className="text-azul" />
                                    <h1>Minha Passagem - {p.turno}</h1>
                                </CardTitle>
                                <CardDescription>
                                    Para o dia: <span className='font-semibold'>{p.turno === 'Matutino'? getAmanha() : getHoje()}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><b>Passageiro:</b> {p.nomeAluno}</p>
                                <p><b>Cidade:</b> {p.cidadeTransporte}</p>
                                <p><b>Turno:</b> {p.turno}</p>
                                <p><b>Embarque:</b> {p.embarque}</p>
                                <p><b>Desembarque:</b> {p.desembarque}</p>
                                <Button
                                    variant="destructive"
                                    onClick={() => cancelarPassagem(p.turno)}
                                    className="flex gap-2 mt-4"
                                    disabled={loading}
                                >
                                    <Trash2 /> {loading ? "Cancelando..." : "Cancelar Passagem"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Só mostra form se ainda faltar turno */}
            {turnosFaltando.length > 0 && (
                <div className='grid grid-cols-1'>
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-4'>
                                <div className="flex w-10 h-10 rounded-sm bg-azul items-center justify-center">
                                    <BusFront className="text-white" />
                                </div>
                                <h1>Gerar Passagem</h1>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='space-y-1'>
                                <Label>Passageiro</Label>
                                <Input type='text' value={nome || ''} disabled className="bg-gray-100" />
                            </div>

                            <div className='flex w-full gap-4'>
                                <div className='w-full space-y-1'>
                                    <Label>Para</Label>
                                    <Input type='text' value={cidadeTransporte || ''} disabled className="bg-gray-100" />
                                </div>
                                <div className='w-full space-y-1'>
                                    <Label>Turno</Label>
                                    <Controller
                                        control={control}
                                        name="turno"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={(val) => { field.onChange(val); setNewTurno(val) }}>
                                                <SelectTrigger className="w-full border border-gray-300 rounded-md">
                                                    <SelectValue placeholder="Selecione seu turno" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {turnosFaltando.map(t => (
                                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.turno && <p className="text-red-500 text-sm">{errors.turno.message}</p>}
                                </div>
                            </div>

                            {/* Ponto de embarque/desembarque */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Checkbox id='check1' checked={samePoint} onCheckedChange={() => setSamePoint(!samePoint)} />
                                    <Label htmlFor='check1'>Mesmo ponto para ida e volta</Label>
                                </div>

                                {samePoint ? (
                                    <>
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
                                        {errors.pontoIda && <p className="text-red-500 text-sm">{errors.pontoIda.message}</p>}
                                    </>
                                ) : (
                                    <>
                                        <div className='flex w-full gap-4'>
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
                                        </div>
                                        {errors.pontoIda && <p className="text-red-500 text-sm">{errors.pontoIda.message}</p>}
                                        {errors.pontoVolta && <p className="text-red-500 text-sm">{errors.pontoVolta.message}</p>}
                                    </>
                                )}
                            </div>

                            <Button disabled={loading} onClick={handleSubmit(onSubmit)} className='bg-azul hover:bg-blue-900'>
                                {loading ? <><Spinner /> Gerando...</> : 'Gerar Passagem'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </section>
    );
};

export default TravelDashboard;
