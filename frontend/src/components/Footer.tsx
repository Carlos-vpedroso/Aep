import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-azul text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            A.E.P. - Associação Dos Estudantes Paraisenses
          </h2>
          <p className="text-sm text-gray-200">
            Trabalhando para oferecer benefícios e apoio aos nossos associados.
          </p>
        </div>

        {/* Coluna 2 - Links Úteis */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Links Úteis</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline">
                Suporte
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Entre em Contato
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Dúvidas Frequentes
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3 - Contato */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contato</h3>
          <ul className="space-y-2">
            <li>
              Email:{" "}
              <a href="mailto:contato@aepssp.com" className="hover:underline">
                contato@aepssp.com
              </a>
            </li>
            <li>
              Telefone:{" "}
              <a href="https://wa.me/5535991220988" className="hover:underline">
                (35) 99122-0988
              </a>
            </li>
            <li>
              Endereço: Rua Manoel De Oliveira Mafra, 932 - São Sebastião do
              Paraíso/MG
            </li>
          </ul>
        </div>

        {/* Coluna 4 - Redes Sociais */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Siga-nos</h3>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/5535991220988"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400"
            >
              <FaWhatsapp />
            </a>
            <a
              href="mailto:associacaodosestudantesa.e.p@gmail.com"
              className="hover:text-yellow-400"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-blue-900 py-4 text-sm text-gray-300">
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-between max-w-7xl mx-auto">
          <div>
            © {new Date().getFullYear()} A.E.P. - Todos os direitos reservados.
          </div>
          <Link href="https://www.teczed.com.br">
            <Image
              src="/TecZed_Triangle+TECZED.svg"
              alt="TecZed Solutions"
              width={48}
              height={48}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
