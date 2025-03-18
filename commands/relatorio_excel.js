const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Registro = require('../models/Registro');
const ExcelJS = require('exceljs');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relatorio_excel')
        .setDescription('Gera um relatório de ponto em Excel'),

    async execute(interaction) {
        await interaction.deferReply(); 
        
        try {
            const registros = await Registro.find();

            if (registros.length === 0) {
                return interaction.editReply('📌 Nenhum registro de ponto encontrado.');
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Registros de Ponto');

            worksheet.columns = [
                { header: 'Usuário', key: 'username', width: 20 },
                { header: 'Entrada', key: 'entrada', width: 25 },
                { header: 'Saída', key: 'saida', width: 25 },
                { header: 'Tempo Total', key: 'tempo_total', width: 20 }
            ];

            registros.forEach(registro => {
                registro.pontos.forEach(ponto => {
                    let tempoTotal = 'N/A';
                    
                    if (ponto.entrada && ponto.saida) {
                        const diferencaMs = ponto.saida - ponto.entrada;
                        const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
                        const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));
                        tempoTotal = `${horas}h ${minutos}m`;
                    }

                    worksheet.addRow({
                        username: registro.username,
                        entrada: ponto.entrada ? ponto.entrada.toLocaleString("pt-BR") : 'N/A',
                        saida: ponto.saida ? ponto.saida.toLocaleString("pt-BR") : 'N/A',
                        tempo_total: tempoTotal
                    });
                });
            });

            const filePath = `./relatorios/relatorio_ponto.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            const attachment = new AttachmentBuilder(filePath);
            await interaction.editReply({ content: '📊 Aqui está o relatório de ponto:', files: [attachment] });

            setTimeout(() => fs.unlinkSync(filePath), 5000);

        } catch (error) {
            console.error(error);
            interaction.editReply('❌ Erro ao gerar o relatório em Excel.');
        }
    }
};
