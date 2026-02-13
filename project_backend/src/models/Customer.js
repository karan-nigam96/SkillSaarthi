const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Email login / Google Auth
    password: { type: String }, // For email regular login
    googleId: { type: String, unique: true, sparse: true }, // For Google Auth
    mobile: { type: String, unique: true, sparse: true }, // Made optional (sparse) to allow email-only or google-only
    address: { type: String },
    profilePhoto: { type: String },
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
