const express = require('express');
const { AuthController } = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { strictRateLimitMiddleware } = require('../middleware/rateLimitMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();
const authController = new AuthController();

router.post('/register', strictRateLimitMiddleware, validateRegistration, (req, res, next) => authController.register(req, res, next));
router.post('/login', strictRateLimitMiddleware, validateLogin, (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next));

module.exports = router;