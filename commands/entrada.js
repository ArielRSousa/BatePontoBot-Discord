const { SlashCommandBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('entrada')
        .setDescription('Registra o horário de entrada'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const now = new Date();

        try {
            let registro = await Registro.findOne({ userId });

            if (registro) {
                return interaction.reply({ content: `❌ Você já registrou sua entrada às ${registro.entrada.toLocaleTimeString()}.`, ephemeral: true });
            }

            registro = new Registro({ userId, username, entrada: now });
            await registro.save();

            interaction.reply(`✅ ${username}, sua entrada foi registrada às ${now.toLocaleTimeString()} no dia ${now.toLocaleDateString("pt-br")}.`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Erro ao registrar entrada.', ephemeral: true });
        }
    }
};
