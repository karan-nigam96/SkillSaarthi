const express = require('express');
const { getWorkerJobs, updateJobStatus, seedJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/worker', protect, getWorkerJobs);
router.put('/:id/status', protect, updateJobStatus);
router.post('/seed', seedJob); // Helper to create jobs

module.exports = router;
