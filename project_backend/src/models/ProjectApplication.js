const mongoose = require('mongoose');

const projectApplicationSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'accepted', 'rejected'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectApplication', projectApplicationSchema);
