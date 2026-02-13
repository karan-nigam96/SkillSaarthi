const SiteContent = require('../models/SiteContent');

// @desc    Get all site content
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res) => {
    try {
        const content = await SiteContent.find({});
        // Convert to map for easier frontend usage: { sectionId: imageUrl }
        const contentMap = content.reduce((acc, item) => {
            acc[item.sectionId] = item;
            return acc;
        }, {});
        res.json(contentMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllContent };
