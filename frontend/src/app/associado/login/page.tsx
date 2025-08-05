// app/login/page.tsx ou /pages/login.tsx (dependendo da sua estrutura)
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const perfis = ["Associado", "Diretoria", "Motorista"]

export default function LoginPage() {
  const [perfilSelecionado, setPerfilSelecionado] = useState("Associado")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-azul to-white">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-preto">
            Login - {perfilSelecionado}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs de perfil */}
          <div className="flex justify-center space-x-2 mb-4">
            {perfis.map((perfil) => (
              <button
                key={perfil}
                onClick={() => setPerfilSelecionado(perfil)}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition duration-300 ${
                  perfilSelecionado === perfil
                    ? "bg-roxo text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {perfil}
              </button>
            ))}
          </div>

          {/* Formulário */}
          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="seuemail@exemplo.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Senha</label>
              <Input
                type="password"
                placeholder="********"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-roxo hover:bg-blue-700 transition text-white font-semibold"
            >
              Entrar
            </Button>
          </form>

          {/* Link de esqueci a senha */}
          <div className="flex text-center mt-3 justify-between">
            <a href="/" className="text-sm text-red-500">
              Voltar
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-800 underline">
              Esqueceu a senha?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
