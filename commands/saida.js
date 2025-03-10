const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
                const embedErro = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("❌ Nenhuma entrada registrada!")
                    .setDescription("Você ainda **não registrou sua entrada**. Use `/entrada` primeiro.")
                    .setFooter({ text: "Registre sua entrada antes de marcar saída." })
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            if (registro.saida) {
                const embedErro = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("❌ Saída já registrada!")
                    .setDescription(`Você já registrou sua saída às **${registro.saida.toLocaleTimeString("pt-BR")}** no dia **${registro.saida.toLocaleDateString("pt-BR")}**.`)
                    .setFooter({ text: "Se precisar corrigir, fale com um administrador." })
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            registro.saida = now;
            await registro.save();

            const embedSucesso = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("✅ Saída Registrada!")
                .setDescription("Seu horário de saída foi registrado com sucesso.")
                .addFields(
                    { name: "🕒 Horário", value: `${now.toLocaleTimeString("pt-BR")}`, inline: true },
                    { name: "📅 Data", value: `${now.toLocaleDateString("pt-BR")}`, inline: true }
                )
                .setFooter({ text: "Bom descanso! 😃" })
                .setTimestamp();

            interaction.reply({ embeds: [embedSucesso] });

        } catch (error) {
            console.error(error);

            const embedErro = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("❌ Erro ao registrar saída!")
                .setDescription("Ocorreu um erro ao tentar registrar sua saída. Tente novamente mais tarde.")
                .setTimestamp();

            interaction.reply({ embeds: [embedErro], ephemeral: true });
        }
    }
};
