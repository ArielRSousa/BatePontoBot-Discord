const mongoose = require('mongoose');
const logger = require('./utils/logger');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✅ Conexão ao MongoDB estabelecida!');
    } catch (error) {
        logger.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1); 
    }
}

module.exports = connectDB; 