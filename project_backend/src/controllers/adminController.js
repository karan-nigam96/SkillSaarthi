const Service = require('../models/Service');
const Project = require('../models/Project');
const SiteContent = require('../models/SiteContent');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Files will be saved in the 'uploads' directory
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create unique filename: fieldname-timestamp.ext
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

// @desc    Upload Image and Update Entity
// @route   POST /api/admin/upload
// @access  Private (Admin)
const uploadImage = async (req, res) => {
    console.log('[DEBUG] Upload Image Request Received');
    console.log('[DEBUG] Body:', req.body);
    console.log('[DEBUG] File:', req.file);

    try {
        if (!req.file) {
            console.log('[DEBUG] No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type, id } = req.body; // type: 'service' or 'project'
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        if (type === 'service') {
            const service = await Service.findById(id);
            if (service) {
                service.image = imageUrl;
                await service.save();
                return res.json({ message: 'Service image updated', imageUrl });
            }
            return res.status(404).json({ message: 'Service not found' });
        }

        if (type === 'project') {
            const project = await Project.findById(id);
            if (project) {
                project.image = imageUrl;
                await project.save();
                return res.json({ message: 'Project image updated', imageUrl });
            }
            return res.status(404).json({ message: 'Project not found' });
        }

        if (type === 'site_content') {
            // id here will be the unique sectionKey string (e.g. 'construction_game')
            let content = await SiteContent.findOne({ sectionId: id });
            if (!content) {
                content = new SiteContent({ sectionId: id });
            }
            content.imageUrl = imageUrl;
            await content.save();
            return res.json({ message: 'Content image updated', imageUrl });
        }

        return res.status(400).json({ message: 'Invalid type' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { upload, uploadImage };
