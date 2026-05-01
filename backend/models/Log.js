const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userDiscordId: { type: String },
    username: { type: String },
    action: { type: String, required: true },
    details: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
