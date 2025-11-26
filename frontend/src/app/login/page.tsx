"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import backgroundEstudante_Desktop from "../../../public/backgroundEstudante_Desktop.png";
import backgroundEstudante_Mobile from "../../../public/backgroundEstudante_Mobile.png";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve possuir no mínimo 8 caracteres"),
});

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type FormValues = z.infer<typeof formSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

const perfis = ["Associado", "Diretoria", "Motorista"];

const endpoints: Record<string, string> = {
  Associado: "/associados/login",
  Diretoria: "/diretoria/login",
  Motorista: "/motoristas/login",
};

export default function LoginPage() {
  const { Login, loading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", senha: "" },
    mode: "onChange",
  });
  const forgotForm = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const [perfilSelecionado, setPerfilSelecionado] = useState("Associado");
  const [showSenha, setShowSenha] = useState(false);
  const [modalForgot, setModalForgot] = useState(false);
  const [sendingForgot, setSendingForgot] = useState(false);

  const onSubmit = (values: FormValues) => {
    Login(values.email, values.senha, endpoints[perfilSelecionado]);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black md:bg-transparent">
      {/* Fundo Mobile First */}
      <Image
        src={backgroundEstudante_Mobile}
        alt="Fundo Login"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        priority
      />

      {/* Fundo Desktop */}
      <Image
        src={backgroundEstudante_Desktop}
        alt="Fundo Login"
        className="hidden md:flex absolute inset-0 w-full h-full object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm md:bg-black/40"></div>

      {/* Card */}
      <Card className="relative w-[90%] max-w-md bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg z-10">
        <CardHeader className="text-center space-y-1 pb-4">
          <CardTitle className="text-xl md:text-2xl font-bold text-preto">
            Login - {perfilSelecionado}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Acesse sua área de {perfilSelecionado.toLowerCase()}
          </p>
        </CardHeader>

        <CardContent>
          {/* Chips de Seleção de Perfil */}
          <div className="flex justify-center space-x-2 mb-6">
            {perfis.map((perfil) => (
              <button
                key={perfil}
                onClick={() => setPerfilSelecionado(perfil)}
                className={`px-3 py-1 text-sm rounded-full border transition 
                  ${
                    perfilSelecionado === perfil
                      ? "bg-roxo text-white border-roxo shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  }`}
              >
                {perfil}
              </button>
            ))}
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mt-1 border-gray-300 focus:border-roxo focus:ring-roxo"
                        placeholder="Ex.: seuemail@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Senha */}
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">Senha</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type={showSenha ? "text" : "password"}
                          className="mt-1 border-gray-300 focus:border-roxo focus:ring-roxo"
                          placeholder="********"
                          {...field}
                        />
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setShowSenha(!showSenha)}
                          className="p-2 border-gray-300"
                        >
                          {showSenha ? <Eye /> : <EyeOff />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão Entrar */}
              <Button
                type="submit"
                className="w-full bg-roxo hover:bg-roxo/80 text-white font-semibold py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="w-5 h-5" color="border-white" />{" "}
                    Processando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>

          {/* Links */}
          {perfilSelecionado === "Associado" ? (
            <div className="flex justify-between items-center mt-4 text-sm">
              <Link href="/" className="text-red-400 hover:text-red-600">
                Voltar
              </Link>
              <Button
                variant="link"
                className="text-roxo hover:underline cursor-pointer p-0"
                onClick={() => setModalForgot(true)}
              >
                Esqueceu a senha?
              </Button>
            </div>
          ) : (
            <div className="flex justify-start mt-4 text-sm">
              <Link href="/" className="text-red-400 hover:text-red-600">
                Voltar
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={modalForgot} onOpenChange={setModalForgot}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              Informe seu e-mail cadastrado para enviarmos o link de
              recuperação.
            </DialogDescription>
          </DialogHeader>

          <Form {...forgotForm}>
            <form
              className="space-y-4"
              onSubmit={forgotForm.handleSubmit(async (data) => {
                try {
                  setSendingForgot(true);

                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/associados/forgot-password`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email: data.email }),
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Email não encontrado");
                  }

                  toast.success(
                    "Se o email existir, enviaremos instruções para resetar a senha."
                  );
                  setModalForgot(false);
                  forgotForm.reset();
                } catch (err) {
                  console.log(err)
                  toast.error(
                    "Erro ao enviar email. Verifique o email informado."
                  );
                } finally {
                  setSendingForgot(false);
                }
              })}
            >
              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seuemail@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-roxo hover:bg-roxo/80"
                  disabled={sendingForgot}
                >
                  {sendingForgot ? "Enviando..." : "Enviar link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
