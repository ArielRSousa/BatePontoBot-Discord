const { SlashCommandBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relatorio')
        .setDescription('Mostra os registros de ponto'),

    async execute(interaction) {
        try {
            const registros = await Registro.find();

            if (registros.length === 0) {
                return interaction.reply('📌 Nenhum registro de ponto encontrado.');
            }

            let response = '**📋 Relatório de Ponto:**\n';
            registros.forEach(registro => {
                response += `👤 ${registro.username} - 🕒 Entrada: ${registro.entrada ? registro.entrada.toLocaleTimeString() : 'N/A'} | 🕒 Saída: ${registro.saida ? registro.saida.toLocaleTimeString() : 'N/A'}\n`;
            });

            interaction.reply(response);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Erro ao buscar registros.', ephemeral: true });
        }
    }
};
