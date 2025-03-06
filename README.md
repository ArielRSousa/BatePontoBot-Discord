# 🕒 Bot Bate-Ponto - Discord

Um bot para Discord que permite registrar **horários de entrada e saída** dos usuários, armazenando os dados no **MongoDB**.

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Discord.js v14](https://discord.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📌 Funcionalidades

👉 Registro de **entrada e saída** com `/entrada` e `/saida`  
👉 Comando `/relatorio` para exibir todos os registros  
👉 Armazenamento no **MongoDB**  
👉 Suporte a **Slash Commands**  

---

## 📦 Instalação

### 1️⃣ **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/BatePontoBot-Discord.git
cd BatePontoBot-Discord
```

### 2️⃣ **Instale as dependências**
```bash
npm install
```

### 3️⃣ **Configuração do MongoDB**
Se estiver rodando **localmente**, instale o MongoDB:
```bash
sudo apt install -y mongodb-org
```
Depois, inicie o serviço:
```bash
sudo systemctl start mongod
```

Se for usar **MongoDB Atlas**, crie um banco na nuvem e copie a **URI de conexão**.

---

## ⚙️ Configuração do `.env`

Crie um arquivo **`.env`** na raiz do projeto e preencha com seus dados:

```env
TOKEN=SEU_BOT_TOKEN
CLIENT_ID=SEU_CLIENT_ID
GUILD_ID=SEU_SERVIDOR_ID
MONGO_URI=mongodb://127.0.0.1:27017/bot_ponto  # Ou use a URI do MongoDB Atlas
```

👉 **TOKEN:** Pegue no [Discord Developer Portal](https://discord.com/developers/applications)  
👉 **CLIENT_ID:** ID da aplicação do bot  
👉 **GUILD_ID:** ID do servidor onde os comandos serão testados  
👉 **MONGO_URI:** URL do banco de dados MongoDB  

---

## 🚀 Como Rodar o Bot

### 1️⃣ **Registrar os Slash Commands**
Antes de iniciar o bot, execute:
```bash
node deploy-commands.js
```

### 2️⃣ **Iniciar o bot**
Agora, execute:
```bash
node index.js
```

Se tudo estiver certo, verá:
```
👉 Conectado ao MongoDB!
Bot está online como [Nome do Bot]
```

---

## 📝 Comandos Disponíveis

| Comando       | Descrição |
|--------------|-----------|
| `/entrada`   | Registra o horário de entrada |
| `/saida`     | Registra o horário de saída |
| `/relatorio` | Mostra todos os registros de ponto |

---

## 🎯 Estrutura do Projeto

```
📂 BatePontoBot-Discord/
 ├── 📂 commands/          # Comandos Slash
 │    ├── entrada.js
 │    ├── saida.js
 │    ├── relatorio.js
 ├── 📂 models/            # Modelos do MongoDB
 │    ├── Registro.js
 ├── 📄 index.js           # Código principal do bot
 ├── 📄 deploy-commands.js # Script para registrar os comandos no Discord
 ├── 📄 database.js        # Conexão com o MongoDB
 ├── 📄 .env               # Configurações do ambiente
 ├── 📄 .gitignore         # Ignorar arquivos desnecessários no Git
 ├── 📄 package.json       # Dependências do projeto
 ├── 📄 README.md          # Documentação do projeto
```

---

## 🎯 Próximos Passos

- [ ] Melhorar os logs do bot 💜  
- [ ] Criar um comando `/apagar` para remover registros antigos 🗑️  
- [ ] Criar **relatórios em Excel/PDF** 📊  
- [ ] Criar um sistema de **horários pré-definidos** ⏰  

---

## 🐝 Licença

Este projeto é de código aberto e está licenciado sob a **MIT License**.  

Feito com ❤️ por [Seu Nome](https://github.com/seu-usuario). 🚀

