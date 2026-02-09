const express = require('express');
const { EnrollmentController } = require('../controllers/EnrollmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const enrollmentController = new EnrollmentController();

router.get('/', authMiddleware, (req, res, next) => enrollmentController.getUserEnrollments(req, res, next));
router.get('/check/:courseId', authMiddleware, (req, res, next) => enrollmentController.checkAccess(req, res, next));

module.exports = router;