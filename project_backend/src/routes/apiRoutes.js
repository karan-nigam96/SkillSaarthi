const express = require('express');
const { getServices, seedServices } = require('../controllers/serviceController');
const { getProjects, seedProjects, applyForProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { registerCustomer, loginCustomer, verifyCustomerOtp, updateCustomerProfile, getMe } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const { upload, uploadImage } = require('../controllers/adminController');
const { getAllContent } = require('../controllers/contentController');

const router = express.Router();

router.get('/services', getServices);
router.post('/services/seed', seedServices);

router.get('/projects', getProjects);
router.post('/projects/seed', seedProjects);
router.post('/projects/add', createProject); // Using /add simply for specificity from user request, or just POST /projects
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.post('/projects/apply', protect, applyForProject);

// Customer Auth
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.post('/customer/verify-otp', verifyCustomerOtp);
router.post('/customer/profile', protect, updateCustomerProfile);
router.get('/auth/me', protect, getMe);

// Site Content
router.get('/content', getAllContent);

// Admin Routes
router.post('/admin/upload', protect, upload.single('image'), uploadImage);

module.exports = router;
