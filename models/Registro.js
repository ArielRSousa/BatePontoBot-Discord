const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    entrada: {
        type: Date,
    },
    saida: {
        type: Date,
    }});

module.exports = mongoose.model('Registro', registroSchema);