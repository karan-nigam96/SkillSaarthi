const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendSms = require('../utils/smsService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer (Email/Password & Mobile)
// @route   POST /api/customer/register
// @access  Public
const registerCustomer = async (req, res) => {
    const { name, email, password, mobile, address } = req.body;

    try {
        // Enforce Mobile
        if (!mobile) {
            return res.status(400).json({ message: 'Mobile number is required' });
        }

        // Check if customer exists
        const query = { $or: [{ email }, { mobile }] };
        const customerExists = await Customer.findOne(query);

        if (customerExists) {
            return res.status(400).json({ message: 'Customer with this email or mobile already exists' });
        }

        // Hash password
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const customer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            address
        });

        if (customer) {
            res.status(201).json({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile,
                token: generateToken(customer._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid customer data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login customer (Email/Password OR Mobile/OTP)
// @route   POST /api/customer/login
// @access  Public
const loginCustomer = async (req, res) => {
    const { email, password, mobile } = req.body;

    try {
        if (email && password) {
            // Email/Password Login
            const customer = await Customer.findOne({ email });
            if (customer && (await bcrypt.compare(password, customer.password))) {
                res.json({
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    mobile: customer.mobile,
                    token: generateToken(customer._id),
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else if (mobile) {
            // Legacy Mobile/OTP Login (Auto-signup if new)
            let customer = await Customer.findOne({ mobile });

            // Generate Random 4-digit OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            const message = `Your Skill Saarthi Login OTP is: ${otp}. Valid for 10 minutes.`;

            if (!customer) {
                // Create new customer with OTP
                customer = await Customer.create({
                    mobile,
                    otp,
                    otpExpires,
                    name: 'New User'
                });
                await sendSms(mobile, message);
                return res.json({ message: 'OTP sent successfully to your mobile number(New User)', isNewUser: true, mobile });
            } else {
                // Update existing customer otp
                customer.otp = otp;
                customer.otpExpires = otpExpires;
                await customer.save();

                await sendSms(mobile, message);
                return res.json({ message: 'OTP sent successfully to your mobile number', isNewUser: false, mobile });
            }
        } else {
            res.status(400).json({ message: 'Please provide email/password or mobile number' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP & Get Token
// @route   POST /api/customer/verify-otp
// @access  Public
const verifyCustomerOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const customer = await Customer.findOne({ mobile });

        if (!customer) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP matches and is not expired
        if (customer.otp === otp && customer.otpExpires > Date.now()) {

            // Clear OTP after successful verification
            customer.otp = undefined;
            customer.otpExpires = undefined;
            await customer.save();

            const isNewUser = customer.name === 'New User';

            // Admin Check
            const ADMIN_MOBILES = ['9621711801'];
            const isAdmin = ADMIN_MOBILES.includes(mobile);

            res.json({
                _id: customer._id,
                name: customer.name,
                mobile: customer.mobile,
                token: generateToken(customer._id),
                isNewUser,
                isAdmin
            });
        } else {
            res.status(400).json({ message: 'Invalid or Expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Customer Profile
// @route   POST /api/customer/profile (Protected)
// @access  Private
const updateCustomerProfile = async (req, res) => {
    const { name, email, address, mobile } = req.body;

    try {
        const customer = await Customer.findById(req.user.id);

        if (customer) {
            customer.name = name || customer.name;
            customer.email = email || customer.email;
            customer.address = address || customer.address;
            customer.mobile = mobile || customer.mobile; // Allow updating mobile

            const updatedCustomer = await customer.save();

            res.json({
                _id: updatedCustomer._id,
                name: updatedCustomer.name,
                mobile: updatedCustomer.mobile,
                token: generateToken(updatedCustomer._id)
            });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = req.user;
        const ADMIN_MOBILES = ['9621711801'];
        const isAdmin = user.mobile ? ADMIN_MOBILES.includes(user.mobile) : false;

        res.json({
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerCustomer, loginCustomer, verifyCustomerOtp, updateCustomerProfile, getMe };
