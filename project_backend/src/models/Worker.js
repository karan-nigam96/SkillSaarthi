const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true, // Made optional
    },
    skill: {
        type: String, // e.g., 'Plumber', 'Electrician'
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    availabilityDetails: {
        type: {
            mode: { type: String, enum: ['Full Day', 'Half Day', 'Specific Hours'], default: 'Full Day' },
            slots: [String], // e.g., ['Morning', 'Evening']
        },
        default: { mode: 'Full Day', slots: [] }
    },
    earnings: {
        walletBalance: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 }
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            customerName: String,
            rating: Number,
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    profilePhoto: {
        type: String, // URL
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
