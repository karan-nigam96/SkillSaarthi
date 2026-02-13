const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendSms = require('../utils/smsService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new worker (Email/Password)
// @route   POST /api/auth/worker/register
// @access  Public
const registerWorker = async (req, res) => {
    const { name, email, password, mobile, skill, experience, location } = req.body;

    try {
        // Enforce Mobile
        if (!mobile) {
            return res.status(400).json({ message: 'Mobile number is required' });
        }

        // Check if worker exists (by email or mobile)
        const query = { $or: [{ email }, { mobile }] };
        const workerExists = await Worker.findOne(query);

        if (workerExists) {
            return res.status(400).json({ message: 'Worker with this email or mobile already exists' });
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const worker = await Worker.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            skill,
            experience,
            location
        });

        if (worker) {
            res.status(201).json({
                _id: worker._id,
                name: worker.name,
                email: worker.email,
                mobile: worker.mobile,
                token: generateToken(worker._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid worker data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login worker (Email/Password OR Mobile/OTP)
// @route   POST /api/auth/worker/login
// @access  Public
const loginWorker = async (req, res) => {
    const { email, password, mobile } = req.body;

    try {
        if (email && password) {
            // Email/Password Login
            const worker = await Worker.findOne({ email });
            if (worker && (await bcrypt.compare(password, worker.password))) {
                res.json({
                    _id: worker._id,
                    name: worker.name,
                    email: worker.email,
                    mobile: worker.mobile,
                    token: generateToken(worker._id),
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else if (mobile) {
            // Legacy Mobile/OTP Login
            const worker = await Worker.findOne({ mobile });
            if (!worker) {
                return res.status(404).json({ message: 'Worker not found' });
            }
            // Send OTP (mock/SMS)
            const fixedOtp = '1234';
            const message = `Your Skill Saarthi Worker Login OTP is: ${fixedOtp}`;
            await sendSms(mobile, message);
            res.json({ message: 'OTP sent successfully', mobile });
        } else {
            res.status(400).json({ message: 'Please provide email/password or mobile number' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP (Legacy)
// @route   POST /api/auth/worker/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        if (otp == '1234') {
            const worker = await Worker.findOne({ mobile });
            if (worker) {
                res.json({
                    _id: worker._id,
                    name: worker.name,
                    mobile: worker.mobile,
                    token: generateToken(worker._id),
                });
            } else {
                res.status(404).json({ message: 'Worker not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerWorker, loginWorker, verifyOtp };
