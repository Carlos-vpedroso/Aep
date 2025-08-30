'use client'
import { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { Home, FileText, LogOut, X, Menu, ListCollapse, Users } from 'lucide-react'
import { useAuth } from '@/context';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import Image from 'next/image';
import logoAep from '../../../../public/LogoAEP-transparente2.png'
import HomeDiretoria from '@/components/dashboardDiretoria/HomeDiretoria';
import { QuantidadeAssociadosCidade, QuantidadeAssociadosModalidade, QuantidadeAssociadosSituacao } from '@/types';
import ListasDiretoria from '@/components/dashboardDiretoria/ListasDiretoria';
import AssociadosDiretoria from '@/components/dashboardDiretoria/AssociadosDiretoria'
import PagamentosDiretoria from '@/components/dashboardDiretoria/PagamentosDiretoria';

interface Tab {
    label: string;
    icon: React.ReactNode;
    action?: () => void;
    isLogout?: boolean;
}

const DasboardSideBar: NextPage = () => {
    const { Logout, setLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [quantidadePorCidade, setQuantidadePorCidade] = useState<QuantidadeAssociadosCidade | null>(null)
    const [quantidadePorModalidade, setQuantidadePorModalidade] = useState<QuantidadeAssociadosModalidade | null>(null)
    const [quantidadePorSituacao, setQuantidadePorSituacao] = useState<QuantidadeAssociadosSituacao | null>(null)


    const tabs: Tab[] = [
        { label: "Home", icon: <Home size={20} /> },
        { label: "Listas", icon: <ListCollapse size={20} /> },
        { label: "Associados", icon: <Users size={20} /> },
        { label: "Pagamentos", icon: <FileText size={20} /> },
        // { label: "Configurações", icon: <Settings size={20} /> },
        { label: "Logout", icon: <LogOut size={20} />, isLogout: true, action: Logout },
    ];

    useEffect(() => {
        const fetchDados = async () => {
            setLoading(true);
            try {
                const token = Cookies.get("token");
                if (!token) return;

                const headers = {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                };

                // Executa as 3 requisições em paralelo
                const [resCidades, resModalidade, resSituacao] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/quantidade/cidade`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/quantidade/modalidade`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/quantidade/situacao`, { headers }),
                ]);

                if (!resCidades.ok || !resModalidade.ok || !resSituacao.ok) {
                    throw new Error("Erro em uma das requisições");
                }

                // Converte todas as respostas em JSON ao mesmo tempo
                const [dataCidades, dataModalidade, dataSituacao] = await Promise.all([
                    resCidades.json(),
                    resModalidade.json(),
                    resSituacao.json(),
                ]);

                // Atualiza os states
                setQuantidadePorCidade(dataCidades);
                setQuantidadePorModalidade(dataModalidade);
                setQuantidadePorSituacao(dataSituacao);

            } catch (error) {
                console.error("Erro no fetchDados:", error);
            } finally {
                // setTimeout(() => {
                //     setLoading(false)
                // }, 5000)
                setLoading(false)
            }
        };

        fetchDados();
    }, [setLoading]);


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
                        src={logoAep}
                        alt="A.E.P. Logo"
                        className="w-12 h-12 object-contain"
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
                                    { quantidadePorModalidade && quantidadePorSituacao && (
                                        <HomeDiretoria
                                            quantidadesModalidade={quantidadePorModalidade}
                                            quantidadesSituacao={quantidadePorSituacao}
                                        />
                                    )}
                                </>
                            )
                        case "Listas":
                            return (
                                <>
                                    <ListasDiretoria/>
                                </>
                            )
                        case "Associados":
                            return (
                                <>
                                    { quantidadePorCidade && quantidadePorModalidade && quantidadePorSituacao && (
                                        <AssociadosDiretoria
                                            quantidadesModalidade={quantidadePorModalidade}
                                            quantidadesSituacao={quantidadePorSituacao}
                                            quantidadesCidade={quantidadePorCidade}
                                        />
                                    )}
                                </>
                            )
                        case "Pagamentos":
                            return (
                                <>
                                    <PagamentosDiretoria/>
                                </>
                            )
                        default:
                            return <p>Selecione uma aba.</p>
                    }
                })()}
            </main>
        </div>
    )
}

export default DasboardSideBar