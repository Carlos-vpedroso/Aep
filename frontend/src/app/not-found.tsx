"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 py-16">
        <div className="mb-6">
          <Image
            src="/EstudanteOnibus.png"
            alt="Página não encontrada"
            width={260}
            height={260}
            className="opacity-90 drop-shadow-xl"
          />
        </div>

        <h1 className="text-4xl font-bold text-[#0057D9]">
          Ops! Essa página ainda não existe 🙁
        </h1>

        <p className="text-gray-600 max-w-lg mt-4 text-lg">
          Parece que você tentou acessar uma rota que ainda não está disponível.
          Mas estamos trabalhando para disponibilizar tudo o mais rápido
          possível.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/">
            <Button className="bg-[#0057D9] text-white hover:bg-[#0047b3] cursor-pointer">
              <Home className="w-5 h-5 mr-2" />
              Voltar para a Home
            </Button>
          </Link>

          <Link href="https://wa.me/5535991220988">
            <Button variant="ghost" className="text-[#27AE60] cursor-pointer">
              <MapPin className="w-5 h-5 mr-2" />
              Falar com suporte
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Código do erro: <span className="font-semibold">404</span>
        </p>
      </main>

      <Footer />
    </>
  );
}
