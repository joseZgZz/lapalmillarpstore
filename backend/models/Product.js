const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: 'https://via.placeholder.com/150' }, // Cover image
    images: { type: [String], default: [] }, // Additional gallery images
    category: { type: String, default: 'VIP' },
    qbcoreItem: { type: String, default: '' }, // New field for FiveM integration
});

module.exports = mongoose.model('Product', productSchema);
