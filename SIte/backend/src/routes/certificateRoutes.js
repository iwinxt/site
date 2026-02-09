const express = require('express');
const { CertificateController } = require('../controllers/CertificateController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const certificateController = new CertificateController();

router.get('/:courseId', authMiddleware, (req, res, next) => certificateController.getCertificate(req, res, next));

module.exports = router;