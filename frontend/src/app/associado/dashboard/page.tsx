'use client'
import React from 'react'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Menu, Home, Ticket, User, Route, FileText, LogOut } from "lucide-react"
import { useAuth } from "@/context"
import Cookies from "js-cookie"
import MultiStepForm from "@/components/MultiStepForm"
import Image from "next/image"
import RotasDashboard from '@/components/dashboard/RotasDashboard'
import HomeDashboard from '@/components/dashboard/HomeDashboard'
import TravelDashboard from '@/components/dashboard/TravelDashboard'
import AguardarAprovacao from '@/components/AguardarAprovacao'
import PaymentDashboard from '@/components/dashboard/PaymentDashboard'
import ProfileDashboard from '@/components/dashboard/ProfileDashboard'
import Spinner from '@/components/Spinner'

interface Tab {
  label: string;
  icon: React.ReactNode;
  action?: () => void;
  isLogout?: boolean;
}

export default function DashboardSidebar() {

  const { getInformations, loading, setLoading, userInfo, setUserInfo, Logout } = useAuth();
  const [idUser, setIdUser] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')

  const tabs: Tab[] = [
    { label: "Home", icon: <Home size={20} /> },
    { label: "Travel", icon: <Ticket size={20} /> },
    { label: "Rotas", icon: <Route size={20} /> },
    { label: "Pagamentos", icon: <FileText size={20} /> },
    { label: "Perfil", icon: <User size={20} /> },
    // { label: "Configurações", icon: <Settings size={20} /> },
    { label: "Logout", icon: <LogOut size={20} />, isLogout: true, action: Logout },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userCookie = Cookies.get("user");
        if (!userCookie) return;

        const userObj = JSON.parse(userCookie);
        const id = userObj.id;
        setIdUser(id)

        const token = Cookies.get("token");
        if (!token) return;

        const data = await getInformations(id, token);
        setUserInfo(data);

      } catch (err) {
        console.error("Erro ao buscar informações do usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [getInformations, setLoading, setUserInfo]);

  if (loading) {
    return (
      <div className="rounded-md flex flex-1 min-h-screen justify-center items-center bg-white">
        <Spinner size="w-10 h-10" color="border-blue-500" />
      </div>
    );
  }

  if (userInfo?.firstTime) {
    return (
      <section className="flex w-full min-h-screen">
        <MultiStepForm userInfo={userInfo} id={idUser} functionSet={setUserInfo} />
      </section>
    )
  }

  if (userInfo?.situacao === 'Pendente') {
    return (
      <section className="flex w-full min-h-screen">
        <AguardarAprovacao />
      </section>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Overlay escuro no mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 flex flex-col transform transition-transform duration-300 z-20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>

        {/* Cabeçalho mobile */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Painel</h2>
          <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Cabeçalho desktop */}
        <h2 className="text-xl font-bold mb-6 hidden md:block">Painel</h2>

        {/* Menu */}
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              variant={activeTab === tab.label && !tab.isLogout ? "default" : "ghost"}
              onClick={() => {
                if (tab.isLogout && tab.action) {
                  tab.action();
                  setSidebarOpen(false)
                } else {
                  setActiveTab(tab.label);
                  setSidebarOpen(false)
                }
              }}
              className={`justify-start 
                ${tab.isLogout ? "bg-red-500 text-white hover:bg-red-600" : ""} 
                ${activeTab === tab.label && !tab.isLogout ? "bg-azul hover:bg-blue-900" : ""}`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {/* Botão hamburger mobile */}
        <div className="md:hidden flex w-full items-center justify-between mb-6">
          <Image
            src="/LogoAEP-transparente2.png"
            alt="A.E.P. Logo"
            height={24}
            width={24}
            className="object-contain"
            priority
          />
          <Button variant="default" className="bg-azul" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        {/* Conteúdo dinâmico baseado na tab ativa */}
        {(() => {
          switch (activeTab) {
            case "Home":
              return (
                <>
                  {userInfo && (
                    <HomeDashboard usuario={userInfo} setTab={setActiveTab} />
                  )}
                </>
              )
            case "Travel":
              return (
                <>
                  {userInfo && (
                    <TravelDashboard nome={userInfo.nome} cidadeTransporte={userInfo.cidadeTransporte} id={idUser} turno={userInfo.turno} />
                  )}
                </>
              )
            case "Rotas":
              return (
                <>
                  {userInfo && (
                    <RotasDashboard cidadeTransporte={userInfo.cidadeTransporte} turno={userInfo.turno} />
                  )}
                </>
              )
            case "Pagamentos":
              return (
                <>
                  <PaymentDashboard />
                </>
              )
            case "Perfil":
              return (
                <>
                  {userInfo && (
                    <ProfileDashboard usuario={userInfo} />
                  )}
                </>
              )
            default:
              return <p>Selecione uma aba.</p>;
          }
        })()}
      </main>
    </div>
  )
}
