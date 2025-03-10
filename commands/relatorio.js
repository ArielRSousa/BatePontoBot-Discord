const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relatorio')
        .setDescription('Mostra os registros de ponto'),

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
                const entradaFormatada = registro.entrada 
                    ? registro.entrada.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) 
                    : "N/A";
                const saidaFormatada = registro.saida 
                    ? registro.saida.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) 
                    : "N/A";

                embed.addFields({
                    name: `👤 ${registro.username}`,
                    value: `🕒 **Entrada:** ${entradaFormatada}\n🕒 **Saída:** ${saidaFormatada}`,
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
