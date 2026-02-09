const express = require('express');
const { AnalyticsController } = require('../controllers/AnalyticsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const analyticsController = new AnalyticsController();

router.get('/course/:courseId', authMiddleware, (req, res, next) => analyticsController.getCourseStats(req, res, next));
router.get('/user', authMiddleware, (req, res, next) => analyticsController.getUserStats(req, res, next));
router.get('/revenue', authMiddleware, (req, res, next) => analyticsController.getRevenueStats(req, res, next));

module.exports = router;