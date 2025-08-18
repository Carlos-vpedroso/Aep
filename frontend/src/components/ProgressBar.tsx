"use client"
import { useMemo } from "react"
import { UserInfo } from "@/types"

interface ProgressBarProps {
  user: UserInfo | null
}

export default function ProgressBar({ user }: ProgressBarProps) {

  const progress = useMemo(() => {
    if (!user) return 0

    // lista dos campos obrigatórios que contam para o progresso
    const fields = [
      user.cpf,
      user.rg,
      user.telefone,
      user.rua,
      user.numero,
      user.bairro,
      user.cidade,
      user.cep,
      user.faculdade,
      user.curso,
      user.turno,
      user.cidadeTransporte,
      user.modalidadeTransporte
    ]

    const filled = fields.filter((f) => f && f.toString().trim() !== "").length
    return Math.round((filled / fields.length) * 100)
  }, [user])

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Progresso</span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor:
              progress < 40 ? "#f87171" : progress < 80 ? "#facc15" : "#22c55e", // vermelho -> amarelo -> verde
          }}
        />
      </div>
    </div>
  )
}
