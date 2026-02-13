const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const services = await Service.find(query);
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed services
// @route   POST /api/services/seed
// @access  Public
const seedServices = async (req, res) => {
    try {
        await Service.deleteMany({});
        const services = await Service.insertMany(req.body);
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getServices, seedServices };
