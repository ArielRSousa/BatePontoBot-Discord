const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

            if (!registro) {
                registro = new Registro({ userId, username, pontos: [] });
            }

            registro.pontos.push({ entrada: now, saida: null });
            await registro.save();

            const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("✅ Entrada Registrada!")
                .setDescription(`Olá, **${username}**! Seu horário de entrada foi registrado.`)
                .addFields(
                    { name: "🕒 Horário", value: `${now.toLocaleTimeString("pt-BR")}`, inline: true },
                    { name: "📅 Data", value: `${now.toLocaleDateString("pt-BR")}`, inline: true }
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
