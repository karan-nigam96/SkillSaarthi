const express = require('express');
const { registerWorker, loginWorker, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/worker/register', registerWorker);
router.post('/worker/login', loginWorker);
router.post('/worker/verify-otp', verifyOtp);

module.exports = router;
