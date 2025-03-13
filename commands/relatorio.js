const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relatorio')
        .setDescription('Mostra os registros de ponto com tempo total trabalhado'),

    async execute(interaction) {
        try {
            const registros = await Registro.find();

            if (registros.length === 0) {
                return interaction.reply({ content: '📌 Nenhum registro de ponto encontrado.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle("📋 Relatório de Ponto")
                .setColor("#0099ff")
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            registros.forEach(registro => {
                let pontosTexto = "";

                registro.pontos.forEach(ponto => {
                    const entradaFormatada = ponto.entrada ? ponto.entrada.toLocaleString("pt-BR") : "N/A";
                    const saidaFormatada = ponto.saida ? ponto.saida.toLocaleString("pt-BR") : "N/A";

                    let tempoTotal = "N/A";
                    if (ponto.entrada && ponto.saida) {
                        const diferencaMs = ponto.saida - ponto.entrada;
                        const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
                        const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));

                        tempoTotal = `⏳ ${horas}h ${minutos}m`;
                    }

                    pontosTexto += `🕒 **Entrada:** ${entradaFormatada}\n🕒 **Saída:** ${saidaFormatada}\n${tempoTotal}\n\n`;
                });

                embed.addFields({
                    name: `👤 ${registro.username}`,
                    value: pontosTexto,
                    inline: false
                });
            });

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Erro ao buscar registros.', ephemeral: true });
        }
    }
};
