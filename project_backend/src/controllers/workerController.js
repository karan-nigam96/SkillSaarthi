const Worker = require('../models/Worker');
const ProjectApplication = require('../models/ProjectApplication');

// @desc    Get worker profile
// @route   GET /api/worker/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id).select('-password');
        if (worker) {
            res.json(worker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update worker availability
// @route   PUT /api/worker/availability
// @access  Private
const updateAvailability = async (req, res) => {
    const { isAvailable, mode, slots } = req.body;

    try {
        const worker = await Worker.findById(req.user.id);

        if (worker) {
            worker.isAvailable = isAvailable ?? worker.isAvailable;
            if (mode) worker.availabilityDetails.mode = mode;
            if (slots) worker.availabilityDetails.slots = slots;

            const updatedWorker = await worker.save();
            res.json(updatedWorker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update worker profile
// @route   PUT /api/worker/profile
// @access  Private
const updateProfile = async (req, res) => {
    const { name, skill, experience, location, profilePhoto } = req.body;

    try {
        const worker = await Worker.findById(req.user.id);

        if (worker) {
            worker.name = name || worker.name;
            worker.skill = skill || worker.skill;
            worker.experience = experience || worker.experience;
            worker.location = location || worker.location;
            worker.profilePhoto = profilePhoto || worker.profilePhoto;

            const updatedWorker = await worker.save();
            res.json(updatedWorker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get worker earnings
// @route   GET /api/worker/earnings
// @access  Private
const getEarnings = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id).select('earnings');
        if (worker) {
            res.json(worker.earnings);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get worker applications
// @route   GET /api/worker/applications
// @access  Private
const getWorkerApplications = async (req, res) => {
    try {
        const applications = await ProjectApplication.find({ worker: req.user.id })
            .populate('project')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateAvailability, updateProfile, getEarnings, getWorkerApplications };
