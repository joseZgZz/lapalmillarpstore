require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const Log = require('./models/Log');
const Announcement = require('./models/Announcement');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Requires admin privileges' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Utils
const sendDiscordLog = async (logData) => {
    if (!process.env.DISCORD_WEBHOOK_URL) return;
    try {
        await axios.post(process.env.DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: 'Nuevo Registro de Web',
                description: `**Acción:** ${logData.action}\n**Usuario:** ${logData.username}\n**Detalles:** ${logData.details}`,
                color: 16711680,
                timestamp: new Date()
            }]
        });
    } catch (err) {
        console.error('Error sending discord webhook:', err.message);
    }
};

const createLog = async (username, action, details) => {
    const log = new Log({ userDiscordId: 'WEB', username, action, details });
    await log.save();
    await sendDiscordLog({ username, action, details });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, birthdate } = req.body;

        if (!username || !email || !password || !birthdate) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'El email o usuario ya está en uso' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            birthdate,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`
        });

        await newUser.save();
        await createLog(newUser.username, 'Registro', `Se ha creado una nueva cuenta (${newUser.email}).`);

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({ token, message: 'Registro exitoso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({ token, message: 'Inicio de sesión exitoso' });
    } catch (err) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// --- API ROUTES ---
app.get('/api/user/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

app.get('/api/products', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

app.post('/api/products/buy/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.coins < product.price) {
            return res.status(400).json({ error: 'Insufficient coins' });
        }

        user.coins -= product.price;
        await user.save();

        await createLog(user.username, 'Compra', `Ha comprado ${product.name} por ${product.price} monedas.`);

        res.json({ message: 'Purchase successful', user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Admin routes ---
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/users/add-coins/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.coins += parseInt(amount);
        await user.save();

        await createLog('ADMIN', 'Coins Grant', `Admin ha otorgado ${amount} monedas a ${user.username}.`);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/users/manage-coins', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { username, amount, action } = req.body;
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const change = parseInt(amount);
        if (action === 'add') user.coins += change;
        else user.coins = Math.max(0, user.coins - change);

        await user.save();
        await createLog('ADMIN', 'Manual Balance Adjustment', `Admin ha ${action === 'add' ? 'añadido' : 'quitado'} ${amount} monedas a ${user.username}.`);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        await createLog('ADMIN', 'User Deletion', `Admin ha eliminado la cuenta de ${user.username}.`);
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/logs', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const logs = await Log.find().sort({ date: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        const newProduct = new Product({ name, description, price, image, category });
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Announcements routes ---
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/announcements', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, content, category, color } = req.body;
        const newAnnouncement = new Announcement({ title, content, category, color });
        await newAnnouncement.save();
        res.json(newAnnouncement);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/announcements/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
