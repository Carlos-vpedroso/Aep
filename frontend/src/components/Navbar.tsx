"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogIn, User } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          A.E.P.
        </Link>
        <div className="flex space-x-6 items-center">
          <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
            Início
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white bg-azul text-sm font-medium hover:bg-blue-950 hover:text-white">
                Associado <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/associado/login">Login <LogIn/></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/associado/inscricao">Inscrição</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/associado/beneficios">Benefícios</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/diretoria" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Diretoria
          </Link>
          <Link href="/motorista" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Motorista
          </Link>
        </div>
      </div>
    </nav>
  )
}
