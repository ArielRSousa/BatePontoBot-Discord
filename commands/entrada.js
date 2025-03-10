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

            if (registro) {
                const embedErro = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("❌ Entrada já registrada!")
                    .setDescription(`Você já registrou sua entrada às **${registro.entrada.toLocaleTimeString("pt-BR")}** no dia **${registro.entrada.toLocaleDateString("pt-BR")}**.`)
                    .setFooter({ text: "Se precisar corrigir, fale com um administrador." })
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            registro = new Registro({ userId, username, entrada: now });
            await registro.save();

            const embedSucesso = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("✅ Entrada Registrada!")
                .setDescription(`Olá, **${username}**! Seu horário de entrada foi registrado com sucesso.`)
                .addFields(
                    { name: "🕒 Horário", value: `${now.toLocaleTimeString("pt-BR")}`, inline: true },
                    { name: "📅 Data", value: `${now.toLocaleDateString("pt-BR")}`, inline: true }
                )
                .setFooter({ text: "Bom trabalho! 👍" })
                .setTimestamp();

            interaction.reply({ embeds: [embedSucesso] });
        } catch (error) {
            console.error(error);

            const embedErro = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("❌ Erro ao registrar entrada!")
                .setDescription("Ocorreu um erro ao tentar registrar sua entrada. Tente novamente mais tarde.")
                .setTimestamp();

            interaction.reply({ embeds: [embedErro], ephemeral: true });
        }
    }
};
