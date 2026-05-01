require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const User = require('./models/User');
const Log = require('./models/Log');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Bot: MongoDB Connected'))
    .catch(err => console.error(err));

client.on('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

const createLog = async (username, action, details) => {
    const log = new Log({ userDiscordId: 'BOT', username, action, details });
    await log.save();
};

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Comandos de Admin
    if (command === 'addcoins' || command === 'removecoins') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const targetUsername = args[0];
        if (!targetUsername) return message.reply('❌ Debes escribir el nombre de usuario (ej: !addcoins Player1 100).');

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) return message.reply('❌ Cantidad inválida.');

        let userDb = await User.findOne({ username: new RegExp('^' + targetUsername + '$', 'i') });
        if (!userDb) {
            return message.reply('❌ Ese usuario no existe en la página web.');
        }

        if (command === 'addcoins') {
            userDb.coins += amount;
            await userDb.save();
            await createLog(userDb.username, 'Admin - Añadir Monedas', `Se añadieron ${amount} monedas. Modificado por ${message.author.username}`);
            message.reply(`✅ Se han añadido ${amount} monedas a **${userDb.username}**. Saldo actual: ${userDb.coins}`);
        } else {
            if (userDb.coins < amount) {
                userDb.coins = 0;
            } else {
                userDb.coins -= amount;
            }
            await userDb.save();
            await createLog(userDb.username, 'Admin - Quitar Monedas', `Se quitaron ${amount} monedas. Modificado por ${message.author.username}`);
            message.reply(`✅ Se han quitado ${amount} monedas a **${userDb.username}**. Saldo actual: ${userDb.coins}`);
        }
    }

    if (command === 'balance') {
        const targetUsername = args[0];
        if (!targetUsername) return message.reply('❌ Debes indicar un usuario (ej: !balance Player1).');

        const userDb = await User.findOne({ username: new RegExp('^' + targetUsername + '$', 'i') });

        if (!userDb) {
            return message.reply('❌ Ese usuario no existe en la web.');
        }

        message.reply(`💰 El saldo de **${userDb.username}** es de **${userDb.coins}** monedas.`);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
