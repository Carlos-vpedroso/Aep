# 🚌 Sistema A.E.P. — Associação dos Estudantes Paraisenses

Plataforma completa de **gestão associativa** desenvolvida para a **A.E.P. (Associação dos Estudantes Paraisenses)**, responsável por organizar e administrar o transporte universitário para três cidades.

O sistema facilita o gerenciamento de **pagamentos, passagens, adesões e relatórios**, oferecendo painéis distintos para **associados** e **diretoria**, com foco em automação e transparência.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Licença](#-licença)

---

## 🚀 Funcionalidades

### 👥 Gestão de Associados

- Cadastro, edição e exclusão de associados
- Controle de adesões e status ativo/inativo

### 💳 Pagamentos e Passagens

- Geração automática de pagamentos mensais
- Emissão de passagens com QR Code
- Histórico e controle financeiro

### 📊 Dashboard e Administração

- Painel da diretoria com gráficos de receita, despesas e adesões
- Dashboard individual para cada associado

### 🔔 Automação e Notificações

- Notificações em tempo real via **Socket.io**
- Agendamentos automáticos com **node-cron**
- Envio de e-mails automatizados via **Nodemailer**

### 🧾 API Documentada

- Rotas REST padronizadas
- Documentação interativa com **Swagger**

---

## 🧠 Tecnologias

### **Frontend**

Desenvolvido com **Next.js** e **Tailwind CSS**, proporcionando uma interface moderna, responsiva e acessível.

**Principais dependências:**
"next": "15.4.1",
"react-hook-form": "^7.62.0",
"zod": "^4.0.17",
"tailwind-merge": "^3.3.1",
"lucide-react": "^0.525.0",
"@radix-ui/react-\*": "^2.x",
"socket.io-client": "^4.8.1",
"recharts": "^2.15.4",
"next-themes": "^0.4.6",
"js-cookie": "^3.0.5"

---

### **Backend**

API REST construída com **Express**, **Sequelize** e **MySQL**, seguindo o padrão **MVC**.  
Conta com autenticação JWT, filas com **BullMQ**, cache com **Redis**, e documentação via **Swagger**.

**Principais dependências:**

"express": "^5.1.0",
"sequelize": "^6.37.7",
"mysql2": "^3.14.2",
"jsonwebtoken": "^9.0.2",
"bcryptjs": "^3.0.2",
"bullmq": "^5.61.0",
"ioredis": "^5.8.1",
"nodemailer": "^7.0.5",
"swagger-ui-express": "^5.0.1",
"node-cron": "^4.2.1",
"socket.io": "^4.8.1"

---

## 🧩 Estrutura do Projeto

📦 aep-system
├── 📁 backend
│ ├── src
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ └── services/
│ └── swagger/
│
├── 📁 frontend
│ ├── app/
│ ├── components/
│ ├── contexts/
│ ├── hooks/
│ ├── styles/
│ └── utils/
│
└── README.md

---

## ⚙️ Instalação e Execução

2️⃣ Instalar dependências
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3️⃣ Configurar variáveis de ambiente

Crie um arquivo .env no diretório backend com:

PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=aep_db
JWT_SECRET=seu_token_jwt
REDIS_URL=redis://localhost:6379
EMAIL_USER=seu_email@dominio.com
EMAIL_PASS=sua_senha

4️⃣ Rodar os servidores
Backend
npm run dev

Frontend
npm run dev

Acesse:

Frontend → http://localhost:3000

Backend → http://localhost:3333

📖 Documentação da API

Após iniciar o backend, acesse:

http://localhost:3333/api-docs

para visualizar a documentação interativa gerada com Swagger UI.

🧾 Licença

Este projeto é licenciado sob a MIT License
.

👨‍💻 Desenvolvido por Carlos Pedroso

Sistema criado com foco em organização, automação e transparência, oferecendo uma solução moderna para a Associação dos Estudantes Paraisenses.
