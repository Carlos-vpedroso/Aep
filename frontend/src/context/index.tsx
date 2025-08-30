"use client"
import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AuthContextType, UserInfo } from "@/types";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const router = useRouter();

    const Login = async (email: string, senha: string, endpoint: string) => {
        if (!email || !senha) {
            toast.error("Preencha todos os campos");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            const data: { token: string; id: string; email: string; message?: string } = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Erro ao fazer login");
                return;
            }

            Cookies.set("token", data.token, { expires: 1, sameSite: 'Strict', path: '/' });
            Cookies.set("user", JSON.stringify({ id: data.id, email: data.email }), { expires: 1, sameSite: 'Strict', path: '/' });

            if (endpoint === '/associados/login') {
                router.push("/associado/dashboard");
            } else if (endpoint === '/diretoria/login') {
                router.push("/diretoria/dashboard");
            } else {
                router.push("/motorista/dashboard");
            }

        } catch (error) {
            console.error("Erro no login:", error);
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const getInformations = async (id: string, token:string): Promise<UserInfo | null> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/associados/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }), 
                },
            });

            if (!response.ok) {
                console.error("Erro ao buscar informações:", response.statusText);
                return null;
            }

            const data: UserInfo = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao conectar com a API:", error);
            return null;
        }
    };

    const Logout = () => {
        Cookies.remove('user');
        Cookies.remove('token');
        router.push('/login');
    };

    return <AuthContext.Provider
        value={{
            userInfo,
            setUserInfo,
            loading,
            setLoading,
            Login,
            Logout,
            getInformations
        }}
    >
        {children}
    </AuthContext.Provider>

}

export default AuthProvider;


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}