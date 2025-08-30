"use client"

import Navbar from '@/components/Navbar'
import estudanteFoto from '../../../../public/estudante-formulario2.png'
import Image from 'next/image'
import { NextPage } from 'next'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from '@/components/ui/checkbox'
import Spinner from '@/components/Spinner'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context'
import Link from 'next/link'

// Validação com Zod
const formSchema = z
    .object({
        nome: z.string().min(3, "Nome é obrigatório"),
        email: z.string().email("E-mail inválido"),
        confirmEmail: z.string().email("E-mail inválido"),
        senha: z.string().min(8, "A senha deve possuir no mínimo 8 caracteres"),
        confirmSenha: z.string().min(8, "A senha deve possuir no mínimo 8 caracteres"),
        termos: z.boolean().refine(val => val === true, {
            message: "Você deve aceitar os termos para continuar"
        })
    })
    .refine((data) => data.senha === data.confirmSenha, {
        message: "As senhas não conferem",
        path: ["confirmSenha"],
    })
    .refine((data) => data.email === data.confirmEmail, {
        message: "Os emails não conferem",
        path: ["confirmEmail"],
    });

type FormValues = z.infer<typeof formSchema>

const Formulario: NextPage = () => {

    const { loading, setLoading } = useAuth();
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmSenha, setShowConfirmSenha] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { nome: "", email: "", confirmEmail: "", senha: "", confirmSenha: "", termos: false },
        mode: "onChange",
    });

    const isFieldValid = (fieldName: keyof FormValues) => form.getValues(fieldName) && !form.formState.errors[fieldName] && form.formState.isValid;

    async function onSubmit(values: FormValues) {
        setLoading(true);

        try {
            const body = {
                nome: values.nome,
                email: values.email,
                senha: values.senha
            };

            const response = await fetch('http://localhost:5556/api/associados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao enviar cadastro');
            }

            // Cadastro enviado com sucesso
            toast.success('Cadastro enviado com sucesso!', {
                description: 'Por favor, acesse seu e-mail para confirmar seu cadastro.'
            });

            form.reset(); // limpa os campos

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Erro: ${error.message}`);
            } else {
                toast.error("Erro desconhecido");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <Navbar />
            <section className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-11/12 max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

                    {/* Imagem */}
                    <div className="hidden md:block">
                        <Image
                            src={estudanteFoto}
                            alt="Foto do estudante"
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Formulário */}
                    <div className="p-6 flex flex-col justify-center">
                        <h1 className="text-2xl font-bold text-azul mb-4">
                            Cadastro de Associado
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Preencha os dados abaixo para solicitar seu cadastro na associação.
                        </p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => {

                                        return (
                                            <FormItem>
                                                <FormLabel>Nome Completo</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite seu nome"
                                                        {...field}
                                                        className={`${isFieldValid('nome') ? 'border-green-500 focus:border-green-500' : ''}`}

                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => {

                                        return (
                                            <FormItem>
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="seuemail@email.com"
                                                        {...field}
                                                        className={`${isFieldValid('email') ? 'border-green-500 focus:border-green-500' : ''}`}

                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />


                                <FormField
                                    control={form.control}
                                    name="confirmEmail"
                                    render={({ field }) => {

                                        return (
                                            <FormItem>
                                                <FormLabel>Confirme o E-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Confirme seu email"
                                                        {...field}
                                                        className={`${isFieldValid('confirmEmail') ? 'border-green-500 focus:border-green-500' : ''}`}

                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type={showSenha ? "text" : "password"}
                                                        {...field}
                                                        placeholder='********'
                                                        className={`${isFieldValid('senha') ? 'border-green-500 focus:border-green-500' : ''}`}
                                                    />
                                                    <Button type="button" variant="ghost" onClick={() => setShowSenha(!showSenha)}>
                                                        {showSenha ? <Eye /> : <EyeOff />}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="confirmSenha"
                                    render={({ field }) => {

                                        return (
                                            <FormItem>
                                                <FormLabel>Confirme a Senha</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type={showConfirmSenha ? "text" : "password"}
                                                            {...field}

                                                            placeholder='********'
                                                            className={`${isFieldValid('confirmSenha') ? 'border-green-500 focus:border-green-500' : ''}`}
                                                        />
                                                        <Button type="button" variant="ghost" onClick={() => setShowConfirmSenha(!showConfirmSenha)}>
                                                            {showConfirmSenha ? <Eye /> : <EyeOff />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="termos"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(value) => field.onChange(!!value)}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal">
                                                    Li e aceito os{" "}
                                                    <Link href="/termos" className="text-blue-600 hover:underline">
                                                        Termos de Uso
                                                    </Link>
                                                </FormLabel>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button disabled={loading ? true : false} type="submit" className="w-full bg-azul hover:bg-blue-800 flex items-center justify-center gap-2">
                                    {loading && <Spinner />}
                                    {loading ? "Processando..." : "Enviar Cadastro"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Formulario
