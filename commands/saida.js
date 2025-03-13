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

            if (!registro || registro.pontos.length === 0) {
                const embedErro = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("❌ Nenhuma entrada registrada!")
                    .setDescription("Você ainda **não registrou sua entrada**. Use `/entrada` primeiro.")
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            let ultimoPonto = registro.pontos.find(p => !p.saida);

            if (!ultimoPonto) {
                const embedErro = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("❌ Todas as entradas já possuem saída!")
                    .setDescription("Você já registrou todas as suas saídas. Use `/entrada` antes de registrar uma nova saída.")
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            ultimoPonto.saida = now;
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
            interaction.reply({ content: '❌ Erro ao registrar saída.', ephemeral: true });
        }
    }
};
