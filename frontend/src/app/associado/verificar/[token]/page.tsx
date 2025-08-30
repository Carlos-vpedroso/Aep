"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function VerificarPage() {
    const { token } = useParams();
    const [status, setStatus] = useState("Validando...");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/verify/${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setStatus("❌ Erro");
                    setMensagem(data.error);
                } else if (data.message) {
                    setStatus("✅ Sucesso");
                    setMensagem(data.message);
                } else {
                    setStatus("❌ Erro");
                    setMensagem("Resposta inesperada do servidor.");
                }
            })
            .catch(() => {
                setStatus("❌ Erro");
                setMensagem("Erro ao conectar com o servidor.");
            });
    }, [token]);

    return (
        <>
            <Navbar />
            <section className="flex w-full h-screen justify-center items-center bg-gray-50 px-4">
                <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-azul mb-4">{status}</h1>
                    <p className="text-gray-700 mb-6">{mensagem}</p>
                    {status === "✅ Sucesso" && (
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 bg-azul text-white font-semibold rounded-lg hover:bg-blue-800 transition"
                        >
                            Acessar Área do Associado
                        </Link>
                    )}
                </div>
            </section>
        </>
    );
}
