const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Most Booked', 'Repair', 'Cleaning'
    rating: { type: String, default: '4.8 (1k)' },
    price: { type: String },
    originalPrice: { type: String },
    originalPrice: { type: String },
    image: { type: String, required: true },
    isPopular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
