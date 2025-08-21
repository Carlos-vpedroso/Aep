'use client'
import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BusFront } from 'lucide-react';
import { Button } from '../ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context';
import Spinner from '../Spinner';

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
    if (cidade === "Franca") return turno === "MATUTINO" ? pontosFrancaMatutino : pontosFrancaNoturno;
    if (cidade === "Passos") return turno === "MATUTINO" ? pontosPassosMatutino : pontosPassosNoturno;
    if (cidade === "Batatais") return pontosBatatais;
    return [];
};

// ======== ZOD SCHEMA ==========
const passagemSchema = z.object({
    turno: z.string().nonempty("O turno é obrigatório"),
    pontoIda: z.string().nonempty("O ponto é obrigatório"),
    pontoVolta: z.string().optional()
}).refine((data) => data.pontoVolta || data.pontoVolta === "" || samePointGlobal, {
    message: "O ponto de volta é obrigatório",
    path: ["pontoVolta"],
});

let samePointGlobal = true;

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
    const { loading, setLoading } = useAuth();

    samePointGlobal = samePoint;

    const { handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(passagemSchema),
        defaultValues: {
            turno: newTurno,
            pontoIda: "",
            pontoVolta: ""
        }
    });


    useEffect(() => {
        if (turno && turno !== 'AMBOS') {
            setNewTurno(turno);
        }
        const lista = getPontos(cidadeTransporte, newTurno);
        setPontos(lista);
        setValue("pontoIda", "");
        setValue("pontoVolta", "");


    }, [cidadeTransporte, newTurno, setValue]);

    const onSubmit = (data: any) => {
        setLoading(true);

        // Simula uma requisição de 2 segundos
        setTimeout(() => {
            console.log("Passagem gerada:", data);
            setLoading(false);
        }, 2000);
    };


    return (
        <section className="space-y-4">
            <h1>Nessa página você conseguirá gerar sua passagem para o embarque e utilização do transporte</h1>

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
                        {/* Passageiro */}
                        <div className='space-y-1'>
                            <Label>Passageiro</Label>
                            <Input type='text' value={nome || ''} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>

                        {/* Cidade Origem */}
                        <div className='space-y-1'>
                            <Label>De</Label>
                            <Input type='text' value={'São Sebastião do Paraíso'} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>

                        {/* Cidade Destino + Turno */}
                        <div className='flex w-full gap-4'>
                            <div className='w-full space-y-1'>
                                <Label>Para</Label>
                                <Input type='text' value={cidadeTransporte || ''} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div className='w-full space-y-1'>
                                <Label>Turno</Label>
                                <Controller
                                    control={control}
                                    name="turno"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={(val) => { field.onChange(val); setNewTurno(val) }}>
                                            <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Selecione seu turno" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {turno === 'Ambos' ? (
                                                    <>
                                                        <SelectItem value="Matutino">Matutino</SelectItem>
                                                        <SelectItem value="Noturno">Noturno</SelectItem>
                                                    </>
                                                ) : (
                                                    <SelectItem value={turno || ''}>{turno}</SelectItem>
                                                )}
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
                                <Controller
                                    control={control}
                                    name="pontoIda"
                                    render={({ field }) => (
                                        <RenderSelect lista={pontos} value={field.value} onChange={field.onChange} placeholder="Selecione seu ponto" />
                                    )}
                                />
                            ) : (
                                <div className='flex w-full gap-4'>
                                    <Controller
                                        control={control}
                                        name="pontoIda"
                                        render={({ field }) => (
                                            <RenderSelect lista={pontos} value={field.value} onChange={field.onChange} placeholder="Ponto de Ida" />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="pontoVolta"
                                        render={({ field }) => (
                                            <RenderSelect lista={pontos} value={field.value || ""} onChange={field.onChange} placeholder="Ponto de Volta" />
                                        )}
                                    />
                                </div>
                            )}

                            {errors.pontoIda && <p className="text-red-500 text-sm">{errors.pontoIda.message}</p>}
                            {errors.pontoVolta && <p className="text-red-500 text-sm">{errors.pontoVolta.message}</p>}
                        </div>

                        <Button disabled={loading ? true : false} onClick={handleSubmit(onSubmit)} className='bg-azul hover:bg-blue-900 cursor-pointer'>
                            {loading ? <><Spinner/> Gerando...</> : 'Gerar Passagem'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default TravelDashboard;
