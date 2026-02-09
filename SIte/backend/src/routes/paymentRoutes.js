const express = require('express');
const { PaymentController } = require('../controllers/PaymentController');
const { VideoController } = require('../controllers/VideoController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const paymentController = new PaymentController();
const videoController = new VideoController();

router.post('/', authMiddleware, (req, res, next) => paymentController.createPayment(req, res, next));
router.get('/:paymentId/status', authMiddleware, (req, res, next) => paymentController.getPaymentStatus(req, res, next));
router.get('/video/:lessonId', authMiddleware, (req, res, next) => videoController.getVideoUrl(req, res, next));

module.exports = router;