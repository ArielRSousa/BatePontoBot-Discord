const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apagar')
        .setDescription('Apaga registros de ponto.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário cujos registros serão apagados (Apenas para admins)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('todos')
                .setDescription('Digite "CONFIRMAR" para apagar todos os registros (Apenas para admins)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), 

    async execute(interaction) {
        const usuarioSelecionado = interaction.options.getUser('usuario');
        const apagarTodos = interaction.options.getString('todos');
        const userId = interaction.user.id;
        const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);

        try {
            if (apagarTodos === "CONFIRMAR") {
                if (!isAdmin) {
                    return interaction.reply({ content: "❌ Apenas administradores podem apagar todos os registros.", ephemeral: true });
                }

                await Registro.deleteMany({});
                
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("🗑️ Todos os registros foram apagados!")
                    .setDescription("Todos os registros de ponto foram removidos do banco de dados.")
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            if (usuarioSelecionado) {
                if (!isAdmin) {
                    return interaction.reply({ content: "❌ Apenas administradores podem apagar registros de outros usuários.", ephemeral: true });
                }

                await Registro.deleteMany({ userId: usuarioSelecionado.id });

                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("🗑️ Registros Apagados!")
                    .setDescription(`Os registros de **${usuarioSelecionado.username}** foram removidos.`)
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            await Registro.deleteMany({ userId });

            const embed = new EmbedBuilder()
                .setColor("#ffcc00")
                .setTitle("🗑️ Seus registros foram apagados!")
                .setDescription("Todos os seus registros de ponto foram removidos.")
                .setTimestamp();

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: "❌ Erro ao apagar registros.", ephemeral: true });
        }
    }
};
