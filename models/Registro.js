const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    userId: String,
    username: String,
    pontos: [
        {
            entrada: Date,
            saida: Date
        }
    ]
});

module.exports = mongoose.model('Registro', registroSchema);
