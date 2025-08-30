"use client"
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import estudanteOnibus from '../../public/EstudanteOnibus.png'
import { 
  BusFront, 
  ChevronRight, 
  MapPin, 
  User, 
  Wallet, 
  Clock,
  Star,
  Shield,
  Users,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  Timer,
  Navigation,
  Route,
  Award,
  Heart,
  Target
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Segurança",
      description: "Transporte seguro e confiável para todos os estudantes",
      color: "bg-[#27AE60]"
    },
    {
      icon: Clock,
      title: "Pontualidade",
      description: "Horários rigorosamente cumpridos para não atrasar suas aulas",
      color: "bg-[#0057D9]"
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Mais de 300 estudantes já fazem parte da nossa associação",
      color: "bg-[#7C3AED]"
    },
    {
      icon: Wallet,
      title: "Preço Justo",
      description: "Valores acessíveis para estudantes universitários",
      color: "bg-[#FFB400]"
    }
  ];

  const stats = [
    { number: "300+", label: "Estudantes Atendidos", icon: Users },
    { number: "3", label: "Cidades Atendidas", icon: MapPin },
    { number: "5+", label: "Anos de Experiência", icon: Award },
    { number: "98%", label: "Satisfação dos Usuários", icon: Heart }
  ];

  const steps = [
    {
      step: "01",
      icon: User,
      title: "Cadastro",
      description: "Faça seu cadastro online de forma rápida e simples",
      link: "/associado/cadastro"
    },
    {
      step: "02", 
      icon: Wallet,
      title: "Pagamento",
      description: "Escolha o plano que melhor se adapta à sua rotina",
      link: "/"
    },
    {
      step: "03",
      icon: BusFront,
      title: "Transporte",
      description: "Gere sua passagem e embarque com tranquilidade",
      link: "/"
    }
  ];

  const cities = [
    {
      name: "Franca",
      routes: [
        {
          turno: "Matutino",
          origem: "São Sebastião do Paraíso",
          destino: "Franca",
          saida: "7:00",
          chegada: "8:00",
          duration: "1h"
        },
        {
          turno: "Matutino",
          origem: "Franca",
          destino: "São Sebastião do Paraíso",
          saida: "11:30",
          chegada: "12:30",
          duration: "1h"
        },
        {
          turno: "Noturno",
          origem: "São Sebastião do Paraíso",
          destino: "Franca",
          saida: "18:00",
          chegada: "19:10",
          duration: "1h 10min"
        },
        {
          turno: "Noturno",
          origem: "Franca",
          destino: "São Sebastião do Paraíso",
          saida: "22:30",
          chegada: "23:30",
          duration: "1h"
        },
      ]
    },
    {
      name: "Passos",
      routes: [
        {
          turno: "Matutino",
          origem: "São Sebastião do Paraíso",
          destino: "Passos",
          saida: "7:00",
          chegada: "8:00",
          duration: "1h"
        },
        {
          turno: "Matutino",
          origem: "Passos",
          destino: "São Sebastião do Paraíso",
          saida: "11:30",
          chegada: "12:30",
          duration: "1h"
        },
        {
          turno: "Noturno",
          origem: "São Sebastião do Paraíso",
          destino: "Passos",
          saida: "18:00",
          chegada: "19:10",
          duration: "1h 10min"
        },
        {
          turno: "Noturno",
          origem: "Passos",
          destino: "São Sebastião do Paraíso",
          saida: "22:30",
          chegada: "23:30",
          duration: "1h"
        },
      ]
    },
    {
      name: "Batatais",
      routes: [
        {
          turno: "Noturno",
          origem: "São Sebastião do Paraíso",
          destino: "Batatais",
          saida: "18:00",
          chegada: "19:10",
          duration: "1h 10min"
        },
        {
          turno: "Noturno",
          origem: "Batatais",
          destino: "São Sebastião do Paraíso",
          saida: "22:30",
          chegada: "23:30",
          duration: "1h"
        },
      ]
    }
  ];

  const getTurnoColor = (turno: string) => {
    return turno === 'Matutino' ? 
      'bg-[#FFB400]/10 text-[#FFB400] border-[#FFB400]' : 
      'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]';
  };

  const getTurnoIcon = (turno: string) => {
    return turno === 'Matutino' ? '🌅' : '🌙';
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0057D9] via-[#0057D9]/90 to-[#7C3AED]/80 min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative grid md:grid-cols-2 gap-8 w-11/12 max-w-7xl mx-auto px-4 py-12 items-center min-h-[500px]">
          <div className="space-y-6 text-white z-10">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                Transporte Universitário
              </Badge>
              <h1 className="font-bold text-4xl md:text-5xl leading-tight">
                Transporte para <br />
                <span className="text-[#FFB400]">universitários</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Oferecemos transporte seguro e confiável para estudantes universitários até suas faculdades, 
                conectando sonhos à educação.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/associado/cadastro">
                <Button 
                  size="lg" 
                  className="bg-[#27AE60] text-white hover:bg-[#27AE60]/90 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
                >
                  <User className="w-5 h-5 mr-2" />
                  Seja um Associado
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-preto hover:bg-yellow-500/80 backdrop-blur-sm cursor-pointer"
              >
                <Phone className="w-5 h-5 mr-2" />
                Entre em Contato
              </Button>
            </div>

            {/* Stats na Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-[#FFB400]">{stat.number}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFB400]/20 to-[#27AE60]/20 rounded-3xl blur-3xl"></div>
            <Image
              src={estudanteOnibus}
              alt="Estudante no Ônibus"
              className="relative w-full max-w-md h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="w-11/12 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F1F1F] mb-4">Por que escolher a A.E.P?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Oferecemos muito mais que transporte. Oferecemos segurança, pontualidade e a tranquilidade 
              que você precisa para focar nos seus estudos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F1F1F] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="w-11/12 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0057D9] mb-4">Como Funciona</h2>
            <p className="text-gray-600 text-lg">Apenas 3 passos simples para começar sua jornada conosco</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                {/* Número do passo */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-[#0057D9]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#0057D9] font-bold text-lg">{step.step}</span>
                </div>

                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-[#27AE60] rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#1F1F1F] mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <Link href={step.link}>
                    <Button 
                      variant="ghost" 
                      className="text-[#0057D9] hover:bg-[#0057D9]/10 p-0 h-auto font-medium group"
                    >
                      Saiba mais
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities and Routes Section */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="w-11/12 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0057D9] mb-4">Cidades que Atendemos</h2>
            <p className="text-gray-600 text-lg">Rotas estratégicas para conectar você à sua educação</p>
          </div>

          <div className="space-y-12">
            {cities.map((city, cityIndex) => (
              <div key={cityIndex}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#0057D9] rounded-lg flex items-center justify-center">
                    <BusFront className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#1F1F1F]">{city.name}</h3>
                    <p className="text-gray-600">{city.routes.length} rotas disponíveis</p>
                  </div>
                </div>

                <div className="w-full">
                  <Carousel
                    className="select-none"
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                  >
                    <CarouselContent className="-ml-4">
                      {city.routes.map((rota, index) => (
                        <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg text-[#1F1F1F]">{rota.turno}</CardTitle>
                                <Badge variant="outline" className={getTurnoColor(rota.turno)}>
                                  {getTurnoIcon(rota.turno)} {rota.turno}
                                </Badge>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              {/* Rota */}
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-[#27AE60]" />
                                <span className="text-sm">{rota.origem}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-sm">{rota.destino}</span>
                              </div>

                              {/* Horários */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 bg-[#27AE60]/10 rounded-lg">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Timer className="w-3 h-3 text-[#27AE60]" />
                                    <span className="text-xs text-[#27AE60]">Saída</span>
                                  </div>
                                  <span className="font-semibold text-[#1F1F1F]">{rota.saida}</span>
                                </div>
                                <div className="text-center p-3 bg-[#0057D9]/10 rounded-lg">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Navigation className="w-3 h-3 text-[#0057D9]" />
                                    <span className="text-xs text-[#0057D9]">Chegada</span>
                                  </div>
                                  <span className="font-semibold text-[#1F1F1F]">{rota.chegada}</span>
                                </div>
                              </div>

                              {/* Duração */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>Duração: {rota.duration}</span>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                className="w-full border-[#FFB400] text-[#FFB400] hover:bg-[#FFB400]/10"
                              >
                                <Route className="w-4 h-4 mr-2" />
                                Ver Rota Completa
                              </Button>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="w-11/12 max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0057D9] mb-6">Sobre a Associação</h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  Somos uma associação sem fins lucrativos criada para garantir transporte acessível e seguro 
                  aos estudantes universitários da região. Desde 2020, já ajudamos mais de 300 alunos a 
                  chegarem até suas instituições de ensino com conforto e segurança.
                </p>
                <p>
                  Nossa missão é democratizar o acesso à educação superior, oferecendo uma alternativa 
                  de transporte confiável e economicamente viável para estudantes que precisam se deslocar 
                  entre cidades para estudar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-[#0057D9]/10 rounded-lg">
                  <Target className="w-8 h-8 text-[#0057D9] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#0057D9]">98%</div>
                  <div className="text-sm text-gray-600">Taxa de Satisfação</div>
                </div>
                <div className="text-center p-4 bg-[#27AE60]/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-[#27AE60] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#27AE60]">5+</div>
                  <div className="text-sm text-gray-600">Anos de Experiência</div>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-[#1F1F1F] mb-6 text-center">Entre em Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#27AE60] rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F1F1F]">(35) 99999-9999</p>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0057D9] rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F1F1F]">contato@aep.com.br</p>
                      <p className="text-sm text-gray-500">E-mail</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-[#0057D9] hover:bg-[#0057D9]/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Falar Conosco
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}