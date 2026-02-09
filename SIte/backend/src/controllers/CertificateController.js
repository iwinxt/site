const { CertificateService } = require('../services/CertificateService');
const fs = require('fs');

class CertificateController {
    constructor() {
        this.certificateService = new CertificateService();
    }

    async getCertificate(req, res, next) {
        try {
            const userId = req.userId;
            const { courseId } = req.params;

            const filePath = await this.certificateService.getCertificate(userId, courseId);

            res.download(filePath, `certificado.pdf`, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Clean up temp file
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { CertificateController };