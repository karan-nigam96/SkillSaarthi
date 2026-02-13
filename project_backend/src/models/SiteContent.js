const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
    sectionId: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title: String,
    description: String
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
