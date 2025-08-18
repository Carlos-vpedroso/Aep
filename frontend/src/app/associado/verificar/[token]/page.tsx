"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function VerificarPage() {
    const { token } = useParams();
    const [status, setStatus] = useState("Validando...");

    useEffect(() => {
        fetch(`http://localhost:5556/api/associados/verify/${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setStatus(`❌ Erro: ${data.error}`);
                } else {
                    setStatus("✅ Cadastro confirmado com sucesso!");
                }
            })
            .catch(() => setStatus("Erro ao conectar com o servidor."));
    }, [token]);

    return (
        <>
            <Navbar />
            <section className="flex w-full h-screen justify-center items-center bg-gray-50 px-4">
                <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-azul mb-4">
                        Cadastro Confirmado!
                    </h1>
                    <p className="text-gray-700 mb-6">
                        Parabéns, seu cadastro foi validado com sucesso. Agora você pode acessar a área do associado e aproveitar todos os benefícios.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-azul text-white font-semibold rounded-lg hover:bg-blue-800 transition"
                    >
                        Acessar Área do Associado
                    </Link>
                </div>
            </section>
        </>
    );
}
