const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');
const moment = require('moment');

const horarios = {
    entrada: { inicio: '08:00', fim: '09:00' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('entrada')
        .setDescription('Registra o horário de entrada'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const now = new Date();
        const horarioAtual = moment();
        const inicio = moment(horarios.entrada.inicio, 'HH:mm');
        const fim = moment(horarios.entrada.fim, 'HH:mm');

        let status = '';
        let cor = '#00ff00';

        if (horarioAtual.isBefore(inicio)) {
            status = '⏱️ Você chegou **adiantado**!';
            cor = '#33ccff';
        } else if (horarioAtual.isAfter(fim)) {
            status = '⚠️ Você chegou **atrasado**!';
            cor = '#ff9900';
        } else {
            status = '✅ Você chegou **no horário certo**!';
        }

        try {
            let registro = await Registro.findOne({ userId });

            if (!registro) {
                registro = new Registro({ userId, username, pontos: [] });
            }

            registro.pontos.push({ entrada: now, saida: null });
            await registro.save();

            const embed = new EmbedBuilder()
                .setColor(cor)
                .setTitle("✅ Entrada Registrada!")
                .setDescription(`Olá, **${username}**! Seu horário de entrada foi registrado.`)
                .addFields(
                    { name: "🕒 Horário", value: now.toLocaleTimeString("pt-BR"), inline: true },
                    { name: "📅 Data", value: now.toLocaleDateString("pt-BR"), inline: true },
                    { name: "📌 Status", value: status }
                )
                .setFooter({ text: "Bom trabalho! 👍" })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Erro ao registrar entrada.', ephemeral: true });
        }
    }
};
