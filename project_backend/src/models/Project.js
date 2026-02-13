const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    workers: { type: Number, required: true },
    projectType: { type: String, required: true }, // e.g., 'Commercial Complex'
    workType: { type: String, required: true }, // e.g., 'Full-time'
    rate: { type: String, required: true }, // e.g., '₹800/day'
    subtitle: { type: String }, // e.g., 'Tricon'
    tags: [String], // e.g., ['Urgent hiring']
    image: { type: String }, // Admin uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
