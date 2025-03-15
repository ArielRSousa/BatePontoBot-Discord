require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const connectDB = require('./database'); 
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Carregar comandos
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Evento para receber interações de comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erro ao executar este comando!', ephemeral: true });
    }
});

// Conectar ao banco de dados e iniciar o bot
(async () => {
    await connectDB();
    client.login(process.env.TOKEN);
})();
