const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    price: Number,
    ticketNumber: { type: String, unique: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
