'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"
import { useAuth } from "@/context"
import { UserInfo } from "@/types"
import Cookies from "js-cookie"
import ProgressBar from "@/components/ProgressBar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MultiStepForm from "@/components/MultiStepForm"


const tabs = ['Home', 'Perfil', 'Relatórios', 'Configurações']

export default function DashboardSidebar() {

  const { getInformations, loading, setLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [countEtapa, setCountEtapa] = useState<Number>(0)


  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userCookie = Cookies.get("user");
        if (!userCookie) return;

        const userObj = JSON.parse(userCookie);
        const id = userObj.id;

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
  }, []);

  if (userInfo?.firstTime) {
    return (
      <section className="flex w-full min-h-screen">
        <MultiStepForm userInfo={userInfo}/>
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
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
              className="justify-start"
            >
              {tab}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {/* Botão hamburger mobile */}
        <div className="md:hidden mb-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
        <p>Conteúdo do dashboard aqui...</p>
        <Button onClick={(e) => console.log(userInfo)}>Teste</Button>
      </main>
    </div>
  )
}
