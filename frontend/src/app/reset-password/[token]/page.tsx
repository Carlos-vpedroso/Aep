"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ------------------
// ZOD SCHEMA
// ------------------
const schema = z
  .object({
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmarSenha: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type ResetValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { token } = useParams();

  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    },
  });

  // ------------------
  // SUBMIT HANDLER
  // ------------------
  async function onSubmit(values: ResetValues) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/associados/reset-password/${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ novaSenha: values.senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus("❌ Erro");
        setMensagem(data.error || "Erro ao redefinir a senha.");
      } else {
        setStatus("✅ Sucesso");
        setMensagem(data.message || "Senha redefinida com sucesso!");
        setSuccess(true);
      }
    } catch (error) {
      console.log(error)
      setStatus("❌ Erro");
      setMensagem("Erro ao conectar com o servidor.");
    }
  }

  return (
    <>
      <Navbar />

      <section className="flex w-full h-screen justify-center items-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-azul mb-4">Redefinir Senha</h1>

          {status && (
            <p
              className={`mb-4 font-semibold ${
                status.includes("Erro") ? "text-red-600" : "text-green-600"
              }`}
            >
              {status} — {mensagem}
            </p>
          )}

          {!success ? (
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* CAMPO SENHA */}
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type={showSenha ? "text" : "password"}
                            placeholder="Digite sua nova senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => setShowSenha((v) => !v)}
                          >
                            {showSenha ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CAMPO CONFIRMAR SENHA */}
                <FormField
                  control={form.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type={showConfirmar ? "text" : "password"}
                            placeholder="Confirme a senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => setShowConfirmar((v) => !v)}
                          >
                            {showConfirmar ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-azul text-white font-semibold hover:bg-blue-800"
                >
                  {form.formState.isSubmitting
                    ? "Salvando..."
                    : "Salvar nova senha"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-azul text-white font-semibold rounded-lg hover:bg-blue-800 transition"
              >
                Acessar Login
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
