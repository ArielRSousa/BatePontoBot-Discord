const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');
const moment = require('moment');

const horarios = {
    saida: { inicio: '17:00', fim: '18:00' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saida')
        .setDescription('Registra o horário de saída'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = new Date();
        const horarioAtual = moment();
        const inicio = moment(horarios.saida.inicio, 'HH:mm');
        const fim = moment(horarios.saida.fim, 'HH:mm');

        let status = '';
        let cor = '#00ff00';

        if (horarioAtual.isBefore(inicio)) {
            status = '⚠️ Você está saindo **mais cedo**.';
            cor = '#ffcc00';
        } else if (horarioAtual.isAfter(fim)) {
            status = '💪 Você ficou além do expediente!';
            cor = '#9966ff';
        } else {
            status = '✅ Você saiu no horário.';
        }

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
                    .setDescription("Use `/entrada` antes de registrar uma nova saída.")
                    .setTimestamp();

                return interaction.reply({ embeds: [embedErro], ephemeral: true });
            }

            ultimoPonto.saida = now;
            await registro.save();

            const embedSucesso = new EmbedBuilder()
                .setColor(cor)
                .setTitle("✅ Saída Registrada!")
                .setDescription("Seu horário de saída foi registrado com sucesso.")
                .addFields(
                    { name: "🕒 Horário", value: now.toLocaleTimeString("pt-BR"), inline: true },
                    { name: "📅 Data", value: now.toLocaleDateString("pt-BR"), inline: true },
                    { name: "📌 Status", value: status }
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
