const express = require('express');
const { CourseController } = require('../controllers/CourseController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const courseController = new CourseController();

router.get('/', authMiddleware, (req, res, next) => courseController.list(req, res, next));
router.get('/trails', authMiddleware, (req, res, next) => courseController.getTrails(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => courseController.getById(req, res, next));

module.exports = router;