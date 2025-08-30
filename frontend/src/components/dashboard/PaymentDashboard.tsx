"use client"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PaymentDashboard() {
    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-md p-10 max-w-xl text-center space-y-6">
                <CreditCard className="w-12 h-12 text-[#27AE60] mx-auto" />

                <h1 className="text-3xl font-bold text-[#1F1F1F]">Pagamentos</h1>

                <p className="text-gray-600 text-lg">
                    Estamos trabalhando nesta integração! Em breve, você poderá acessar todos os seus boletos e pagamentos diretamente aqui.
                </p>

                <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => toast.message("Funcionalidade ainda não disponível")}
                >
                    OK, Entendi
                </Button>
            </div>

        </div>
    )
}
