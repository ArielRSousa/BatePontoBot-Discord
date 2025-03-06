const { SlashCommandBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saida')
        .setDescription('Registra o horário de saída'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = new Date();

        try {
            let registro = await Registro.findOne({ userId });

            if (!registro) {
                return interaction.reply({ content: `❌ Você ainda não registrou sua entrada!`, ephemeral: true });
            }

            if (registro.saida) {
                return interaction.reply({ content: `❌ Você já registrou sua saída às ${registro.saida.toLocaleTimeString()}.`, ephemeral: true });
            }

            registro.saida = now;
            await registro.save();

            interaction.reply(`✅ Sua saída foi registrada às ${now.toLocaleTimeString()}`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Erro ao registrar saída.', ephemeral: true });
        }
    }
};
