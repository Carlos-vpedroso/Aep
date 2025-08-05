"use client"
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import estudanteOnibus from '../../public/EstudanteOnibus.png'
import { BusFront, ChevronRight, MapPin, User, Wallet } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link";


export default function Home() {
  return (
    <>
      <Navbar />
      <section className="grid md:grid-cols-2 bg-blue-300 min-h-[300px] w-11/12 mx-auto rounded-sm my-4 px-4 pt-4">
        <div className="space-y-6 mx-auto">
          <h1 className="font-bold text-3xl">Transporte para <br /> universitários</h1>
          <p className="font-semibold text-xl">Oferecemos transporte para <br />estudantes universitários até<br />suas faculdades.</p>
          <Button variant="default" className="cursor-pointer bg-verde text-white hover:bg-green-900 transition duration-300">Seja um Associado</Button>
        </div>
        <div className="flex items-center justify-center h-full mx-auto">
          <Image
            src={estudanteOnibus}
            alt="Ícone Estudante"
            className="w-[90%] max-w-md h-auto object-contain"
          />
        </div>
      </section>
      <section className="bg-white pb-4 w-11/12 mx-auto rounded-sm">
        <h1 className="p-4 text-azul font-bold text-xl">Como Funciona</h1>
        <div className="grid grid-cols-3 gap-4 px-4">
          <Link href="/" className="mx-auto w-full border-2 border-gray-200 rounded-md hover:shadow-md hover:border-gray-400 transition duration-200">
            <div className="flex bg-green-800 w-10 h-10 mx-auto rounded-full items-center justify-center m-2">
              <User className="text-white" />
            </div>
            <h1 className="text-center font-bold">Cadastro</h1>
          </Link>
          <Link href="/" className="mx-auto w-full border-2 border-gray-200 rounded-md hover:shadow-md hover:border-gray-400 transition duration-200">
            <div className="flex bg-green-800 w-10 h-10 mx-auto rounded-full items-center justify-center m-2">
              <Wallet className="text-white" />
            </div>
            <h1 className="text-center font-bold">Pagamento</h1>
          </Link>
          <Link href="/" className="mx-auto w-full border-2 border-gray-200 rounded-md hover:shadow-md hover:border-gray-400 transition duration-200">
            <div className="flex bg-green-800 w-10 h-10 mx-auto rounded-full items-center justify-center m-2">
              <BusFront className="text-white" />
            </div>
            <h1 className="text-center font-bold">Transporte</h1>
          </Link>
        </div>
      </section>
      <section className="bg-white w-11/12 mx-auto my-4 rounded-sm pb-4">
        <h1 className="p-4 text-azul font-bold text-xl">Cidades que ofererecemos Transporte</h1>
        <div className="flex space-x-2 items-center ml-4">
          <div className="flex w-10 h-10 rounded-sm bg-azul items-center justify-center">
            <BusFront className="text-white" />
          </div>
          <h1 className="font-semibold text-lg">Franca</h1>
        </div>
        <div className="w-11/12 md:w-3/4 mx-auto my-6">
          <Carousel
            className="select-none"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent>
              {[
                {
                  turno: "Matutino",
                  origem: "São Sebastião do Paraíso",
                  destino: "Franca",
                  saida: "7:00",
                  chegada: "8:00"
                },
                {
                  turno: "Matutino",
                  origem: "Franca",
                  destino: "São Sebastião do Paraíso",
                  saida: "11:30",
                  chegada: "12:30"
                },
                {
                  turno: "Noturno",
                  origem: "São Sebastião do Paraíso",
                  destino: "Franca",
                  saida: "18:00",
                  chegada: "19:10"
                },
                {
                  turno: "Noturno",
                  origem: "Franca",
                  destino: "São Sebastião do Paraíso",
                  saida: "22:30",
                  chegada: "23:30"
                },
              ].map((rota, index) => (
                <CarouselItem key={index}>
                  <div className="border rounded-xl p-6 shadow-md bg-white/80 backdrop-blur-md">
                    <h1 className="text-lg font-bold mb-2">{rota.turno}</h1>
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{rota.origem}</span>
                      <ChevronRight className="w-4 h-4" />
                      <span>{rota.destino}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-gray-700">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <span>Saída - <strong>{rota.saida}</strong></span>
                        <span>Chegada - <strong>{rota.chegada}</strong></span>
                      </div>
                      <Button
                        variant="default"
                        className="bg-amarelo text-white hover:bg-yellow-700 transition duration-300 hover:scale-105 cursor-pointer"
                      >
                        Confira a rota
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex space-x-2 items-center ml-4">
          <div className="flex w-10 h-10 rounded-sm bg-azul items-center justify-center">
            <BusFront className="text-white" />
          </div>
          <h1 className="font-semibold text-lg">Passos</h1>
        </div>

        <div className="w-11/12 md:w-3/4 mx-auto my-6">
          <Carousel
            className="select-none"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent>
              {[
                {
                  turno: "Matutino",
                  origem: "São Sebastião do Paraíso",
                  destino: "Passos",
                  saida: "7:00",
                  chegada: "8:00"
                },
                {
                  turno: "Matutino",
                  origem: "Passos",
                  destino: "São Sebastião do Paraíso",
                  saida: "11:30",
                  chegada: "12:30"
                },
                {
                  turno: "Noturno",
                  origem: "São Sebastião do Paraíso",
                  destino: "Passos",
                  saida: "18:00",
                  chegada: "19:10"
                },
                {
                  turno: "Noturno",
                  origem: "Passos",
                  destino: "São Sebastião do Paraíso",
                  saida: "22:30",
                  chegada: "23:30"
                },
              ].map((rota, index) => (
                <CarouselItem key={index}>
                  <div className="border rounded-xl p-6 shadow-md bg-white/80 backdrop-blur-md">
                    <h1 className="text-lg font-bold mb-2">{rota.turno}</h1>
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{rota.origem}</span>
                      <ChevronRight className="w-4 h-4" />
                      <span>{rota.destino}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-gray-700">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <span>Saída - <strong>{rota.saida}</strong></span>
                        <span>Chegada - <strong>{rota.chegada}</strong></span>
                      </div>
                      <Button
                        variant="default"
                        className="bg-amarelo text-white hover:bg-yellow-700 transition duration-300 hover:scale-105 cursor-pointer"
                      >
                        Confira a rota
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex space-x-2 items-center ml-4">
          <div className="flex w-10 h-10 rounded-sm bg-azul items-center justify-center">
            <BusFront className="text-white" />
          </div>
          <h1 className="font-semibold text-lg">Batatais</h1>
        </div>
        <div className="w-11/12 md:w-3/4 mx-auto my-6">
          <Carousel
            className="select-none"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent>
              {[
                {
                  turno: "Noturno",
                  origem: "São Sebastião do Paraíso",
                  destino: "Batatais",
                  saida: "18:00",
                  chegada: "19:10"
                },
                {
                  turno: "Noturno",
                  origem: "Batatais",
                  destino: "São Sebastião do Paraíso",
                  saida: "22:30",
                  chegada: "23:30"
                },
              ].map((rota, index) => (
                <CarouselItem key={index}>
                  <div className="border rounded-xl p-6 shadow-md bg-white/80 backdrop-blur-md">
                    <h1 className="text-lg font-bold mb-2">{rota.turno}</h1>
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{rota.origem}</span>
                      <ChevronRight className="w-4 h-4" />
                      <span>{rota.destino}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-gray-700">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <span>Saída - <strong>{rota.saida}</strong></span>
                        <span>Chegada - <strong>{rota.chegada}</strong></span>
                      </div>
                      <Button
                        variant="default"
                        className="bg-amarelo text-white hover:bg-yellow-700 transition duration-300 hover:scale-105 cursor-pointer"
                      >
                        Confira a rota
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <section className="bg-white w-11/12 mx-auto rounded-sm py-6 px-4">
        <h2 className="text-azul font-bold text-xl mb-4">Sobre a Associação</h2>
        <p className="">
          Somos uma associação sem fins lucrativos criada para garantir transporte acessível e seguro aos estudantes universitários da região. Desde 2020, já ajudamos mais de 300 alunos a chegarem até suas instituições de ensino com conforto e segurança.
        </p>
      </section>
    </>
  );
}