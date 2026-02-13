const Job = require('../models/Job');
const Worker = require('../models/Worker');

// @desc    Get jobs for logged in worker (based on skill & location)
// @route   GET /api/jobs/worker
// @access  Private
const getWorkerJobs = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id);

        // Find pending jobs that match worker's skill and (optionally) location
        // For demo, we just match skill
        const jobs = await Job.find({
            serviceType: worker.skill,
            status: 'Pending'
        }).sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept or Reject a job
// @route   PUT /api/jobs/:id/status
// @access  Private
const updateJobStatus = async (req, res) => {
    const { status } = req.body; // 'Accepted', 'Rejected', 'Completed'

    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (status === 'Accepted') {
            job.assignedWorker = req.user.id;
            job.status = 'Accepted';
        } else {
            job.status = status;
        }

        await job.save();
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a dummy job (for testing)
// @route   POST /api/jobs/seed
// @access  Public
const seedJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getWorkerJobs, updateJobStatus, seedJob };
