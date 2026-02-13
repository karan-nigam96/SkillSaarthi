const express = require('express');
const { getProfile, updateAvailability, updateProfile, getEarnings, getWorkerApplications } = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/availability', protect, updateAvailability);
router.get('/earnings', protect, getEarnings);
router.get('/applications', protect, getWorkerApplications);

module.exports = router;
