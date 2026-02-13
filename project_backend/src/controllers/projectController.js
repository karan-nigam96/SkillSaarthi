const Project = require('../models/Project');
const ProjectApplication = require('../models/ProjectApplication');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed projects
// @route   POST /api/projects/seed
// @access  Public
const seedProjects = async (req, res) => {
    try {
        await Project.deleteMany({});
        const projects = await Project.insertMany(req.body);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply for a project
// @route   POST /api/projects/apply
// @access  Private
const applyForProject = async (req, res) => {
    const { projectId } = req.body;
    const workerId = req.user.id; // Assumes protect middleware adds user to req

    try {
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if already applied
        const existingApplication = await ProjectApplication.findOne({
            project: projectId,
            worker: workerId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this project' });
        }

        const application = await ProjectApplication.create({
            project: projectId,
            worker: workerId
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Public (for now, or Private for admin)
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Public (for now, or Private for admin)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.role = req.body.role || project.role;
            project.company = req.body.company || project.company;
            project.location = req.body.location || project.location;
            project.workers = req.body.workers || project.workers;
            project.projectType = req.body.projectType || project.projectType;
            project.workType = req.body.workType || project.workType;
            project.rate = req.body.rate || project.rate;
            project.subtitle = req.body.subtitle || project.subtitle;
            project.tags = req.body.tags || project.tags;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProjects, seedProjects, applyForProject, createProject, updateProject, deleteProject };
