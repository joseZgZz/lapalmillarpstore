const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true },
    avatar: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=random' },
    coins: { type: Number, default: 0 },
    role: { type: String, default: 'user' },
    platform: { type: String, enum: ['PC', 'Consola'], default: 'PC' }
});

module.exports = mongoose.model('User', userSchema);
