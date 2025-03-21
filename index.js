require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const connectDB = require('./database');
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');
const ora = require('ora');
const gradient = require('gradient-string');

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  let colorFunction = gradient.cristal; 

  switch (type.toLowerCase()) {
    case 'info':
      colorFunction = gradient.instagram;
      break;
    case 'success':
      colorFunction = gradient.pastel;
      break;
    case 'error':
      colorFunction = gradient.vice;
      break;
    case 'warning':
      colorFunction = gradient.fruit;
      break;
  }

  console.log(colorFunction(`[${timestamp}] [${type.toUpperCase()}] ${message}`));
}

function createSpinner(text) {
  return ora({
    text,
    color: 'blue'
  });
}

function displayBanner() {
  console.clear();
  console.log('\n');
  const bannerText = figlet.textSync('DISCORD BOT', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  console.log(gradient.pastel.multiline(bannerText));
  console.log(gradient.fruit('========================================'));
  console.log(gradient.fruit('          Bot Initialization           '));
  console.log(gradient.fruit('========================================\n'));
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

async function loadCommands() {
  const spinner = createSpinner('Carregando comandos');
  spinner.start();
  
  try {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    let loadedCount = 0;
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if (!command.data || !command.execute) {
        log('warning', `O comando em ${file} está faltando propriedades obrigatórias.`);
        continue;
      }
      
      client.commands.set(command.data.name, command);
      loadedCount++;
    }
    
    spinner.succeed(`${loadedCount} comandos carregados com sucesso`);
    return loadedCount;
  } catch (error) {
    spinner.fail('Falha ao carregar comandos');
    log('error', `Erro ao carregar comandos: ${error.message}`);
    return 0;
  }
}

async function loadEvents() {
  const spinner = createSpinner('Carregando eventos');
  spinner.start();
  
  try {
    const eventsPath = path.join(__dirname, 'events');
    
    if (!fs.existsSync(eventsPath)) {
      fs.mkdirSync(eventsPath, { recursive: true });
      spinner.warn('Diretório de eventos não encontrado. Um novo foi criado.');
      return 0;
    }
    
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    let loadedCount = 0;
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      
      loadedCount++;
    }
    
    spinner.succeed(`${loadedCount} eventos carregados com sucesso`);
    return loadedCount;
  } catch (error) {
    spinner.fail('Falha ao carregar eventos');
    log('error', `Erro ao carregar eventos: ${error.message}`);
    return 0;
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  
  const { cooldowns } = client;
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  
  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return interaction.reply({ 
        content: `Por favor, aguarde ${timeLeft.toFixed(1)} segundos antes de usar o comando \`${command.data.name}\` novamente.`, 
        ephemeral: true 
      });
    }
  }
  
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  
  try {
    log('info', `Comando "${command.data.name}" executado por ${interaction.user.tag}`);
    await command.execute(interaction);
  } catch (error) {
    log('error', `Erro ao executar o comando ${command.data.name}: ${error.message}`);
    console.error(error);
    
    const errorMessage = 'Ocorreu um erro ao executar este comando!';
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

client.once(Events.ClientReady, () => {
  log('success', `Bot online como ${client.user.tag}!`);
});

process.on('SIGINT', () => {
  log('warning', 'Sinal de interrupção recebido, encerrando...');
  client.destroy();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log('error', `Exceção não tratada: ${error.message}`);
  console.error(error);
});

process.on('unhandledRejection', (error) => {
  log('error', `Promessa rejeitada não tratada: ${error.message}`);
  console.error(error);
});

async function init() {
  displayBanner();
  
  try {
    const dbSpinner = createSpinner('Conectando ao banco de dados');
    dbSpinner.start();
    await connectDB();
    dbSpinner.succeed('Conexão com o banco de dados estabelecida');
    
    await loadCommands();
    await loadEvents();
    
    const loginSpinner = createSpinner('Iniciando sessão no Discord');
    loginSpinner.start();
    
    await client.login(process.env.TOKEN);
    loginSpinner.succeed('Bot conectado com sucesso!');
    
  } catch (error) {
    log('error', `Falha na inicialização: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

init();
