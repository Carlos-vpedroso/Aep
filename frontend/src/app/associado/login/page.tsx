"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import backgroundEstudante_Desktop from "../../../../public/backgroundEstudante_Desktop.png"
import backgroundEstudante_Mobile from "../../../../public/backgroundEstudante_Mobile.png"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Spinner from "@/components/Spinner"

const formSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "A senha deve possuir no mínimo 8 caracteres"),
  })

type FormValues = z.infer<typeof formSchema>

const perfis = ["Associado", "Diretoria", "Motorista"]

export default function LoginPage() {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", senha: "" },
    mode: "onChange",
  });

  const [perfilSelecionado, setPerfilSelecionado] = useState("Associado")
  const [showSenha, setShowSenha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    setTimeout(() => {
      console.log("Dados enviados:", values)
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Imagem de fundo */}
      <Image
        src={backgroundEstudante_Desktop}
        alt="Fundo Login"
        className="absolute inset-0 w-full h-full object-cover md:flex hidden"
        priority
      />
      <Image
        src={backgroundEstudante_Mobile}
        alt="Fundo Login"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        priority
      />

      {/* Overlay escuro + desfoque */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Card de Login */}
      <Card className="relative max-w-md sm:w-full sm:max-w-2xl shadow-xl z-10 p-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-preto">
            Login - {perfilSelecionado}
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-1">
            Acesse sua área de associado
          </p>
        </CardHeader>
        <CardContent>
          {/* Tabs de perfil */}
          <div className="flex justify-center space-x-2 mb-4">
            {perfis.map((perfil) => (
              <Button
                key={perfil}
                onClick={() => setPerfilSelecionado(perfil)}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition duration-300 ${perfilSelecionado === perfil
                  ? "bg-roxo text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
              >
                {perfil}
              </Button>
            ))}
          </div>

          {/* Formulário */}
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-1 border-gray-300 focus:border-azul focus:ring-1 focus:ring-azul"
                          placeholder="Ex.: seuemail@email.com"
                          {...field}
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
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input
                            className="mt-1 border-gray-300 focus:border-azul focus:ring-1 focus:ring-azul"
                            type={showSenha ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <Button variant="outline" type="button" onClick={() => setShowSenha(!showSenha)}>
                            {showSenha ? <Eye className="text-preto"/> : <EyeOff className="text-preto"/>}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button
                type="submit"
                className="w-full bg-roxo transition text-white font-semibold flex justify-center items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? <><Spinner size="w-5 h-5" color="border-white" /> Processando...</> : "Entrar"}
              </Button>

            </form>
          </Form>

          {/* Links */}
          <div className="flex text-center mt-3 justify-between">
            <a href="/" className="text-sm text-red-400 hover:text-red-700">
              Voltar
            </a>
            <Link href="/" className="text-sm text-azul hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
