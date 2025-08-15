import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaCheckCircle, FaExclamationTriangle, FaWhatsapp } from "react-icons/fa";

export default function CadastroAssociado() {
  return (
    <>
      <Navbar />
      <section className="w-11/12 bg-white mt-4 mx-auto rounded-md shadow-sm p-4">

        {/* Introdução */}
        <h1 className="text-azul text-2xl font-bold mb-2">
          Solicitação de Cadastro
        </h1>
        <p className="text-gray-600 mb-6">
          A <strong>Associação</strong> tem como principal objetivo oferecer um serviço
          de transporte seguro e eficiente, ligando São Sebastião do Paraíso
          às cidades vizinhas, para que estudantes universitários
          possam chegar às suas instituições de ensino com tranquilidade.
          Assim, a distância deixa de ser um obstáculo,
          tornando o sonho da graduação mais próximo e acessível para todos.
        </p>

        {/* Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Passo 1</CardTitle>
              <CardDescription>
                Leia atentamente os Termos e Condições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                Antes de prosseguir com o cadastro, é fundamental conhecer e compreender os Termos e Condições.
              </p>
              <Link
                href="/"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Acesse aqui o Estatuto e os Termos da Associação
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 2</CardTitle>
              <CardDescription>Preencha o formulário de cadastro</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Informe todos os dados solicitados no formulário. As informações fornecidas
                serão utilizadas para análise e validação do seu cadastro junto à A.E.P.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 3</CardTitle>
              <CardDescription>Aguarde a análise e confirmação</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Após o envio do formulário, nossa equipe analisará suas informações e
                entrará em contato para informar sobre a aprovação. Somente após a confirmação
                o acesso ao Portal do Associado será liberado.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefícios */}
        <div className="bg-cinza p-4 rounded-md shadow-inner mb-6">
          <h2 className="text-lg font-bold mb-3">Vantagens de ser Associado</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 w-1/2">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Transporte diário seguro e confortável
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Tarifas reduzidas para associados
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Motoristas experientes e qualificados
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Seguro de viagem incluso
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Canais de comunicação diretos
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Pontualidade e organização
            </li>
          </ul>
        </div>

        {/* Avisos importantes */}
        <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500 mb-6">
          <h2 className="flex items-center gap-2 text-yellow-700 font-bold text-lg mb-2">
            <FaExclamationTriangle /> Avisos Importantes
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Preencha todos os campos corretamente para evitar atrasos.</li>
            <li>Tenha em mãos documentos válidos para envio.</li>
            <li>O prazo médio para análise é de <strong>5 dias úteis</strong>.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-azul mb-3">Dúvidas Frequentes</h2>
          <ul className="space-y-2">
            <li><strong>Quanto custa?</strong> Entre em contato para saber mais sobre valores e mensalidades.</li>
            <li><strong>Qual prazo de análise?</strong> Em média, 5 dias úteis após o envio completo.</li>
            <li><strong>Quais documentos preciso?</strong> RG, CPF e comprovante de residência atual.</li>
          </ul>
          <Link href="/faq" className="text-blue-500 underline hover:text-blue-700 mt-2 inline-block">
            Ver todas as perguntas frequentes
          </Link>
        </div>

        {/* Botões */}
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center select-none">
          <Link href="/associado/formulario">
            <Button className="bg-blue-500 font-semibold hover:scale-105 hover:bg-blue-900 transition duration-300 cursor-pointer">
              Ir para o Cadastro
            </Button>
          </Link>
          <Link href="https://wa.me/5535991220988">
            <Button
              className="bg-verde hover:bg-green-900 transition duration-300 cursor-pointer"
            >
              <FaWhatsapp /> Falar com Suporte
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
