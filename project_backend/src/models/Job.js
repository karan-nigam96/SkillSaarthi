const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String, // e.g., 'Plumber'
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending',
    },
    assignedWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    price: {
        type: Number,
    },
    scheduledTime: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
