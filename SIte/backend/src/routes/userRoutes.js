const express = require('express');
const { UserController } = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const userController = new UserController();

router.get('/profile', authMiddleware, (req, res, next) => userController.getProfile(req, res, next));
router.put('/profile', authMiddleware, (req, res, next) => userController.updateProfile(req, res, next));
router.post('/change-password', authMiddleware, (req, res, next) => userController.changePassword(req, res, next));
router.delete('/account', authMiddleware, (req, res, next) => userController.deleteAccount(req, res, next));

module.exports = router;