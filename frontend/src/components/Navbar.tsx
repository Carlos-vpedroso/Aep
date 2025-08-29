"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, User, Menu, X } from "lucide-react";
import logoAep from '../../public/LogoAEP-transparente2.png';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Diretoria', href: '/login' },
    { name: 'Motorista', href: '/login' },
  ];

  const associadoLinks = [
    { name: 'Login', href: '/login', icon: <LogIn className="w-4 h-4" /> },
    { name: 'Inscrição', href: '/associado/cadastro', icon: <User className="w-4 h-4" /> },
    { name: 'Benefícios', href: '/associado/beneficios' },
  ];

  return (
    <nav className="w-full bg-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoAep}
            alt="A.E.P. Logo"
            className="w-12 h-12 md:w-15 md:h-15 object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="text-gray-600 hover:text-azul transition-colors duration-200 font-medium text-sm"
            >
              {link.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-azul text-white hover:bg-blue-950 hover:text-white text-sm font-medium flex items-center gap-1">
                Associado <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {associadoLinks.map(link => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="flex items-center gap-2">
                    {link.icon} {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-3">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="block text-gray-600 hover:text-azul transition-colors duration-200 font-medium text-base"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center bg-azul text-white hover:bg-blue-950 hover:text-white text-base font-medium">
                Associado <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {associadoLinks.map(link => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.icon} {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
}
