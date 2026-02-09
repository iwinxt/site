const express = require('express');
const { ProgressController } = require('../controllers/ProgressController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateProgressUpdate } = require('../middleware/validationMiddleware');

const router = express.Router();
const progressController = new ProgressController();

router.post('/', authMiddleware, validateProgressUpdate, (req, res, next) => progressController.updateProgress(req, res, next));
router.get('/course/:courseId', authMiddleware, (req, res, next) => progressController.getProgress(req, res, next));
router.get('/lesson/:lessonId', authMiddleware, (req, res, next) => progressController.getLessonProgress(req, res, next));

module.exports = router;