const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try finding worker first
            let user = await Worker.findById(decoded.id).select('-password');

            // If not found, try finding customer
            if (!user) {
                const Customer = require('../models/Customer');
                user = await Customer.findById(decoded.id);
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
